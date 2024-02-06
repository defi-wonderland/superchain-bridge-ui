import { parseAbi, parseAbiItem } from 'viem';

/**
 * @notice Emitted when a transaction is deposited from L1 to L2.
 *         The parameters of this event are read by the rollup node and used to derive deposit
 *         transactions on L2.
 * @param from       Address that triggered the deposit transaction.
 * @param to         Address that the deposit transaction is directed to.
 * @param version    Version of this deposit transaction event.
 * @param opaqueData ABI encoded deposit data to be parsed off-chain.
 */
export const transactionDepositedABI = parseAbiItem(
  'event TransactionDeposited(address indexed from,address indexed to,uint256 indexed version,bytes opaqueData)',
);

/**
 * @notice Emitted any time a withdrawal is initiated.
 * @param nonce          Unique value corresponding to each withdrawal.
 * @param sender         The L2 account address which initiated the withdrawal.
 * @param target         The L1 account address the call will be send to.
 * @param value          The ETH value submitted for withdrawal, to be forwarded to the target.
 * @param gasLimit       The minimum amount of gas that must be provided when withdrawing.
 * @param data           The data to be forwarded to the target on L1.
 * @param withdrawalHash The hash of the withdrawal.
 */
export const messagePassedAbi = parseAbiItem(
  'event MessagePassed(uint256 indexed nonce,address indexed sender,address indexed target,uint256 value,uint256 gasLimit,bytes data,bytes32 withdrawalHash)',
);

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
