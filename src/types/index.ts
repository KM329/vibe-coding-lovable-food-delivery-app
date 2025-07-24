export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

export interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVegetarian?: boolean;
  isAvailable: boolean;
  preparationTime: number; // in minutes
}

export interface CartItem {
  id: string;
  foodItem: FoodItem;
  quantity: number;
  specialInstructions?: string;
}

export interface DeliveryAddress {
  id?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  landmark?: string;
  phoneNumber: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  deliveryAddress: DeliveryAddress;
  totalAmount: number;
  deliveryFee: number;
  tax: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  estimatedDeliveryTime: Date;
  createdAt: Date;
  specialInstructions?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
}