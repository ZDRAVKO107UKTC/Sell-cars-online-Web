import api, { handleApiError } from './api';

export async function registerUser(payload) {
  try {
    const { data } = await api.post('/auth/register', payload);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function loginUser(payload) {
  try {
    const { data } = await api.post('/auth/login', payload);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await api.get('/auth/me');
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateCurrentUser(payload) {
  try {
    const { data } = await api.put('/auth/me', payload);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}
