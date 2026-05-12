import api, { handleApiError } from './api';

export async function getListings(params = {}) {
  try {
    const { data } = await api.get('/listings', { params });
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getListingById(id) {
  try {
    const { data } = await api.get(`/listings/${id}`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function createListing(payload) {
  try {
    const { data } = await api.post('/listings', payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateListing(id, payload) {
  try {
    const { data } = await api.put(`/listings/${id}`, payload, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteListing(id) {
  try {
    const { data } = await api.delete(`/listings/${id}`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getListingsByUser(userId) {
  try {
    const { data } = await api.get(`/listings/user/${userId}`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}
