
import React from 'react';
import { Product } from '../../shared/types';
import { ProductCard } from './ProductCard';
import { AnimatedElement } from './AnimatedElement';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ products, onAddToCart }) => {
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
