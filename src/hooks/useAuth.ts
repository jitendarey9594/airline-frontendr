import { useSelector } from 'react-redux';
import type  { RootState } from '../redux/rootReducer';

export const useAuth = () => {
  const { isAuthenticated, admin } = useSelector((state: RootState) => state.auth);
  return { isAuthenticated, admin };
};
