// routes/userRoutes.ts

import express from "express";

import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  registerAdmin,
  loginUser,
} from "../controllers/userController";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/login", loginUser);

// Create User - Only Admins
router.post("/create", isAuthenticated, isAdmin, createUser);

// Read User - Users and Admins
router.get("/:id", isAuthenticated, getUser);

// Update User - Only Admins
router.put("/:id", isAuthenticated, updateUser);

// Delete User - Users Themselves
router.delete("/:id", isAuthenticated, deleteUser);

router.post("/firstAdmin", registerAdmin);

export default router;
