import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Truck, Shield, RotateCcw, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { products } from '../data/products';
import './Home.css';

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const featuredProducts = products.slice(0, 4);

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ShopEasy</h1>
          <p>Discover amazing products at unbeatable prices. Quality guaranteed, satisfaction assured.</p>
          <div className="hero-buttons">
            <Link to="/products" className="btn btn-primary">
              Shop Now
              <ArrowRight size={20} />
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop" alt="Shopping" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2>Why Choose ShopEasy?</h2>
          <div className="features-grid">
            <div className="feature">
              <Truck className="feature-icon" size={48} />
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>
            <div className="feature">
              <Shield className="feature-icon" size={48} />
              <h3>Secure Payment</h3>
              <p>Your payment information is safe and secure</p>
            </div>
            <div className="feature">
              <RotateCcw className="feature-icon" size={48} />
              <h3>Easy Returns</h3>
              <p>30-day return policy on all items</p>
            </div>
            <div className="feature">
              <Headphones className="feature-icon" size={48} />
              <h3>24/7 Support</h3>
              <p>Customer support available around the clock</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>
          <div className="products-grid">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Link to="/products" className="btn btn-outline">
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories">
        <div className="container">
          <h2>Shop by Category</h2>
          <div className="category-filters">
            {['All', 'Electronics', 'Clothing', 'Home & Kitchen'].map(category => (
              <button
                key={category}
                className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="products-grid">
            {filteredProducts.slice(0, 8).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for exclusive deals and new product updates.</p>
            <div className="newsletter-form">
              <input type="email" placeholder="Enter your email" />
              <button className="btn btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
