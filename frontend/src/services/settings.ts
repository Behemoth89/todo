import { request } from './api'

export const settingsApi = {
  getFamilyMembers: () => 
    request<{ id: string; name: string }[]>('/settings/family-members'),
  
  addFamilyMember: (name: string) =>
    request<{ id: string; name: string }>('/settings/family-members', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  
  updateFamilyMember: (id: string, name: string) =>
    request<{ id: string; name: string }>(`/settings/family-members/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  
  deleteFamilyMember: (id: string) =>
    request<void>(`/settings/family-members/${id}`, { method: 'DELETE' }),
  
  getLocations: () =>
    request<{ id: string; name: string }[]>('/settings/locations'),
  
  addLocation: (name: string) =>
    request<{ id: string; name: string }>('/settings/locations', {
      method: 'POST',
      body: JSON.stringify({ name }),
    }),
  
  updateLocation: (id: string, name: string) =>
    request<{ id: string; name: string }>(`/settings/locations/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ name }),
    }),
  
  deleteLocation: (id: string) =>
    request<void>(`/settings/locations/${id}`, { method: 'DELETE' }),
  
  getPriorities: () =>
    request<{ id: string; name: string }[]>('/settings/priorities'),
}