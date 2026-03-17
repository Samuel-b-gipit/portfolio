#!/usr/bin/env node
/**
 * Re-initialize chatbot embeddings in Redis/KV.
 *
 * Run this any time you add or modify files in chatbot-embeddings-data/
 * The dev server (pnpm dev) must be running before calling this script.
 *
 * Usage:
 *   node scripts/reinitialize-embeddings.mjs
 *   node scripts/reinitialize-embeddings.mjs --url https://yoursite.com
 */

import { readFileSync, existsSync, readdirSync } from "fs";
import { join } from "path";

// ── Load .env.local ──────────────────────────────────────────────────────────

function loadEnv() {
  const envPath = join(process.cwd(), ".env.local");
  if (!existsSync(envPath)) return {};
  const lines = readFileSync(envPath, "utf-8").split("\n");
  const env = {};
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed
      .slice(eqIdx + 1)
      .trim()
      .replace(/^["']|["']$/g, "");
    env[key] = val;
  }
  return env;
}

const env = loadEnv();

// ── Config ───────────────────────────────────────────────────────────────────

const secret = env.EMBEDDINGS_SECRET || process.env.EMBEDDINGS_SECRET || null;

const args = process.argv.slice(2);
const urlFlagIdx = args.indexOf("--url");
const baseUrl =
  urlFlagIdx !== -1
    ? args[urlFlagIdx + 1]
    : env.SITE_URL || process.env.SITE_URL || "http://localhost:3000";

// ── Helpers ──────────────────────────────────────────────────────────────────

function listEmbeddingFiles() {
  const dir = join(process.cwd(), "chatbot-embeddings-data");
  if (!existsSync(dir)) return [];
  return readdirSync(dir).filter((f) => f.endsWith(".md"));
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const files = listEmbeddingFiles();

  console.log("\n=== Chatbot Embeddings Re-initializer ===\n");

  if (files.length === 0) {
    console.error(
      "No .md files found in chatbot-embeddings-data/. Nothing to do.",
    );
    process.exit(1);
  }

  console.log(`Found ${files.length} file(s) to process:`);
  files.forEach((f) => console.log(`  • ${f}`));
  console.log();
  console.log(`Target: ${baseUrl}/api/embeddings/initialize`);
  console.log(
    `Auth:   ${secret ? "EMBEDDINGS_SECRET set ✓" : "No secret (endpoint is open)"}`,
  );
  console.log();
  console.log("Sending request...");

  const headers = { "Content-Type": "application/json" };
  if (secret) {
    headers["Authorization"] = `Bearer ${secret}`;
  }

  let response;
  try {
    response = await fetch(`${baseUrl}/api/embeddings/initialize`, {
      method: "POST",
      headers,
      body: JSON.stringify({ force: true }),
    });
  } catch (err) {
    console.error("\nConnection failed. Is the dev server running?");
    console.error("  Start it with:  pnpm dev");
    console.error(
      "  Then retry:     node scripts/reinitialize-embeddings.mjs\n",
    );
    process.exit(1);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    console.error(`\nUnexpected response (status ${response.status})`);
    process.exit(1);
  }

  if (!response.ok) {
    console.error(`\nFailed (${response.status}): ${data.error}`);
    if (data.message) console.error(`  ${data.message}`);
    process.exit(1);
  }

  console.log("\n✓ Embeddings re-initialized successfully!\n");
  console.log(`  Files processed : ${files.length}`);
  console.log(`  Chunks created  : ${data.stats?.totalChunks ?? "n/a"}`);
  console.log(`  Embeddings stored: ${data.stats?.totalEmbeddings ?? "n/a"}`);
  console.log(
    `  Total content   : ${data.stats?.contentLength?.toLocaleString() ?? "n/a"} characters`,
  );
  console.log("\nYour chatbot is ready to use the updated content.\n");
}

main();
