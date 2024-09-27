import express from "express";
import {
  createVote,
  getAllVotes,
  getVoteById,
  deleteVote,
  updateVote,
  validateVoteControl,
} from "../controllers/votesController";

const router = express.Router();

router.post("/", createVote);
router.get("/", getAllVotes);
router.post("/validate", validateVoteControl);
router.get("/:id", getVoteById);
router.delete("/:id", deleteVote);
router.put("/:id", updateVote);

export default router;
