import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import './App.css';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/about" element={<div className="container"><h1>About Us</h1><p>Coming soon...</p></div>} />
              <Route path="/contact" element={<div className="container"><h1>Contact</h1><p>Coming soon...</p></div>} />
              <Route path="/account" element={<div className="container"><h1>My Account</h1><p>Coming soon...</p></div>} />
              <Route path="*" element={<div className="container"><h1>404 - Page Not Found</h1><p>The page you're looking for doesn't exist.</p></div>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App
