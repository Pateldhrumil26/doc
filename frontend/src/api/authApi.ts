import axiosClient from './axiosClient.js';
import { AuthResponse, LoginPayload, RegisterPayload, User, UserResponse } from '../types/auth.types.js';

export const authApi = {
  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const res = await axiosClient.post<AuthResponse>('/auth/register', payload);
    return res.data;
  },

  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await axiosClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  getMe: async (): Promise<UserResponse> => {
    const res = await axiosClient.get<UserResponse>('/auth/me');
    return res.data;
  },

  updateProfile: async (payload: Partial<User>): Promise<UserResponse> => {
    const res = await axiosClient.put<UserResponse>('/auth/profile', payload);
    return res.data;
  },
};
