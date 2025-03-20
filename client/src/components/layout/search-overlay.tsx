import { useState, useEffect, useRef } from "react";
import { useLocation } from "wouter";
import { X, Search as SearchIcon, History } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  
  const suggestedSearches = [
    "Summer Collection",
    "Denim Jackets",
    "Casual Shoes",
    "Graphic Tees"
  ];
  
  const recentSearches = [
    "Slim fit jeans",
    "Leather jacket"
  ];
  
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    const handleClickOutside = (e: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    document.addEventListener('mousedown', handleClickOutside);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);
  
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20 px-4">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden transform transition-all">
        <div className="relative">
          <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
            <SearchIcon className="ml-3 h-5 w-5 text-gray-400" />
            <Input
              ref={inputRef}
              type="text" 
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)} 
              onKeyDown={handleKeyDown}
              placeholder="Search for products..." 
              className="w-full p-4 border-none focus:ring-0 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
            />
            <button 
              onClick={onClose} 
              className="mr-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4 max-h-96 overflow-y-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Suggested Searches</p>
          <div className="flex flex-wrap gap-2">
            {suggestedSearches.map((suggestion, index) => (
              <button 
                key={index}
                onClick={() => {
                  setSearchQuery(suggestion);
                  navigate(`/search?q=${encodeURIComponent(suggestion)}`);
                  onClose();
                }}
                className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                {suggestion}
              </button>
            ))}
          </div>
          {recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Recent Searches</p>
              <div className="space-y-2">
                {recentSearches.map((search, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
                  >
                    <div className="flex items-center">
                      <History className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{search}</span>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">Try our advanced search options</p>
          <button 
            onClick={() => {
              navigate("/search");
              onClose();
            }}
            className="text-primary text-sm font-medium hover:text-primary-dark"
          >
            Advanced Search
          </button>
        </div>
      </div>
    </div>
  );
}
