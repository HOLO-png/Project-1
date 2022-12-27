const MyNTFMarketplace = artifacts.require("NFTMarketplace");
const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
const MyKycContract = artifacts.require("KycContract");

require("dotenv").config({ path: "../.env" });
const INITIAL_TOKENS = process.env.INITIAL_TOKENS;

module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts();

  // =======================================

  await deployer.deploy(MyKycContract);
  await deployer.deploy(MyToken, process.env.INITIAL_TOKENS);
  await deployer.deploy(
    MyTokenSale,
    1,
    addr[0],
    MyToken.address,
    MyKycContract.address
  );

  let instance = await MyToken.deployed();

  // --------------------------------------

  const MyNTFMarketplaceDeploy = await deployer.deploy(
    MyNTFMarketplace,
    +process.env.INITIAL_TOKENS
  );

  await MyNTFMarketplaceDeploy.addToken(
    "Phung Truong Dinh Quan Token",
    "PTDQ",
    MyToken.address,
    867
  );

  await instance.transfer(MyNTFMarketplaceDeploy.address, 1000000);
  await instance.transfer(MyTokenSale.address, 1000000);
  await instance.approve(MyNTFMarketplaceDeploy.address, 1000000);
};
