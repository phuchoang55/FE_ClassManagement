import api from '@/lib/api';
import { LoginRequest, LoginResponse } from '@/types';

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data).then((r) => r.data),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};
