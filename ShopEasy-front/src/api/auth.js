import { apiRequest } from './client'

export const authApi = {
  register: (payload) =>
    apiRequest('/auth/users/', { method: 'POST', body: payload }),
  login: (payload) =>
    apiRequest('/auth/jwt/create/', { method: 'POST', body: payload }),
  refresh: (payload) =>
    apiRequest('/auth/jwt/refresh/', { method: 'POST', body: payload }),
  verify: (payload) =>
    apiRequest('/auth/jwt/verify/', { method: 'POST', body: payload }),
  me: (token) => apiRequest('/auth/users/me/', { token }),
}
