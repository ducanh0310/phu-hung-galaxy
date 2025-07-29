import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/MainLayout';
import { ProductGrid } from './components/ProductGrid';
import { Product } from '../shared/types';
import { ProductDetail } from './components/ProductDetail';
import LoginPage from './components/admin/LoginPage';
import CategoryManagementPage from './components/admin/CategoryManagementPage.tsx';
import AdminDashboardPage from './components/admin/AdminDashboardPage';
import ProductManagementPage from './components/admin/ProductManagementPage';
import AdminLayout from './components/admin/AdminLayout.tsx';
import AdminProtectedRoute from './components/admin/AdminProtectedRoute.tsx';
import { useAppStore } from './stores/useAppStore';

const HomePage = () => {
  const isLoadingProducts = useAppStore((state) => state.isLoadingProducts);

  if (isLoadingProducts) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg text-slate-500">Đang tải sản phẩm...</div>
      </div>
    );
  }

  return <ProductGrid />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products/:id" element={<ProductDetail />} />
      </Route>

      <Route path="/admin/login" element={<LoginPage />} />
      <Route element={<AdminProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/products" element={<ProductManagementPage />} />
          <Route path="/admin/categories" element={<CategoryManagementPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
