import { create } from 'zustand';
import { Category, Product, Subcategory } from '../../shared/types';
import { api } from '../lib/api';

interface AppState {
  products: Product[];
  categories: Category[];
  searchTerm: string;
  selectedSubcategoryId: string | null;
  isLoadingProducts: boolean;
  isLoadingCategories: boolean;
  error: string | null;

  setSearchTerm: (term: string) => void;
  selectSubcategory: (subcategoryId: string | null) => void;
  fetchCategories: () => Promise<void>;
  fetchProducts: () => Promise<void>;

  // Getter for selected subcategory object
  getSelectedSubcategory: () => Subcategory | null;
}

export const useAppStore = create<AppState>((set, get) => ({
  products: [],
  categories: [],
  searchTerm: '',
  selectedSubcategoryId: null,
  isLoadingProducts: false,
  isLoadingCategories: false,
  error: null,

  setSearchTerm: (term) => set({ searchTerm: term }),
  selectSubcategory: (subcategoryId) => set({ selectedSubcategoryId: subcategoryId }),

  fetchCategories: async () => {
    set({ isLoadingCategories: true, error: null });
    try {
      const data = await api.get<Category[]>('/categories');
      set({ categories: data, isLoadingCategories: false });
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      set({ error: 'Failed to fetch categories', isLoadingCategories: false });
    }
  },

  fetchProducts: async () => {
    const { selectedSubcategoryId, searchTerm } = get();
    set({ isLoadingProducts: true, error: null });

    const params = new URLSearchParams();
    if (selectedSubcategoryId) {
      params.append('subcategory', selectedSubcategoryId);
    }
    if (searchTerm.trim()) {
      params.append('q', searchTerm.trim());
    }

    try {
      const data = await api.get<Product[]>(`/products?${params.toString()}`);
      set({ products: data, isLoadingProducts: false });
    } catch (error) {
      console.error('Failed to fetch products:', error);
      set({ error: 'Failed to fetch products', isLoadingProducts: false });
    }
  },

  getSelectedSubcategory: () => {
    const { categories, selectedSubcategoryId } = get();
    if (!selectedSubcategoryId) return null;
    for (const category of categories) {
      const sub = category.subcategories.find((s) => s.id === selectedSubcategoryId);
      if (sub) return sub;
    }
    return null;
  },
}));