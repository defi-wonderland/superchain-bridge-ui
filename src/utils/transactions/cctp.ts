import { Address, Chain, Hex, keccak256, parseAbi, parseEventLogs } from 'viem';

import { CCTPData, CustomClients } from '~/types';
import { bytes20ToBytes32 } from '~/utils';

const depositForBurnAbi = parseAbi([
  'function depositForBurn(uint256 amount, uint32 destinationDomain, bytes32 mintRecipient, address burnToken) external returns (uint64 _nonce)',
]);
const messageTransmitterAbi = parseAbi(['function receiveMessage(bytes message, bytes signature) external']);

const burnLimitsPerMessageAbi = parseAbi(['function burnLimitsPerMessage(address) external view returns (uint256)']);

interface BurnUSDCParams {
  customClient: CustomClients;
  userAddress: Address;
  usdcAddress: Address;
  amount: bigint;
  allowance: string;
  approve: (spender: string) => Promise<void>;
  data: CCTPData;
}
export const depositForBurn = async ({
  customClient,
  userAddress,
  usdcAddress,
  amount,
  allowance,
  approve,
  data,
}: BurnUSDCParams) => {
  if (!amount) throw new Error('amount cannot be 0');
  const { tokenMessenger, tokenMinter } = data[customClient.from.public.chain!.id];
  const destinationDomain = data[customClient.to.public.chain!.id].domain;

  const maxBurnAmount = await customClient.from.public.readContract({
    address: tokenMinter,
    abi: burnLimitsPerMessageAbi,
    functionName: burnLimitsPerMessageAbi[0].name,
    args: [usdcAddress],
  });

  // Check amount is not higher
  if (amount > maxBurnAmount) {
    throw new Error('Amount exceeds limit');
  }

  if (BigInt(allowance) < amount) {
    await approve(tokenMessenger);
  }

  const mintRecipient = bytes20ToBytes32(userAddress);
  const { request } = await customClient.from.public.simulateContract({
    address: tokenMessenger,
    abi: depositForBurnAbi,
    functionName: depositForBurnAbi[0].name,
    args: [amount, destinationDomain, mintRecipient, usdcAddress],
    account: userAddress,
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  if (!hash) throw new Error('No hash returned');

  const receipt = await customClient.from.public.waitForTransactionReceipt({
    hash,
  });

  console.log({ sourceReceipt: receipt });

  const [log] = parseEventLogs({
    abi: parseAbi(['event MessageSent(bytes message)']),
    eventName: 'MessageSent',
    logs: receipt.logs,
  });

  const message = log.args.message;
  const messageHash = keccak256(message);

  let attestation: Hex = '0x';
  let attestationResponse = { status: 'pending', attestation: '' };
  while (attestationResponse.status != 'complete') {
    const response = await fetch(`https://iris-api-sandbox.circle.com/attestations/${messageHash}`);
    attestationResponse = await response.json();
    console.log({ attestationResponse });
    attestation = attestationResponse.attestation as Hex;
    await new Promise((r) => setTimeout(r, 2000));
  }

  return { message, attestation };
};

interface ReceiveMessageParams {
  customClient: CustomClients;
  userAddress: Address;
  message: Hex;
  attestation: Hex;
  destinationChain?: Chain;
  data: CCTPData;
}
export const receiveMessage = async ({
  customClient,
  userAddress,
  message,
  attestation,
  data,
}: ReceiveMessageParams) => {
  const { messageTransmitter } = data[customClient.to.public.chain!.id];

  const { request } = await customClient.to.public.simulateContract({
    address: messageTransmitter, // in destination chain
    abi: messageTransmitterAbi,
    functionName: messageTransmitterAbi[0].name,
    args: [message, attestation],
    account: userAddress,
    chain: customClient.to.public.chain,
  });

  const hash = await customClient.from.wallet?.writeContract(request);

  if (!hash) throw new Error('No hash returned');

  const receipt = await customClient.to.public.waitForTransactionReceipt({
    hash,
  });

  console.log({ destinationReceipt: receipt });
};
