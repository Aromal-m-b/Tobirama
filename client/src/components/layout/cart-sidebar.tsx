import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { cartItems, removeFromCart, updateCartQuantity, cartTotal } = useCart();

  // Close cart when clicking outside
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        />
        <div className="fixed inset-y-0 right-0 max-w-full flex">
          <div className="w-screen max-w-md">
            <div className="h-full flex flex-col bg-white dark:bg-gray-900 shadow-xl">
              <div className="flex-1 py-6 overflow-y-auto px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shopping cart</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button 
                      onClick={onClose}
                      className="bg-white dark:bg-gray-900 rounded-md text-gray-400 hover:text-gray-500 focus:outline-none"
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                </div>

                <div className="mt-8">
                  {cartItems.length === 0 ? (
                    <div className="py-10 text-center">
                      <ShoppingCart className="h-12 w-12 mx-auto text-gray-300" />
                      <p className="mt-4 text-gray-500 dark:text-gray-400">Your cart is empty</p>
                      <Button 
                        onClick={() => {
                          onClose();
                        }}
                        className="mt-6"
                      >
                        Continue Shopping
                      </Button>
                    </div>
                  ) : (
                    <ul role="list" className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                      {cartItems.map((item) => (
                        <li key={`${item.id}-${item.size}-${item.color}`} className="py-6 flex">
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
                              <div className="flex items-center border rounded">
                                <button 
                                  className="px-2 py-1 text-gray-600 dark:text-gray-400" 
                                  onClick={() => updateCartQuantity(item.id, item.quantity - 1, item.size, item.color)}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus className="h-4 w-4" />
                                </button>
                                <span className="px-2 py-1 text-gray-800 dark:text-gray-200">{item.quantity}</span>
                                <button 
                                  className="px-2 py-1 text-gray-600 dark:text-gray-400" 
                                  onClick={() => updateCartQuantity(item.id, item.quantity + 1, item.size, item.color)}
                                >
                                  <Plus className="h-4 w-4" />
                                </button>
                              </div>

                              <div className="flex">
                                <button 
                                  onClick={() => removeFromCart(item.id, item.size, item.color)}
                                  type="button" 
                                  className="font-medium text-primary hover:text-primary-dark"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              {cartItems.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-700 py-6 px-4 sm:px-6">
                  <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                    <p>Subtotal</p>
                    <p>${cartTotal.toFixed(2)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <Link href="/checkout">
                      <a 
                        onClick={onClose}
                        className="w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Checkout
                      </a>
                    </Link>
                  </div>
                  <div className="mt-6 flex justify-center text-sm text-center text-gray-500 dark:text-gray-400">
                    <p>
                      or{" "}
                      <button 
                        onClick={() => {
                          onClose();
                        }}
                        className="text-primary font-medium hover:text-primary-dark"
                      >
                        Continue Shopping
                        <span aria-hidden="true"> &rarr;</span>
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShoppingCart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      {...props}
    >
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}
