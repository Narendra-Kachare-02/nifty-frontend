import { createSlice } from '@reduxjs/toolkit';
import {
  AUTH_SEND_OTP_SUCCESS,
  AUTH_SEND_OTP_FAILURE,
  AUTH_VERIFY_OTP_SUCCESS,
  AUTH_VERIFY_OTP_FAILURE,
  AUTH_REFRESH_TOKEN_SUCCESS,
  AUTH_REFRESH_TOKEN_FAILURE,
  AUTH_RESET_STATE,
  AUTH_USER_STATUS_SUCCESS,
} from './types';

interface AuthState {
  token: string | null;
  error: string | null;
  access_token : string | null;
  refresh_token : string | null;
  access_time : number;
  refresh_time : number;
  user_type : string | null;
  status : string | null;
  loggedIn : boolean;
}

const initialState: AuthState = {
  token: null,
  error: null,
  access_token : null,
  refresh_token : null,
  access_time : 0,
  refresh_time : 0,
  user_type : null,
  status : null,
  loggedIn : false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // No reducers - all async flows use extraReducers
  },
  extraReducers: (builder) => {
    builder
      // SEND_OTP_SUCCESS
      .addCase(AUTH_SEND_OTP_SUCCESS, (state, action: any) => {
        state.token = action.payload?.token;
        state.error = null;
      })
      // SEND_OTP_FAILURE
      .addCase(AUTH_SEND_OTP_FAILURE, (state, action: any) => {
        state.error = action.payload.error;
      })
      // VERIFY_OTP_SUCCESS
      .addCase(AUTH_VERIFY_OTP_SUCCESS, (state, action: any) => {
        state.error = null;
        state.loggedIn = true;
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.access_time = action.payload.access_time;
        state.refresh_time = action.payload.refresh_time;
        state.user_type = action.payload.user_type;
        state.status = action.payload.status;

      })
      // VERIFY_OTP_FAILURE
      .addCase(AUTH_VERIFY_OTP_FAILURE, (state, action: any) => {
        state.error = action.payload.error;
      })
      // REFRESH_TOKEN_SUCCESS
      .addCase(AUTH_REFRESH_TOKEN_SUCCESS, (state, action: any) => {
        state.access_token = action.payload.access_token;
        state.refresh_token = action.payload.refresh_token;
        state.access_time = action.payload.access_time;
        state.refresh_time = action.payload.refresh_time;
      })
      // REFRESH_TOKEN_FAILURE
      .addCase(AUTH_REFRESH_TOKEN_FAILURE, (state, action: any) => {
        state.error = action.payload.error;
      })
      // USER_STATUS_SUCCESS
      .addCase(AUTH_USER_STATUS_SUCCESS, (state, action: any) => {
        state.status = action.payload.status;
      })
      // RESET_STATE (saga-orchestrated)
      .addCase(AUTH_RESET_STATE, () => initialState)
      
  },
});

export default authSlice.reducer;

