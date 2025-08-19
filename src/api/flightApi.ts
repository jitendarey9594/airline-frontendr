import type { Flight } from '../types/flight';

export async function getFlights(): Promise<Flight[]> {
  const response = await fetch('/api/flights');
  if (!response.ok) throw new Error('Failed to fetch flights');
  return await response.json();
}
