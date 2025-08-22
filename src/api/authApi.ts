import axios from './axiosInstance';
import { setToken, clearToken } from '../utils/tokenUtils';
import type { AuthResponse,BackendAuthResponse } from '../types/auth';

/**
 * Sends login credentials to the backend and returns the auth response.
 * Stores JWT token in localStorage on success.
 */
// export const loginAdmin = async (
//   email: string,
//   password: string
// ): Promise<AuthResponse> => {
//   const response = await axios.post<BackendAuthResponse>('/api/auth/login', {
//     username: email, // ✅ match backend field
//     password,
//   });

//   const { token, user } = response.data;

//   setToken(token);

//   return {
//     token,
//     admin: user, // ✅ rename user → admin to match AuthResponse
//   };
// };
export const loginAdmin = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post<BackendAuthResponse>('/api/auth/login', {
    username: email,
    password,
  });

  const { token, user } = response.data;

  setToken(token);

  return {
    token,
    admin: user, // ✅ rename user → admin
  };
};


/**
 * Optional: Clears token from localStorage and invalidates session.
 */
export const logoutAdmin = () => {
  clearToken();
};
