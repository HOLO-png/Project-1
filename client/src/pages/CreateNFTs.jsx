import React, { useState } from "react";
import PropTypes from "prop-types";
import Web3Modal from "web3modal";
import { useNavigate } from "react-router-dom";
import NFTMarketplace from "../contracts/NFTMarketplace.json";
import { nftMarketAddress } from "../config.js";
import { ethers } from "ethers";
import styled from "styled-components";
const { create } = require("ipfs-http-client");
const CreateDiv = styled.div`
  font-size: 20px !important;

  .stretch-card > .card {
    width: 100%;
    min-width: 100%;
  }

  body {
    background-color: #f9f9fa;
  }

  .flex {
    -webkit-box-flex: 1;
    -ms-flex: 1 1 auto;
    flex: 1 1 auto;
  }

  .forms-sample {
    display: flex;
    flex-direction: column;
  }

  @media (max-width: 991.98px) {
    .padding {
      padding: 1.5rem;
    }
  }

  @media (max-width: 767.98px) {
    .padding {
      padding: 1rem;
    }
  }

  .padding {
    padding: 3rem;
  }

  .card {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
    -ms-box-shadow: none;
  }

  .card {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    word-wrap: break-word;
    background-color: #fff;
    background-clip: border-box;
    border: 1px solid #3da5f;
    border-radius: 0;
  }

  .card .card-body {
    padding: 1.25rem 1.75rem;
  }

  .card .card-title {
    color: #000000;
    margin-bottom: 0.625rem;
    text-transform: capitalize;
    font-size: 0.875rem;
    font-weight: 500;
  }

  .card .card-description {
    margin-bottom: 0.875rem;
    font-weight: 400;
    color: #76838f;
  }

  .form-group label {
    font-size: 0.875rem;
    line-height: 1.4rem;
    vertical-align: top;
    margin-bottom: 0.5rem;
  }

  .form-control {
    border: 1px solid #f3f3f3;
    font-weight: 400;
    font-size: 0.875rem;
  }

  #file {
    border: 2px dashed #92b0b3 !important;
  }

  .color input {
    background-color: #f1f1f1;
  }

  .files:before {
    position: absolute;
    bottom: 60px;
    left: 0;
    width: 100%;
    content: attr(data-before);
    color: #000;
    font-size: 12px;
    font-weight: 600;
    text-align: center;
  }

  #file {
    display: inline-block;
    width: 100%;
    padding: 95px 0 0 100%;
    background: url("https://i.imgur.com/VXWKoBD.png") top center no-repeat #fff;
    background-size: 55px 55px;
  }
`;
const projectId = "2IUVdQNOTo8cbq2T2rFr7TnxvIJ";
const projectSecretKey = "25e86d51c1c815d1721ab9c7fd473681";
export const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecretKey).toString("base64");

const subdomain = "https://hoanglong-nfts.infura-ipfs.io";

const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
  mode: "no-cors",
});

function CreateNFTs(props) {
  const [fileUrl, setFileUrl] = useState(null);
  const navigate = useNavigate();

  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const added = await client.add(file);
      const url = `${subdomain}/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `${subdomain}/ipfs/${added.path}`;
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const price = ethers.utils.parseUnits(formInput.price, "wei");

    let contract = new ethers.Contract(
      nftMarketAddress,
      NFTMarketplace.abi,
      signer
    );

    try {
      let listingPrice = await contract.getListingPrice();
      listingPrice = listingPrice.toString();
      let transaction = await contract.createToken(url, price, {
        value: listingPrice,
      });
      await transaction.wait();

      navigate("/");
    } catch (err) {
      console.log("err: ", err);
    }
  }

  return (
    <CreateDiv className="page-content page-container" id="page-content">
      <div className="padding">
        <div
          className="row container d-flex justify-content-center"
          style={{
            transform: "scale(1.5)",
            margin: "0 auto",
            marginTop: "150px",
          }}
        >
          <div className="col-lg-5 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Form input mask example</h4>
                <p className="card-description">
                  Take a preview of input mask format
                </p>
                <form className="forms-sample">
                  <div className="form-group row">
                    <div className="col">
                      <label>Asset Name:</label>
                      <input
                        className="form-control"
                        data-inputmask="'alias': 'date'"
                        placeholder="Asset Name"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            name: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col">
                      <label>Asset Description:</label>
                      <textarea
                        className="form-control"
                        data-inputmask="'alias': 'datetime'"
                        placeholder="Asset Description"
                        onChange={(e) =>
                          updateFormInput({
                            ...formInput,
                            description: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Asset Price in Eth:</label>
                    <input
                      className="form-control"
                      type="number"
                      data-inputmask="'alias': 'date'"
                      placeholder="Asset Price in Eth"
                      onChange={(e) =>
                        updateFormInput({ ...formInput, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-md-12 col-lg-10 col-12">
                      <div className="form-group files">
                        <label className="my-auto">Upload Your File </label>
                        <input
                          id="file"
                          type="file"
                          className="form-control"
                          name="Asset"
                          onChange={onChange}
                        />
                      </div>
                    </div>
                  </div>

                  {fileUrl && (
                    <img
                      className="rounded mt-4"
                      width="350"
                      src={fileUrl}
                      alt=""
                      style={{ width: "30%", alignSelf: "center" }}
                    />
                  )}
                </form>
                <button onClick={listNFTForSale} className="btn btn-success">
                  Create NFT
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CreateDiv>
  );
}

CreateNFTs.propTypes = {};

export default CreateNFTs;
