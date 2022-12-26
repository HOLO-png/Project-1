const MyNTFMarketplace = artifacts.require("NFTMarketplace");
const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
const MyKycContract = artifacts.require("KycContract");

require("dotenv").config({ path: "../.env" });
const INITIAL_TOKENS = process.env.INITIAL_TOKENS;

module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts();
  const MyTokenDeploy = await MyToken.deployed();
  const MyKycContractDeploy = await MyKycContract.deployed();

  await deployer.deploy(
    MyTokenSale,
    1,
    addr[0],
    MyTokenDeploy.address,
    MyKycContractDeploy.address
  );

  const MyNTFMarketplaceDeploy = await deployer.deploy(
    MyNTFMarketplace,
    INITIAL_TOKENS
  );

  await MyNTFMarketplaceDeploy.addToken(
    "Phung Truong Dinh Quan Token",
    "PTDQ",
    MyTokenDeploy.address,
    867
  );

  await MyTokenDeploy.transfer(MyNTFMarketplaceDeploy.address, INITIAL_TOKENS);
  await MyTokenDeploy.transfer(MyTokenSale.address, INITIAL_TOKENS);
  await MyTokenDeploy.approve(MyNTFMarketplaceDeploy.address, INITIAL_TOKENS);
};
