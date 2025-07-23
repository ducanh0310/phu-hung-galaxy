import { useState, useEffect, useCallback } from 'react';
import { Product } from '../../../shared/types';
import ProductForm from './ProductForm.tsx';
import { DataTable } from './DataTable.tsx';
import { ColumnDef } from '@tanstack/react-table';
import { Button } from '../ui/button.tsx';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import { Checkbox } from '../ui/checkbox.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu.tsx';

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
  const [isFormOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await fetchWithAuth(`/api/v1/admin/products/${productId}`, { method: 'DELETE' });
        fetchProducts();
      } catch (err) {
        if (err instanceof Error) alert(`Failed to delete: ${err.message}`);
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormOpen(true);
  };

  const columns: ColumnDef<Product>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'imageUrl',
      header: 'Image',
      cell: ({ row }) => (
        <img src={row.getValue('imageUrl')} alt="Product" className="w-16 h-16 object-cover rounded-md" />
      ),
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    { accessorKey: 'subcategory.name', header: 'Subcategory' },
    {
      accessorKey: 'price',
      header: ({ column }) => (
        <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => <div className="text-right font-medium">{formatPrice(row.getValue('price'))}</div>,
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const product = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(product)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDelete(product.id)} className="text-red-600">
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

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
    setFormOpen(true);
  };

  const handleSave = () => {
    setFormOpen(false);
    fetchProducts(); // Refresh list after save
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Products</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button onClick={handleAddNew}>Add new product</Button>
        </div>
      </div>
      {isLoading && <p>Loading products...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {!isLoading && !error && (
        <DataTable
          columns={columns}
          data={products}
          filterColumnId="name"
          filterPlaceholder="Filter by product name..."
        />
      )}
      <ProductForm
        isOpen={isFormOpen}
        productToEdit={editingProduct}
        onClose={() => setFormOpen(false)}
        onSave={handleSave}
        fetchWithAuth={fetchWithAuth}
      />
    </>
  );
}