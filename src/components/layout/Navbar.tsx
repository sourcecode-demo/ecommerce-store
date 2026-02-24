
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const navigate = useNavigate();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const trimmed = searchQuery.trim();
      if (trimmed) {
        navigate(`/shop?search=${encodeURIComponent(trimmed)}`);
      }
    }
  };

  return (
    <nav className="bg-white py-4 px-6 shadow-sm">
      <div className="container mx-auto">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="text-2xl font-playfair font-semibold text-saree-maroon">
            Tulasi Silks
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-saree-gold transition-colors">
              Home
            </Link>
            <Link to="/categories" className="text-gray-700 hover:text-saree-gold transition-colors">
              Categories
            </Link>
            <Link to="/shop" className="text-gray-700 hover:text-saree-gold transition-colors">
              Shop
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-saree-gold transition-colors">
              Contact
            </Link>
          </div>

          {/* Desktop Search Input */}
          <div className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for sarees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                className={cn(
                  "w-[300px] h-10 pl-4 pr-10 rounded-full",
                  "border border-gray-300 bg-white text-gray-700",
                  "placeholder:text-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-saree-gold focus:border-transparent",
                  "transition-colors"
                )}
              />
              <Search
                size={18}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Desktop Icons (Search icon removed - now in center input) */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/cart" className="text-gray-700 hover:text-saree-gold transition-colors relative">
              <ShoppingBag size={20} />
              <span className="absolute -top-1 -right-1 bg-saree-maroon text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                0
              </span>
            </Link>
            <Link to="/login" className="text-gray-700 hover:text-saree-gold transition-colors">
              <User size={20} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link
                to="/"
                className="text-gray-700 hover:text-saree-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/categories"
                className="text-gray-700 hover:text-saree-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/shop"
                className="text-gray-700 hover:text-saree-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                to="/contact"
                className="text-gray-700 hover:text-saree-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-saree-gold transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Login
              </Link>
            </div>
            <div className="flex justify-between mt-4 pt-4 border-t border-gray-100">
              <button className="text-gray-700 hover:text-saree-gold transition-colors">
                <Search size={20} />
              </button>
              <Link to="/cart" className="text-gray-700 hover:text-saree-gold transition-colors relative">
                <ShoppingBag size={20} />
                <span className="absolute -top-1 -right-1 bg-saree-maroon text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                  0
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
