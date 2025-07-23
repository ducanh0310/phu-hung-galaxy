import { Routes, Route, useOutletContext } from 'react-router-dom';
import MainLayout from './components/MainLayout.tsx';
import { ProductGrid } from './components/ProductGrid';
import { Product } from '../shared/types';
import { ProductDetail } from './components/ProductDetail';
import LoginPage from './components/admin/LoginPage';
import CategoryManagementPage from './components/admin/CategoryManagementPage.tsx';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import ProductManagementPage from './components/admin/ProductManagementPage';

type OutletContextType = {
  products: Product[];
  addToCart: (product: Product) => void;
  isLoadingProducts: boolean;
};

const HomePage = () => {
  const { products, addToCart, isLoadingProducts } = useOutletContext<OutletContextType>();
  
  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-slate-500">Đang tải sản phẩm...</div>
      </div>
    );
      }
  
  return <ProductGrid products={products} onAddToCart={addToCart} />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetail />} />
      </Route>
      <Route path="/admin/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
      <Route path="/admin/products" element={<ProductManagementPage />} />
      <Route path="/admin/categories" element={<CategoryManagementPage />} />
    </Routes>
  );
}
