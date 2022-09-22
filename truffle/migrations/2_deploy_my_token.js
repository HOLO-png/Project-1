const MyToken = artifacts.require("MyToken");
const MyTokenSale = artifacts.require("MyTokenSale");

module.exports = async function (deployer) {
  let addr = await web3.eth.getAccounts()

  await deployer.deploy(MyToken, 1000000000);
  await deployer.deploy(MyTokenSale, 1, addr[0], MyToken.address);

  let instance = await MyToken.deployed()
  await instance.transfer(MyTokenSale.address, 1000000)
};
