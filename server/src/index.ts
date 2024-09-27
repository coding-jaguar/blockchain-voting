import express, { Express, Request, Response, Application } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import cors from "cors";
import electionRoutes from "./routes/electionRoutes";
import candidateRoutes from "./routes/candidateRoutes";
import voteRoutes from "./routes/voteRoutes";
import { isAdmin, isAuthenticated } from "./middleware/authMiddleware";
//For env File
dotenv.config();

const app: Application = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // Frontend origin
  })
);
// Mount the user routes
app.use("/users", userRoutes);
app.use("/elections", isAuthenticated, electionRoutes);
app.use("/candidates", candidateRoutes);
app.use("/votes", voteRoutes);

app.listen(port, () => {
  console.log(`Server is Fire at http://localhost:${port}`);
});
