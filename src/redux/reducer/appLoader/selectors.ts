// Selectors for appLoader
export const selectIsLoading = (state: { appLoader: { loadingCount: number } }): boolean => {
  return state.appLoader.loadingCount > 0;
};

export const selectLoadingCount = (state: { appLoader: { loadingCount: number } }): number => {
  return state.appLoader.loadingCount;
};

