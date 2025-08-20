export interface Seat {
  seatId: number;
  seatNumber: string;
  flightId: number;
  occupied: boolean;
  passengerId?: number | null;
}

export interface SeatAssignmentRequest {
  passengerId: number;
  seatId: number;
}

