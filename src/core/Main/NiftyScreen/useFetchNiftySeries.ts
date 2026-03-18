import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import type { NiftyRange } from './NiftyPriceChart';
import { fetchNiftySeries } from '../../../redux/reducer/niftySeries';
import { selectNiftySeriesByRange, selectNiftySeriesError, selectNiftySeriesLoading } from '../../../redux/reducer/niftySeries/selectors';

export function useFetchNiftySeries(range: NiftyRange) {
  const dispatch = useAppDispatch();
  const cached = useAppSelector(selectNiftySeriesByRange(range));
  const loading = useAppSelector(selectNiftySeriesLoading(range));
  const error = useAppSelector(selectNiftySeriesError(range));

  useEffect(() => {
    if (cached) return;
    dispatch(fetchNiftySeries({ range }));
  }, [cached, dispatch, range]);

  return { series: cached?.series ?? [], closePrice: cached?.closePrice ?? null, loading, error };
}

