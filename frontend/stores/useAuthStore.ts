import { create } from 'zustand';
import { User } from '../../shared/types';

// atob is deprecated in Node.js but fine in browsers.
const decodeToken = (token: string): User | null => {
  try {
    const payloadBase64 = token.split('.')[1];
    if (!payloadBase64) return null;
    const decodedJson = atob(payloadBase64);
    const decoded = JSON.parse(decodedJson);
    // Check for expected fields and expiration
    if (decoded.id && decoded.email && decoded.name && decoded.exp * 1000 > Date.now()) {
      return {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to decode or token invalid:', error);
    return null;
  }
};

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  token: null,
  user: null,
  isAuthenticated: false,
  setToken: (token: string) => {
    const user = decodeToken(token);
    if (user) {
      localStorage.setItem('user_token', token);
      set({ token, user, isAuthenticated: true });
    } else {
      get().logout();
    }
  },
  logout: () => {
    localStorage.removeItem('user_token');
    set({ token: null, user: null, isAuthenticated: false });
  },
  initialize: () => {
    const token = localStorage.getItem('user_token');
    if (token) {
      const user = decodeToken(token);
      if (user) {
        set({ token, user, isAuthenticated: true });
      } else {
        localStorage.removeItem('user_token');
      }
    }
  },
}));