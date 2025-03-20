import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@shared/schema";
import { ChevronRight, Package, RotateCcw, Lock, Headphones } from "lucide-react";

export default function HomePage() {
  // Fetch featured products
  const { data: featuredProducts, isLoading: featuredLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/featured"],
  });
  
  // Fetch trending products
  const { data: trendingProducts, isLoading: trendingLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/trending"],
  });
  
  // Categories
  const categories = [
    {
      name: "T-Shirts",
      image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      path: "/products?category=t-shirts"
    },
    {
      name: "Jeans",
      image: "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      path: "/products?category=jeans"
    },
    {
      name: "Jackets",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      path: "/products?category=jackets"
    },
    {
      name: "Footwear",
      image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      path: "/products?category=footwear"
    },
    {
      name: "Accessories",
      image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      path: "/products?category=accessories"
    },
  ];
  
  return (
    <div>
      {/* Hero Section */}
      <div className="relative bg-gray-900">
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
              alt="Hero image" 
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute inset-0 bg-gray-900 opacity-60"></div>
          </div>
          <div className="relative h-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white sm:text-6xl">
              Summer Collection 2023
            </h1>
            <p className="mt-4 text-xl text-white">Explore the latest trends and styles</p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/products">
                <Button size="lg" className="px-8">
                  Shop Now
                </Button>
              </Link>
              <Link href="/products?new=true">
                <Button size="lg" variant="outline" className="px-8 bg-white text-primary hover:bg-gray-50">
                  New Arrivals
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Categories Section */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 dark:text-gray-400 lg:mx-auto">
              Find what you're looking for in our diverse collection
            </p>
          </div>
          
          <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {categories.map((category) => (
              <Link key={category.name} href={category.path}>
                <a className="group cursor-pointer">
                  <div className="relative h-48 w-full overflow-hidden rounded-lg bg-gray-200 group-hover:opacity-75">
                    <img 
                      src={category.image} 
                      alt={category.name} 
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-center text-gray-700 dark:text-gray-300">{category.name}</h3>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Products */}
      <div className="py-12 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Featured Products
            </h2>
            <Link href="/products?featured=true">
              <a className="text-primary hover:text-primary-dark dark:text-primary-light flex items-center cursor-pointer">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Link>
          </div>
          
          <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredLoading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, index) => (
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
            ) : (
              featuredProducts?.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Latest Collections Banner */}
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1615397587950-3cbb55f95b77?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Women's Collection" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white">Women's Collection</h3>
                <p className="text-gray-200 mb-4">Discover the latest trends</p>
                <Link href="/products?category=women">
                  <Button variant="secondary">Shop Now</Button>
                </Link>
              </div>
            </div>
            
            <div className="relative rounded-lg overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                alt="Men's Collection" 
                className="w-full h-80 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <h3 className="text-2xl font-bold text-white">Men's Collection</h3>
                <p className="text-gray-200 mb-4">Upgrade your style</p>
                <Link href="/products?category=men">
                  <Button variant="secondary">Shop Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Trending Items */}
      <div className="bg-gray-50 dark:bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              Trending Now
            </h2>
            <Link href="/products?trending=true">
              <a className="text-primary hover:text-primary-dark flex items-center cursor-pointer">
                View all <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </Link>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-y-10 gap-x-6 sm:grid-cols-3 lg:grid-cols-4 xl:gap-x-8">
            {trendingLoading ? (
              // Loading skeletons
              Array(4).fill(0).map((_, index) => (
                <div key={index} className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-sm p-4">
                  <Skeleton className="w-full h-64 rounded-md" />
                  <div className="mt-4">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-1/2 h-4 mt-2" />
                  </div>
                </div>
              ))
            ) : (
              trendingProducts?.map((product) => (
                <div key={product.id} className="group relative bg-white dark:bg-gray-900 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-full min-h-64 aspect-w-1 aspect-h-1 rounded-t-lg overflow-hidden group-hover:opacity-75">
                    <img 
                      src={product.imageUrl} 
                      alt={product.name} 
                      className="w-full h-full object-center object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-medium bg-accent text-white rounded">Trending</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={`/product/${product.id}`}>
                      <a className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary">
                        {product.name}
                      </a>
                    </Link>
                    <p className="mt-1 text-sm font-medium text-gray-900 dark:text-white">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-white dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Why Shop With Us</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500 dark:text-gray-400">
              We make shopping online easy and enjoyable
            </p>
          </div>
          
          <div className="mt-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <Package className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Free Shipping</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Free shipping on all orders over $50
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <RotateCcw className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Easy Returns</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  30 days money back guarantee
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <Lock className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">Secure Payments</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Your payment information is always secure
                </p>
              </div>
              
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900 dark:text-white">24/7 Support</h3>
                <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
                  Our customer service is always available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
