import { Link } from 'react-router';
import { ROUTES } from '../../../common/routes';
import { DocumentIcon, HomeIcon } from '../../../assets/svg';

/** Screen shown when no project is selected or dashboard is disabled. */
export const NoProjectScreen: React.FC = () => {
  return (
    <div className="flex flex-1 overflow-hidden bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100/90">
      <div className="flex-1 flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gray-100 border-2 border-gray-200/80 shadow-inner mb-6">
            <DocumentIcon className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight mb-2">No project selected</h2>
          <p className="text-gray-500 text-sm sm:text-base mb-8 max-w-sm mx-auto">
            Select or start a project from Home to view your dashboard, documents, and workflow.
          </p>
          <Link
            to={ROUTES.HOME}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            <HomeIcon className="w-5 h-5" />
            Go to Home
          </Link>
        </div>
      </div>
    </div>
  );
};
