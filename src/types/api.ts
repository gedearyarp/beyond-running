export interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface AuthResponse {
  status: 'success' | 'error';
  message: string;
  data: User;
}

export interface LoginResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: User;
  };
}

export interface RefreshTokenResponse {
  status: 'success' | 'error';
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface SignupInput {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
} 