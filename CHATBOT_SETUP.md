# AI Chatbot Setup Guide

This portfolio includes an intelligent RAG (Retrieval-Augmented Generation) chatbot that answers questions about Samuel's projects, experience, and skills using OpenAI and Vercel KV (Upstash Redis).

## Features

✨ **RAG-powered responses** - Only answers questions based on portfolio content  
🎯 **Floating UI** - Professional bottom-right chat button and window  
⚡ **Streaming responses** - Real-time typewriter effect  
🔒 **Secure** - Protected initialization endpoint  
📱 **Responsive** - Works on all screen sizes  
🎨 **Themed** - Matches your portfolio's design system

## Prerequisites

Before setting up the chatbot, you'll need:

1. **OpenAI API Key** - For chat completions and embeddings
2. **Vercel KV Database** - For storing vector embeddings (or Upstash Redis)

## Step 1: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** in your account settings
4. Click **Create new secret key**
5. Copy the key (it starts with `sk-proj-...`)
6. Save it securely - you won't be able to see it again!

**Cost Note**: The chatbot uses:

- `gpt-4o-mini` for chat completions (~$0.15 per 1M input tokens)
- `text-embedding-3-small` for embeddings (~$0.02 per 1M tokens)

Expected cost for a portfolio chatbot: **< $1/month** for typical usage.

## Step 2: Set Up Vercel KV (Upstash Redis)

### Option A: Via Vercel Dashboard (Recommended)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to **Storage** tab
3. Click **Create Database**
4. Select **KV** (Key-Value Store)
5. Choose a name (e.g., `portfolio-chatbot-kv`)
6. Select a region (choose closest to your users)
7. Click **Create**
8. Copy the environment variables:
   - `KV_REST_API_URL`
   - `KV_REST_API_TOKEN`

### Option B: Via Upstash (Direct)

