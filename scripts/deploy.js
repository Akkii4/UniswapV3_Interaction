require("dotenv").config();
const { ethers } = require("hardhat");

async function main() {
  // Deploy TokenSwap contract
  const TokenSwap = await ethers.getContractFactory("TokenSwap");
  const tokenSwap = await TokenSwap.deploy();
  await tokenSwap.deployed();
  console.log("TokenSwap deployed to:", tokenSwap.address);

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
    console.log("Contract address validated on the network");
  } catch (error) {
    console.error("Error validating contract address:", error);
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
      "Contract verified on Etherscan:",
      etherscanUrl + verificationResult.url
    );
  } catch (error) {
    console.error("Error verifying contract on Etherscan:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
