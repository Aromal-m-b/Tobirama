import { useState } from "react";
import { Link } from "wouter";
import { ShoppingCart, Trash2, Heart, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import ProductCard from "@/components/ui/product-card";
import { useQuery } from "@tanstack/react-query";
import { Product } from "@shared/schema";

export default function WishlistPage() {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  // Fetch recommended products
  const { data: recommendedProducts, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
    select: (data) => data.slice(0, 4),
  });
  
  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: 1,
      size: product.sizes[0], // Default to first size
      color: product.colors[0], // Default to first color
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  const handleRemoveFromWishlist = (productId: number) => {
    removeFromWishlist(productId);
    
    toast({
      title: "Removed from wishlist",
      description: "The item has been removed from your wishlist.",
    });
  };
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Wishlist</h1>
          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                clearWishlist();
                toast({
                  title: "Wishlist cleared",
                  description: "All items have been removed from your wishlist.",
                });
              }}
            >
              Clear Wishlist
            </Button>
          )}
        </div>
        
        {wishlistItems.length === 0 ? (
          <div className="text-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Your wishlist is empty</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Save items you love in your wishlist and check back later for updates.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/products">
                  <a>Explore Products</a>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {wishlistItems.map((product) => (
              <div key={product.id} className="bg-white dark:bg-gray-800 shadow-sm rounded-lg overflow-hidden">
                <div className="relative">
                  <Link href={`/product/${product.id}`}>
                    <a className="block">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                      />
                    </a>
                  </Link>
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Trash2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                
                <div className="p-4">
                  <Link href={`/product/${product.id}`}>
                    <a className="text-base font-medium text-gray-900 dark:text-white hover:text-primary">
                      {product.name}
                    </a>
                  </Link>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {product.category}
                  </p>
                  <div className="mt-2 flex justify-between items-center">
                    <p className="text-lg font-medium text-gray-900 dark:text-white">
                      ${product.price.toFixed(2)}
                    </p>
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {/* Recommended Products Section */}
        <div className="mt-16">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Recommended for You
            </h2>
            <Link href="/products">
              <a className="text-primary hover:text-primary-dark flex items-center">
                View All <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recommendedProducts?.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
