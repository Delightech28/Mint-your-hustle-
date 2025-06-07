// src/components/HustleForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
// REMOVE THIS LINE: import { getHustleContractInstance } from './walletService'; // No longer needed
import { toast } from 'sonner'; // Import toast for notifications
import { useWallet } from '../context/WalletContext';

const HustleForm = () => {
  const [fullName, setFullName] = useState('');
  const [hustleType, setHustleType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(''); // Still useful for internal form messages
  const navigate = useNavigate();
  const { hustleContract } = useWallet(); // Get hustleContract and walletAddress from context

  useEffect(() => {
    if (!hustleContract) {
      setMessage("Wallet not connected. Please go back to the home page and connect.");
      toast.error("Wallet not connected!", { description: "Please connect your wallet on the home page." });
    }
  }, [hustleContract]); // Dependency is on the context's hustleContract

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hustleContract) {
      toast.error("Wallet not connected!", { description: "Please connect your wallet first." });
      return;
    }

    if (!fullName || !hustleType || !description) {
      toast.warning("Missing Information", { description: "Please fill in all fields before submitting." });
      return;
    }

    setLoading(true);
    setMessage("Submitting hustle...");
    toast.info("Submitting your hustle...", { duration: 3000 }); // Info toast

    try {
      const tx = await hustleContract.submitHustle(fullName, hustleType, description);

      setMessage("Transaction sent! Waiting for confirmation...");
      toast.info("Transaction sent!", { description: "Waiting for confirmation on the blockchain...", duration: 5000 });
      console.log("Transaction hash:", tx.hash);

      const receipt = await tx.wait();
      // --- FIX START (Already added in previous step, confirming it's there) ---
      let displayHash = "N/A"; // Default display value
      if (receipt && receipt.transactionHash) { // Check if receipt and transactionHash exist
        displayHash = `${receipt.transactionHash.substring(0, 8)}...`;
        setMessage(`Hustle submitted successfully! Transaction confirmed: ${receipt.transactionHash}`);
        toast.success("Hustle submitted successfully!", { description: `Transaction confirmed: ${displayHash}` });
        console.log("Transaction receipt:", receipt);
      } else {
        // Handle cases where receipt or hash is missing but tx.wait() still resolved
        setMessage("Hustle submitted, but transaction hash could not be retrieved.");
        toast.success("Hustle submitted!", { description: "Transaction confirmed, but hash not found." });
        console.warn("Transaction confirmed, but receipt or hash was undefined:", receipt);
      }
      // --- FIX END ---

      // Clear the form
      setFullName('');
      setHustleType('');
      setDescription('');

      // Redirect to the feed page after successful minting
      navigate('/feed');

    } catch (error) {
      console.error("Error submitting hustle:", error);
      if (error.code === 4001) {
        toast.error("Transaction Rejected", { description: "You rejected the transaction in MetaMask." });
        setMessage("Transaction rejected by user.");
      } else {
        toast.error("Submission Failed!", { description: error.message || "An unknown error occurred during submission." });
        setMessage(`Failed to submit hustle: ${error.message || error.code}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    // Outer container for the page background
    <div className="min-h-screen bg-gradient-to-br from-white to-gray-50 text-gray-800 flex flex-col items-center justify-center font-sans relative overflow-hidden p-4">
      {/* Subtle Background Blobs (Optional, matching home page) */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      {/* Glassmorphism Form Container */}
      <div className="
        w-full max-w-md p-8 rounded-2xl shadow-xl border border-opacity-30 border-white
        bg-white/30 backdrop-filter backdrop-blur-lg backdrop-saturate-150
        flex flex-col items-center z-10 space-y-6
      ">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Mint Your Hustle</h1>
        {message && <p className="text-sm text-center text-gray-700">{message}</p>} {/* Internal message display */}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div>
            <label htmlFor="fullName" className="block text-gray-700 text-sm font-semibold mb-2">Full Name:</label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              className="
                w-full p-3 rounded-lg border border-gray-300 bg-white/50
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200 text-gray-900 placeholder-gray-500
              "
              placeholder="e.g., Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="hustleType" className="block text-gray-700 text-sm font-semibold mb-2">Hustle Type:</label>
            <input
              type="text"
              id="hustleType"
              value={hustleType}
              onChange={(e) => setHustleType(e.target.value)}
              required
              className="
                w-full p-3 rounded-lg border border-gray-300 bg-white/50
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200 text-gray-900 placeholder-gray-500
              "
              placeholder="e.g., Web3 DApp, NFT Art, Open Source"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-gray-700 text-sm font-semibold mb-2">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="4"
              className="
                w-full p-3 rounded-lg border border-gray-300 bg-white/50
                focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                transition-all duration-200 text-gray-900 placeholder-gray-500 resize-y
              "
              placeholder="Briefly describe your amazing hustle..."
            ></textarea>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="
              w-full flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white
              font-bold text-lg rounded-full shadow-lg hover:from-blue-600 hover:to-purple-700
              transition-all duration-300 ease-in-out transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
            "
          >
            {loading ? 'Submitting...' : 'Mint Your Hustle'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default HustleForm;