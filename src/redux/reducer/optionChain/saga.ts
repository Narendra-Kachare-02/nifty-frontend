import { put, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';

import { handleApiRequest } from '../../../api/handleSagaRequest';
import { endpoints } from '../../../api/endpoints';
import { pollOptionChain } from './action';
import { OPTION_CHAIN_POLL_FAILURE, OPTION_CHAIN_POLL_SUCCESS } from './types';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return (err as { message: string }).message;
  if (typeof err === 'string') return err;
  return 'An error occurred';
}

function* pollOptionChainSaga(action: ReturnType<typeof pollOptionChain>): SagaIterator {
  try {
    const expiryDate = action.payload?.expiryDate ?? null;
    const endpoint = expiryDate ? `${endpoints.NIFTY_OPTION_CHAIN_LATEST}?expiryDate=${encodeURIComponent(expiryDate)}` : endpoints.NIFTY_OPTION_CHAIN_LATEST;

    yield* handleApiRequest(
      'GET',
      endpoint,
      {},
      function* (data: unknown) {
        yield put({ type: OPTION_CHAIN_POLL_SUCCESS, payload: data });
      },
      function* (errorData: unknown) {
        yield put({ type: OPTION_CHAIN_POLL_FAILURE, payload: { error: getErrorMessage(errorData) } });
      },
      true
    );
  } catch (error: unknown) {
    yield put({ type: OPTION_CHAIN_POLL_FAILURE, payload: { error: getErrorMessage(error) } });
  }
}

export function* watchOptionChainSaga(): SagaIterator {
  yield takeLatest(pollOptionChain.type, pollOptionChainSaga);
}

