// routes/userRoutes.ts

import express from "express";

import {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  registerAdmin,
  loginUser,
  getAllUsers,
} from "../controllers/userController";
import { isAdmin, isAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", isAuthenticated, isAdmin, getAllUsers);
router.post("/firstAdmin", registerAdmin); //{"username":"root", "password":"root"}

router.post("/login", loginUser);

// Create User - Only Admins
router.post("/create", isAuthenticated, isAdmin, createUser);

// Read User - Users and Admins
router.get("/:id", isAuthenticated, getUser);

// Update User - Only Admins
router.put("/:id", isAuthenticated, updateUser);

// Delete User - Users Themselves
router.delete("/:id", isAuthenticated, deleteUser);

export default router;
