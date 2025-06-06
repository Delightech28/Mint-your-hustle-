


// walletService.js

import { BrowserProvider, Contract } from 'ethers'; // Import BrowserProvider and Contract
import { toast } from 'sonner'; // Import toast from sonner
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
let hustleContract;

export const getHustleContractInstance = () => hustleContract;

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

export async function connectWallet(navigate) {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      // alert("Wallet connected: " + accounts[0]); // Old alert
      toast.success(`Wallet connected: ${accounts[0]}`, { description: "You are now connected to the DApp." }); // Custom toast

      provider = new BrowserProvider(window.ethereum);
      signer = await provider.getSigner();

      const network = await provider.getNetwork();
      if (network.chainId !== 43113n) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa869' }],
          });
          provider = new BrowserProvider(window.ethereum);
          signer = await provider.getSigner();
          toast.info("Switched to Avalanche Fuji C-Chain.", { description: "Please confirm in MetaMask." }); // Custom toast

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
              provider = new BrowserProvider(window.ethereum);
              signer = await provider.getSigner();
              toast.info("Added Avalanche Fuji C-Chain to MetaMask.", { description: "Please switch to it." }); // Custom toast

            } catch (addError) {
              console.error("Failed to add Fuji:", addError);
              // alert("Could not add Fuji Testnet to MetaMask."); // Old alert
              toast.error("Could not add Fuji Testnet to MetaMask.", { description: addError.message }); // Custom toast
              return;
            }
          } else {
            console.error("Failed to switch to Fuji:", switchError);
            // alert("Please switch your MetaMask network to Avalanche Fuji Testnet (43113)."); // Old alert
            toast.error("Failed to switch network.", { description: "Please switch your MetaMask network to Avalanche Fuji Testnet (43113)." }); // Custom toast
            return;
          }
        }
      }

      hustleContract = new Contract(contractAddress, contractABI, signer);
      window.hustleContract = hustleContract;

      if (navigate) {
        navigate('/mint-your-hustle');
      } else {
        console.warn("Navigate function not provided to connectWallet. Cannot redirect using React Router.");
      }

    } catch (error) {
      console.error("Connection error:", error);
      // alert("Wallet connection failed. Check console."); // Old alert
      toast.error("Wallet connection failed.", { description: error.message || "Check console for details." }); // Custom toast
    }
  } else {
    // alert("MetaMask not detected. Please install it."); // Old alert
    toast.warning("MetaMask not detected.", { description: "Please install the MetaMask browser extension to connect your wallet." }); // Custom toast
  }
}
