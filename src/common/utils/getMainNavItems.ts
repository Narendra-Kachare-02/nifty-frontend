import { MAIN_SCREEN_ENTRIES } from '../../core/Main';

/** Nav items for header (path + label only). */
export function getMainNavItems(): Array<{ path: string; label: string }> {
  return MAIN_SCREEN_ENTRIES.filter((e) => e.showInNav !== false).map(({ path, label }) => ({
    path,
    label,
  }));
}
