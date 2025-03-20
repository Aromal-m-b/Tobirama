import { useState } from "react";
import { Link } from "wouter";
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

export default function CartPage() {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);
  const [discount, setDiscount] = useState(0);
  
  const shipping = cartTotal > 50 ? 0 : 5.99;
  const tax = (cartTotal - discount) * 0.10;
  const finalTotal = cartTotal - discount + shipping + tax;
  
  const handleApplyPromo = () => {
    setIsApplyingPromo(true);
    
    // Simulate API call
    setTimeout(() => {
      if (promoCode.toLowerCase() === "discount10") {
        const discountAmount = cartTotal * 0.1;
        setDiscount(discountAmount);
        toast({
          title: "Promo code applied",
          description: `You saved $${discountAmount.toFixed(2)}!`,
        });
      } else {
        toast({
          title: "Invalid promo code",
          description: "Please enter a valid promo code.",
          variant: "destructive",
        });
      }
      setIsApplyingPromo(false);
    }, 800);
  };
  
  return (
    <div className="bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
        
        {cartItems.length === 0 ? (
          <div className="mt-12 text-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <ShoppingCart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">Your cart is empty</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Looks like you haven't added any products to your cart yet.
            </p>
            <div className="mt-6">
              <Button asChild>
                <Link href="/products">
                  <a>Continue Shopping</a>
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                <ul role="list" className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
                    <li key={`${item.id}-${item.size}-${item.color}`} className="flex py-6 px-4 sm:px-6">
                      <div className="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>

                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                            <h3>
                              <Link href={`/product/${item.id}`}>
                                <a className="hover:text-primary">{item.name}</a>
                              </Link>
                            </h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between text-sm">
                          <div className="flex items-center border rounded-md">
                            <button
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size, item.color)}
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 text-gray-900 dark:text-white">{item.quantity}</span>
                            <button
                              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size, item.color)}
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="flex">
                            <button
                              type="button"
                              className="font-medium text-primary hover:text-primary-dark flex items-center"
                              onClick={() => removeFromCart(item.id, item.size, item.color)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="px-4 sm:px-6 py-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </Button>
                    <Button asChild>
                      <Link href="/products">
                        <a>Continue Shopping</a>
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div>
              <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg">
                <div className="px-4 py-6 sm:px-6">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>
                  
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</p>
                    </div>
                    
                    {discount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <p className="text-sm">Discount</p>
                        <p className="text-sm font-medium">-${discount.toFixed(2)}</p>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Shipping</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
                      </p>
                    </div>
                    
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-600 dark:text-gray-400">Tax (10%)</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">${tax.toFixed(2)}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="flex justify-between">
                      <p className="text-base font-medium text-gray-900 dark:text-white">Total</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">${finalTotal.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex items-center">
                      <Input
                        type="text"
                        placeholder="Promo code"
                        className="flex-1"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                      />
                      <Button
                        className="ml-2"
                        onClick={handleApplyPromo}
                        disabled={!promoCode || isApplyingPromo}
                      >
                        {isApplyingPromo ? "Applying..." : "Apply"}
                      </Button>
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Try "DISCOUNT10" for 10% off your order.
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <Button className="w-full" size="lg" asChild>
                      <Link href="/checkout">
                        <a className="flex items-center justify-center">
                          Proceed to Checkout
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Link>
                    </Button>
                  </div>
                  
                  <div className="mt-6 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Need help? <a href="#" className="text-primary hover:text-primary-dark">Contact us</a>
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm rounded-lg p-4 sm:p-6">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">We Accept</h3>
                <div className="mt-2 flex space-x-2">
                  <svg className="h-8 w-auto" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="visa-label">
                    <title id="visa-label">Visa</title>
                    <rect width="36" height="24" fill="#fff"></rect>
                    <path d="M10.75 9.75H8.25L6.75 16.5L6 11.25C6 11.25 5.85 9.75 4.125 9.75H0.75L0.75 10.125C0.75 10.125 1.5 10.3125 2.625 10.875L4.5 16.5H7.125L10.75 9.75ZM11.25 16.5H13.5L15 9.75H12.75L11.25 16.5ZM22.125 11.625C22.125 11.625 22.5 10.875 21 10.3125C19.5 9.75 19.125 10.875 19.125 10.875C19.125 10.875 18.75 12 20.25 12.5625C21.75 13.125 21.375 14.25 21.375 14.25C21.375 14.25 21 15.75 18.75 14.8125L18.375 16.125C18.375 16.125 18.75 16.5 19.875 16.5C21 16.5 22.5 15.5625 22.5 13.875C22.5 12.1875 20.625 11.625 20.625 11.625H22.125ZM25.5 13.125L27 9.75H24.375L21.75 16.5H24.375L24.75 15.375H27.375L27.75 16.5H30L27.75 9.75H25.5L25.5 13.125ZM25.5 13.875L26.25 12.1875L26.625 13.875H25.5Z" fill="#142787"></path>
                  </svg>
                  <svg className="h-8 w-auto" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="mastercard-label">
                    <title id="mastercard-label">Mastercard</title>
                    <rect width="36" height="24" fill="#fff"></rect>
                    <circle cx="14.5" cy="12" r="6.5" fill="#EB001B"></circle>
                    <circle cx="21.5" cy="12" r="6.5" fill="#F79E1B"></circle>
                    <path d="M18 7.5C19.3807 8.77527 20.1676 10.5787 20.1676 12.4768C20.1676 14.3749 19.3807 16.1783 18 17.4535C16.6193 16.1783 15.8324 14.3749 15.8324 12.4768C15.8324 10.5787 16.6193 8.77527 18 7.5Z" fill="#FF5F00"></path>
                  </svg>
                  <svg className="h-8 w-auto" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="amex-label">
                    <title id="amex-label">American Express</title>
                    <rect width="36" height="24" fill="#fff"></rect>
                    <path d="M35.5 24H0.5V0H35.5V24Z" fill="#006FCF"></path>
                    <path d="M19.228 5.125H27.37V7.547H19.76V9.334H27.313V11.67H19.76V13.576H27.37V16.019H19.228V5.125Z" fill="white"></path>
                    <path d="M18.2 10.571C18.2 13.264 16.132 15.333 13.44 15.333C10.747 15.333 8.679 13.264 8.679 10.571C8.679 7.879 10.747 5.81 13.44 5.81C16.132 5.81 18.2 7.879 18.2 10.571Z" fill="white"></path>
                  </svg>
                  <svg className="h-8 w-auto" viewBox="0 0 36 24" xmlns="http://www.w3.org/2000/svg" role="img" aria-labelledby="paypal-label">
                    <title id="paypal-label">PayPal</title>
                    <rect width="36" height="24" fill="#fff"></rect>
                    <path d="M28.07 8.937H25.217C25.089 8.937 24.976 9.016 24.929 9.134L23.321 14.482C23.29 14.56 23.322 14.647 23.397 14.69C23.426 14.706 23.459 14.714 23.492 14.714H24.844C24.929 14.714 25.006 14.66 25.029 14.577L25.366 13.194C25.388 13.111 25.466 13.057 25.55 13.057H26.347C27.476 13.057 28.174 12.472 28.352 11.392C28.434 10.912 28.35 10.535 28.122 10.274C27.871 9.984 27.438 9.857 27.039 9.857M27.094 11.454C26.995 12.032 26.546 12.032 26.108 12.032H25.756L26.076 10.709C26.09 10.652 26.14 10.611 26.199 10.611H26.359C26.652 10.611 26.93 10.611 27.073 10.768C27.154 10.858 27.15 11.114 27.093 11.454H27.094Z" fill="#253D80"></path>
                    <path d="M13.891 8.937H11.038C10.91 8.937 10.797 9.016 10.75 9.134L9.142 14.482C9.111 14.56 9.143 14.647 9.218 14.69C9.247 14.706 9.28 14.714 9.313 14.714H10.648C10.776 14.714 10.886 14.637 10.933 14.517L11.289 13.099C11.312 13.015 11.39 12.962 11.474 12.962H12.271C13.4 12.962 14.097 12.377 14.276 11.297C14.358 10.816 14.274 10.44 14.046 10.179C13.794 9.984 13.438 9.857 13.039 9.857M13.094 11.454C12.996 12.032 12.546 12.032 12.108 12.032H11.756L12.077 10.709C12.09 10.652 12.141 10.611 12.199 10.611H12.359C12.652 10.611 12.93 10.611 13.073 10.768C13.154 10.857 13.15 11.114 13.093 11.454H13.094Z" fill="#253D80"></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
