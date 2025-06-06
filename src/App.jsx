import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import { useState } from 'react';
import { connectWallet, getContract } from './wallet';
import Home from './components/Home';
import HustleForm from './components/HustleForm';
import Feed from './components/Feed';
import Success from './components/Success';

function App() {
  const [wallet, setWallet] = useState({ provider: null, signer: null, account: null });

  const handleConnect = async () => {
    const result = await connectWallet();
    setWallet(result);
    return result;
  };

  const submitHustle = async (fullName, hustleType, description) => {
    try {
      const contract = getContract(wallet.signer);
      const tx = await contract.submitHustle(fullName, hustleType, description);
      await tx.wait();
      window.location.href = '/feed'; // or use `useNavigate()` for cleaner navigation
    } catch (err) {
      alert('Failed to submit hustle: ' + err.message);
    }
  };

  const getHustles = async () => {
    const contract = getContract(wallet.signer);
    return await contract.getHustles();
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home connectWallet={handleConnect} />} />
        <Route path="/form" element={<HustleForm submitHustle={submitHustle} />} />
        <Route path="/feed" element={<Feed getHustles={getHustles} />} />
        <Route path="/success" element={<Success />} />
      </Routes>
    </Router>
  );
}

export default App;

