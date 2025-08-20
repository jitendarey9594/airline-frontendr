import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

export default function StaffRoutes() {
  const { isAuthenticated, admin } = useSelector((state: RootState) => state.auth);
  const isStaff = isAuthenticated && admin?.role === 'staff';
  return isStaff ? <Outlet /> : <Navigate to="/login" />;
}

