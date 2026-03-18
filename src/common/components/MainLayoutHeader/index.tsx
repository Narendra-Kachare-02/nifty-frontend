import { NavLink } from '../NavLink';

export interface MainNavItem {
  path: string;
  label: string;
}

interface MainLayoutHeaderProps {
  /** Branding / project name shown in header */
  title: string;
  /** Nav links – from getMainNavItems() or MAIN_NAV_ENTRIES. Rendered as NavLinks. */
  navItems?: MainNavItem[];
  /** Slot for actions (e.g. LogoutButton). Rendered after nav links. */
  actions?: React.ReactNode;
  /** Deprecated: use navItems + actions. Direct children for full control. */
  children?: React.ReactNode;
  className?: string;
}

/** Sticky header for main app layout with backdrop blur and responsive nav. */
export const MainLayoutHeader: React.FC<MainLayoutHeaderProps> = ({
  title,
  navItems,
  actions,
  children,
  className = '',
}) => {
  const hasNav = (navItems && navItems.length > 0) || actions || children;

  return (
    <header
      className={`sticky top-0 z-10 w-full bg-gray-100/95 backdrop-blur-sm border-b border-gray-200/80 shadow-sm ${className}`}
      role="banner"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 truncate tracking-tight">
            {title}
          </h1>
          {hasNav ? (
            <nav className="flex flex-wrap items-center gap-2 sm:gap-3" aria-label="Main navigation">
              {navItems?.map((item) => (
                <NavLink key={item.path} to={item.path}>
                  {item.label}
                </NavLink>
              ))}
              {actions}
              {children}
            </nav>
          ) : null}
        </div>
      </div>
    </header>
  );
};
