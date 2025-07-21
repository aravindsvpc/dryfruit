import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number; // price for 250g or for 1 count
  image: string;
  quantity: number;
  type: string;
  grams?: number; // only for type 'weight', in multiples of 250
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction = 
  | { type: 'ADD_TO_CART'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_FROM_CART'; payload: string | { id: string; grams?: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number; grams?: number } }
  | { type: 'UPDATE_GRAMS'; payload: { id: string; grams: number } }
  | { type: 'CLEAR_CART' };

const CartContext = createContext<{
  state: CartState;
  dispatch: React.Dispatch<CartAction>;
} | null>(null);

const getItemTotal = (item: CartItem) => {
  if (item.type === 'weight') {
    const grams = item.grams || 250;
    // price is for 250g, so multiply by grams/250
    return item.price * (grams / 250) * item.quantity;
  } else {
    return item.price * item.quantity;
  }
};

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (existingItem) {
        const updatedItems = state.items.map(item =>
          item.id === action.payload.id
            ? { ...item, quantity: item.quantity + 1, grams: action.payload.type === 'weight' ? action.payload.grams : undefined }
            : item
        );
        return {
          items: updatedItems,
          total: updatedItems.reduce((sum, item) => sum + getItemTotal(item), 0)
        };
      }
      const newItems = [...state.items, { ...action.payload, quantity: 1, grams: action.payload.type === 'weight' ? action.payload.grams : undefined }];
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + getItemTotal(item), 0)
      };
    }
    case 'REMOVE_FROM_CART': {
      let newItems;
      if (typeof action.payload === 'string') {
        newItems = state.items.filter(item => item.id !== action.payload);
      } else if (typeof action.payload === 'object' && action.payload !== null) {
        const payloadObj = action.payload;
        newItems = state.items.filter(item =>
          !(item.id === payloadObj.id && (item.grams === payloadObj.grams || payloadObj.grams === undefined))
        );
      } else {
        newItems = [...state.items];
      }
      return {
        items: newItems,
        total: newItems.reduce((sum, item) => sum + getItemTotal(item), 0)
      };
    }
    case 'UPDATE_QUANTITY': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id && (item.grams === action.payload.grams || action.payload.grams === undefined)
          ? { ...item, quantity: action.payload.quantity }
          : item
      ).filter(item => item.quantity > 0);
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + getItemTotal(item), 0)
      };
    }
    case 'UPDATE_GRAMS': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload.id
          ? { ...item, grams: action.payload.grams }
          : item
      );
      return {
        items: updatedItems,
        total: updatedItems.reduce((sum, item) => sum + getItemTotal(item), 0)
      };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0 };
    default:
      return state;
  }
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load cart from localStorage if available
  const getInitialCart = () => {
    try {
      const stored = localStorage.getItem('cart');
      if (stored) return JSON.parse(stored);
    } catch {}
    return { items: [], total: 0 };
  };

  const [state, dispatch] = useReducer(cartReducer, getInitialCart());

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};