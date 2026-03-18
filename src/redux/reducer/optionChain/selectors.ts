import type { RootState } from '../../store';

export const selectOptionChainLatest = (state: RootState) => state.optionChain?.latest ?? null;
export const selectOptionChainLoading = (state: RootState) => state.optionChain?.loading ?? false;
export const selectOptionChainError = (state: RootState) => state.optionChain?.error ?? null;

