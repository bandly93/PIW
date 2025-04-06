const API = import.meta.env.VITE_API_URL;

export interface ApiResponse<T> {
  data: T;
  status: number;
  ok: boolean;
  raw: Response;
}

export const fetchApi = async <T>(
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  url: string,
  body?: any
): Promise<ApiResponse<T>> => {
  const res = await fetch(`${API}${url}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  return {
    data,
    status: res.status,
    ok: res.ok,
    raw: res,
  };
};
