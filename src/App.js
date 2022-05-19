import { useState, useEffect, useCallback } from "react";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Contract, providers, utils } from "ethers";
import { Waku } from "js-waku";

import {
  formatAuthMessage,
  sendMessage,
  SimpleChatMessage,
  ContentTopic,
} from "./utils";
import { DAI } from "./constants";

const App = () => {
  const [waku, setWaku] = useState(undefined);
  const [wakuStatus, setWakuStatus] = useState("None");
  const [chainId, setChainId] = useState(1);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState();
  const [sendCounter, setSendCounter] = useState(0);
  const [messages, setMessages] = useState([]);

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

  const sendMessageOnClick = () => {
    if (wakuStatus !== "Ready") return;

    sendMessage(`Here is message #${sendCounter}`, waku, new Date()).then(() =>
      console.log("Message sent")
    );
    setSendCounter(sendCounter + 1);
  };

  const processIncomingMessage = useCallback((wakuMessage) => {
    if (!wakuMessage.payload) return;

    const { text, timestamp } = SimpleChatMessage.decode(wakuMessage.payload);

    const time = new Date();
    time.setTime(timestamp);

    const message = { text, timestamp: time };

    setMessages((messages) => {
      return [message].concat(messages);
    });
  }, []);

  useEffect(() => {
    if (!!waku) return;
    if (wakuStatus !== "None") return;

    setWakuStatus("Starting");

    Waku.create({ bootstrap: { default: true } }).then((waku) => {
      setWaku(waku);
      setWakuStatus("Connecting");
      waku.waitForRemotePeer().then(() => {
        setWakuStatus("Ready");
      });
    });
  }, [waku, wakuStatus]);

  useEffect(() => {
    if (!waku) return;

    waku.relay.addObserver(processIncomingMessage, [ContentTopic]);

    return function cleanUp() {
      waku.relay.deleteObserver(processIncomingMessage, [ContentTopic]);
    };
  }, [waku, wakuStatus, processIncomingMessage]);

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
      <div>
        <header>
          <p>Waku node's status: {wakuStatus}</p>
          <button
            onClick={sendMessageOnClick}
            disabled={wakuStatus !== "Ready"}
          >
            Send Message
          </button>
          <ul>
            {messages.map((msg) => {
              return (
                <li>
                  <p>
                    {msg.timestamp.toString()}: {msg.text}
                  </p>
                </li>
              );
            })}
          </ul>
        </header>
      </div>
    </div>
  );
};

export default App;
