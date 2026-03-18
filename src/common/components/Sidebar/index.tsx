interface SidebarProps {
  children: React.ReactNode;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ children, className = '' }) => {
  return (
    <aside
      className={`bg-white border-r border-gray-200/80 shadow-sm h-full ${className}`}
      role="complementary"
      aria-label="Sidebar"
    >
      {children}
    </aside>
  );
};
