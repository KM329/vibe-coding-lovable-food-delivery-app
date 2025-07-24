import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CartItem, FoodItem, CartState } from '@/types';
import { useToast } from '@/hooks/use-toast';

interface CartContextType extends CartState {
  addToCart: (foodItem: FoodItem, quantity?: number, specialInstructions?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (foodItemId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { foodItem: FoodItem; quantity: number; specialInstructions?: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartItem[] };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newItems: CartItem[];
  
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItemIndex = state.items.findIndex(
        item => item.foodItem.id === action.payload.foodItem.id
      );
      
      if (existingItemIndex > -1) {
        newItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        const newItem: CartItem = {
          id: `${action.payload.foodItem.id}-${Date.now()}`,
          foodItem: action.payload.foodItem,
          quantity: action.payload.quantity,
          specialInstructions: action.payload.specialInstructions,
        };
        newItems = [...state.items, newItem];
      }
      break;
      
    case 'REMOVE_FROM_CART':
      newItems = state.items.filter(item => item.id !== action.payload);
      break;
      
    case 'UPDATE_QUANTITY':
      if (action.payload.quantity <= 0) {
        newItems = state.items.filter(item => item.id !== action.payload.itemId);
      } else {
        newItems = state.items.map(item =>
          item.id === action.payload.itemId
            ? { ...item, quantity: action.payload.quantity }
            : item
        );
      }
      break;
      
    case 'CLEAR_CART':
      newItems = [];
      break;
      
    case 'LOAD_CART':
      newItems = action.payload;
      break;
      
    default:
      return state;
  }
  
  const totalItems = newItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = newItems.reduce((sum, item) => sum + (item.foodItem.price * item.quantity), 0);
  
  return {
    items: newItems,
    totalItems,
    totalAmount,
  };
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    totalItems: 0,
    totalAmount: 0,
  });
  
  const { toast } = useToast();

  useEffect(() => {
    // Load cart from localStorage on app start
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      try {
        const cartItems = JSON.parse(storedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        localStorage.removeItem('cart');
      }
    }
  }, []);

  useEffect(() => {
    // Save cart to localStorage whenever it changes
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  const addToCart = (foodItem: FoodItem, quantity = 1, specialInstructions?: string) => {
    if (!foodItem.isAvailable) {
      toast({
        title: "Item Unavailable",
        description: `${foodItem.name} is currently not available.`,
        variant: "destructive",
      });
      return;
    }
    
    dispatch({
      type: 'ADD_TO_CART',
      payload: { foodItem, quantity, specialInstructions },
    });
    
    toast({
      title: "Added to Cart",
      description: `${foodItem.name} has been added to your cart.`,
    });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
    toast({
      title: "Removed from Cart",
      description: "Item has been removed from your cart.",
    });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('cart');
  };

  const getItemQuantity = (foodItemId: string) => {
    const item = state.items.find(item => item.foodItem.id === foodItemId);
    return item ? item.quantity : 0;
  };

  return (
    <CartContext.Provider value={{
      ...state,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getItemQuantity,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};