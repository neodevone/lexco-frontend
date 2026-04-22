export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface PurchasePayload {
  product_id: number;
  quantity: number;
}

export interface PurchaseResponse {
  message: string;
  product: Product;
}