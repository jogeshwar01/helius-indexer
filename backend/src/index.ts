import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.json({ message: "Hello World" });
});

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
