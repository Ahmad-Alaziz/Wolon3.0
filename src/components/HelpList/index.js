import React from 'react';
import {
  Container,
  HelpRequestContainer,
  HelpContent,
  HelpH2,
  HelpH1,
  HelpImg,
  OnSiteCircle,
} from './HelpListElements';

const mock = [
  {
    address: '0xA7a283F1aF418Ca2Ddd4f0BE2441d1942aFbf6B8',
    description:
      'Lorem sandk ksjadkjashd kjasndkjhasd akjshdkjahs dkjhaskd akjshdkjashdkj ajkshdkjahsd jkhask dhskjad',
    onSite: true,
  },
  {
    address: '0xA7a283F1aF418Ca2Ddd4f0BE2441d1942aFbf6B8',
    description:
      'Lorem sandk ksjadkjashd kjasndkjhasd akjshdkjahs dkjhaskd akjshdkjashdkj ajkshdkjahsd jkhask dhskjad',
    onSite: false,
  },
  {
    address: '0xA7a283F1aF418Ca2Ddd4f0BE2441d1942aFbf6B8',
    description:
      'Lorem sandk ksjadkjashd kjasndkjhasd akjshdkjahs dkjhaskd akjshdkjashdkj ajkshdkjahsd jkhask dhskjad',
    onSite: false,
  },
];

const HelpList = ({ dappContract }) => {
  return (
    <Container>
      {/* {mock.map((request, index) => {
        return (
          <HelpRequestContainer key={index}>
            <div>
              <HelpImg src={require("../../images/meta.png")} />
            </div>
            <HelpContent>
              <HelpH1>{request.title}</HelpH1>
              <HelpH2>{request.description}</HelpH2>
              <p>{request.helpAdCategory}</p>
            </HelpContent>
            <HelpH1>On-Site:</HelpH1>
            <OnSiteCircle active={request.isOnline} />
          </HelpRequestContainer>
        );
      })} */}
    </Container>
  );
};

export default HelpList;
