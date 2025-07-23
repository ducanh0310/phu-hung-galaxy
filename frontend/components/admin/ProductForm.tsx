import { useState, useEffect, FormEvent } from 'react';
import { Product, Category } from '../../../shared/types';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '../ui/select';
import { Textarea } from '../ui/textarea.tsx';

interface ProductFormProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSave: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function ProductForm({ isOpen, productToEdit, onClose, onSave, fetchWithAuth }: ProductFormProps) {
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
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/v1/categories');
        const data = await response.json();
        setCategories(data);
        if (!productToEdit && data.length > 0 && data[0].subcategories.length > 0) {
          setFormData((prev) => ({ ...prev, subcategoryId: data[0].subcategories[0].id }));
        }
      } catch (err) {
        setError('Failed to load categories.');
      }
    };
    fetchCategories();
  }, []);

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

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>{productToEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
          <DialogDescription>
            {productToEdit ? 'Make changes to your product here.' : 'Add a new product to your store.'} Click save when
            you're done.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="subcategoryId" className="text-right">
                Subcategory
              </Label>
              <Select
                name="subcategoryId"
                value={formData.subcategoryId}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, subcategoryId: value }))}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select a subcategory" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectGroup key={cat.id}>
                      <SelectLabel>{cat.name}</SelectLabel>
                      {cat.subcategories.map((sub) => (
                        <SelectItem key={sub.id} value={sub.id}>
                          {sub.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (VND)
              </Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="imageUrl" className="text-right">
                Image URL
              </Label>
              <Input id="imageUrl" name="imageUrl" type="url" value={formData.imageUrl} onChange={handleChange} required className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="col-span-3" />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
            <Button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Product'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}