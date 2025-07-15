export interface Subcategory {
  id: string;
  name: string;
  categoryId: string;
}

export interface Category {
  id:string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  subcategoryId: string;
}

export interface CartItem extends Product {
  quantity: number;
}