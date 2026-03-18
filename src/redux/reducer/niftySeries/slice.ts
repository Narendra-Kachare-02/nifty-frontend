import { createSlice } from '@reduxjs/toolkit';
import {
  NIFTY_SERIES_FETCH_FAILURE,
  NIFTY_SERIES_FETCH_REQUEST,
  NIFTY_SERIES_FETCH_SUCCESS,
  NIFTY_SERIES_RESET_STATE,
} from './types';
import type { NiftyRange } from './action';

export interface NiftySeriesPoint {
  time: number;
  value: number;
}

export interface NiftySeriesPayload {
  range: NiftyRange;
  series: NiftySeriesPoint[];
  closePrice: number | null;
}

interface NiftySeriesState {
  byRange: Partial<Record<NiftyRange, NiftySeriesPayload>>;
  loadingByRange: Partial<Record<NiftyRange, boolean>>;
  errorByRange: Partial<Record<NiftyRange, string | null>>;
  lastSuccessAtByRange: Partial<Record<NiftyRange, number>>;
}

const initialState: NiftySeriesState = {
  byRange: {},
  loadingByRange: {},
  errorByRange: {},
  lastSuccessAtByRange: {},
};

const niftySeriesSlice = createSlice({
  name: 'niftySeries',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(NIFTY_SERIES_RESET_STATE, () => initialState)
      .addCase(NIFTY_SERIES_FETCH_REQUEST, (state, action: any) => {
        const range = action.payload?.range as NiftyRange;
        if (!range) return;
        state.loadingByRange[range] = true;
        state.errorByRange[range] = null;
      })
      .addCase(NIFTY_SERIES_FETCH_SUCCESS, (state, action: any) => {
        const payload = action.payload as NiftySeriesPayload | undefined;
        const range = payload?.range;
        if (!range) return;
        state.loadingByRange[range] = false;
        state.byRange[range] = payload;
        state.lastSuccessAtByRange[range] = Date.now();
        state.errorByRange[range] = null;
      })
      .addCase(NIFTY_SERIES_FETCH_FAILURE, (state, action: any) => {
        const range = action.payload?.range as NiftyRange;
        if (!range) return;
        state.loadingByRange[range] = false;
        state.errorByRange[range] = action.payload?.error ?? 'Failed to fetch Nifty series';
      });
  },
});

export default niftySeriesSlice.reducer;

