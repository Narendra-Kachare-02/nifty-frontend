import { createAction } from '@reduxjs/toolkit';
import { OPTION_CHAIN_POLL_REQUEST } from './types';

export const pollOptionChain = createAction<{ expiryDate?: string | null }>(OPTION_CHAIN_POLL_REQUEST);

