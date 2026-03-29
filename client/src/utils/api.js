const BASE = '/api';

const request = async (method, path, body, token) => {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Request failed');
  return data;
};

export const api = {
  get:    (path, token)        => request('GET', path, null, token),
  post:   (path, body, token)  => request('POST', path, body, token),
  delete: (path, token)        => request('DELETE', path, null, token),
};
