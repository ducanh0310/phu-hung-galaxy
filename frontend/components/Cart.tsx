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
        <h4 className="font-semibold text-sm text-slate-800">{item.name}</h4>
        <p className="text-green-600 font-medium text-sm">{formatPrice(item.price)}</p>
      </div>
      <div className="flex items-center gap-2 border border-slate-200 rounded-full p-1">
        <button
          onClick={() => updateQuantity(item.id, item.quantity - 1)}
          className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-500"
        >
          -
        </button>
        <span className="w-6 text-center font-medium text-sm">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.id, item.quantity + 1)}
          className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-500"
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
        className={`fixed inset-0 bg-black/30 z-40 transition-opacity ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => toggleCart(false)}
      ></div>
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-6 border-b border-slate-200">
            <h2 className="text-xl font-bold">Giỏ Hàng Của Bạn</h2>
            <button onClick={() => toggleCart(false)} className="text-slate-500 hover:text-slate-800 transition-colors">
              <Icon name="fa-solid fa-times" className="text-2xl" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto px-6">
            {items.length === 0 ? (
              <div className="text-center py-20">
                <Icon name="fa-solid fa-dolly" className="text-6xl text-slate-300 mb-4" />
                <p className="text-slate-500">Giỏ hàng của bạn đang trống.</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {items.map((item) => (
                  <CartLineItem key={item.id} item={item} />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <footer className="p-6 border-t border-slate-200 bg-slate-50">
              <div className="flex justify-between items-center mb-4">
                <span className="text-slate-600">Tổng cộng:</span>
                <span className="text-2xl font-bold text-slate-800">{formatPrice(totalPrice)}</span>
              </div>
              <button className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-300">
                Tiến Hành Thanh Toán
              </button>
            </footer>
          )}
        </div>
      </div>
    </>
  );
};
