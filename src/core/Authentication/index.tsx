import { ROUTES } from '../../common/routes';
import type { ScreenEntry } from '../types';
import { Signin } from './Signin';
import { Verifyotp } from './Verify';

/**
 * Auth layout screens. Add one entry – route is created automatically.
 */
export const AUTH_SCREEN_ENTRIES: ScreenEntry[] = [
  { path: ROUTES.SIGNIN, element: <Signin /> },
  { path: ROUTES.VERIFY, element: <Verifyotp /> },
];

export const AUTH_FALLBACK_PATH = ROUTES.SIGNIN;
