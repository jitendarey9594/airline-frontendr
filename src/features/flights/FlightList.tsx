import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import { fetchFlights } from './flightSlice';
import Loader from '../../components/Loader';


export default function FlightList() {
  const dispatch = useAppDispatch();
  const { flights, loading } = useAppSelector((state: any) => state.flights);

  useEffect(() => {
    dispatch(fetchFlights());
  }, [dispatch]);

  if (loading) return <Loader />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Flights</h2>
      <ul className="space-y-2">
        {flights.map((flight: any) => (
          <li key={flight.id} className="p-4 bg-white shadow rounded">
            <div className="font-bold">{flight.code}</div>
            <div>{flight.origin} → {flight.destination}</div>
            <div>{flight.departureTime}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
