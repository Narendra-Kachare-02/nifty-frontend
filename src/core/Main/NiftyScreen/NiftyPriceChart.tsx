import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  AreaSeries,
  LineSeries,
  LineStyle,
  type LineData,
  CrosshairMode,
  type TickMarkFormatter,
} from 'lightweight-charts';
import { useTheme } from '../../../common/context/ThemeContext';

export type NiftyRange = '1D' | '1M' | '3M' | '6M' | '1Y';

interface NiftyPriceChartProps {
  range: NiftyRange;
  series: Array<{ time: number; value: number }>;
  baseline?: number | null;
}

interface TooltipData {
  time: string;
  value: number;
  change: number;
  changePercent: number;
}

function toLineData(series: Array<{ time: number; value: number }>): LineData[] {
  const sorted = [...series].sort((a, b) => a.time - b.time);
  const deduped: Array<{ time: number; value: number }> = [];
  for (const p of sorted) {
    const last = deduped[deduped.length - 1];
    if (last && last.time === p.time) {
      last.value = p.value;
    } else {
      deduped.push({ time: p.time, value: p.value });
    }
  }
  return deduped.map((p) => ({ time: p.time as any, value: p.value }));
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
}

function getTickMarkFormatter(range: NiftyRange): TickMarkFormatter {
  return (time) => {
    const timestamp = typeof time === 'number' ? time : typeof time === 'string' ? parseInt(time) : 0;
    const date = new Date(timestamp * 1000);
    
    if (range === '1D') {
      return date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } else if (range === '1M') {
      return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
      });
    } else {
      return date.toLocaleDateString('en-IN', {
        month: 'short',
        year: '2-digit',
      });
    }
  };
}

