import { create } from 'zustand';
import { CartItem as FrontendCartItem, Product } from '../../shared/types';
import { api } from '../lib/api';
import { useAuthStore } from './useAuthStore';

// The cart object from the backend
interface BackendCart {
  id: string;
  userId: string;
  items: BackendCartItem[];
}

// A single item from the backend cart
interface BackendCartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

// Helper to transform backend items to frontend format
const transformCartItems = (items: BackendCartItem[]): FrontendCartItem[] => {
  if (!items) return [];
  return items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
  }));
};

interface CartState {
  items: FrontendCartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (product: Product, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => void; // For after checkout
  resetCart: () => void; // For logout
  syncCart: () => Promise<void>; // For login

  toggleCart: (open?: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  isLoading: false,
  error: null,

  fetchCart: async () => {
    if (!useAuthStore.getState().isAuthenticated) return;
    set({ isLoading: true, error: null });
    try {
      const cart = await api.get<BackendCart>('/cart');
      set({ items: transformCartItems(cart.items), isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ error: 'Failed to fetch cart', isLoading: false });
    }
  },

  addToCart: async (product, quantity = 1) => {
    const { isAuthenticated } = useAuthStore.getState();
    if (isAuthenticated) {
      set({ isLoading: true });
      try {
        await api.post('/cart/items', { productId: product.id, quantity });
        await get().fetchCart();
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        set({ error: 'Failed to add item', isLoading: false });
      }
    } else {
      const { items } = get();
      const existingItem = items.find((item) => item.id === product.id);
      const newItems = existingItem
        ? items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
        : [...items, { ...product, quantity }];
      set({ items: newItems });
    }
    set({ isOpen: true });
  },

  updateQuantity: async (productId, quantity) => {
    if (quantity <= 0) {
      await get().removeItem(productId);
      return;
    }
    if (useAuthStore.getState().isAuthenticated) {
      set({ isLoading: true });
      try {
        await api.put(`/cart/items/${productId}`, { quantity });
        await get().fetchCart();
      } catch (error) {
        console.error('Failed to update quantity:', error);
        set({ error: 'Failed to update quantity', isLoading: false });
      }
    } else {
      set((state) => ({
        items: state.items.map((item) => (item.id === productId ? { ...item, quantity } : item)),
      }));
    }
  },

  removeItem: async (productId) => {
    if (useAuthStore.getState().isAuthenticated) {
      set({ isLoading: true });
      try {
        await api.delete(`/cart/items/${productId}`);
        await get().fetchCart();
      } catch (error) {
        console.error('Failed to remove item:', error);
        set({ error: 'Failed to remove item', isLoading: false });
      }
    } else {
      set((state) => ({ items: state.items.filter((item) => item.id !== productId) }));
    }
  },

  clearCart: () => set({ items: [] }),
  resetCart: () => set({ items: [], isLoading: false, error: null, isOpen: false }),

  syncCart: async () => {
    const { items: localItems } = get();
    if (localItems.length > 0) {
      set({ isLoading: true });
      for (const item of localItems) {
        await api.post('/cart/items', { productId: item.id, quantity: item.quantity });
      }
    }
    await get().fetchCart();
  },

  toggleCart: (open) => {
    set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen }));
  },
}));