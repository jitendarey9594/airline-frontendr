import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { getAllFlights } from '../../api/flightApi';
import type { Flight } from '../../types/flight';

interface FlightState {
  flights: Flight[];
  loading: boolean;
  selectedFlight: Flight | null;
}

const initialState: FlightState = {
  flights: [],
  loading: false,
  selectedFlight: null,
};

export const fetchFlights = createAsyncThunk<Flight[]>(
  'flights/fetchFlights',
  async () => {
    return await getAllFlights();
  }
);

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {
    setSelectedFlight(state, action: PayloadAction<Flight>) {
      state.selectedFlight = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchFlights.pending, state => {
        state.loading = true;
      })
      .addCase(fetchFlights.fulfilled, (state, action) => {
        state.flights = action.payload;
        state.loading = false;
      })
      .addCase(fetchFlights.rejected, state => {
        state.loading = false;
      });
  },
});

// ✅ Export the action
export const { setSelectedFlight } = flightSlice.actions;

// ✅ Export the reducer
export default flightSlice.reducer;
