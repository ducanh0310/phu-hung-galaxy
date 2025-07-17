import React from 'react';
import { Product } from '../../shared/types';
import { Icon } from './Icon';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  const handleAddToCartClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onAddToCart(product);
  };

  return (
    <Link
      to={`/products/${product.id}`}
      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col"
    >
      <div className="overflow-hidden relative">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-slate-800 truncate mb-1" title={product.name}>
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 flex-grow mb-4">{product.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <p className="text-xl font-bold text-green-600">{formatPrice(product.price)}</p>
          <button
            onClick={handleAddToCartClick}
            className="bg-green-500 text-white rounded-full h-11 w-11 flex items-center justify-center group-hover:bg-green-600 transition-colors duration-300 transform group-hover:scale-110 z-10"
            aria-label={`Thêm ${product.name} vào giỏ hàng`}
          >
            <Icon name="fa-solid fa-plus" />
          </button>
        </div>
      </div>
    </Link>
  );
};
