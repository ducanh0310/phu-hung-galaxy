const API_BASE_URL = '/api/v1';

const getToken = () => {
  // Prioritize user token for user-facing parts of the app
  const userToken = localStorage.getItem('user_token');
  if (userToken) return userToken;
  // Fallback to admin token for admin panel
  return localStorage.getItem('jwt');
};

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    const onAdminPage = window.location.pathname.startsWith('/admin');
    if (onAdminPage) {
      localStorage.removeItem('jwt');
      window.location.replace('/admin/login');
    } else {
      localStorage.removeItem('user_token');
      window.location.replace('/login');
    }
    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
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

  const data = await response.json();
  return data;
};

const request = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
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
    return request<T>(endpoint, { ...options, method: 'GET' });
  },
  post: <T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },
  put: <T>(endpoint: string, body: unknown, options?: RequestInit): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },
  delete: <T>(endpoint: string, options?: RequestInit): Promise<T> => {
    return request<T>(endpoint, { ...options, method: 'DELETE' });
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