## Uniswap V3 Interaction

This is a repository containing a Hardhat-based project that interacts with the Uniswap v3 decentralized exchange. The project includes two Solidity smart contracts, `LiquidityManager.sol` and `TokenSwap.sol`, which allow users to manage liquidity and swap tokens on Uniswap v3.

### Contracts

The repository contains the following contracts:

- `LiquidityManager.sol`: This contract allows users to provide or remove liquidity from a Uniswap v3 pool. The contract includes functions to deposit and withdraw tokens, as well as to check the current liquidity and share of a user in the pool.

- `TokenSwap.sol`: This contract provides functions to swap tokens on the Uniswap v3 decentralized exchange. The contract includes four different functions to perform different types of swaps, including single and multi-hop swaps.

### Usage

To use this project, you will need to have installed all npm packages on your system. You will also need to create a `.env` file with the following environment variables:

- `ALCHEMY_API_KEY`: Your Alchemy API key.
- `ETHERSCAN_KEY`: For verification of contract.

Once you have set up your environment, you can deploy the contracts to your local Hardhat network using the following command:

```
npx hardhat run scripts/deploy.js
```

This will deploy the contracts to your local network and output their addresses in the console. You can then interact with the contracts using the Hardhat console or by writing scripts in the `scripts` directory.

To run the tests in this project, use the following command:

```
npx hardhat test
```
