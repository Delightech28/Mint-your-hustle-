import { ethers } from 'ethers';
import { contractAddress, contractABI } from './contract';

export async function connectWallet() {
  if (window.ethereum) {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const network = await provider.getNetwork();
      if (network.chainId !== 43113) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xa869' }],
          });
        } catch (switchError) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: '0xa869',
                chainName: 'Avalanche Fuji C-Chain',
                nativeCurrency: { name: 'AVAX', symbol: 'AVAX', decimals: 18 },
                rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
                blockExplorerUrls: ['https://testnet.snowtrace.io/']
              }]
            });
          } else {
            throw switchError;
          }
        }
      }
      return { provider, signer, account: accounts[0] };
    } catch (error) {
      throw error;
    }
  } else {
    throw new Error('MetaMask not detected. Please install it.');
  }
}

export function getContract(signer) {
  return new ethers.Contract(contractAddress, contractABI, signer);
} 