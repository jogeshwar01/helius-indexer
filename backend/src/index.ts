import express from "express";
import cors from "cors";
import authRouter from "./routers/auth";
import coreRouter from "./routers/core";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/core", coreRouter);

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
