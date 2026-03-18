import type { ReactNode } from 'react';

/**
 * Base screen entry – used by both auth and main layouts.
 * Add one entry to the appropriate registry to add a screen.
 */
export interface ScreenEntry {
  path: string;
  element: ReactNode;
}

/**
 * Main layout screen – extends base with nav and error boundary options.
 */
export interface MainScreenEntry extends ScreenEntry {
  label: string;
  /** Show in header nav (default: true) */
  showInNav?: boolean;
  /** Wrap element in DashboardErrorBoundary */
  wrapWithErrorBoundary?: boolean;
}
