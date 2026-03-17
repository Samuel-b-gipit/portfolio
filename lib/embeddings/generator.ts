/**
 * Embedding generation utility using Google Gemini API via AI SDK
 * Handles batch processing and error handling for embedding creation
 */

import { embedMany, embed } from "ai";
import { google } from "@ai-sdk/google";
import { TextChunk } from "./chunker";

export interface EmbeddingResult {
  chunkId: string;
  embedding: number[];
  content: string;
  metadata: TextChunk["metadata"];
}

const EMBEDDING_MODEL = google.textEmbeddingModel("gemini-embedding-001");

/**
 * Generate embeddings for text chunks using Google Gemini
 * Uses gemini-embedding-001 model via AI SDK
 */
export async function generateEmbeddings(
  chunks: TextChunk[],
  apiKey: string,
): Promise<EmbeddingResult[]> {
  if (!apiKey) {
    throw new Error("Google API key is required");
  }

  try {
    const { embeddings } = await embedMany({
      model: EMBEDDING_MODEL,
      values: chunks.map((c) => c.content),
    });

    return embeddings.map((embedding, index) => ({
      chunkId: chunks[index].id,
      embedding,
      content: chunks[index].content,
      metadata: chunks[index].metadata,
    }));
  } catch (error) {
    console.error("Error generating embeddings:", error);
    throw new Error(
      `Failed to generate embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Generate a single embedding for a query string
 * Used for searching during chat interactions
 */
export async function generateQueryEmbedding(
  query: string,
  apiKey: string,
): Promise<number[]> {
  if (!apiKey) {
    throw new Error("Google API key is required");
  }

  try {
    const { embedding } = await embed({
      model: EMBEDDING_MODEL,
      value: query,
    });
    return embedding;
  } catch (error) {
    console.error("Error generating query embedding:", error);
    throw new Error(
      `Failed to generate query embedding: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
