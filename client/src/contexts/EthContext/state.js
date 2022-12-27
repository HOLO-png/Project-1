const actions = {
  init: "INIT",
  loginSuccess: "LOGIN_SUCCESS",
  logout: "LOGOUT",
  getAuth: "GET_AUTH",
  updateToken: "UPDATE_TOKEN",
};

const initialState = {
  loaded: false,
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contracts: null,
  tokenSaleAddress: null,
  userTokens: 1,
  userAddress: "",
  auth: {
    username: JSON.parse(localStorage.getItem("auth"))?.username || "",
    userAddress: JSON.parse(localStorage.getItem("auth"))?.userAddress || "",
  },
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    case actions.getAuth:
      return state;
    case actions.updateToken:
      return { ...state, ...data };
    case actions.loginSuccess:
      return { ...state, auth: data.auth };
    case actions.logout:
      return {
        ...state,
        auth: {
          username: "",
          userAddress: "",
        },
      };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export { actions, initialState, reducer };
