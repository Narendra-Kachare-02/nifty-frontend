import { useEffect, useMemo, useRef } from 'react';
import {
  createChart,
  type IChartApi,
  type ISeriesApi,
  LineSeries,
  LineStyle,
  type LineData,
} from 'lightweight-charts';

export type NiftyRange = '15M' | '30M' | '1H' | '1D';

interface NiftyPriceChartProps {
  range: NiftyRange;
  series: Array<{ time: number; value: number }>;
  baseline?: number | null;
}

function toLineData(series: Array<{ time: number; value: number }>): LineData[] {
  return series.map((p) => ({ time: p.time as any, value: p.value }));
}

export const NiftyPriceChart: React.FC<NiftyPriceChartProps> = ({ series, baseline }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const lineRef = useRef<ISeriesApi<'Line'> | null>(null);
  const baselineRef = useRef<ISeriesApi<'Line'> | null>(null);

  const latest = series.length ? series[series.length - 1] : null;
  const directionUp = useMemo(() => {
    if (!latest) return true;
    if (baseline == null) return true;
    return latest.value >= baseline;
  }, [baseline, latest]);

  const lineColor = directionUp ? 'rgb(16 185 129)' : 'rgb(244 63 94)'; // emerald / rose

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      autoSize: true,
      layout: {
        background: { color: 'transparent' },
        textColor: 'rgb(75 85 99)',
      },
      rightPriceScale: {
        borderColor: 'rgb(229 231 235)',
      },
      timeScale: {
        borderColor: 'rgb(229 231 235)',
        timeVisible: true,
        secondsVisible: false,
      },
      grid: {
        vertLines: { color: 'rgb(243 244 246)' },
        horzLines: { color: 'rgb(243 244 246)' },
      },
      crosshair: {
        vertLine: { color: 'rgb(209 213 219)', style: LineStyle.Dotted },
        horzLine: { color: 'rgb(209 213 219)', style: LineStyle.Dotted },
      },
    });

    const line = chart.addSeries(LineSeries, {
      color: lineColor,
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    });

    const baselineSeries = chart.addSeries(LineSeries, {
      color: 'rgb(156 163 175)',
      lineWidth: 1,
      lineStyle: LineStyle.Dashed,
      priceLineVisible: false,
      lastValueVisible: false,
    });

    chartRef.current = chart;
    lineRef.current = line;
    baselineRef.current = baselineSeries;

    return () => {
      chart.remove();
      chartRef.current = null;
      lineRef.current = null;
      baselineRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!lineRef.current) return;
    lineRef.current.applyOptions({ color: lineColor });
  }, [lineColor]);

  useEffect(() => {
    if (!lineRef.current || !chartRef.current) return;

    lineRef.current.setData(toLineData(series));
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

    // lightweight-charts v5 no longer exposes setMarkers on series types by default.
    // The price line + lastValue label already highlights latest value.
  }, [baseline, latest, lineColor, series]);

  return <div ref={containerRef} className="w-full h-[280px] sm:h-[320px]" />;
};

