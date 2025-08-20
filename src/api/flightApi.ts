import type { Flight } from '../types/flight';
import axiosInstance from './axiosInstance';

export async function getAllFlights(): Promise<Flight[]> {
  try {
    const response = await axiosInstance.get<Flight[]>('/api/flights/all');
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to fetch flights';
    console.error('Flight fetch failed:', message);
    throw new Error(message);
  }
}

export async function deleteFlight(id: number): Promise<void> {
  try {
    await axiosInstance.delete(`/api/flights/${id}`);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to delete flight';
    console.error('Flight delete failed:', message);
    throw new Error(message);
  }
}

export const fetchFlights = async (): Promise<Flight[]> => {
  const response = await axiosInstance.get<Flight[]>('/api/flights');
  return response.data;
};

export const createFlight = async (flight: Omit<Flight, 'flightId'>): Promise<Flight> => {
  try {
    const response = await axiosInstance.post<Flight>('/api/flights', flight);
    return response.data;
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || 'Failed to create flight';
    console.error('Flight creation failed:', message);
    throw new Error(message);
  }
};
