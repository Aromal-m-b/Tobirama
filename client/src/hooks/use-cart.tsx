import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  size?: string;
  color?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  cartTotal: number;
  cartItemsCount: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: number, size?: string, color?: string) => void;
  updateCartQuantity: (id: number, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  
  // In a real app, this would fetch from the API
  const { data, isLoading } = useQuery({
    queryKey: ["/api/cart"],
    enabled: false // Disabled until authentication is implemented
  });
  
  // Calculate cart totals
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    
    setCartTotal(total);
    setCartItemsCount(count);
  }, [cartItems]);
  
  // Add item to cart
  const addToCart = (newItem: CartItem) => {
    setCartItems(prevItems => {
      // Check if item already exists with same size and color
      const existingItemIndex = prevItems.findIndex(
        item => item.id === newItem.id && item.size === newItem.size && item.color === newItem.color
      );
      
      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Add new item
        return [...prevItems, newItem];
      }
    });
  };
  
  // Remove item from cart
  const removeFromCart = (id: number, size?: string, color?: string) => {
    setCartItems(prevItems => 
      prevItems.filter(item => 
        !(item.id === id && item.size === size && item.color === color)
      )
    );
  };
  
  // Update item quantity
  const updateCartQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        (item.id === id && item.size === size && item.color === color) 
          ? { ...item, quantity } 
          : item
      )
    );
  };
  
  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };
  
  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartTotal,
        cartItemsCount,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
