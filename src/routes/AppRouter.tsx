import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginForm from '../features/auth/LoginForm';
import AdminDashboard from '../features/dashboard/AdminDashboard';
import FlightList from '../features/flights/FlightList';
import PassengerList from '../features/passengers/PassengerList';
import ServiceList from '../features/services/ServiceList';
import AdminRoutes from './AdminRoutes';
import { loginAdmin } from "../api/authApi";

export default function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route element={<AdminRoutes />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/flights" element={<FlightList />} />
          <Route path="/admin/passengers" element={<PassengerList />} />
          <Route path="/admin/services" element={<ServiceList />} />
        </Route>
      </Routes>
    </Router>
  );
}
