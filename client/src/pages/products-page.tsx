import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useState, useEffect } from "react";
import {
  Grid,
  List,
  Filter,
  SlidersHorizontal,
  ChevronDown,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import ProductCard from "@/components/ui/product-card";
import { Product } from "@shared/schema";

export default function ProductsPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  
  // Extract filter parameters from URL
  const category = searchParams.get("category") || "";
  const featured = searchParams.get("featured") === "true";
  const trending = searchParams.get("trending") === "true";
  const newArrival = searchParams.get("new") === "true";
  
  // State for filters
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    category ? [category] : []
  );
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch all products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Apply filters
  const filteredProducts = products
    ? products.filter((product) => {
        // Filter by price
        if (product.price < priceRange[0] || product.price > priceRange[1]) {
          return false;
        }
        
        // Filter by categories
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.includes(product.category)
        ) {
          return false;
        }
        
        // Filter by colors
        if (
          selectedColors.length > 0 &&
          !product.colors.some((color) => selectedColors.includes(color))
        ) {
          return false;
        }
        
        // Filter by sizes
        if (
          selectedSizes.length > 0 &&
          !product.sizes.some((size) => selectedSizes.includes(size))
        ) {
          return false;
        }
        
        // Filter by featured
        if (featured && !product.featuredProduct) {
          return false;
        }
        
        // Filter by trending
        if (trending && !product.trendingProduct) {
          return false;
        }
        
        // Filter by new arrival
        if (newArrival && !product.newArrival) {
          return false;
        }
        
        return true;
      })
    : [];

  // Sort products
  const sortedProducts = [...(filteredProducts || [])].sort((a, b) => {
    switch (sortBy) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      default:
        return 0;
    }
  });

  // Available categories from products
  const availableCategories = products
    ? Array.from(new Set(products.map((product) => product.category)))
    : [];

  // Available colors and sizes from products
  const availableColors = products
    ? Array.from(new Set(products.flatMap((product) => product.colors)))
    : [];
  
  const availableSizes = products
    ? Array.from(new Set(products.flatMap((product) => product.sizes)))
    : [];

  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 500]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSortBy("featured");
    setLocation("/products");
  };

  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="pb-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
              {category
                ? `${category}`
                : featured
                ? "Featured Products"
                : trending
                ? "Trending Products"
                : newArrival
                ? "New Arrivals"
                : "All Products"}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Showing {sortedProducts.length} products
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-4 items-center">
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("grid")}
                className={
                  viewMode === "grid" ? "text-primary" : "text-gray-400"
                }
              >
                <Grid className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMode("list")}
                className={
                  viewMode === "list" ? "text-primary" : "text-gray-400"
                }
              >
                <List className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="relative inline-block text-gray-700 dark:text-gray-300">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="h-10 pl-3 pr-10 rounded-lg text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600 focus:outline-none appearance-none"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300 h-full w-5 mr-1" />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden"
              onClick={() => setFilterOpen(true)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        <div className="pt-6 pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-x-8 gap-y-10">
            {/* Filters - Desktop */}
            <div className="hidden lg:block">
              <div className="space-y-10 divide-y divide-gray-200 dark:divide-gray-700">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Categories</h3>
                  <ul className="mt-4 space-y-4">
                    {availableCategories.map((cat) => (
                      <li key={cat} className="flex items-center">
                        <Checkbox
                          id={`category-${cat.toLowerCase()}`}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedCategories([...selectedCategories, cat]);
                            } else {
                              setSelectedCategories(
                                selectedCategories.filter((c) => c !== cat)
                              );
                            }
                          }}
                        />
                        <label
                          htmlFor={`category-${cat.toLowerCase()}`}
                          className="ml-3 text-sm text-gray-600 dark:text-gray-400"
                        >
                          {cat}
                        </label>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-10">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Price Range</h3>
                  <div className="mt-4">
                    <Slider
                      defaultValue={[0, 500]}
                      max={500}
                      step={1}
                      value={priceRange}
                      onValueChange={(value) => setPriceRange(value as [number, number])}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between mt-6">
                      <div className="w-full max-w-xs">
                        <div className="flex justify-between">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Min
                          </label>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Max
                          </label>
                        </div>
                        <div className="mt-1 flex rounded-md shadow-sm">
                          <div className="relative flex items-stretch flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <Input
                              type="number"
                              value={priceRange[0]}
                              onChange={(e) =>
                                setPriceRange([
                                  parseInt(e.target.value) || 0,
                                  priceRange[1],
                                ])
                              }
                              className="pl-7"
                              min={0}
                              max={priceRange[1]}
                            />
                          </div>
                          <div className="flex items-center justify-center px-4">
                            <span className="text-gray-500">-</span>
                          </div>
                          <div className="relative flex items-stretch flex-grow">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">$</span>
                            </div>
                            <Input
                              type="number"
                              value={priceRange[1]}
                              onChange={(e) =>
                                setPriceRange([
                                  priceRange[0],
                                  parseInt(e.target.value) || 0,
                                ])
                              }
                              className="pl-7"
                              min={priceRange[0]}
                              max={500}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-10">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Size</h3>
                  <div className="mt-4 grid grid-cols-4 gap-4">
                    {availableSizes.map((size) => (
                      <Button
                        key={size}
                        variant={selectedSizes.includes(size) ? "default" : "outline"}
                        className="py-2 px-3 text-sm font-medium uppercase"
                        onClick={() => {
                          if (selectedSizes.includes(size)) {
                            setSelectedSizes(selectedSizes.filter((s) => s !== size));
                          } else {
                            setSelectedSizes([...selectedSizes, size]);
                          }
                        }}
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Color</h3>
                  <div className="mt-4 flex flex-wrap gap-3">
                    {availableColors.map((color) => (
                      <button
                        key={color}
                        className={`h-8 w-8 rounded-full border ${
                          selectedColors.includes(color)
                            ? "ring-2 ring-primary"
                            : "border-gray-300 dark:border-gray-700"
                        } cursor-pointer`}
                        style={{ backgroundColor: color.toLowerCase() }}
                        onClick={() => {
                          if (selectedColors.includes(color)) {
                            setSelectedColors(
                              selectedColors.filter((c) => c !== color)
                            );
                          } else {
                            setSelectedColors([...selectedColors, color]);
                          }
                        }}
                        title={color}
                      ></button>
                    ))}
                  </div>
                </div>

                <div className="pt-10">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="w-full mt-2"
                  >
                    Reset Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Filters - Mobile */}
            {filterOpen && (
              <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={() => setFilterOpen(false)}
                  ></div>
                  <div className="fixed inset-y-0 left-0 max-w-full flex">
                    <div className="w-screen max-w-md">
                      <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
                        <div className="flex justify-between items-center px-4 py-6 border-b border-gray-200 dark:border-gray-700">
                          <h2 className="text-lg font-medium text-gray-900 dark:text-white">Filters</h2>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setFilterOpen(false)}
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                        <div className="overflow-y-auto flex-1 px-4 py-6 space-y-8">
                          {/* Categories */}
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">Categories</h3>
                            <ul className="mt-4 space-y-4">
                              {availableCategories.map((cat) => (
                                <li key={cat} className="flex items-center">
                                  <Checkbox
                                    id={`mobile-category-${cat.toLowerCase()}`}
                                    checked={selectedCategories.includes(cat)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        setSelectedCategories([...selectedCategories, cat]);
                                      } else {
                                        setSelectedCategories(
                                          selectedCategories.filter((c) => c !== cat)
                                        );
                                      }
                                    }}
                                  />
                                  <label
                                    htmlFor={`mobile-category-${cat.toLowerCase()}`}
                                    className="ml-3 text-sm text-gray-600 dark:text-gray-400"
                                  >
                                    {cat}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Price Range */}
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">Price Range</h3>
                            <div className="mt-4">
                              <Slider
                                defaultValue={[0, 500]}
                                max={500}
                                step={1}
                                value={priceRange}
                                onValueChange={(value) => setPriceRange(value as [number, number])}
                                className="w-full"
                              />
                              <div className="flex items-center justify-between mt-6">
                                <div className="w-full">
                                  <div className="flex justify-between">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Min
                                    </label>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                      Max
                                    </label>
                                  </div>
                                  <div className="mt-1 flex rounded-md shadow-sm">
                                    <div className="relative flex items-stretch flex-grow">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                      </div>
                                      <Input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) =>
                                          setPriceRange([
                                            parseInt(e.target.value) || 0,
                                            priceRange[1],
                                          ])
                                        }
                                        className="pl-7"
                                        min={0}
                                        max={priceRange[1]}
                                      />
                                    </div>
                                    <div className="flex items-center justify-center px-4">
                                      <span className="text-gray-500">-</span>
                                    </div>
                                    <div className="relative flex items-stretch flex-grow">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                      </div>
                                      <Input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) =>
                                          setPriceRange([
                                            priceRange[0],
                                            parseInt(e.target.value) || 0,
                                          ])
                                        }
                                        className="pl-7"
                                        min={priceRange[0]}
                                        max={500}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Size */}
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">Size</h3>
                            <div className="mt-4 grid grid-cols-4 gap-4">
                              {availableSizes.map((size) => (
                                <Button
                                  key={size}
                                  variant={selectedSizes.includes(size) ? "default" : "outline"}
                                  className="py-2 px-3 text-sm font-medium uppercase"
                                  onClick={() => {
                                    if (selectedSizes.includes(size)) {
                                      setSelectedSizes(selectedSizes.filter((s) => s !== size));
                                    } else {
                                      setSelectedSizes([...selectedSizes, size]);
                                    }
                                  }}
                                >
                                  {size}
                                </Button>
                              ))}
                            </div>
                          </div>

                          {/* Color */}
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">Color</h3>
                            <div className="mt-4 flex flex-wrap gap-3">
                              {availableColors.map((color) => (
                                <button
                                  key={color}
                                  className={`h-8 w-8 rounded-full border ${
                                    selectedColors.includes(color)
                                      ? "ring-2 ring-primary"
                                      : "border-gray-300 dark:border-gray-700"
                                  } cursor-pointer`}
                                  style={{ backgroundColor: color.toLowerCase() }}
                                  onClick={() => {
                                    if (selectedColors.includes(color)) {
                                      setSelectedColors(
                                        selectedColors.filter((c) => c !== color)
                                      );
                                    } else {
                                      setSelectedColors([...selectedColors, color]);
                                    }
                                  }}
                                  title={color}
                                ></button>
                              ))}
                            </div>
                          </div>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 py-4 px-4 flex justify-between">
                          <Button
                            variant="outline"
                            onClick={resetFilters}
                          >
                            Reset Filters
                          </Button>
                          <Button onClick={() => setFilterOpen(false)}>
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="lg:col-span-3">
              {isLoading ? (
                <div className={`grid grid-cols-1 gap-6 ${
                  viewMode === "grid" 
                    ? "sm:grid-cols-2 lg:grid-cols-3" 
                    : "sm:grid-cols-1"
                }`}>
                  {Array(6).fill(0).map((_, index) => (
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
                  ))}
                </div>
              ) : sortedProducts.length === 0 ? (
                <div className="text-center py-12">
                  <SlidersHorizontal className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No products found</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Try adjusting your filters or search term.
                  </p>
                  <Button
                    onClick={resetFilters}
                    className="mt-6"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                <div className={`grid grid-cols-1 gap-6 ${
                  viewMode === "grid" 
                    ? "sm:grid-cols-2 lg:grid-cols-3" 
                    : "sm:grid-cols-1"
                }`}>
                  {sortedProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
