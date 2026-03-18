interface MarketStatusBadgeProps {
  status?: string;
  message?: string;
  className?: string;
}

function isMarketHours(): boolean {
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000;
  const istTime = new Date(now.getTime() + istOffset + now.getTimezoneOffset() * 60 * 1000);
  
  const day = istTime.getUTCDay();
  if (day === 0 || day === 6) return false;
  
  const hours = istTime.getUTCHours();
  const minutes = istTime.getUTCMinutes();
  const timeInMinutes = hours * 60 + minutes;
  
  const marketOpen = 9 * 60 + 15;
  const marketClose = 15 * 60 + 30;
  
  return timeInMinutes >= marketOpen && timeInMinutes <= marketClose;
}

export const MarketStatusBadge: React.FC<MarketStatusBadgeProps> = ({
  status,
  message,
  className = '',
}) => {
  const normalizedStatus = (status ?? message ?? '').toLowerCase();
  
  const isOpen = normalizedStatus.includes('open') || 
                 normalizedStatus.includes('live') || 
                 normalizedStatus.includes('trading') ||
                 normalizedStatus.includes('normal');
  
  const isClosed = normalizedStatus.includes('close') || 
                   normalizedStatus.includes('closed');
  
  const isPreOpen = normalizedStatus.includes('pre-open') || 
                    normalizedStatus.includes('preopen');

  const shouldShowLive = isOpen || (!isClosed && !isPreOpen && isMarketHours());

  if (shouldShowLive) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl 
          bg-gradient-to-r from-emerald-500 to-green-500
          shadow-lg shadow-emerald-500/30
          animate-pulse-live ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span className="text-xs font-black text-white uppercase tracking-widest">
          Live
        </span>
      </div>
    );
  }

  if (isPreOpen) {
    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl 
          bg-gradient-to-r from-amber-500 to-orange-500
          shadow-lg shadow-amber-500/30 ${className}`}
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-dot-pulse absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span className="text-xs font-black text-white uppercase tracking-widest">
          Pre-Open
        </span>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl 
        bg-gradient-to-r from-slate-400 to-slate-500 dark:from-slate-600 dark:to-slate-700
        shadow-lg shadow-slate-400/20 dark:shadow-slate-900/30 ${className}`}
    >
      <span className="inline-flex rounded-full h-2 w-2 bg-white/80" />
      <span className="text-xs font-black text-white uppercase tracking-widest">
        Closed
      </span>
    </div>
  );
};
