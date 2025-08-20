import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getPassengerById, updatePassenger } from '../../api/passengerApi';
import type { Passenger } from '../../types/passenger';

export default function EditPassengerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState<Omit<Passenger, 'passengerId'>>({
    name: '',
    dob: '',
    passport: '',
    address: '',
    mealPreference: '',
    wheelchair: null,
    infant: null,
    email: null,
    phone: null,
    flight: {
      flightId: 0,
      flightNumber: '',
      source: '',
      destination: '',
      departureTime: '',
      arrivalTime: '',
      availableSeats: 0,
      route: ''
    }
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPassenger = async () => {
      try {
        const passenger = await getPassengerById(Number(id));
        const { passengerId, ...rest } = passenger;
        setForm(rest);
      } catch (err: any) {
        console.error('Failed to fetch passenger:', err);
        setError('Unable to load passenger details.');
      }
    };
    fetchPassenger();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await updatePassenger(Number(id), form);
      alert('Passenger updated!');
      navigate('/admin/passengers');
    } catch (err: any) {
      console.error('Update failed:', err);
      setError(err.response?.data?.message || 'Failed to update passenger');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-xl mx-auto p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">✏️ Edit Passenger</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <input name="name" placeholder="Name" value={form.name} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="dob" type="date" value={form.dob} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="passport" placeholder="Passport" value={form.passport} onChange={handleChange} className="w-full border px-4 py-2 rounded" required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <input name="mealPreference" placeholder="Meal Preference" value={form.mealPreference} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <input name="email" placeholder="Email" value={form.email ?? ''} onChange={handleChange} className="w-full border px-4 py-2 rounded" />
      <input name="phone" placeholder="Phone" value={form.phone ?? ''} onChange={handleChange} className="w-full border px-4 py-2 rounded" />

      <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
        Update Passenger
      </button>
    </form>
  );
}
