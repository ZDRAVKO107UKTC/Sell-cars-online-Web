const fallbackApiUrl = 'http://localhost:5000/api';

export const apiBaseUrl = import.meta.env.VITE_API_URL || fallbackApiUrl;

export const uploadsBaseUrl =
  import.meta.env.VITE_UPLOADS_URL || apiBaseUrl.replace(/\/api\/?$/, '');
