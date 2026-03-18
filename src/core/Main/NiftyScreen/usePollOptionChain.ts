import { useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { pollOptionChain } from '../../../redux/reducer/optionChain';
import { selectOptionChainLoading } from '../../../redux/reducer/optionChain/selectors';
import { NIFTY_POLL_INTERVAL_MS } from './niftyConstants';

export function usePollOptionChain(expiryDate?: string | null) {
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectOptionChainLoading);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const tick = () => {
      if (isLoading) return;
      dispatch(pollOptionChain({ expiryDate: expiryDate ?? null }));
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

    start();
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      stop();
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [dispatch, expiryDate, isLoading]);
}

