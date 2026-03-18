interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  helperText?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  label = 'Phone Number',
  placeholder = '98765 43210',
  helperText = "We'll send you a verification code",
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value.replace(/\D/g, '');
    if (inputValue.length <= 10) {
      onChange(inputValue);
    }
  };

  return (
    <div>
      <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-2">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none border-r border-gray-300 pr-3">
          <span className="text-gray-700 font-bold text-base">+91</span>
        </div>
        <input
          id="phone"
          type="tel"
          value={value}
          onChange={handleChange}
          className="w-full pl-20 pr-4 py-3.5 bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 text-base placeholder-gray-400 font-medium"
          placeholder={placeholder}
          maxLength={10}
          pattern="[0-9]{10}"
          required
        />
      </div>
      {helperText && (
        <p className="mt-2 text-xs text-gray-600 font-medium">{helperText}</p>
      )}
    </div>
  );
};
