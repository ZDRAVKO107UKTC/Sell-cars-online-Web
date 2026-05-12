import api, { handleApiError } from './api';

export async function getCars(params = {}) {
  try {
    const { data } = await api.get('/cars', { params });
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getMakes() {
  try {
    const { data } = await api.get('/cars/makes');
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getModels(make) {
  try {
    const { data } = await api.get('/cars/models', {
      params: { make },
    });
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function createCar(payload) {
  try {
    const { data } = await api.post('/cars', payload);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}
