import { useState } from "react";
import { useLocation } from "wouter";
import {
  CreditCard,
  Smartphone,
  Truck,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Package,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const SHIPPING_METHODS = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "3-5 business days",
    price: 5.99,
    free: 50,
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "1-2 business days",
    price: 14.99,
    free: 150,
  },
];

const PAYMENT_METHODS = [
  {
    id: "credit-card",
    name: "Credit / Debit Card",
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: "upi",
    name: "UPI",
    icon: <Smartphone className="h-5 w-5" />,
  },
  {
    id: "wallet",
    name: "Digital Wallet",
    icon: <DollarSign className="h-5 w-5" />,
  },
  {
    id: "cod",
    name: "Cash on Delivery",
    icon: <Package className="h-5 w-5" />,
  },
];

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { cartItems, cartTotal, clearCart } = useCart();
  const { toast } = useToast();
  
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [formData, setFormData] = useState({
    // Shipping information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    
    // Billing information
    sameAsShipping: true,
    billingFirstName: "",
    billingLastName: "",
    billingAddress: "",
    billingApartment: "",
    billingCity: "",
    billingState: "",
    billingZipCode: "",
    billingCountry: "United States",
    
    // Shipping method
    shippingMethod: "standard",
    
    // Payment method
    paymentMethod: "credit-card",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
    savePaymentInfo: false,
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Calculate order summary
  const selectedShippingMethod = SHIPPING_METHODS.find(
    (method) => method.id === formData.shippingMethod
  );
  
  const shipping = selectedShippingMethod
    ? cartTotal >= selectedShippingMethod.free
      ? 0
      : selectedShippingMethod.price
    : 0;
    
  const tax = cartTotal * 0.1; // 10% tax
  const total = cartTotal + shipping + tax;
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  
  const handleShippingMethodChange = (value: string) => {
    setFormData({ ...formData, shippingMethod: value });
  };
  
  const handlePaymentMethodChange = (value: string) => {
    setFormData({ ...formData, paymentMethod: value });
  };
  
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.address ||
      !formData.city ||
      !formData.state ||
      !formData.zipCode ||
      !formData.country
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    // Move to payment step
    setStep("payment");
    
    // Scroll to top
    window.scrollTo(0, 0);
  };
  
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Validate payment information
    if (formData.paymentMethod === "credit-card") {
      if (
        !formData.cardNumber ||
        !formData.cardName ||
        !formData.cardExpiry ||
        !formData.cardCvv
      ) {
        toast({
          title: "Missing Payment Information",
          description: "Please fill in all required payment fields.",
          variant: "destructive",
        });
        setIsProcessing(false);
        return;
      }
    }
    
    try {
      // Simulate API call to create order
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Generate dummy order ID for demo purposes
      const orderId = Math.floor(100000 + Math.random() * 900000);
      
      // Clear cart after successful order
      clearCart();
      
      // Navigate to order confirmation page
      navigate(`/order-confirmation/${orderId}`);
    } catch (error) {
      toast({
        title: "Order Processing Failed",
        description: "There was an error processing your order. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center py-12">
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Your cart is empty</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400">Add some items to your cart before checking out.</p>
            <Button className="mt-6" asChild>
              <Link href="/products">
                <a>Continue Shopping</a>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Checkout</h1>
                <div className="flex items-center text-sm">
                  <span
                    className={`flex items-center ${
                      step === "shipping" ? "text-primary font-medium" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span className="rounded-full bg-primary/10 text-primary w-6 h-6 flex items-center justify-center mr-2">
                      1
                    </span>
                    Shipping
                  </span>
                  <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
                  <span
                    className={`flex items-center ${
                      step === "payment" ? "text-primary font-medium" : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    <span
                      className={`rounded-full w-6 h-6 flex items-center justify-center mr-2 ${
                        step === "payment"
                          ? "bg-primary/10 text-primary"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                      }`}
                    >
                      2
                    </span>
                    Payment
                  </span>
                </div>
              </div>
              
              {step === "shipping" ? (
                <form onSubmit={handleShippingSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Contact Information</h2>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div>
                          <Label htmlFor="firstName">First Name <span className="text-red-500">*</span></Label>
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
                          <Label htmlFor="lastName">Last Name <span className="text-red-500">*</span></Label>
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
                          <Label htmlFor="email">Email Address <span className="text-red-500">*</span></Label>
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
                          <Label htmlFor="phone">Phone Number <span className="text-red-500">*</span></Label>
                          <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shipping Address</h2>
                      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                        <div className="sm:col-span-2">
                          <Label htmlFor="address">Street Address <span className="text-red-500">*</span></Label>
                          <Input
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <Label htmlFor="apartment">Apartment, suite, etc.</Label>
                          <Input
                            id="apartment"
                            name="apartment"
                            value={formData.apartment}
                            onChange={handleChange}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city">City <span className="text-red-500">*</span></Label>
                          <Input
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State / Province <span className="text-red-500">*</span></Label>
                          <Input
                            id="state"
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zipCode">Postal Code <span className="text-red-500">*</span></Label>
                          <Input
                            id="zipCode"
                            name="zipCode"
                            value={formData.zipCode}
                            onChange={handleChange}
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="country">Country <span className="text-red-500">*</span></Label>
                          <select
                            id="country"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3"
                            required
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">United Kingdom</option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Shipping Method</h2>
                      <RadioGroup
                        value={formData.shippingMethod}
                        onValueChange={handleShippingMethodChange}
                        className="mt-4 space-y-4"
                      >
                        {SHIPPING_METHODS.map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center justify-between border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <div className="flex items-center">
                              <RadioGroupItem value={method.id} id={method.id} className="mr-3" />
                              <div>
                                <Label htmlFor={method.id} className="font-medium text-gray-900 dark:text-white">
                                  {method.name}
                                </Label>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{method.description}</p>
                              </div>
                            </div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {cartTotal >= method.free ? (
                                <span className="text-green-600">Free</span>
                              ) : (
                                <span>${method.price.toFixed(2)}</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <div className="flex items-center">
                        <Checkbox
                          id="sameAsShipping"
                          name="sameAsShipping"
                          checked={formData.sameAsShipping}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, sameAsShipping: checked as boolean })
                          }
                        />
                        <Label htmlFor="sameAsShipping" className="ml-2">
                          Billing address same as shipping address
                        </Label>
                      </div>
                    </div>
                    
                    {!formData.sameAsShipping && (
                      <div>
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white">Billing Address</h2>
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                          <div>
                            <Label htmlFor="billingFirstName">First Name <span className="text-red-500">*</span></Label>
                            <Input
                              id="billingFirstName"
                              name="billingFirstName"
                              value={formData.billingFirstName}
                              onChange={handleChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingLastName">Last Name <span className="text-red-500">*</span></Label>
                            <Input
                              id="billingLastName"
                              name="billingLastName"
                              value={formData.billingLastName}
                              onChange={handleChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="billingAddress">Street Address <span className="text-red-500">*</span></Label>
                            <Input
                              id="billingAddress"
                              name="billingAddress"
                              value={formData.billingAddress}
                              onChange={handleChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div className="sm:col-span-2">
                            <Label htmlFor="billingApartment">Apartment, suite, etc.</Label>
                            <Input
                              id="billingApartment"
                              name="billingApartment"
                              value={formData.billingApartment}
                              onChange={handleChange}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingCity">City <span className="text-red-500">*</span></Label>
                            <Input
                              id="billingCity"
                              name="billingCity"
                              value={formData.billingCity}
                              onChange={handleChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingState">State / Province <span className="text-red-500">*</span></Label>
                            <Input
                              id="billingState"
                              name="billingState"
                              value={formData.billingState}
                              onChange={handleChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingZipCode">Postal Code <span className="text-red-500">*</span></Label>
                            <Input
                              id="billingZipCode"
                              name="billingZipCode"
                              value={formData.billingZipCode}
                              onChange={handleChange}
                              className="mt-1"
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="billingCountry">Country <span className="text-red-500">*</span></Label>
                            <select
                              id="billingCountry"
                              name="billingCountry"
                              value={formData.billingCountry}
                              onChange={handleChange}
                              className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm focus:border-primary focus:ring-primary sm:text-sm h-10 px-3"
                              required
                            >
                              <option value="United States">United States</option>
                              <option value="Canada">Canada</option>
                              <option value="United Kingdom">United Kingdom</option>
                              <option value="Australia">Australia</option>
                              <option value="Germany">Germany</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                      <Button variant="outline" type="button" asChild>
                        <Link href="/cart">
                          <a>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Cart
                          </a>
                        </Link>
                      </Button>
                      <Button type="submit">
                        Continue to Payment
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </form>
              ) : (
                <form onSubmit={handlePaymentSubmit}>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Payment Method</h2>
                      <RadioGroup
                        value={formData.paymentMethod}
                        onValueChange={handlePaymentMethodChange}
                        className="mt-4 space-y-4"
                      >
                        {PAYMENT_METHODS.map((method) => (
                          <div
                            key={method.id}
                            className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg p-4"
                          >
                            <RadioGroupItem value={method.id} id={method.id} className="mr-3" />
                            <Label
                              htmlFor={method.id}
                              className="flex items-center font-medium text-gray-900 dark:text-white"
                            >
                              {method.icon}
                              <span className="ml-3">{method.name}</span>
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>
                    
                    {formData.paymentMethod === "credit-card" && (
                      <div>
                        <Accordion type="single" collapsible defaultValue="payment-details">
                          <AccordionItem value="payment-details" className="border-none">
                            <AccordionTrigger className="py-4 px-6 -mx-6 -my-4 hover:no-underline hover:bg-gray-50 dark:hover:bg-gray-750 rounded-lg">
                              <h3 className="text-base font-medium text-gray-900 dark:text-white">Card Details</h3>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4 px-0">
                              <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                <div className="sm:col-span-2">
                                  <Label htmlFor="cardNumber">Card Number <span className="text-red-500">*</span></Label>
                                  <Input
                                    id="cardNumber"
                                    name="cardNumber"
                                    value={formData.cardNumber}
                                    onChange={handleChange}
                                    className="mt-1"
                                    placeholder="1234 5678 9012 3456"
                                    maxLength={19}
                                    required
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <Label htmlFor="cardName">Name on Card <span className="text-red-500">*</span></Label>
                                  <Input
                                    id="cardName"
                                    name="cardName"
                                    value={formData.cardName}
                                    onChange={handleChange}
                                    className="mt-1"
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cardExpiry">Expiry Date (MM/YY) <span className="text-red-500">*</span></Label>
                                  <Input
                                    id="cardExpiry"
                                    name="cardExpiry"
                                    value={formData.cardExpiry}
                                    onChange={handleChange}
                                    className="mt-1"
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    required
                                  />
                                </div>
                                <div>
                                  <Label htmlFor="cardCvv">CVV <span className="text-red-500">*</span></Label>
                                  <Input
                                    id="cardCvv"
                                    name="cardCvv"
                                    value={formData.cardCvv}
                                    onChange={handleChange}
                                    className="mt-1"
                                    type="password"
                                    maxLength={4}
                                    required
                                  />
                                </div>
                                <div className="sm:col-span-2">
                                  <div className="flex items-center">
                                    <Checkbox
                                      id="savePaymentInfo"
                                      name="savePaymentInfo"
                                      checked={formData.savePaymentInfo}
                                      onCheckedChange={(checked) =>
                                        setFormData({ ...formData, savePaymentInfo: checked as boolean })
                                      }
                                    />
                                    <Label htmlFor="savePaymentInfo" className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                      Save this card for future purchases
                                    </Label>
                                  </div>
                                </div>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    )}
                    
                    {formData.paymentMethod === "upi" && (
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Enter your UPI ID to pay via UPI
                        </p>
                        <div className="mt-2">
                          <Input
                            placeholder="username@upi"
                            className="mt-1"
                          />
                        </div>
                      </div>
                    )}
                    
                    {formData.paymentMethod === "wallet" && (
                      <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Select a digital wallet
                        </p>
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-primary">
                            <p className="text-sm font-medium">PayPal</p>
                          </div>
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-primary">
                            <p className="text-sm font-medium">GPay</p>
                          </div>
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-primary">
                            <p className="text-sm font-medium">Apple Pay</p>
                          </div>
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-center justify-center cursor-pointer hover:border-primary">
                            <p className="text-sm font-medium">Amazon Pay</p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {formData.paymentMethod === "cod" && (
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                          Pay with cash when your order is delivered. Please note that COD orders may take longer to process.
                        </p>
                      </div>
                    )}
                    
                    <div className="flex justify-between mt-8">
                      <Button
                        variant="outline"
                        type="button"
                        onClick={() => setStep("shipping")}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Shipping
                      </Button>
                      <Button type="submit" disabled={isProcessing}>
                        {isProcessing ? "Processing..." : "Place Order"}
                        {!isProcessing && <ChevronRight className="ml-2 h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* Right Column - Order Summary */}
          <div className="w-full md:w-96">
            <div className="bg-white dark:bg-gray-800 shadow-sm rounded-lg p-6 sticky top-20">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">Order Summary</h2>
              
              <div className="mt-6 flow-root">
                <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
                  {cartItems.map((item) => (
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
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Subtotal</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">${cartTotal.toFixed(2)}</p>
                </div>
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
                  <p className="text-base font-medium text-gray-900 dark:text-white">${total.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <Truck className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Free shipping on orders over $50
                  </p>
                </div>
                <div className="flex items-center">
                  <ShieldCheck className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Secure checkout with SSL encryption
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
