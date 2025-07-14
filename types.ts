export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  subcategory: string;
  description: string;
  quantity?: number;
}

export interface Subcategory {
  id: string;
  name: string;
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
