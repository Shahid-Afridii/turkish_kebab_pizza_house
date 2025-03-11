import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import RestaurantInfo from '../pages/RestrauntInfo';
import Orders from '../pages/Orders';

// Lazy load the components
const Home = lazy(() => import('../pages/Home'));
const Menu = lazy(() => import('../pages/Menu'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Login = lazy(() => import('../pages/Login'));

const AppRoutes = () => (
  
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/info" element={<RestaurantInfo />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/login" element={<Login />} />
    </Routes>

);

export default AppRoutes;
