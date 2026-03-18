import { Route, Routes } from 'react-router';
import { useAppSelector } from '../redux/store';
import { isLoggedIn } from '../redux/reducer/auth/selectors';
import { Authentication } from './Authentication/layout';
import { Main } from './Main/layout';
import { NavigationRefSetter } from '../common/components';

export const Core = () => {
  const loggedIn = useAppSelector(isLoggedIn);

  return (
    <>
      <NavigationRefSetter />
      <Routes>
        <Route path="/*" element={loggedIn ? <Main /> : <Authentication />} />
      </Routes>
    </>
  );
};
