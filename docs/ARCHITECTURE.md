# Frontend architecture (Nifty)

## Goal
- Poll backend `GET /api/nifty/latest/` and show a clean NIFTY 50 dashboard.
- Avoid unnecessary calls (pause when tab hidden, avoid overlapping requests).

## Data flow
1. `NiftyScreen` mounts (`/nifty`).
2. Hook `usePollNifty` starts polling:
   - interval controlled by `VITE_NIFTY_POLL_INTERVAL_MS`
   - pauses when tab is hidden
   - prevents overlap (no new poll while loading)
3. Saga `watchNiftySaga` handles `pollNifty`:
   - calls `handleApiRequest('GET', endpoints.NIFTY_LATEST, ...)`
   - dispatches `NIFTY_POLL_SUCCESS` / `NIFTY_POLL_FAILURE`
4. UI reads state via selectors (`selectNiftyLatest`, etc.).

## Redux conventions
- Feature folder: `src/redux/reducer/nifty/`
- Async state updates via **extraReducers**.
- Selectors for reads; components should not dig into raw store shape.

