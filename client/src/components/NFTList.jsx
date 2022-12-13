import React from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
const NFTListStyle = styled.div`
  .wrapper {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card {
    height: 320px;
    width: 270px;
    background-color: #c62828;
    border-radius: 10px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    text-align: center !important;
  }

  .card::before {
    position: absolute;
    width: 100%;
    height: 100%;
    content: "";
    top: -50%;
    background-color: #ef5350;
    transform: skewY(145deg);
    transition: 0.5s ease-in;
  }

  .card:hover::before {
    top: -70%;
    transform: skewY(290deg);
  }

  .card .image {
    position: absolute;

    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .card .image img {
    max-width: 100%;
    transition: 0.5s ease-in;
  }

  .card:hover .image img {
    width: 40%;
  }

  .about-product {
    position: absolute;
    color: #fff;
    bottom: -50px !important;
    text-align: center;
    left: 20%;
    transition: 0.5s ease-in;
  }

  .card:hover .about-product {
    bottom: 20px !important;
  }

  .buy-now {
    color: #fff;
    background-color: #ef5350 !important;
    border-color: #ef5350 !important;
    width: 160px;
    margin-top: 20px;
  }

  .buy-now:focus {
    box-shadow: none;
  }

  .buy-now:hover {
    color: #fff;
    background-color: #e84040 !important;
    border-color: #e84040 !important;
  }

  h1 {
    font-size: 3rem;
    letter-spacing: 2px;
    font-weight: bold;
    color: #333;
    text-align: center;
  }
`;

function NFTList(props) {
  const { nfts, buyNft, loadingState } = props;

  return (
    <NFTListStyle>
      <h1 className="nft-list">NFTs List</h1>
      <div className="wrapper" style={{ gap: "20px" }}>
        {nfts.map((nft, i) => {
          return (
            <div className="card text-center" key={i}>
              <div className="image">
                <img src={nft.image} width="300" alt="" />
              </div>
              <div className="about-product text-center">
                <h3>{nft.name}</h3>
                <p className="text-gray-400">{nft.description}</p>
                <h4>
                  {nft.price} <small>ETH</small>
                </h4>
                {buyNft && (
                  <button
                    className="btn btn-success buy-now"
                    onClick={() => buyNft(nft)}
                  >
                    Buy Now
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </NFTListStyle>
  );
}

NFTList.propTypes = {};

export default NFTList;
