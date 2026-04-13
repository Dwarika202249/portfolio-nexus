import express, { type Request, type Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { aiService } from "./services/aiService.js";
import { mailService } from "./services/mailService.js";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST"],
  credentials: true
}));
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

app.post("/api/ai/draft-email", async (req: Request, res: Response) => {
  try {
    const { name, brief, chatHistory } = req.body;
    const draft = await aiService.generateEmailDraft(name, brief, chatHistory);
    res.json({ draft });
  } catch (error) {
    console.error("Draft API Error:", error);
    res.status(500).json({ error: "Failed to generate neural draft" });
  }
});

app.post("/api/contact/send", async (req: Request, res: Response) => {
  try {
    const { name, email, phone, brief, aiSummary } = req.body;
    
    if (!name || !email || !brief || !aiSummary) {
      return res.status(400).json({ error: "Required fields missing" });
    }

    const result = await mailService.sendContactEmail({ name, email, phone, brief, aiSummary });
    res.json({ success: true, result });
  } catch (error) {
    console.error("Contact API Error:", error);
    res.status(500).json({ error: "Failed to transmit message" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`NEXUS Backend running on http://0.0.0.0:${PORT}`);
});
