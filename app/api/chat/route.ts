/**
 * Chat API route with RAG (Retrieval-Augmented Generation)
 * POST /api/chat
 *
 * Handles chat requests, retrieves relevant context from embeddings,
 * and streams responses using Google Gemini
 */

import { streamText } from "ai";
import { groq } from "@ai-sdk/groq";
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

    // Check API keys
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "Groq API key not configured. Please set GROQ_API_KEY in your environment variables.",
      );
    }

    const googleApiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!googleApiKey) {
      throw new Error(
        "Google API key not configured. Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables.",
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
      googleApiKey,
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
    const systemMessage = `You are Samuel Gipit. You are responding directly as yourself on your personal portfolio website — not as an assistant talking about someone else.

TONE & STYLE:
- Always speak in first person ("I built...", "I worked on...", "My experience includes...")
- Be direct, casual, and conversational — like how you'd chat with someone in real life
- Keep answers concise and to the point, no unnecessary filler
- It's fine to show personality and enthusiasm when talking about your work
- Don't say things like "Based on the available context" or "Samuel has..." — you ARE Samuel

WHAT YOU CAN ANSWER:
- Questions about your projects, skills, experience, background, and anything in the context below
- If something isn't covered in the context, say you don't have that info handy but keep it casual
- For completely off-topic questions (unrelated to your professional background), briefly let them know you're here to chat about your work

CONTEXT:
${context || "No specific context found for this query — answer based on what you know about yourself, or let them know you're not sure."}`;

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
      model: groq("llama-3.3-70b-versatile"),
      messages: aiMessages,
      temperature: 0.7,
    });

    const encoder = new TextEncoder();
    const chunks: Uint8Array[] = [];
    for await (const chunk of result.textStream) {
      chunks.push(encoder.encode(chunk));
    }

    return new Response(
      new ReadableStream({
        start(controller) {
          for (const chunk of chunks) controller.enqueue(chunk);
          controller.close();
        },
      }),
      {
        status: 200,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      },
    );
  } catch (error) {
    console.error("Error in chat API:", error);

    const errorMessage = checkIsRateLimit(error)
      ? "I'm temporarily unavailable right now due to API rate limits on the free tier. Please try again in a few moments!"
      : "Sorry, something went wrong while processing your request. Please try again.";

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(errorMessage));
        controller.close();
      },
    });

    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

function checkIsRateLimit(error: unknown): boolean {
  const errObj = error as any;
  return (
    errObj?.statusCode === 429 ||
    errObj?.code === 429 ||
    errObj?.status === 429 ||
    (error instanceof Error &&
      (error.message.includes("429") ||
        error.message.includes("quota") ||
        error.message.includes("rate limit") ||
        error.message.includes("Rate limit")))
  );
}
