# Neurix AI — full-stack AI chat starter

A Claude-inspired (not Claude-branded) chat app: Next.js frontend + Express backend,
streaming responses from the Anthropic API, Postgres persistence via Prisma.

## Structure
```
neurix/
  frontend/   Next.js 14 app (App Router, TypeScript, Tailwind)
  backend/    Express API server (auth, conversations, streaming)
```

## Quick start

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env   # add DATABASE_URL, ANTHROPIC_API_KEY, JWT_SECRET
npx prisma migrate dev --name init
npm run dev             # http://localhost:4000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local   # set NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev              # http://localhost:3000
```

## What's included
- Email/password auth (JWT, bcrypt)
- Conversations + messages persisted in Postgres (Prisma schema)
- Streaming AI replies over Server-Sent Events, backed by the Anthropic Messages API
- Sidebar with conversation list, new chat, delete
- Markdown + code-block rendering on the client
- Own visual identity (see `frontend/app/globals.css` for the design tokens) —
  swap these before you ship anything publicly

## What's stubbed / left for you
- Password reset email flow (endpoint stubbed, no email provider wired up)
- File upload handling (UI hook present, storage backend not implemented)
- OAuth login
- Rate limiting / abuse protection

This is a starting point, not a production-ready clone — treat it as scaffolding to build on.
