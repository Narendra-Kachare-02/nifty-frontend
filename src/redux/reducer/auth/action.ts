import { createAction } from '@reduxjs/toolkit';
import {
  AUTH_SEND_OTP_REQUEST,
  AUTH_VERIFY_OTP_REQUEST,
  AUTH_REFRESH_TOKEN_REQUEST,
  AUTH_LOGOUT,
} from './types';

// Action creators for UI dispatch (REQUEST actions only)
/** UI dispatches these; saga calls API and handles navigation. */
export const sendOtp = createAction<{ phone_number: string }>(AUTH_SEND_OTP_REQUEST);
export const verifyOtp = createAction<{ code: string; token: string }>(AUTH_VERIFY_OTP_REQUEST);
export const refreshToken = createAction<unknown>(AUTH_REFRESH_TOKEN_REQUEST);
export const logout = createAction(AUTH_LOGOUT);