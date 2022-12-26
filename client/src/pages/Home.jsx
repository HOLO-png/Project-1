import React, { useContext, useState } from "react";
import { useEffect } from "react";
import Intro from "../components/Intro";
import axios from "axios";
import { ethers } from "ethers";
import NFTMarketplace from "../contracts/NFTMarketplace.json";
import NFTList from "../components/NFTList";
import { nftMarketAddress } from "../config";
import { auth } from "./CreateNFTs";
import Web3Modal from "web3modal";
import { EthContext } from "../contexts/EthContext";

function Home(props) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const {
    state: { accounts, contracts, web3 },
  } = useContext(EthContext);

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      `http://127.0.0.1:7545`
    );

    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplace.abi,
      provider
    );

    const data = await contract.fetchMarketItems();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios(tokenUri, {
          method: "GET",
          header: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": auth,
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": ["PUT", "GET", "POST"],
            Authorization: auth,
          },
          mode: "no-cors",
        });
        let price = ethers.utils.formatUnits(i.price.toString(), "wei");

        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }

  async function buyNft(nft) {
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplace.abi,
      signer
    );

    try {
      const stakeTokenQuantityWei = web3.utils.toWei(nft.price, "ether");
      const price = ethers.utils.parseUnits(nft.price.toString(), "wei");
      await contracts.tokenInstance.methods
        .approve(nftMarketAddress, stakeTokenQuantityWei)
        .send({
          from: accounts[0],
        });

      const transaction = await contract.createMarketSale(
        nft.tokenId,
        "PTDQ",
        nft.price,
        {
          value: price,
        }
      );
      await transaction.wait();
      loadNFTs();
    } catch (err) {
      console.log("err: ", err);
    }
  }

  return (
    <div>
      <div className="mt-3 d-flex justify-content-center">
        <span className="heading">Fast & Secure</span>
      </div>
      <div className="d-flex justify-content-center">
        <span className="text">best web hosting</span>
      </div>
      <div className="mt-3 d-flex justify-content-center">
        <span className="text1">
          Extremly fast & secure website hosting Word Press Theme.We offer Best
          Web hosting & Domain
        </span>
      </div>
      <div className=" mt-3 d-flex justify-content-center gap-3">
        <div className="btn btn-success">Get Started</div>
        <div className="btn1">
          <div className="d-flex flex-row align-items-center justify-content-center gap-1 buttonitems">
            <i className="fa fa-play-circle-o fs-3 mt-1"></i>Play Video
          </div>
        </div>
      </div>
      <Intro />
      <NFTList nfts={nfts} buyNft={buyNft} loadingState={loadingState} />
    </div>
  );
}

Home.propTypes = {};

export default Home;
