import { authenticate } from "../middleware";
import express, { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const coreRouter = express.Router();

coreRouter.post(
  "/add_database",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { url, userId } = req.body; // userID from authenticate middleware

      await prisma.databaseCreds.create({
        data: { userId, dbUrl: url },
      });

      res.status(200).json({ message: "Database added successfully" });
    } catch (error) {
      console.error("Add database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

coreRouter.post(
  "/add_subscription",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { subscriptionType, subscriptionAddress, userId } = req.body; // userID from authenticate middleware

      await prisma.subscription.create({
        data: {
          userId,
          subType: subscriptionType,
          subAddress: subscriptionAddress,
        },
      });

      res.status(200).json({ message: "Subscription added successfully" });
    } catch (error) {
      console.error("Add subscription error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default coreRouter;
