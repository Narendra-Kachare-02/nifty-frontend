import type { RootState } from '../../store';
import type { NiftyRange } from './action';
import type { NiftySeriesPayload } from './slice';

export const selectNiftySeriesByRange = (range: NiftyRange) => (state: RootState): NiftySeriesPayload | null =>
  (state.niftySeries?.byRange?.[range] as NiftySeriesPayload | undefined) ?? null;

export const selectNiftySeriesLoading = (range: NiftyRange) => (state: RootState): boolean =>
  Boolean(state.niftySeries?.loadingByRange?.[range]);

export const selectNiftySeriesError = (range: NiftyRange) => (state: RootState): string | null =>
  (state.niftySeries?.errorByRange?.[range] as string | null | undefined) ?? null;

