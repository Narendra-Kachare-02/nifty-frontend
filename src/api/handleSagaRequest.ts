import { put, call, select } from 'redux-saga/effects';
import { showLoader, hideLoader } from '../redux/reducer/appLoader';
import { AXIOS_AUTH_KIT } from './axios';
import { endpoints } from './endpoints';
import { AUTH_REFRESH_TOKEN_SUCCESS } from '../redux/reducer/auth/types';
import { logout } from '../redux/reducer/auth';

/**
 * Universal API Request Handler
 * - Handles loader
 * - Handles token refresh
 * - Retries once on 401
 * - Calls success/error callbacks safely
 */

export function* handleApiRequest(
  method: string,
  endpoint: string,
  params: any = {},
  onSuccess?: (data: any, status: number) => Generator,
  onError?: (error: any, httpStatusCode?: number) => Generator,
  allowRetry: boolean = true
): Generator<any, any, any> {
  let hasRetried = false;

  try {
    // Show loader only once
    yield put(showLoader());

    while (true) {
      try {
        const response: any = yield call(
          AXIOS_AUTH_KIT,
          method,
          endpoint,
          params
        );

        // ✅ Success (2xx)
        if (response?.status >= 200 && response?.status < 300) {
          if (onSuccess) {
            yield* onSuccess(response.data, response.status);
          }
          return;
        }

        // If non-2xx but no thrown error (rare case)
        throw response;

      } catch (error: any) {
        const httpStatusCode = error?.data?.http_status_code;

        // 🔁 Token Expired (401) → Try refresh once
        if (allowRetry && !hasRetried && httpStatusCode === 401) {
          hasRetried = true;

          const refreshSuccess: boolean = yield call(refreshToken);

          if (refreshSuccess) {
            continue; // Retry original request
          } else {
            yield put(logout());
            return;
          }
        }

        // ❌ Other Errors
        if (onError) {
          yield* onError(error?.response?.data, httpStatusCode);
        }

        return;
      }
    }

  } finally {
    // Always hide loader
    yield put(hideLoader());
  }
}


/**
 * Refresh Token Handler
 */
function* refreshToken(): Generator<any, boolean, any> {
  try {
    const refreshToken: string = yield select(
      (state: any) => state.auth.refresh_token
    );

    if (!refreshToken) {
      return false;
    }

    const response: any = yield call(
      AXIOS_AUTH_KIT,
      'POST',
      endpoints.REFRESH_TOKEN,
      {refresh:refreshToken}
    );

    if (response?.status >= 200 && response?.status < 300) {
      yield put({
        type: AUTH_REFRESH_TOKEN_SUCCESS,
        payload: response.data,
      });

      return true;
    }

    return false;

  } catch {
    yield put(logout());
    return false;
  }
}