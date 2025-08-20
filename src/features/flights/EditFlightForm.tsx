import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import type { Flight } from '../../types/flight';

export default function EditFlightForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState<Omit<Flight, 'flightId'>>({
    flightNumber: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    availableSeats: null,
    route: ''
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const response = await axiosInstance.get<Flight>(`/api/flights/${id}`);
        const { flightId, ...rest } = response.data;
        setFlight(rest);
      } catch (err: any) {
        console.error('Failed to fetch flight:', err);
        setError('Unable to load flight details.');
      }
    };
    fetchFlight();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFlight(prev => ({ ...prev, [name]: value }));
  };

  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setFlight(prev => ({
      ...prev,
      availableSeats: value === '' ? null : parseInt(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      await axiosInstance.put(`/api/flights/${id}`, flight);
      alert('Flight updated successfully!');
      navigate('/admin/flights');
    } catch (err: any) {
      console.error('Update failed:', err);
      setError(err.response?.data?.message || 'Failed to update flight');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">✏️ Edit Flight</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="flightNumber"
          placeholder="Flight Number"
          value={flight.flightNumber ?? ''}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="source"
          placeholder="Source"
          value={flight.source ?? ''}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={flight.destination ?? ''}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="datetime-local"
          name="departureTime"
          value={flight.departureTime}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="datetime-local"
          name="arrivalTime"
          value={flight.arrivalTime}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
          required
        />

        <input
          type="number"
          name="availableSeats"
          placeholder="Available Seats"
          value={flight.availableSeats !== null ? flight.availableSeats : ''}
          onChange={handleSeatsChange}
          className="w-full border px-4 py-2 rounded"
        />

        <input
          type="text"
          name="route"
          placeholder="Route (e.g. DEL → BOM)"
          value={flight.route ?? ''}
          onChange={handleChange}
          className="w-full border px-4 py-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
        >
          Update Flight
        </button>
      </form>
    </div>
  );
}
