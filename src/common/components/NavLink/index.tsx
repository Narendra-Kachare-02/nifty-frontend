import { Link, useLocation } from 'react-router';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
}

const navLinkBase =
  'text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 border border-transparent';
const navActive = 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200';
const navInactive =
  'text-gray-600 hover:bg-gray-100 hover:text-gray-900 border-gray-200 hover:border-gray-300';

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
