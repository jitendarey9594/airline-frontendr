import React from 'react';
import type { Seat } from '../../types/seat';

type Props = {
  seats: Seat[];
  selectedPassengerId: number | null;
  onAssign: (seatId: number) => void;
  onUnassign: (seatId: number) => void;
};

// Parse row number and column letter from seat like "12C"
function parseSeat(sn: string): { row: number; col: string } {
  const match = sn.match(/^(\d+)([A-Za-z]+)$/);
  if (!match) return { row: 0, col: sn };
  return { row: parseInt(match[1], 10), col: match[2].toUpperCase() };
}

export default function SeatMap({ seats, selectedPassengerId, onAssign, onUnassign }: Props) {
  // Build grid
  const enriched = seats
    .filter(s => !!s.seatNumber)
    .map(s => ({ ...s, ...parseSeat(s.seatNumber) }))
    .filter(s => s.row > 0 && s.col);
  const rows = Array.from(new Set(enriched.map(s => s.row))).sort((a, b) => a - b);
  const cols = Array.from(new Set(enriched.map(s => s.col))).sort((a, b) => a.localeCompare(b));

  if (rows.length === 0 || cols.length === 0) {
    // Fallback: render flat list of seats if parsing failed
    return (
      <div className="border rounded-xl p-4 bg-white">
        <div className="mb-2 text-sm text-secondary-600">Seat List</div>
        <div className="flex flex-wrap gap-2">
          {seats.map(seat => {
            const isMine = seat.passengerId != null && selectedPassengerId != null && seat.passengerId === selectedPassengerId && seat.occupied;
            const isOccupied = seat.occupied && !isMine;
            const classes = isMine ? 'bg-blue-600 text-white' : isOccupied ? 'bg-red-200 text-red-900' : 'bg-green-100 text-green-900';
            const onClick = () => {
              if (isMine) return onUnassign(seat.seatId);
              if (!isOccupied) return onAssign(seat.seatId);
            };
            return (
              <button key={seat.seatId} className={`px-3 py-2 rounded ${classes}`} onClick={onClick}>{seat.seatNumber}</button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-xl p-4 bg-white">
      <div className="mb-2 text-sm text-secondary-600">Seat Map</div>
      <div className="overflow-auto">
        <table className="text-sm">
          <thead>
            <tr>
              <th className="p-2"></th>
              {cols.map(c => (
                <th key={c} className="p-2 text-center">{c}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={r}>
                <td className="p-2 pr-4 font-medium text-secondary-700">{r}</td>
                {cols.map(c => {
                  const seat = enriched.find(s => s.row === r && s.col === c);
                  if (!seat) return <td key={c} className="p-2"/>;

                  const isMine = seat.passengerId != null && selectedPassengerId != null && seat.passengerId === selectedPassengerId && seat.occupied;
                  const isOccupied = seat.occupied && !isMine;

                  const base = 'w-10 h-10 rounded-md flex items-center justify-center text-xs cursor-pointer select-none';
                  const classes = isMine
                    ? 'bg-blue-600 text-white'
                    : isOccupied
                      ? 'bg-red-200 text-red-900 cursor-not-allowed'
                      : 'bg-green-100 text-green-900 hover:bg-green-200';

                  const onClick = () => {
                    if (isMine) return onUnassign(seat.seatId);
                    if (!isOccupied) return onAssign(seat.seatId);
                  };

                  return (
                    <td key={c} className="p-1">
                      <button className={`${base} ${classes}`} onClick={onClick} title={seat.seatNumber}>
                        {seat.seatNumber}
                      </button>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-3 text-xs text-secondary-500 flex gap-3">
        <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-green-200 rounded"/> Free</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-red-300 rounded"/> Occupied</span>
        <span className="inline-flex items-center gap-1"><span className="inline-block w-3 h-3 bg-blue-600 rounded"/> Selected passenger</span>
      </div>
    </div>
  );
}

