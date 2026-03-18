export const Loading = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900 transition-colors duration-200">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-slate-400">Loading application...</p>
      </div>
    </div>
);
