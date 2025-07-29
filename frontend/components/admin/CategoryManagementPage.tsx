import { useState, useEffect, useCallback } from 'react';
import { Category, Subcategory } from '../../../shared/types';
import CategoryForm from './CategoryForm';
import { Link } from 'react-router-dom';
import { Icon } from '../Icon.tsx';
import { api } from '../../lib/api.ts';

type ModalState = {
  mode: 'add' | 'edit';
  type: 'category' | 'subcategory';
  data?: Category | Subcategory;
  parentCategoryId?: string;
} | null;

export default function CategoryManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalState, setModalState] = useState<ModalState>(null);

  const fetchCategories = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // This is a public route, no auth needed for GET
      const data = await api.get<Category[]>('/categories');
      setCategories(data);
    } catch (err) {
      if (err instanceof Error) setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleDelete = async (type: 'category' | 'subcategory', id: string) => {
    const confirmMessage = `Are you sure you want to delete this ${type}? This action cannot be undone.`;
    if (window.confirm(confirmMessage)) {
      try {
        const url = type === 'category' ? `/admin/categories/${id}` : `/admin/categories/subcategories/${id}`;
        await api.delete(url);
        fetchCategories(); // Refresh list
      } catch (err) {
        if (err instanceof Error) alert(`Failed to delete: ${err.message}`);
      }
    }
  };

  const handleSave = () => {
    setModalState(null);
    fetchCategories(); // Refresh list after save
  };

  if (isLoading) return <div className="p-8">Loading categories...</div>;
  if (error) return <div className="p-8 text-destructive">Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 bg-muted/50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Category Management</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your store's categories and subcategories.</p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 flex-shrink-0">
            <button type="button" onClick={() => setModalState({ mode: 'add', type: 'category' })} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring">Add new category</button>
          </div>
        </div>

        <div className="mt-8 space-y-6">
          {categories.map((category) => (
            <div key={category.id} className="bg-card shadow-sm ring-1 ring-border rounded-lg">
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Icon name={category.icon} className="text-muted-foreground" />
                  <h2 className="text-lg font-semibold text-card-foreground">{category.name}</h2>
                </div>
                <div className="flex items-center gap-4">
                  <button onClick={() => setModalState({ mode: 'add', type: 'subcategory', parentCategoryId: category.id })} className="text-sm font-medium text-primary hover:text-primary/90">Add Subcategory</button>
                  <button onClick={() => setModalState({ mode: 'edit', type: 'category', data: category })} className="text-sm font-medium text-primary hover:text-primary/90">Edit</button>
                  <button onClick={() => handleDelete('category', category.id)} className="text-sm font-medium text-destructive hover:text-destructive/90">Delete</button>
                </div>
              </div>
              {category.subcategories.length > 0 ? (
                <ul className="divide-y divide-border">
                  {category.subcategories.map((sub) => (
                    <li key={sub.id} className="px-4 py-3 flex items-center justify-between ml-6">
                      <p className="text-sm text-muted-foreground">{sub.name}</p>
                      <div className="flex items-center gap-4">
                        <button onClick={() => setModalState({ mode: 'edit', type: 'subcategory', data: sub })} className="text-sm font-medium text-primary hover:text-primary/90">Edit</button>
                        <button onClick={() => handleDelete('subcategory', sub.id)} className="text-sm font-medium text-destructive hover:text-destructive/90">Delete</button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-3 ml-6 text-sm text-muted-foreground/70">No subcategories yet.</p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <Link to="/admin/dashboard" className="text-primary hover:underline">← Back to Dashboard</Link>
        </div>
      </div>

      {modalState && (
        <CategoryForm
          modalState={modalState}
          onClose={() => setModalState(null)}
          onSave={handleSave}
          categories={categories}
        />
      )}
    </div>
  );
} 