
import React from 'react';
import { Icon } from './Icon';

interface HeaderProps {
  onCartClick: () => void;
  cartItemCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onCartClick, cartItemCount }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg h-20 flex-shrink-0 flex items-center justify-between px-8 border-b border-slate-200">
      <div className="relative w-full max-w-md">
        <Icon name="fa-solid fa-search" className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          className="w-full bg-slate-100 h-12 pl-12 pr-4 rounded-full border border-transparent focus:outline-none focus:ring-2 focus:ring-green-500 transition-shadow"
        />
      </div>
      <div className="flex items-center gap-6">
        <button onClick={onCartClick} className="relative text-slate-600 hover:text-green-600 transition-colors">
          <Icon name="fa-solid fa-shopping-cart" className="text-2xl" />
          {cartItemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center border-2 border-white">
              {cartItemCount}
            </span>
          )}
        </button>
        <div className="w-12 h-12 rounded-full bg-slate-200 overflow-hidden">
             <img src="https://picsum.photos/seed/avatar/100/100" alt="User Avatar" className="w-full h-full object-cover" />
        </div>
      </div>
    </header>
  );
};
