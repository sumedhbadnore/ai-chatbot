# Portfolio AI Chatbot (Next.js + Vercel AI SDK)

A lightweight, privacy-conscious chat widget that answers questions about **you**, grounded by a small in-repo knowledge base.

## 🧰 Tech

- Next.js 14 App Router (Edge runtime for fast cold starts)
- Vercel AI SDK (`ai`, `@ai-sdk/openai`) for streaming chat
- Tiny in-memory RAG (no external DB). Swap with a vector DB later if needed.

## 🚀 Quickstart

1. **Clone** this folder or copy files into your portfolio repo.
2. **Install** deps: `pnpm i` (or `npm i` / `yarn`)
3. **Create** `.env.local` with your key:

```
OPENAI_API_KEY=sk-...
```

4. **Edit** `data/profile.ts` with your facts + links.
5. **Run** locally: `pnpm dev` then open http://localhost:3000
6. **Deploy**: push to GitHub and import on Vercel. Environment variable `OPENAI_API_KEY` must be set in Project Settings → Environment Variables.

## 🔒 Privacy

- No server-side persistence. The API streams directly from the model.
- You control exactly what the bot knows via `data/profile.ts`.

## 🧠 RAG Notes

- We use a deterministic hash-based embedding to rank profile chunks (fast & free). For higher accuracy:
- Replace `fakeEmbed` with OpenAI embeddings and cache vectors.
- Or use a vector DB (e.g., Vercel Postgres, Pinecone, Upstash Vector) and index `PROFILE` plus your blog posts.

## 🧩 Custom Prompts

- Adjust behavior in the `system` prompt inside `app/api/chat/route.ts`.
- Add tool functions for more capabilities (e.g., fetching latest blog posts).

## 🧪 Test Prompts

- "What stacks do you use?"
- "Share your resume link."
- "What’s a project you’re proud of?"
- "Where are you located and what roles are you seeking?"

## ❓FAQ

**Q: Can it refuse off-topic questions?** Yes—prompt enforces that.
**Q: Can it hallucinate?** We ground with `PROFILE`; still keep answers short, and add citations like (p2).
**Q: Multiple personas?** Create multiple `PROFILE`s and select one based on route/URL.
