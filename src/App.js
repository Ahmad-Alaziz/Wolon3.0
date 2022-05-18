import { useState } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Contract, providers, utils } from "ethers";

import { formatAuthMessage } from "./utils";
import { DAI } from "./constants";

const App = () => {
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

  const [chainId, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();

  function reset() {
    console.log("reset");
    setAddress("");
    setProvider(undefined);
    web3Modal.clearCachedProvider();
  }

  async function connect() {
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
  }

  async function signMessage() {
    if (!provider) {
      throw new Error("Provider not connected");
    }
    const msg = formatAuthMessage(address, chainId);
    const sig = await provider.send("personal_sign", [msg, address]);
    console.log("Signature", sig);
    console.log("isValid", utils.verifyMessage(msg, sig) === address);
  }

  async function transferDai() {
    if (!provider) {
      throw new Error("Provider not connected");
    }
    const contract = new Contract(DAI.address, DAI.abi, provider.getSigner());
    const res = await contract.transfer(address, utils.parseEther("1"));
    console.log("res", res);
  }

  return (
    <div>
      <div>{provider ? "Connected!" : "Not connected"}</div>
      {address ? (
        <>
          <div>{address}</div>
          <button onClick={signMessage}>Authenticate</button>
          <button onClick={transferDai}>Transfer DAI</button>
        </>
      ) : (
        <button onClick={connect}>Connect</button>
      )}
    </div>
  );
};

export default App;
