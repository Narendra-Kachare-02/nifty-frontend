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
3. Hook `usePollOptionChain` starts polling option chain (same interval + visibility/overlap rules).
4. Hook `useFetchNiftySeries(range)` loads chart series when range changes (`15M|30M|1H|1D`).
5. Saga `watchNiftySaga` handles `pollNifty`:
   - calls `handleApiRequest('GET', endpoints.NIFTY_LATEST, ...)`
   - dispatches `NIFTY_POLL_SUCCESS` / `NIFTY_POLL_FAILURE`
6. Saga `watchOptionChainSaga` handles `pollOptionChain`:
   - calls `handleApiRequest('GET', endpoints.NIFTY_OPTION_CHAIN_LATEST, ...)`
   - dispatches `OPTION_CHAIN_POLL_SUCCESS` / `OPTION_CHAIN_POLL_FAILURE`
7. UI reads state via selectors.

## Redux conventions
- Feature folder: `src/redux/reducer/nifty/`
- Option chain feature: `src/redux/reducer/optionChain/`
- Async state updates via **extraReducers**.
- Selectors for reads; components should not dig into raw store shape.

