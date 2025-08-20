import { useEffect, useState } from 'react';
import { getAllFlights } from '../../api/flightApi';
import type { Flight } from '../../types/flight';

export default function FlightPicker({ onSelect }: { onSelect: (id: number) => void }) {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllFlights().then(f => setFlights(f)).finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-secondary-600">Loading flights...</p>;

  return (
    <select onChange={e => onSelect(Number(e.target.value))} className="w-full border px-4 py-2 rounded">
      <option value="">Select a flight</option>
      {flights.map(f => (
        <option key={Number(f.flightId)} value={Number(f.flightId)}>
          {(f.flightNumber ?? 'N/A')} — {(f.source ?? '')} → {(f.destination ?? '')}
        </option>
      ))}
    </select>
  );
}

