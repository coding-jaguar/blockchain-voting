import { ethers } from "ethers";
import abi from "./Voting.json"; // ABI for the Voting contract
import dotenv from "dotenv";
dotenv.config();
import { prisma } from "../db/prisma";

// Configure contract address and provider
const contractAddress = process.env.contractAddress as string;
const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545"); // Or your blockchain provider URL
const VotingAbi = abi.abi;

// Wallet for interacting with contract (use your private key and don't expose it in production)
const privateKey = process.env.privateKey as string;
const wallet = new ethers.Wallet(privateKey, provider);

if (!contractAddress || !privateKey) {
  throw new Error("Missing contract address or private key in .env file");
}

// Contract instance
const votingContract = new ethers.Contract(contractAddress, VotingAbi, wallet);

// Add a candidate (onlyOwner function)
export const addCandidate = async (candidateAddress: string, name: string) => {
  try {
    const tx = await votingContract.addCandidate(candidateAddress, name);
    await tx.wait();
    console.log("Candidate added successfully");
  } catch (error: any) {
    console.error("Error adding candidate:", error.message);
  }
};

// Delete a candidate (onlyOwner function)
export const deleteCandidate = async (candidateAddress: string) => {
  try {
    const tx = await votingContract.deleteCandidate(candidateAddress);
    await tx.wait();
    console.log("Candidate deleted successfully");
  } catch (error: any) {
    console.error("Error deleting candidate:", error.message);
  }
};

// Add a voter (onlyOwner function)
export const addVoter = async (voterAddress: string) => {
  try {
    const tx = await votingContract.addVoter(voterAddress);
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

// Cast a vote
export const vote = async (candidateAddress: string) => {
  try {
    const tx = await votingContract.vote(candidateAddress);
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
export const getCandidate = async (candidateAddress: string) => {
  try {
    const candidate = await votingContract.getCandidate(candidateAddress);
    console.log("Candidate info:", {
      name: candidate[0],
      voteCount: candidate[1].toString(),
    });
    return { name: candidate[0], voteCount: candidate[1].toString() };
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
      votedCandidate: voterInfo[2],
    });
    return {
      hasVoted: voterInfo[0],
      isValidated: voterInfo[1],
      votedCandidate: voterInfo[2],
    };
  } catch (error: any) {
    console.error("Error fetching voter info:", error.message);
  }
};

// Get total votes
export const getTotalVotes = async () => {
  try {
    const totalVotes = await votingContract.getTotalVotes();
    const votesArray = totalVotes.map((vote: ethers.BigNumber) =>
      vote.toString()
    );
    console.log("Total votes:", votesArray);
    return votesArray;
  } catch (error: any) {
    console.error("Error fetching total votes:", error.message);
  }
};

// Get all candidates
export const getAllCandidates = async () => {
  try {
    const result = await votingContract.getAllCandidates();
    const candidateAddresses = result[0];
    const names = result[1];
    const voteCounts = result[2];

    const candidates = candidateAddresses.map(
      (address: string, index: number) => ({
        address,
        name: names[index],
        voteCount: voteCounts[index].toString(),
      })
    );

    console.log("All candidates:", candidates);
    return candidates;
  } catch (error: any) {
    console.error("Error fetching all candidates:", error.message);
  }
};

// Get all voters
export const getAllVoters = async () => {
  try {
    const result = await votingContract.getAllVoters();
    const voterAddresses = result[0];
    const hasVotedArray = result[1];
    const isValidatedArray = result[2];
    const votedCandidatesArray = result[3];

    const voters = voterAddresses.map((address: string, index: number) => ({
      address,
      hasVoted: hasVotedArray[index],
      isValidated: isValidatedArray[index],
      votedCandidate: votedCandidatesArray[index],
    }));

    console.log("All voters:", voters);
    return voters;
  } catch (error: any) {
    console.error("Error fetching all voters:", error.message);
  }
};

// Reset election (onlyOwner function)
export const resetElection = async () => {
  try {
    const tx = await votingContract.resetElection();
    await tx.wait();
    console.log("Election reset");
  } catch (error: any) {
    console.error("Error resetting election:", error.message);
  }
};

// Self-destruct the contract (onlyOwner function)
export const selfDestruct = async () => {
  try {
    const tx = await votingContract.selfDestruct();
    await tx.wait();
    console.log("Contract self-destructed");
  } catch (error: any) {
    console.error("Error self-destructing contract:", error.message);
  }
};

// Utility function to compute address from public key
export function publicKeyToAddress(publicKey: string) {
  // Ensure the public key is in the correct format
  let formattedKey = publicKey.startsWith("0x") ? publicKey : "0x" + publicKey;

  // If the key is 130 characters long (65 bytes), it's uncompressed, so we need to remove the '04' prefix
  if (formattedKey.length === 132) {
    formattedKey = "0x" + formattedKey.slice(4);
  }
  console.log("Formatted key:", publicKey);

  console.log("Formatted key:", formattedKey);
  // Compute the address
  const address = ethers.utils.computeAddress(formattedKey);

  console.log(address);

  return address;
}

// Utility function to get address from public key hash
export const getAddressFromPublicKey = (publicKey: string): string => {
  // Ensure the public key starts with '0x'
  if (!publicKey.startsWith("0x")) {
    publicKey = "0x" + publicKey;
  }

  // Hash the public key using keccak256
  const publicKeyHash = ethers.utils.keccak256(publicKey);

  // Take the last 20 bytes of the hash (40 characters) to form the address
  const address = "0x" + publicKeyHash.slice(-40);

  return ethers.utils.getAddress(address); // Ensure the address is checksummed
};
