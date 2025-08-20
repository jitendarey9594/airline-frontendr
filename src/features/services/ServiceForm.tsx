import { useState } from 'react';
import { createService, updateService } from '../../api/serviceApi';
import type { ServiceType, FlightService } from '../../types/service';

interface Props {
  flightId: number;
  existing?: FlightService;
  onSuccess?: () => void;
}

export default function ServiceForm({ flightId, existing, onSuccess }: Props) {
  const [form, setForm] = useState<FlightService>(existing || {
    name: '',
    type: 'ANCILLARY',
    category: '',
    price: 0,
    flightId,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setLoading(true);

    // Validation
    if (!form.name.trim()) {
      setError('Service name is required');
      setLoading(false);
      return;
    }

    if (form.price <= 0) {
      setError('Price must be greater than 0');
      setLoading(false);
      return;
    }

    // Validate category for meals
    if (form.type === 'MEAL' && !form.category) {
      setError('Meal type is required');
      setLoading(false);
      return;
    }

    try {
      if (existing) {
        const serviceId = existing.serviceId || existing.id;
        if (!serviceId) {
          setError('Cannot update service: missing ID');
          setLoading(false);
          return;
        }
        await updateService(serviceId, form);
        alert('Service updated successfully!');
      } else {
        await createService(form);
        alert('Service added successfully!');
      }

      // Reset form if creating new service
      if (!existing) {
        setForm({
          name: '',
          type: 'ANCILLARY',
          category: '',
          price: 0,
          flightId,
        });
      }

      onSuccess?.();
    } catch (err: any) {
      console.error('Service operation failed:', err);
      setError(err.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const getNamePlaceholder = (type: ServiceType) => {
    switch (type) {
      case 'ANCILLARY': return 'e.g., Extra Baggage, Priority Boarding';
      case 'MEAL': return 'e.g., Chicken Biryani, Veg Thali';
      case 'SHOPPING': return 'e.g., Perfume, Headphones, Snacks';
      default: return 'Service name';
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4">
        {existing ? '✏️ Edit Service' : '➕ Add New Service'}
      </h3>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Service Category
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value as ServiceType, category: '' })}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ANCILLARY">🛎️ Ancillary Service</option>
            <option value="MEAL">🍽️ Meal Service</option>
            <option value="SHOPPING">🛍️ In-Flight Shopping</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {form.type === 'ANCILLARY' ? 'Service Name' :
             form.type === 'MEAL' ? 'Meal Name' : 'Item Name'}
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder={getNamePlaceholder(form.type)}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {form.type === 'MEAL' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meal Type
            </label>
            <select
              value={form.category || ''}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select meal type</option>
              <option value="VEG">🥗 Vegetarian</option>
              <option value="NON_VEG">🍖 Non-Vegetarian</option>
              <option value="JAIN">🌱 Jain</option>
              <option value="VEGAN">🌿 Vegan</option>
              <option value="GLUTEN_FREE">🌾 Gluten-Free</option>
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price (₹)
          </label>
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.01"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {loading ? 'Processing...' : (existing ? 'Update Service' : 'Add Service')}
        </button>
      </form>
    </div>
  );
}
