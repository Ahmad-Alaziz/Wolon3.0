import React, { useState, useEffect } from 'react';

import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import HeroSection from '../components/HeroSection';
import InfoSection from '../components/InfoSection';

import {
  sectionOne,
  sectionTwo,
  sectionThree,
  sectionFour,
  sectionFive,
} from '../components/InfoSection/Data';
import Services from '../components/Services';

import Web3Modal from 'web3modal';
import WalletConnectProvider from '@walletconnect/ethereum-provider';
import { Contract, providers, utils } from 'ethers';

import { formatAuthMessage } from '../utils';
import { DAI } from '../constants';
import StepExampleGroup from '../components/Steps';

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const web3Modal = new Web3Modal({
    network: 'mainnet',
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
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState();

  function reset() {
    console.log('reset');
    setAddress('');
    setProvider(undefined);
    web3Modal.clearCachedProvider();
  }

  async function connect() {
    if (!process.env.REACT_APP_INFURA_ID) {
      throw new Error('Missing Infura Id');
    }
    const web3Provider = await web3Modal.connect();

    web3Provider.on('disconnect', reset);

    const accounts = await web3Provider.enable();
    setAddress(accounts[0]);
    setChainId(web3Provider.chainId);

    const provider = new providers.Web3Provider(web3Provider);
    setProvider(provider);
  }

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
      <StepExampleGroup {...sectionFive} connect={connect} address={address} />
      <Footer />
    </>
  );
}

export default Home;
