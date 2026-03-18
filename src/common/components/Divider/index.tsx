interface DividerProps {
  text?: string;
}

export const Divider: React.FC<DividerProps> = ({ text = 'OR' }) => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center text-xs">
        <span className="px-3 bg-gray-50 text-gray-500 font-semibold">{text}</span>
      </div>
    </div>
  );
};
