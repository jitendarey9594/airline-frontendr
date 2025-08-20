import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPassengers, deletePassenger } from '../../api/passengerApi';
import type { Passenger } from '../../types/passenger';

export default function PassengerList() {
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPassengers = async () => {
      try {
        const data = await getPassengers();
        setPassengers(data);
      } catch (err: any) {
        console.error('Failed to fetch passengers:', err);
        setError('Unable to load passenger data.');
      } finally {
        setLoading(false);
      }
    };
    fetchPassengers();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this passenger?')) return;
    try {
      await deletePassenger(id);
      setPassengers(prev => prev.filter(p => p.passengerId !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete passenger.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-gray-800">👤 Passengers</h1>
          <p className="text-lg text-gray-600 mt-2">
            Browse passenger details and preferences.
          </p>
        </header>

        <section className="mb-6">
          <Link
            to="/admin/passengers/new"
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Passenger
          </Link>
        </section>

        {loading ? (
          <p className="text-gray-500">Loading passengers...</p>
        ) : error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : (
          <table className="w-full bg-white shadow rounded-lg overflow-hidden text-sm">
            <thead className="bg-blue-100 text-left">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">DOB</th>
                <th className="p-4">Passport</th>
                <th className="p-4">Meal</th>
                <th className="p-4">Wheelchair</th>
                <th className="p-4">Infant</th>
                <th className="p-4">Flight #</th>
                <th className="p-4">Route</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {passengers.map(p => (
                <tr key={p.passengerId} className="border-t">
                  <td className="p-4">{p.name}</td>
                  <td className="p-4">{new Date(p.dob).toLocaleDateString()}</td>
                  <td className="p-4">{p.passport}</td>
                  <td className="p-4">{p.mealPreference}</td>
                  <td className="p-4">{p.wheelchair ? 'Yes' : 'No'}</td>
                  <td className="p-4">{p.infant ? 'Yes' : 'No'}</td>
                  <td className="p-4">{p.flight?.flightNumber ?? '—'}</td>
                  <td className="p-4">{p.flight?.route ?? '—'}</td>
                  <td className="p-4 space-x-2">
                    <Link
                      to={`/admin/passengers/edit/${p.passengerId}`}
                      className="text-green-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(p.passengerId)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
