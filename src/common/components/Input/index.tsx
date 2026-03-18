import { useId } from 'react';

interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'number';
  disabled?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

function createStableId(prefix: string, seed?: string) {
  const safeSeed = (seed ?? '').trim().replace(/\s/g, '-');
  if (safeSeed) return `${prefix}-${safeSeed}`;
  return undefined;
}

export const Input: React.FC<InputProps> = ({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  id,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const reactId = useId();
  const inputId = id ?? createStableId('input', label) ?? `input-${reactId}`;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label htmlFor={inputId} className="text-sm font-semibold text-gray-700">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-label={ariaLabel ?? label ?? placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
      />
    </div>
  );
};
