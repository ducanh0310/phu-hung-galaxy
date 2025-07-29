import { create } from 'zustand';
import { CartItem, Product } from '../../shared/types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  toggleCart: (open?: boolean) => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  isOpen: false,
  addToCart: (product) => {
    const { items } = get();
    const existingItem = items.find((item) => item.id === product.id);
    let newItems;
    if (existingItem) {
      newItems = items.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
      );
    } else {
      newItems = [...items, { ...product, quantity: 1 }];
    }
    set({ items: newItems, isOpen: true });
  },
  updateQuantity: (productId, quantity) => {
    const { items } = get();
    let newItems;
    if (quantity <= 0) {
      newItems = items.filter((item) => item.id !== productId);
    } else {
      newItems = items.map((item) => (item.id === productId ? { ...item, quantity } : item));
    }
    set({ items: newItems });
  },
  toggleCart: (open) => {
    set((state) => ({ isOpen: open !== undefined ? open : !state.isOpen }));
  },
}));