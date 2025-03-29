import React from 'react';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './layouts/MainLayout';
import DynamicSEO from "./components/seo/DynamicSEO";


const App = () => (
  <MainLayout>
              <DynamicSEO />

    <AppRoutes />
  </MainLayout>
);

export default App;
