import type { RootState } from '../../store';

export const selectNiftyLatest = (state: RootState) => state.nifty?.latest ?? null;
export const selectNiftyLoading = (state: RootState) => state.nifty?.loading ?? false;
export const selectNiftyError = (state: RootState) => state.nifty?.error ?? null;
export const selectNiftyIsPolling = (state: RootState) => state.nifty?.isPolling ?? false;

