import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getServices } from '../../api/serviceApi';
import type { Service } from '../../types/service';

interface ServiceState {
  services: Service[];
  loading: boolean;
}

const initialState: ServiceState = {
  services: [],
  loading: false,
};

export const fetchServices = createAsyncThunk<Service[]>(
  'services/fetchServices',
  async () => {
    return await getServices(); // must return Promise<Service[]>
  }
);


const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchServices.pending, state => {
        state.loading = true;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.services = action.payload;
        state.loading = false;
      })
      .addCase(fetchServices.rejected, state => {
        state.loading = false;
      });
  },
});

export default serviceSlice.reducer;
