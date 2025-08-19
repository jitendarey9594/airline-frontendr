import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/rootReducer';

export default function AdminDashboard() {
  const admin = useSelector((state: RootState) => state.auth.admin);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {admin?.username}</h1>
      <p className="text-gray-600">Use the sidebar to manage flights, passengers, and services.</p>
    </div>
  );
}
