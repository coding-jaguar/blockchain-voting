import { Request, Response } from "express";
import { prisma } from "../db/prisma"; // Assuming prisma is properly set up
import { jwtDecode } from "jwt-decode";
import {
  getAddressFromPublicKey,
  getTotalVotes,
  validateVote,
  vote,
} from "../ehtersSetup/ether-utils";
import dotenv from "dotenv";

dotenv.config();

const backendKey = process.env.BACKEND_KEY || "secret";

// Create a new vote
export const createVote = async (req: Request, res: Response) => {
  const { candidateId, electionId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  interface DecodedToken {
    id: string;
    // Add other properties as needed
  }

  const decodedToken: DecodedToken = jwtDecode(token as string);
  try {
    // Check if the voter has already voted in this election

    const voter = await prisma.voter.findUnique({
      where: { userId: decodedToken.id },
      include: { user: true },
    });

    if (!voter) {
      return res
        .status(404)
        .json({ message: "User or voter information not found" });
    }
    const voterId = voter.id;
    const existingVote = await prisma.vote.findFirst({
      where: { voterId, electionId },
    });

    if (existingVote) {
      return res
        .status(400)
        .json({ message: "You have already voted in this election." });
    }
    console.log(candidateId, electionId, voterId);

    // Create a new vote
    const newVote = await prisma.vote.create({
      data: {
        voter: { connect: { id: voterId } },
        candidate: { connect: { id: candidateId } },
        election: { connect: { id: electionId } },
      },
    });

    const voterAddress = voter.user.publicKey;
    // await validateVote(voterAddress, backendKey);
    // const totalVotes = await getTotalVotes();
    // console.log(totalVotes);

    res.status(201).json(newVote);
  } catch (error) {
    res.status(500).json({ message: "Failed to create vote", error });
  }
};

export const validateVoteControl = async (req: Request, res: Response) => {
  const { voterAddress } = req.body;
  try {
    const tx = await validateVote(voterAddress, backendKey);
    console.log("Vote validated");
    const totalVotes = await getTotalVotes();
    console.log(totalVotes);
    res.status(200).json({ message: "Vote validated" });
  } catch (error: any) {
    console.error("Error validating vote:", error.message);
    res.status(500).json({ message: "Failed to validate vote", error });
  }
};

// Get all votes
export const getAllVotes = async (req: Request, res: Response) => {
  try {
    const votes = await prisma.vote.findMany({
      include: {
        voter: true,
        candidate: true,
        election: true,
      },
    });
    res.status(200).json(votes);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch votes", error });
  }
};

// Get a specific vote by ID
export const getVoteById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const vote = await prisma.vote.findUnique({
      where: { id },
      include: {
        voter: true,
        candidate: true,
        election: true,
      },
    });

    if (!vote) {
      return res.status(404).json({ message: "Vote not found" });
    }

    res.status(200).json(vote);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch vote", error });
  }
};

// Delete a vote by ID
export const deleteVote = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const vote = await prisma.vote.delete({
      where: { id },
    });

    res.status(200).json({ message: "Vote deleted successfully", vote });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete vote", error });
  }
};

// Update a vote (if necessary)
export const updateVote = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { candidateId } = req.body;

  try {
    const updatedVote = await prisma.vote.update({
      where: { id },
      data: {
        candidate: { connect: { id: candidateId } },
      },
    });

    res.status(200).json(updatedVote);
  } catch (error) {
    res.status(500).json({ message: "Failed to update vote", error });
  }
};
