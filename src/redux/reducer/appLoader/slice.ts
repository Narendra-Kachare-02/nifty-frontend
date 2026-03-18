import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { APP_LOADER_SHOW, APP_LOADER_HIDE } from './types';

interface AppLoader {
  loadingCount: number; // Counter-based, not boolean
  isLoading: boolean;
}

const initialState: AppLoader = {
  loadingCount: 0,
  isLoading: false,
};

const appLoaderSlice = createSlice({
  name: 'appLoader',
  initialState,
  reducers: {
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(APP_LOADER_SHOW, (state) => {
        state.isLoading = true;
      })
      .addCase(APP_LOADER_HIDE, (state) => {
        state.isLoading = false;
      });
  },
});

export default appLoaderSlice.reducer;

