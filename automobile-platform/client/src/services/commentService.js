import api, { handleApiError } from './api';

export async function getListingComments(listingId) {
  try {
    const { data } = await api.get(`/listings/${listingId}/comments`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function createComment(listingId, payload) {
  try {
    const { data } = await api.post(`/listings/${listingId}/comments`, payload);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function updateComment(commentId, payload) {
  try {
    const { data } = await api.put(`/comments/${commentId}`, payload);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function deleteComment(commentId) {
  try {
    const { data } = await api.delete(`/comments/${commentId}`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function likeComment(commentId) {
  try {
    const { data } = await api.post(`/comments/${commentId}/like`);
    return data;
  } catch (error) {
    handleApiError(error);
  }
}

export async function getAllComments() {
  try {
    const { data } = await api.get('/comments');
    return data;
  } catch (error) {
    handleApiError(error);
  }
}
