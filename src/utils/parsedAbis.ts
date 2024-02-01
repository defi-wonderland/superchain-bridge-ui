import { parseAbi } from 'viem';

/**
 * @notice Finalizes an ERC20 bridge on this chain. Can only be triggered by the other
 *         StandardBridge contract on the remote chain.
 *
 * @param _localToken  Address of the ERC20 on this chain.
 * @param _remoteToken Address of the corresponding token on the remote chain.
 * @param _from        Address of the sender.
 * @param _to          Address of the receiver.
 * @param _amount      Amount of the ERC20 being bridged.
 * @param _extraData   Extra data to be sent with the transaction. Note that the recipient will
 *                     not be triggered with this data, but it will be emitted and can be used
 *                     to identify the transaction.
 */
export const finalizeBridgeERC20ABI = parseAbi([
  'function finalizeBridgeERC20(address _localToken, address _remoteToken, address _from, address _to, uint256 _amount, bytes calldata _extraData) external',
]);

/**
 * @custom:legacy
 * @notice Deposits some amount of ERC20 tokens into a target account on L2.
 *
 * @param _l1Token     Address of the L1 token being deposited.
 * @param _l2Token     Address of the corresponding token on L2.
 * @param _to          Address of the recipient on L2.
 * @param _amount      Amount of the ERC20 to deposit.
 * @param _minGasLimit Minimum gas limit for the deposit message on L2.
 * @param _extraData   Optional data to forward to L2. Data supplied here will not be used to
 *                     execute any code on L2 and is only emitted as extra data for the
 *                     convenience of off-chain tooling.
 */
export const bridgeERC20ToABI = parseAbi([
  'function bridgeERC20To(address _l1Token, address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes calldata _extraData) external',
]);

/**
 * @notice Sends a message to some target address on the other chain. Note that if the call
 *         always reverts, then the message will be unrelayable, and any ETH sent will be
 *         permanently locked. The same will occur if the target on the other chain is
 *         considered unsafe (see the _isUnsafeTarget() function).
 *
 * @param _target      Target contract or wallet address.
 * @param _message     Message to trigger the target address with.
 * @param _minGasLimit Minimum gas limit that the message can be executed with.
 */
export const sendMessageABI = parseAbi([
  'function sendMessage(address _target, bytes calldata _message, uint32 _minGasLimit) external payable',
]);
