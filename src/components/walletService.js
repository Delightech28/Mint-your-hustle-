// walletService.js

import { BrowserProvider, Contract } from 'ethers';
import { toast } from 'sonner';

const contractAddress = "0xA7011E842Ae2dD14C61DE899B56FE45dA584faa2";

const contractABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_fullName", "type": "string" },
      { "internalType": "string", "name": "_hustleType", "type": "string" },
      { "internalType": "string", "name": "_description", "type": "string" }
    ],
    "name": "submitHustle",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getHustles",
    "outputs": [
      {
        "components": [
          { "internalType": "string", "name": "fullName", "type": "string" },
          { "internalType": "string", "name": "hustleType", "type": "string" },
          { "internalType": "string", "name": "description", "type": "string" },
          { "internalType": "address", "name": "submitter", "type": "address" }
        ],
        "internalType": "struct ProofOfHustle.Hustle[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

let provider;
let signer;
let hustleContract; // This global variable will be set here.

export const getHustleContractInstance = () => hustleContract; // Still useful for fetchAllHustles

export async function fetchAllHustles() {
  if (!hustleContract) {
    console.error("Hustle contract not initialized. Connect wallet first.");
    return [];
  }
  try {
    const rawHustles = await hustleContract.getHustles();
    const formattedHustles = rawHustles.map(hustle => ({
      fullName: hustle.fullName,
      hustleType: hustle.hustleType,
      description: hustle.description,
      submitter: hustle.submitter,
    }));
    return formattedHustles;
  } catch (error) {
    console.error("Error fetching hustles:", error);
    return [];
  }
}

export async function connectWallet(callback) { // Accepts the callback
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const walletAddress = accounts[0];
      toast.success(`Wallet connected: ${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`, { description: "You are now connected to the DApp." });

      provider = new BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      const network = await provider.getNetwork();
      if (network.chainId !== 43113n) { // Check for Fuji Testnet (43113)
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa869' }], // Hex for 43113
          });
          // Re-initialize provider and signer after network switch
          provider = new BrowserProvider(window.ethereum);
          signer = await provider.getSigner();
          toast.info("Switched to Avalanche Fuji C-Chain.", { description: "Please confirm in MetaMask." });

        } catch (switchError) {
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xa869',
                  chainName: 'Avalanche Fuji C-Chain',
                  nativeCurrency: {
                    name: 'AVAX',
                    symbol: 'AVAX',
                    decimals: 18
                  },
                  rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                  blockExplorerUrls: ['https://testnet.snowtrace.io/']
                }]
              });
              // Re-initialize provider and signer after adding chain
              provider = new BrowserProvider(window.ethereum);
              signer = await provider.getSigner();
              toast.info("Added Avalanche Fuji C-Chain to MetaMask.", { description: "Please switch to it." });

            } catch (addError) {
              console.error("Failed to add Fuji:", addError);
              toast.error("Could not add Fuji Testnet to MetaMask.", { description: addError.message });
              if (callback) callback(null, null); // Ensure context state is cleared on failure
              return;
            }
          } else {
            console.error("Failed to switch to Fuji:", switchError);
            toast.error("Failed to switch network.", { description: "Please switch your MetaMask network to Avalanche Fuji Testnet (43113)." });
            if (callback) callback(null, null); // Ensure context state is cleared on failure
            return;
          }
        }
      }

      // Instantiate the contract with the signer
      hustleContract = new Contract(contractAddress, contractABI, signer);
      
      // IMPORTANT: Call the callback to update the WalletContext state
      if (callback) {
        callback(walletAddress, hustleContract);
      }

    } catch (error) {
      console.error("Connection error:", error);
      toast.error("Wallet connection failed.", { description: error.message || "Check console for details." });
      if (callback) callback(null, null); // Clear state if connection fails
    }
  } else {
    toast.warning("MetaMask not detected.", { description: "Please install the MetaMask browser extension to connect your wallet." });
    if (callback) callback(null, null); // Clear state if MetaMask not detected
  }
}