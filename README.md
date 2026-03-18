# Frontend (React + Vite + Redux-Saga)

## What this does
- Renders a NIFTY 50 dashboard at `/nifty`.
- Polls backend `GET /api/nifty/latest/` periodically.
- Shows NSE Option Chain (5 columns) on the right.
- Renders a professional price chart (time ranges + last marker).

## Setup

### 1) Install

```bash
bun install
```

### 2) Environment
Set backend base URL:
- `VITE_API_BASE_URL` (example: `http://127.0.0.1:8001/`)

Optional polling config:
- `VITE_NIFTY_POLL_INTERVAL_MS` (default `5000`)

### 3) Run

```bash
bun run dev
```

## Docs
- See `frontend/docs/ARCHITECTURE.md`
- See `frontend/docs/RULES.md`

