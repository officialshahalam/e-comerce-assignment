export interface ProductImage {
  id: string;
  file_id: string;
  url: string;
  productId?: string;
  userId?: string | null;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  subCategory?: string;
  warranty: string;
  colors?: string[];
  sizes?: string[];
  images: ProductImage[];
  regular_price: number;
  sale_price: number;
  ratings: number;
  quantity: number;
  stock: number;
  isDeleted?: boolean;
  starting_date?: Date | null;
  ending_date?: Date | null;
  selectedOptions?: { color?: string; size?: string };
  createdAt: Date;
  updatedAt: Date;
}
