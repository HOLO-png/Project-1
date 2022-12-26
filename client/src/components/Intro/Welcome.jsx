import { useContext, useState } from "react";
import styled from "styled-components";
import { EthContext } from "../../contexts/EthContext";

const WelcomeEle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin: 20px;
  .main-search-input {
    background: #fff;
    padding: 0 120px 0 0;
    border-radius: 1px;
    box-shadow: 0px 0px 0px 6px rgba(255, 255, 255, 0.3);
  }

  .fl-wrap {
    float: left;
    width: 100%;
    position: relative;
  }

  .main-search-input:before {
    content: "";
    position: absolute;
    bottom: -40px;
    width: 50px;
    height: 1px;
    background: rgba(255, 255, 255, 0.41);
    left: 50%;
    margin-left: -25px;
  }

  .main-search-input-item {
    float: left;
    width: 100%;
    box-sizing: border-box;
    border-right: 1px solid #eee;
    height: 50px;
    position: relative;
  }

  .main-search-input-item input {
    float: left;
    border: none;
    width: 100%;
    height: 50px;
    padding-left: 20px;
    outline: none;
  }

  .main-search-button {
    background: #4db7fe;
  }

  .main-search-button {
    position: absolute;
    right: 0px;
    height: 50px;
    width: 120px;
    color: #fff;
    top: 0;
    border: none;
    border-top-right-radius: 0px;
    border-bottom-right-radius: 0px;
    cursor: pointer;
  }

  .main-search-input-wrap {
    max-width: 500px;
    margin: 20px auto;
    position: relative;
  }

  :focus {
    outline: 0;
  }

  @media only screen and (max-width: 768px) {
    .main-search-input {
      background: rgba(255, 255, 255, 0.2);
      padding: 14px 20px 10px;
      border-radius: 10px;
      box-shadow: 0px 0px 0px 10px rgba(255, 255, 255, 0);
    }

    .main-search-input-item {
      width: 100%;
      border: 1px solid #eee;
      height: 50px;
      border: none;
      margin-bottom: 10px;
    }

    .main-search-input-item input {
      border-radius: 6px !important;
      background: #fff;
    }

    .main-search-button {
      position: relative;
      float: left;
      width: 100%;
      border-radius: 6px;
    }
  }
  .microphone {
    border-top-right-radius: 32px !important;
    border-bottom-right-radius: 32px !important;
    background-color: #fff;
  }

  .google {
    border-top-left-radius: 32px !important;
    border-bottom-left-radius: 32px !important;
    background-color: #fff;
  }

  .input-group-prepend {
    margin-right: -2px !important;
  }

  .input-group-append {
    margin-left: -2px !important;
  }

  .form-control:focus {
    color: #495057;
    background-color: #fff;
    border-color: #ced4da;
    outline: 0;
    box-shadow: 0 0 0 0 !important;
  }

  .form-control {
    border-right: 0 !important;
    border-left: 0 !important;
    height: 100% !important;
    font-size: 20px;
  }
`;
function Welcome() {
  const [kycAddress, setKycAddress] = useState("0x234...");
  const [inputNFT, setInputNFT] = useState(0);
  const { state } = useContext(EthContext);

  const handleKycWhiteListSubmit = async () => {
    if (state.contracts && state.accounts) {
      if (kycAddress.length > 15) {
        await state.contracts.kycInstance.methods
          .setKycCompleted(kycAddress)
          .send({ from: state.accounts[0] });
        alert("Kyc for " + kycAddress + "is completed");
      } else {
        alert("Please fill out all the fields");
      }
    }
  };

  const handleBuyTokens = async () => {
    if (state.tokenInstance !== undefined) {
      if (inputNFT >= 0) {
        try {
          await state.tokenSaleInstance.methods
            .buyTokens(state.accounts[0])
            .send({
              from: state.accounts[0],
              value: state.web3.utils.toWei(inputNFT, "wei"),
            });
        } catch (error) {
          console.log(error);
        }
      } else {
        alert("Number not 0");
      }
    }
  };

  return (
    <WelcomeEle className="welcome">
      <h1>👋 Cappuccino Token Sale !</h1>
      <p>Get your token today</p>
      <h2>Kyc Whitelisting</h2>
      Address to allowed:{" "}
      <div className="container d-flex justify-content-center">
        <div className="input-group col-sm-7  input-group-lg">
          <div className="input-group-prepend">
            <span className="input-group-text google">
              <img
                src="https://img.icons8.com/color/48/000000/google-logo.png"
                alt=""
              />
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            value={state.kycAddress}
            onChange={(e) => setKycAddress(e.target.value)}
          />
          <div className="input-group-append">
            <span
              className="input-group-text microphone"
              onClick={handleKycWhiteListSubmit}
            >
              <img
                src="https://img.icons8.com/nolan/48/000000/microphone.png"
                alt=""
              />
            </span>
          </div>
        </div>
      </div>
      <h2>Buy Token</h2>
      <p>
        If you want to buy tokens, send Wei to this address:{" "}
        {state.tokenSaleAddress}
      </p>
      <p>Your currently have: {state.userTokens} CAPPU tokens.</p>
      <div className="main-search-input-wrap">
        <div className="main-search-input fl-wrap">
          <div className="main-search-input-item">
            <input
              type="number"
              value={inputNFT}
              placeholder="Enter nft amount"
              onChange={(e) => setInputNFT(e.target.value)}
              style={{ fontSize: "20px" }}
            />
          </div>

          <button className="main-search-button" onClick={handleBuyTokens}>
            Buy more tokens
          </button>
        </div>
      </div>
    </WelcomeEle>
  );
}

export default Welcome;
