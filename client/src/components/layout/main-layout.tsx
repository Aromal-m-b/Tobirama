import { ReactNode, useState } from "react";
import Navbar from "./navbar";
import Footer from "./footer";
import CartSidebar from "./cart-sidebar";
import SearchOverlay from "./search-overlay";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar 
        onCartToggle={() => setIsCartOpen(true)} 
        onSearchToggle={() => setIsSearchOpen(true)} 
      />
      
      <main className="flex-grow">
        {children}
      </main>
      
      <Footer />
      
      <CartSidebar 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)} 
      />
      
      <SearchOverlay 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </div>
  );
}
