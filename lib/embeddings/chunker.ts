/**
 * Text chunking utility for RAG (Retrieval-Augmented Generation)
 * Splits markdown content into semantic chunks while preserving context
 */

export interface TextChunk {
  id: string;
  content: string;
  metadata: {
    section: string;
    position: number;
    totalChunks: number;
  };
}

/**
 * Split text into chunks based on markdown sections
 * Preserves section headers in each chunk for context
 */
export function chunkMarkdownText(
  markdown: string,
  maxTokens: number = 800,
): TextChunk[] {
  const chunks: TextChunk[] = [];

  // Split by major sections (lines starting with # or ##)
  const sections = markdown.split(/(?=^#{1,2} )/m);

  let chunkIndex = 0;

  for (const section of sections) {
    if (!section.trim()) continue;

    // Extract section title (first line with #)
    const titleMatch = section.match(/^#{1,2} (.+)$/m);
    const sectionTitle = titleMatch ? titleMatch[1] : "Introduction";

    // Rough token estimation: ~4 characters per token
    const estimatedTokens = section.length / 4;

    if (estimatedTokens <= maxTokens) {
      // Section fits in one chunk
      chunks.push({
        id: `chunk_${chunkIndex}`,
        content: section.trim(),
        metadata: {
          section: sectionTitle,
          position: chunkIndex,
          totalChunks: 0, // Will be updated later
        },
      });
      chunkIndex++;
    } else {
      // Section needs to be split further
      const paragraphs = section.split(/\n\n+/);
      let currentChunk = "";
      let currentHeader = "";

      // Keep the section header
      if (titleMatch) {
        currentHeader = titleMatch[0] + "\n\n";
      }

      for (const paragraph of paragraphs) {
        const testChunk = currentChunk + paragraph + "\n\n";
        const testTokens = testChunk.length / 4;

        if (testTokens > maxTokens && currentChunk) {
          // Save current chunk and start new one
          chunks.push({
            id: `chunk_${chunkIndex}`,
            content: (currentHeader + currentChunk).trim(),
            metadata: {
              section: sectionTitle,
              position: chunkIndex,
              totalChunks: 0,
            },
          });
          chunkIndex++;
          currentChunk = paragraph + "\n\n";
        } else {
          currentChunk = testChunk;
        }
      }

      // Add remaining content
      if (currentChunk.trim()) {
        chunks.push({
          id: `chunk_${chunkIndex}`,
          content: (currentHeader + currentChunk).trim(),
          metadata: {
            section: sectionTitle,
            position: chunkIndex,
            totalChunks: 0,
          },
        });
        chunkIndex++;
      }
    }
  }

  // Update total chunks count
  const totalChunks = chunks.length;
  chunks.forEach((chunk) => {
    chunk.metadata.totalChunks = totalChunks;
  });

  return chunks;
}

/**
 * Clean and prepare text for embedding
 * Removes excessive whitespace and normalizes formatting
 */
export function cleanTextForEmbedding(text: string): string {
  return text
    .replace(/\n{3,}/g, "\n\n") // Normalize multiple newlines
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // Remove markdown links but keep text
    .replace(/\s+/g, " ") // Normalize whitespace
    .trim();
}
