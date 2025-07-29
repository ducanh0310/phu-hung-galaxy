import { useState, useEffect, FormEvent } from 'react';
import { Category, Subcategory } from '../../../shared/types';
import { api } from '../../lib/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

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
          await api.post('/admin/categories/', payload);
        } else {
          await api.put(`/admin/categories/${data!.id}`, payload);
        }
      } else {
        // Subcategory
        const payload = { name: formData.name, categoryId: formData.categoryId };
        if (mode === 'add') {
          await api.post('/admin/categories/subcategories', payload);
        } else {
          // Only name is updatable for simplicity
          await api.put(`/admin/categories/subcategories/${data!.id}`, { name: payload.name });
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
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            Fill in the details below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            {isCategory && (
              <div className="grid gap-2">
                <Label htmlFor="icon">Icon Class</Label>
                <Input
                  id="icon"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  required
                  placeholder="e.g., fa-solid fa-cookie-bite"
                />
              </div>
            )}
            {!isCategory && (
              <div className="grid gap-2">
                <Label htmlFor="categoryId">Parent Category</Label>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, categoryId: value }))}
                  required
                  disabled={mode === 'edit'} // Disallow changing parent category for simplicity
                >
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter className="pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 