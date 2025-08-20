import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthState } from '../../types/auth';
import { clearToken, getToken } from '../../utils/tokenUtils';

// Initialize state from localStorage if token exists
const token = getToken();
const initialState: AuthState = {
  token: token || '',
  isAuthenticated: !!token,
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
    initializeAuth: (state) => {
      const token = getToken();
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
        // Admin info will be null until we have a way to fetch it
        // This is fine for basic authentication checks
      }
    },
    logout: (state) => {
      state.token = '';
      state.admin = null;
      state.isAuthenticated = false;
      clearToken();
    },
  },
});

export const { setAuth, initializeAuth, logout } = authSlice.actions;
export default authSlice.reducer;
