import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { CheckCircle, Package, Truck, ChevronRight, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

// Sample order data - in a real app this would come from an API
const mockOrderData = {
  items: [
    {
      id: 1,
      name: "Denim Jacket",
      price: 89.99,
      quantity: 1,
      size: "M",
      color: "Blue",
      imageUrl: "https://images.unsplash.com/photo-1618354691551-44de113f0164?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
    {
      id: 2,
      name: "Graphic Tee",
      price: 29.99,
      quantity: 2,
      size: "L",
      color: "Black",
      imageUrl: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    },
  ],
  shippingAddress: {
    name: "John Doe",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  paymentMethod: "Credit Card",
  subtotal: 149.97,
  shipping: 0,
  tax: 15.00,
  total: 164.97,
};

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const orderId = id || "N/A";
  const [orderItems, setOrderItems] = useState(mockOrderData.items);
  
  // Estimate delivery date (5 days from now)
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 5);
  
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 md:p-8">
          <div className="text-center pb-6">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Order Confirmed!
            </h1>
            <p className="mt-2 text-base text-gray-500 dark:text-gray-400">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
          </div>
          
          <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 md:p-6 flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Order Number</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{orderId}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Estimated Delivery</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {formattedDeliveryDate}
              </p>
            </div>
            <div>
              <Button asChild>
                <Link href={`/order-tracking/${orderId}`}>
                  <a>
                    Track Order
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Details</h2>
            <div className="mt-4 flow-root">
              <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                {orderItems.map((item) => (
                  <li key={`${item.id}-${item.size}-${item.color}`} className="py-5 flex">
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
                        <p className="text-gray-500 dark:text-gray-400">
                          Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <Separator className="my-6" />
            
            <div className="space-y-4">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">${mockOrderData.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Shipping</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockOrderData.shipping === 0 ? "Free" : `$${mockOrderData.shipping.toFixed(2)}`}
                </p>
              </div>
              <div className="flex justify-between">
                <p className="text-sm text-gray-600 dark:text-gray-400">Tax</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">${mockOrderData.tax.toFixed(2)}</p>
              </div>
              <Separator />
              <div className="flex justify-between">
                <p className="text-base font-medium text-gray-900 dark:text-white">Total</p>
                <p className="text-base font-medium text-gray-900 dark:text-white">${mockOrderData.total.toFixed(2)}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shipping Information</h2>
              <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockOrderData.shippingAddress.name}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {mockOrderData.shippingAddress.address}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mockOrderData.shippingAddress.city}, {mockOrderData.shippingAddress.state} {mockOrderData.shippingAddress.zipCode}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {mockOrderData.shippingAddress.country}
                </p>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment Information</h2>
              <div className="mt-4 bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {mockOrderData.paymentMethod}
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Amount: ${mockOrderData.total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 space-y-4">
            <div className="flex justify-between">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shipping Updates</h2>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/order-tracking/${orderId}`}>
                  <a>
                    View Details
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                </Link>
              </Button>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">Order Confirmed</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Your order has been received and is being processed.
                  </p>
                </div>
                <div className="ml-auto text-sm text-gray-500 dark:text-gray-400">
                  {new Date().toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <Package className="h-6 w-6 text-primary mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Order Processing</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  In progress
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <Truck className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Shipping</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Pending
                </p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <Calendar className="h-6 w-6 text-gray-400 mr-3" />
              <div>
                <h3 className="text-sm font-medium text-gray-900 dark:text-white">Estimated Delivery</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formattedDeliveryDate}
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-10 flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button variant="outline" className="flex-1" asChild>
              <Link href="/">
                <a>Continue Shopping</a>
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/order-tracking/${orderId}`}>
                <a>Track Order</a>
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Need help? <a href="#" className="text-primary hover:text-primary-dark">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