1. Go to [Upstash Console](https://console.upstash.com/)
2. Create an account or log in
3. Click **Create Database**
4. Choose **Redis** with **REST API**
5. Select a region
6. Copy the REST API credentials

**Cost Note**: Free tier includes 10,000 commands/day, which is more than enough for a portfolio chatbot.

## Step 3: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

   ```powershell
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:

   ```env
   OPENAI_API_KEY=sk-proj-your_actual_openai_api_key_here
   KV_REST_API_URL=https://your-kv-url.upstash.io
   KV_REST_API_TOKEN=your_actual_kv_token_here
   EMBEDDINGS_SECRET=your_random_secret_here
   ```

3. Generate a random secret for `EMBEDDINGS_SECRET` (optional but recommended):

   ```powershell
   # PowerShell
   -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```

   Or use any random string (e.g., `my_super_secret_key_12345`)

## Step 4: Initialize Embeddings

After configuring environment variables, you need to initialize the vector embeddings:

### For Local Development

1. Start your development server:

   ```powershell
   pnpm dev
   ```

2. In a new terminal, call the initialization endpoint:

   ```powershell
   # If you set EMBEDDINGS_SECRET
   curl -X POST http://localhost:3000/api/embeddings/initialize `
     -H "Authorization: Bearer your_embeddings_secret_here" `
     -H "Content-Type: application/json"

   # Or if you didn't set a secret
   curl -X POST http://localhost:3000/api/embeddings/initialize
   ```

3. You should see a success response:
   ```json
   {
     "success": true,
     "message": "Embeddings initialized successfully",
     "stats": {
       "totalChunks": 42,
       "totalEmbeddings": 42,
       "contentLength": 12345
     }
   }
   ```

### For Production (Vercel)

1. Deploy your app to Vercel
2. Add environment variables in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from `.env.local`
3. Redeploy your app
4. Call the initialization endpoint:
   ```powershell
   curl -X POST https://your-domain.vercel.app/api/embeddings/initialize `
     -H "Authorization: Bearer your_embeddings_secret_here" `
     -H "Content-Type: application/json"
   ```

## Step 5: Test the Chatbot

1. Open your portfolio in a browser
2. Look for the chat button in the bottom-right corner
3. Click it to open the chat window
4. Try these example prompts:
   - "What projects have you built?"
   - "Tell me about your experience with Next.js"
   - "What technologies do you use?"
   - "Describe your work on HRIS systems"

The chatbot should respond with information from your portfolio content!

## Troubleshooting

### Chatbot shows error message

**Check API keys:**

```powershell
# Verify OpenAI key is set
echo $env:OPENAI_API_KEY  # Should show: sk-proj-...

# Verify KV credentials are set
echo $env:KV_REST_API_URL
echo $env:KV_REST_API_TOKEN
```

**Check embeddings status:**

```powershell
curl http://localhost:3000/api/embeddings/initialize
```

Should return `{"initialized": true}`. If false, run the initialization again.

### Embeddings initialization fails

1. **Check OpenAI API key** - Ensure it's valid and has credits
2. **Check file exists** - Verify `portfolio-content.md` is in the root directory
3. **Check console logs** - Look for detailed error messages in terminal

### Chatbot gives generic/wrong answers

1. **Re-initialize embeddings** - Content may have changed:

   ```powershell
   curl -X POST http://localhost:3000/api/embeddings/initialize `
     -H "Authorization: Bearer your_secret" `
     -H "Content-Type: application/json" `
     -d '{"force": true}'
   ```

2. **Check relevance** - The chatbot only answers questions about your portfolio. Questions outside this scope will be declined.

### Chat window doesn't appear

1. Check browser console for errors
2. Verify React and Next.js are running correctly
3. Clear browser cache and reload

## Updating Portfolio Content

When you update `portfolio-content.md`:

1. Save your changes
2. Re-initialize embeddings (with `force: true`):
   ```powershell
   curl -X POST http://localhost:3000/api/embeddings/initialize `
     -H "Authorization: Bearer your_secret" `
     -H "Content-Type: application/json" `
     -d '{"force": true}'
   ```

This ensures the chatbot has the latest information.

## Architecture Overview

```
User Question
     ↓
Chat Container (components/chat/chat-container.tsx)
     ↓
API Route (/api/chat/route.ts)
     ↓
Generate Query Embedding (OpenAI text-embedding-3-small)
     ↓
Search Vector Store (Vercel KV) → Find Top 5 Similar Chunks
     ↓
Build Context + System Prompt
     ↓
Stream Response (OpenAI gpt-4o-mini)
     ↓
Display with Typewriter Effect
```

## Cost Estimation

For a typical portfolio with ~2,000 words:

- **Initial embedding**: ~$0.002 (one-time)
- **Per chat message**: ~$0.001-$0.003
- **Monthly cost** (50 chats): ~$0.05-$0.15

Vercel KV free tier is sufficient for most portfolios.

## Customization

### Change Suggested Prompts

Edit [components/chat/chat-window.tsx](components/chat/chat-window.tsx):

```typescript
suggestedPrompts={[
  "Your custom prompt 1",
  "Your custom prompt 2",
  "Your custom prompt 3",
]}
```

### Change Chat Appearance

The chatbot uses your portfolio's theme system. Modify:

- Colors: Update CSS variables in [app/globals.css](app/globals.css)
- Size: Edit dimensions in [components/chat/chat-window.tsx](components/chat/chat-window.tsx)
- Position: Adjust `bottom` and `right` values in chat components

### Change AI Model

Edit [app/api/chat/route.ts](app/api/chat/route.ts):

```typescript
model: 'gpt-4o',  // More capable but more expensive
// model: 'gpt-4o-mini',  // Current (balanced)
// model: 'gpt-3.5-turbo',  // Cheaper but less capable
```

### Add More Context Sources

Currently uses `portfolio-content.md`. To add more:

1. Create additional content files
2. Modify [app/api/embeddings/initialize/route.ts](app/api/embeddings/initialize/route.ts)
3. Concatenate or process multiple files
4. Re-initialize embeddings

## Security Notes

- **Never commit `.env.local`** - It contains secret keys
- **Protect initialization endpoint** - Use `EMBEDDINGS_SECRET`
- **Rate limiting** - Consider adding rate limits for production
- **API key security** - Use environment variables, never hardcode

## Support

For issues or questions:

1. Check console logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure embeddings are initialized
4. Review the architecture overview above

## License

This chatbot implementation is part of your portfolio and follows the same license as your main project.
