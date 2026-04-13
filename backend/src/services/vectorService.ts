import { Index } from "@upstash/vector";
import dotenv from "dotenv";

dotenv.config();

const url = process.env.UPSTASH_VECTOR_REST_URL;
const token = process.env.UPSTASH_VECTOR_REST_TOKEN;

if (!url || !token) {
  console.warn("⚠️ Warning: Upstash Vector credentials missing in .env");
}

const index = new Index({
  url: url!,
  token: token!,
});

export interface IVectorService {
    upsert: (id: string, data: string, metadata: Record<string, any>) => Promise<void>;
    query: (data: string, topK?: number) => Promise<any>;
}

export const vectorService: IVectorService = {
  /**
   * Upsert raw text into the vector index (Integrated Embeddings)
   */
  async upsert(id: string, data: string, metadata: Record<string, any>) {
    try {
      await index.upsert([{ id, data, metadata }]);
    } catch (error) {
      console.error("Vector Upsert Error:", error);
      throw error;
    }
  },

  /**
   * Query using raw text (Integrated Embeddings)
   */
  async query(data: string, topK: number = 3) {
    try {
      const results = await index.query({
        data,
        topK,
        includeMetadata: true,
      });
      return results;
    } catch (error) {
      console.error("Vector Query Error:", error);
      throw error;
    }
  }
};
