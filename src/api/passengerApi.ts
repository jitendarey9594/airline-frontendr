import axiosInstance from './axiosInstance';
import type { Passenger } from '../types/passenger';
import type { PassengerCreateRequest } from '../types/passenger';
import axios from 'axios';


export const getPassengers = async (): Promise<Passenger[]> => {
  const res = await axiosInstance.get<Passenger[]>('/api/passengers');
  return res.data;
};

export const getPassengerById = async (id: number): Promise<Passenger> => {
  const res = await axiosInstance.get<Passenger>(`/api/passengers/${id}`);
  return res.data;
};

export const createPassenger = (passenger: PassengerCreateRequest) => {
  console.log('🔍 Frontend passenger data:', JSON.stringify(passenger, null, 2));

  if (!passenger.flight || !passenger.flight.flightId) {
    console.error('❌ Missing flight or flight ID:', passenger.flight);
    throw new Error('Missing flight ID');
  }

  // Ensure flightId is a valid number
  const flightId = Number(passenger.flight.flightId);
  if (isNaN(flightId) || flightId <= 0) {
    console.error('❌ Invalid flight ID:', passenger.flight.flightId);
    throw new Error('Invalid flight ID');
  }

  // Use the same format as your working Postman request
  const backendPayload = {
    name: passenger.name,
    email: passenger.email,
    phone: passenger.phone,
    passport: passenger.passport,
    dob: passenger.dob,
    address: passenger.address,
    mealPreference: passenger.mealPreference,
    infant: passenger.infant,
    wheelchair: passenger.wheelchair,
    flight: {
      flightId: flightId
    }
  };

  console.log('📤 Backend payload (Postman format):', JSON.stringify(backendPayload, null, 2));
  return axiosInstance.post('/api/passengers', backendPayload);
};




export const updatePassenger = async (id: number, passenger: Omit<Passenger, 'passengerId'>): Promise<void> => {
  await axiosInstance.put(`/api/passengers/${id}`, passenger);
};

export const deletePassenger = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/passengers/${id}`);
};
