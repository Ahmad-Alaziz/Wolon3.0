<h3 >
  FrontEnd
</h3>

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E) 
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![SASS](https://img.shields.io/badge/SASS-hotpink.svg?style=for-the-badge&logo=SASS&logoColor=white)

<div align="right">
<h3 >
  Web3
</h3>

![Solidity](https://img.shields.io/badge/Solidity-%23363636.svg?style=for-the-badge&logo=solidity&logoColor=white)
![SuperFluid](https://img.shields.io/badge/-SuperFluid-orange?style=for-the-badge)
![EPNS](https://img.shields.io/badge/-EPNS-blue?style=for-the-badge)
![WorldCoin](https://img.shields.io/badge/-WorldCoin-grey?style=for-the-badge)
![IPFS](https://img.shields.io/badge/-IPFS%2FFilecoin-green?style=for-the-badge)
![Waku](https://img.shields.io/badge/-Waku-yellow?style=for-the-badge)
![WalletConnect](https://img.shields.io/badge/-WalletConnect-black?style=for-the-badge)

</div>

<!-- LOGO -->
<br />
<h1>
<p align="center">
  <img src="https://user-images.githubusercontent.com/72296822/170457080-74bd0f66-89f7-4238-b4a5-0296c6bec26d.png" width="150" height="150">
  <br>Wolon 3.0
</h1>
  <p align="center">
    The web3 decentralized ecosystem where volunteers and help seekers meet.
    <br />
    </p>
</p>
</br>
</br>

## About The Project
Wolon3.0 is a multi award winning hackathon project developed by Ahmad Alaziz and Pawel Kowalewski, The webapp is incomplete and requires a lot of polishing up; however it goes to represent a possible solution for a sustainable decentralzied ecosystem for exchanging services.

## Idea
Help-Seekers pay for posted help-request adverts by susbscribing to a continious cashflow that transfers money per-second, meaning the seekers don't have to pay for a second more than what they need. The money collected from the help-seekers will be controlled by the volunteers (Help-Givers). Volunteers earn tokens in exchange for help services. Tokens grant volunteers more voting power, on how the money should be distributed, and more money when the distribution occurs. Supporters can support our cause by also opening up a continious cashflow stream into the general balance.

Volunteers can also vote to give money to charities.

## Technology
[SmartContract](https://github.com/KowalewskiPawel/WolonSmart/blob/main/contracts/Wolon.sol)
<br/>
The app is build with the use of Hardhat and Solidity, on the side of the smart contract. We have used several extra libraries in our smart contract. Frontend is built in React, we use WalletConnect to connect the wallets, Worldcoin for users authentication, and we store the messages with Web3 Storage as a JSON files, that are added to the contract. Moreover, users can communicate via WakuConnect chat, and get notifications with EPNS. To keep the ad live, users have to open money streams with Superfluid, which is also used as a part of sending support to our app.
