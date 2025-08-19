import type { Passenger } from '../types/passenger';

export async function getPassengers(): Promise<Passenger[]> {
  const response = await fetch('/api/passengers');
  if (!response.ok) throw new Error('Failed to fetch passengers');
  return await response.json();
}
