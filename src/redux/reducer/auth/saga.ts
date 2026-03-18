import { put, takeLatest, select } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';
import {
  AUTH_SEND_OTP_SUCCESS,
  AUTH_SEND_OTP_FAILURE,
  AUTH_VERIFY_OTP_SUCCESS,
  AUTH_VERIFY_OTP_FAILURE,
  AUTH_REFRESH_TOKEN_SUCCESS,
  AUTH_REFRESH_TOKEN_FAILURE,
  AUTH_RESET_STATE,
} from './types';
import { handleApiRequest } from '../../../api/handleSagaRequest';
import { endpoints } from '../../../api/endpoints';
import { navigateTo } from '../../../common/utils/navigationRef';
import { ROUTES } from '../../../common/routes';
import { sendOtp, verifyOtp, refreshToken, logout } from './action';
import { NIFTY_RESET_STATE } from '../nifty/types';
import { OPTION_CHAIN_RESET_STATE } from '../optionChain/types';
import { NIFTY_SERIES_RESET_STATE } from '../niftySeries/types';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return (err as { message: string }).message;
  if (typeof err === 'string') return err;
  return 'An error occurred';
}

function* sendOtpSaga(action: ReturnType<typeof sendOtp>): SagaIterator {
  const { phone_number } = action.payload;
  try {
    yield* handleApiRequest(
      'POST',
      endpoints.SEND_OTP,
      { phone_number },
      function* (data: { token?: string }) {
        yield put({ type: AUTH_SEND_OTP_SUCCESS, payload: { token: data?.token } });
        navigateTo(ROUTES.VERIFY, { token: data?.token, phone_number });
      },
      function* (errorData: unknown) {
        yield put({ type: AUTH_SEND_OTP_FAILURE, payload: { error: getErrorMessage(errorData) } });
      },
      false
    );
  } catch (error: unknown) {
    yield put({ type: AUTH_SEND_OTP_FAILURE, payload: { error: getErrorMessage(error) } });
  }
}

function* verifyOtpSaga(action: ReturnType<typeof verifyOtp>): SagaIterator {
  const { code, token } = action.payload;
  try {
    yield* handleApiRequest(
      'POST',
      endpoints.VERIFY_OTP,
      { token, code },
      function* (data: { user?: unknown }) {
        yield put({ type: AUTH_VERIFY_OTP_SUCCESS, payload: data?.user ?? data });
        navigateTo(ROUTES.HOME);
      },
      function* (errorData: unknown) {
        yield put({
          type: AUTH_VERIFY_OTP_FAILURE,
          payload: { error: getErrorMessage(errorData) },
        });
      },
      false
    );
  } catch (error: unknown) {
    yield put({
      type: AUTH_VERIFY_OTP_FAILURE,
      payload: { error: getErrorMessage(error) },
    });
  }
}

function* refreshTokenSaga(): SagaIterator {
  const state: { auth?: { refresh_token?: string } } = yield select((s: unknown) => s);
  const refresh = state?.auth?.refresh_token;
  if (!refresh) {
    yield put(logout());
    return;
  }
  try {
    yield* handleApiRequest(
      'POST',
      endpoints.REFRESH_TOKEN,
      { refresh },
      function* (data: unknown) {
        yield put({ type: AUTH_REFRESH_TOKEN_SUCCESS, payload: data });
      },
      function* (errorData: unknown) {
        yield put({ type: AUTH_REFRESH_TOKEN_FAILURE, payload: { error: getErrorMessage(errorData) } });
        yield put(logout());
      },
      false
    );
  } catch (error: unknown) {
    yield put({ type: AUTH_REFRESH_TOKEN_FAILURE, payload: { error: getErrorMessage(error) } });
    yield put(logout());
  }
}

function* logoutSaga(): SagaIterator {
  // Reset *all* feature reducers before clearing persisted storage.
  // This avoids stale market data flashing during navigation and prevents
  // reducers from briefly rehydrating incompatible state.
  yield put({ type: AUTH_RESET_STATE });
  yield put({ type: NIFTY_RESET_STATE });
  yield put({ type: OPTION_CHAIN_RESET_STATE });
  yield put({ type: NIFTY_SERIES_RESET_STATE });
  navigateTo(ROUTES.SIGNIN);
  localStorage.clear();
}

export function* watchAuthSaga(): SagaIterator {
  yield takeLatest(sendOtp.type, sendOtpSaga);
  yield takeLatest(verifyOtp.type, verifyOtpSaga);
  yield takeLatest(refreshToken.type, refreshTokenSaga);
  yield takeLatest(logout.type, logoutSaga);
}
