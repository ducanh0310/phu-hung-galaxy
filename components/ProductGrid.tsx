import React from 'react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';
import { AnimatedElement } from './AnimatedElement';
import { Icon } from './Icon';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  loading: boolean;
  error: string | null;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart, loading, error }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
            <div className="h-56 bg-slate-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-slate-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-200 rounded w-full mb-4"></div>
            <div className="flex justify-between items-center">
              <div className="h-8 bg-slate-200 rounded w-1/3"></div>
              <div className="h-11 w-11 bg-slate-200 rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <AnimatedElement>
        <div className="text-center py-20 bg-red-50 p-8 rounded-lg">
          <Icon name="fa-solid fa-exclamation-circle" className="text-4xl text-red-500 mb-4" />
          <p className="text-xl text-red-700">Đã xảy ra lỗi khi tải sản phẩm.</p>
          <p className="text-slate-500 mt-2">{error}</p>
        </div>
      </AnimatedElement>
    );
  }

  if (products.length === 0) {
    return (
        <AnimatedElement>
            <div className="text-center py-20">
                <p className="text-xl text-slate-500">Không tìm thấy sản phẩm nào.</p>
            </div>
        </AnimatedElement>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <AnimatedElement key={product.id} delay={`delay-${(index % 4) * 100}`}>
          <ProductCard product={product} onAddToCart={onAddToCart} />
        </AnimatedElement>
      ))}
    </div>
  );
};
