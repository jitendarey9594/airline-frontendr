export type ServiceType = 'ANCILLARY' | 'MEAL' | 'SHOPPING';

export type MealType = 'VEG' | 'NON_VEG' | 'JAIN' | 'VEGAN' | 'GLUTEN_FREE';

export interface FlightService {
  id?: number;
  serviceId?: number; // Backend uses serviceId
  name: string;
  type: ServiceType;
  category?: string; // For meals: VEG/NON_VEG/etc, for others: optional categorization
  price: number;
  flightId: number;
  flight?: {
    flightId: number;
    flightNumber: string;
    source: string;
    destination: string;
    departureTime: string;
    arrivalTime: string;
    availableSeats: number;
    route: string;
  };
}

// Helper interfaces for better type safety
export interface AncillaryService extends FlightService {
  type: 'ANCILLARY';
  category?: string; // Optional categorization like "Baggage", "Seating", etc.
}

export interface MealService extends FlightService {
  type: 'MEAL';
  category: MealType; // Required for meals
}

export interface ShoppingService extends FlightService {
  type: 'SHOPPING';
  category?: string; // Optional categorization like "Electronics", "Cosmetics", etc.
}
