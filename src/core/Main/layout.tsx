import { useAppDispatch } from '../../redux/store';
import { AUTH_RESET_STATE } from '../../redux/reducer/auth/types';
import { MainLayoutHeader } from '../../common/components/MainLayoutHeader';
import { LogoutButton } from '../../common/components/LogoutButton';
import { RegistryRoutes } from '../../common/components/RegistryRoutes';
import { DashboardErrorBoundary } from './DashboardErrorBoundary';
import { MAIN_SCREEN_ENTRIES, MAIN_FALLBACK_PATH } from '.';
import { getMainNavItems } from '../../common/utils/getMainNavItems';


const BRAND_NAME = 'Nifty Dashboard';

export const Main = () => {
  const dispatch = useAppDispatch();

  const handleLogout = () => {
    dispatch({ type: AUTH_RESET_STATE });
    localStorage.clear();
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-all duration-300">
      <MainLayoutHeader
        title={BRAND_NAME}
        navItems={getMainNavItems()}
        actions={<LogoutButton onClick={handleLogout} className="ml-auto sm:ml-0" />}
      />

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <RegistryRoutes
          entries={MAIN_SCREEN_ENTRIES}
          fallbackPath={MAIN_FALLBACK_PATH}
          ErrorBoundary={DashboardErrorBoundary}
        />
      </div>
    </div>
  );
};
