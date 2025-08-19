import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getPassengers } from '../../api/passengerApi';
import type { Passenger } from '../../types/passenger';

interface PassengerState {
  passengers: Passenger[];
  loading: boolean;
}

const initialState: PassengerState = {
  passengers: [],
  loading: false,
};

export const fetchPassengers = createAsyncThunk<Passenger[]>(
  'passengers/fetchPassengers',
  async () => {
    return await getPassengers();
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
