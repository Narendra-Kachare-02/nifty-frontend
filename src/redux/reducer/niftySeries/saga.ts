import { put, select, takeLatest } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';

import { handleApiRequest } from '../../../api/handleSagaRequest';
import { endpoints } from '../../../api/endpoints';
import { fetchNiftySeries } from './action';
import { NIFTY_SERIES_FETCH_FAILURE, NIFTY_SERIES_FETCH_SUCCESS } from './types';
import { selectNiftySeriesByRange } from './selectors';

function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) return (err as { message: string }).message;
  if (typeof err === 'string') return err;
  return 'An error occurred';
}

function* fetchNiftySeriesSaga(action: ReturnType<typeof fetchNiftySeries>): SagaIterator {
  const range = action.payload?.range;
  if (!range) return;

  // Cache-only: if we already have this range, do nothing.
  const existing: unknown = yield select(selectNiftySeriesByRange(range));
  if (existing) return;

  try {
    const endpoint = `${endpoints.NIFTY_SERIES}?range=${encodeURIComponent(range)}`;

    yield* handleApiRequest(
      'GET',
      endpoint,
      {},
      function* (data: any) {
        const points = Array.isArray(data?.series) ? data.series : [];
        const cleaned = points
          .filter((p: any) => typeof p?.time === 'number' && typeof p?.value === 'number')
          .map((p: any) => ({ time: p.time, value: p.value }));
        const cp = data?.closePrice;

        yield put({
          type: NIFTY_SERIES_FETCH_SUCCESS,
          payload: {
            range,
            series: cleaned,
            closePrice: typeof cp === 'number' ? cp : cp != null ? Number(cp) : null,
          },
        });
      },
      function* (errorData: unknown) {
        yield put({ type: NIFTY_SERIES_FETCH_FAILURE, payload: { range, error: getErrorMessage(errorData) } });
      },
      true
    );
  } catch (error: unknown) {
    yield put({ type: NIFTY_SERIES_FETCH_FAILURE, payload: { range, error: getErrorMessage(error) } });
  }
}

export function* watchNiftySeriesSaga(): SagaIterator {
  yield takeLatest(fetchNiftySeries.type, fetchNiftySeriesSaga);
}

