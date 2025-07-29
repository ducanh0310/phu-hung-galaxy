const API_BASE_URL = '/api/v1';

const getToken = () => localStorage.getItem('jwt');

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    localStorage.removeItem('jwt');
    // Use replace to prevent user from navigating back to the unauthorized page
    window.location.replace('/admin/login');
    throw new Error('Unauthorized');
  }

  if (!response.ok && response.status !== 204) {
    // Try to parse error message from response body, otherwise use status text
    const errorData = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(errorData.message || 'An API error occurred');
  }

  // For 204 No Content, return null as there is no body to parse
  if (response.status === 204) {
    return null;
  }

  return response.json();
};

const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  return handleResponse(response);
};

export const api = {
  get: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return request(endpoint, { ...options, method: 'GET' });
  },
  post: <T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> => {
    return request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },
  put: <T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> => {
    return request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return request(endpoint, { ...options, method: 'DELETE' });
  },
  postFormData: async <T>(endpoint: string, formData: FormData, options?: RequestInit): Promise<T> => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    const response = await fetch(`${API_BASE_URL}${endpoint}`, { method: 'POST', body: formData, ...options, headers });
    return handleResponse(response);
  },
};