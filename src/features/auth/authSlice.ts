import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/auth';
import { clearToken } from '../../utils/tokenUtils';

const initialState: AuthState = {
  token: '',
  isAuthenticated: false,
  admin: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<{ token: string; admin: any }>) => {
      state.token = action.payload.token;
      state.admin = action.payload.admin;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.token = '';
      state.admin = null;
      state.isAuthenticated = false;
      clearToken();
    },
  },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
