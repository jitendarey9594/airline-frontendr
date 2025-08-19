import type { Service } from '../types/service';

export async function getServices(): Promise<Service[]> {
  const response = await fetch('/api/services');
  if (!response.ok) throw new Error('Failed to fetch services');
  return await response.json();
}
