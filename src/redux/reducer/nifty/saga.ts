import { put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';

import { handleApiRequest } from '../../../api/handleSagaRequest';
import { endpoints } from '../../../api/endpoints';
import { pollNifty } from './action';
import { NIFTY_POLL_FAILURE, NIFTY_POLL_SUCCESS } from './types';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return (err as { message: string }).message;
  if (typeof err === 'string') return err;
  return 'An error occurred';
}

function* pollNiftySaga(): SagaIterator {
  try {
    yield* handleApiRequest(
      'GET',
      endpoints.NIFTY_LATEST,
      {},
      function* (data: unknown) {
        yield put({ type: NIFTY_POLL_SUCCESS, payload: data });
      },
      function* (errorData: unknown) {
        yield put({ type: NIFTY_POLL_FAILURE, payload: { error: getErrorMessage(errorData) } });
      },
      true
    );
  } catch (error: unknown) {
    yield put({ type: NIFTY_POLL_FAILURE, payload: { error: getErrorMessage(error) } });
  }
}

export function* watchNiftySaga(): SagaIterator {
  yield takeLatest(pollNifty.type, pollNiftySaga);
}

