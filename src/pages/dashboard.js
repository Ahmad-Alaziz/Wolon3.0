import React, { useEffect, useState } from 'react';
import { Web3Storage } from 'web3.storage';
import { ethers } from 'ethers';
import { Container } from '../components/SignIn/SigninElements';
import {
  HelpRequestContainer,
  HelpContent,
  HelpH2,
  HelpH1,
  HelpImg,
  OnSiteCircle,
} from '../components/HelpList/HelpListElements';
import ActivityIndicator from '../components/ActivityIndicator';

const Dashboard = ({ dappContract, memberNFT }) => {
  const [budgetBalance, setBudgetBalance] = useState(null);
  const [helpAd, setHelpAd] = useState(null);
  const [helpAdTitle, setHelpAdTitle] = useState('');
  const [helpAdContent, setHelpAdContent] = useState('');
  const [helpAdCategory, setHelpAdCategory] = useState('');
  const [helpAdIsOnline, setHelpAdIsOnline] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const postHelpAd = async (link) => {
    try {
      const helpAd = await dappContract.addHelpAd(link);
    } catch (error) {
      console.warn('Error: ', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const storage = new Web3Storage({
        token: process.env.REACT_APP_WEB3_STORAGE,
      });

      const helpObject = {
        title: helpAdTitle,
        description: helpAdContent,
        isOnline: helpAdIsOnline,
        helpAdCategory: helpAdCategory,
      };

      const blob = new Blob([JSON.stringify(helpObject)], {
        type: 'application/json',
      });
      const file = new File([blob], 'helpPost.json');

      const cid = await storage.put([file], {
        onRootCidReady: (localCid) => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
          console.log('> 📡 sending files to web3.storage ');
        },
        onStoredChunk: (bytes) =>
          console.log(
            `> 🛰 sent ${bytes.toLocaleString()} bytes to web3.storage`
          ),
      });

      const helpRequestLink = `${cid}.ipfs.dweb.link/helpPost.json`;

      const addRequest = await dappContract.addHelpAd(helpRequestLink);
      await addRequest.wait();
    } catch (error) {
      console.warn('Error: ', error);
    }
  };

  const getBudgetBalance = async () => {
    try {
      const balance = await dappContract.getBudgetBalance();
      if (balance) {
        setBudgetBalance(ethers.utils.formatEther(balance));
      }
    } catch (error) {
      console.warn('Error: ', error);
    }
  };

  const getUserAd = async () => {
    try {
      const userAd = await dappContract.getUserAd();
      if (userAd) {
        fetch(`https://${userAd}`)
          .then((res) => res.json())
          .then((data) => {
            setHelpAd(data);
          });
      }
    } catch (error) {
      console.warn('Error: ', error);
    }
  };

  const fetchUserData = async () => {
    setIsLoading(true);
    await getUserAd();
    await getBudgetBalance();
    setIsLoading(false);
  };

  useEffect(() => {
    fetchUserData();
  }, [dappContract]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <Container>
      <div style={{ color: 'white', marginLeft: '20%', marginTop: '10%' }}>
        <p>Helper Tokens: {memberNFT.helperTokens}</p>
        <p>Found Help: {memberNFT.foundHelp}</p>
        <p>Budget Balance: {budgetBalance}</p>
        {!helpAd ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '400px',
              marginTop: '2%',
            }}
          >
            <h4>Currently you are not looking for help</h4>
            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: '10px',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <label>
                Is Online?:
                <input
                  name='isOnline'
                  type='checkbox'
                  checked={helpAdIsOnline}
                  onChange={(event) => setHelpAdIsOnline(event.target.checked)}
                />
              </label>
              <label>
                Pick select category:
                <select
                  value={helpAdCategory}
                  onChange={(event) => setHelpAdCategory(event.target.value)}
                >
                  {' '}
                  <option value='grapefruit'>Grapefruit</option>
                  <option value='lime'>Lime</option>
                  <option value='coconut'>Coconut</option>
                  <option value='mango'>Mango</option>
                </select>
              </label>
              <label>
                Title:
                <input
                  type='text'
                  value={helpAdTitle}
                  onChange={(event) => setHelpAdTitle(event.target.value)}
                />{' '}
              </label>
              <label>
                Description:
                <textarea
                  value={helpAdContent}
                  onChange={(event) => setHelpAdContent(event.target.value)}
                />{' '}
              </label>
              <input type='submit' value='Post your help ad' />
            </form>
          </div>
        ) : (
          <HelpRequestContainer>
            <div>
              <HelpImg src={require('../images/meta.png')} />
            </div>
            <HelpContent>
              <HelpH1>{helpAd.title}</HelpH1>
              <HelpH2>{helpAd.description}</HelpH2>
              <p>{helpAd.helpAdCategory}</p>
            </HelpContent>
            <HelpH1>On-Site:</HelpH1>
            <OnSiteCircle active={helpAd.isOnline} />
          </HelpRequestContainer>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
