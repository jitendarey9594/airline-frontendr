import { useEffect, useState } from 'react';
import { useRedux } from '../../hooks/useRedux';
import { deleteService } from '../../api/serviceApi';
import { getServices } from '../../features/services/serviceSlice';
import type { FlightService, ServiceType } from '../../types/service';
import useAppDispatch from '../../hooks/useAppDispatch';

interface Props {
  flightId: number;
  onEdit?: (service: FlightService) => void;
  onRefresh?: () => void;
}

export default function ServiceList({ flightId, onEdit, onRefresh }: Props) {
  const dispatch = useAppDispatch();
  const { list: services, loading } = useRedux(state => state.services);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(getServices(flightId));
  }, [dispatch, flightId]);

  const handleDelete = async (service: FlightService) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    const serviceId = service.serviceId || service.id;
    if (!serviceId) {
      alert('Cannot delete service: missing ID');
      return;
    }

    setDeletingId(serviceId);
    try {
      await deleteService(serviceId);
      alert('Service deleted successfully!');
      dispatch(getServices(flightId)); // Refresh the list
      onRefresh?.();
    } catch (error: any) {
      console.error('Failed to delete service:', error);
      alert('Failed to delete service: ' + (error.message || 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const getServiceIcon = (type: ServiceType) => {
    switch (type) {
      case 'ANCILLARY': return '🛎️';
      case 'MEAL': return '🍽️';
      case 'SHOPPING': return '🛍️';
      default: return '📋';
    }
  };

  const getServiceTypeLabel = (type: ServiceType) => {
    switch (type) {
      case 'ANCILLARY': return 'Ancillary';
      case 'MEAL': return 'Meal';
      case 'SHOPPING': return 'Shopping';
      default: return type;
    }
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading services...</div>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="text-center py-8">
          <div className="text-gray-500 mb-2">No services found for this flight</div>
          <div className="text-sm text-gray-400">Add your first service using the form above</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          Flight Services ({services.length})
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {services.map((service: FlightService) => (
          <div key={service.id} className="p-6 hover:bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{getServiceIcon(service.type)}</span>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                    {getServiceTypeLabel(service.type)}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="font-semibold text-green-600">₹{service.price}</span>
                  {service.category && (
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                      {service.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {onEdit && (
                  <button
                    onClick={() => onEdit(service)}
                    className="px-3 py-1 text-sm text-blue-600 hover:bg-blue-50 rounded border border-blue-200 hover:border-blue-300 transition"
                  >
                    Edit
                  </button>
                )}

                <button
                  onClick={() => handleDelete(service)}
                  disabled={deletingId === (service.serviceId || service.id)}
                  className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded border border-red-200 hover:border-red-300 transition disabled:opacity-50"
                >
                  {deletingId === (service.serviceId || service.id) ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
