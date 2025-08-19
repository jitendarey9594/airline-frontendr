import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import flightReducer from '../features/flights/flightSlice';
import passengerReducer from '../features/passengers/passengerSlice';
import serviceReducer from '../features/services/serviceSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  flights: flightReducer,
  passengers: passengerReducer,
  services: serviceReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
