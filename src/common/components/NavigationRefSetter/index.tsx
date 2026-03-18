import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { setNavigate } from '../../utils/navigationRef';

/** Sets global navigation ref so sagas can navigate. Must render inside Router. */
export const NavigationRefSetter = () => {
  const navigate = useNavigate();
  useEffect(() => {
    setNavigate(navigate);
    return () => setNavigate(null);
  }, [navigate]);
  return null;
};
