// ethersSetup.ts
import ethers from "ethers";
import dotenv from "dotenv";
import abiJson from "./Voting.json";

// Load environment variables from the .env file
dotenv.config();

// Set up ethers.js provider, wallet, and contract once
const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY as string, provider);

// ABI and contract address
const contractAddress = process.env.contractAddress as string;
const contractABI = abiJson.abi;

// Create a contract instance
const contract = new ethers.Contract(contractAddress, contractABI, wallet);

// Export the initialized components
export { provider, wallet, contract };
