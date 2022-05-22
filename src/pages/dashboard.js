import React, { useEffect, useState } from "react";
import { Web3Storage } from "web3.storage";
import { ethers } from "ethers";
import SignIn from "../components/SignIn";
import { Container } from "../components/SignIn/SigninElements";

const Dashboard = ({ dappContract, memberNFT }) => {
  const [budgetBalance, setBudgetBalance] = useState(null);
  const [helpAd, setHelpAd] = useState(null);
  const [helpAdTitle, setHelpAdTitle] = useState("");
  const [helpAdContent, setHelpAdContent] = useState("");
  const [helpAdCategory, setHelpAdCategory] = useState("");
  const [helpAdIsOnline, setHelpAdIsOnline] = useState("");

  const postHelpAd = async (link) => {
    try {
      const helpAd = await dappContract.addHelpAd(link);
    } catch (error) {
      console.warn("Error: ", error);
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
        type: "application/json",
      });
      const file = new File([blob], "helpPost.json");

      const cid = await storage.put([file], {
        onRootCidReady: (localCid) => {
          console.log(`> 🔑 locally calculated Content ID: ${localCid} `);
          console.log("> 📡 sending files to web3.storage ");
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
      console.warn("Error: ", error);
    }
  };

  useEffect(() => {
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
          setHelpAd(userAd);
        }
      } catch (error) {
        console.warn("Error: ", error);
      }
    };

    getUserAd();
    getBudgetBalance();
  }, [dappContract]);

  return (
    <Container>
      <div style={{ color: "white", marginLeft: "20%", marginTop: "10%" }}>
        <p>Helper Tokens: {memberNFT.helperTokens}</p>
        <p>Found Help: {memberNFT.foundHelp}</p>
        <p>Budget Balance: {budgetBalance}</p>
        {!helpAd ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "400px",
              marginTop: "2%",
            }}
          >
            <h4>Currently you are not looking for help</h4>
            <form
              onSubmit={handleSubmit}
              style={{
                marginTop: "10px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label>
                Is Online?:
                <input
                  name="isOnline"
                  type="checkbox"
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
                  {" "}
                  <option value="grapefruit">Grapefruit</option>
                  <option value="lime">Lime</option>
                  <option value="coconut">Coconut</option>
                  <option value="mango">Mango</option>
                </select>
              </label>
              <label>
                Title:
                <input
                  type="text"
                  value={helpAdTitle}
                  onChange={(event) => setHelpAdTitle(event.target.value)}
                />{" "}
              </label>
              <label>
                Description:
                <textarea
                  value={helpAdContent}
                  onChange={(event) => setHelpAdContent(event.target.value)}
                />{" "}
              </label>
              <input type="submit" value="Post your help ad" />
            </form>
          </div>
        ) : (
          <p>Your helpAd</p>
        )}
      </div>
    </Container>
  );
};

export default Dashboard;
