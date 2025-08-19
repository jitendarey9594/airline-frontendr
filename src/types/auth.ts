export interface Admin {
  username: string;
  role: 'admin' | 'staff';
}

export interface AuthResponse {
  token: string;
  admin: Admin;
}

export interface AuthState {
  token: string;
  isAuthenticated: boolean;
  admin: Admin | null;
}

export interface BackendAuthResponse {
  token: string;
  user: Admin;
}
