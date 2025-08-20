import axiosInstance from './axiosInstance';
import type { Seat } from '../types/seat';

// Map backend -> frontend Seat
function mapSeat(apiSeat: any): Seat {
  // Accept various casings/keys from backend
  const seatId = apiSeat.seatId ?? apiSeat.id ?? apiSeat.seat_id;
  const seatNumber = apiSeat.seatNumber ?? apiSeat.seat_number;
  const flightId = apiSeat.flightId ?? apiSeat.flight?.flightId ?? apiSeat.flight_id ?? apiSeat.flight?.flight_id;
  const passengerId = apiSeat.passengerId ?? apiSeat.passenger_id ?? apiSeat.passenger?.passengerId ?? apiSeat.passenger?.passenger_id ?? null;
  const checkedInRaw = apiSeat.checkedIn ?? apiSeat.checked_in;
  const occupied = (typeof checkedInRaw === 'string' ? checkedInRaw.toUpperCase() === 'Y' : false) || apiSeat.occupied === true;

  return {
    seatId: Number(seatId),
    seatNumber: String(seatNumber),
    flightId: Number(flightId),
    passengerId: passengerId != null ? Number(passengerId) : null,
    occupied,
  };
}

export const getAvailableSeatsByFlight = async (flightId: number): Promise<Seat[]> => {
  const res = await axiosInstance.get<any[]>(`/api/seats/available/${flightId}`);
  return res.data.map(mapSeat);
};

export const getAllSeats = async (): Promise<Seat[]> => {
  const res = await axiosInstance.get<any[]>(`/api/seats`);
  return res.data.map(mapSeat);
};

export const getSeatsForFlight = async (flightId: number): Promise<Seat[]> => {
  const all = await getAllSeats();
  return all.filter(s => s.flightId === flightId);
};

export const updateSeat = async (id: number, seat: Partial<Seat>): Promise<void> => {
  // Map frontend -> backend payload to match your SeatController (passengerId + checkedIn)
  const payload: any = {};
  if (typeof seat.seatNumber !== 'undefined') payload.seatNumber = seat.seatNumber;
  if (typeof seat.passengerId !== 'undefined') payload.passengerId = seat.passengerId;
  if (typeof seat.occupied !== 'undefined') payload.checkedIn = seat.occupied ? 'Y' : 'N';
  await axiosInstance.put(`/api/seats/${id}`, payload);
};

