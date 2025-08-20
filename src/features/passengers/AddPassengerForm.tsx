import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPassenger } from '../../api/passengerApi';
import { getAllFlights } from '../../api/flightApi';
import type { PassengerCreateRequest } from '../../types/passenger';
import type { Flight } from '../../types/flight';

export default function AddPassengerForm() {
  const navigate = useNavigate();

  const [flights, setFlights] = useState<Flight[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState<{
    flight: string;
    name: string;
    dob: string;
    passport: string;
    address: string;
    email: string;
    phone: string;
    mealPreference: 'veg' | 'non-veg' | '';
    wheelchair: 'Y' | 'N' | '';
    infant: 'Y' | 'N' | '';
  }>({
    flight: '',
    name: '',
    dob: '',
    passport: '',
    address: '',
    email: '',
    phone: '',
    mealPreference: '',
    wheelchair: '',
    infant: ''
  });

  useEffect(() => {
    getAllFlights()
      .then(setFlights)
      .catch(() => setError('Failed to load flights'));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.flight) {
      setError('Please select a flight');
      return;
    }

    // Validate flight ID
    console.log('🔍 Form flight value:', form.flight, typeof form.flight);
    const flightId = parseInt(form.flight);
    console.log('🔍 Parsed flight ID:', flightId, typeof flightId);
    if (isNaN(flightId) || flightId <= 0) {
      setError('Please select a valid flight');
      return;
    }

    // Validate required fields
    if (!form.name.trim()) {
      setError('Name is required');
      return;
    }
    if (!form.email.trim()) {
      setError('Email is required');
      return;
    }
    if (!form.phone.trim()) {
      setError('Phone is required');
      return;
    }
    if (!form.passport.trim()) {
      setError('Passport is required');
      return;
    }
    if (!form.dob) {
      setError('Date of birth is required');
      return;
    }
    if (!form.address.trim()) {
      setError('Address is required');
      return;
    }
    if (!form.mealPreference) {
      setError('Meal preference is required');
      return;
    }
    if (!form.wheelchair) {
      setError('Wheelchair assistance selection is required');
      return;
    }
    if (!form.infant) {
      setError('Infant travel selection is required');
      return;
    }

    const payload: PassengerCreateRequest = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      passport: form.passport,
      dob: form.dob,
      address: form.address,
      mealPreference: form.mealPreference as 'veg' | 'non-veg',
      infant: form.infant as 'Y' | 'N',
      wheelchair: form.wheelchair as 'Y' | 'N',
      flight: {
        flightId: flightId
      }
    };

    try {
      console.log('🚀 Submitting passenger:', payload);
      await createPassenger(payload);
      alert('Passenger added successfully!');
      navigate('/admin/passengers');
    } catch (err: any) {
      console.error('❌ Failed to add passenger:', err);

      // Handle different types of errors
      if (err.response?.status === 400) {
        setError(err.response?.data?.message || 'Invalid data provided');
      } else if (err.response?.status === 403) {
        setError('Access denied. Please check your permissions.');
      } else if (err.response?.status === 401) {
        setError('Authentication required. Please log in again.');
      } else {
        setError(err.response?.data?.message || 'Failed to add passenger');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">➕ Add Passenger</h2>

      {error && <p className="text-red-600 text-sm">{error}</p>}

      <select
        name="flight"
        value={form.flight}
        onChange={handleChange}
        className="w-full border px-4 py-2 rounded"
        required
      >
        <option value="">Select Flight</option>
        {flights.map(flight => (
          <option key={flight.flightId} value={flight.flightId}>
            {flight.flightNumber} — {flight.source} → {flight.destination}
          </option>
        ))}
      </select>

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="dob" type="date" value={form.dob} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="passport" placeholder="Passport" value={form.passport} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="phone" type="tel" placeholder="Phone" value={form.phone} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />

      <select name="mealPreference" value={form.mealPreference} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
        <option value="">Meal Preference</option>
        <option value="veg">Veg</option>
        <option value="non-veg">Non-Veg</option>
      </select>

      <select name="wheelchair" value={form.wheelchair} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
        <option value="">Wheelchair Assistance?</option>
        <option value="Y">Yes</option>
        <option value="N">No</option>
      </select>

      <select name="infant" value={form.infant} onChange={handleChange} className="w-full border px-4 py-2 rounded" required>
        <option value="">Travelling with Infant?</option>
        <option value="Y">Yes</option>
        <option value="N">No</option>
      </select>

      <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
        Add Passenger
      </button>
    </form>
  );
}
