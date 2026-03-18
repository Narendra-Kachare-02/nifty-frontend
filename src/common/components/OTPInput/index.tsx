import { useRef, type KeyboardEvent } from 'react';

interface OTPInputProps {
  length?: number;
  value: string[];
  onChange: (value: string[]) => void;
  label?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  label = 'Verification Code',
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    if (inputValue && !/^\d$/.test(inputValue)) return;

    const newOtp = [...value];
    newOtp[index] = inputValue;
    onChange(newOtp);

    // Auto-focus next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, length);
    if (/^\d+$/.test(pastedData)) {
      const newOtp = pastedData.split('');
      onChange([...newOtp, ...Array(length - newOtp.length).fill('')]);
      inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold text-gray-800 mb-4 text-center">
        {label}
      </label>
      <div className="flex gap-2 sm:gap-3 justify-center">
        {value.map((digit, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className="w-12 h-14 sm:w-14 sm:h-14 text-center text-2xl font-bold bg-white border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-200 focus:border-blue-500 outline-none transition-all duration-200 text-gray-900 shadow-sm"
            required
          />
        ))}
      </div>
    </div>
  );
};
