import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { pollNifty } from '../../../redux/reducer/nifty';
import { selectNiftyLoading } from '../../../redux/reducer/nifty/selectors';
import { NIFTY_POLL_INTERVAL_MS } from './niftyConstants';

export function usePollNifty() {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectNiftyLoading);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      // Avoid overlap: don't dispatch a new poll while one is in-flight.
      if (isLoading) return;
      dispatch(pollNifty({}));
    };

    const start = () => {
      if (timerRef.current) return;
      timerRef.current = window.setInterval(tick, NIFTY_POLL_INTERVAL_MS);
    };

    const stop = () => {
      if (!timerRef.current) return;
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') start();
      else stop();
    };

    // Start polling immediately; then keep interval.
    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dispatch, isLoading]);
}

