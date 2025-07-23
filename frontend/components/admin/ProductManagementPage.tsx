import { useState, useEffect, useCallback } from 'react';
import { Product } from '../../../shared/types';
import ProductForm from './ProductForm.tsx';
import { Link } from 'react-router-dom';

// Helper to get JWT token
const getToken = () => localStorage.getItem('jwt');

// Helper for authenticated API calls
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getToken();
  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    // Handle unauthorized access, e.g., redirect to login
    localStorage.removeItem('jwt');
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  if (!response.ok && response.status !== 204) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An API error occurred');
  }
  return response;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function ProductManagementPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchWithAuth('/api/v1/admin/products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleAddNew = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetchWithAuth(`/api/v1/admin/products/${productId}`, { method: 'DELETE' });
        // Refresh product list on success
        fetchProducts();
      } catch (err) {
        if (err instanceof Error) alert(`Failed to delete: ${err.message}`);
      }
    }
  };

  const handleSave = () => {
    setIsModalOpen(false);
    fetchProducts(); // Refresh list after save
  };

  if (isLoading) return <div className="p-8">Loading products...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Product Management</h1>
            <p className="mt-1 text-sm text-slate-600">A list of all the products in your store.</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 flex-shrink-0">
            <button type="button" onClick={handleAddNew} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">Add new product</button>
          </div>
        </div>
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-slate-300">
                  <thead className="bg-slate-100">
                    <tr>
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-900 sm:pl-6">Name</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Subcategory</th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">Price</th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-slate-900 sm:pl-6">{product.name}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{product.subcategory?.name || 'N/A'}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-slate-500">{formatPrice(product.price)}</td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button onClick={() => handleEdit(product)} className="text-green-600 hover:text-green-900">Edit</button>
                          <button onClick={() => handleDelete(product.id)} className="ml-4 text-red-600 hover:text-red-900">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <Link to="/admin/dashboard" className="text-green-600 hover:underline">← Back to Dashboard</Link>
        </div>
      </div>
      {isModalOpen && (
        <ProductForm 
          productToEdit={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSave} 
          fetchWithAuth={fetchWithAuth} 
        />
      )}
    </div>
  );
} 