interface InfoBoxProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: 'info' | 'warning' | 'success';
}

export const InfoBox: React.FC<InfoBoxProps> = ({
  children,
  icon,
  variant = 'info',
}) => {
  const variantStyles = {
    info: 'bg-blue-50 border-blue-200 text-blue-900',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-900',
    success: 'bg-green-50 border-green-200 text-green-900',
  };

  const defaultIcon = (
    <svg className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
  );

  return (
    <div className={`flex items-start gap-2 p-3 border rounded-xl ${variantStyles[variant]}`}>
      {icon || defaultIcon}
      <p className="text-xs font-medium leading-relaxed">{children}</p>
    </div>
  );
};
