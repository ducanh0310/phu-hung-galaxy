
import React, { useState, useMemo, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ProductGrid } from './components/ProductGrid';
import { Cart } from './components/Cart';
import { CATEGORIES, PRODUCTS } from './constants';
import { Product, CartItem, Subcategory } from './types';

export default function App() {
  const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  const filteredProducts = useMemo(() => {
    if (!selectedSubcategory) {
      return PRODUCTS;
    }
    return PRODUCTS.filter(p => p.subcategory === selectedSubcategory.id);
  }, [selectedSubcategory]);

  const cartTotalItems = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  return (
    <div className="flex h-screen font-sans text-slate-800">
      <Sidebar
        categories={CATEGORIES}
        selectedSubcategory={selectedSubcategory}
        onSelectSubcategory={handleSelectSubcategory}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onCartClick={() => setIsCartOpen(true)} cartItemCount={cartTotalItems} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-100">
           <ProductGrid products={filteredProducts} onAddToCart={addToCart} />
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
