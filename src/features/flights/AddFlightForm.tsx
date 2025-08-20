import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createFlight } from '../../api/flightApi';
import type { Flight } from '../../types/flight';

export default function AddFlightForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<Omit<Flight, 'flightId'>>({
    flightNumber: '',
    source: '',
    destination: '',
    departureTime: '',
    arrivalTime: '',
    availableSeats: null,
    route: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSeatsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setForm(prev => ({
      ...prev,
      availableSeats: value === '' ? null : parseInt(value)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!form.flightNumber?.trim()) {
      setError('Flight number is required');
      return;
    }
    if (!form.source?.trim()) {
      setError('Source is required');
      return;
    }
    if (!form.destination?.trim()) {
      setError('Destination is required');
      return;
    }
    if (!form.departureTime) {
      setError('Departure time is required');
      return;
    }
    if (!form.arrivalTime) {
      setError('Arrival time is required');
      return;
    }
    if (!form.route?.trim()) {
      setError('Route is required');
      return;
    }

    try {
      console.log('🚀 Submitting flight:', form);
      await createFlight(form);
      alert('Flight added successfully!');
      navigate('/admin/flights');
    } catch (err: any) {
      console.error('❌ Failed to add flight:', err);
      
      // Handle different types of errors
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid data provided');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to add flight');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">✈️ Add Flight</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <input
        type="text"
        name="flightNumber"
        placeholder="Flight Number (e.g., AI101)"
        value={form.flightNumber ?? ''}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />

      <input
        type="text"
        name="source"
        placeholder="Source (e.g., Delhi)"
        value={form.source ?? ''}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />

      <input
        type="text"
        name="destination"
        placeholder="Destination (e.g., Mumbai)"
        value={form.destination ?? ''}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />

      <input
        type="datetime-local"
        name="departureTime"
        value={form.departureTime}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />

      <input
        type="datetime-local"
        name="arrivalTime"
        value={form.arrivalTime}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />

      <input
        type="number"
        name="availableSeats"
        placeholder="Available Seats"
        value={form.availableSeats !== null ? form.availableSeats : ''}
        onChange={handleSeatsChange}
        className="w-full border px-4 py-2 rounded"
        min="1"
      />

      <input
        type="text"
        name="route"
        placeholder="Route (e.g., DEL → BOM)"
        value={form.route}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      />

      <button
        type="submit"
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
      >
        Add Flight
      </button>
    </form>
  );
}
