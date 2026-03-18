import { createSlice } from '@reduxjs/toolkit';
import { NIFTY_POLL_FAILURE, NIFTY_POLL_REQUEST, NIFTY_POLL_SUCCESS, NIFTY_RESET_STATE } from './types';

export interface NiftySnapshot {
  captured_at: string;
  source_lastUpdateTime?: string | null;
  name?: string | null;
  advance?: Record<string, any>;
  timestamp?: string | null;
  marketStatus: Record<string, any>;
  metadata: Record<string, any>;
  data: Array<Record<string, any>>;
}

interface NiftyState {
  latest: NiftySnapshot | null;
  loading: boolean;
  error: string | null;
  isPolling: boolean;
  lastSuccessAt: number | null;
}

const initialState: NiftyState = {
  latest: null,
  loading: false,
  error: null,
  isPolling: false,
  lastSuccessAt: null,
};

const niftySlice = createSlice({
  name: 'nifty',
  initialState,
  reducers: {
    // local reducers only when needed
    setPolling(state, action: { payload: boolean }) {
      state.isPolling = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(NIFTY_RESET_STATE, () => initialState)
      .addCase(NIFTY_POLL_REQUEST, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(NIFTY_POLL_SUCCESS, (state, action: any) => {
        state.loading = false;
        state.latest = action.payload;
        state.lastSuccessAt = Date.now();
        state.error = null;
      })
      .addCase(NIFTY_POLL_FAILURE, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error ?? 'Failed to fetch Nifty data';
      });
  },
});

export const { setPolling } = niftySlice.actions;
export default niftySlice.reducer;

