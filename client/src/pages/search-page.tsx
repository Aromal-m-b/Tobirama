import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Search as SearchIcon,
  Filter,
  Mic,
  Camera,
  ChevronDown,
  SlidersHorizontal,
  Grid,
  List,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProductCard from "@/components/ui/product-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Product } from "@shared/schema";

export default function SearchPage() {
  const [location, setLocation] = useLocation();
  const searchParams = new URLSearchParams(location.split("?")[1] || "");
  const initialQuery = searchParams.get("q") || "";
  
  // State for search and filters
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  const [filterOpen, setFilterOpen] = useState(false);
  const [searchTab, setSearchTab] = useState<"text" | "image" | "voice">("text");
  
  // Fetch all products
  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products/search", searchQuery],
    enabled: !!searchQuery,
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
  
  // Available categories, colors, and sizes from products
  const availableCategories = products
    ? Array.from(new Set(products.map((product) => product.category)))
    : [];
  
  const availableColors = products
    ? Array.from(new Set(products.flatMap((product) => product.colors)))
    : [];
  
  const availableSizes = products
    ? Array.from(new Set(products.flatMap((product) => product.sizes)))
    : [];
  
  // Handle search form submit
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    if (searchQuery.trim()) {
      // Update URL with search query
      setLocation(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  // Update searchQuery when URL changes
  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchQuery(query);
  }, [location]);
  
  // Reset filters
  const resetFilters = () => {
    setPriceRange([0, 500]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSortBy("featured");
  };
  
  // Handle voice search (mock functionality)
  const handleVoiceSearch = () => {
    setSearchTab("voice");
    // In a real app, this would use the Web Speech API
    setTimeout(() => {
      setSearchQuery("denim jacket");
      setSearchTab("text");
      handleSearch();
    }, 2000);
  };
  
  // Handle image search (mock functionality)
  const handleImageSearch = () => {
    setSearchTab("image");
    // In a real app, this would handle image upload and processing
  };
  
  // Recent searches (mock data)
  const recentSearches = [
    "Slim fit jeans",
    "Leather jacket",
    "Summer dress",
    "Sports shoes"
  ];
  
  // Popular searches (mock data)
  const popularSearches = [
    "Summer Collection",
    "Denim Jackets",
    "Casual Shoes",
    "Graphic Tees",
    "Party Wear",
    "Office Attire"
  ];
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="pb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {searchQuery ? `Search Results for "${searchQuery}"` : "Search"}
          </h1>
          
          <Tabs defaultValue="text" value={searchTab} onValueChange={(v) => setSearchTab(v as any)}>
            <TabsList className="mb-4">
              <TabsTrigger value="text">Text Search</TabsTrigger>
              <TabsTrigger value="image">Image Search</TabsTrigger>
              <TabsTrigger value="voice">Voice Search</TabsTrigger>
            </TabsList>
            
            <TabsContent value="text">
              <form onSubmit={handleSearch} className="flex space-x-2">
                <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search for products, brands, and more..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-10"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button type="submit">Search</Button>
                <Button type="button" variant="outline" onClick={handleVoiceSearch}>
                  <Mic className="h-5 w-5" />
                </Button>
                <Button type="button" variant="outline" onClick={handleImageSearch}>
                  <Camera className="h-5 w-5" />
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="image">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Image Search
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
                  Upload an image to find similar products in our catalog
                </p>
                <div className="flex justify-center">
                  <Button>Upload Image</Button>
                  <Button variant="outline" className="ml-2" onClick={() => setSearchTab("text")}>
                    Cancel
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="voice">
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center">
                <Mic className="h-12 w-12 text-primary animate-pulse mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  Voice Search
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 mb-4">
                  Listening... Speak clearly into your microphone
                </p>
                <Button variant="outline" onClick={() => setSearchTab("text")}>
                  Cancel
                </Button>
              </div>
            </TabsContent>
          </Tabs>
          
          {!searchQuery && (
            <div className="mt-6 space-y-6">
              {recentSearches.length > 0 && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                    Recent Searches
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSearchQuery(search);
                          handleSearch();
                        }}
                        className="flex items-center px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        <span className="mr-1.5 text-gray-400">
                          <SearchIcon className="h-3 w-3" />
                        </span>
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  Popular Searches
                </h2>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchQuery(search);
                        handleSearch();
                      }}
                      className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {searchQuery && (
          <>
            <Separator className="mb-6" />
            
            <div className="pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {sortedProducts.length} results found
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
                    
                    {availableSizes.length > 0 && (
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
                    )}
                    
                    {availableColors.length > 0 && (
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
                    )}
                    
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
                
                {/* Mobile Filters */}
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
                              {availableSizes.length > 0 && (
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
                              )}

                              {/* Color */}
                              {availableColors.length > 0 && (
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
                              )}
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
          </>
        )}
      </div>
    </div>
  );
}
