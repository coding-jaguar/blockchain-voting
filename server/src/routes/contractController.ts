import { Request, Response } from "express";
import { ethers } from "ethers";
import abi from "../ehtersSetup/Voting.json"; // ABI for the Voting contract

// Configure contract address and provider
const contractAddress = "0xYourContractAddress";
const provider = new ethers.providers.JsonRpcProvider("http://localhost:8545"); // Or your blockchain provider URL
const VotingAbi = abi.abi;

// Wallet for interacting with contract (use your private key and don't expose it in production)
const privateKey = "your-private-key";
const wallet = new ethers.Wallet(privateKey, provider);

// Contract instance
const votingContract = new ethers.Contract(contractAddress, VotingAbi, wallet);

// Add a candidate (onlyOwner function)
export const addCandidate = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    const tx = await votingContract.addCandidate(name);
    await tx.wait();

    res.json({ message: "Candidate added successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Add a voter (onlyOwner function)
export const addVoter = async (req: Request, res: Response) => {
  try {
    const { voterAddress, voterKey } = req.body;

    const tx = await votingContract.addVoter(
      voterAddress,
      ethers.utils.toUtf8Bytes(voterKey)
    );
    await tx.wait();

    res.json({ message: "Voter added successfully" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Start the election (onlyOwner function)
export const startElection = async (req: Request, res: Response) => {
  try {
    const tx = await votingContract.startElection();
    await tx.wait();

    res.json({ message: "Election started" });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// End the election (onlyOwner function)
export const endElection = async (req: Request, res: Response) => {
  try {
    const tx = await votingContract.endElection();
    await tx.wait();

    res.json({ message: "Election ended" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Cast a vote (onlyRegisteredVoter function)
export const vote = async (req: Request, res: Response) => {
  try {
    const { candidateId, voterKey } = req.body;

    const tx = await votingContract.vote(
      candidateId,
      ethers.utils.toUtf8Bytes(voterKey)
    );
    await tx.wait();

    res.json({ message: "Vote cast successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Validate a vote (onlyOwner function)
export const validateVote = async (req: Request, res: Response) => {
  try {
    const { voterAddress, backendKey } = req.body;

    const tx = await votingContract.validateVote(
      voterAddress,
      ethers.utils.toUtf8Bytes(backendKey)
    );
    await tx.wait();

    res.json({ message: "Vote validated" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get candidate information
export const getCandidate = async (req: Request, res: Response) => {
  try {
    const { candidateId } = req.params;

    const candidate = await votingContract.getCandidate(candidateId);

    res.json({ name: candidate[0], voteCount: candidate[1] });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get voter information
export const getVoterInfo = async (req: Request, res: Response) => {
  try {
    const { voterAddress } = req.params;

    const voterInfo = await votingContract.getVoterInfo(voterAddress);

    res.json({
      hasVoted: voterInfo[0],
      isValidated: voterInfo[1],
      isRegistered: voterInfo[2],
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get total votes
export const getTotalVotes = async (req: Request, res: Response) => {
  try {
    const totalVotes = await votingContract.getTotalVotes();
    res.json({ totalVotes });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
