import { request } from './api'

export const authApi = {
  login: (email: string, password: string) =>
    request<{ token: string; user: { id: string; email: string; name: string } }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  
  register: (email: string, password: string, name: string) =>
    request<{ token: string; user: { id: string; email: string; name: string } }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    }),
  
  refresh: () =>
    request<{ token: string }>('/auth/refresh', { method: 'POST' }),
  
  logout: () =>
    request<void>('/auth/logout', { method: 'POST' }),
}