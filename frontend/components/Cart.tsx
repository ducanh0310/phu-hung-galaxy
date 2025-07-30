import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartItem } from '../../shared/types';
import { Icon } from './Icon';
import { useCartStore } from '../stores/useCartStore';
import { Loader2 } from 'lucide-react';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const CartLineItem: React.FC<{ item: CartItem }> = ({ item }) => {
  const { updateQuantity, removeItem } = useCartStore((state) => ({
    updateQuantity: state.updateQuantity,
    removeItem: state.removeItem,
  }));
  return (
    <div className="flex items-center gap-4 py-4">
      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
      </div>
      <div className="flex items-center gap-2 border rounded-full p-1">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity === 1}
          className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <Icon name="fa-solid fa-minus" className="w-3 h-3" />
        </button>
        <span className="text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-6 h-6 flex items-center justify-center rounded-full text-muted-foreground hover:bg-muted"
        >
          <Icon name="fa-solid fa-plus" className="w-3 h-3" />
        </button>
      </div>
      <p className="w-20 text-right font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
      <button
        onClick={() => removeItem(item.id)}
        className="text-muted-foreground hover:text-destructive p-1"
        aria-label={`Remove ${item.name}`}
      >
        <Icon name="fa-solid fa-times" className="w-3 h-3" />
      </button>
    </div>
  );
};

export const Cart: React.FC = () => {
  const { isOpen, items, toggleCart, isLoading } = useCartStore();
  const navigate = useNavigate();

  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  const handleCheckout = () => {
    toggleCart(false);
    navigate('/checkout');
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => toggleCart(false)}
      ></div>
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-lg z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } flex flex-col`}
      >
        <div className="flex flex-col h-full">
          <header className="p-6 border-b flex justify-between items-center">
            <h3 className="text-xl font-bold">Giỏ hàng</h3>
            <button
              onClick={() => toggleCart(false)}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close cart"
            >
              <Icon name="fa-solid fa-times" className="text-2xl" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-background/50 flex items-center justify-center z-10">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            {items.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="fa-solid fa-dolly" className="text-6xl text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
              </div>
            ) : (
              <div>
                {items.map((item) => (
                  <CartLineItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <footer className="p-6 border-t bg-muted">
              <div className="flex justify-between items-center mb-4">
                <span className="text-muted-foreground">Tổng cộng:</span>
                <span className="text-2xl font-bold text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              <button
                onClick={handleCheckout}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/30"
              >
                Tiến Hành Thanh Toán
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};
