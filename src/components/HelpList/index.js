import React, { useState, useEffect } from "react";
import {
  Container,
  HelpRequestContainer,
  HelpContent,
  HelpH2,
  HelpH1,
  HelpImg,
  OnSiteCircle,
} from "./HelpListElements";
import ActivityIndicator from "../ActivityIndicator";

const HelpList = ({ helpAds }) => {
  const [fetchedAds, setFetchedAds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const ads = [];
    if (helpAds) {
      helpAds.forEach((ad) => {
        fetch(`https://${ad}`)
          .then((res) => res.json())
          .then((data) => {
            ads.push(data);
          });
      });
    }

    setTimeout(() => {
      setFetchedAds([...ads]);
      setIsLoading(false);
    }, 7000);
  }, [helpAds]);

  if (isLoading) {
    return <ActivityIndicator />;
  }
  return (
    <Container>
      {fetchedAds &&
        fetchedAds.map((request, index) => {
          return (
            <HelpRequestContainer key={index}>
              <div>
                <HelpImg src={require("../../images/meta.png")} />
              </div>
              <HelpContent>
                <HelpH1>{request.title}</HelpH1>
                <HelpH2>{request.description}</HelpH2>
                <HelpH2>{request.address}</HelpH2>
                <p>{request.helpAdCategory}</p>
              </HelpContent>
              <HelpH1>On-Site:</HelpH1>
              <OnSiteCircle active={!request.isOnline} />
            </HelpRequestContainer>
          );
        })}
    </Container>
  );
};

export default HelpList;
