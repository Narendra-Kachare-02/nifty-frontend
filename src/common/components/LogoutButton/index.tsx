import { LogoutIcon } from '../../../assets/svg';

interface LogoutButtonProps {
  onClick: () => void;
  className?: string;
}

const baseStyles =
  'flex items-center gap-2 px-4 py-2.5 bg-red-500/90 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-gray-100 text-sm';

/** Reusable logout button with icon. */
export const LogoutButton: React.FC<LogoutButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`${baseStyles} ${className}`}
      aria-label="Logout"
    >
      <LogoutIcon className="w-5 h-5 shrink-0" />
      <span className="hidden sm:inline">Logout</span>
    </button>
  );
};
