import { useEffect } from 'react';
import { Route, Routes } from 'react-router';
import { useAppSelector } from '../redux/store';
import { isLoggedIn } from '../redux/reducer/auth/selectors';
import { Authentication } from './Authentication/layout';
import { Main } from './Main/layout';
import { NavigationRefSetter } from '../common/components';
import { useAppDispatch } from '../redux/store';
import { bootstrapNifty } from '../redux/reducer/nifty';

export const Core = () => {
  const loggedIn = useAppSelector(isLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!loggedIn) return;
    dispatch(bootstrapNifty({}));
  }, [dispatch, loggedIn]);

  return (
    <>
      <NavigationRefSetter />
      <Routes>
        <Route path="/*" element={loggedIn ? <Main /> : <Authentication />} />
      </Routes>
    </>
  );
};
