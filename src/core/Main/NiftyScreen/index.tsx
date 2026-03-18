import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/store';
import { pollNifty } from '../../../redux/reducer/nifty';
import { selectNiftyError, selectNiftyLatest, selectNiftyLoading } from '../../../redux/reducer/nifty/selectors';
import { usePollNifty } from './usePollNifty';
import { usePollOptionChain } from './usePollOptionChain';
import { selectOptionChainLatest, selectOptionChainLoading } from '../../../redux/reducer/optionChain/selectors';
import { pollOptionChain } from '../../../redux/reducer/optionChain';
import { NiftyPriceChart, type NiftyRange } from './NiftyPriceChart';
import { useFetchNiftySeries } from './useFetchNiftySeries';
import { NIFTY_OPTION_LOT_SIZE } from '../../../common/constants';

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

  const optionChainLatest = useAppSelector(selectOptionChainLatest);
  const optionChainLoading = useAppSelector(selectOptionChainLoading);

  const [activeRightTab, setActiveRightTab] = useState<'optionChain' | 'constituents'>('optionChain');
  const [range, setRange] = useState<NiftyRange>('1D');

  usePollNifty();
  usePollOptionChain();

  const { series, closePrice } = useFetchNiftySeries(range);

  // First load (fast render even before interval starts)
  useEffect(() => {
    dispatch(pollNifty({}));
    dispatch(pollOptionChain({}));
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

  const baseline = closePrice ?? latest?.metadata?.previousClose ?? null;

  const ocRows = useMemo(() => {
    const payload = optionChainLatest?.payload;
    const records = payload?.records;
    const data = records?.data;
    if (!Array.isArray(data)) return [];

    const underlying = Number(records?.underlyingValue);
    const strikes = data
      .map((d: any) => Number(d?.strikePrice))
      .filter((s: any) => typeof s === 'number' && !Number.isNaN(s))
      .sort((a: number, b: number) => a - b);
    if (!strikes.length) return [];

    const atmStrike = strikes.reduce((best: number, cur: number) => {
      if (!Number.isFinite(underlying)) return best;
      return Math.abs(cur - underlying) < Math.abs(best - underlying) ? cur : best;
    }, strikes[0]);

    const atmIndex = strikes.indexOf(atmStrike);
    const start = Math.max(0, atmIndex - 10);
    const end = Math.min(strikes.length, atmIndex + 11);
    const windowStrikes = new Set(strikes.slice(start, end));

    return data
      .filter((d: any) => windowStrikes.has(Number(d?.strikePrice)))
      .sort((a: any, b: any) => Number(a?.strikePrice) - Number(b?.strikePrice))
      .map((d: any) => {
        const ce = d?.CE ?? {};
        const pe = d?.PE ?? {};
        const ceOiLots = ce?.openInterest;
        const peOiLots = pe?.openInterest;
        const ceOiContracts =
          typeof ceOiLots === 'number'
            ? ceOiLots * NIFTY_OPTION_LOT_SIZE
            : ceOiLots != null && !Number.isNaN(Number(ceOiLots))
              ? Number(ceOiLots) * NIFTY_OPTION_LOT_SIZE
              : ceOiLots;
        const peOiContracts =
          typeof peOiLots === 'number'
            ? peOiLots * NIFTY_OPTION_LOT_SIZE
            : peOiLots != null && !Number.isNaN(Number(peOiLots))
              ? Number(peOiLots) * NIFTY_OPTION_LOT_SIZE
              : peOiLots;
        return {
          strike: d?.strikePrice,
          ceOi: ceOiContracts,
          ceOiPct: ce?.pchangeinOpenInterest,
          ceLtp: ce?.lastPrice,
          ceLtpPct: ce?.pchange,
          peLtp: pe?.lastPrice,
          peLtpPct: pe?.pchange,
          peOi: peOiContracts,
          peOiPct: pe?.pchangeinOpenInterest,
          isAtm: Number(d?.strikePrice) === atmStrike,
        };
      });
  }, [optionChainLatest]);

  const formatPct = (value: any): string | null => {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n)) return null;
    const sign = n > 0 ? '+' : '';
    return `${sign}${n.toFixed(2)}%`;
  };

  const cellPctColor = (value: any): string => {
    const n = typeof value === 'number' ? value : Number(value);
    if (!Number.isFinite(n) || n === 0) return 'text-gray-500';
    return n > 0 ? 'text-emerald-600' : 'text-rose-600';
  };

  const MetricCell = ({
    value,
    pct,
    align = 'right',
    currency = false,
  }: {
    value: any;
    pct: any;
    align?: 'right' | 'center';
    currency?: boolean;
  }) => {
    const pctText = formatPct(pct);
    const alignClass = align === 'center' ? 'text-center' : 'text-right';
    return (
      <div className={`flex flex-col ${alignClass} leading-tight`}>
        <div className="text-[13px] font-semibold tabular-nums text-gray-900">
          {currency ? `₹${formatNumber(value)}` : formatNumber(value)}
        </div>
        {pctText ? <div className={`text-[11px] font-semibold tabular-nums ${cellPctColor(pct)}`}>{pctText}</div> : <div className="h-[14px]" />}
      </div>
    );
  };

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
                {loading || optionChainLoading ? 'Updating…' : latest?.captured_at ? `Captured: ${latest.captured_at}` : ''}
              </div>
              {error ? <div className="mt-2 text-[11px] text-rose-600 max-w-[240px]">{error}</div> : null}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-3">
            <div className="text-xs font-semibold text-gray-600">Range</div>
            <div className="flex items-center gap-2">
              {(['1D', '1M', '3M', '6M', '1Y'] as const).map((r) => {
                const active = r === range;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                      active
                        ? 'bg-gray-900 text-white border-gray-900'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-4 flex-1 min-h-0 rounded-xl border border-gray-100 bg-gradient-to-b from-gray-50 to-white p-3">
            {series.length ? (
              <NiftyPriceChart range={range} series={series} baseline={baseline ? Number(baseline) : null} />
            ) : (
              <div className="h-full flex items-center justify-center text-sm text-gray-400">Loading chart…</div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 flex flex-col min-h-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-bold text-gray-800">
              {activeRightTab === 'optionChain' ? 'Option Chain' : 'Constituents'}
            </h2>
            <div className="text-[11px] text-gray-500">
              {latest?.advance ? `Adv ${latest.advance.advances} / Dec ${latest.advance.declines}` : ''}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveRightTab('optionChain')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                activeRightTab === 'optionChain'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Option Chain
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('constituents')}
              className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors ${
                activeRightTab === 'constituents'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
              }`}
            >
              Constituents
            </button>
            <div className="ml-auto text-[11px] text-gray-500">
              {activeRightTab === 'optionChain'
                ? optionChainLatest?.expiryDate
                  ? `Expiry: ${optionChainLatest.expiryDate}`
                  : ''
                : ''}
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto scrollbar-thin-custom">
            {activeRightTab === 'optionChain' ? (
              <>
                <div className="grid grid-cols-5 gap-2 px-2 py-2 text-[11px] font-semibold text-gray-500 sticky top-0 bg-white border-b border-gray-100">
                  <div className="text-right">CE OI</div>
                  <div className="text-right">CE LTP</div>
                  <div className="text-center">Strike</div>
                  <div className="text-right">PE LTP</div>
                  <div className="text-right">PE OI</div>
                </div>

                {ocRows.length ? (
                  ocRows.map((r) => (
                    <div
                      key={String(r.strike)}
                      className={`grid grid-cols-5 gap-2 px-2 py-2 border-b border-gray-50 hover:bg-gray-50/70 transition-colors ${
                        r.isAtm ? 'bg-blue-50/70' : ''
                      }`}
                    >
                      <MetricCell value={r.ceOi} pct={r.ceOiPct} />
                      <MetricCell value={r.ceLtp} pct={r.ceLtpPct} currency />
                      <div className="flex flex-col text-center leading-tight">
                        <div className="text-[13px] font-extrabold tabular-nums text-gray-900">{formatNumber(r.strike)}</div>
                        <div className={`text-[11px] font-semibold ${r.isAtm ? 'text-blue-700' : 'text-gray-400'}`}>{r.isAtm ? 'ATM' : ''}</div>
                      </div>
                      <MetricCell value={r.peLtp} pct={r.peLtpPct} currency />
                      <MetricCell value={r.peOi} pct={r.peOiPct} />
                    </div>
                  ))
                ) : (
                  <div className="px-2 py-6 text-sm text-gray-400 text-center">Loading option chain…</div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-2 px-2 py-2 text-[11px] font-semibold text-gray-500 sticky top-0 bg-white border-b border-gray-100">
                  <div className="col-span-4">Symbol</div>
                  <div className="col-span-3 text-right">LTP</div>
                  <div className="col-span-2 text-right">Chg</div>
                  <div className="col-span-3 text-right">%Chg</div>
                </div>
                {constituents.map((row: any) => {
                  const rowChange = row?.change;
                  const rowIsUp = Number(rowChange) > 0;
                  const rowColor =
                    rowIsUp ? 'text-emerald-600' : Number(rowChange) < 0 ? 'text-rose-600' : 'text-gray-600';
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
              </>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

