import axiosInstance from './axiosInstance';
import { getAllFlights } from './flightApi';
import type { FlightService } from '../types/service';

// Map UI meal category (VEG, NON_VEG, etc.) to DB-friendly strings
// Observed existing DB rows: type values like 'veg', 'non-veg' when category='meal'
export const mapMealSubtype = (cat?: string | null) => {
  if (!cat) return null;
  const up = String(cat).toUpperCase();
  switch (up) {
    case 'VEG': return 'veg';
    case 'NON_VEG': return 'non-veg';
    case 'JAIN': return 'jain';
    case 'VEGAN': return 'vegan';
    case 'GLUTEN_FREE': return 'gluten_free';
    default: return up.toLowerCase().replace('_', '-');
  }
};

// Get all services (then filter by flight on frontend if needed)
export const getAllServices = async (): Promise<FlightService[]> => {
  try {
    const response = await axiosInstance.get<any[]>('/api/services');
    console.log('📋 Raw backend services:', response.data);

    // Transform backend format to frontend format
    const transformedServices = response.data.map((service: any) => {
      const typeUpper = String(service.type || '').toUpperCase();
      const catLower = String(service.category || '').toLowerCase();
      const derivedCategory = catLower || (typeUpper === 'ANCILLARY' ? 'ancillary' : typeUpper === 'MEAL' ? 'meal' : typeUpper === 'SHOPPING' ? 'shopping' : '');
      return {
        id: Number(service.serviceId || service.id),
        serviceId: Number(service.serviceId || service.id),
        name: service.name,
        type: service.type,
        category: derivedCategory,
        price: Number(service.price),
        flightId: Number(service.flight?.flightId || service.flightId),
        flight: service.flight
      };
    });

    console.log('🔄 Transformed services:', transformedServices);
    return transformedServices;
  } catch (error: any) {
    console.error('Failed to fetch services:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch services');
  }
};

// Get services by flight ID (filter from all services)
export const fetchServicesByFlight = async (flightId: number): Promise<FlightService[]> => {
  try {
    console.log('🔍 Fetching services for flight ID:', flightId);
    const allServices = await getAllServices();
    const filteredServices = allServices.filter(service => service.flightId === flightId);
    console.log('📋 Found services for flight:', filteredServices.length);
    return filteredServices;
  } catch (error: any) {
    console.error('Failed to fetch services for flight:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch services for flight');
  }
};

export const getServiceById = async (id: number): Promise<FlightService> => {
  try {
    const response = await axiosInstance.get<FlightService>(`/api/services/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Failed to fetch service:', error);

    throw new Error(error.response?.data?.message || 'Failed to fetch service');
  }
};

export const createService = async (data: FlightService): Promise<FlightService> => {
  try {
    console.log('🚀 Creating service - Frontend data:', JSON.stringify(data, null, 2));

    // First, get the full flight details
    const flights = await getAllFlights();
    const flight = flights.find((f: any) => f.flightId === data.flightId);
    if (!flight) throw new Error('Flight not found');

    // DB semantics observed:
    // - services.category should be one of: 'ancillary' | 'meal' | 'shopping'
    // - services.type for meals stores the meal subtype like 'veg' | 'non-veg'; otherwise null
    const serviceCategory = String(data.type).toLowerCase();
    const mealSubtype = data.type === 'MEAL' ? mapMealSubtype(data.category) : null;

    const backendPayload = {
      name: data.name,
      type: mealSubtype, // only set for meals
      category: serviceCategory, // 'ancillary' | 'meal' | 'shopping'
      price: data.price,
      flight: {
        flightId: flight.flightId,
        flightNumber: flight.flightNumber,
        source: flight.source,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        availableSeats: flight.availableSeats,
        route: flight.route
      }
    };

    console.log('📤 Backend payload:', JSON.stringify(backendPayload, null, 2));
    const response = await axiosInstance.post<any>('/api/services', backendPayload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to create service:', error);
    throw new Error(error.response?.data?.message || 'Failed to create service');
  }
};

export const updateService = async (id: number, data: FlightService): Promise<FlightService> => {
  try {
    console.log('🔄 Updating service:', id, JSON.stringify(data, null, 2));

    // Get the full flight details for update
    const flights = await getAllFlights();
    const flight = flights.find((f: any) => f.flightId === data.flightId);

    if (!flight) {
      throw new Error('Flight not found');
    }

    // Transform to backend format
    const backendPayload = {
      serviceId: id,
      name: data.name,
      type: data.type,
      category: data.category || null,
      price: data.price,
      flight: {
        flightId: flight.flightId,
        flightNumber: flight.flightNumber,
        source: flight.source,
        destination: flight.destination,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        availableSeats: flight.availableSeats,
        route: flight.route
      }
    };

    console.log('📤 Backend update payload:', JSON.stringify(backendPayload, null, 2));
    const response = await axiosInstance.put<any>(`/api/services/${id}`, backendPayload);
    return response.data;
  } catch (error: any) {
    console.error('Failed to update service:', error);
    throw new Error(error.response?.data?.message || 'Failed to update service');
  }
};

export const deleteService = async (id: number): Promise<void> => {
  try {
    console.log('🗑️ Deleting service:', id);
    await axiosInstance.delete(`/api/services/${id}`);
  } catch (error: any) {
    console.error('Failed to delete service:', error);
    throw new Error(error.response?.data?.message || 'Failed to delete service');
  }
};
