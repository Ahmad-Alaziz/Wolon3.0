import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import {
  api,
  utils,
  NotificationItem,
  channels,
} from '@epnsproject/frontend-sdk';

import Dashboard from './pages/dashboard';
import VerticalNavbar from './components/VerticalNavBar';
import HelpOthers from './pages/helpOthers';
import { Support } from './pages/support';

import './App.scss';
import HelpForm from './components/HelpForm';
import { ChatRoom } from './pages/chatRoom';

const { CHANNEL_ADDRESS } = process.env;

const DAPP = ({ dappContract, address, memberNFT, provider, chainId }) => {
  const pageNumber = 1;
  const itemsPerPage = 20;

  const [collapsed, setCollapsed] = useState(false);
  const [helpAds, setHelpAds] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const handleCollapsedChange = (checked) => {
    setCollapsed(checked);
  };

  const fetchNotifications = async () => {
    const { count, results } = await api.fetchNotifications(
      address,
      itemsPerPage,
      pageNumber
    );
    setNotifications(results);
  };

  const subscribeToChannel = async () => {
    //get channel basic info
    const details = await channels.getChannelByAddress(
      '0xA7a283F1aF418Ca2DBd4d0BE2441d1942aFbf6B8'
    );

    //check if user is subscribed to channel
    const isSubscribed = channels.isUserSubscribed(address, CHANNEL_ADDRESS);

    if (!isSubscribed) {
      channels.optIn(provider.getSigner(), CHANNEL_ADDRESS, chainId, address, {
        onSuccess: () => {
          console.log('User optedIn');
        },
      });
    }
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
    subscribeToChannel();
    fetchNotifications();
  }, [dappContract]);

  return (
    <div className={`app`}>
      {notifications.map((oneNotification) => (
        <NotificationItem
          notificationTitle={oneNotification.title}
          notificationBody={oneNotification.message}
          cta={oneNotification.cta}
          app={oneNotification.app}
          icon={oneNotification.icon}
          image={oneNotification.image}
          url={oneNotification.url}
        />
      ))}
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
              provider={provider}
              address={address}
            />
          }
        />
        <Route
          path='helpOthers'
          element={<HelpOthers dappContract={dappContract} helpAds={helpAds} />}
        />
        <Route
          path='getHelp'
          element={
            <HelpForm
              dappContract={dappContract}
              address={address}
              provider={provider}
            />
          }
        />
        <Route path='messages' element={<ChatRoom address={address} />} />
        <Route path='chat' element={<ChatRoom address={address} />} />
        <Route
          path='vote'
          element={
            <HelpForm
              dappContract={dappContract}
              address={address}
              provider={provider}
            />
          }
        />
        <Route
          path='vote'
          element={
            <HelpForm
              dappContract={dappContract}
              address={address}
              provider={provider}
            />
          }
        />
        <Route
          path='support'
          element={<Support address={address} provider={provider} />}
        />
      </Routes>
    </div>
  );
};

export default DAPP;
