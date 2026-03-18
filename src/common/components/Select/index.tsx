import { useId } from 'react';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string = string> {
  label?: string;
  value: string;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  className?: string;
  'aria-label'?: string;
}

export function Select<T extends string = string>({
  label,
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  id,
  className = '',
  'aria-label': ariaLabel,
}: SelectProps<T>) {
  const reactId = useId();
  const safeLabel = (label ?? '').trim().replace(/\s/g, '-');
  const inputId = id ?? (safeLabel ? `select-${safeLabel}` : `select-${reactId}`);

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-semibold text-gray-700"
        >
          {label}
        </label>
      ) : null}
      <select
        id={inputId}
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        disabled={disabled}
        aria-label={ariaLabel ?? label ?? placeholder}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
