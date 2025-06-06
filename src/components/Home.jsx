import React from 'react';
import { connectWallet } from './walletService'; // Adjust the path as needed
import './style.css';
const Home = () => {
  return (
    <>
      <div className="container">
        <h1 className="site-title">Proof of Hustle</h1>
        <p>Prove you're building. Mint your hustle on-chain.</p>
        {/* Use the imported connectWallet function directly */}
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
      {/* Remove these script tags. They are not needed here. */}
      {/* <script src='https://cdn.jsdelivr.net/npm/ethers@5.7.2/dist/ethers.umd.min.js'></script> */}
      {/* <script src='script.js'></script> */}
    </>
  );
};

export default Home;
