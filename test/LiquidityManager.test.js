const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LiquidityManager", function () {
  let liquidityManager;

  let daiWhale;
  let usdcWhale;
  let daiContract;
  let usdcContract;
  let user;
  let usdcAmount;
  let daiAmount;

  // Replace this with the address of a DAI whale on the Ethereum mainnet
  const daiWhaleAddress = "0x60FaAe176336dAb62e284Fe19B885B095d29fB7F";
  const usdcWhaleAddress = "0x7713974908Be4BEd47172370115e8b1219F4A5f0";

  beforeEach(async function () {
    user = await ethers.getSigners(1);
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [daiWhaleAddress],
    });

    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [usdcWhaleAddress],
    });

    const LiquidityManager = await ethers.getContractFactory(
      "LiquidityManager"
    );
    liquidityManager = await LiquidityManager.deploy();
    await liquidityManager.deployed();
    const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const usdc = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

    // Approve the contract to spend DAI on behalf of the whale
    daiContract = await ethers.getContractAt("IERC20", dai);
    daiWhale = await ethers.getSigner(daiWhaleAddress);
    usdcWhale = await ethers.getSigner(usdcWhaleAddress);
    usdcContract = await ethers.getContractAt("IERC20", usdc);

    daiAmount = ethers.utils.parseEther("10000");
    usdcAmount = ethers.utils.parseUnits("10000", 6);

    await daiContract.connect(daiWhale).transfer(user[0].address, daiAmount);
    await usdcContract.connect(usdcWhale).transfer(user[0].address, usdcAmount);
  });

  it("should create a deposit for an ERC721 token", async function () {
    // transfer DAI and USDC to the contract
    daiAmount = ethers.utils.parseEther("1000");
    usdcAmount = ethers.utils.parseUnits("1000", 6);
    await daiContract
      .connect(user[0])
      .transfer(liquidityManager.address, daiAmount);
    await usdcContract
      .connect(user[0])
      .transfer(liquidityManager.address, usdcAmount);

    // Mint a new position
    const tx = await liquidityManager.mintNewPosition();

    let receipt = await tx.wait();
    let tokenId;
    const swapEvents = receipt.events?.filter(
      (x) => x.event == "PositionMinted"
    );

    if (swapEvents !== undefined && swapEvents.length > 0) {
      // At least one PositionMinted was emitted
      tokenId = swapEvents[0].args["tokenId"].toString();
    }

    // Get the deposit for the newly minted token
    const deposit = await liquidityManager.deposits(tokenId);

    // Check that the deposit was created correctly
    expect(deposit.owner).to.equal(await user[0].getAddress());
    expect(deposit.liquidity).to.gt(0);
    expect(deposit.token0).to.equal(
      "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    );
    expect(deposit.token1).to.equal(
      "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    );
  });
});
