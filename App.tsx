import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { Product, CartItem, Subcategory, Category } from './types';

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [loading, setLoading] = useState({ categories: true, products: true });
  const [error, setError] = useState<{ categories: string | null; products: string | null }>({ categories: null, products: null });

  const API_BASE_URL = 'http://localhost:8000/api';

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading({ categories: true, products: true });
      try {
        const [categoriesResponse, productsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/categories`),
          fetch(`${API_BASE_URL}/products`)
        ]);

        if (!categoriesResponse.ok) {
          throw new Error(`Lỗi tải danh mục: ${categoriesResponse.status}`);
        }
        const categoriesData = await categoriesResponse.json();
        setCategories(categoriesData);
        setError(prev => ({ ...prev, categories: null }));

        if (!productsResponse.ok) {
          throw new Error(`Lỗi tải sản phẩm: ${productsResponse.status}`);
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
        setError(prev => ({ ...prev, products: null }));
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Đã có lỗi xảy ra';
        setError({ categories: errorMessage, products: errorMessage });
      } finally {
        setLoading({ categories: false, products: false });
      }
    };

    fetchInitialData();
  }, []);

  const handleSelectSubcategory = useCallback((subcategory: Subcategory | null) => {
    setSelectedSubcategory(subcategory);
    const fetchProducts = async () => {
      setLoading(prev => ({ ...prev, products: true }));
      setError(prev => ({...prev, products: null}));
      try {
        const url = subcategory
          ? `${API_BASE_URL}/products?subcategory=${subcategory.id}`
          : `${API_BASE_URL}/products`;
        const response = await fetch(url);
        if (!response.ok) {
           throw new Error(`Lỗi mạng: ${response.status}`);
        }
        const data = await response.json();
        setProducts(data);
      } catch (e) {
        const errorMessage = e instanceof Error ? e.message : 'Lỗi tải sản phẩm';
        setError(prev => ({ ...prev, products: errorMessage }));
      } finally {
        setLoading(prev => ({ ...prev, products: false }));
      }
    };
    fetchProducts();
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  }, []);

  const updateCartItemQuantity = useCallback((productId: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
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
        loading={loading.categories}
        error={error.categories}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onCartClick={() => setIsCartOpen(true)} cartItemCount={cartTotalItems} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100">
           <ProductGrid
             products={products}
             onAddToCart={addToCart}
             loading={loading.products}
             error={error.products}
            />
        </main>
      </div>
      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={removeFromCart}
        onUpdateQuantity={updateCartItemQuantity}
      />
    </div>
  );
}
