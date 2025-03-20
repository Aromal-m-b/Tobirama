import { useState, useEffect } from "react";
import { useParams, Link } from "wouter";
import {
  Package,
  Truck,
  ArrowLeft,
  Home,
  CheckCircle,
  Clock,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Order statuses with their descriptions
const ORDER_STATUSES = {
  "order-placed": {
    label: "Order Placed",
    description: "Your order has been confirmed and is being processed.",
    icon: <Package className="h-6 w-6" />,
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(), // Yesterday
    color: "text-green-500",
    completed: true,
  },
  "processing": {
    label: "Processing",
    description: "Your order is being prepared for shipping.",
    icon: <Package className="h-6 w-6" />,
    date: new Date(Date.now() - 12 * 60 * 60 * 1000).toLocaleDateString(), // 12 hours ago
    color: "text-green-500",
    completed: true,
  },
  "shipped": {
    label: "Shipped",
    description: "Your order has been shipped and is on its way.",
    icon: <Truck className="h-6 w-6" />,
    date: new Date().toLocaleDateString(), // Today
    color: "text-blue-500",
    completed: true,
  },
  "out-for-delivery": {
    label: "Out for Delivery",
    description: "Your order is out for delivery and will arrive soon.",
    icon: <Truck className="h-6 w-6" />,
    date: "", // Will be determined
    color: "text-yellow-500",
    completed: false,
  },
  "delivered": {
    label: "Delivered",
    description: "Your order has been delivered successfully.",
    icon: <Home className="h-6 w-6" />,
    date: "", // Will be determined
    color: "text-gray-400",
    completed: false,
  },
};

// Sample order data - in a real app this would come from an API
const mockOrderData = {
  id: "123456",
  status: "shipped",
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
  trackingNumber: "TRK123456789",
  carrier: "FedEx",
  shippingAddress: {
    name: "John Doe",
    address: "123 Main Street",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    country: "United States",
  },
  orderDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toLocaleDateString(),
  estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString(),
  total: 149.97,
};

export default function OrderTrackingPage() {
  const { id } = useParams();
  const orderId = id || "N/A";
  const [orderData, setOrderData] = useState(mockOrderData);
  const [currentStatus, setCurrentStatus] = useState(orderData.status);
  const [trackingEvents, setTrackingEvents] = useState<any[]>([]);
  
  // Calculate status for the progress indicator
  const statuses = Object.keys(ORDER_STATUSES);
  const currentStatusIndex = statuses.indexOf(currentStatus);
  
  useEffect(() => {
    // Simulate fetching order data
    // In a real app, this would be an API call
    
    // Generate tracking events
    const events = generateTrackingEvents(currentStatus);
    setTrackingEvents(events);
  }, [currentStatus]);
  
  // Generate tracking events based on current status
  const generateTrackingEvents = (status: string) => {
    const events = [];
    const statusKeys = Object.keys(ORDER_STATUSES);
    const statusIndex = statusKeys.indexOf(status);
    
    for (let i = 0; i <= statusIndex; i++) {
      const statusKey = statusKeys[i];
      const statusInfo = ORDER_STATUSES[statusKey as keyof typeof ORDER_STATUSES];
      
      events.push({
        ...statusInfo,
        status: statusKey,
      });
    }
    
    return events.reverse(); // Most recent first
  };
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/profile">
              <a>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Orders
              </a>
            </Link>
          </Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Tracking Information */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
              <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Order #{orderId}
                </h1>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Ordered on {orderData.orderDate}
                </div>
              </div>
              
              {/* Order Status */}
              <div className="mt-6">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Status</h2>
                <div className="mt-4">
                  <div className="relative">
                    {/* Progress Bar */}
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700">
                      <div
                        style={{ width: `${(currentStatusIndex / (statuses.length - 1)) * 100}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary"
                      ></div>
                    </div>
                    
                    {/* Status Steps */}
                    <div className="flex justify-between">
                      {statuses.map((status, index) => {
                        const statusInfo = ORDER_STATUSES[status as keyof typeof ORDER_STATUSES];
                        const isCompleted = index <= currentStatusIndex;
                        const isCurrent = index === currentStatusIndex;
                        
                        return (
                          <div key={status} className="text-center" style={{ width: `${100 / statuses.length}%` }}>
                            <div
                              className={`mx-auto flex items-center justify-center h-8 w-8 rounded-full ${
                                isCompleted
                                  ? "bg-primary text-white"
                                  : isCurrent
                                  ? "bg-primary-light text-primary"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-400"
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className="h-5 w-5" />
                              ) : (
                                <Clock className="h-5 w-5" />
                              )}
                            </div>
                            <div className="mt-2 text-xs">
                              <div
                                className={`font-medium ${
                                  isCompleted
                                    ? "text-primary"
                                    : isCurrent
                                    ? "text-gray-900 dark:text-white"
                                    : "text-gray-500 dark:text-gray-400"
                                }`}
                              >
                                {statusInfo.label}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Shipping Details */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <Truck className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Shipping Information
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <p className="font-medium text-gray-900 dark:text-white">
                      {orderData.carrier} - {orderData.trackingNumber}
                    </p>
                    <p>
                      {orderData.shippingAddress.name}
                    </p>
                    <p>
                      {orderData.shippingAddress.address}
                    </p>
                    <p>
                      {orderData.shippingAddress.city}, {orderData.shippingAddress.state} {orderData.shippingAddress.zipCode}
                    </p>
                    <p>
                      {orderData.shippingAddress.country}
                    </p>
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 text-primary mr-2" />
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      Delivery Information
                    </h3>
                  </div>
                  <div className="mt-2 space-y-1 text-sm text-gray-500 dark:text-gray-400">
                    <p>
                      <span className="font-medium text-gray-900 dark:text-white">Estimated Delivery Date: </span>
                      {orderData.estimatedDelivery}
                    </p>
                    <p>
                      Your package will be delivered to your shipping address. Someone may need to be present to sign for the package.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Tracking Events Timeline */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Tracking Updates</h2>
                <div className="mt-4 space-y-6">
                  {trackingEvents.length === 0 ? (
                    <div className="flex justify-center items-center py-12 bg-gray-50 dark:bg-gray-900 rounded-lg">
                      <div className="text-center">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                          No tracking updates yet
                        </h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          Check back later for tracking information.
                        </p>
                      </div>
                    </div>
                  ) : (
                    trackingEvents.map((event, index) => (
                      <div key={event.status} className="relative pb-8">
                        {index !== trackingEvents.length - 1 && (
                          <div className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                        )}
                        <div className="relative flex items-start space-x-3">
                          <div>
                            <div className={`relative px-1 ${event.color}`}>
                              {event.icon}
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <span className="font-medium text-gray-900 dark:text-white">
                                  {event.label}
                                </span>
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                {event.description}
                              </p>
                            </div>
                            <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                              <p>{event.date}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div>
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>
              
              <div className="mt-6 flow-root">
                <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                  {orderData.items.map((item) => (
                    <li key={`${item.id}-${item.size}-${item.color}`} className="py-5 flex">
                      <div className="flex-shrink-0 w-16 h-16 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {item.name}
                          </h3>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {item.size && `Size: ${item.size}`} {item.color && `Color: ${item.color}`}
                          </p>
                        </div>
                        <div className="flex-1 flex items-end justify-between">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Qty {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <Separator className="my-6" />
              
              <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                <p>Total</p>
                <p>${orderData.total.toFixed(2)}</p>
              </div>
              
              <div className="mt-6 flex flex-col space-y-4">
                <Button asChild>
                  <Link href={`/order-confirmation/${orderId}`}>
                    <a>View Order Details</a>
                  </Link>
                </Button>
                <Button variant="outline">
                  <a href="#" className="flex items-center justify-center">
                    Need Help?
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
