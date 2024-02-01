import { Box, Button, styled } from '@mui/material';
import { Address, Hex, PublicClient } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';
import { useWriteContract } from 'wagmi';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useCustomClient, useTokenList, useChain } from '~/hooks';
import { ModalType, TransactionType } from '~/types';
import {
  L1CrossDomainMessengerProxy,
  L1StandardBridgeProxy,
  ZERO_ADDRESS,
  depositERC20ToABI,
  sendMessageABI,
} from '~/utils';

export const ReviewModal = () => {
  const { transactionType, mint, userAddress, data } = useTransactionData();
  const { toTokens } = useTokenList();
  const { toChain } = useChain();
  const { customClient } = useCustomClient();
  const { selectedToken, amount, allowance, approve, parseTokenUnits } = useToken();
  const { writeContractAsync } = useWriteContract();

  // temporary function, will be removed
  const depositETH = async () => {
    // Deposit
    const args = await customClient.to.wallet.buildDepositTransaction({
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
      abi: depositERC20ToABI,
      functionName: 'depositERC20To',
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

  // temporary function, will be removed
  const handleConfirm = async () => {
    try {
      if (!userAddress) return;
      // setModalOpen(ModalType.LOADING);

      switch (transactionType) {
        case TransactionType.DEPOSIT:
          if (!selectedToken) {
            await depositMessage();
          } else if (selectedToken?.address === ZERO_ADDRESS) {
            await depositETH();
          } else {
            await depositERC20();
          }
          break;
        case TransactionType.WITHDRAW:
          // TODO: Implement withdraw
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
