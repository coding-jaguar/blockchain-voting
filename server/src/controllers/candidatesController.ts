import { Candidate } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../db/prisma";

// Get all candidates
export const getAllCandidates = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const candidates: Candidate[] = await prisma.candidate.findMany({
      include: {
        user: true,
        election: true,
      },
    });
    res.json(candidates);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidates", error });
  }
};

// Get a candidate by ID
export const getCandidateById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    const candidate = await prisma.candidate.findUnique({
      where: { id },
      include: {
        user: true,
        election: true,
      },
    });

    if (!candidate) {
      res.status(404).json({ message: "Candidate not found" });
      return;
    }

    res.json(candidate);
  } catch (error) {
    res.status(500).json({ message: "Error fetching candidate", error });
  }
};

// Create a new candidate
export const createCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const {
    userId,
    partyName,
    manifesto,
    electionId,
    idOnBc,
  }: {
    userId: string;
    partyName?: string;
    manifesto?: string;
    electionId?: string;
    idOnBc: number;
  } = req.body;

  try {
    const newCandidate = await prisma.candidate.create({
      data: {
        userId,
        partyName,
        manifesto,
        electionId,
        idOnBc,
      },
    });
    res.status(201).json(newCandidate);
  } catch (error) {
    res.status(500).json({ message: "Error creating candidate", error });
  }
};

// Update a candidate
export const updateCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  const {
    partyName,
    manifesto,
    voteCount,
    electionId,
  }: {
    partyName?: string;
    manifesto?: string;
    voteCount?: number;
    electionId?: string;
  } = req.body;

  try {
    const updatedCandidate = await prisma.candidate.update({
      where: { id },
      data: {
        partyName,
        manifesto,
        voteCount,
        electionId,
      },
    });
    res.json(updatedCandidate);
  } catch (error) {
    res.status(500).json({ message: "Error updating candidate", error });
  }
};

// Delete a candidate
export const deleteCandidate = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id } = req.params;
  try {
    await prisma.candidate.delete({
      where: { id },
    });
    res.json({ message: "Candidate deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting candidate", error });
  }
};
