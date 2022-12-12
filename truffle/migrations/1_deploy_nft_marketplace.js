const MyNTFMarketplace = artifacts.require("NFTMarketplace");

require("dotenv").config({ path: "../.env" });

module.exports = async function (deployer) {
  await deployer.deploy(MyNTFMarketplace);
};
