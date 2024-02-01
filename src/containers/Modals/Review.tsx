import { Box, Button, styled } from '@mui/material';
import { Address, Hex, PublicClient } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';
import { useChainId, useSwitchChain, useWriteContract } from 'wagmi';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useCustomClient, useTokenList, useChain } from '~/hooks';
import { L1CrossDomainMessengerProxy, L1StandardBridgeProxy, bridgeERC20ToABI, sendMessageABI } from '~/utils';
import { ModalType, TransactionType } from '~/types';

export const ReviewModal = () => {
  const { transactionType, mint, userAddress, data } = useTransactionData();
  const { toTokens } = useTokenList();
  const { toChain, fromChain } = useChain();
  const { customClient } = useCustomClient();
  const { selectedToken, amount, allowance, approve, parseTokenUnits } = useToken();
  const { writeContractAsync } = useWriteContract();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();

  // temporary function, will be removed
  const depositETH = async () => {
    // Deposit
    const args = await customClient.to.public.buildDepositTransaction({
      mint: parseTokenUnits(mint),
      to: userAddress,
      chain: customClient.to.wallet.chain,
    });

    // temporary any, typings from viem are kinda broken
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hash = await customClient.from.wallet?.depositTransaction(args as any);

    const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

    // temporary log
    console.log(l2Receipt);
  };

  // temporary function, will be removed
  const depositERC20 = async () => {
    if (BigInt(allowance) < parseTokenUnits(amount)) {
      await approve();
    }
    const l1TokenAddress = selectedToken?.address as Address;
    const extraData = '0x';
    const l2Token = toTokens.find((token) => token.symbol === selectedToken?.symbol && token.chainId === toChain.id);
    const l2TokenAddress = l2Token?.address as Address;

    // temporary fixed value
    const minGasLimit = 132303;

    const hash = await writeContractAsync({
      address: L1StandardBridgeProxy,
      abi: bridgeERC20ToABI,
      functionName: 'bridgeERC20To',
      args: [l1TokenAddress, l2TokenAddress, userAddress!, parseTokenUnits(amount), Number(minGasLimit), extraData],
    });

    const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

    // temporary log
    console.log(l2Receipt);
  };

  const depositMessage = async () => {
    // temporary fixed values
    const targetAddress = userAddress!;
    const message = data as Hex;
    const minGasLimit = 200_000;

    const hash = await writeContractAsync({
      address: L1CrossDomainMessengerProxy,
      abi: sendMessageABI,
      functionName: 'sendMessage',
      args: [targetAddress, message, minGasLimit],
    });

    const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

    // temporary log
    console.log(l2Receipt);
  };

  const initiateETHWithdraw = async () => {
    if (!userAddress) return;
    const args = await customClient.to.public.buildInitiateWithdrawal({
      account: userAddress,
      to: userAddress,
      value: parseTokenUnits(mint),
      chain: customClient.from.public.chain,
    });

    // Execute the initiate withdrawal transaction on the L2.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hash = await customClient.from.wallet?.initiateWithdrawal(args as any);

    if (!hash) throw new Error('No hash returned');

    // Wait for the initiate withdrawal transaction receipt.
    const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

    // temporary log
    console.log(receipt);
  };

  const initiateERC20Withdraw = async () => {
    // L1 Messenger On Sepolia
    const l2StandardBridge = '0x4200000000000000000000000000000000000010';
    const l1TokenAddress = selectedToken?.address as Address;
    const extraData = '0x';
    const l2Token = toTokens.find((token) => token.symbol === selectedToken?.symbol && token.chainId === toChain.id);
    const l2TokenAddress = l2Token?.address as Address;

    // temporary fixed value
    const minGasLimit = 218_874;

    const hash = await writeContractAsync({
      address: l2StandardBridge,
      abi: bridgeERC20ToABI,
      functionName: 'bridgeERC20To',
      args: [l1TokenAddress, l2TokenAddress, userAddress!, parseTokenUnits(amount), Number(minGasLimit), extraData],
    });

    const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

    // temporary log
    console.log(l2Receipt);
  };

  const initiateMessageWithdraw = async () => {
    // L2 OP Sepolia Messenger
    const l2CrossDomainMessenger = '0x4200000000000000000000000000000000000007';
    const targetAddress = userAddress!;
    const message = data as Hex;
    const minGasLimit = 200_000; // TODO - get this from the contract

    const hash = await writeContractAsync({
      address: l2CrossDomainMessenger,
      abi: sendMessageABI,
      functionName: 'sendMessage',
      args: [targetAddress, message, minGasLimit],
    });

    const l2Receipt = await waitForL2TransactionReceipt(customClient.from.public, customClient.to.public, hash);

    // temporary log
    console.log(l2Receipt);
  };

  // temporary function, will be removed
  const handleConfirm = async () => {
    try {
      if (!userAddress) return;
      if (chainId !== fromChain.id) {
        await switchChainAsync({ chainId: fromChain.id });
      }
      // setModalOpen(ModalType.LOADING);

      switch (transactionType) {
        case TransactionType.DEPOSIT:
          if (!selectedToken) {
            await depositMessage();
          } else if (selectedToken?.symbol === 'ETH') {
            await depositETH();
          } else {
            await depositERC20();
          }
          break;
        case TransactionType.WITHDRAW:
          // TODO: Implement withdraw
          if (!selectedToken) {
            await initiateMessageWithdraw();
          } else if (selectedToken?.symbol === 'ETH') {
            await initiateETHWithdraw();
          } else {
            await initiateERC20Withdraw();
          }
          break;
        case TransactionType.BRIDGE:
          // TODO: Implement bridge
          break;
      }
    } catch (e) {
      console.warn('Error: ', e);
    }
  };

  return (
    <BaseModal type={ModalType.REVIEW}>
      <ModalBody>
        <h1>Review modal</h1>
        <p>Transaction: {transactionType}</p>
        <p>Token: {selectedToken?.symbol}</p>

        <Button variant='contained' color='primary' fullWidth onClick={handleConfirm}>
          Initiate Transaction
        </Button>
      </ModalBody>
    </BaseModal>
  );
};

const ModalBody = styled(Box)(() => {
  return {
    height: '30rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  };
});

const waitForL2TransactionReceipt = async (l1Client: PublicClient, l2Client: PublicClient, l1Hash?: Hex) => {
  if (!l1Hash) throw new Error('No hash returned');

  // Wait for the L1 transaction to be processed.
  const receipt = await l1Client.waitForTransactionReceipt({ hash: l1Hash });

  // Get the L2 transaction hash from the L1 transaction receipt.
  const [l2Hash] = getL2TransactionHashes(receipt);

  // Wait for the L2 transaction to be processed.
  const l2Receipt = await l2Client.waitForTransactionReceipt({
    hash: l2Hash,
  });

  return l2Receipt;
};
