import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import AdminPanel from './pages/AdminPanel';
import Loading from './components/Loading';

function App() {

  const [isBackendUp, setIsBackendUp] = useState(false);
  const [isFrontendReady, setIsFrontendReady] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFrontendReady(true);
    }, 500); // simulate frontend preparation
    return () => clearTimeout(timer);
  }, []);

  // Check backend health every 5 seconds until it's up
  useEffect(() => {
    const interval = setInterval(() => {
      fetch('http://localhost:5000/api/health') // replace with your actual backend health check URL
        .then((res) => {
          if (res.ok) {
            setIsBackendUp(true);
            clearInterval(interval); // stop checking
          }
        })
        .catch((err) => {
          console.log("Backend still down, retrying...");
        });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (!isBackendUp || !isFrontendReady) {
    return <Loading />; // show loading if either is not ready
  }
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-amber-50">
            <Header />
            <main className="pt-16">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/products/:productId/varieties/:varietyId" element={<ProductDetail />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/admin" element={<AdminPanel />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;