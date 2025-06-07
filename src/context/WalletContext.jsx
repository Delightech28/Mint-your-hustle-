// src/context/WalletContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { connectWallet as connectWalletService } from '../components/walletService'; // Alias to avoid name conflict
import { toast } from 'sonner';

const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState(null); // null when not connected
  const [hustleContract, setHustleContract] = useState(null); // Store contract here

  const connectWallet = async () => {
    await connectWalletService((address, contract) => {
      setWalletAddress(address);
      setHustleContract(contract);
    });
  };

  // Optional: Re-connect on mount if MetaMask is already connected
  useEffect(() => {
    const checkWalletOnLoad = async () => {
      if (window.ethereum && window.ethereum.selectedAddress) {
        // If MetaMask is already connected, try to set the address
        // Note: This won't trigger the full `connectWallet` flow,
        // but if `walletService` stores the instance, it can retrieve it.
        // Or you can call the full connectWallet here.
        console.log("MetaMask already connected:", window.ethereum.selectedAddress);
        await connectWallet(); // Try to connect again to re-establish contract and address
      }
    };
    checkWalletOnLoad();

    // Listen for account changes (MetaMask user changes account)
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          toast.info("Wallet account changed!", { description: `Switched to: ${accounts[0].substring(0,6)}...` });
          // You might need to re-initialize the contract if the signer changes
          connectWallet(); // Re-run connection logic to update signer/contract
        } else {
          setWalletAddress(null);
          setHustleContract(null);
          toast.warning("Wallet disconnected.", { description: "Please connect your wallet." });
        }
      });
      window.ethereum.on('chainChanged', (chainId) => {
          toast.info("Network changed!", { description: `New chain ID: ${parseInt(chainId, 16)}` });
          // Re-initialize contract on chain change
          connectWallet();
      });
    }

    // Cleanup listener on unmount
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => {});
        window.ethereum.removeListener('chainChanged', () => {});
      }
    };

  }, []); // Run once on mount

  return (
    <WalletContext.Provider value={{ walletAddress, connectWallet, hustleContract }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);