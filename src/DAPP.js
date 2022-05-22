import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/dashboard';
import VerticalNavbar from './components/VerticalNavBar';
import HelpOthers from './pages/helpOthers';

import './App.scss';
import HelpForm from './components/HelpForm';
import { ChatRoom } from './pages/chatRoom';

const DAPP = ({ dappContract, address, memberNFT }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [helpAds, setHelpAds] = useState([]);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  useEffect(() => {
    const getAdsList = async () => {
      try {
        const adsList = await dappContract.getAds();
        if (adsList) {
          setHelpAds([...adsList]);
        }
      } catch (error) {
        console.warn('Error: ', error);
      }
    };

    getAdsList();
  }, [dappContract]);

  return (
    <div className={`app`}>
      <VerticalNavbar
        collapsed={collapsed}
        toggled={true}
        handleCollapse={handleCollapsedChange}
      />
      <Routes>
        <Route
          index
          element={
            <Dashboard
              dappContract={dappContract}
              memberNFT={memberNFT}
              setHelpAds={setHelpAds}
            />
          }
        />
        <Route
          path='helpOthers'
          element={<HelpOthers dappContract={dappContract} helpAds={helpAds} />}
        />
        <Route
          path='getHelp'
          element={<HelpForm dappContract={dappContract} address={address} />}
        />
        <Route path='messages' element={<ChatRoom />} />
        <Route path='chat' element={<ChatRoom />} />
        <Route path='vote' element={<HelpForm />} />
        <Route path='support' element={<ChatRoom />} />
      </Routes>
    </div>
  );
};

export default DAPP;
