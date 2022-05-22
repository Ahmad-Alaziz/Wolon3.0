import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ethers, providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { transformMemberData } from "./utils";
import Wolon from "./abi/Wolon.json";

import "./App.css";
import Home from "./pages";
import DAPP from "./DAPP";

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

const App = () => {
  const [dappContract, setDappContract] = useState(null);
  const [memberNFT, setMemberNFT] = useState(null);
  const [chainId, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();

  const web3Modal = new Web3Modal({
    network: "mainnet",
    cacheProvider: true,
    providerOptions: {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: process.env.REACT_APP_INFURA_ID,
        },
      },
    },
  });

  const reset = () => {
    setAddress("");
    setProvider(undefined);
    web3Modal.clearCachedProvider();
  };

  const connect = async () => {
    if (!process.env.REACT_APP_INFURA_ID) {
      throw new Error("Missing Infura Id");
    }
    const web3Provider = await web3Modal.connect();

    web3Provider.on("disconnect", reset);

    const accounts = await web3Provider.enable();
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);

    const provider = new providers.Web3Provider(web3Provider);
    setProvider(provider);
  };

  useEffect(() => {
    if (!provider) {
      return;
    }
    const signer = provider.getSigner();
    const dappContract = new ethers.Contract(
      REACT_APP_CONTRACT_ADDRESS,
      Wolon.abi,
      signer
    );
    setDappContract(dappContract);

    const checkIsMember = async () => {
      try {
        const memberNFT = await dappContract.checkIfUserHasNFT();
        if (memberNFT) {
          setMemberNFT(transformMemberData(memberNFT));
        }
      } catch (error) {
        console.warn("Error: ", error);
      }
    };

    checkIsMember();
  }, [address, provider]);

  return (
    <Router>
      <Routes>
        <Route
          index
          element={
            <Home
              dappContract={dappContract}
              connect={connect}
              address={address}
            />
          }
          exact
        />
        <Route path="dapp/*" element={<DAPP />} />
      </Routes>
    </Router>
  );
};

export default App;
