# Shinkei (神経)

Shinkei is an interactive code flow visualizer for JavaScript/TypeScript repositories.
It builds a call graph from source code, lets you trace function paths forward/backward,
and supports a live telemetry mode for real-time flow updates.

## Features

- Static analysis mode with forward/backward traversal.
- Live trace mode driven by telemetry stream events.
- GitHub repository input with validation and normalization.
- Accepts `github.com/owner/repo`, `https://github.com/owner/repo`, and `git@github.com:owner/repo.git`.
- Interactive graph with node details, stats bar, and connection counts.
- Floating code panel with:
  - syntax-highlighted source,
  - AI summary,
  - follow-up chat (`Ask`) over the selected node,
  - resizable width and height (left, bottom, and corner handles),
  - sticky line numbers while scrolling code horizontally.

## Tech Stack

### Frontend

- React 19
- Vite 8
- Tailwind CSS 4
- Framer Motion
- Lucide React

### Backend

- Node.js + Express 5
- TypeScript Compiler API (analysis/indexing)
- OpenTelemetry (live tracing pipeline)
- Axios + Adm-Zip (repository fetching/extraction)

## Project Structure

- `frontend/` React app and graph UI
- `backend/` analysis APIs, telemetry ingestion, summarization services
- `backend/src/parser/` AST extractors and parser engine
- `backend/src/services/` indexing/query/tracing/summarization services

## Prerequisites

- Node.js 18+
- npm

## Setup

1. Install dependencies at workspace root:

```bash
npm install
```

2. Create backend environment file:

File: `backend/.env`

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

3. Start both apps from repo root:

```bash
npm run dev
```

This runs backend and frontend in parallel via npm workspaces.

## Workspace Scripts

From repo root:

- `npm run dev` -> starts frontend + backend
- `npm run dev:backend` -> backend only
- `npm run dev:frontend` -> frontend only

From `backend/`:

- `npm run dev` -> nodemon server
- `npm run start` -> node server

From `frontend/`:

- `npm run dev` -> Vite dev server
- `npm run build` -> production build
- `npm run preview` -> preview build

## Usage

1. Open Shinkei UI.
2. Choose mode:
   - Static Analysis: provide entry function + direction + depth.
   - Live Trace: start runtime session and capture interactions.
3. Paste repo URL (`github.com/owner/repo` works without protocol).
4. Run analysis.
5. In graph view:
   - inspect nodes,
   - open code panel,
   - summarize code,
   - ask follow-up questions in Summary chat,
   - resize panel to fit your workflow.

## Notes

- Public GitHub repositories are supported out of the box.
- If summarization/chat appears stale after backend code updates, restart backend process.
- Live trace behavior depends on telemetry ingestion and target app instrumentation.

## License

ISC
