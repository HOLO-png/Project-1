const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");
const MyKycContract = artifacts.require("KycContract");

require("dotenv").config({ path: "../.env" });
const INITIAL_TOKENS = process.env.INITIAL_TOKENS;

module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts();

  await deployer.deploy(MyKycContract);
  await deployer.deploy(MyToken, INITIAL_TOKENS);
  await deployer.deploy(
    MyTokenSale,
    1,
    addr[0],
    MyToken.address,
    MyKycContract.address
  );

  let instance = await MyToken.deployed();
  await instance.transfer(MyTokenSale.address, INITIAL_TOKENS);
};
