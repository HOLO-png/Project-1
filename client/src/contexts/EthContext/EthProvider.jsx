import React, { useReducer, useCallback, useEffect } from "react";
import Web3 from "web3";
import EthContext from "./EthContext";
import { reducer, actions, initialState } from "./state";

function EthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const init = useCallback(async (artifact) => {
    const { myTokenSale, myToken, kycContract } = artifact;
    if (myTokenSale && myToken && kycContract) {
      const web3 = new Web3(Web3.givenProvider || "ws://localhost:8545");
      const accounts = await web3.eth.requestAccounts();
      const networkID = await web3.eth.net.getId();
      const { abi: myTokenSaleAbi } = myTokenSale;
      const { abi: myTokenAbi } = myToken;
      const { abi: kycAbi } = kycContract;

      // let userTokens = await tokenInstance.methods
      //   .balanceOf(state.accounts[0])
      //   .call();

      if (networkID === 5777) {
        let myTokenAddress,
          myTokenSaleAddress,
          kycAddress,
          tokenInstance,
          tokenSaleInstance,
          kycInstance,
          userTokens;

        try {
          myTokenAddress = myToken.networks[networkID].address;
          myTokenSaleAddress = myTokenSale.networks[networkID].address;
          kycAddress = kycContract.networks[networkID].address;
          tokenInstance = new web3.eth.Contract(myTokenAbi, myTokenAddress);
          tokenSaleInstance = new web3.eth.Contract(
            myTokenSaleAbi,
            myTokenSaleAddress
          );
          kycInstance = new web3.eth.Contract(kycAbi, kycAddress);
        } catch (err) {
          console.error(err);
        }

        const updateUserTokens = async () => {
          if (state.tokenInstance !== undefined) {
            userTokens = await state.tokenInstance.methods
              .balanceOf(state.accounts[0])
              .call();

            dispatch({
              type: actions.init,
              data: {
                ...state,
                userTokens,
              },
            });
          }
        };
        updateUserTokens();

        const listenToTokenTransfer = () => {
          if (state.tokenInstance !== undefined) {
            state.tokenInstance.events
              .Transfer({ to: state.accounts[0] })
              .on("data", updateUserTokens);
          }
        };
        listenToTokenTransfer();

        dispatch({
          type: actions.init,
          data: {
            artifact,
            web3,
            accounts,
            networkID,
            contracts: { tokenInstance, tokenSaleInstance, kycInstance },
            loaded: true,
            tokenSaleAddress: myTokenSale.networks[networkID].address,
            tokenInstance,
            tokenSaleInstance
          },
        });
      } else {
        alert("Network ID: " + networkID + " is correct");
      }
    }
  }, []);

  useEffect(() => {
    const tryInit = async () => {
      try {
        const myToken = require("../../contracts/MyToken.json");
        const myTokenSale = require("../../contracts/MyTokenSale.json");
        const kycContract = require("../../contracts/KycContract.json");
        const artifact = { myToken, myTokenSale, kycContract };
        init(artifact);
      } catch (err) {
        console.error(err);
      }
    };

    tryInit();
  }, [init]);

  useEffect(() => {
    const events = ["chainChanged", "accountsChanged"];
    const handleChange = () => {
      init(state.artifact);
    };

    events.forEach((e) => window.ethereum.on(e, handleChange));
    return () => {
      events.forEach((e) => window.ethereum.removeListener(e, handleChange));
    };
  }, [init, state.artifact]);

  if (!state.loaded) return <h1>loading 2 ....</h1>;
  return (
    <EthContext.Provider
      value={{
        state,
        dispatch,
      }}
    >
      {children}
    </EthContext.Provider>
  );
}

export default EthProvider;
