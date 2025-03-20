import { useState } from "react";
import { Link } from "wouter";
import { Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { toast } = useToast();
  const isWishlisted = isInWishlist(product.id);
  
  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      size: product.sizes[0],
      color: product.colors[0]
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleToggleWishlist = () => {
    toggleWishlist(product);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? "removed from" : "added to"} your wishlist.`,
    });
  };
  
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="relative w-full h-64 overflow-hidden rounded-t-lg group-hover:opacity-90 transition-opacity">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
        <button 
          onClick={handleToggleWishlist}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white dark:bg-gray-800 shadow flex items-center justify-center"
        >
          <Heart 
            className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : "text-gray-400"}`} 
          />
        </button>
        
        {product.trendingProduct && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-medium bg-accent text-white rounded">
              Trending
            </span>
          </div>
        )}
        
        {product.newArrival && (
          <div className={`absolute top-2 ${product.trendingProduct ? "left-20" : "left-2"}`}>
            <span className="px-2 py-1 text-xs font-medium bg-green-500 text-white rounded">
              New
            </span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center">
          <Link href={`/product/${product.id}`}>
            <a className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary truncate">
              {product.name}
            </a>
          </Link>
          
          <div className="flex items-center">
            <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {product.rating} ({product.reviewCount})
            </span>
          </div>
        </div>
        
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {product.colors.join(", ")}
        </p>
        
        <div className="mt-2 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-gray-900 dark:text-white">
              ${product.price.toFixed(2)}
            </p>
            {product.compareAtPrice && (
              <p className="text-xs line-through text-gray-500">
                ${product.compareAtPrice.toFixed(2)}
              </p>
            )}
          </div>
          
          <Button 
            onClick={handleAddToCart}
            variant="link" 
            className="text-primary hover:text-primary-dark text-sm font-medium p-0"
          >
            Add to cart
          </Button>
        </div>
      </div>
    </div>
  );
}
