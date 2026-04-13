import { ChatGroq } from "@langchain/groq";
import { vectorService } from "./vectorService.js";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
    throw new Error("GROQ_API_KEY is missing in your .env file.");
}

const model = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  apiKey: apiKey,
  temperature: 0.2,
});

export const aiService = {
  /**
   * Handle the RAG flow:
   * 1. Search context using raw text
   * 2. Generate answer
   */
  async ask(question: string) {
    try {
      // 1. Retrieve relevant context from Upstash Vector (Raw Text Query)
      const contextResults = await vectorService.query(question, 5);

      const contextText = contextResults
        .map(
          (r: { metadata?: { content?: string } }) => r.metadata?.content || "",
        )
        .join("\n\n---\n\n");

      // 3. Construct prompt
      const prompt = `
        You are "NEXUS Concierge", an advanced AI assistant for Dwarika Kumar's Portfolio OS.
        Your goal is to answer questions based ONLY on the provided context from his professional records.
        
        Context from records:
        ${contextText}
        
        Instructions:
        - Be professional, technical, and futuristic.
        - If the answer is not in the context, say you don't have that specific data in the archives.
        - Keep answers concise but high-impact.
        
        Question: ${question}
      `;

      // 4. Get completion
      const response = await (model as any).invoke(prompt);
      return response.content;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },
};
