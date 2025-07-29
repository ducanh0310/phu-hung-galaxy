import { useEffect } from 'react';
import { Outlet, useLocation, useSearchParams } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Cart } from './Cart';
import Footer from './Footer';
import { useAppStore } from '../stores/useAppStore';

export default function MainLayout() {
  const { searchTerm, selectedSubcategoryId, fetchCategories, fetchProducts, selectSubcategory } = useAppStore();

  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Sync URL search param with state on initial load or URL change
  useEffect(() => {
    const subcategoryIdFromUrl = searchParams.get('subcategory');
    selectSubcategory(subcategoryIdFromUrl);
  }, [searchParams, selectSubcategory]);

  // Fetch products when filters change, with debounce for search term
  useEffect(() => {
    // Debounce search to avoid excessive API calls
    const timerId = setTimeout(() => {
      // Only fetch products when on homepage
      if (location.pathname === '/') {
        fetchProducts();
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [selectedSubcategoryId, searchTerm, location.pathname, fetchProducts]);

  return (
    <div className="flex h-screen font-sans text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-muted">
          <div className="p-4 md:p-8 min-h-full flex flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
      <Cart />
    </div>
  );
}