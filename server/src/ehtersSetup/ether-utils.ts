import { ethers } from "ethers";
import abi from "./Voting.json"; // ABI for the Voting contract
import dotenv from "dotenv";
dotenv.config();

// Configure contract address and provider
const contractAddress = process.env.contractAddress as string;
const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545"); // Or your blockchain provider URL
const VotingAbi = abi.abi;

// Wallet for interacting with contract (use your private key and don't expose it in production)
const privateKey = process.env.privateKey as string;
const wallet = new ethers.Wallet(privateKey, provider);

// Contract instance
const votingContract = new ethers.Contract(contractAddress, VotingAbi, wallet);

// Add a candidate (onlyOwner function)
export const addCandidate = async (name: string) => {
  try {
    const tx = await votingContract.addCandidate(name);
    await tx.wait();
    console.log("Candidate added successfully");
  } catch (error: any) {
    console.error("Error adding candidate:", error.message);
  }
};

// Add a voter (onlyOwner function)
export const addVoter = async (voterAddress: string, voterKey: string) => {
  try {
    const tx = await votingContract.addVoter(
      voterAddress,
      ethers.utils.toUtf8Bytes(voterKey)
    );
    await tx.wait();
    console.log("Voter added successfully");
  } catch (error: any) {
    console.error("Error adding voter:", error.message);
  }
};

// Start the election (onlyOwner function)
export const startElection = async () => {
  try {
    const tx = await votingContract.startElection();
    await tx.wait();
    console.log("Election started");
  } catch (error: any) {
    console.error("Error starting election:", error.message);
  }
};

// End the election (onlyOwner function)
export const endElection = async () => {
  try {
    const tx = await votingContract.endElection();
    await tx.wait();
    console.log("Election ended");
  } catch (error: any) {
    console.error("Error ending election:", error.message);
  }
};

// Cast a vote (onlyRegisteredVoter function)
export const vote = async (candidateId: number, voterKey: string) => {
  try {
    const tx = await votingContract.vote(
      candidateId,
      ethers.utils.toUtf8Bytes(voterKey)
    );
    await tx.wait();
    console.log("Vote cast successfully");
  } catch (error: any) {
    console.error("Error casting vote:", error.message);
  }
};

// Validate a vote (onlyOwner function)
export const validateVote = async (
  voterAddress: string,
  backendKey: string
) => {
  try {
    const tx = await votingContract.validateVote(
      voterAddress,
      ethers.utils.toUtf8Bytes(backendKey)
    );
    await tx.wait();
    console.log("Vote validated");
  } catch (error: any) {
    console.error("Error validating vote:", error.message);
  }
};

// Get candidate information
export const getCandidate = async (candidateId: number) => {
  try {
    const candidate = await votingContract.getCandidate(candidateId);
    console.log("Candidate info:", {
      name: candidate[0],
      voteCount: candidate[1],
    });
    return { name: candidate[0], voteCount: candidate[1] };
  } catch (error: any) {
    console.error("Error fetching candidate info:", error.message);
  }
};

// Get voter information
export const getVoterInfo = async (voterAddress: string) => {
  try {
    const voterInfo = await votingContract.getVoterInfo(voterAddress);
    console.log("Voter info:", {
      hasVoted: voterInfo[0],
      isValidated: voterInfo[1],
      isRegistered: voterInfo[2],
    });
    return {
      hasVoted: voterInfo[0],
      isValidated: voterInfo[1],
      isRegistered: voterInfo[2],
    };
  } catch (error: any) {
    console.error("Error fetching voter info:", error.message);
  }
};

// Get total votes
export const getTotalVotes = async () => {
  try {
    const totalVotes = await votingContract.getTotalVotes();
    console.log("Total votes:", totalVotes);
    return totalVotes;
  } catch (error: any) {
    console.error("Error fetching total votes:", error.message);
  }
};
