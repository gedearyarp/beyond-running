import axios from 'axios';
import { SignupInput } from '@/types/api';
import { supabase } from '@/lib/supabase';

if (!process.env.NEXT_PUBLIC_API_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_API_URL');
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add a response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');

        const response = await api.post('/api/auth/refresh-token', {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data.data;
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Auth endpoints
export const authApi = {
  signup: async (data: SignupInput) => {
    const response = await api.post('/api/auth/signup', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    // First, get the basic auth data
    const response = await api.post('/api/auth/login', data);
    const { accessToken, refreshToken, user: basicUser } = response.data.data;
    
    // Fetch complete user data from Supabase
    const { data: userData, error: supabaseError } = await supabase
      .from('users')
      .select('*')
      .eq('id', basicUser.id)
      .single();

    if (supabaseError) {
      throw supabaseError;
    }

    // Combine basic user data with Supabase data
    const completeUser = {
      ...basicUser,
      ...userData
    };
    
    // Store complete data in localStorage
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(completeUser));
    
    return {
      ...response.data,
      data: {
        ...response.data.data,
        user: completeUser
      }
    };
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
  },

  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/api/auth/refresh-token', { refreshToken });
    return response.data;
  },
};

export default api; 