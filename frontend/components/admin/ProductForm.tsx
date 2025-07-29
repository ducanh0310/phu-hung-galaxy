import { useState, useEffect, FormEvent } from 'react';
import { Product, Category } from '../../../shared/types';
import { api } from '../../lib/api';
import ImageUploader from './ImageUploader';
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
import { Textarea } from '../ui/textarea';

interface ProductFormProps {
  isOpen: boolean;
  productToEdit: Product | null;
  onClose: () => void;
  onSave: () => void;
}

export default function ProductForm({ isOpen, productToEdit, onClose, onSave }: ProductFormProps) {
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
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get<Category[]>('/categories');
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

  const handleUploadSuccess = (url: string) => {
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setError(null); // Clear previous errors when a new image is successfully uploaded
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

    // Validate that an image has been uploaded/exists
    if (!productData.imageUrl) {
      setError('Product image is required.');
      setIsSaving(false);
      return;
    }

    try {
      if (productToEdit) {
        // Update existing product
        await api.put(`/admin/products/${productToEdit.id}`, productData);
      } else {
        // Create new product
        await api.post('/admin/products', productData);
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
              <Label htmlFor="imageUploader" className="text-right pt-2 self-start">
                Image
              </Label>
              <ImageUploader
                initialImageUrl={formData.imageUrl}
                onUploadSuccess={handleUploadSuccess}
                onUploadStateChange={setIsUploadingImage}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required className="col-span-3" />
            </div>
            {error && <p className="col-span-4 text-sm text-destructive">{error}</p>}
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSaving || isUploadingImage}>Cancel</Button>
            <Button type="submit" disabled={isSaving || isUploadingImage}>
              {isSaving ? 'Saving...' : isUploadingImage ? 'Uploading...' : 'Save Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}