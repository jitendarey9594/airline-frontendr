import { useEffect, useState } from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import { getServices } from './serviceSlice';
import { getAllFlights } from '../../api/flightApi';
import type { Flight } from '../../types/flight';

export default function FlightSelector({ onSelect }: { onSelect: (id: number) => void }) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [selectedFlightId, setSelectedFlightId] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useAppDispatch();

  useEffect(() => {
    const loadFlights = async () => {
      try {
        setLoading(true);
        const flightData = await getAllFlights();
        setFlights(flightData);
      } catch (err: any) {
        console.error('Failed to load flights:', err);
        setError('Failed to load flights');
      } finally {
        setLoading(false);
      }
    };

    loadFlights();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const flightId = parseInt(e.target.value);
    setSelectedFlightId(e.target.value);

    if (flightId && !isNaN(flightId)) {
      dispatch(getServices(flightId) as any);
      onSelect(flightId);
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-gray-500">Loading flights...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Flight to Manage Services
      </label>
      <select
        value={selectedFlightId}
        onChange={handleChange}
        className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="">Choose a flight...</option>
        {flights.map(flight => (
          <option key={flight.flightId} value={flight.flightId}>
            {flight.flightNumber} — {flight.source} → {flight.destination}
            {flight.departureTime && ` (${new Date(flight.departureTime).toLocaleDateString()})`}
          </option>
        ))}
      </select>

      {flights.length === 0 && (
        <p className="text-sm text-gray-500 mt-2">No flights available</p>
      )}
    </div>
  );
}
