import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../Icon.tsx';

// Helper to get JWT token
const getToken = () => localStorage.getItem('jwt');

// Helper for authenticated API calls
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  if (!token) {
    window.location.href = '/admin/login';
    throw new Error('No token found');
  }
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    // Handle unauthorized access, e.g., redirect to login
    localStorage.removeItem('jwt'); // Also clear the invalid token
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!response.ok && response.status !== 204) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An API error occurred');
  }
  return response;
};

interface Stats {
  products: number;
  categories: number;
  subcategories: number;
}

const StatCard = ({ title, value, iconName }: { title: string; value: number; iconName: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
    <div className="bg-green-100 p-3 rounded-full">
      <Icon name={iconName} className="text-2xl text-green-600" />
    </div>
    <div>
      <p className="text-sm text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
  </div>
);

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await fetchWithAuth('/api/v1/admin/dashboard/stats');
        const data = await response.json();
        setStats(data);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    getStats();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">Logout</button>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {isLoading && <p>Loading dashboard...</p>}
        {error && <p className="text-red-500">Error: {error}</p>}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Products" value={stats.products} iconName="fa-solid fa-cookie-bite" />
            <StatCard title="Total Categories" value={stats.categories} iconName="fa-solid fa-utensils" />
            <StatCard title="Total Subcategories" value={stats.subcategories} iconName="fa-solid fa-seedling" />
          </div>
        )}

        <nav className="mt-10 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Management Links</h2>
          <ul className="space-y-3">
            <li><Link to="/admin/products" className="text-green-600 hover:underline font-medium">Manage Products</Link></li>
            <li><Link to="/admin/categories" className="text-green-600 hover:underline font-medium">Manage Categories</Link></li>
          </ul>
        </nav>
      </main>
    </div>
  );
} 