/**
 * Embeddings initialization API route
 * POST /api/embeddings/initialize
 *
 * Processes portfolio-content.md and stores embeddings in KV
 * Protected endpoint - requires EMBEDDINGS_SECRET
 */

import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { chunkMarkdownText } from "@/lib/embeddings/chunker";
import { generateEmbeddings } from "@/lib/embeddings/generator";
import {
  storeEmbeddings,
  clearEmbeddings,
} from "@/lib/embeddings/vector-store";

export async function POST(request: NextRequest) {
  try {
    // Verify authorization if secret is set
    const secret = process.env.EMBEDDINGS_SECRET;
    if (secret) {
      const authHeader = request.headers.get("authorization");
      const providedSecret = authHeader?.replace("Bearer ", "");

      if (providedSecret !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Check for required environment variables
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Google API key not configured",
          message:
            "Please set GOOGLE_GENERATIVE_AI_API_KEY in your environment variables",
        },
        { status: 500 },
      );
    }

    // Check body for options
    const body = await request.json().catch(() => ({}));
    const { force = false } = body;

    console.log("Starting embeddings initialization...");

    // Read all markdown files from chatbot-embeddings-data/
    const dataDir = path.join(process.cwd(), "chatbot-embeddings-data");
    let content: string;

    try {
      const files = (await fs.readdir(dataDir)).filter((f) =>
        f.endsWith(".md"),
      );
      if (files.length === 0) {
        return NextResponse.json(
          {
            error: "No content found",
            message: "No .md files found in chatbot-embeddings-data/",
          },
          { status: 404 },
        );
      }
      const parts = await Promise.all(
        files.map(async (file) => {
          const text = await fs.readFile(path.join(dataDir, file), "utf-8");
          console.log(`Read ${file}: ${text.length} characters`);
          return text;
        }),
      );
      content = parts.join("\n\n---\n\n");
    } catch (error) {
      return NextResponse.json(
        {
          error: "Content directory not found",
          message: "Could not read chatbot-embeddings-data/ directory",
        },
        { status: 404 },
      );
    }

    console.log(`Total content length: ${content.length} characters`);

    // Clear existing embeddings if force flag is set
    if (force) {
      console.log("Force flag set - clearing existing embeddings");
      await clearEmbeddings();
    }

    // Chunk the content
    const chunks = chunkMarkdownText(content, 800);
    console.log(`Created ${chunks.length} chunks`);

    if (chunks.length === 0) {
      return NextResponse.json(
        {
          error: "No content to process",
          message: "Portfolio content is empty or could not be chunked",
        },
        { status: 400 },
      );
    }

    // Generate embeddings
    console.log("Generating embeddings...");
    const embeddings = await generateEmbeddings(chunks, apiKey);
    console.log(`Generated ${embeddings.length} embeddings`);

    // Store in KV
    console.log("Storing embeddings in KV...");
    await storeEmbeddings(embeddings);

    return NextResponse.json({
      success: true,
      message: "Embeddings initialized successfully",
      stats: {
        totalChunks: chunks.length,
        totalEmbeddings: embeddings.length,
        contentLength: content.length,
      },
    });
  } catch (error) {
    console.error("Error initializing embeddings:", error);
    return NextResponse.json(
      {
        error: "Failed to initialize embeddings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

// Optionally support GET to check status
export async function GET() {
  try {
    const { areEmbeddingsInitialized } =
      await import("@/lib/embeddings/vector-store");
    const initialized = await areEmbeddingsInitialized();

    return NextResponse.json({
      initialized,
      message: initialized
        ? "Embeddings are initialized and ready"
        : "Embeddings not initialized. Call POST /api/embeddings/initialize to set up.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to check embeddings status",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
