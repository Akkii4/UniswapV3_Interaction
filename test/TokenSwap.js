const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("TokenSwap", function () {
  let tokenSwap;
  let daiWhale;
  let daiContract;
  let wethContract;

  // Replace this with the address of a DAI whale on the Ethereum mainnet
  const daiWhaleAddress = "0x60FaAe176336dAb62e284Fe19B885B095d29fB7F";

  beforeEach(async function () {
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [daiWhaleAddress],
    });

    const TokenSwap = await ethers.getContractFactory("TokenSwap");
    tokenSwap = await TokenSwap.deploy();
    await tokenSwap.deployed();
    const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
    const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

    // Approve the contract to spend DAI on behalf of the whale
    daiContract = await ethers.getContractAt("IERC20", dai);
    daiWhale = await ethers.getSigner(daiWhaleAddress);
    wethContract = await ethers.getContractAt("IERC20", weth);
    await daiContract
      .connect(daiWhale)
      .approve(tokenSwap.address, ethers.constants.MaxUint256);
  });

  it("Should swap DAI for WETH9 using swapExactInputSingle", async function () {
    const amountIn = ethers.utils.parseUnits("100", "ether");
    // Get the balances of the accounts before the swap
    const balanceBefore = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Execute the swap and console log event swapExactInputSingleEvent emitted upon calling swapExactInputSingle
    const tx = await tokenSwap.connect(daiWhale).swapExactInputSingle(amountIn);

    let receipt = await tx.wait();
    let outputAmount;
    const swapEvents = receipt.events?.filter(
      (x) => x.event == "swapExactInputSingleEvent"
    );

    if (swapEvents !== undefined && swapEvents.length > 0) {
      // At least one swapExactInputSingleEvent was emitted
      outputAmount = swapEvents[0].args["amountOut"].toString();
    }

    // Get the balances of the daiWhale after the swap
    const balanceAfter = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Check that the amount of DAI was deducted from the sender
    expect(balanceAfter.dai).to.equal(balanceBefore.dai.sub(amountIn));

    // Check that the amount of WETH9 was transferred from the contract to the sender
    expect(balanceAfter.weth).to.equal(balanceBefore.weth.add(outputAmount));

    console.log(
      `Swapped  ${ethers.utils.formatUnits(
        amountIn
      )} DAI for ${ethers.utils.formatUnits(outputAmount)} WETH`
    );
  });

  it("Should swap DAI for WETH9 using swapExactOutputSingle", async function () {
    const amountOut = ethers.utils.parseUnits("1", "ether");
    const amountInMaximum = ethers.utils.parseUnits("10000", "ether");

    // Get the balances of the accounts before the swap
    const balanceBefore = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Execute the swap and console log event swapExactOutputSingleEvent emitted upon calling swapExactOutputSingle
    const tx = await tokenSwap
      .connect(daiWhale)
      .swapExactOutputSingle(amountOut, amountInMaximum);

    let receipt = await tx.wait();
    let inputAmount;
    const swapEvents = receipt.events?.filter(
      (x) => x.event == "swapExactOutputSingleEvent"
    );

    if (swapEvents !== undefined && swapEvents.length > 0) {
      // At least one swapExactOutputSingleEvent was emitted
      inputAmount = swapEvents[0].args["amountIn"].toString();
    }

    // Get the balances of the daiWhale after the swap
    const balanceAfter = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Check that the amount of DAI was deducted from the sender
    expect(balanceAfter.dai).to.equal(balanceBefore.dai.sub(inputAmount));

    // Check that the amount of WETH9 was transferred from the contract to the sender
    expect(balanceAfter.weth).to.equal(balanceBefore.weth.add(amountOut));

    console.log(
      `Swapped  ${ethers.utils.formatUnits(
        inputAmount
      )} DAI for ${ethers.utils.formatUnits(amountOut)} WETH`
    );
  });

  it("Should swap DAI for WETH9 through intermediary pools using swapExactInputMultihop", async function () {
    const amountIn = ethers.utils.parseUnits("100", "ether");

    // Get the balances of the accounts before the swap
    const balanceBefore = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Execute the swap
    const tx = await tokenSwap
      .connect(daiWhale)
      .swapExactInputMultihop(amountIn);

    // Get the amount of WETH9 received after the swap
    let receipt = await tx.wait();
    let outputAmount;
    const swapEvents = receipt.events?.filter(
      (x) => x.event == "swapExactInputMultihopEvent"
    );
    if (swapEvents !== undefined && swapEvents.length > 0) {
      // At least one swapExactInputMultihopEvent was emitted
      outputAmount = swapEvents[0].args["amountOut"].toString();
    }
    // Get the balances of the daiWhale after the swap
    const balanceAfter = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Check that the amount of DAI was deducted from the sender
    expect(balanceAfter.dai).to.equal(balanceBefore.dai.sub(amountIn));

    // Check that the amount of WETH9 was transferred from the contract to the sender
    expect(balanceAfter.weth).to.equal(balanceBefore.weth.add(outputAmount));

    console.log(
      `Swapped  ${ethers.utils.formatUnits(
        amountIn
      )} DAI for ${ethers.utils.formatUnits(outputAmount)} WETH`
    );
  });

  it("Should swap DAI for WETH9 through intermediary pools using swapExactOutputMultihop", async function () {
    const amountOut = ethers.utils.parseUnits("1", "ether");
    const amountInMaximum = ethers.utils.parseUnits("10000", "ether");

    // Get the balances of the accounts before the swap
    const balanceBefore = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Execute the swap
    const tx = await tokenSwap
      .connect(daiWhale)
      .swapExactOutputMultihop(amountOut, amountInMaximum);

    // Get the amount of DAI spent to receive the desired amount of WETH9
    let receipt = await tx.wait();
    let inputAmount;
    const swapEvents = receipt.events?.filter(
      (x) => x.event == "swapExactOutputMultihopEvent"
    );
    if (swapEvents !== undefined && swapEvents.length > 0) {
      // At least one swapExactOutputMultihopEvent was emitted
      inputAmount = swapEvents[0].args["amountIn"].toString();
    }
    // Get the balances of the daiWhale after the swap
    const balanceAfter = {
      dai: await daiContract.balanceOf(daiWhale.address),
      weth: await wethContract.balanceOf(daiWhale.address),
    };

    // Check that the amount of DAI was deducted from the sender
    expect(balanceAfter.dai).to.equal(balanceBefore.dai.sub(inputAmount));

    // Check that the amount of WETH9 was transferred from the contract to the sender
    expect(balanceAfter.weth).to.equal(balanceBefore.weth.add(amountOut));
    console.log(
      `Swapped  ${ethers.utils.formatUnits(
        inputAmount
      )} DAI for ${ethers.utils.formatUnits(amountOut)} WETH`
    );
  });
});
