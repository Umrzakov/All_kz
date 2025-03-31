import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';

function Root() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/product/:id" element={<ProductPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
}

export default Root;
