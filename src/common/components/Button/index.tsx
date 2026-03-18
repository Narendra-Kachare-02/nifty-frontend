interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary',
  disabled = false,
  fullWidth = true,
  className = '',
}) => {
  const baseStyles = 'px-6 py-3.5 rounded-xl font-bold transition-all duration-200 shadow-lg';
  
  const variantStyles = {
    primary: 'bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl transform hover:scale-[1.01] active:scale-100',
    secondary: 'bg-white border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100 text-gray-800 shadow-md hover:shadow-lg',
    outline: 'bg-white border-2 border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-800 shadow-md hover:shadow-lg',
  };

  const disabledStyles = 'disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none disabled:hover:shadow-lg';
  const widthStyles = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabledStyles} ${widthStyles} ${className}`}
    >
      {children}
    </button>
  );
};
