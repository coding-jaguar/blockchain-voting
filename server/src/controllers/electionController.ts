import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import {
  endElection,
  resetElection,
  startElection as se,
} from "../ehtersSetup/ether-utils";
const prisma = new PrismaClient();

// Create a new election
export const createElection = async (req: Request, res: Response) => {
  try {
    const { isActive, name } = req.body;
    const candidates = await prisma.candidate.findMany();

    const newElection = await prisma.election.create({
      data: {
        name,
        isActive,
        candidates: {
          connect: candidates.map((candidate) => ({ id: candidate.id })),
        },
      },
    });
    se();
    return res.status(201).json(newElection);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Failed to create election" });
  }
};

// Get all elections
export const getAllElections = async (req: Request, res: Response) => {
  try {
    const elections = await prisma.election.findMany({
      include: {
        candidates: true,
      },
    });

    return res.status(200).json(elections);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch elections" });
  }
};

// Get a single election by ID
export const getElectionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const election = await prisma.election.findUnique({
      where: { id },
      include: {
        candidates: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!election) {
      return res.status(404).json({ error: "Election not found" });
    }
    console.log(election);

    return res.status(200).json(election);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch election" });
  }
};

export const updateElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { isActive, candidates } = req.body;

    // Update the election and add new candidates without removing the existing ones
    const updatedElection = await prisma.election.update({
      where: { id },
      data: {
        isActive,
        candidates: {
          connect: candidates.map((candidateId: string) => ({
            id: candidateId,
          })), // `connect` to add existing candidates
        },
      },
      include: {
        candidates: true, // Optional: if you want to return the updated list of candidates
      },
    });

    return res.status(200).json(updatedElection);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update election" });
  }
};

export const startElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const election = await prisma.election.update({
      where: { id },
      data: { isActive: true },
    });

    return res.status(200).json(election);
  } catch (error) {
    return res.status(500).json({ error: "Failed to start election" });
  }
};

export const endElections = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;

    const election = await prisma.election.update({
      where: { id },
      data: { isActive: false },
    });

    endElection();

    return res.status(200).json(election);
  } catch (error: any) {
    return res
      .status(500)
      .json({ error: "Failed to end election" + error.message });
  }
};

// Delete an election
export const deleteElection = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.election.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Failed to delete election" });
  }
};

export const reset = async (req: Request, res: Response) => {
  try {
    await prisma.vote.deleteMany();
    resetElection();
    const voteCount = await prisma.vote.count();
    return res
      .status(200)
      .json({ message: "Election reset successfully", voteCount });
  } catch (error) {
    return res.status(500).json({ error: "Failed to reset election" });
  }
};
