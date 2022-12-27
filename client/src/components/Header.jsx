import React, { useContext } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import Web3 from "web3";
import { useReducer } from "react";
import {
  actions,
  EthContext,
  initialState,
  reducer,
} from "../contexts/EthContext";
import Login from "./Intro/Login";
import { useEffect } from "react";

const getWeb3 = async () => {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    try {
      await window.ethereum.enable();
      return web3;
    } catch (error) {
      console.error(error);
    }
  } else if (window.web3) {
    const web3 = window.web3;
    console.log("Injected web3 detected.");
    return web3;
  } else {
    const web3 = new Web3(Web3.givenProvider || "http://127.0.0.1:7545");

    alert("You must download metamask extension");
    return web3;
  }
};

const NavHeader = styled.nav`
  display: flex;
  gap: 40px;
  font-size: 20px;
  .navbar-link {
    gap: 20px;
    flex: 1;
  }
`;

const navbarItem = [
  {
    title: "Home",
    path: "/",
  },
  {
    title: "Create NFT",
    path: "/create-nft",
  },
  {
    title: "My NFT",
    path: "/my-nft",
  },
  {
    title: "Dashboard NFT",
    path: "/dashboard",
  },
];

function Header(props) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const handleLoginAuth = (username, address) => {
    dispatch({
      type: actions.loginSuccess,
      data: {
        ...state,
        auth: {
          username: username,
          userAddress: address,
        },
      },
    });
  };

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      localStorage.clear();
      dispatch({
        type: actions.logout,
      });
    });
  });

  const handleConnectMetamask = async () => {
    const web3 = await getWeb3();
    if (!state.userAddress) {
      if (web3) {
        const account = await web3.eth.requestAccounts();
        if (account[0]) {
          dispatch({
            type: actions.init,
            data: { ...state, userAddress: account[0] },
          });
        }
      }
    } else {
      alert("login failed");
    }
  };

  return (
    <NavHeader className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <img
          src="https://i.imgur.com/hSDDP67.png"
          height="50px"
          width="50px"
          alt=""
        />
        <Link className="navbar-brand name" to={"/"}>
          Cloud<span className="go">Go</span>
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 navbar-link">
            {navbarItem.map((nav, idx) => (
              <li className="nav-item" key={idx}>
                <Link className="nav-link" aria-current="page" to={nav.path}>
                  <span className="home">{nav.title}</span>
                </Link>
              </li>
            ))}
          </ul>
          {state.auth?.username || (
            <button
              type="button"
              className="btn btn-primary"
              data-toggle="modal"
              data-target="#exampleModal"
              onClick={handleConnectMetamask}
            >
              Login
            </button>
          )}
          <Login
            userAddress={state.userAddress}
            handleLoginAuth={handleLoginAuth}
          />
        </div>
      </div>
    </NavHeader>
  );
}

Header.propTypes = {};

export default Header;
