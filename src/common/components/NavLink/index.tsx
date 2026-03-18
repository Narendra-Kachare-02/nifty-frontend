import { Link, useLocation } from 'react-router';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const navLinkBase =
  'text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 border border-transparent';
const navActive = 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200 dark:shadow-blue-900/30';
const navInactive =
  'text-gray-600 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-white border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500';

/** Reusable nav link with active state styling based on current path. */
export const NavLink: React.FC<NavLinkProps> = ({ to, children, className = '' }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`${navLinkBase} ${isActive ? navActive : navInactive} ${className}`}
    >
      {children}
    </Link>
  );
};
