import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFlights } from '../../api/flightApi';
import type { Flight } from '../../types/flight';

interface FlightState {
  flights: Flight[];
  loading: boolean;
}

const initialState: FlightState = {
  flights: [],
  loading: false,
};

export const fetchFlights = createAsyncThunk<Flight[]>(
  'flights/fetchFlights',
  async () => {
    return await getFlights();
  }
);

const flightSlice = createSlice({
  name: 'flights',
  initialState,
  reducers: {},
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

export default flightSlice.reducer;
