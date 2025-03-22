import { useState, useEffect } from "react";
import { 
  User,
  MapPin,
  Package,
  CreditCard,
  Heart,
  LogOut,
  Settings,
  ChevronRight,
  Shield,
  RefreshCw,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

const ProfileTabs = {
  PROFILE: "profile",
  ADDRESSES: "addresses",
  ORDERS: "orders",
  PAYMENT: "payment",
  SECURITY: "security",
};

export default function ProfilePage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState(ProfileTabs.PROFILE);
  const { user, logoutMutation } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Orders data
  const { data: orders = [], isLoading: isLoadingOrders } = useQuery({
    queryKey: ['/api/orders/user'],
    enabled: !!user,
  });
  
  // Placeholder for address and payment methods until we implement them
  const addresses = [];
  const paymentMethods = [];
  
  // User data structure combining fetched user with additional data
  const userData = user ? {
    ...user,
    orders,
    addresses,
    paymentMethods,
  } : null;
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setUserData({
      ...userData,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
    });
    
    setIsEditing(false);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  };
  
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate passwords
    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "The new passwords you entered do not match.",
        variant: "destructive",
      });
      return;
    }
    
    // Simulate API call
    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    
    toast({
      title: "Password Updated",
      description: "Your password has been changed successfully.",
    });
  };
  
  // If user is not logged in or data is loading
  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <h2 className="text-xl font-semibold">Loading profile...</h2>
          <p className="mt-2 text-gray-500">Please wait while we retrieve your information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-primary-light text-primary mx-auto flex items-center justify-center">
                  <User className="h-10 w-10" />
                </div>
                <h2 className="mt-4 text-lg font-bold text-gray-900 dark:text-white">
                  {userData.firstName || ''} {userData.lastName || ''}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{userData.email}</p>
              </div>
              
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab(ProfileTabs.PROFILE)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === ProfileTabs.PROFILE
                      ? "bg-primary-light text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <User className="mr-3 h-5 w-5" />
                  Personal Information
                </button>
                <button
                  onClick={() => setActiveTab(ProfileTabs.ADDRESSES)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === ProfileTabs.ADDRESSES
                      ? "bg-primary-light text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <MapPin className="mr-3 h-5 w-5" />
                  Addresses
                </button>
                <button
                  onClick={() => setActiveTab(ProfileTabs.ORDERS)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === ProfileTabs.ORDERS
                      ? "bg-primary-light text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <Package className="mr-3 h-5 w-5" />
                  Orders
                </button>
                <button
                  onClick={() => setActiveTab(ProfileTabs.PAYMENT)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === ProfileTabs.PAYMENT
                      ? "bg-primary-light text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <CreditCard className="mr-3 h-5 w-5" />
                  Payment Methods
                </button>
                <button
                  onClick={() => setActiveTab(ProfileTabs.SECURITY)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                    activeTab === ProfileTabs.SECURITY
                      ? "bg-primary-light text-primary"
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
                >
                  <Shield className="mr-3 h-5 w-5" />
                  Security
                </button>
              </nav>
              
              <Separator className="my-6" />
              
              <div className="space-y-1">
                <button
                  onClick={() => {
                    // Navigate to wishlist
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Heart className="mr-3 h-5 w-5" />
                  Wishlist
                </button>
                <button
                  onClick={() => {
                    // Navigate to settings
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <Settings className="mr-3 h-5 w-5" />
                  Settings
                </button>
                <button
                  onClick={() => {
                    // Logout functionality
                    toast({
                      title: "Logged Out",
                      description: "You have been logged out successfully.",
                    });
                  }}
                  className="w-full flex items-center px-3 py-2 text-sm font-medium rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  Logout
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
              {/* Profile Tab */}
              {activeTab === ProfileTabs.PROFILE && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Personal Information
                    </h1>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={() => setIsEditing(!isEditing)}
                    >
                      {isEditing ? "Cancel" : "Edit Profile"}
                    </Button>
                  </div>
                  
                  {isEditing ? (
                    <form onSubmit={handleUpdateProfile}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end mt-6">
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <Label className="text-sm text-gray-500 dark:text-gray-400">
                            First Name
                          </Label>
                          <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                            {userData.firstName}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500 dark:text-gray-400">
                            Last Name
                          </Label>
                          <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                            {userData.lastName}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500 dark:text-gray-400">
                            Email Address
                          </Label>
                          <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                            {userData.email}
                          </p>
                        </div>
                        <div>
                          <Label className="text-sm text-gray-500 dark:text-gray-400">
                            Phone Number
                          </Label>
                          <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">
                            {userData.phone}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Addresses Tab */}
              {activeTab === ProfileTabs.ADDRESSES && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Addresses
                    </h1>
                    <Button>
                      Add New Address
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {userData.addresses.map((address) => (
                      <div
                        key={address.id}
                        className={`border ${
                          address.isDefault
                            ? "border-primary"
                            : "border-gray-200 dark:border-gray-700"
                        } rounded-lg p-4 relative`}
                      >
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <h3 className="text-base font-medium text-gray-900 dark:text-white">
                          {address.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                          {address.address}
                          <br />
                          {address.city}, {address.state} {address.zipCode}
                          <br />
                          {address.country}
                        </p>
                        <div className="mt-4 flex space-x-2">
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {!address.isDefault && (
                            <Button variant="outline" size="sm">
                              Make Default
                            </Button>
                          )}
                          {!address.isDefault && (
                            <Button variant="outline" size="sm">
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Orders Tab */}
              {activeTab === ProfileTabs.ORDERS && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Order History
                    </h1>
                  </div>
                  
                  <div className="space-y-6">
                    {userData.orders.length === 0 ? (
                      <div className="text-center py-12">
                        <Package className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No orders yet</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                          When you place orders, they will appear here.
                        </p>
                        <Button className="mt-6" asChild>
                          <Link href="/products">
                            <a>Start Shopping</a>
                          </Link>
                        </Button>
                      </div>
                    ) : (
                      userData.orders.map((order) => (
                        <div
                          key={order.id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
                        >
                          <div className="bg-gray-50 dark:bg-gray-900 py-3 px-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                            <div>
                              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                                Order #{order.id}
                              </h3>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Placed on {order.date}
                              </p>
                            </div>
                            <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === "Delivered"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                    : order.status === "Processing"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                    : order.status === "Shipped"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
                                }`}
                              >
                                {order.status}
                              </span>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/order-tracking/${order.id}`}>
                                  <a>Track Order</a>
                                </Link>
                              </Button>
                            </div>
                          </div>
                          <div className="py-4 px-4">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                              {order.items.map((item) => (
                                <li key={item.id} className="py-4 flex">
                                  <div className="flex-shrink-0 w-16 h-16 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                                    <img
                                      src={item.image}
                                      alt={item.name}
                                      className="w-full h-full object-center object-cover"
                                    />
                                  </div>
                                  <div className="ml-4 flex-1 flex flex-col">
                                    <div>
                                      <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                        <h4>{item.name}</h4>
                                        <p className="ml-4">${item.price.toFixed(2)}</p>
                                      </div>
                                    </div>
                                    <div className="flex-1 flex items-end justify-between text-sm">
                                      <p className="text-gray-500 dark:text-gray-400">
                                        Qty {item.quantity}
                                      </p>
                                      <div className="flex">
                                        <Button variant="link" size="sm">
                                          Buy Again
                                        </Button>
                                      </div>
                                    </div>
                                  </div>
                                </li>
                              ))}
                            </ul>
                            <div className="flex justify-between items-center mt-4">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                Total: <span className="font-medium text-gray-900 dark:text-white">${order.total.toFixed(2)}</span>
                              </p>
                              <Button variant="outline" size="sm" asChild>
                                <Link href={`/order-confirmation/${order.id}`}>
                                  <a>View Order</a>
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
              
              {/* Payment Methods Tab */}
              {activeTab === ProfileTabs.PAYMENT && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Payment Methods
                    </h1>
                    <Button>
                      Add Payment Method
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {userData.paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className={`border ${
                          method.isDefault
                            ? "border-primary"
                            : "border-gray-200 dark:border-gray-700"
                        } rounded-lg p-4 relative flex justify-between items-center`}
                      >
                        <div className="flex items-center">
                          <CreditCard className="h-6 w-6 text-gray-500 dark:text-gray-400 mr-3" />
                          <div>
                            <h3 className="text-base font-medium text-gray-900 dark:text-white">
                              {method.name}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Expires {method.expiryDate}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          {method.isDefault && (
                            <span className="mr-4 bg-primary-light text-primary text-xs px-2 py-1 rounded-full">
                              Default
                            </span>
                          )}
                          <Button variant="outline" size="sm">
                            Edit
                          </Button>
                          {!method.isDefault && (
                            <Button variant="outline" size="sm" className="ml-2">
                              Remove
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Security Tab */}
              {activeTab === ProfileTabs.SECURITY && (
                <div>
                  <div className="mb-6">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                      Security
                    </h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      Manage your account security settings
                    </p>
                  </div>
                  
                  <div className="mt-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Change Password</h2>
                    <form onSubmit={handlePasswordChange} className="mt-4 space-y-4">
                      <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          name="currentPassword"
                          type="password"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          name="newPassword"
                          type="password"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button type="submit">Update Password</Button>
                      </div>
                    </form>
                  </div>
                  
                  <Separator className="my-8" />
                  
                  <div>
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Account Settings</h2>
                    <div className="mt-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            Two-Factor Authentication
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                        <Button variant="outline">Enable</Button>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            Login Sessions
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage your active login sessions
                          </p>
                        </div>
                        <Button variant="outline">Manage</Button>
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-base font-medium text-gray-900 dark:text-white">
                            Delete Account
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <Button variant="destructive">Delete Account</Button>
                      </div>
                    </div>
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
