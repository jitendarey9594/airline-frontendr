import { useEffect } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch'; // ✅ use typed dispatch
import { useSelector } from 'react-redux';
import { fetchServices } from './serviceSlice';
import Loader from '../../components/Loader';

export default function ServiceList() {
  const dispatch = useAppDispatch(); // ✅ now accepts thunks
  const { services, loading } = useSelector((state: any) => state.services);

  useEffect(() => {
    dispatch(fetchServices()); // ✅ no more type error
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Flight Services</h2>
      <ul className="space-y-2">
        {services.map((s: any) => (
          <li key={s.id} className="p-4 bg-white shadow rounded">
            <div className="font-bold">{s.name}</div>
            <div>{s.category}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
