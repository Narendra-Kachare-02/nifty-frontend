import type { NavigateFunction } from 'react-router';

let navigateRef: NavigateFunction | null = null;

export function setNavigate(navigate: NavigateFunction | null): void {
  navigateRef = navigate;
}

export function getNavigate(): NavigateFunction | null {
  return navigateRef;
}

/** Navigate from saga (e.g. after API success). */
export function navigateTo(path: string, state?: object): void {
  navigateRef?.(path, { replace: true, state });
}
