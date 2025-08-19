import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchPassengers } from './passengerSlice';
import Loader from '../../components/Loader';


export default function PassengerList() {
  const dispatch = useAppDispatch();
  const { passengers, loading } = useAppSelector(state => state.passengers);

  useEffect(() => {
    dispatch(fetchPassengers());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Passengers</h2>
      <ul className="space-y-2">
        {passengers.map(p => (
          <li key={p.id} className="p-4 bg-white shadow rounded">
            <div className="font-bold">{p.name}</div>
            <div>{p.email}</div>
            <div>{p.seat}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
