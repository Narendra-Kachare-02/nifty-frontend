import { ROUTES } from '../../common/routes';
import type { MainScreenEntry } from '../types';
import { NiftyScreen } from './NiftyScreen';


/**
 * Main layout screens. Add one entry – nav link and route are created automatically.
 */
export const MAIN_SCREEN_ENTRIES: MainScreenEntry[] = [
  { path: ROUTES.HOME, label: 'Home', element: <NiftyScreen />, showInNav: false },
];

export const MAIN_FALLBACK_PATH = ROUTES.HOME;
