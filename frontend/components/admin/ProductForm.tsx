import { useState, useEffect, FormEvent } from 'react';
import { Product, Category } from '../../../shared/types';

interface ProductFormProps {
  productToEdit: Product | null;
  onClose: () => void;
  onSave: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function ProductForm({ productToEdit, onClose, onSave, fetchWithAuth }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: '',
    subcategoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch categories for the dropdown
    const fetchCategories = async () => {
      try {
        // Public route, no auth needed
        const response = await fetch('/api/v1/categories');
        const data = await response.json();
        setCategories(data);
        // If creating a new product, set default subcategory
        if (!productToEdit && data.length > 0 && data[0].subcategories.length > 0) {
          setFormData((prev) => ({ ...prev, subcategoryId: data[0].subcategories[0].id }));
        }
      } catch (err) {
        setError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, [productToEdit]);

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        price: String(productToEdit.price),
        imageUrl: productToEdit.imageUrl,
        description: productToEdit.description,
        subcategoryId: productToEdit.subcategoryId,
      });
    } else {
      // Reset form for new product
      setFormData({
        name: '',
        price: '',
        imageUrl: '',
        description: '',
        subcategoryId: categories[0]?.subcategories[0]?.id || '',
      });
    }
  }, [productToEdit, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    if (isNaN(productData.price) || productData.price <= 0) {
      setError('Price must be a positive number.');
      setIsSaving(false);
      return;
    }

    try {
      if (productToEdit) {
        // Update existing product
        await fetchWithAuth(`/api/v1/admin/products/${productToEdit.id}`, {
          method: 'PUT',
          body: JSON.stringify(productData),
        });
      } else {
        // Create new product
        await fetchWithAuth('/api/v1/admin/products', {
          method: 'POST',
          body: JSON.stringify(productData),
        });
      }
      onSave();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">{productToEdit ? 'Edit Product' : 'Add New Product'}</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="subcategoryId" className="block text-sm font-medium text-slate-700">Subcategory</label>
              <select name="subcategoryId" id="subcategoryId" value={formData.subcategoryId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500">
                {categories.map((cat) => (
                  <optgroup label={cat.name} key={cat.id}>
                    {cat.subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-slate-700">Price (VND)</label>
              <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} required min="0" step="any" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="imageUrl" className="block text-sm font-medium text-slate-700">Image URL</label>
              <input type="url" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-slate-700">Description</label>
              <textarea name="description" id="description" value={formData.description} onChange={handleChange} required rows={4} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500"></textarea>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-400">{isSaving ? 'Saving...' : 'Save Product'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 