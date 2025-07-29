import React from 'react';
import { ProductCard } from './ProductCard';
import { AnimatedElement } from './AnimatedElement';
import { useAppStore } from '../stores/useAppStore';

export const ProductGrid: React.FC = () => {
  const products = useAppStore((state) => state.products);

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
          <ProductCard product={product} />
        </AnimatedElement>
      ))}
    </div>
  );
};
