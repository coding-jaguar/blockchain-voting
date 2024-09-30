import express from "express";
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  reset,
  endElections,
} from "../controllers/electionController";
import {
  endElection,
  resetElection,
  startElection,
} from "../ehtersSetup/ether-utils";
import { isAdmin } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", isAdmin, createElection);
router.get("/", getAllElections);
router.post("/start", isAdmin, startElection);
router.post("/end", isAdmin, endElections);
router.post("/reset", isAdmin, reset);
router.get("/:id", getElectionById);
router.put("/:id", isAdmin, updateElection);
router.delete("/:id", isAdmin, deleteElection);

export default router;
