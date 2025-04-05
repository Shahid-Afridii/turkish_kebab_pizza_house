import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';



// Lazy load the components
const Home = lazy(() => import('../pages/Home'));
const Cart = lazy(() => import('../pages/Cart'));
const Checkout = lazy(() => import('../pages/Checkout'));
const Login = lazy(() => import('../pages/Login'));
const Orders = lazy(() => import('../pages/Orders'));
const AboutUs = lazy(() => import('../pages/AboutUs'));
const RestaurantInfo = lazy(() => import('../pages/RestrauntInfo'));
const PrivacyPolicy = lazy(() => import('../pages/PrivacyPolicy'));
const TermsAndConditons = lazy(() => import('../pages/TermsAndConditons'));
const NotFound = lazy(() => import('../pages/NotFound')); 

const AppRoutes = () => (
  
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/info" element={<RestaurantInfo />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsAndConditons />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<AboutUs />} />
      <Route path="*" element={<NotFound />} /> 
    </Routes>

);

export default AppRoutes;
