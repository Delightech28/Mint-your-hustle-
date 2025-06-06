


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { connectWallet } from '.components/ethereum';
const Home = () => {
  const navigate = useNavigate();

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      console.log('Connected:', result.account);
      navigate('/form');
    } catch (err) {
      alert('Wallet connection failed: ' + err.message);
    }
  };

  return (
    <div className="container">
      <h1 className="site-title">Proof of Hustle</h1>
      <p>Prove you're building. Mint your hustle on-chain.</p>
      <button onClick={handleConnect}>Connect Wallet</button>
    </div>
  );
};

export default Home;