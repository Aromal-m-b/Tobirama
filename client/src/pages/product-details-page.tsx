import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import {
  Heart,
  ChevronRight,
  Star,
  ShoppingCart,
  ArrowLeft,
  Truck,
  Package,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ProductCard from "@/components/ui/product-card";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@shared/schema";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const productId = parseInt(id);
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  
  // State for product options
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  
  // Fetch product details
  const { data: product, isLoading } = useQuery<Product>({
    queryKey: [`/api/products/${productId}`],
  });
  
  // Fetch similar products
  const { data: similarProducts, isLoading: similarLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    select: (products) => 
      products
        .filter(p => 
          p.id !== productId && 
          p.category === product?.category
        )
        .slice(0, 4),
    enabled: !!product,
  });
  
  const isProductInWishlist = product ? isInWishlist(product.id) : false;
  
  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Validate selection
    if (!selectedSize) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedColor) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
    });
  };
  
  // Handle toggle wishlist
  const handleToggleWishlist = () => {
    if (!product) return;
    
    toggleWishlist(product);
    
    toast({
      title: isProductInWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isProductInWishlist ? "removed from" : "added to"} your wishlist.`,
    });
  };
  
  // Initial auto-selections
  if (product && !selectedSize && product.sizes.length > 0) {
    setSelectedSize(product.sizes[0]);
  }
  
  if (product && !selectedColor && product.colors.length > 0) {
    setSelectedColor(product.colors[0]);
  }
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/">
                <a className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">Home</a>
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <Link href="/products">
                  <a className="ml-1 text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white md:ml-2">Products</a>
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <ChevronRight className="h-4 w-4 text-gray-400" />
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
                  {isLoading ? "Loading..." : product?.name}
                </span>
              </div>
            </li>
          </ol>
        </nav>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <Skeleton className="w-full aspect-square rounded-lg" />
              <div className="mt-4 grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="w-full aspect-square rounded-md" />
                ))}
              </div>
            </div>
            <div>
              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-1/4 mb-4" />
              <Skeleton className="h-6 w-1/2 mb-6" />
              
              <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-14 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        ) : product ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={product.imageUrls[activeImage] || product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover object-center aspect-square"
                />
              </div>
              
              {/* Thumbnail Images */}
              <div className="mt-4 grid grid-cols-4 gap-2">
                {product.imageUrls.map((img, index) => (
                  <button
                    key={index}
                    className={`relative bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden ${
                      activeImage === index ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setActiveImage(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover object-center aspect-square"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Product Details */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                {product.name}
              </h1>
              
              <div className="mt-2 flex items-center">
                <div className="flex items-center">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300 dark:text-gray-600"
                        }`}
                      />
                    ))}
                </div>
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>
              
              <div className="mt-4 flex items-center space-x-4">
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                {product.compareAtPrice && (
                  <span className="text-sm font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)}% OFF
                  </span>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Description</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  {product.description}
                </p>
              </div>
              
              {/* Color Selection */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Color
                </h3>
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-full ${
                        selectedColor === color
                          ? "ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900"
                          : "ring-1 ring-gray-200 dark:ring-gray-700"
                      }`}
                      style={{ backgroundColor: color.toLowerCase() }}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    ></button>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Selected: <span className="font-medium text-gray-900 dark:text-white">{selectedColor}</span>
                </p>
              </div>
              
              {/* Size Selection */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    Size
                  </h3>
                  <button className="text-sm font-medium text-primary hover:text-primary-dark">
                    Size Guide
                  </button>
                </div>
                <div className="mt-2 grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`border rounded-md py-2 px-3 flex items-center justify-center text-sm font-medium uppercase ${
                        selectedSize === size
                          ? "bg-primary text-white border-primary"
                          : "border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Quantity */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                  Quantity
                </h3>
                <div className="mt-2 flex items-center border rounded-md w-32">
                  <button
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="flex-1 text-center text-gray-900 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    className="px-3 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    onClick={() => setQuantity(quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {/* Add to Cart & Wishlist */}
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant={isProductInWishlist ? "destructive" : "outline"}
                  className="flex-1"
                  onClick={handleToggleWishlist}
                >
                  <Heart
                    className={`mr-2 h-5 w-5 ${
                      isProductInWishlist ? "fill-current" : ""
                    }`}
                  />
                  {isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
                </Button>
              </div>
              
              {/* Shipping Information */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start">
                  <Truck className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Free Shipping
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Free standard shipping on orders over $50
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Package className="h-5 w-5 text-gray-400 mr-3 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                      Easy Returns
                    </h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      30 days to return for a full refund
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              Product not found
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              The product you are looking for does not exist or has been removed.
            </p>
            <Button className="mt-6" asChild>
              <Link href="/products">
                <a>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Products
                </a>
              </Link>
            </Button>
          </div>
        )}
        
        {/* Product Tabs */}
        {product && (
          <div className="mt-16">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="sizing">Sizing & Care</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-500 dark:prose-p:text-gray-400">
                  <h3>Product Details</h3>
                  <p>{product.description}</p>
                  
                  <h4>Features</h4>
                  <ul>
                    <li>High-quality material</li>
                    <li>Comfortable fit</li>
                    <li>Durable construction</li>
                    <li>Versatile style</li>
                  </ul>
                  
                  <h4>Materials</h4>
                  <p>
                    100% premium materials, ethically sourced and manufactured with sustainability in mind.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="sizing" className="mt-6">
                <div className="prose max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-500 dark:prose-p:text-gray-400">
                  <h3>Sizing Information</h3>
                  <p>
                    Use the following guide to find your perfect fit. Measurements are in inches.
                  </p>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Chest
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Waist
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                            Hip
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            S
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            34-36
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            28-30
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            34-36
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            M
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            38-40
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            32-34
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            38-40
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            L
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            42-44
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            36-38
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            42-44
                          </td>
                        </tr>
                        <tr>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            XL
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            46-48
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            40-42
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                            46-48
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <h4 className="mt-6">Care Instructions</h4>
                  <ul>
                    <li>Machine wash cold with similar colors</li>
                    <li>Do not bleach</li>
                    <li>Tumble dry low</li>
                    <li>Warm iron if needed</li>
                    <li>Do not dry clean</li>
                  </ul>
                </div>
              </TabsContent>
              <TabsContent value="reviews" className="mt-6">
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        Customer Reviews
                      </h3>
                      <div className="flex items-center mt-1">
                        <div className="flex items-center">
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <Star
                                key={i}
                                className={`h-5 w-5 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-300 dark:text-gray-600"
                                }`}
                              />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                          Based on {product.reviewCount} reviews
                        </span>
                      </div>
                    </div>
                    <Button>Write a Review</Button>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-6">
                    {/* Sample reviews - would be fetched from API in a real app */}
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Great product, highly recommend!
                          </h4>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < 5
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          2 days ago
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-white">John D.</span> ·{" "}
                          <span className="text-xs text-gray-500">Verified Purchaser</span>
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          This product exceeded my expectations. The quality is excellent, and it fits perfectly. I've already received several compliments!
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            Good quality, slightly small
                          </h4>
                          <div className="flex items-center mt-1">
                            <div className="flex items-center">
                              {Array(5)
                                .fill(0)
                                .map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < 4
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300 dark:text-gray-600"
                                    }`}
                                  />
                                ))}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          1 week ago
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-medium text-gray-900 dark:text-white">Sarah M.</span> ·{" "}
                          <span className="text-xs text-gray-500">Verified Purchaser</span>
                        </p>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          The quality of this product is great, but I found it runs a bit small. I would recommend sizing up if you're between sizes. Otherwise, very happy with my purchase!
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="text-center">
                      <Button variant="outline">Load More Reviews</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
        
        {/* Similar Products */}
        {product && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              You May Also Like
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
              {similarLoading
                ? Array(4)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
                        <Skeleton className="w-full h-64 rounded-md" />
                        <div className="mt-4">
                          <Skeleton className="w-3/4 h-5" />
                          <Skeleton className="w-1/2 h-4 mt-2" />
                          <div className="flex justify-between items-center mt-2">
                            <Skeleton className="w-1/4 h-4" />
                            <Skeleton className="w-1/4 h-4" />
                          </div>
                        </div>
                      </div>
                    ))
                : similarProducts?.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
            </div>
          </div>
        )}
        
        {/* FAQ Section */}
        {product && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Frequently Asked Questions
            </h2>
            <div className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                    How does sizing run for this product?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 dark:text-gray-400">
                    This product generally runs true to size. However, if you're between sizes, we recommend sizing up for a more comfortable fit. Please refer to the size chart for exact measurements.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                    What materials are used in this product?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 dark:text-gray-400">
                    We use only high-quality, sustainable materials for all our products. This specific item is made from premium, ethically sourced materials that ensure comfort and durability.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                    How do I care for this product?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 dark:text-gray-400">
                    For best results, machine wash cold with similar colors, do not bleach, tumble dry low, and warm iron if needed. Do not dry clean. Following these care instructions will help maintain the quality and appearance of your product.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="text-left text-gray-900 dark:text-white">
                    What is your return policy?
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-500 dark:text-gray-400">
                    We offer a 30-day return policy on all unused and unworn items. Items must be returned in their original packaging with all tags attached. Please note that shipping costs for returns are the responsibility of the customer unless the item is defective or we made an error.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
