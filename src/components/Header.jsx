import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Header.css';

const Header = () => {
  const { getTotalItems } = useCart();

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <h1>ShopEasy</h1>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/products" className="nav-link">Products</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
        </nav>

        <div className="header-actions">
          <div className="search-bar">
            <input type="text" placeholder="Search products..." />
            <Search className="search-icon" />
          </div>
          
          <Link to="/account" className="header-icon">
            <User size={24} />
          </Link>
          
          <Link to="/cart" className="header-icon cart-icon">
            <ShoppingCart size={24} />
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
