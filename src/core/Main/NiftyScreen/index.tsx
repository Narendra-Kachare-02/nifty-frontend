import { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { pollNifty } from '../../../redux/reducer/nifty';
import { selectNiftyError, selectNiftyLatest, selectNiftyLoading } from '../../../redux/reducer/nifty/selectors';
import { usePollNifty } from './usePollNifty';

function formatNumber(value: any): string {
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return String(value ?? '');
  return n.toLocaleString('en-IN', { maximumFractionDigits: 2 });
}

function formatSigned(value: any): string {
  const n = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(n)) return String(value ?? '');
  const sign = n > 0 ? '+' : '';
  return `${sign}${formatNumber(n)}`;
}

export const NiftyScreen = () => {
  const dispatch = useAppDispatch();
  const latest = useAppSelector(selectNiftyLatest);
  const loading = useAppSelector(selectNiftyLoading);
  const error = useAppSelector(selectNiftyError);

  usePollNifty();

  // First load (fast render even before interval starts)
  useEffect(() => {
    dispatch(pollNifty({}));
  }, [dispatch]);

  const indexRow = latest?.data?.find((r: any) => r?.symbol === 'NIFTY 50') ?? latest?.data?.[0];
  const constituents = useMemo(() => {
    const all = latest?.data ?? [];
    return all.filter((r: any) => r?.symbol && r?.symbol !== 'NIFTY 50' && r?.symbol !== latest?.metadata?.indexName);
  }, [latest]);

  const last = indexRow?.lastPrice ?? latest?.metadata?.last;
  const change = indexRow?.change ?? latest?.metadata?.change;
  const pChange = indexRow?.pChange ?? latest?.metadata?.percChange;
  const timestamp = indexRow?.lastUpdateTime ?? latest?.marketStatus?.tradeDate ?? latest?.captured_at;

  const isUp = Number(change) > 0;
  const changeColor = isUp ? 'text-emerald-600' : Number(change) < 0 ? 'text-rose-600' : 'text-gray-600';

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-gray-50">
      <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 sm:p-6 overflow-hidden">
        <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 flex flex-col min-h-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-xs font-semibold tracking-wide text-gray-500">NIFTY 50</div>
              <div className="mt-2 text-4xl sm:text-5xl font-extrabold text-gray-900 tabular-nums">
                {formatNumber(last)}
              </div>
              <div className={`mt-2 text-sm sm:text-base font-semibold ${changeColor}`}>
                {formatSigned(change)} ({formatSigned(pChange)}%)
              </div>
              <div className="mt-3 text-xs text-gray-500">
                <span className="font-medium text-gray-600">As of:</span> {String(timestamp ?? '')}
              </div>
            </div>
            <div className="text-right">
              <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border border-gray-200 bg-gray-50 text-gray-700">
                {latest?.marketStatus?.marketStatusMessage ?? latest?.marketStatus?.marketStatus ?? '—'}
              </div>
              <div className="mt-2 text-[11px] text-gray-500">
                {loading ? 'Updating…' : latest?.captured_at ? `Captured: ${latest.captured_at}` : ''}
              </div>
              {error ? <div className="mt-2 text-[11px] text-rose-600 max-w-[240px]">{error}</div> : null}
            </div>
          </div>

          <div className="mt-6 flex-1 min-h-0 rounded-xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white flex items-center justify-center text-sm text-gray-400">
            {indexRow?.chartTodayPath ? (
              <img
                src={indexRow.chartTodayPath}
                alt="Nifty chart"
                className="max-h-[260px] w-full object-contain px-3"
                loading="lazy"
              />
            ) : (
              <span>Chart will appear during market hours</span>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-bold text-gray-800">Constituents</h2>
            <div className="text-[11px] text-gray-500">
              {latest?.advance ? `Adv ${latest.advance.advances} / Dec ${latest.advance.declines}` : ''}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto scrollbar-thin-custom">
            <div className="grid grid-cols-12 gap-2 px-2 py-2 text-[11px] font-semibold text-gray-500 sticky top-0 bg-white border-b border-gray-100">
              <div className="col-span-4">Symbol</div>
              <div className="col-span-3 text-right">LTP</div>
              <div className="col-span-2 text-right">Chg</div>
              <div className="col-span-3 text-right">%Chg</div>
            </div>
            {constituents.map((row: any) => {
              const rowChange = row?.change;
              const rowIsUp = Number(rowChange) > 0;
              const rowColor = rowIsUp ? 'text-emerald-600' : Number(rowChange) < 0 ? 'text-rose-600' : 'text-gray-600';
              return (
                <div
                  key={row?.symbol ?? `${row?.identifier ?? ''}-${row?.priority ?? ''}`}
                  className="grid grid-cols-12 gap-2 px-2 py-2 text-xs border-b border-gray-50 hover:bg-gray-50/70 transition-colors"
                >
                  <div className="col-span-4 font-semibold text-gray-900 truncate">{row?.symbol}</div>
                  <div className="col-span-3 text-right tabular-nums text-gray-800">{formatNumber(row?.lastPrice)}</div>
                  <div className={`col-span-2 text-right tabular-nums font-semibold ${rowColor}`}>{formatSigned(row?.change)}</div>
                  <div className={`col-span-3 text-right tabular-nums font-semibold ${rowColor}`}>{formatSigned(row?.pChange)}%</div>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

