import { logout } from '../store/authSlice'; // or wherever it's defined
import { AppDispatch } from '../store';

export const fetchApi = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body?: any,
  dispatch?: AppDispatch
): Promise<{ data?: T; status: number }> => {
  const API = import.meta.env.VITE_API_URL;

  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  // 🛑 Handle expired token
  if (res.status === 401 && dispatch) {
    dispatch(logout());
    alert('Session expired. Please log in again.');
  }

  const data = await res.json().catch(() => ({}));
  return { data, status: res.status };
};
