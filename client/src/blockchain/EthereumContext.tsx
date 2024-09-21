import React, { createContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import abi from "./Voting.json";
// Declare window.ethereum globally
declare global {
  interface Window {
    ethereum: any;
  }
}

// Define the context state interface
interface EthereumContextProps {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
}

// Create the context with default values
export const EthereumContext = createContext<EthereumContextProps>({
  provider: null,
  account: null,
  contract: null,
  connectWallet: async () => {},
});

// Contract ABI and Address (placeholders, replace with your actual contract details)
const CONTRACT_ADDRESS = import.meta.env.VITE_contractAddress as string;
const CONTRACT_ABI = abi.abi;

// Create a provider component
export const EthereumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);

  // Function to connect the wallet
  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3Provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const accounts = await web3Provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        setProvider(web3Provider);

        // Set up the contract once the wallet is connected
        const signer = web3Provider.getSigner();
        const contractInstance = new ethers.Contract(
          CONTRACT_ADDRESS,
          CONTRACT_ABI,
          signer
        );
        setContract(contractInstance);
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("MetaMask not installed");
    }
  };

  // Effect to automatically connect if the user has already authorized MetaMask
  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(
          window.ethereum as any
        );
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(web3Provider);

          // Set up the contract with an existing provider
          const signer = web3Provider.getSigner();
          const contractInstance = new ethers.Contract(
            CONTRACT_ADDRESS,
            CONTRACT_ABI,
            signer
          );
          setContract(contractInstance);
        }
      }
    };
    checkConnection();
  }, []);

  return (
    <EthereumContext.Provider
      value={{ provider, account, contract, connectWallet }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
