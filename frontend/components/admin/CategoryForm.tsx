import { useState, useEffect, FormEvent } from 'react';
import { Category, Subcategory } from '../../../shared/types';
import { api } from '../../lib/api';

interface CategoryFormProps {
  modalState: {
    mode: 'add' | 'edit';
    type: 'category' | 'subcategory';
    data?: Category | Subcategory;
    parentCategoryId?: string;
  };
  onClose: () => void;
  onSave: () => void;
  categories: Category[];
}

export default function CategoryForm({ modalState, onClose, onSave, categories }: CategoryFormProps) {
  const { mode, type, data, parentCategoryId } = modalState;
  const isCategory = type === 'category';

  const [formData, setFormData] = useState({
    name: '',
    icon: '',
    categoryId: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (mode === 'edit' && data) {
      setFormData({
        name: data.name,
        icon: (data as Category).icon || '',
        categoryId: (data as Subcategory).categoryId || '',
      });
    } else if (mode === 'add' && !isCategory) {
      setFormData({ name: '', icon: '', categoryId: parentCategoryId || categories[0]?.id || '' });
    } else {
      setFormData({ name: '', icon: '', categoryId: '' });
    }
  }, [modalState, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      if (isCategory) {
        const payload = { name: formData.name, icon: formData.icon };
        if (mode === 'add') {
          await api.post('/admin/categories', payload);
        } else {
          await api.put(`/admin/categories/${data!.id}`, payload);
        }
      } else {
        // Subcategory
        const payload = { name: formData.name, categoryId: formData.categoryId };
        if (mode === 'add') {
          await api.post('/admin/subcategories', payload);
        } else {
          // Only name is updatable for simplicity
          await api.put(`/admin/subcategories/${data!.id}`, { name: payload.name });
        }
      }
      onSave();
    } catch (err) {
      if (err instanceof Error) setError(err.message);
      else setError('An unknown error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  const title = `${mode === 'add' ? 'Add New' : 'Edit'} ${isCategory ? 'Category' : 'Subcategory'}`;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name</label>
              <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
            </div>
            {isCategory && (
              <div>
                <label htmlFor="icon" className="block text-sm font-medium text-slate-700">Icon Class</label>
                <input type="text" name="icon" id="icon" value={formData.icon} onChange={handleChange} required placeholder="e.g., fa-solid fa-cookie-bite" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500" />
              </div>
            )}
            {!isCategory && (
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700">Parent Category</label>
                <select
                  name="categoryId"
                  id="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  required
                  disabled={mode === 'edit'} // Disallow changing parent category for simplicity
                  className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-green-500 focus:ring-green-500 disabled:bg-slate-100"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <div className="p-6 bg-slate-50 border-t flex justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={isSaving} className="px-4 py-2 bg-white border border-slate-300 rounded-md text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500">Cancel</button>
            <button type="submit" disabled={isSaving} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-slate-400">{isSaving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
} 