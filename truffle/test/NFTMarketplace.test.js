const NFTMarketplace = artifacts.require("NFTMarketplace");

contract("NFTMarket", async function (accounts) {
  const [deployerAccount, buyerAddress] = accounts;
  it("Should create and execute market sales", async function () {
    let NFTInstance = await NFTMarketplace.deployed();

    let listingPrice = await NFTInstance.getListingPrice();
    listingPrice = listingPrice.toString();

    const auctionPrice = web3.utils.toWei("1", "wei");
    /* create two tokens */
    await NFTInstance.createToken(
      "https://www.mytokenlocation.com",
      auctionPrice,
      { value: listingPrice }
    );
    await NFTInstance.createToken(
      "https://www.mytokenlocation2.com",
      auctionPrice,
      { value: listingPrice }
    );

    /* execute sale of token to another user */
    await NFTInstance.createMarketSale(1, {
      value: auctionPrice,
    });

    /* resell a token */
    await NFTInstance.resellToken(1, auctionPrice, {
      value: listingPrice,
    });

    /* query for and return the unsold items */
    items = await NFTInstance.fetchMarketItems();
    items = await Promise.all(
      items.map(async (i) => {
        const tokenUri = await NFTInstance.tokenURI(i.tokenId);
        let item = {
          price: i.price.toString(),
          tokenId: i.tokenId.toString(),
          seller: i.seller,
          owner: i.owner,
          tokenUri,
        };
        return item;
      })
    );
    console.log("items: ", items);
  });
});
