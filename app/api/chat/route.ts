/**
 * Chat API route with RAG (Retrieval-Augmented Generation)
 * POST /api/chat
 *
 * Handles chat requests, retrieves relevant context from embeddings,
 * and streams responses using Google Gemini
 */

import { streamText } from "ai";
import { google } from "@ai-sdk/google";
import { NextRequest } from "next/server";
import { generateQueryEmbedding } from "@/lib/embeddings/generator";
import { searchSimilarChunks } from "@/lib/embeddings/vector-store";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    // Parse request body
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // Check API key
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Google API key not configured",
          message:
            "Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables",
        }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Get the last user message for RAG retrieval
    const lastUserMessage = messages
      .filter((msg: any) => msg.role === "user")
      .pop();

    if (!lastUserMessage) {
      return new Response(JSON.stringify({ error: "No user message found" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate embedding for the query
    console.log("Generating query embedding...");
    const queryEmbedding = await generateQueryEmbedding(
      lastUserMessage.content,
      apiKey,
    );

    // Search for relevant chunks
    console.log("Searching for relevant context...");
    const relevantChunks = await searchSimilarChunks(queryEmbedding, 5);

    console.log(`Found ${relevantChunks.length} relevant chunks`);

    if (relevantChunks.length === 0) {
      console.warn(
        "No relevant chunks found - embeddings may not be initialized",
      );
    }

    // Build context from relevant chunks
    const context = relevantChunks
      .map(
        (chunk, index) =>
          `[Context ${index + 1}] (Similarity: ${chunk.similarity.toFixed(3)})\n${chunk.content}`,
      )
      .join("\n\n---\n\n");

    // Build system message with RAG context
    const systemMessage = `You are a helpful AI assistant for Samuel Gipit Jr.'s portfolio website. Your role is to answer questions about Samuel's projects, experience, skills, and professional background.

IMPORTANT INSTRUCTIONS:
- ONLY answer questions that can be answered using the context provided below
- If the question is not related to Samuel's portfolio, experience, or skills, politely decline and explain that you can only answer questions about Samuel's professional background
- Do not make up information or provide answers outside the provided context
- Be concise, professional, and friendly in your responses
- If you're not sure about something based on the context, say so
- When mentioning specific projects or experiences, use the exact names and details from the context

CONTEXT:
${context || "No relevant context found. Please only answer questions about Samuel Gipit Jr.'s portfolio based on information you have access to."}

Remember: You can ONLY answer questions about Samuel's professional work, projects, and experience. For anything else, politely decline.`;

    // Prepare messages for AI SDK
    const aiMessages = [
      {
        role: "system" as const,
        content: systemMessage,
      },
      ...messages,
    ];

    // Create streaming response using AI SDK
    const result = await streamText({
      model: google("gemini-2.0-flash-exp"),
      messages: aiMessages,
      temperature: 0.7,
    });

    return result.toTextStreamResponse();
  } catch (error) {
    console.error("Error in chat API:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
}
