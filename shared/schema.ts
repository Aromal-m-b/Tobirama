import { z } from "zod";

// All schemas now use string IDs for MongoDB compatibility
// Rather than using pgTable, we define Zod schemas directly

// Users
export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  city: z.string().nullable().optional(),
  state: z.string().nullable().optional(),
  zipCode: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  isAdmin: z.boolean().default(false),
});

export const insertUserSchema = userSchema.omit({ 
  id: true 
}).partial({
  firstName: true,
  lastName: true,
  address: true,
  city: true,
  state: true,
  zipCode: true,
  country: true,
  phone: true,
  isAdmin: true,
});

// Products
export const productSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  compareAtPrice: z.number().nullable().optional(),
  imageUrl: z.string(),
  imageUrls: z.array(z.string()),
  category: z.string(),
  subcategory: z.string().nullable().optional(),
  featuredProduct: z.boolean().default(false),
  trendingProduct: z.boolean().default(false),
  newArrival: z.boolean().default(false),
  inStock: z.boolean().default(true),
  rating: z.number().default(0),
  reviewCount: z.number().default(0),
  colors: z.array(z.string()),
  sizes: z.array(z.string()),
  createdAt: z.date().nullable().optional(),
});

export const insertProductSchema = productSchema.omit({
  id: true,
  createdAt: true,
});

// Orders
export const orderSchema = z.object({
  id: z.string(),
  userId: z.string(),
  total: z.number(),
  subtotal: z.number(),
  tax: z.number(),
  shipping: z.number(),
  status: z.string().default("pending"),
  paymentMethod: z.string(),
  shippingAddress: z.string(),
  billingAddress: z.string(),
  trackingNumber: z.string().nullable().optional(),
  estimatedDelivery: z.date().nullable().optional(),
  notes: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export const insertOrderSchema = orderSchema.omit({
  id: true,
  createdAt: true,
});

// Order Items
export const orderItemSchema = z.object({
  id: z.string(),
  orderId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  price: z.number(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
});

export const insertOrderItemSchema = orderItemSchema.omit({
  id: true,
});

// Wishlist Items
export const wishlistItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  createdAt: z.date().nullable().optional(),
});

export const insertWishlistItemSchema = wishlistItemSchema.omit({
  id: true,
  createdAt: true,
});

// Cart Items
export const cartItemSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  quantity: z.number(),
  size: z.string().nullable().optional(),
  color: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export const insertCartItemSchema = cartItemSchema.omit({
  id: true,
  createdAt: true,
});

// Reviews
export const reviewSchema = z.object({
  id: z.string(),
  userId: z.string(),
  productId: z.string(),
  rating: z.number(),
  comment: z.string().nullable().optional(),
  createdAt: z.date().nullable().optional(),
});

export const insertReviewSchema = reviewSchema.omit({
  id: true,
  createdAt: true,
});

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;

export type Order = z.infer<typeof orderSchema>;
export type InsertOrder = z.infer<typeof insertOrderSchema>;

export type OrderItem = z.infer<typeof orderItemSchema>;
export type InsertOrderItem = z.infer<typeof insertOrderItemSchema>;

export type WishlistItem = z.infer<typeof wishlistItemSchema>;
export type InsertWishlistItem = z.infer<typeof insertWishlistItemSchema>;

export type CartItem = z.infer<typeof cartItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;

export type Review = z.infer<typeof reviewSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
