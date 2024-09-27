import express from "express";
import {
  createElection,
  getAllElections,
  getElectionById,
  updateElection,
  deleteElection,
  reset,
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
router.post("/end", isAdmin, endElection);
router.post("/reset", reset);
router.get("/:id", getElectionById);
router.put("/:id", updateElection);
router.delete("/:id", deleteElection);

export default router;
