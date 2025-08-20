import axiosInstance from './axiosInstance';
import type { Passenger } from '../types/passenger';
import type { PassengerCreateRequest } from '../types/passenger';


export const getPassengers = async (): Promise<Passenger[]> => {
  const res = await axiosInstance.get<Passenger[]>('/api/passengers');
  return res.data;
};

export const getPassengerById = async (id: number): Promise<Passenger> => {
  const res = await axiosInstance.get<Passenger>(`/api/passengers/${id}`);
  return res.data;
};

export const createPassenger = async (passenger: PassengerCreateRequest) => {
  console.log('🔍 Frontend passenger data:', JSON.stringify(passenger, null, 2));

  if (!passenger.flight || !passenger.flight.flightId) {
    console.error('❌ Missing flight or flight ID:', passenger.flight);
    throw new Error('Missing flight ID');
  }

  const flightId = Number(passenger.flight.flightId);
  if (isNaN(flightId) || flightId <= 0) {
    console.error('❌ Invalid flight ID:', passenger.flight.flightId);
    throw new Error('Invalid flight ID');
  }

  // Minimal payload to match your controller and avoid cascade issues
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
    flight: { flightId }
  };

  console.log('📤 Backend payload (minimal):', JSON.stringify(backendPayload, null, 2));
  return axiosInstance.post('/api/passengers', backendPayload);
};

export const updatePassenger = async (id: number, passenger: Omit<Passenger, 'passengerId'>): Promise<void> => {
  // Normalize booleans to 'Y'/'N' and include only needed fields
  const toYN = (v: any) => (v === true || v === 'Y' ? 'Y' : v === false || v === 'N' ? 'N' : v);

  const payload: any = {
    name: passenger.name,
    dob: passenger.dob,
    passport: passenger.passport,
    address: passenger.address,
    mealPreference: passenger.mealPreference,
    wheelchair: toYN((passenger as any).wheelchair),
    infant: toYN((passenger as any).infant),
    email: passenger.email,
    phone: passenger.phone,
  };

  if (passenger.flight && (passenger.flight as any).flightId) {
    payload.flight = { flightId: (passenger.flight as any).flightId };
  }

  await axiosInstance.put(`/api/passengers/${id}`, payload);
};

export const deletePassenger = async (id: number): Promise<void> => {
  await axiosInstance.delete(`/api/passengers/${id}`);
};
