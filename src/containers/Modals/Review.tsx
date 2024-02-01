import { Box, Button, styled } from '@mui/material';
import { Address, parseEther } from 'viem';
import { getL2TransactionHashes } from 'viem/op-stack';
import { useWriteContract } from 'wagmi';

import BaseModal from '~/components/BaseModal';
import { useTransactionData, useToken, useCustomClient, useTokenList, useChain } from '~/hooks';
import { ModalType, TransactionType } from '~/types';
import { ZERO_ADDRESS, depositERC20ToABI } from '~/utils';

export const ReviewModal = () => {
  const { transactionType, mint, userAddress } = useTransactionData();
  const { toTokens } = useTokenList();
  const { toChain } = useChain();
  const { customClient } = useCustomClient();
  const { selectedToken, amount } = useToken();
  const { writeContractAsync } = useWriteContract();

  // temporary function, will be removed
  const depositETH = async () => {
    // Deposit
    const args = await customClient.to.wallet.buildDepositTransaction({
      mint: parseEther(mint),
      to: userAddress,
      chain: customClient.to.wallet.chain,
    });

    // temporary any, typings from viem are kinda broken
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const hash = await customClient.from.wallet?.depositTransaction(args as any);

    if (!hash) throw new Error('No hash returned');

    // Wait for the L1 transaction to be processed.
    const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

    // Get the L2 transaction hash from the L1 transaction receipt.
    const [l2Hash] = getL2TransactionHashes(receipt);

    // Wait for the L2 transaction to be processed.
    const l2Receipt = await customClient.from.public.waitForTransactionReceipt({
      hash: l2Hash,
    });

    // temporary log
    console.log(l2Receipt);
  };

  // temporary function, will be removed
  const depositERC20 = async () => {
    const l1TokenAddress = selectedToken?.address as Address;
    const extraData = '0x';
    const l2Token = toTokens.find((token) => token.symbol === selectedToken?.symbol && token.chainId === toChain.id);
    const l2TokenAddress = l2Token?.address as Address;

    // temporary fixed value
    const minGasLimit = 200000;

    const hash = await writeContractAsync({
      address: '0xFBb0621E0B23b5478B630BD55a5f21f67730B0F1',
      abi: depositERC20ToABI,
      functionName: 'depositERC20To',
      args: [l1TokenAddress, l2TokenAddress, userAddress!, BigInt(amount), Number(minGasLimit), extraData],
    });

    if (!hash) throw new Error('No hash returned');

    // Wait for the L1 transaction to be processed.
    const receipt = await customClient.from.public.waitForTransactionReceipt({ hash: hash });

    // Get the L2 transaction hash from the L1 transaction receipt.
    const [l2Hash] = getL2TransactionHashes(receipt);

    // Wait for the L2 transaction to be processed.
    const l2Receipt = await customClient.from.public.waitForTransactionReceipt({
      hash: l2Hash,
    });

    // temporary log
    console.log(l2Receipt);
  };

  // temporary function, will be removed
  const handleConfirm = async () => {
    try {
      if (!userAddress) return;
      // setModalOpen(ModalType.LOADING);

      if (transactionType === TransactionType.DEPOSIT) {
        if (selectedToken?.address === ZERO_ADDRESS) {
          await depositETH();
        } else {
          await depositERC20();
        }
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
