export interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  category: string;
}

export interface User {
  id: number;
  username: string;
  role: string;
}

export interface OrderItem {
  id: number;
  productId: number;
  product: Product;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  userId: number;
  user: User;
  status: string;
  total: number;
  createAt: string;
  items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthRequest {
  username: string;
  password: string;
}
