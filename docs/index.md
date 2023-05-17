# Solidity API

## LiquidityManager

_This contract can receive custody of ERC721 tokens and provides functions to manage liquidity on Uniswap V3._

### DAI

```solidity
address DAI
```

### USDC

```solidity
address USDC
```

### poolFee

```solidity
uint24 poolFee
```

### NonfungiblePositionManager

```solidity
contract INonfungiblePositionManager NonfungiblePositionManager
```

### Deposit

```solidity
struct Deposit {
  address owner;
  uint128 liquidity;
  address token0;
  address token1;
}
```

### PositionMinted

```solidity
event PositionMinted(uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
```

### FeesCollected

```solidity
event FeesCollected(uint256 amount0, uint256 amount1)
```

### LiquidityIncreased

```solidity
event LiquidityIncreased(uint256 liquidity, uint256 amount0, uint256 amount1)
```

### LiquidityDecreasedByHalf

```solidity
event LiquidityDecreasedByHalf(uint256 amount0, uint256 amount1)
```

### deposits

```solidity
mapping(uint256 => struct LiquidityManager.Deposit) deposits
```

### onERC721Received

```solidity
function onERC721Received(address operator, address from, uint256 tokenId, bytes data) external returns (bytes4)
```

_Receives an ERC721 token and creates a Deposit struct for it_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| operator | address | The address which called `safeTransferFrom` function on the NFT |
| from | address | The address of the previous owner of the NFT |
| tokenId | uint256 | The ID of the ERC721 token |
| data | bytes | Additional data with no specified format |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| [0] | bytes4 | Magic value 0x150b7a02 |

### _createDeposit

```solidity
function _createDeposit(address owner, uint256 tokenId) internal
```

_Creates a Deposit struct for the given NFT_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| owner | address | The address of the owner of the NFT |
| tokenId | uint256 | The ID of the ERC721 token |

### mintNewPosition

```solidity
function mintNewPosition() external returns (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1)
```

_Calls the mint function defined in periphery, mints the same amount of each token.
For this example user is providing 1000 DAI and 1000 USDC in liquidity_

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The id of the newly minted ERC721 |
| liquidity | uint128 | The amount of liquidity for the position |
| amount0 | uint256 | The amount of token0 |
| amount1 | uint256 | The amount of token1 |

### collectAllFees

```solidity
function collectAllFees(uint256 tokenId) external returns (uint256 amount0, uint256 amount1)
```

Collects the fees associated with provided liquidity

_The contract must hold the erc721 token before it can collect fees_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The id of the erc721 token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount of fees collected in token0 |
| amount1 | uint256 | The amount of fees collected in token1 |

### _sendToOwner

```solidity
function _sendToOwner(uint256 tokenId, uint256 amount0, uint256 amount1) internal
```

Transfers funds to owner of NFT

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The id of the erc721 |
| amount0 | uint256 | The amount of token0 |
| amount1 | uint256 | The amount of token1 |

### decreaseLiquidityInHalf

```solidity
function decreaseLiquidityInHalf(uint256 tokenId) external returns (uint256 amount0, uint256 amount1)
```

A function that decreases the current liquidity by half. An example to show how to call the `decreaseLiquidity` function defined in periphery.

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The id of the erc721 token |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amount0 | uint256 | The amount received back in token0 |
| amount1 | uint256 | The amount returned back in token1 |

### increaseLiquidityCurrentRange

```solidity
function increaseLiquidityCurrentRange(uint256 tokenId, uint256 amountAdd0, uint256 amountAdd1) external returns (uint128 liquidity, uint256 amount0, uint256 amount1)
```

Increases liquidity in the current range

_Pool must be initialized already to add liquidity_

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| tokenId | uint256 | The id of the erc721 token |
| amountAdd0 | uint256 |  |
| amountAdd1 | uint256 |  |

## TokenSwap

### swapRouter

```solidity
contract ISwapRouter swapRouter
```

### DAI

```solidity
address DAI
```

