import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET ?? "your-secret-key";

app.post("/signup", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      res.status(400).json({ error: "User already exists" });
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(201).json({
      message: "User created successfully",
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/login", async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "24h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post(
  "/add_database",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { url } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (typeof decoded !== "object" || !decoded.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const userId = decoded.userId;

      await prisma.databaseCreds.create({
        data: {
          userId,
          dbUrl: url,
        },
      });

      res.status(200).json({ message: "Database added successfully" });
    } catch (error) {
      console.error("Add database error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

app.post(
  "/add_subscription",
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { subscriptionType, subscriptionAddress } = req.body;

      const token = req.headers.authorization?.split(" ")[1];

      if (!token) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const decoded = jwt.verify(token, JWT_SECRET);

      if (!decoded) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      if (typeof decoded !== "object" || !decoded.userId) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      const userId = decoded.userId;

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
