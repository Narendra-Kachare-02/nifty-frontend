interface AuthContainerProps {
  children: React.ReactNode;
}

export const AuthContainer: React.FC<AuthContainerProps> = ({ children }) => {
  return (
    <div className="w-full bg-white shadow-2xl rounded-3xl overflow-hidden border border-blue-100">
      {children}
    </div>
  );
};
