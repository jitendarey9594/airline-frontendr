import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from '../features/auth/LoginForm';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import FlightList from '../features/flights/FlightList';
import PassengerList from '../features/passengers/PassengerList';
import AdminRoutes from './AdminRoutes';
import AddFlightForm from '../features/flights/AddFlightForm';
import EditFlightForm from '../features/flights/EditFlightForm';
import AddPassengerForm from '../features/passengers/AddPassengerForm';
import EditPassengerForm from '../features/passengers/EditPassengerForm';
import ServiceManager from '../features/services/ServiceManager';
import StaffRoutes from './StaffRoutes';
import StaffDashboard from '../features/staff/StaffDashboard';
import CheckInPage from '../features/staff/CheckInPage';
import InFlightPage from '../features/staff/InFlightPage';

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />

        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/flights" element={<FlightList />} />
          <Route path="/admin/passengers" element={<PassengerList />} />
          <Route path="/admin/services" element={<ServiceManager />} />
          <Route path="/admin/flights/new" element={<AddFlightForm />} />
          <Route path="/admin/flights/edit/:id" element={<EditFlightForm />} />
          <Route path="/admin/passengers/new" element={<AddPassengerForm />} />
          <Route path="/admin/passengers/edit/:id" element={<EditPassengerForm />} />
        </Route>

        <Route element={<StaffRoutes />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/check-in" element={<CheckInPage />} />
          <Route path="/staff/in-flight" element={<InFlightPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}
