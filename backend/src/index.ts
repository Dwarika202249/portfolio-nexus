import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { aiService } from "./services/aiService.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors());
app.use(express.json());

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "ok", message: "NEXUS Backend is operational" });
});

app.post("/api/ai/ask", async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: "Question is required" });
    }
    const answer = await aiService.ask(question);
    res.json({ answer });
  } catch (error) {
    console.error("AI Route Error:", error);
    res.status(500).json({ error: "failed to process request" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NEXUS Backend running on http://0.0.0.0:${PORT}`);
});
