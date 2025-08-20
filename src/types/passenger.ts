


export interface Flight {
  flightId: number;
  flightNumber: string;
  source: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  availableSeats: number;
  route: string;
}

export interface Passenger {
  passengerId: number;
  name: string;
  dob: string;
  passport: string;
  address: string;
  mealPreference: string;
  wheelchair: boolean | null;
  infant: boolean | null;
  email: string | null;
  phone: string | null;
  flight: Flight;
}

export interface PassengerCreateRequest {
  name: string;
  email: string;
  phone: string;
  passport: string;
  dob: string;
  address: string;
  mealPreference: 'veg' | 'non-veg';
  infant: 'Y' | 'N';
  wheelchair: 'Y' | 'N';
  flight: { flightId: number } | null;
}