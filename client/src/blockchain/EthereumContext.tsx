import React, { createContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import abi from "./Voting.json";

declare global {
  interface Window {
    ethereum: any;
  }
}

interface EthereumContextProps {
  provider: ethers.providers.Web3Provider | null;
  account: string | null;
  contract: ethers.Contract | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  isConnected: boolean;
  networkName: string | null;
}

console.log(import.meta.env.VITE_contractAddress);

export const EthereumContext = createContext<EthereumContextProps>({
  provider: null,
  account: null,
  contract: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  isConnected: false,
  networkName: null,
});

const CONTRACT_ADDRESS = import.meta.env.VITE_contractAddress as string;
const CONTRACT_ABI = abi.abi;

export const EthereumProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [provider, setProvider] =
    useState<ethers.providers.Web3Provider | null>(null);
  const [account, setAccount] = useState<string | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [networkName, setNetworkName] = useState<string | null>(null);

  const setupContract = useCallback(async (signer: ethers.Signer) => {
    try {
      const contractInstance = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      setContract(contractInstance);
    } catch (error) {
      console.error("Error setting up contract:", error);
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const network = await web3Provider.getNetwork();

        const accounts = await web3Provider.send("eth_requestAccounts", []);
        const signer = web3Provider.getSigner();

        setAccount(accounts[0]);
        setProvider(web3Provider);
        setIsConnected(true);
        setNetworkName("Ganache"); // Set a custom name for Ganache

        await setupContract(signer);

        console.log("Connected to account:", accounts[0]);
        console.log("Network connected: Ganache");
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
        alert(
          error instanceof Error
            ? error.message
            : "An error occurred while connecting"
        );
      }
    } else {
      alert("MetaMask not installed");
    }
  };

  const disconnectWallet = () => {
    setProvider(null);
    setAccount(null);
    setContract(null);
    setIsConnected(false);
    setNetworkName(null);
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
        const accounts = await web3Provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setProvider(web3Provider);
          setIsConnected(true);
          setNetworkName("Ganache");
          const signer = web3Provider.getSigner();
          await setupContract(signer);
        }
      }
    };
    checkConnection();
  }, [setupContract]);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = (accounts: string[]) => {
        setAccount(accounts[0] || null);
        setIsConnected(accounts.length > 0);
      };

      const handleChainChanged = (_chainId: string) => {
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, []);

  return (
    <EthereumContext.Provider
      value={{
        provider,
        account,
        contract,
        connectWallet,
        disconnectWallet,
        isConnected,
        networkName,
      }}
    >
      {children}
    </EthereumContext.Provider>
  );
};
