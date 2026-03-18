import { createAction } from '@reduxjs/toolkit';
import { APP_LOADER_SHOW, APP_LOADER_HIDE } from './types';

// Action creators for UI dispatch
export const showLoader = createAction(APP_LOADER_SHOW);
export const hideLoader = createAction(APP_LOADER_HIDE);

