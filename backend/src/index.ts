import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import authRouter from "./routers/auth";
import coreRouter from "./routers/core";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/core", coreRouter);

app.post("/", async (req: Request, res: Response): Promise<void> => {
  console.log("Indexer request received");
  try {
    const { body } = req;
    if (req.headers.authorization !== process.env.HELIUS_AUTH_TOKEN) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    await prisma.indexer.create({
      data: { transaction: body },
    });

    // later - add logic to process the transaction - add to user dbs who have subscribed to the transaction
    // might have to install pg library to connect to the user's database

    res.status(200).json({ message: "Data Indexed successfully" });
  } catch (error) {
    console.error("Indexer error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
