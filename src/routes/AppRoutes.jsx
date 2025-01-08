import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Shimmer from '../components/shimmer'; // Global shimmer component

// Lazy load the components
const Home = lazy(() => import('../pages/Home'));
const Menu = lazy(() => import('../pages/Menu'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Login = lazy(() => import('../pages/Login'));
const Signup = lazy(() => import('../pages/Signup'));

const AppRoutes = () => (
  <Suspense fallback={<Shimmer />}>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
    </Routes>
  </Suspense>
);

export default AppRoutes;
