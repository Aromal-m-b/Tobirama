import mongoose, { Schema, Document } from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import { 
  User, InsertUser,
  Product, InsertProduct,
  Order, InsertOrder,
  OrderItem, InsertOrderItem,
  WishlistItem, InsertWishlistItem, 
  CartItem, InsertCartItem,
  Review, InsertReview
} from "@shared/schema";
import { IStorage } from "./storage";

// MongoDB Connection URI
const MONGODB_URI = "mongodb+srv://aromal:pass@cluster0.czdi4.mongodb.net/ecommerce";

// Connect to MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Define Mongoose Schemas and Models
const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  address: { type: String, default: null },
  city: { type: String, default: null },
  state: { type: String, default: null },
  zipCode: { type: String, default: null },
  country: { type: String, default: null },
  phone: { type: String, default: null },
  isAdmin: { type: Boolean, default: false }
});

const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: null },
  imageUrl: { type: String, required: true },
  imageUrls: { type: [String], default: [] },
  category: { type: String, required: true },
  subcategory: { type: String, default: null },
  featuredProduct: { type: Boolean, default: false },
  trendingProduct: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  inStock: { type: Boolean, default: true },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  colors: { type: [String], default: [] },
  sizes: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now }
});

const OrderSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, default: 'pending' },
  total: { type: Number, required: true },
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  shipping: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  shippingAddress: { type: String, required: true },
  billingAddress: { type: String, required: true },
  trackingNumber: { type: String, default: null },
  estimatedDelivery: { type: Date, default: null },
  notes: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const OrderItemSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  size: { type: String, default: null },
  color: { type: String, default: null }
});

const WishlistItemSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  createdAt: { type: Date, default: Date.now }
});

const CartItemSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  size: { type: String, default: null },
  color: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

const ReviewSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: null },
  createdAt: { type: Date, default: Date.now }
});

// Create Mongoose models
const UserModel = mongoose.model('User', UserSchema);
const ProductModel = mongoose.model('Product', ProductSchema);
const OrderModel = mongoose.model('Order', OrderSchema);
const OrderItemModel = mongoose.model('OrderItem', OrderItemSchema);
const WishlistItemModel = mongoose.model('WishlistItem', WishlistItemSchema);
const CartItemModel = mongoose.model('CartItem', CartItemSchema);
const ReviewModel = mongoose.model('Review', ReviewSchema);

