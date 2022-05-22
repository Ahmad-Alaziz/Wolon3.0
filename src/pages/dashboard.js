import React, { useEffect, useState } from 'react';
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
  const [isLoading, setIsLoading] = useState(false);

  const postHelpAd = async (link) => {
    try {
      const helpAd = await dappContract.addHelpAd(link);
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
          <p>Go to GetHelp</p>
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
