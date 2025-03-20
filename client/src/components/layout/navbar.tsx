import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Search, 
  Heart, 
  ShoppingCart, 
  User, 
  Moon, 
  Sun, 
  Menu, 
  X 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { useTheme } from "@/hooks/use-theme";

interface NavbarProps {
  onCartToggle: () => void;
  onSearchToggle: () => void;
}

export default function Navbar({ onCartToggle, onSearchToggle }: NavbarProps) {
  const [location] = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/products" },
    { name: "Account", path: "/profile" },
    { name: "Customize", path: "/theme" },
  ];
  
  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
              className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <span className="sr-only">Open menu</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <a className="text-primary dark:text-white font-bold text-2xl cursor-pointer">
                  Stylease
                </a>
              </Link>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <a
                    className={`${
                      location === link.path
                        ? "border-primary text-gray-900 dark:text-white"
                        : "border-transparent text-gray-500 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700"
                    } cursor-pointer inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
                  >
                    {link.name}
                  </a>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center">
            <button 
              onClick={onSearchToggle}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Search</span>
              <Search className="h-5 w-5" />
            </button>
            <Link href="/wishlist">
              <a className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative">
                <span className="sr-only">Wishlist</span>
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute top-0 right-0 h-4 w-4 text-xs rounded-full bg-accent text-white flex items-center justify-center">
                    {wishlistItems.length}
                  </span>
                )}
              </a>
            </Link>
            <button 
              onClick={onCartToggle}
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 relative"
            >
              <span className="sr-only">Cart</span>
              <ShoppingCart className="h-5 w-5" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 h-4 w-4 text-xs rounded-full bg-primary text-white flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
            <div className="ml-3 relative">
              <Link href="/profile">
                <a className="bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                  <span className="sr-only">Open user menu</span>
                  <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-700 dark:text-gray-200">
                    <User className="h-4 w-4" />
                  </div>
                </a>
              </Link>
            </div>
            <button 
              onClick={toggleTheme}
              className="ml-3 p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <span className="sr-only">Toggle dark mode</span>
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 shadow-md">
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a
                  className={`${
                    location === link.path
                      ? "bg-primary bg-opacity-10 border-primary text-primary dark:text-white"
                      : "border-transparent text-gray-600 dark:text-gray-300"
                  } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
