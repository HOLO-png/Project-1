import React, { useContext, useState } from "react";
import { useReducer } from "react";
import {
  actions,
  EthContext,
  initialState,
  reducer,
} from "../../contexts/EthContext";

function Login(props) {
  const { userAddress } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const {
    state: { contracts, accounts },
  } = useContext(EthContext);

  const [input, setInput] = useState({
    username: "",
  });
  const handleLogin = async () => {
    if (input.username && userAddress) {
      try {
        await contracts.kycInstance.methods
          .setKycCompleted(userAddress)
          .send({ from: accounts[0] });
        localStorage.setItem(
          "auth",
          JSON.stringify({
            username: input.username,
            userAddress: userAddress,
          })
        );
        dispatch({
          type: actions.loginSuccess,
          data: {
            ...state,
            auth: {
              username: input.username,
              userAddress: userAddress,
            },
          },
        });
      } catch (err) {
        console.log("login failed", err);
      }
    } else {
      alert("Please enter your username and address");
    }
  };

  return (
    <div className="modal" tabIndex="-1" role="dialog" id="exampleModal">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Login</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="form-group">
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="useraddress"
                placeholder="Enter useraddress"
                name="useraddress"
                defaultValue={userAddress}
              />
            </div>
          </div>
          <div className="form-group">
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="username"
                placeholder="Enter user name"
                name="username"
                onChange={(e) =>
                  setInput({ ...input, username: e.target.value })
                }
                defaultValue={input.username}
              />
            </div>
          </div>
          <div className="modal-footer">
            <div className="form-group">
              <div className="col-sm-offset-2 col-sm-10">
                <button
                  type="submit"
                  className="btn btn-default"
                  onClick={handleLogin}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Login.propTypes = {};

export default Login;
