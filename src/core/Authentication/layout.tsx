import { RegistryRoutes } from '../../common/components';
import { AUTH_SCREEN_ENTRIES, AUTH_FALLBACK_PATH } from '.';

export const Authentication = () => {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegistryRoutes
          entries={AUTH_SCREEN_ENTRIES}
          fallbackPath={AUTH_FALLBACK_PATH}
        />
      </div>
    </div>
  );
};
