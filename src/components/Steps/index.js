import React from 'react';
import { Icon, Step } from 'semantic-ui-react';

import { Button } from '../ButtonElements';
import { BtnWrap, Img, ImgWrap } from '../InfoSection/InfoElements';

const StepExampleGroup = () => (
  <Step.Group>
    <Step>
      <div class='link active step' href='#' style={{ height: '70%' }}>
        <div style={{ width: '80px', marginRight: '20px' }}>
          <Img src={require('../../images/metamask-fox.svg')} alt='Logo' />
        </div>
        <div style={{ flexDirection: 'column' }}>
          <Step.Content>
            <Step.Title>MetaMask</Step.Title>
            <Step.Description>Connect to MetaMask</Step.Description>
          </Step.Content>
        </div>
      </div>
    </Step>

    <Step disabled>
      <div class='link active step' href='#' style={{ height: '70%' }}>
        <div style={{ width: '80px', marginRight: '20px' }}>
          <Img src={require('../../images/worldcoin.png')} alt='Logo' />
        </div>
        <div style={{ flexDirection: 'column' }}>
          <Step.Content>
            <Step.Title>WorldCoin</Step.Title>
            <Step.Description>Verify yourself using WorldCoin</Step.Description>
          </Step.Content>
        </div>
      </div>
    </Step>

    <Step disabled>
      <div class='link active step' href='#' style={{ height: '70%' }}>
        <div style={{ width: '60px', marginRight: '20px' }}>
          <Img src={require('../../images/nft.svg')} alt='Logo' />
        </div>
        <div style={{ flexDirection: 'column' }}>
          <Step.Content>
            <Step.Title>NFT</Step.Title>
            <Step.Description>Mint an NFT</Step.Description>
          </Step.Content>
        </div>
      </div>
    </Step>
  </Step.Group>
);

export default StepExampleGroup;
