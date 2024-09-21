import express from "express";
import {
  createVote,
  getAllVotes,
  getVoteById,
  deleteVote,
  updateVote,
} from "../controllers/votesController";

const router = express.Router();

router.post("/", createVote);
router.get("/", getAllVotes);
router.get("/:id", getVoteById);
router.delete("/:id", deleteVote);
router.put("/:id", updateVote);

export default router;
