import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

interface WishlistContextType {
  wishlistItems: Product[];
  isInWishlist: (id: number) => boolean;
  toggleWishlist: (product: Product) => void;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
  
  // In a real app, this would fetch from the API
  const { data, isLoading } = useQuery({
    queryKey: ["/api/wishlist"],
    enabled: false // Disabled until authentication is implemented
  });
  
  // Check if product is in wishlist
  const isInWishlist = (id: number) => {
    return wishlistItems.some(item => item.id === id);
  };
  
  // Toggle product in wishlist
  const toggleWishlist = (product: Product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      setWishlistItems(prevItems => [...prevItems, product]);
    }
  };
  
  // Remove product from wishlist
  const removeFromWishlist = (id: number) => {
    setWishlistItems(prevItems => 
      prevItems.filter(item => item.id !== id)
    );
  };
  
  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([]);
  };
  
  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        isLoading
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
