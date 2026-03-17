# Personal Document AI — App Summary

## What Is Personal Document AI?

Personal Document AI is a **RAG-powered document Q&A platform**. Instead of static search, users upload their own documents and have a natural-language conversation about them. The system retrieves the most relevant content from uploaded files and grounds AI responses in actual document content.

---

## Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State Management | Zustand 5 (persisted to localStorage) |
| Markdown Rendering | react-markdown + remark-gfm |
| Syntax Highlighting | react-syntax-highlighter (Prism / oneLight) |
| Icons | lucide-react |
| Utilities | date-fns, uuid, tailwind-merge, clsx |

### Backend

| Layer | Technology |
|---|---|
| Framework | FastAPI |
| LLM Inference | Groq (llama-3.3-70b-versatile) |
| Embeddings | Google Gemini (gemini-embedding-001, 1536 dims) |
| Vector Store | Upstash Vector (shared index, filtered per doc_id) |
| Document Metadata | Upstash Redis |
| RAG Orchestration | LangChain |
| Text Chunking | RecursiveCharacterTextSplitter |
| Streaming | Server-Sent Events (SSE) |

---

## User Flow

1. Upload documents (PDF, TXT, or Markdown) via the Document Panel
2. Documents are processed asynchronously — chunked, embedded, and indexed
3. Start a conversation; all ready documents are searched by default
4. Optionally scope conversations by excluding specific documents
5. Receive streamed AI responses grounded in document content, with source citations

---

## Core Data Models

- **Document** — id, filename, file_type, size_bytes, uploaded_at, chunk_count, status (`processing` | `ready` | `error`)
- **Conversation** — id, title, messages[], excludedDocumentIds[]
- **Message** — id, role (`user` | `assistant`), content, streaming flag, sources[]
- **ChatSource** — filename, doc_id

---

## App Layout

The UI is a **three-column shell**:

| Column | Component | Width | Behaviour |
|---|---|---|---|
| Left | Sidebar | 256 px (lg+) | Conversation list, new chat, rename/delete |
| Centre | ChatWindow | flex-1 | Header + message list + input |
| Right | DocumentPanel | 320 px (lg+) | Upload, status, per-conversation scoping |

On mobile/tablet (below `lg` breakpoint), both side columns become animated overlay drawers. The `Escape` key closes any open drawer; body scroll is locked while a drawer is visible.

---

## Pages / Routes

| Route | Description |
|---|---|
| `/` | Main chat interface (single-page app) |

---

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/documents` | Upload a document (PDF, TXT, MD) — returns `202`, processing is async |
| GET | `/documents` | List all uploaded documents with metadata and status |
| DELETE | `/documents/{id}` | Delete a document and its vector index |
| POST | `/chat/stream` | Streaming SSE chat endpoint — tokens arrive in real time |
| POST | `/chat` | Non-streaming chat — waits for full response |
| GET | `/health` | Health check |

---

## Streaming Chat Flow

```
User types a message → ChatInput → useSendMessage.send(text)
  │
  ├─ 1. Ensure a conversation exists (create one if needed)
  ├─ 2. Auto-title the conversation from the first 48 chars
  ├─ 3. Append user message to store
  ├─ 4. Append empty assistant message (streaming: true)
  ├─ 5. Build conversation_history from prior messages
  ├─ 6. Call getActiveDocumentIds() → ready doc IDs minus excluded
  │
  └─ 7. POST /chat/stream (SSE)
         ├─ data: {"token": "..."} → appendToken()   [many times]
         ├─ data: {"done": true, "sources": [...]}   → finalizeMessage()
         └─ data: {"error": "..."}                   → finalizeMessage() + error text
```

An `AbortController` ref allows the **Stop** button to cancel mid-stream.

---

## Document Scoping (Opt-Out Model)

Each conversation stores **excluded** document IDs, not selected ones:

- **Default** — exclusion list is empty → all ready documents are searched
- **Uncheck a document** → its ID is added to the exclusion list
- **Re-check** → its ID is removed

`getActiveDocumentIds(convId)` computes:
```
active = readyDocumentIds − excludedDocumentIds
```

This list is sent to the backend as `document_ids`; the backend filters Upstash Vector similarity search to those IDs only.

---

## Backend Architecture

```
User Request
  → FastAPI Router
    → Document Loader  (PDF / TXT / Markdown extraction)
    → Text Chunker     (RecursiveCharacterTextSplitter)
    → Embedding Service (Google Gemini gemini-embedding-001, 1536 dims)
    → Upstash Vector   (shared cloud index, filtered per doc_id)
    → RAG Pipeline     (similarity search → prompt injection → Groq streaming)
```

### Chunking & Retrieval Settings

| Setting | Value |
|---|---|
| Chunk size | 1,000 chars |
| Chunk overlap | 200 chars |
| Top-k retrieval | 5 chunks |
| Conversation history window | Last 10 messages |
| Max file size | 20 MB |

---

## Supported File Types

| Type | MIME |
|---|---|
| PDF | `application/pdf` |
| Plain text | `text/plain` |
| Markdown | `text/markdown`, `text/x-markdown` |

---

## State Management

All global state lives in a single Zustand store persisted to `localStorage` under the key `mini-chatgpt-store`.

**Persisted:** conversations (full message history), activeConversationId, sidebarOpen, docPanelOpen

**Not persisted:** documents — always fetched fresh from the backend on mount

---

## Design System

| Token | Value | Usage |
|---|---|---|
| `canvas` | `#0e0e0f` | Page background |
| `surface` | `#161618` | Sidebar / panels |
| `raised` | `#1e1e21` | Cards / inputs |
| `border` | `#2a2a2e` | All borders |
| `ink` | `#f0ede8` | Primary text |
| `dim` | `#8a8790` | Secondary text |
| `accent` (amber) | `#e8a045` | CTAs, active states, highlights |

**Fonts:** DM Sans (UI text) · Instrument Serif italic (logo/display) · JetBrains Mono (code)

---

## Environment Variables

### Frontend

| Variable | Default | Description |
|---|---|---|
| `NEXT_PUBLIC_BACKEND_URL` | `http://localhost:8000` | FastAPI backend base URL |

### Backend

| Variable | Default | Description |
|---|---|---|
| `GOOGLE_API_KEY` | *(required)* | Google AI API key (Gemini embeddings) |
| `GROQ_API_KEY` | *(required)* | Groq API key (LLM inference) |
| `GROQ_MODEL` | `llama-3.3-70b-versatile` | Groq model for chat responses |
| `UPSTASH_VECTOR_REST_URL` | *(required)* | Upstash Vector index REST URL |
| `UPSTASH_VECTOR_REST_TOKEN` | *(required)* | Upstash Vector index REST token |
| `UPSTASH_REDIS_URL` | *(required)* | Upstash Redis URL (also accepts `KV_URL` or `REDIS_URL`) |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | Comma-separated CORS origins |

---

## Running Locally

```bash
# Frontend
npm install
npm run dev          # http://localhost:3000

# Backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Running with Docker

```bash
cp .env.example .env
# Fill in all required keys
docker compose up --build
```

---

## Summary

Personal Document AI brings your documents to life through conversation. Users upload files once, and the RAG pipeline handles the rest — chunking, embedding, and retrieving the right context so every AI response is grounded in your actual content. Built as a full-stack Next.js + FastAPI app with Upstash Vector for retrieval and Groq for fast LLM inference.
