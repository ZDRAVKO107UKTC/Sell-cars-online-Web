const fallbackApiUrl = 'http://localhost:5000/api';

export const apiBaseUrl = import.meta.env.VITE_API_URL || fallbackApiUrl;

export const uploadsBaseUrl =
  (import.meta.env.VITE_UPLOADS_URL || apiBaseUrl.replace(/\/api\/?$/, '')).replace(/\/+$/, '');

export const resolveUploadUrl = (value) => {
  if (!value) {
    return '';
  }

  if (/^(https?:)?\/\//i.test(value) || value.startsWith('blob:') || value.startsWith('data:')) {
    return value;
  }

  const normalizedPath = value.startsWith('/') ? value : `/${value}`;
  return `${uploadsBaseUrl}${normalizedPath}`;
};
