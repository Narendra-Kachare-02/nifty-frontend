import { createAction } from '@reduxjs/toolkit';
import { NIFTY_SERIES_FETCH_REQUEST } from './types';

export type NiftyRange = '1D' | '1M' | '3M' | '6M' | '1Y';

export const fetchNiftySeries = createAction<{ range: NiftyRange }>(NIFTY_SERIES_FETCH_REQUEST);

