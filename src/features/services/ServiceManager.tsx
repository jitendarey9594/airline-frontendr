import { useState } from 'react';
import { useDispatch } from 'react-redux';
import FlightSelector from './FlightSelector';
import ServiceForm from './ServiceForm';
import ServiceList from './ServiceList';
import { getServices } from './serviceSlice';
import type { FlightService } from '../../types/service';

export default function ServiceManager() {
  const [selectedFlightId, setSelectedFlightId] = useState<number | null>(null);
  const [editingService, setEditingService] = useState<FlightService | null>(null);
  const dispatch = useDispatch();

  const handleFlightSelect = (flightId: number) => {
    setSelectedFlightId(flightId);
    setEditingService(null); // Clear any editing state when switching flights
  };

  const handleServiceSuccess = () => {
    // Refresh the services list after successful create/update
    if (selectedFlightId) {
      dispatch(getServices(selectedFlightId) as any);
    }
    setEditingService(null); // Clear editing state
  };

  const handleEdit = (service: FlightService) => {
    setEditingService(service);
  };

  const handleCancelEdit = () => {
    setEditingService(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">✈️ Flight Services Management</h2>
          <p className="text-gray-600">Manage ancillary services, meals, and in-flight shopping items for your flights</p>
        </div>

        <FlightSelector onSelect={handleFlightSelect} />

        {selectedFlightId && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <ServiceForm
                flightId={selectedFlightId}
                existing={editingService || undefined}
                onSuccess={handleServiceSuccess}
              />

              {editingService && (
                <button
                  onClick={handleCancelEdit}
                  className="mt-4 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded hover:bg-gray-50 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div>
              <ServiceList
                flightId={selectedFlightId}
                onEdit={handleEdit}
                onRefresh={handleServiceSuccess}
              />
            </div>
          </div>
        )}

        {!selectedFlightId && (
          <div className="bg-white p-12 rounded-lg shadow-md text-center">
            <div className="text-gray-400 text-lg mb-2">🎯</div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Select a Flight</h3>
            <p className="text-gray-500">Choose a flight from the dropdown above to manage its services</p>
          </div>
        )}
      </div>
    </div>
  );
}
