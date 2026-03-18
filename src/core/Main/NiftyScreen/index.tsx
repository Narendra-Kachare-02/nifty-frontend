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
import { MarketStatusBadge } from '../../../common/components/MarketStatusBadge';

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

function formatTimestamp(value: any): string {
  if (!value) return '';
  if (typeof value === 'string' && !value.includes('T')) return value;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return String(value);
  }
}

function formatShortTime(value: any): string {
  if (!value) return '';
  if (typeof value === 'string' && !value.includes('T')) return value;
  try {
    const date = new Date(value);
    if (isNaN(date.getTime())) return String(value);
    return date.toLocaleString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Kolkata',
    });
  } catch {
    return String(value);
  }
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
  const previousClose = latest?.metadata?.previousClose;
  const pChange = indexRow?.pChange ?? latest?.metadata?.percChange;
  const timestamp = indexRow?.lastUpdateTime ?? latest?.metadata?.timeVal ?? latest?.captured_at;

  const rawChange = indexRow?.change ?? latest?.metadata?.change;
  const change = rawChange ?? (last && previousClose ? Number(last) - Number(previousClose) : null);
  const isUp = Number(change) > 0;
  const isDown = Number(change) < 0;

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
    if (!Number.isFinite(n) || n === 0) return 'text-slate-500 dark:text-slate-400';
    return n > 0 ? 'text-emerald-500 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400';
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
        <div className="text-[13px] font-medium tabular-nums text-slate-800 dark:text-slate-100">
          {currency ? `₹${formatNumber(value)}` : formatNumber(value)}
        </div>
        {pctText ? (
          <div className={`text-[10px] font-semibold tabular-nums ${cellPctColor(pct)}`}>{pctText}</div>
        ) : (
          <div className="h-[14px]" />
        )}
      </div>
    );
  };

  return (
    <div className="flex-1 min-h-0 overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-300">
      <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-5 p-4 sm:p-6 overflow-hidden">
        
        {/* Main Chart Card */}
        <section className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6 sm:p-8 flex flex-col min-h-0 transition-all duration-300">
          {/* Decorative gradient orbs */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-400/20 to-purple-400/20 dark:from-blue-500/10 dark:to-purple-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-tr from-emerald-400/20 to-cyan-400/20 dark:from-emerald-500/10 dark:to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:to-indigo-400/20 border border-blue-200/50 dark:border-blue-700/50">
                  <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 animate-pulse" />
                  <span className="text-xs font-bold tracking-wider text-blue-700 dark:text-blue-300">NIFTY 50</span>
                </div>
                <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">NSE</span>
              </div>
              
              <div className="mt-4 text-5xl sm:text-6xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white tabular-nums">
                ₹{formatNumber(last)}
              </div>
              
              <div className={`mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-base font-bold shadow-lg transition-all duration-300
                ${isUp 
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-emerald-500/30' 
                  : isDown 
                    ? 'bg-gradient-to-r from-rose-500 to-red-500 text-white shadow-rose-500/30' 
                    : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white shadow-slate-500/30'}`}>
                <span className="text-xl font-black">{isUp ? '↑' : isDown ? '↓' : '–'}</span>
                <span className="tabular-nums">{formatSigned(change)}</span>
                <span className="opacity-80">•</span>
                <span className="tabular-nums">{formatSigned(pChange)}%</span>
              </div>
              
              <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{formatTimestamp(timestamp)}</span>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-3">
              <MarketStatusBadge
                status={latest?.marketStatus?.marketStatus}
                message={latest?.marketStatus?.marketStatusMessage}
              />
              <div className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                {loading || optionChainLoading ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                    Syncing...
                  </span>
                ) : latest?.captured_at ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700/50">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {formatShortTime(latest.captured_at)}
                  </span>
                ) : ''}
              </div>
              {error && (
                <div className="text-[11px] font-medium text-rose-600 dark:text-rose-400 max-w-[200px] text-right">{error}</div>
              )}
            </div>
          </div>

          {/* Range Buttons */}
          <div className="relative mt-6 flex items-center justify-between gap-4">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Timeframe</span>
            <div className="flex items-center gap-1 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
              {(['1D', '1M', '3M', '6M', '1Y'] as const).map((r) => {
                const active = r === range;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRange(r)}
                    className={`relative text-xs font-semibold px-4 py-2 rounded-xl transition-all duration-200 ${
                      active
                        ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                    }`}
                  >
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Area */}
          <div className="relative mt-5 flex-1 min-h-0 rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50/50 to-white/30 dark:from-slate-800/50 dark:to-slate-900/30 border border-slate-200/50 dark:border-slate-700/30 backdrop-blur-sm p-4">
            {series.length ? (
              <NiftyPriceChart range={range} series={series} baseline={baseline ? Number(baseline) : null} />
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-slate-400 dark:text-slate-500">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-blue-500 animate-spin" />
                  </div>
                  <span className="text-sm font-medium">Loading chart...</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Right Panel */}
        <section className="relative overflow-hidden rounded-3xl border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-5 sm:p-6 flex flex-col min-h-0 transition-all duration-300">
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 dark:from-violet-500/10 dark:to-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative flex items-center justify-between gap-3 mb-4">
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
              {activeRightTab === 'optionChain' ? 'Option Chain' : 'Constituents'}
            </h2>
            {latest?.advance?.advances != null && latest?.advance?.declines != null && (
              <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <span className="text-emerald-500">↑{latest.advance.advances}</span>
                {' '}
                <span className="text-rose-500">↓{latest.advance.declines}</span>
              </div>
            )}
          </div>

          {/* Tab Buttons */}
          <div className="relative flex items-center gap-1 mb-4 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
            <button
              type="button"
              onClick={() => setActiveRightTab('optionChain')}
              className={`flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 ${
                activeRightTab === 'optionChain'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              Option Chain
            </button>
            <button
              type="button"
              onClick={() => setActiveRightTab('constituents')}
              className={`flex-1 text-xs font-semibold px-4 py-2.5 rounded-xl transition-all duration-200 ${
                activeRightTab === 'constituents'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-md'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              Constituents
            </button>
          </div>
          
          {activeRightTab === 'optionChain' && optionChainLatest?.expiryDate && (
            <div className="mb-3 flex items-center gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 font-semibold">
                Expiry: {optionChainLatest.expiryDate}
              </span>
            </div>
          )}

          {/* Data Table */}
          <div className="relative flex-1 min-h-0 overflow-auto scrollbar-thin-custom rounded-xl">
            {activeRightTab === 'optionChain' ? (
              <>
                <div className="grid grid-cols-5 gap-2 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-700 z-10">
                  <div className="text-right">CE OI</div>
                  <div className="text-right">CE LTP</div>
                  <div className="text-center">Strike</div>
                  <div className="text-right">PE LTP</div>
                  <div className="text-right">PE OI</div>
                </div>

                {ocRows.length ? (
                  ocRows.map((r, idx) => (
                    <div
                      key={String(r.strike)}
                      className={`grid grid-cols-5 gap-2 px-3 py-2.5 border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-200 ${
                        r.isAtm ? 'bg-gradient-to-r from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-blue-900/20 border-l-2 border-l-blue-500' : ''
                      }`}
                      style={{ animationDelay: `${idx * 20}ms` }}
                    >
                      <MetricCell value={r.ceOi} pct={r.ceOiPct} />
                      <MetricCell value={r.ceLtp} pct={r.ceLtpPct} currency />
                      <div className="flex flex-col text-center leading-tight">
                        <div className={`text-[13px] font-bold tabular-nums ${r.isAtm ? 'text-blue-600 dark:text-blue-400' : 'text-slate-800 dark:text-slate-100'}`}>
                          {formatNumber(r.strike)}
                        </div>
                        {r.isAtm && (
                          <div className="text-[9px] font-black text-blue-500 dark:text-blue-400 uppercase tracking-widest">ATM</div>
                        )}
                      </div>
                      <MetricCell value={r.peLtp} pct={r.peLtpPct} currency />
                      <MetricCell value={r.peOi} pct={r.peOiPct} />
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-slate-400 dark:text-slate-500">
                    <div className="w-8 h-8 rounded-full border-3 border-slate-200 dark:border-slate-700 border-t-violet-500 animate-spin mb-3" />
                    <span className="text-sm font-medium">Loading...</span>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-2 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 sticky top-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-700 z-10">
                  <div className="col-span-4">Symbol</div>
                  <div className="col-span-3 text-right">LTP</div>
                  <div className="col-span-2 text-right">Chg</div>
                  <div className="col-span-3 text-right">%Chg</div>
                </div>
                {constituents.map((row: any, idx) => {
                  const rowChange = row?.change;
                  const rowIsUp = Number(rowChange) > 0;
                  const rowIsDown = Number(rowChange) < 0;
                  return (
                    <div
                      key={row?.symbol ?? `${row?.identifier ?? ''}-${row?.priority ?? ''}`}
                      className="grid grid-cols-12 gap-2 px-3 py-2.5 text-xs border-b border-slate-50 dark:border-slate-700/30 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-all duration-200"
                      style={{ animationDelay: `${idx * 15}ms` }}
                    >
                      <div className="col-span-4 font-semibold text-slate-800 dark:text-slate-100 truncate">{row?.symbol}</div>
                      <div className="col-span-3 text-right tabular-nums font-medium text-slate-700 dark:text-slate-200">
                        ₹{formatNumber(row?.lastPrice)}
                      </div>
                      <div className={`col-span-2 text-right tabular-nums font-bold ${
                        rowIsUp ? 'text-emerald-500' : rowIsDown ? 'text-rose-500' : 'text-slate-500'
                      }`}>
                        {formatSigned(row?.change)}
                      </div>
                      <div className={`col-span-3 text-right tabular-nums font-bold ${
                        rowIsUp ? 'text-emerald-500' : rowIsDown ? 'text-rose-500' : 'text-slate-500'
                      }`}>
                        {formatSigned(row?.pChange)}%
                      </div>
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
