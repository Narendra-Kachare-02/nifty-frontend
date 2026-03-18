import { useEffect, useRef, useState } from 'react';
import { endpoints } from '../../../api/endpoints';
import { AXIOS_AUTH_KIT } from '../../../api/axios';
import type { NiftyRange } from './NiftyPriceChart';

export function useFetchNiftySeries(range: NiftyRange) {
  const [series, setSeries] = useState<Array<{ time: number; value: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inflightRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const fetchSeries = async () => {
      if (inflightRef.current) return;
      inflightRef.current = true;
      setLoading(true);
      setError(null);
      try {
        const url = `${endpoints.NIFTY_SERIES}?range=${encodeURIComponent(range)}`;
        const res: any = await AXIOS_AUTH_KIT('GET', url);
        const data = res?.data ?? res;
        const points = Array.isArray(data?.series) ? data.series : [];
        const cleaned = points
          .filter((p: any) => typeof p?.time === 'number' && typeof p?.value === 'number')
          .map((p: any) => ({ time: p.time, value: p.value }));
        if (isMounted) setSeries(cleaned);
      } catch (e: any) {
        if (isMounted) setError(e?.message ?? 'Failed to load series');
      } finally {
        inflightRef.current = false;
        if (isMounted) setLoading(false);
      }
    };

    fetchSeries();

    return () => {
      isMounted = false;
    };
  }, [range]);

  return { series, loading, error };
}

