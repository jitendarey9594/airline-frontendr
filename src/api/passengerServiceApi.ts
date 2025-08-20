import axiosInstance from './axiosInstance';
import type { FlightService } from '../types/service';

export const getPassengerServices = async (passengerId: number): Promise<FlightService[]> => {
  const res = await axiosInstance.get<FlightService[]>(`/api/passengers/${passengerId}/services`);
  return res.data;
};

export const addPassengerService = async (passengerId: number, serviceId: number): Promise<void> => {
  await axiosInstance.post(`/api/passengers/${passengerId}/services`, { serviceId });
};

export const removePassengerService = async (passengerId: number, serviceId: number): Promise<void> => {
  await axiosInstance.delete(`/api/passengers/${passengerId}/services/${serviceId}`);
};

