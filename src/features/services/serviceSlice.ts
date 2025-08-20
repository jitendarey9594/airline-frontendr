import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { FlightService } from '../../types/service';
import * as api from '../../api/serviceApi';

export const getServices = createAsyncThunk(
  'services/getServices',
  async (flightId: number) => await api.fetchServicesByFlight(flightId)
);

const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    list: [] as FlightService[],
    loading: false,
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(getServices.pending, state => { state.loading = true; })
      .addCase(getServices.fulfilled, (state, action) => {
        state.list = action.payload;
        state.loading = false;
      });
  },
});

export default serviceSlice.reducer;
