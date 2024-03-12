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
 * @notice Sends ETH to a receiver's address on the other chain. Note that if ETH is sent to a
 *         smart contract and the call fails, the ETH will be temporarily locked in the
 *         StandardBridge on the other chain until the call is replayed. If the call cannot be
 *         replayed with any amount of gas (call always reverts), then the ETH will be
 *         permanently locked in the StandardBridge on the other chain. ETH will also
 *         be locked if the receiver is the other bridge, because finalizeBridgeETH will revert
 *         in that case.
 *
 * @param _to          Address of the receiver.
 * @param _minGasLimit Minimum amount of gas that the bridge can be relayed with.
 * @param _extraData   Extra data to be sent with the transaction. Note that the recipient will
 *                     not be triggered with this data, but it will be emitted and can be used
 *                     to identify the transaction.
 */

export const bridgeETHToABI = parseAbi([
  'function bridgeETHTo(address _to, uint32 _minGasLimit, bytes calldata _extraData) external payable',
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

/**
 * @notice Accepts deposits of ETH and data, and emits a TransactionDeposited event for use in
 *         deriving deposit transactions. Note that if a deposit is made by a contract, its
 *         address will be aliased when retrieved using `tx.origin` or `msg.sender`. Consider
 *         using the CrossDomainMessenger contracts for a simpler developer experience.
 * @param _to         Target address on L2.
 * @param _value      ETH value to send to the recipient.
 * @param _gasLimit   Amount of L2 gas to purchase by burning gas on L1.
 * @param _isCreation Whether or not the transaction is a contract creation.
 * @param _data       Data to trigger the recipient with.
 */
export const depositTransactionABI = parseAbi([
  'function depositTransaction(address _to, uint256 _value, uint64 _gasLimit, bool _isCreation, bytes calldata _data) external',
]);

/**
 * @custom:legacy
 * @notice Initiates a withdrawal from L2 to L1 to a target account on L1.
 *         Note that if ETH is sent to a contract on L1 and the call fails, then that ETH will
 *         be locked in the L1StandardBridge. ETH may be recoverable if the call can be
 *         successfully replayed by increasing the amount of gas supplied to the call. If the
 *         call will fail for any amount of gas, then the ETH will be locked permanently.
 *         This function only works with OptimismMintableERC20 tokens or ether. Use the
 *         `bridgeERC20To` function to bridge native L2 tokens to L1.
 * @param _l2Token     Address of the L2 token to withdraw.
 * @param _to          Recipient account on L1.
 * @param _amount      Amount of the L2 token to withdraw.
 * @param _minGasLimit Minimum gas limit to use for the transaction.
 * @param _extraData   Extra data attached to the withdrawal.
 */
export const withdrawToABI = parseAbi([
  'function withdrawTo(address _l2Token, address _to, uint256 _amount, uint32 _minGasLimit, bytes calldata _extraData) external payable',
]);

/**
 * @notice Finalizes an ETH bridge on this chain. Can only be triggered by the other
 *         StandardBridge contract on the remote chain.
 * @param _from      Address of the sender.
 * @param _to        Address of the receiver.
 * @param _amount    Amount of ETH being bridged.
 * @param _extraData Extra data to be sent with the transaction. Note that the recipient will
 *                   not be triggered with this data, but it will be emitted and can be used
 *                   to identify the transaction.
 */
export const finalizeBridgeETHABI = parseAbi([
  'function finalizeBridgeETH(address _from, address _to, uint256 _amount, bytes calldata _extraData) public payable',
]);

/**
 * @notice Relays a message that was sent by the other CrossDomainMessenger contract. Can only
 *         be executed via cross-chain call from the other messenger OR if the message was
 *         already received once and is currently being replayed.
 *
 * @param _nonce       Nonce of the message being relayed.
 * @param _sender      Address of the user who sent the message.
 * @param _target      Address that the message is targeted at.
 * @param _value       ETH value to send with the message.
 * @param _minGasLimit Minimum amount of gas that the message can be executed with.
 * @param _message     Message to send to the target.
 */
export const relayMessageABI = parseAbi([
  'function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _minGasLimit, bytes calldata _message) external',
]);