export const NiftyPriceChart: React.FC<NiftyPriceChartProps> = ({ range, series, baseline }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const areaRef = useRef<ISeriesApi<'Area'> | null>(null);
  const baselineRef = useRef<ISeriesApi<'Line'> | null>(null);
  const { isDark } = useTheme();

  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  const latest = series.length ? series[series.length - 1] : null;
  const first = series.length ? series[0] : null;

  const directionUp = useMemo(() => {
    if (!latest) return true;
    if (baseline == null) return true;
    return latest.value >= baseline;
  }, [baseline, latest]);

  const colors = useMemo(() => {
    const upColor = isDark ? 'rgb(52, 211, 153)' : 'rgb(16, 185, 129)';
    const downColor = isDark ? 'rgb(251, 113, 133)' : 'rgb(244, 63, 94)';
    const lineColor = directionUp ? upColor : downColor;
    
    const upGradientTop = isDark ? 'rgba(52, 211, 153, 0.4)' : 'rgba(16, 185, 129, 0.3)';
    const upGradientBottom = isDark ? 'rgba(52, 211, 153, 0.02)' : 'rgba(16, 185, 129, 0.02)';
    const downGradientTop = isDark ? 'rgba(251, 113, 133, 0.4)' : 'rgba(244, 63, 94, 0.3)';
    const downGradientBottom = isDark ? 'rgba(251, 113, 133, 0.02)' : 'rgba(244, 63, 94, 0.02)';

    return {
      line: lineColor,
      areaTop: directionUp ? upGradientTop : downGradientTop,
      areaBottom: directionUp ? upGradientBottom : downGradientBottom,
      text: isDark ? 'rgb(148, 163, 184)' : 'rgb(75, 85, 99)',
      border: isDark ? 'rgb(51, 65, 85)' : 'rgb(229, 231, 235)',
      grid: isDark ? 'rgb(30, 41, 59)' : 'rgb(243, 244, 246)',
      crosshair: isDark ? 'rgb(100, 116, 139)' : 'rgb(209, 213, 219)',
      baseline: isDark ? 'rgb(100, 116, 139)' : 'rgb(156, 163, 175)',
    };
  }, [isDark, directionUp]);

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: 'transparent' },
        textColor: colors.text,
        attributionLogo: false,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      },
      rightPriceScale: {
        borderColor: colors.border,
        scaleMargins: { top: 0.1, bottom: 0.15 },
        borderVisible: true,
      },
      timeScale: {
        borderColor: colors.border,
        timeVisible: true,
        secondsVisible: false,
        borderVisible: true,
        fixLeftEdge: true,
        fixRightEdge: true,
        tickMarkFormatter: getTickMarkFormatter(range),
        ticksVisible: true,
      },
      grid: {
        vertLines: { color: colors.grid, visible: true },
        horzLines: { color: colors.grid, visible: true },
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: { 
          color: colors.crosshair, 
          style: LineStyle.Dashed,
          labelBackgroundColor: isDark ? '#1e293b' : '#374151',
          width: 1,
        },
        horzLine: { 
          color: colors.crosshair, 
          style: LineStyle.Dashed,
          labelBackgroundColor: isDark ? '#1e293b' : '#374151',
          width: 1,
        },
      },
      handleScroll: { vertTouchDrag: false },
      localization: {
        priceFormatter: (price: number) => '₹' + price.toLocaleString('en-IN', { maximumFractionDigits: 2 }),
      },
    });

    const areaSeries = chart.addSeries(AreaSeries, {
      lineColor: colors.line,
      lineWidth: 2,
      topColor: colors.areaTop,
      bottomColor: colors.areaBottom,
      priceLineVisible: true,
      lastValueVisible: true,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 6,
      crosshairMarkerBorderColor: colors.line,
      crosshairMarkerBackgroundColor: isDark ? '#1e293b' : '#ffffff',
      crosshairMarkerBorderWidth: 2,
    });

    const baselineSeries = chart.addSeries(LineSeries, {
      color: colors.baseline,
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
    });

    chart.subscribeCrosshairMove((param) => {
      if (!param.time || !param.point || param.point.x < 0 || param.point.y < 0) {
        setTooltip(null);
        return;
      }

      const data = param.seriesData.get(areaSeries);
      if (data && 'value' in data && typeof data.value === 'number') {
        const baseValue = baseline ?? first?.value ?? data.value;
        const change = data.value - baseValue;
        const changePercent = baseValue !== 0 ? (change / baseValue) * 100 : 0;

        setTooltip({
          time: formatTime(param.time as number),
          value: data.value,
          change,
          changePercent,
        });
        setTooltipPosition({ x: param.point.x, y: param.point.y });
      }
    });

    chartRef.current = chart;
    areaRef.current = areaSeries;
    baselineRef.current = baselineSeries;

    // Set data immediately after chart creation
    if (series.length) {
      areaSeries.setData(toLineData(series));
      chart.timeScale().fitContent();

      if (baseline != null) {
        const firstTime = series[0].time;
        const lastTime = series[series.length - 1].time;
        baselineSeries.setData(
          toLineData([
            { time: firstTime, value: baseline },
            { time: lastTime, value: baseline },
          ])
        );
      }
    }

    return () => {
      chart.remove();
      chartRef.current = null;
      areaRef.current = null;
      baselineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDark, range]);

  useEffect(() => {
    if (!areaRef.current || !chartRef.current) return;

    areaRef.current.applyOptions({
      lineColor: colors.line,
      topColor: colors.areaTop,
      bottomColor: colors.areaBottom,
      crosshairMarkerBorderColor: colors.line,
      crosshairMarkerBackgroundColor: isDark ? '#1e293b' : '#ffffff',
    });

    chartRef.current.applyOptions({
      layout: { textColor: colors.text },
      rightPriceScale: { borderColor: colors.border },
      timeScale: { borderColor: colors.border },
      grid: {
        vertLines: { color: colors.grid },
        horzLines: { color: colors.grid },
      },
      crosshair: {
        vertLine: { 
          color: colors.crosshair,
          labelBackgroundColor: isDark ? '#1e293b' : '#374151',
        },
        horzLine: { 
          color: colors.crosshair,
          labelBackgroundColor: isDark ? '#1e293b' : '#374151',
        },
      },
    });

    if (baselineRef.current) {
      baselineRef.current.applyOptions({ color: colors.baseline });
    }
  }, [colors, isDark]);

  useEffect(() => {
    if (!areaRef.current || !chartRef.current) return;

    areaRef.current.setData(toLineData(series));
    chartRef.current.timeScale().fitContent();

    if (baselineRef.current && baseline != null && series.length) {
      const firstTime = series[0].time;
      const lastTime = series[series.length - 1].time;
      baselineRef.current.setData(
        toLineData([
          { time: firstTime, value: baseline },
          { time: lastTime, value: baseline },
        ])
      );
    } else if (baselineRef.current) {
      baselineRef.current.setData([]);
    }
  }, [baseline, series]);

  const tooltipChangeColor = tooltip && tooltip.change >= 0 
    ? 'text-emerald-600 dark:text-emerald-400' 
    : 'text-rose-600 dark:text-rose-400';

  return (
    <div className="relative w-full h-[300px] sm:h-[360px]">
      <div ref={containerRef} className="w-full h-full" />
      
      {tooltip && (
        <div
          className={`absolute z-20 pointer-events-none transition-all duration-150
            bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm
            border border-slate-200 dark:border-slate-600
            rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50
            px-4 py-3`}
          style={{
            left: Math.min(tooltipPosition.x + 16, (containerRef.current?.clientWidth ?? 300) - 160),
            top: Math.max(tooltipPosition.y - 70, 10),
          }}
        >
          <div className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
            {tooltip.time}
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            ₹{tooltip.value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
          </div>
          <div className={`text-sm font-semibold tabular-nums mt-0.5 ${tooltipChangeColor}`}>
            {tooltip.change >= 0 ? '↑' : '↓'} {Math.abs(tooltip.change).toFixed(2)} ({tooltip.changePercent >= 0 ? '+' : ''}{tooltip.changePercent.toFixed(2)}%)
          </div>
        </div>
      )}
    </div>
  );
};

