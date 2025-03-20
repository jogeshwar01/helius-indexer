import express, { Request, Response } from "express";
import cors from "cors";
import authRouter from "./routers/auth";
import coreRouter from "./routers/core";
import dotenv from "dotenv";
import { handleIndexerRequest } from "./indexer";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/core", coreRouter);

app.post("/", async (req: Request, res: Response): Promise<void> => {
  console.log("Indexer request received");

  const transaction = req.body;
  const headers = req.headers;
  const response = await handleIndexerRequest(transaction, headers);
  res.status(response.status).json(response.body);
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
