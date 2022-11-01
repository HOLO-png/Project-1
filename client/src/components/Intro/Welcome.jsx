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
    </div>
  );
}

export default Welcome;
