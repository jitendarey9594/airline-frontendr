export interface Flight {
  flightId: number;
  flightNumber: string | null;
  source: string | null;
  destination: string | null;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number | null;
  route: string;
}
