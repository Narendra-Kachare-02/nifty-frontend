import {type RootState } from "../../store";

// Selectors for auth feature
export const isLoggedIn = (state:RootState) =>  state.auth.loggedIn;
export const userType = (state:RootState) =>  state.auth.user_type;
export const accessToken = (state:RootState) =>  state.auth.access_token;
export const userStatus = (state:RootState) =>  state.auth.status;