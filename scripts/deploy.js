require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // Deploy TokenSwap contract
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy();
  await tokenSwap.deployed();
  console.log("TokenSwap deployed to:", tokenSwap.address);

  // Deploy LiquidityManager contract
  const LiquidityManager = await ethers.getContractFactory("LiquidityManager");
  const liquidityManager = await LiquidityManager.deploy(tokenSwap.address);
  await liquidityManager.deployed();
  console.log("LiquidityManager deployed to:", liquidityManager.address);

  // Verify TokenSwap contract on Etherscan
  const etherscanApiKey = process.env.ETHERSCAN_KEY;
  if (!etherscanApiKey) {
    console.error("ETHERSCAN_KEY missing from environment variables");
    return;
  }

  const networkName = process.env.HARDHAT_NETWORK || "localhost";
  console.log(`Verifying TokenSwap contract on Etherscan`);

  // Wait for the contract to be published on Etherscan
  await new Promise((resolve) => setTimeout(resolve, 120000));

  try {
    await ethers.getContractAt("TokenSwap", tokenSwap.address);
    console.log("TokenSwap contract address validated on the network");
  } catch (error) {
    console.error("Error validating TokenSwap contract address:", error);
    return;
  }

  try {
    const etherscanProvider = ethers.getDefaultProvider(networkName, {
      etherscan: etherscanApiKey,
    });
    const verificationResult = await etherscanProvider.verifyContract(
      tokenSwap.address,
      {
        contract: "TokenSwap",
        libraries: {},
      }
    );
    console.log(
      "TokenSwap contract verified on Etherscan:",
      verificationResult.url
    );
  } catch (error) {
    console.error("Error verifying TokenSwap contract on Etherscan:", error);
  }

  // Verify LiquidityManager contract on Etherscan
  console.log(`Verifying LiquidityManager contract on Etherscan`);

  // Wait for the contract to be published on Etherscan
  await new Promise((resolve) => setTimeout(resolve, 120000));

  try {
    await ethers.getContractAt("LiquidityManager", liquidityManager.address);
    console.log("LiquidityManager contract address validated on the network");
  } catch (error) {
    console.error("Error validating LiquidityManager contract address:", error);
    return;
  }

  try {
    const etherscanProvider = ethers.getDefaultProvider(networkName, {
      etherscan: etherscanApiKey,
    });
    const verificationResult = await etherscanProvider.verifyContract(
      liquidityManager.address,
      {
        contract: "LiquidityManager",
        libraries: {},
      }
    );
    console.log(
      "LiquidityManager contract verified on Etherscan:",
      verificationResult.url
    );
  } catch (error) {
    console.error(
      "Error verifying LiquidityManager contract on Etherscan:",
      error
    );
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
