import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { vectorService } from '../services/vectorService.js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const KNOWLEDGE_BASE_PATH = path.resolve(__dirname, '../../../data/knowledge-base');

async function ingest() {
  console.log("🚀 Starting Ingestion Strategy...");

  try {
    const files = fs.readdirSync(KNOWLEDGE_BASE_PATH);
    const mdFiles = files.filter(f => f.endsWith('.md'));

    for (const file of mdFiles) {
      console.log(`📡 Processing: ${file}`);
      const content = fs.readFileSync(path.join(KNOWLEDGE_BASE_PATH, file), 'utf-8');

      const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const docs = await splitter.createDocuments([content]);
      console.log(`📦 Split into ${docs.length} chunks.`);

      for (const [i, doc] of docs.entries()) {
        const id = `${file}_${i}`;
        
        // Upsert raw text to Upstash (Integrated Embeddings handles the rest)
        await vectorService.upsert(id, doc.pageContent, {
          source: file,
          content: doc.pageContent,
          chunkIndex: i
        });

        if (i % 10 === 0) console.log(`✅ Ingested ${i}/${docs.length} chunks...`);
      }
    }

    console.log("💎 Ingestion Complete. Neural knowledge base is synchronized.");
  } catch (error) {
    console.error("❌ Ingestion Failed:", error);
  }
}

ingest();
