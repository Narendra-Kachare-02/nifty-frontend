import { createSlice } from '@reduxjs/toolkit';
import { OPTION_CHAIN_POLL_FAILURE, OPTION_CHAIN_POLL_REQUEST, OPTION_CHAIN_POLL_SUCCESS, OPTION_CHAIN_RESET_STATE } from './types';

export interface OptionChainSnapshot {
  captured_at: string;
  symbol: string;
  expiryDate?: string | null;
  payload: Record<string, any>;
}

interface OptionChainState {
  latest: OptionChainSnapshot | null;
  loading: boolean;
  error: string | null;
  lastSuccessAt: number | null;
}

const initialState: OptionChainState = {
  latest: null,
  loading: false,
  error: null,
  lastSuccessAt: null,
};

const optionChainSlice = createSlice({
  name: 'optionChain',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(OPTION_CHAIN_RESET_STATE, () => initialState)
      .addCase(OPTION_CHAIN_POLL_REQUEST, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(OPTION_CHAIN_POLL_SUCCESS, (state, action: any) => {
        state.loading = false;
        state.latest = action.payload;
        state.lastSuccessAt = Date.now();
        state.error = null;
      })
      .addCase(OPTION_CHAIN_POLL_FAILURE, (state, action: any) => {
        state.loading = false;
        state.error = action.payload?.error ?? 'Failed to fetch Option Chain';
      });
  },
});

export default optionChainSlice.reducer;

