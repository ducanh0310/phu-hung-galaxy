import { useState, useMemo, useCallback, useEffect } from 'react';
import { Outlet, useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Cart } from './Cart';
import { Product, CartItem, Subcategory, Category } from '../../shared/types';
import Footer from './Footer';

export default function MainLayout() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const selectedSubcategoryId = useMemo(() => searchParams.get('subcategory'), [searchParams]);

  const selectedSubcategory = useMemo(() => {
    if (!selectedSubcategoryId || categories.length === 0) return null;
    for (const category of categories) {
      const sub = category.subcategories.find((s) => s.id === selectedSubcategoryId);
      if (sub) return sub;
    }
    return null;
  }, [categories, selectedSubcategoryId]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/v1/categories');
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filter or search term changes
  useEffect(() => {
    const fetchProducts = async () => {
      // Only fetch products when on homepage to avoid flashing when navigating from other pages
      if (location.pathname !== '/') {
        return;
      }

      // Skip if we have selectedSubcategoryId but no matching selectedSubcategory yet
      // This prevents fetching all products while categories are still loading
      if (selectedSubcategoryId && !selectedSubcategory && categories.length > 0) {
        return;
      }

      setIsLoadingProducts(true);
      const params = new URLSearchParams();
      if (selectedSubcategoryId) {
        params.append('subcategory', selectedSubcategoryId);
      }
      if (searchTerm.trim()) {
        params.append('q', searchTerm.trim());
      }

      try {
        const response = await fetch(`/api/v1/products?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    // Debounce search to avoid excessive API calls
    const timerId = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timerId);
  }, [selectedSubcategoryId, selectedSubcategory, searchTerm, categories.length, location.pathname]);

  const handleSelectSubcategory = useCallback((subcategory: Subcategory | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (subcategory) {
      newSearchParams.set('subcategory', subcategory.id);
    } else {
      newSearchParams.delete('subcategory');
    }

    if (location.pathname !== '/') {
      // Clear products and set loading when navigating from other pages
      setProducts([]);
      setIsLoadingProducts(true);
      navigate({ pathname: '/', search: newSearchParams.toString() });
    } else {
      setSearchParams(newSearchParams);
    }
  }, [searchParams, setSearchParams, navigate, location.pathname]);

  const addToCart = useCallback((product: Product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== productId);
      }
      return prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item));
    });
  }, []);

  const cartTotalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="flex h-screen font-sans text-slate-800">
      <Sidebar
        categories={categories}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={handleSelectSubcategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onCartClick={() => setIsCartOpen(true)}
          cartItemCount={cartTotalItems}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main className="flex-1 overflow-y-auto bg-slate-100">
          <div className="p-4 md:p-8 min-h-full flex flex-col">
            <div className="flex-1">
              <Outlet context={{ products, addToCart, isLoadingProducts }} />
            </div>
            <Footer />
          </div>
        </main>
      </div>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onUpdateQuantity={updateQuantity} />
    </div>
  );
} 