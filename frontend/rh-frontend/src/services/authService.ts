import { api } from './api';
import type { AuthResponseDto } from '../types/api';

export const authService = {
  async login(credentials: { email: string; password: string }): Promise<AuthResponseDto> {
    try {
      const response = await api.login(credentials);

      if (
        response.status === 200 &&
        response.data &&
        typeof response.data.token === 'string' &&
        response.data.token.trim() &&
        typeof response.data.email === 'string' &&
        response.data.email.trim() &&
        typeof response.data.role === 'string' &&
        response.data.role.trim()
      ) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('email', response.data.email);
        localStorage.setItem('role', response.data.role);
        return response.data;
      } else {
        authService.logout();
        throw new Error('Login failed: Invalid server response.');
      }
    } catch (err: any) {
      authService.logout();
      const message = err.response?.data?.message || err.message || 'Invalid credentials';
      throw new Error(message);
    }
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    localStorage.removeItem('role');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getRole(): string | null {
    return localStorage.getItem('role');
  },

  isAuthenticated(): boolean {
    const token = authService.getToken();
    if (!token) return false;

    try {
      const payload = token.split('.')[1];
      if (!payload) return false;
      const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
      const paddedPayload = normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '=');
      const claims = JSON.parse(atob(paddedPayload));
      return typeof claims.exp === 'number' && claims.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },
};
