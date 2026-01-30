export interface User {
  id: string;
  email: string;
  nombre: string;
  role: 'admin' | 'vendedor';
  rut?: string;
  isActive?: boolean;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface RefreshTokenResponse {
  access_token: string;
  expires_in: number;
  user: User;
}

export interface TokenInfo {
  expires_in: number;
}
