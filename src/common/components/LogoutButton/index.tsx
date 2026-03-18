import { LogoutIcon } from '../../../assets/svg';

interface LogoutButtonProps {
  onClick: () => void;
  className?: string;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex items-center gap-2 px-4 py-2.5 
        bg-slate-100 dark:bg-slate-800
        hover:bg-rose-50 dark:hover:bg-rose-900/30
        text-slate-600 dark:text-slate-300
        hover:text-rose-600 dark:hover:text-rose-400
        border border-slate-200 dark:border-slate-700
        hover:border-rose-200 dark:hover:border-rose-800
        rounded-xl font-semibold text-sm
        transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-rose-400 focus:ring-offset-2 
        focus:ring-offset-white dark:focus:ring-offset-slate-900
        ${className}`}
      aria-label="Logout"
    >
      <LogoutIcon className="w-4 h-4 shrink-0" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};
