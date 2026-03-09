/**
 * Vector storage and retrieval using Vercel KV (Upstash Redis)
 * Handles storing embeddings and performing similarity search
 */

import { kv } from "@vercel/kv";
import { EmbeddingResult } from "./generator";

const EMBEDDINGS_KEY = "portfolio:embeddings";

export interface StoredEmbedding {
  chunkId: string;
  embedding: number[];
  content: string;
  metadata: {
    section: string;
    position: number;
    totalChunks: number;
  };
}

export interface SearchResult {
  content: string;
  similarity: number;
  metadata: StoredEmbedding["metadata"];
}

/**
 * Calculate cosine similarity between two vectors
 */
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    throw new Error("Vectors must have the same length");
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Store embeddings in Vercel KV
 */
export async function storeEmbeddings(
  embeddings: EmbeddingResult[],
): Promise<void> {
  try {
    const storedData: StoredEmbedding[] = embeddings.map((item) => ({
      chunkId: item.chunkId,
      embedding: item.embedding,
      content: item.content,
      metadata: item.metadata,
    }));

    await kv.set(EMBEDDINGS_KEY, storedData);
    console.log(`Stored ${embeddings.length} embeddings in KV`);
  } catch (error) {
    console.error("Error storing embeddings:", error);
    throw new Error(
      `Failed to store embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Retrieve all embeddings from Vercel KV
 */
export async function getEmbeddings(): Promise<StoredEmbedding[]> {
  try {
    const data = await kv.get<StoredEmbedding[]>(EMBEDDINGS_KEY);

    if (!data) {
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error retrieving embeddings:", error);
    throw new Error(
      `Failed to retrieve embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Search for most relevant chunks based on query embedding
 * Returns top K results sorted by similarity score
 */
export async function searchSimilarChunks(
  queryEmbedding: number[],
  topK: number = 5,
): Promise<SearchResult[]> {
  try {
    const embeddings = await getEmbeddings();

    if (embeddings.length === 0) {
      console.warn("No embeddings found in storage");
      return [];
    }

    // Calculate similarity for each embedding
    const results: SearchResult[] = embeddings.map((item) => ({
      content: item.content,
      similarity: cosineSimilarity(queryEmbedding, item.embedding),
      metadata: item.metadata,
    }));

    // Sort by similarity (descending) and return top K
    return results.sort((a, b) => b.similarity - a.similarity).slice(0, topK);
  } catch (error) {
    console.error("Error searching similar chunks:", error);
    throw new Error(
      `Failed to search embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Check if embeddings are initialized in the store
 */
export async function areEmbeddingsInitialized(): Promise<boolean> {
  try {
    const embeddings = await getEmbeddings();
    return embeddings.length > 0;
  } catch (error) {
    console.error("Error checking embeddings:", error);
    return false;
  }
}

/**
 * Clear all embeddings from storage (useful for re-initialization)
 */
export async function clearEmbeddings(): Promise<void> {
  try {
    await kv.del(EMBEDDINGS_KEY);
    console.log("Cleared embeddings from storage");
  } catch (error) {
    console.error("Error clearing embeddings:", error);
    throw new Error(
      `Failed to clear embeddings: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}
