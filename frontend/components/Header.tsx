import React from 'react';
import { Icon } from './Icon';
import { useCartStore } from '../stores/useCartStore';
import { useAppStore } from '../stores/useAppStore';

export const Header: React.FC = () => {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));

  const searchTerm = useAppStore((state) => state.searchTerm);
  const setSearchTerm = useAppStore((state) => state.setSearchTerm);

  return (
    <header className="bg-background/80 backdrop-blur-lg h-20 flex-shrink-0 flex items-center justify-between px-8 border-b">
      <div className="relative w-full max-w-md">
        <Icon name="fa-solid fa-search" className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full bg-muted h-12 pl-12 pr-4 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-6">
        <button onClick={() => toggleCart(true)} className="relative text-muted-foreground hover:text-primary transition-colors">
          <Icon name="fa-solid fa-shopping-cart" className="text-2xl" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-background">
              {cartItemCount}
            </span>
          )}
        </button>
        <div className="w-12 h-12 rounded-full bg-muted overflow-hidden">
          <img
            src="https://picsum.photos/seed/avatar/100/100"
            alt="User Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
