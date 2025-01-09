import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MainLayout = ({ children }) => (
  <div>
    <Navbar className="bg-gray-50" />
    <main className="py-4 px-4 bg-gray-50 ">{children}</main>
    <Footer />
  </div>
);

export default MainLayout;
