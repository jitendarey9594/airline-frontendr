import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/rootReducer';

export default function AdminRoutes() {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}
