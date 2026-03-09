# Quick Start: AI Chatbot

## ✅ What's Been Built

Your portfolio now has a fully functional RAG-powered AI chatbot! Here's what was created:

### Core Features

- 🤖 **Floating Chat UI** - Professional bottom-right chat button and window
- 🧠 **RAG System** - Only answers questions about your portfolio content
- ⚡ **Streaming Responses** - Real-time typewriter effect
- 📱 **Responsive Design** - Works on all screen sizes
- 🎨 **Theme Integration** - Matches your portfolio's design system

### Files Created

**Backend (API & Utilities)**

- `app/api/chat/route.ts` - Main chat endpoint with RAG
- `app/api/embeddings/initialize/route.ts` - One-time setup endpoint
- `lib/embeddings/chunker.ts` - Text splitting logic
- `lib/embeddings/generator.ts` - OpenAI embedding generation
- `lib/embeddings/vector-store.ts` - Vercel KV storage with similarity search
- `lib/types/chat.ts` - TypeScript types

**Frontend (UI Components)**

- `components/chat/chat-container.tsx` - Main orchestration
- `components/chat/chat-window.tsx` - Expandable panel
- `components/chat/chat-button.tsx` - Floating button
- `components/chat/message-bubble.tsx` - Message display
- `components/chat/chat-input.tsx` - Input field

**Configuration**

- `.env.example` - Environment variable template
- `CHATBOT_SETUP.md` - Comprehensive documentation

## 🚀 Next Steps (3 Quick Steps)

### 1. Get API Keys

**OpenAI API Key**

1. Visit https://platform.openai.com/api-keys
2. Sign up/login and create a new API key
3. Copy the key (starts with `sk-proj-...`)

**Vercel KV (Upstash Redis)**

1. Visit https://vercel.com/dashboard
2. Go to Storage → Create Database → Select KV
3. Copy `KV_REST_API_URL` and `KV_REST_API_TOKEN`

### 2. Configure Environment

Create `.env.local` in your portfolio root:

```env
OPENAI_API_KEY=sk-proj-your_actual_key_here
KV_REST_API_URL=https://your-kv-url.upstash.io
KV_REST_API_TOKEN=your_actual_token_here
EMBEDDINGS_SECRET=any_random_string_here
```

### 3. Initialize Embeddings

Start your dev server:

```powershell
pnpm dev
```

In a new terminal, initialize the knowledge base:

```powershell
# With secret
curl -X POST http://localhost:3000/api/embeddings/initialize `
  -H "Authorization: Bearer your_embeddings_secret_here" `
  -H "Content-Type: application/json"

# Without secret (if you didn't set one)
curl -X POST http://localhost:3000/api/embeddings/initialize
```

You should see:

```json
{
  "success": true,
  "message": "Embeddings initialized successfully",
  "stats": { "totalChunks": 42, "totalEmbeddings": 42 }
}
```

## 🎉 Test It!

1. Open http://localhost:3000
2. Look for the chat button in the bottom-right corner
3. Click it and try these prompts:
   - "What projects have you built?"
   - "Tell me about your HRIS experience"
   - "What technologies do you use?"

## 📚 Full Documentation

See `CHATBOT_SETUP.md` for:

- Detailed setup instructions
- Troubleshooting guide
- Customization options
- Cost estimates
- Architecture overview

## 💰 Cost Estimate

For a typical portfolio chatbot:

- **Setup**: ~$0.002 (one-time)
- **Per chat**: ~$0.001-$0.003
- **Monthly**: ~$0.05-$0.15 (50 chats)

Vercel KV free tier: 10,000 commands/day (more than enough!)

## 🔧 Common Issues

**"Embeddings not initialized"**

- Run the initialization endpoint (Step 3 above)

**"OpenAI API key not configured"**

- Check `.env.local` exists and has correct `OPENAI_API_KEY`

**Chat window doesn't appear**

- Clear browser cache and reload
- Check browser console for errors

## 📝 Updating Portfolio Content

When you update `portfolio-content.md`:

1. Re-initialize embeddings with force flag:

```powershell
curl -X POST http://localhost:3000/api/embeddings/initialize `
  -H "Authorization: Bearer your_secret" `
  -H "Content-Type: application/json" `
  -d '{"force": true}'
```

This ensures the chatbot has your latest information!

## 🌐 Production Deployment

When deploying to Vercel:

1. Add environment variables in Vercel Dashboard:
   - Project Settings → Environment Variables
   - Add all from `.env.local`

2. Deploy your app

3. Initialize embeddings:

```powershell
curl -X POST https://your-domain.vercel.app/api/embeddings/initialize `
  -H "Authorization: Bearer your_secret"
```

Done! Your chatbot is now live! 🎊

## 📖 Tech Stack

- **LLM**: OpenAI GPT-4o-mini
- **Embeddings**: OpenAI text-embedding-3-small
- **Vector Store**: Vercel KV (Upstash Redis)
- **Framework**: Next.js 16 with App Router
- **Streaming**: AI SDK by Vercel
- **UI**: shadcn/ui + Framer Motion

---

Need help? Check `CHATBOT_SETUP.md` for comprehensive documentation!
