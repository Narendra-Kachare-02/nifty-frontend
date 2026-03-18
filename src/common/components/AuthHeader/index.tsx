interface AuthHeaderProps {
  title: string;
  subtitle: string;
  icon?: React.ReactNode;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, icon }) => {
  return (
    <div className="bg-linear-to-br from-blue-700 via-blue-800 to-blue-900 px-8 py-10 text-center relative">
      <div className="w-16 h-16 bg-white rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
        {icon || (
          <svg className="w-8 h-8 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        )}
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-blue-100 text-sm">{subtitle}</p>
    </div>
  );
};
