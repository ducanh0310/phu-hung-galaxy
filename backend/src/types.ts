export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  subcategory: string;
  description: string;
}

export interface Subcategory {
  id: string;
  name: string;
  parentCategory: string;
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