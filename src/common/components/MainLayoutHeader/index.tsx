import { NavLink } from '../NavLink';
import { ThemeToggle } from '../ThemeToggle';

export interface MainNavItem {
  path: string;
  label: string;
}

interface MainLayoutHeaderProps {
  title: string;
  navItems?: MainNavItem[];
  actions?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

export const MainLayoutHeader: React.FC<MainLayoutHeaderProps> = ({
  title,
  navItems,
  actions,
  children,
  className = '',
}) => {
  return (
    <header
      className={`sticky top-0 z-50 w-full 
        bg-white/70 dark:bg-slate-900/70 
        backdrop-blur-xl 
        border-b border-slate-200/50 dark:border-slate-700/50 
        shadow-lg shadow-slate-200/20 dark:shadow-slate-900/40 
        transition-all duration-300 ${className}`}
      role="banner"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent">
                {title}
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                Real-time Market Data
              </p>
            </div>
          </div>
          <nav className="flex items-center gap-2 sm:gap-3" aria-label="Main navigation">
            {navItems?.map((item) => (
              <NavLink key={item.path} to={item.path}>
                {item.label}
              </NavLink>
            ))}
            <ThemeToggle />
            {actions}
            {children}
          </nav>
        </div>
      </div>
    </header>
  );
};
