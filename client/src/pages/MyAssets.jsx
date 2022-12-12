import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { nftMarketAddress } from "../config";
import NFTMarketplace from "../contracts/NFTMarketplace.json";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const MyAssetsStyle = styled.div`
  .height {
    height: 100vh;
  }

  .card {
    width: 350px;
    height: 290px;
  }

  .image {
    position: absolute;
    right: 12px;
    top: 10px;
    width: 30%;
  }

  .image > img {
    width: 100%;
  }

  .main-heading {
    font-size: 40px;
    color: red !important;
  }

  .ratings i {
    color: orange;
  }

  .user-ratings h6 {
    margin-top: 2px;
  }

  .colors {
    display: flex;
    margin-top: 2px;
  }

  .colors span {
    width: 15px;
    height: 15px;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    margin-right: 6px;
  }

  .colors span:nth-child(1) {
    background-color: red;
  }

  .colors span:nth-child(2) {
    background-color: blue;
  }

  .colors span:nth-child(3) {
    background-color: yellow;
  }

  .colors span:nth-child(4) {
    background-color: purple;
  }

  .btn-danger {
    height: 48px;
    font-size: 18px;
  }

  .card-content {
    display: flex !important;
    flex-direction: column;
    align-items: flex-start !important;
    justify-content: start !important;
  }
`;
function MyAssets(props) {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const navigate = useNavigate();

  useEffect(() => {
    loadNFTs();
  }, []);

  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "https://127.0.0.1:7545",
      cacheProvider: true,
    });

    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const marketplaceContract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          image: meta.data.image,
          name: meta.data.name,
          description: meta.data.description,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }

  function listNFT(nft) {
    console.log("nft:", nft);
    navigate(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs owned</h1>;

  return (
    <>
      <h1 style={{ textAlign: "center" }}>My NFTs</h1>
      <MyAssetsStyle className="flex justify-center height d-flex justify-content-center align-items-center">
        {nfts.map((nft, i) => (
          <div class="card p-3" key={i}>
            <div class="d-flex justify-content-between align-items-center ">
              <div class="mt-2">
                <h4 class="text-uppercase">NFT</h4>
                <div class="mt-5">
                  <h5 class="text-uppercase mb-0">{nft.name}</h5>
                  <h1 class="main-heading mt-0">{nft.price} ETH</h1>
                  <div class="d-flex flex-row user-ratings">
                    <div class="ratings">
                      <i class="fa fa-star"></i>
                      <i class="fa fa-star"></i>
                      <i class="fa fa-star"></i>
                      <i class="fa fa-star"></i>
                    </div>
                    <h6 class="text-muted ml-1">4/5</h6>
                  </div>
                </div>
              </div>
              <div class="image">
                <img src={nft.image} width="200" alt="" />
              </div>
            </div>

            <div class="d-flex justify-content-between align-items-center mt-2 mb-2 card-content">
              <span>{nft.seller}</span>
              <span>{nft.owner}</span>
              <p>{nft.description}</p>

              <div class="colors">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>

            <button class="btn btn-danger" onClick={() => listNFT(nft)}>
              List
            </button>
          </div>
        ))}
      </MyAssetsStyle>
    </>
  );
}

MyAssets.propTypes = {};

export default MyAssets;
