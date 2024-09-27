// middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    userType: "ADMIN" | "VOTER" | "CANDIDATE";
  };
}

export const isAuthenticated = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log("called");

  if (!token)
    return res.status(401).json({ message: "Authentication required." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      userType: "ADMIN" | "VOTER" | "CANDIDATE";
    };
    req.user = decoded; // Attach user info to request

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token." });
  }
};

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  if (req.user?.userType === "ADMIN") {
    next();
  } else {
    res.status(403).json({ message: "Admin access required." });
  }
};
