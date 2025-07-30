import React from 'react';
import { Icon } from './Icon';
import { useCartStore } from '../stores/useCartStore';
import { useAppStore } from '../stores/useAppStore';
import { useAuthStore } from '../stores/useAuthStore.ts';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { User as UserIcon, LogOut, Package } from 'lucide-react';

export const Header: React.FC = () => {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const cartItemCount = useCartStore((state) => state.items.reduce((total, item) => total + item.quantity, 0));
  const searchTerm = useAppStore((state) => state.searchTerm);
  const setSearchTerm = useAppStore((state) => state.setSearchTerm);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

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
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <UserIcon className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="font-semibold">{user.name}</DropdownMenuItem>
              <DropdownMenuItem disabled>{user.email}</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/orders')}>
                <Package className="mr-2 h-4 w-4" />
                <span>Lịch sử đơn hàng</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => logout()}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link to="/login">Đăng nhập</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Đăng ký</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
