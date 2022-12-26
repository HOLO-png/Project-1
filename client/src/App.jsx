import {
  actions,
  EthProvider,
  initialState,
  reducer,
} from "./contexts/EthContext";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import CreateNFTs from "./pages/CreateNFTs";
import Header from "./components/Header";
import MyAssets from "./pages/MyAssets";
import NotFound from "./pages/NotFound";
import ReSellNFT from "./pages/ReSellNFT";
import Dashboard from "./pages/Dashboard";
import { useEffect } from "react";
import { useReducer } from "react";

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    window.ethereum.on("accountsChanged", function (accounts) {
      localStorage.clear();
      dispatch({
        type: actions.logout,
      });
    });
  });

  return (
    <BrowserRouter>
      <EthProvider>
        <div className="container-fluid">
          <div className="card card1 p-2">
            <div className="innercard p-2">
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/create-nft" element={<CreateNFTs />} />
                <Route path="/my-nft" element={<MyAssets />} />
                <Route path="/resell-nft" element={<ReSellNFT />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </div>
        </div>
      </EthProvider>
    </BrowserRouter>
  );
}

export default App;
