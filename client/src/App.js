import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';

// Theme Provider
import { ThemeContextProvider } from './theme/ThemeContext';

// Pages with lazy loading
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PetrochemicalGamesPage = lazy(() => import('./pages/PetrochemicalGamesPage'));

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeSettings from './components/ThemeSettings';

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box 
    sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh'
    }}
  >
    <CircularProgress size={60} thickness={4} />
  </Box>
);

function App() {
  return (
    <ThemeContextProvider>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/educational-games" element={<PetrochemicalGamesPage />} />
          </Routes>
        </Suspense>
        <Footer />
        <ThemeSettings />
      </BrowserRouter>
    </ThemeContextProvider>
  );
}

export default App;