
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  /**
   * Handles search form submission by navigating to shop page with search query.
   * Trims whitespace, validates non-empty input, and clears input field after navigation.
   */
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
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

          {/* Desktop Search Bar */}
          <form
            onSubmit={handleSearch}
            className="hidden md:flex items-center w-[300px] h-10 border border-gray-300 rounded-full overflow-hidden focus-within:ring-1 focus-within:ring-saree-gold focus-within:border-saree-gold transition-colors"
          >
            <input
              type="text"
              placeholder="Search for sarees..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-full px-4 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
            />
            <button
              type="submit"
              className="flex-shrink-0 px-3 h-full text-gray-500 hover:text-saree-gold transition-colors"
              aria-label="Search"
            >
              <Search size={18} />
            </button>
          </form>

          {/* Icons */}
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
