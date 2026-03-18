import { createAction } from '@reduxjs/toolkit';
import { NIFTY_BOOTSTRAP_REQUEST, NIFTY_POLL_REQUEST, NIFTY_START_POLLING, NIFTY_STOP_POLLING } from './types';

export const pollNifty = createAction<unknown>(NIFTY_POLL_REQUEST);
export const startNiftyPolling = createAction<unknown>(NIFTY_START_POLLING);
export const stopNiftyPolling = createAction<unknown>(NIFTY_STOP_POLLING);
export const bootstrapNifty = createAction<unknown>(NIFTY_BOOTSTRAP_REQUEST);

