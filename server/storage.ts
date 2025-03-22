import { 
  User, InsertUser, 
  Product, InsertProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  WishlistItem, InsertWishlistItem,
  CartItem, InsertCartItem,
  Review, InsertReview
} from "@shared/schema";
import session from "express-session";
import memorystore from "memorystore";

const MemoryStore = memorystore(session);

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  
  // Product methods
  getAllProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(limit?: number): Promise<Product[]>;
  getTrendingProducts(limit?: number): Promise<Product[]>;
  getNewArrivals(limit?: number): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, product: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Order methods
  getOrderById(id: string): Promise<Order | undefined>;
  getOrdersByUserId(userId: string): Promise<Order[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
  
  // Order Item methods
  getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Wishlist methods
  getWishlistByUserId(userId: string): Promise<WishlistItem[]>;
  addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem>;
  removeFromWishlist(userId: string, productId: string): Promise<boolean>;
  
  // Cart methods
  getCartByUserId(userId: string): Promise<CartItem[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  // Review methods
  getReviewsByProductId(productId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  // Session store
  sessionStore: session.Store;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;
  private orders: Map<string, Order>;
  private orderItems: Map<string, OrderItem>;
  private wishlistItems: Map<string, WishlistItem>;
  private cartItems: Map<string, CartItem>;
  private reviews: Map<string, Review>;
  
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private productIdCounter: number;
  private orderIdCounter: number;
  private orderItemIdCounter: number;
  private wishlistItemIdCounter: number;
  private cartItemIdCounter: number;
  private reviewIdCounter: number;
  
  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.orders = new Map();
    this.orderItems = new Map();
    this.wishlistItems = new Map();
    this.cartItems = new Map();
    this.reviews = new Map();
    
    this.userIdCounter = 1;
    this.productIdCounter = 1;
    this.orderIdCounter = 1;
    this.orderItemIdCounter = 1;
    this.wishlistItemIdCounter = 1;
    this.cartItemIdCounter = 1;
    this.reviewIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // 24 hours
    });
    
    // Initialize with some sample data
    this.initializeData();
  }
  
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }
  
  async createUser(user: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const newUser: User = { ...user, id, isAdmin: false };
    this.users.set(id, newUser);
    return newUser;
  }
  
  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
  
  // Product methods
  async getAllProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }
  
  async getProductById(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }
  
  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    const featured = Array.from(this.products.values()).filter(
      (product) => product.featuredProduct
    );
    
    return limit ? featured.slice(0, limit) : featured;
  }
  
  async getTrendingProducts(limit?: number): Promise<Product[]> {
    const trending = Array.from(this.products.values()).filter(
      (product) => product.trendingProduct
    );
    
    return limit ? trending.slice(0, limit) : trending;
  }
  
  async getNewArrivals(limit?: number): Promise<Product[]> {
    const newArrivals = Array.from(this.products.values()).filter(
      (product) => product.newArrival
    );
    
    return limit ? newArrivals.slice(0, limit) : newArrivals;
  }
  
  async searchProducts(query: string): Promise<Product[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.description.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        (product.subcategory && product.subcategory.toLowerCase().includes(lowerQuery))
    );
  }
  
  async createProduct(product: InsertProduct): Promise<Product> {
    const id = this.productIdCounter++;
    const newProduct: Product = { 
      ...product, 
      id, 
      rating: product.rating || 0,
      reviewCount: product.reviewCount || 0,
      createdAt: new Date() 
    };
    this.products.set(id, newProduct);
    return newProduct;
  }
  
  async updateProduct(id: number, productData: Partial<Product>): Promise<Product | undefined> {
    const product = this.products.get(id);
    if (!product) return undefined;
    
    const updatedProduct = { ...product, ...productData };
    this.products.set(id, updatedProduct);
    return updatedProduct;
  }
  
  async deleteProduct(id: number): Promise<boolean> {
    return this.products.delete(id);
  }
  
  // Order methods
  async getOrderById(id: number): Promise<Order | undefined> {
    return this.orders.get(id);
  }
  
  async getOrdersByUserId(userId: number): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(
      (order) => order.userId === userId
    );
  }
  
  async createOrder(order: InsertOrder): Promise<Order> {
    const id = this.orderIdCounter++;
    const newOrder: Order = { 
      ...order, 
      id, 
      createdAt: new Date() 
    };
    this.orders.set(id, newOrder);
    return newOrder;
  }
  
  async updateOrderStatus(id: number, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updatedOrder = { ...order, status };
    this.orders.set(id, updatedOrder);
    return updatedOrder;
  }
  
  // Order Item methods
  async getOrderItemsByOrderId(orderId: number): Promise<OrderItem[]> {
    return Array.from(this.orderItems.values()).filter(
      (item) => item.orderId === orderId
    );
  }
  
  async createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem> {
    const id = this.orderItemIdCounter++;
    const newOrderItem: OrderItem = { ...orderItem, id };
    this.orderItems.set(id, newOrderItem);
    return newOrderItem;
  }
  
  // Wishlist methods
  async getWishlistByUserId(userId: number): Promise<WishlistItem[]> {
    return Array.from(this.wishlistItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async addToWishlist(wishlistItem: InsertWishlistItem): Promise<WishlistItem> {
    // Check if item already exists
    const existing = Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === wishlistItem.userId && item.productId === wishlistItem.productId
    );
    
    if (existing) {
      return existing;
    }
    
    const id = this.wishlistItemIdCounter++;
    const newWishlistItem: WishlistItem = { 
      ...wishlistItem, 
      id, 
      createdAt: new Date() 
    };
    this.wishlistItems.set(id, newWishlistItem);
    return newWishlistItem;
  }
  
  async removeFromWishlist(userId: number, productId: number): Promise<boolean> {
    const item = Array.from(this.wishlistItems.values()).find(
      (item) => item.userId === userId && item.productId === productId
    );
    
    if (!item) return false;
    return this.wishlistItems.delete(item.id);
  }
  
  // Cart methods
  async getCartByUserId(userId: number): Promise<CartItem[]> {
    return Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
  }
  
  async addToCart(cartItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists
    const existing = Array.from(this.cartItems.values()).find(
      (item) => 
        item.userId === cartItem.userId && 
        item.productId === cartItem.productId &&
        item.size === cartItem.size &&
        item.color === cartItem.color
    );
    
    if (existing) {
      return this.updateCartItem(existing.id, existing.quantity + cartItem.quantity) as Promise<CartItem>;
    }
    
    const id = this.cartItemIdCounter++;
    const newCartItem: CartItem = { 
      ...cartItem, 
      id, 
      createdAt: new Date() 
    };
    this.cartItems.set(id, newCartItem);
    return newCartItem;
  }
  
  async updateCartItem(id: number, quantity: number): Promise<CartItem | undefined> {
    const cartItem = this.cartItems.get(id);
    if (!cartItem) return undefined;
    
    const updatedCartItem = { ...cartItem, quantity };
    this.cartItems.set(id, updatedCartItem);
    return updatedCartItem;
  }
  
  async removeFromCart(id: number): Promise<boolean> {
    return this.cartItems.delete(id);
  }
  
  async clearCart(userId: number): Promise<boolean> {
    const cartItems = Array.from(this.cartItems.values()).filter(
      (item) => item.userId === userId
    );
    
    let success = true;
    for (const item of cartItems) {
      const result = this.cartItems.delete(item.id);
      if (!result) success = false;
    }
    
    return success;
  }
  
  // Review methods
  async getReviewsByProductId(productId: number): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter(
      (review) => review.productId === productId
    );
  }
  
  async createReview(review: InsertReview): Promise<Review> {
    const id = this.reviewIdCounter++;
    const newReview: Review = { 
      ...review, 
      id, 
      createdAt: new Date() 
    };
    this.reviews.set(id, newReview);
    
    // Update product rating and review count
    const product = this.products.get(review.productId);
    if (product) {
      const productReviews = await this.getReviewsByProductId(review.productId);
      const reviewCount = productReviews.length;
      const rating = productReviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
      
      await this.updateProduct(product.id, { 
        rating, 
        reviewCount 
      });
    }
    
    return newReview;
  }
  
  // Initialize with sample data
  private async initializeData() {
    // Create admin user
    const adminUser: InsertUser = {
      username: "admin",
      password: "admin123", // This would be hashed in a real app
      email: "admin@example.com",
      firstName: "Admin",
      lastName: "User"
    };
    const admin = await this.createUser(adminUser);
    await this.updateUser(admin.id, { isAdmin: true });
    
    // Create regular user
    const regularUser: InsertUser = {
      username: "user",
      password: "user123", // This would be hashed in a real app
      email: "user@example.com",
      firstName: "Regular",
      lastName: "User"
    };
    await this.createUser(regularUser);
    
    // Create products
    const product1: InsertProduct = {
      name: "Denim Jacket",
      description: "A stylish denim jacket perfect for casual outings",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1618354691551-44de113f0164?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1618354691551-44de113f0164?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "Jackets",
      featuredProduct: true,
      trendingProduct: false,
      newArrival: true,
      rating: 4.9,
      reviewCount: 120,
      colors: ["Blue", "Black", "Gray"],
      sizes: ["S", "M", "L", "XL"]
    };
    await this.createProduct(product1);
    
    const product2: InsertProduct = {
      name: "Graphic Tee",
      description: "A comfortable graphic t-shirt for everyday wear",
      price: 29.99,
      imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "T-Shirts",
      featuredProduct: true,
      trendingProduct: true,
      newArrival: false,
      rating: 4.7,
      reviewCount: 87,
      colors: ["Black", "White", "Gray"],
      sizes: ["S", "M", "L", "XL", "XXL"]
    };
    await this.createProduct(product2);
    
    const product3: InsertProduct = {
      name: "Casual Sneakers",
      description: "Stylish and comfortable sneakers for everyday use",
      price: 69.99,
      imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "Footwear",
      featuredProduct: true,
      trendingProduct: false,
      newArrival: false,
      rating: 4.5,
      reviewCount: 56,
      colors: ["White", "Black", "Gray", "Blue"],
      sizes: ["7", "8", "9", "10", "11", "12"]
    };
    await this.createProduct(product3);
    
    const product4: InsertProduct = {
      name: "Slim Fit Jeans",
      description: "Comfortable slim fit jeans that go with everything",
      price: 59.99,
      imageUrl: "https://images.unsplash.com/photo-1475180098004-ca77a66827be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1475180098004-ca77a66827be?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "Jeans",
      featuredProduct: true,
      trendingProduct: false,
      newArrival: false,
      rating: 4.8,
      reviewCount: 142,
      colors: ["Blue", "Black", "Gray"],
      sizes: ["28", "30", "32", "34", "36"]
    };
    await this.createProduct(product4);
    
    const product5: InsertProduct = {
      name: "Winter Coat",
      description: "A warm winter coat for cold weather",
      price: 129.99,
      imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "Jackets",
      featuredProduct: false,
      trendingProduct: true,
      newArrival: false,
      rating: 4.6,
      reviewCount: 98,
      colors: ["Black", "Gray", "Navy"],
      sizes: ["S", "M", "L", "XL"]
    };
    await this.createProduct(product5);
    
    const product6: InsertProduct = {
      name: "Summer Dress",
      description: "A light and comfortable summer dress",
      price: 49.99,
      imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "Dresses",
      featuredProduct: false,
      trendingProduct: true,
      newArrival: true,
      rating: 4.7,
      reviewCount: 64,
      colors: ["White", "Blue", "Pink"],
      sizes: ["XS", "S", "M", "L"]
    };
    await this.createProduct(product6);
    
    const product7: InsertProduct = {
      name: "Leather Bag",
      description: "A stylish leather bag for everyday use",
      price: 79.99,
      imageUrl: "https://images.unsplash.com/photo-1605908502724-9093a79a1b39?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1605908502724-9093a79a1b39?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "Accessories",
      featuredProduct: false,
      trendingProduct: true,
      newArrival: false,
      rating: 4.9,
      reviewCount: 42,
      colors: ["Brown", "Black", "Tan"],
      sizes: ["One Size"]
    };
    await this.createProduct(product7);
    
    const product8: InsertProduct = {
      name: "Sport Shoes",
      description: "Comfortable sport shoes for athletics",
      price: 89.99,
      imageUrl: "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
      imageUrls: [
        "https://images.unsplash.com/photo-1516478177764-9fe5bd7e9717?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
      ],
      category: "Footwear",
      featuredProduct: false,
      trendingProduct: true,
      newArrival: true,
      rating: 4.5,
      reviewCount: 78,
      colors: ["Black", "White", "Red", "Blue"],
      sizes: ["7", "8", "9", "10", "11", "12"]
    };
    await this.createProduct(product8);
  }
}

// Use MongoDB storage instead of MemStorage
import { MongoStorage } from "./mongo-storage";
export const storage = new MongoStorage();