// MongoDB Storage Implementation
export class MongoStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    // Create a MongoDB session store
    this.sessionStore = MongoStore.create({
      mongoUrl: MONGODB_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60 // 1 day
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      if (!user) return undefined;
      // Convert MongoDB _id to id for client compatibility
      return this.transformUser(user);
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ username });
      if (!user) return undefined;
      return this.transformUser(user);
    } catch (error) {
      console.error("Error getting user by username:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ email });
      if (!user) return undefined;
      return this.transformUser(user);
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const user = new UserModel(userData);
      await user.save();
      return this.transformUser(user);
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    try {
      const user = await UserModel.findByIdAndUpdate(id, userData, { new: true });
      if (!user) return undefined;
      return this.transformUser(user);
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users.map(user => this.transformUser(user));
    } catch (error) {
      console.error("Error getting all users:", error);
      return [];
    }
  }

  // Product methods
  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await ProductModel.find();
      return products.map(this.transformProduct);
    } catch (error) {
      console.error("Error getting all products:", error);
      return [];
    }
  }

  async getProductById(id: string): Promise<Product | undefined> {
    try {
      const product = await ProductModel.findById(id);
      if (!product) return undefined;
      return this.transformProduct(product);
    } catch (error) {
      console.error("Error getting product by id:", error);
      return undefined;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const products = await ProductModel.find({ category });
      return products.map(this.transformProduct);
    } catch (error) {
      console.error("Error getting products by category:", error);
      return [];
    }
  }

  async getFeaturedProducts(limit?: number): Promise<Product[]> {
    try {
      let query = ProductModel.find({ featuredProduct: true });
      if (limit) query = query.limit(limit);
      const products = await query.exec();
      return products.map(this.transformProduct);
    } catch (error) {
      console.error("Error getting featured products:", error);
      return [];
    }
  }

  async getTrendingProducts(limit?: number): Promise<Product[]> {
    try {
      let query = ProductModel.find({ trendingProduct: true });
      if (limit) query = query.limit(limit);
      const products = await query.exec();
      return products.map(this.transformProduct);
    } catch (error) {
      console.error("Error getting trending products:", error);
      return [];
    }
  }

  async getNewArrivals(limit?: number): Promise<Product[]> {
    try {
      let query = ProductModel.find({ newArrival: true });
      if (limit) query = query.limit(limit);
      const products = await query.exec();
      return products.map(this.transformProduct);
    } catch (error) {
      console.error("Error getting new arrivals:", error);
      return [];
    }
  }

  async searchProducts(query: string): Promise<Product[]> {
    try {
      const products = await ProductModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { description: { $regex: query, $options: 'i' } },
          { category: { $regex: query, $options: 'i' } },
          { subcategory: { $regex: query, $options: 'i' } }
        ]
      });
      return products.map(this.transformProduct);
    } catch (error) {
      console.error("Error searching products:", error);
      return [];
    }
  }

  async createProduct(productData: InsertProduct): Promise<Product> {
    try {
      const product = new ProductModel(productData);
      await product.save();
      return this.transformProduct(product);
    } catch (error) {
      console.error("Error creating product:", error);
      throw error;
    }
  }

  async updateProduct(id: string, productData: Partial<Product>): Promise<Product | undefined> {
    try {
      const product = await ProductModel.findByIdAndUpdate(id, productData, { new: true });
      if (!product) return undefined;
      return this.transformProduct(product);
    } catch (error) {
      console.error("Error updating product:", error);
      return undefined;
    }
  }

  async deleteProduct(id: string): Promise<boolean> {
    try {
      const result = await ProductModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting product:", error);
      return false;
    }
  }

  // Order methods
  async getOrderById(id: string): Promise<Order | undefined> {
    try {
      const order = await OrderModel.findById(id);
      if (!order) return undefined;
      return this.transformOrder(order);
    } catch (error) {
      console.error("Error getting order by id:", error);
      return undefined;
    }
  }

  async getOrdersByUserId(userId: string): Promise<Order[]> {
    try {
      const orders = await OrderModel.find({ userId });
      return orders.map(this.transformOrder);
    } catch (error) {
      console.error("Error getting orders by user id:", error);
      return [];
    }
  }

  async createOrder(orderData: InsertOrder): Promise<Order> {
    try {
      const order = new OrderModel(orderData);
      await order.save();
      return this.transformOrder(order);
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    try {
      const order = await OrderModel.findByIdAndUpdate(id, { status }, { new: true });
      if (!order) return undefined;
      return this.transformOrder(order);
    } catch (error) {
      console.error("Error updating order status:", error);
      return undefined;
    }
  }

  // Order Item methods
  async getOrderItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    try {
      const orderItems = await OrderItemModel.find({ orderId });
      return orderItems.map(this.transformOrderItem);
    } catch (error) {
      console.error("Error getting order items by order id:", error);
      return [];
    }
  }

  async createOrderItem(orderItemData: InsertOrderItem): Promise<OrderItem> {
    try {
      const orderItem = new OrderItemModel(orderItemData);
      await orderItem.save();
      return this.transformOrderItem(orderItem);
    } catch (error) {
      console.error("Error creating order item:", error);
      throw error;
    }
  }

  // Wishlist methods
  async getWishlistByUserId(userId: string): Promise<WishlistItem[]> {
    try {
      const wishlistItems = await WishlistItemModel.find({ userId });
      return wishlistItems.map(this.transformWishlistItem);
    } catch (error) {
      console.error("Error getting wishlist by user id:", error);
      return [];
    }
  }

  async addToWishlist(wishlistItemData: InsertWishlistItem): Promise<WishlistItem> {
    try {
      // Check if item already exists
      const existing = await WishlistItemModel.findOne({
        userId: wishlistItemData.userId,
        productId: wishlistItemData.productId
      });

      if (existing) {
        return this.transformWishlistItem(existing);
      }

      const wishlistItem = new WishlistItemModel(wishlistItemData);
      await wishlistItem.save();
      return this.transformWishlistItem(wishlistItem);
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      throw error;
    }
  }

  async removeFromWishlist(userId: string, productId: string): Promise<boolean> {
    try {
      const result = await WishlistItemModel.findOneAndDelete({
        userId,
        productId
      });
      return !!result;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  }

  // Cart methods
  async getCartByUserId(userId: string): Promise<CartItem[]> {
    try {
      const cartItems = await CartItemModel.find({ userId });
      return cartItems.map(this.transformCartItem);
    } catch (error) {
      console.error("Error getting cart by user id:", error);
      return [];
    }
  }

  async addToCart(cartItemData: InsertCartItem): Promise<CartItem> {
    try {
      // Check if item already exists
      const existing = await CartItemModel.findOne({
        userId: cartItemData.userId,
        productId: cartItemData.productId,
        size: cartItemData.size,
        color: cartItemData.color
      });

      if (existing) {
        const updatedItem = await CartItemModel.findByIdAndUpdate(
          existing._id,
          { quantity: existing.quantity + cartItemData.quantity },
          { new: true }
        );
        return this.transformCartItem(updatedItem!);
      }

      const cartItem = new CartItemModel(cartItemData);
      await cartItem.save();
      return this.transformCartItem(cartItem);
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  }

  async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
    try {
      const cartItem = await CartItemModel.findByIdAndUpdate(
        id,
        { quantity },
        { new: true }
      );
      if (!cartItem) return undefined;
      return this.transformCartItem(cartItem);
    } catch (error) {
      console.error("Error updating cart item:", error);
      return undefined;
    }
  }

  async removeFromCart(id: string): Promise<boolean> {
    try {
      const result = await CartItemModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error removing from cart:", error);
      return false;
    }
  }

  async clearCart(userId: string): Promise<boolean> {
    try {
      const result = await CartItemModel.deleteMany({ userId });
      return result.deletedCount > 0;
    } catch (error) {
      console.error("Error clearing cart:", error);
      return false;
    }
  }

  // Review methods
  async getReviewsByProductId(productId: string): Promise<Review[]> {
    try {
      const reviews = await ReviewModel.find({ productId });
      return reviews.map(this.transformReview);
    } catch (error) {
      console.error("Error getting reviews by product id:", error);
      return [];
    }
  }

  async createReview(reviewData: InsertReview): Promise<Review> {
    try {
      const review = new ReviewModel(reviewData);
      await review.save();
      
      // Update product rating and review count
      const reviews = await ReviewModel.find({ productId: reviewData.productId });
      const reviewCount = reviews.length;
      const rating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviewCount;
      
      await ProductModel.findByIdAndUpdate(reviewData.productId, {
        rating,
        reviewCount
      });
      
      return this.transformReview(review);
    } catch (error) {
      console.error("Error creating review:", error);
      throw error;
    }
  }

  // Helper methods to transform MongoDB documents to plain objects
  private transformUser(user: any): User {
    const { _id, __v, ...rest } = user.toObject();
    return { id: _id.toString(), ...rest };
  }

  private transformProduct(product: any): Product {
    const { _id, __v, ...rest } = product.toObject();
    return { id: _id.toString(), ...rest };
  }

  private transformOrder(order: any): Order {
    const { _id, __v, ...rest } = order.toObject();
    return { id: _id.toString(), ...rest };
  }

  private transformOrderItem(orderItem: any): OrderItem {
    const { _id, __v, ...rest } = orderItem.toObject();
    return { id: _id.toString(), ...rest };
  }

  private transformWishlistItem(wishlistItem: any): WishlistItem {
    const { _id, __v, ...rest } = wishlistItem.toObject();
    return { id: _id.toString(), ...rest };
  }

  private transformCartItem(cartItem: any): CartItem {
    const { _id, __v, ...rest } = cartItem.toObject();
    return { id: _id.toString(), ...rest };
  }

  private transformReview(review: any): Review {
    const { _id, __v, ...rest } = review.toObject();
    return { id: _id.toString(), ...rest };
  }

  // Initialize with sample data if needed
  async initializeData() {
    try {
      // Check if the database is empty and add sample data if needed
      const userCount = await UserModel.countDocuments();
      const productCount = await ProductModel.countDocuments();
      console.log(`Database contains ${userCount} users and ${productCount} products`);
      
      if (userCount === 0 || productCount === 0) {
        console.log("Initializing database with sample data...");
      
      // Create admin user
      const adminUser = new UserModel({
        username: "admin",
        password: "admin123", // This would be hashed in a real app
        email: "admin@example.com",
        firstName: "Admin",
        lastName: "User",
        isAdmin: true
      });
      await adminUser.save();
      
      // Create regular user
      const regularUser = new UserModel({
        username: "user",
        password: "user123", // This would be hashed in a real app
        email: "user@example.com",
        firstName: "Regular",
        lastName: "User",
        isAdmin: false
      });
      await regularUser.save();
      
      // Create sample products
      const products = [
        {
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
          inStock: true,
          rating: 4.9,
          reviewCount: 120,
          colors: ["Blue", "Black", "Gray"],
          sizes: ["S", "M", "L", "XL"]
        },
        {
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
          inStock: true,
          rating: 4.7,
          reviewCount: 87,
          colors: ["Black", "White", "Gray"],
          sizes: ["S", "M", "L", "XL", "XXL"]
        },
        {
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
          inStock: true,
          rating: 4.5,
          reviewCount: 56,
          colors: ["White", "Black", "Gray", "Blue"],
          sizes: ["7", "8", "9", "10", "11", "12"]
        }
      ];
      
      for (const productData of products) {
        const product = new ProductModel(productData);
        await product.save();
      }
      
      console.log("Sample data initialized successfully!");
    }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }
}