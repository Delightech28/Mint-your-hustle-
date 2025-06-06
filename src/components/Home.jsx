import React from 'react';

const Home = ({ connectWallet }) => (
  <div className="container">
    <h1 className="site-title">Proof of Hustle</h1>
    <p>Prove you're building. Mint your hustle on-chain.</p>
    <button onClick={connectWallet}>Connect Wallet</button>
  </div>
);

export default Home; 