import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import type { Passenger } from '../../types/passenger';

interface PassengerState {
  passengers: Passenger[];
  loading: boolean;
}

const initialState: PassengerState = {
  passengers: [],
  loading: false,
};

// ✅ Typed thunk: returns Passenger[], accepts flightId: number
export const fetchPassengers = createAsyncThunk<Passenger[], number>(
  'passengers/fetchPassengers',
  async (flightId: number) => {
    const res = await axios.get<Passenger[]>(`/api/passengers/byFlight/${flightId}`);
    return res.data;
  }
);

const passengerSlice = createSlice({
  name: 'passengers',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchPassengers.pending, state => {
        state.loading = true;
      })
      .addCase(fetchPassengers.fulfilled, (state, action) => {
        state.passengers = action.payload;
        state.loading = false;
      })
      .addCase(fetchPassengers.rejected, state => {
        state.loading = false;
      });
  },
});

export default passengerSlice.reducer;
