import { useEffect, useMemo, useState, useCallback } from 'react';
import FlightPicker from './FlightPicker';
import { getPassengers } from '../../api/passengerApi';
import type { Passenger } from '../../types/passenger';
import { getSeatsForFlight, updateSeat } from '../../api/seatApi';
import type { Seat } from '../../types/seat';
import { Card, CardContent, CardTitle } from '../../components/card';
import Header from '../../components/Header';
import SeatMap from './SeatMap';

export default function CheckInPage() {
  const [flightId, setFlightId] = useState<number | null>(null);
  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedPassengerId, setSelectedPassengerId] = useState<number | null>(null);
  const [filters, setFilters] = useState({ wheelchair: 'all', infant: 'all', checked: 'all' as 'all' | 'in' | 'out' });

  const getPassengerFlightId = (p: any): number | null => {
    if (p?.flight?.flightId) return Number(p.flight.flightId);
    if (p?.flightId) return Number(p.flightId);
    return null;
  };

  useEffect(() => {
    if (!flightId) return;
    (async () => {
      const ps = await getPassengers();
      const pf = ps.filter(p => getPassengerFlightId(p) === flightId);
      setPassengers(pf);
      setSeats(await getSeatsForFlight(flightId));
      // Auto-select first passenger if none selected
      if (!selectedPassengerId && pf.length > 0) setSelectedPassengerId(pf[0].passengerId);
    })();
  }, [flightId]);

  const isCheckedIn = useCallback((p: Passenger) => {
    return seats.some(s => s.passengerId === p.passengerId && s.occupied);
  }, [seats]);

  const filtered = useMemo(() => {
    return passengers.filter(p => {
      if (filters.wheelchair !== 'all') {
        const needs = filters.wheelchair === 'yes';
        const val = (p as any).wheelchair;
        const bool = val === true || val === 'Y';
        if (bool !== needs) return false;
      }
      if (filters.infant !== 'all') {
        const has = filters.infant === 'yes';
        const val = (p as any).infant;
        const bool = val === true || val === 'Y';
        if (bool !== has) return false;
      }
      if (filters.checked !== 'all') {
        if (filters.checked === 'in' && !isCheckedIn(p)) return false;
        if (filters.checked === 'out' && isCheckedIn(p)) return false;
      }
      return true;
    });
  }, [passengers, filters, isCheckedIn]);

  const handleAssignSeat = async (p: Passenger, seatId: number) => {
    await updateSeat(seatId, { occupied: true, passengerId: p.passengerId });
    if (flightId) setSeats(await getSeatsForFlight(flightId));
  };

  const handleCheckout = async (p: Passenger) => {
    const seat = seats.find(s => s.passengerId === p.passengerId && s.occupied);
    if (seat) {
      await updateSeat(seat.seatId, { occupied: false, passengerId: null });
      if (flightId) setSeats(await getSeatsForFlight(flightId));
    }
  };

  const assignSelected = async (seatId: number) => {
    const p = passengers.find(pp => pp.passengerId === selectedPassengerId);
    if (!p) return;
    await handleAssignSeat(p, seatId);
  };

  const unassignSelected = async () => {
    const p = passengers.find(pp => pp.passengerId === selectedPassengerId);
    if (!p) return;
    await handleCheckout(p);
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />
      <main className="container-custom section-padding space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-secondary-900 mb-2">Check-in Service</h1>
          <p className="text-secondary-600">Select a flight and manage passenger check-in</p>
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
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <select className="border rounded px-3 py-2" value={filters.wheelchair} onChange={e => setFilters(f => ({...f, wheelchair: e.target.value}))}>
                  <option value="all">All</option>
                  <option value="yes">Needs wheelchair</option>
                  <option value="no">No wheelchair</option>
                </select>
                <select className="border rounded px-3 py-2" value={filters.infant} onChange={e => setFilters(f => ({...f, infant: e.target.value}))}>
                  <option value="all">All</option>
                  <option value="yes">Infant</option>
                  <option value="no">No infant</option>
                </select>
                <select className="border rounded px-3 py-2" value={filters.checked} onChange={e => setFilters(f => ({...f, checked: e.target.value as any}))}>
                  <option value="all">All</option>
                  <option value="in">Checked-in</option>
                  <option value="out">Not checked-in</option>
                </select>
                <select className="border rounded px-3 py-2" value={selectedPassengerId ?? ''} onChange={e => setSelectedPassengerId(e.target.value ? Number(e.target.value) : null)}>
                  <option value="">Select passenger for seat assignment</option>
                  {passengers.map(p => (
                    <option key={p.passengerId} value={p.passengerId}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Passenger list */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left bg-secondary-100">
                      <th className="p-2">Name</th>
                      <th className="p-2">DOB</th>
                      <th className="p-2">Passport</th>
                      <th className="p-2">Address</th>
                      <th className="p-2">Checked-in</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(p => {
                      const mine = seats.find(s => s.passengerId === p.passengerId && s.occupied);
                      return (
                        <tr key={p.passengerId} className={`border-t ${selectedPassengerId===p.passengerId ? 'bg-primary-50' : ''}`}>
                          <td className="p-2">
                            <button className="underline" onClick={() => setSelectedPassengerId(p.passengerId)}>{p.name}</button>
                          </td>
                          <td className="p-2">{p.dob || '—'}</td>
                          <td className="p-2">{p.passport || '—'}</td>
                          <td className="p-2">{p.address || '—'}</td>
                          <td className="p-2">{mine ? mine.seatNumber : '—'}</td>
                          <td className="p-2 space-x-2">
                            <button className="text-red-600 disabled:text-secondary-300" disabled={!mine} onClick={() => handleCheckout(p)}>Check-out</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Seat map */}
              <SeatMap
                seats={seats}
                selectedPassengerId={selectedPassengerId}
                onAssign={assignSelected}
                onUnassign={() => unassignSelected()}
              />
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

