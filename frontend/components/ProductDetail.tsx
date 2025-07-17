import React, { useEffect, useState } from 'react';
import { Link, useOutletContext, useParams } from 'react-router-dom';
import { Product } from '../../shared/types';
import { Icon } from './Icon';
import { Breadcrumbs } from './Breadcrumbs';

// Define the type for the context from MainLayout
type OutletContextType = {
  addToCart: (product: Product) => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useOutletContext<OutletContextType>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/v1/products/${id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Sản phẩm không tồn tại.');
          }
          throw new Error('Không thể tải dữ liệu sản phẩm.');
        }
        const data: Product = await response.json();
        setProduct(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Đã xảy ra lỗi không mong muốn.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-xl text-slate-500">Đang tải chi tiết sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-500">
        <p className="text-xl">{error}</p>
        <Link to="/" className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700">
          Về trang chủ
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-xl text-slate-500">Không tìm thấy sản phẩm.</p>
      </div>
    );
  }

  const breadcrumbItems: Array<{label: string, href?: string}> = [{ label: 'Trang chủ', href: '/' }];
  if (product.subcategory?.category) {
    breadcrumbItems.push({ label: product.subcategory.category.name });
  }
  if (product.subcategory) {
    breadcrumbItems.push({
      label: product.subcategory.name,
      href: `/?subcategory=${product.subcategoryId}`,
    });
  }
  breadcrumbItems.push({ label: product.name });

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12">
        <div className="rounded-xl overflow-hidden shadow-md">
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover aspect-square" />
        </div>

        <div className="flex flex-col">
          <Breadcrumbs items={breadcrumbItems} />
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">{product.name}</h1>
          <p className="text-3xl font-bold text-green-600 mb-6">{formatPrice(product.price)}</p>
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-700 mb-2">Mô tả sản phẩm</h2>
            <p className="text-slate-600 leading-relaxed">{product.description}</p>
          </div>
          <div className="mt-auto">
            <button onClick={() => addToCart(product)} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-green-300 flex items-center justify-center gap-3">
              <Icon name="fa-solid fa-shopping-cart" />
              <span>Thêm vào giỏ hàng</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}; 