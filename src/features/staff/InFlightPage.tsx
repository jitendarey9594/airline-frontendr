import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardTitle } from '../../components/card';
import Header from '../../components/Header';
import FlightPicker from './FlightPicker';
import { getPassengers } from '../../api/passengerApi';
import type { Passenger } from '../../types/passenger';
import { fetchServicesByFlight } from '../../api/serviceApi';
import type { FlightService } from '../../types/service';
import { getPassengerServices, addPassengerService, removePassengerService } from '../../api/passengerServiceApi';

import { getSeatsForFlight } from '../../api/seatApi';
import type { Seat } from '../../types/seat';

export default function InFlightPage() {
  const [flightId, setFlightId] = useState<number | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);

  const [selected, setSelected] = useState<Record<number, number[]>>({}); // passengerId -> serviceIds

  const [services, setServices] = useState<FlightService[]>([]);

  useEffect(() => {
    if (!flightId) return;
    (async () => {
      const ps = await getPassengers();
      const pf = ps.filter(p => (p as any)?.flight?.flightId === flightId || (p as any)?.flightId === flightId);
      setPassengers(pf);
      setServices(await fetchServicesByFlight(flightId));
      setSeats(await getSeatsForFlight(flightId));

      // Load per-passenger selected services
      const map: Record<number, number[]> = {};
      for (const p of pf) {
        try {
          const svcs = await getPassengerServices(p.passengerId);
          map[p.passengerId] = svcs.map(s => s.serviceId ?? (s as any).id).filter(Boolean) as number[];
        } catch {
          map[p.passengerId] = [];
        }
      }
      setSelected(map);
    })();
  }, [flightId]);

  const ancillariesAll = useMemo(() => services.filter(s => s.category === 'ancillary'), [services]);
  const mealsAll = useMemo(() => services.filter(s => s.category === 'meal'), [services]);
  const shoppingAll = useMemo(() => services.filter(s => s.category === 'shopping'), [services]);

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />
      <main className="container-custom section-padding space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">In-flight Service</h1>
          <p className="text-secondary-600">Manage meals, ancillaries, and shopping items</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
            <CardTitle className="mb-2">Select Flight</CardTitle>
            <FlightPicker onSelect={id => setFlightId(id)} />
          </CardContent>
        </Card>

        {flightId && (
          <Card>
            <CardContent className="p-6 space-y-4">
              {passengers.length === 0 ? (
                <div className="text-secondary-600">No passengers for this flight.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left bg-secondary-100">
                        <th className="p-2">Name</th>
                        <th className="p-2">Seat</th>
                        <th className="p-2">Meal Preference</th>
                        <th className="p-2">Ancillaries</th>
                        <th className="p-2">Meals</th>
                        <th className="p-2">Shopping</th>
                      </tr>
                    </thead>
                    <tbody>
                      {passengers.map(p => {
                        const sel = selected[p.passengerId] || [];

                        const toggle = async (serviceId: number, has: boolean) => {
                          if (has) {
                            await removePassengerService(p.passengerId, serviceId);
                            setSelected(prev => ({ ...prev, [p.passengerId]: (prev[p.passengerId] || []).filter(id => id !== serviceId) }));
                          } else {
                            await addPassengerService(p.passengerId, serviceId);
                            setSelected(prev => ({ ...prev, [p.passengerId]: [ ...(prev[p.passengerId] || []), serviceId ] }));
                          }
                        };

                        return (
                          <tr key={p.passengerId} className="border-t">
                            <td className="p-2">{p.name}</td>
                            <td className="p-2">{seats.find(s => s.passengerId === p.passengerId && s.flightId === flightId && s.occupied)?.seatNumber || '—'}</td>
                            <td className="p-2">{p.mealPreference || '—'}</td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-2">
                                {ancillariesAll.map(s => {
                                  const id = s.serviceId ?? (s as any).id;
                                  const has = sel.includes(id as number);
                                  return (
                                    <button key={id} className={`px-2 py-1 rounded text-xs border ${has ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => toggle(id as number, has)}>
                                      {s.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-2">
                                {mealsAll.map(s => {
                                  const id = s.serviceId ?? (s as any).id;
                                  const has = sel.includes(id as number);
                                  return (
                                    <button key={id} className={`px-2 py-1 rounded text-xs border ${has ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => toggle(id as number, has)}>
                                      {s.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                            <td className="p-2">
                              <div className="flex flex-wrap gap-2">
                                {shoppingAll.map(s => {
                                  const id = s.serviceId ?? (s as any).id;
                                  const has = sel.includes(id as number);
                                  return (
                                    <button key={id} className={`px-2 py-1 rounded text-xs border ${has ? 'bg-blue-600 text-white' : 'bg-white'}`} onClick={() => toggle(id as number, has)}>
                                      {s.name}
                                    </button>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

