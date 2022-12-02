import { useContext, useState } from "react";
import { EthContext } from "../../contexts/EthContext";

function Welcome() {
  const [kycAddress, setKycAddress] = useState("0x234...");

  const { state } = useContext(EthContext);

  console.log(state);
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
      await state.tokenSaleInstance.methods.buyTokens(state.accounts[0]).send({
        from: state.accounts[0],
        value: state.web3.utils.toWei("1", "wei"),
      });
    }
  };

  // updateUserToken()

  return (
    <div className="welcome">
      <h1>👋 Cappuccino Token Sale !</h1>
      <p>Get your token today</p>
      <h2>Kyc Whitelisting</h2>
      Address to allowed:{" "}
      <input
        type="text"
        name="kycAddress"
        value={state.kycAddress}
        onChange={(e) => setKycAddress(e.target.value)}
      />
      <button type="button" onClick={handleKycWhiteListSubmit}>
        Add to WhiteList
      </button>
      <h2>Buy Token</h2>
      <p>
        If you want to buy tokens, send Wei to this address:{" "}
        {state.tokenSaleAddress}
      </p>
      <p>Your currently have: {state.userTokens} CAPPU tokens.</p>
      <button onClick={handleBuyTokens}>Buy more tokens</button>
    </div>
  );
}

export default Welcome;
