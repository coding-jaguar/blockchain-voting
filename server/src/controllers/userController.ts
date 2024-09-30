// controllers/userController.ts

import { Request, Response } from "express";
import { prisma } from "../db/prisma";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// import { contract, provider } from "../ehtersSetup/ethersSetup";
import {
  addCandidate,
  addVoter,
  getVoterInfo,
  publicKeyToAddress,
} from "../ehtersSetup/ether-utils";

type UserType = "ADMIN" | "VOTER" | "CANDIDATE";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userType: UserType;
  };
}

export const loginUser = async (req: Request, res: Response) => {
  console.log("Login request received");

  const { username, password } = req.body;

  console.log(req.body);

  try {
    const user = await prisma.user.findUnique({
      where: { username },
      include: { voterInfo: true, candidateInfo: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid password." });
    }

    const token = jwt.sign(
      {
        id: user.id,
        userType: user.userType,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "2d" }
    );

    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      message: "Login successful",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login." });
  }
};

export const registerAdmin = async (req: Request, res: Response) => {
  const { username, password, publicKey, userType, phoneNumber } = req.body;

  if (userType !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Only admin accounts can be registered this way." });
  }

  // Hash the password before storing
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        publicKey,
        userType,
        phoneNumber,
      },
    });
    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Create User - Only Admins
export const createUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, password, publicKey, userType, phoneNumber } = req.body;
    console.log(req.body);

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.saltRounds as string) || 10
    );
    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        publicKey,
        userType,
        phoneNumber,
      },
    });

    if (userType == "CANDIDATE") {
      const election = await prisma.election.findFirst({
        where: { isActive: true },
      });

      const candidateCount = await prisma.candidate.count();
      const newCandidate = await prisma.candidate.create({
        data: {
          user: {
            connect: { id: newUser.id },
          },
          idOnBc: candidateCount,
          election: election ? { connect: { id: election.id } } : undefined,
        },
      });

      // contract.createCandidate(newCandidate.idOnBc, publicKey);

      // Add the new candidate to the election's candidates list
      if (election) {
        await prisma.election.update({
          where: { id: election.id },
          data: {
            candidates: {
              connect: { id: newCandidate.id },
            },
          },
        });
      }
      if (publicKey) {
        const address = publicKey;
        addCandidate(address, username);
      }
    }

    if (userType == "VOTER") {
      const newVoter = await prisma.voter.create({
        data: {
          user: {
            connect: { id: newUser.id },
          },
          hasVoted: false,
        },
      });
      if (publicKey) {
        const address = publicKey;
        addVoter(address);
      }
    }

    res.status(201).json(newUser);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Read User - Users and Admins
export const getUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;

  if (req.user?.id !== id && req.user?.userType !== "ADMIN") {
    return res.status(403).json({ message: "Access denied." });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: { voterInfo: true, candidateInfo: true },
    });
    if (!user) return res.status(404).json({ message: "User not found." });
    res.json(user);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

// Update User - Only Admins
export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  console.log(req.user?.id, id);

  if (req.user?.id !== id && req.user?.userType !== "ADMIN") {
    console.log(req.user?.id !== id, req.user?.id, id);

    return res.status(403).json({ message: "Access denied." });
  }
  const { username, publicKey, userType, phoneNumber } = req.body;

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { username, publicKey, userType, phoneNumber },
    });

    res.json(updatedUser);
    if (publicKey) {
      addVoter(publicKey);
      console.log(await getVoterInfo(publicKey));
    }
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

// Delete User - Users Themselves
export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  if (req.user?.id !== id) {
    return res
      .status(403)
      .json({ message: "You can only delete your own account." });
  }

  try {
    await prisma.user.delete({ where: { id } });
    res.json({ message: "User deleted successfully." });
  } catch (err: any) {
    res.status(404).json({ message: "User not found." });
  }
};

export const getAllUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      include: { voterInfo: true, candidateInfo: true },
    });
    res.json(users);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
