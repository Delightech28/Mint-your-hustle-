// components/HustleForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { getHustleContractInstance } from './walletService'; // Import the contract getter

const HustleForm = () => {
  const [fullName, setFullName] = useState('');
  const [hustleType, setHustleType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Get the navigate function

  // Access the contract instance
  const hustleContract = getHustleContractInstance();

  useEffect(() => {
    if (!hustleContract) {
      setMessage("Wallet not connected. Please go back to the home page and connect.");
    }
  }, [hustleContract]); // Dependency: re-check if contract becomes available

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission reload

    if (!hustleContract) {
      setMessage("Wallet is not connected. Please connect your wallet first.");
      return;
    }

    if (!fullName || !hustleType || !description) {
      setMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setMessage("Submitting hustle...");

    try {
      const tx = await hustleContract.submitHustle(fullName, hustleType, description);

      setMessage("Transaction sent! Waiting for confirmation...");
      console.log("Transaction hash:", tx.hash);

      const receipt = await tx.wait();
      setMessage(`Hustle submitted successfully! Transaction confirmed: ${receipt.transactionHash}`);
      console.log("Transaction receipt:", receipt);

      // Clear the form
      setFullName('');
      setHustleType('');
      setDescription('');

      // Redirect to the feed page after successful minting
      navigate('/feed'); // Redirect to your feed page

    } catch (error) {
      console.error("Error submitting hustle:", error);
      if (error.code === 4001) {
        setMessage("Transaction rejected by user.");
      } else {
        setMessage(`Failed to submit hustle: ${error.message || error.code}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Submit Your Hustle</h1>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="fullName">Full Name:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="hustleType">Hustle Type:</label>
          <input
            type="text"
            id="hustleType"
            value={hustleType}
            onChange={(e) => setHustleType(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Submitting...' : 'Mint Your Hustle'}
        </button>
      </form>
    </div>
  );
};

export default HustleForm;