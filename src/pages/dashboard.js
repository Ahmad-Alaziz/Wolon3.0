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
  const [helperAddress, setHelperAddress] = useState("");

  const postHelpAd = async (link) => {
    try {
      const helpAd = await dappContract.addHelpAd(link);
    } catch (error) {
      console.warn("Error: ", error);
    }
  };

  const getBudgetBalance = async () => {
    try {
      const balance = await dappContract.getBudgetBalance();
      if (balance) {
        setBudgetBalance(ethers.utils.formatEther(balance));
      }
    } catch (error) {
      console.warn("Error: ", error);
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
      console.warn("Error: ", error);
    }
  };

  const removeAd = async () => {
    try {
      setIsLoading(true);
      const removeAd = await dappContract.removeUserAd();
      await removeAd.wait();
      setIsLoading(false);
    } catch (error) {
      console.warn("Error: ", error);
      setIsLoading(false);
    }
  };

  const helpFound = async () => {
    try {
      setIsLoading(true);
      const solved = await dappContract.helpFound(helperAddress);
      await solved.wait();
      setIsLoading(false);
    } catch (error) {
      console.warn("Error: ", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      setIsLoading(true);
      await getUserAd();
      await getBudgetBalance();
      setIsLoading(false);
    };
    fetchUserData();
  }, [dappContract]);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <Container>
      <div style={{ color: "white", marginLeft: "20%", marginTop: "10%" }}>
        <p>Helper Tokens: {memberNFT.helperTokens}</p>
        <p>Found Help: {memberNFT.foundHelp}</p>
        <p>Budget Balance: {budgetBalance}</p>
        {!helpAd ? (
          <p>Go to GetHelp</p>
        ) : (
          <HelpRequestContainer>
            <div>
              <HelpImg src={require("../images/meta.png")} />
            </div>
            <HelpContent>
              <HelpH1>{helpAd.title}</HelpH1>
              <HelpH2>{helpAd.description}</HelpH2>
              <p>{helpAd.helpAdCategory}</p>
            </HelpContent>
            <HelpH1>On-Site:</HelpH1>
            <OnSiteCircle active={!helpAd.isOnline} />
            <button onClick={removeAd}>Remove Ad</button>
            <input
              type="text"
              value={helperAddress}
              onChange={(event) => setHelperAddress(event.target.value)}
            />
            <button onClick={helpFound}>Help Found</button>
          </HelpRequestContainer>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
