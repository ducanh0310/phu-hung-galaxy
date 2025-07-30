export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  subcategoryId: string;
  // Populated by Prisma includes
  subcategory?: Subcategory;
}

export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
  // Populated by Prisma includes
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
}
