import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { connectWallet, getContract } from './components/ethereum'; // ✅ Fix the import path
import Home from './components/Home';
import HustleForm from './components/HustleForm';
import Feed from './components/Feed';
import Success from './components/Success';

function App() {
  const [wallet, setWallet] = useState({ provider: null, signer: null, account: null });

  const handleConnect = async () => {
    try {
      const result = await connectWallet();
      setWallet(result);
      return result;
    } catch (error) {
      alert('Failed to connect wallet: ' + error.message);
    }
  };

  const submitHustle = async (fullName, hustleType, description) => {
    if (!wallet.signer) {
      alert('Please connect your wallet first.');
      return;
    }

    try {
      const contract = getContract(wallet.signer);
      const tx = await contract.submitHustle(fullName, hustleType, description);
      await tx.wait(); // MetaMask prompts for gas fee here
      window.location.href = '/feed';
    } catch (err) {
      alert('Failed to submit hustle: ' + err.message);
    }
  };

  const getHustles = async () => {
    if (!wallet.signer) {
      alert('Please connect your wallet first.');
      return [];
    }

    const contract = getContract(wallet.signer);
    return await contract.getHustles();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home connectWallet={handleConnect} />} />
        <Route
          path="/form"
          element={
            wallet.signer ? (
              <HustleForm submitHustle={submitHustle} wallet={wallet} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/feed" element={<Feed getHustles={getHustles} />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;