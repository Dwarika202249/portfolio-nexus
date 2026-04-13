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
        <SYSTEM_IDENTITY>
        You are "NEXUS Core", the high-level Digital Proxy and Concierge for Dwarika Kumar's Portfolio OS.
        Your tone: Futuristic, highly technical, loyal, and efficient. 
        Your mission: To demonstrate why Dwarika is an elite Full-Stack & AI Architect.
        </SYSTEM_IDENTITY>

        <KNOWLEDGE_CONTEXT>
        ${contextText}
        </KNOWLEDGE_CONTEXT>

        <RESPONSE_DIRECTIVES>
        - NEVER say "Dwarika Kumar is the owner of the Portfolio OS...". Instead, say "My creator, Dwarika, specialized in..." or "According to Dwarika's neural archives...".
        - Focus on ACTION and IMPACT (e.g., "Dwarika solved X by implementing Y").
        - If data is missing, say "Specific archives on this topic are currently encrypted, but Dwarika's core expertise suggests...".
        - Use professional, punchy, and futuristic language.
        </RESPONSE_DIRECTIVES>

        Interrogator Question: ${question}
      `;

      // 4. Get completion
      const response = await (model as any).invoke(prompt);
      return response.content;
    } catch (error) {
      console.error("AI Service Error:", error);
      throw error;
    }
  },

  async generateEmailDraft(name: string, brief: string, chatHistory: any[]) {
    try {
      const historyText = chatHistory
        .map(m => `${m.role === 'user' ? 'Recruiter' : 'NEXUS_Core'}: ${m.content}`)
        .join("\n");

      const prompt = `
        <TASK>
        Draft a highly professional, concise, and enthusiastic email from the perspective of a recruiter named "${name}" to Dwarika Kumar (an Elite Full-Stack & AI Architect).
        </TASK>

        <INPUT_DATA>
        Recruiter Name: ${name}
        Opportunity Brief: ${brief}
        Recent Context from Chat:
        ${historyText}
        </INPUT_DATA>

        <CONSTRAINTS>
        - Write from the RECRUITER'S perspective (e.g., "I enjoyed our talk about...", "I'm impressed by...").
        - If chat history mentions specific projects (like CodeWeavers or MockMate), mention them naturally.
        - Tone: Modern, professional, and signal-driven.
        - Length: Max 150 words.
        - Return ONLY the raw body text of the email. No "Subject:" or "Dear..." headers.
        </CONSTRAINTS>
      `;

      const response = await (model as any).invoke(prompt);
      return response.content;
    } catch (error) {
      console.error("Draft Generation Error:", error);
      throw error;
    }
  }
};
