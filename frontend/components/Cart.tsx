import React, { useMemo } from 'react';
import { CartItem } from '../../shared/types';
import { Icon } from './Icon';
import { useCartStore } from '../stores/useCartStore';

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const CartLineItem: React.FC<{ item: CartItem }> = ({ item }) => {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  return (
    <div className="flex items-center gap-4 py-4">
      <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1">
        <h4 className="font-semibold text-sm text-foreground">{item.name}</h4>
        <p className="text-primary font-medium text-sm">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center gap-2 border rounded-full p-1">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-6 h-6 rounded-full hover:bg-accent text-muted-foreground"
        >
          -
        </button>
        <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-6 h-6 rounded-full hover:bg-accent text-muted-foreground"
        >
          +
        </button>
      </div>
      <p className="w-20 text-right font-semibold text-sm">{formatPrice(item.price * item.quantity)}</p>
    </div>
  );
};

export const Cart: React.FC = () => {
  const isOpen = useCartStore((state) => state.isOpen);
  const items = useCartStore((state) => state.items);
  const toggleCart = useCartStore((state) => state.toggleCart);
  const totalPrice = useMemo(() => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [items]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => toggleCart(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-bold">Giỏ Hàng Của Bạn</h2>
            <button onClick={() => toggleCart(false)} className="text-muted-foreground hover:text-foreground transition-colors">
              <Icon name="fa-solid fa-times" className="text-2xl" />
            </button>
          </header>
 
          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="fa-solid fa-dolly" className="text-6xl text-muted-foreground/30 mb-4" />
                <p className="text-muted-foreground">Giỏ hàng của bạn đang trống.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
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
              <button className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-primary/30">
                Tiến Hành Thanh Toán
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};
