
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { Product, CartItem, Subcategory, Category } from './types';

const API_BASE_URL = 'http://localhost:8000/api/v1';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Category[] = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Fetch products when filter or search term changes
  useEffect(() => {
    const fetchProducts = async () => {
      const params = new URLSearchParams();
      if (selectedSubcategory) {
        params.append('subcategory', selectedSubcategory.id);
      }
      if (searchTerm.trim()) {
        params.append('q', searchTerm.trim());
      }
      
      try {
        const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data: Product[] = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    // Debounce search to avoid excessive API calls
    const timerId = setTimeout(() => {
        fetchProducts();
    }, 300);

    return () => clearTimeout(timerId);
  }, [selectedSubcategory, searchTerm]);

  const handleSelectSubcategory = useCallback((subcategory: Subcategory | null) => {
    setSelectedSubcategory(subcategory);
  }, []);
  
  const addToCart = useCallback((product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems => {
      if (quantity <= 0) {
        return prevItems.filter(item => item.id !== productId);
      }
      return prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      );
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
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100">
           <ProductGrid products={products} onAddToCart={addToCart} />
        </main>
      </div>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
}
