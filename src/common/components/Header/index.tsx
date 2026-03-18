interface HeaderProps {
  /** Branding / project name shown in header */
  title?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ title = 'Project Branding', children, className = '' }) => {
  return (
    <header
      className={`sticky top-0 z-10 w-full bg-white border-b border-gray-200 shadow-sm ${className}`}
      role="banner"
    >
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          {children ? <div className="flex items-center gap-2">{children}</div> : null}
        </div>
      </div>
    </header>
  );
};