### WETH9

```solidity
address WETH9
```

### USDC

```solidity
address USDC
```

### poolFee

```solidity
uint24 poolFee
```

### swapExactInputSingleEvent

```solidity
event swapExactInputSingleEvent(uint256 amountOut)
```

_Emitted when `swapExactInputSingle` is called and successfully executes a swap, returning the amount of `tokenOut` received._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of `tokenOut` received by the caller. |

### swapExactOutputSingleEvent

```solidity
event swapExactOutputSingleEvent(uint256 amountIn)
```

_Emitted when `swapExactOutputSingle` is called and successfully executes a swap, returning the amount of `tokenIn` spent._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountIn | uint256 | The amount of `tokenIn` spent by the caller. |

### swapExactInputMultihopEvent

```solidity
event swapExactInputMultihopEvent(uint256 amountOut)
```

_Emitted when `swapExactInputMultihop` is called and successfully executes a multihop swap, returning the amount of `WETH9` received._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of `WETH9` received by the caller. |

### swapExactOutputMultihopEvent

```solidity
event swapExactOutputMultihopEvent(uint256 amountIn)
```

_Emitted when `swapExactOutputMultihop` is called and successfully executes a multihop swap, returning the amount of `DAI` spent._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountIn | uint256 | The amount of `DAI` spent by the caller. |

### swapExactInputSingle

```solidity
function swapExactInputSingle(uint256 amountIn) external returns (uint256 amountOut)
```

swapExactInputSingle swaps a fixed amount of DAI for a maximum possible amount of WETH9
using the DAI/WETH9 0.3% pool by calling `exactInputSingle` in the swap router.

_The calling address must approve this contract to spend at least `amountIn` worth of its DAI for this function to succeed._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountIn | uint256 | The exact amount of DAI that will be swapped for WETH9. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of WETH9 received. |

### swapExactOutputSingle

```solidity
function swapExactOutputSingle(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn)
```

swapExactOutputSingle swaps a minimum possible amount of DAI for a fixed amount of WETH.

_The calling address must approve this contract to spend its DAI for this function to succeed. As the amount of input DAI is variable,
the calling address will need to approve for a slightly higher amount, anticipating some variance._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The exact amount of WETH9 to receive from the swap. |
| amountInMaximum | uint256 | The amount of DAI user is willing to spend to receive the specified amount of WETH9. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountIn | uint256 | The amount of DAI actually spent in the swap. |

### swapExactInputMultihop

```solidity
function swapExactInputMultihop(uint256 amountIn) external returns (uint256 amountOut)
```

swapExactInputMultihop swaps a fixed amount of DAI for a maximum possible amount of WETH9 through an intermediary pool.
For this example, user will swap DAI to USDC, then USDC to WETH9 to achieve our desired output.

_The calling address must approve this contract to spend at least `amountIn` worth of its DAI for this function to succeed._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountIn | uint256 | The amount of DAI to be swapped. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The amount of WETH9 received after the swap. |

### swapExactOutputMultihop

```solidity
function swapExactOutputMultihop(uint256 amountOut, uint256 amountInMaximum) external returns (uint256 amountIn)
```

swapExactOutputMultihop swaps a minimum possible amount of DAI for a fixed amount of WETH through an intermediary pool.
For this example, user want to swap DAI for WETH9 through a USDC pool but user specify the desired amountOut of WETH9. Notice how the path encoding is slightly different in for exact output swaps.

_The calling address must approve this contract to spend its DAI for this function to succeed. As the amount of input DAI is variable,
the calling address will need to approve for a slightly higher amount, anticipating some variance._

#### Parameters

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountOut | uint256 | The desired amount of WETH9. |
| amountInMaximum | uint256 | The maximum amount of DAI willing to be swapped for the specified amountOut of WETH9. |

#### Return Values

| Name | Type | Description |
| ---- | ---- | ----------- |
| amountIn | uint256 | The amountIn of DAI actually spent to receive the desired amountOut. |

