import React, { useState, useEffect } from 'react';
import { ethers } from "ethers";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Footer from "../components/Footer";
import HeroSection from "../components/HeroSection";
import InfoSection from "../components/InfoSection";

import {
  sectionOne,
  sectionTwo,
  sectionThree,
  sectionFour,
  sectionFive,
} from "../components/InfoSection/Data";
import Services from "../components/Services";

import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/ethereum-provider";
import { Contract, providers, utils } from "ethers";

import { formatAuthMessage, transformMemberData } from "../utils";
import { DAI } from "../constants";
import Wolon from "../abi/Wolon.json";
import StepExampleGroup from "../components/Steps";

const { REACT_APP_CONTRACT_ADDRESS } = process.env;

function Home() {
  const [isOpen, setIsOpen] = useState(false);
  const [dappContract, setDappContract] = useState(null);
  const [memberNFT, setMemberNFT] = useState(null);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

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

  const mintNFT = async () => {
    try {
      const mintTxn = await dappContract.mintMembershipNFT();
      await mintTxn.wait();
    } catch (error) {
      console.warn("Error: ", error);
    }
  };

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
    <>
      <Sidebar isOpen={isOpen} toggle={toggle} />
      <Navbar toggle={toggle} connect={connect} address={address} />
      <HeroSection />
      <InfoSection {...sectionOne} />
      <InfoSection {...sectionTwo} />
      <InfoSection {...sectionThree} />
      <InfoSection {...sectionFour} />
      <Services />
      <StepExampleGroup
        {...sectionFive}
        connect={connect}
        address={address}
        mintNFT={mintNFT}
      />
      <Footer />
    </>
  );
}

export default Home;
