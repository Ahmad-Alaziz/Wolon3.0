import React from 'react';
import { Step } from 'semantic-ui-react';
import {
  Column1,
  Column2,
  Heading,
  Img,
  ImgWrap,
  InfoContainer,
  InfoRow,
  InfoWrapper,
  Subtitle,
  TextWrapper,
  TopLine,
} from '../InfoSection/InfoElements';

const StepExampleGroup = ({
  topLine,
  headline,
  description,
  img,
  alt,
  connect,
}) => (
  <InfoContainer lightBg={true} id={'signup'}>
    <InfoWrapper>
      <InfoRow imgStart={true}>
        <Column1>
          <TextWrapper>
            <TopLine> {topLine} </TopLine>
            <Heading lightText={false}>{headline}</Heading>
            <Subtitle darkText={true}>{description}</Subtitle>
          </TextWrapper>
        </Column1>
        <Column2>
          <ImgWrap>
            <Img src={img} alt={alt} />
          </ImgWrap>
        </Column2>
      </InfoRow>

      <Step.Group>
        <Step>
          <div
            class='link active step'
            onClick={connect}
            style={{ height: '70%' }}
          >
            <div style={{ width: '60px', marginRight: '20px' }}>
              <Img src={require('../../images/meta.png')} alt='Logo' />
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
          <div class='link active step' style={{ height: '70%' }}>
            <div style={{ width: '80px', marginRight: '20px' }}>
              <Img src={require('../../images/worldcoin.png')} alt='Logo' />
            </div>
            <div style={{ flexDirection: 'column' }}>
              <Step.Content>
                <Step.Title>WorldCoin</Step.Title>
                <Step.Description>
                  Verify yourself using WorldCoin
                </Step.Description>
              </Step.Content>
            </div>
          </div>
        </Step>

        <Step disabled>
          <div class='link active step' style={{ height: '70%' }}>
            <div style={{ width: '60px', marginRight: '20px' }}>
              <Img src={require('../../images/nft.png')} alt='Logo' />
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
    </InfoWrapper>
  </InfoContainer>
);

export default StepExampleGroup;
