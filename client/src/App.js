import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box, CircularProgress, AppBar, Toolbar, Typography, Container, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import NeuroQuiz from './components/NeuroQuiz';

// Theme Provider
import { ThemeContextProvider } from './context/ThemeContext';

<<<<<<< Updated upstream
// Pages with lazy loading
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const PetrochemicalGamesPage = lazy(() => import('./pages/PetrochemicalGamesPage'));
const NuclearEngineeringPage = lazy(() => import('./pages/NuclearEngineeringPage'));
const RocketSciencePage = lazy(() => import('./pages/RocketSciencePage'));
const ElectricalEngineeringPage = lazy(() => import('./pages/ElectricalEngineeringPage'));
const HealthPage = lazy(() => import('./pages/HealthPage'));
const BiochemistryPage = lazy(() => import('./pages/BiochemistryPage'));
const MolecularBiotechnologyPage = lazy(() => import('./pages/MolecularBiotechnologyPage'));
=======
// Lazy-loaded components
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Navbar = lazy(() => import('./components/Navbar'));
const Footer = lazy(() => import('./components/Footer'));
const ThemeSettings = lazy(() => import('./components/ThemeSettings'));
>>>>>>> Stashed changes

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Loading component for suspense fallback
const LoadingFallback = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

function App() {
  return (
    <ThemeContextProvider>
<<<<<<< Updated upstream
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
            <Route path="/nuclear-engineering" element={<NuclearEngineeringPage />} />
            <Route path="/electrical-engineering" element={<ElectricalEngineeringPage />} />
            <Route path="/rocket-science" element={<RocketSciencePage />} />
            <Route path="/health" element={<HealthPage />} />
            <Route path="/biochemistry" element={<BiochemistryPage />} />
            <Route path="/molecular-biotechnology" element={<MolecularBiotechnologyPage />} />
          </Routes>
        </Suspense>
        <Footer />
        <ThemeSettings />
      </BrowserRouter>
=======
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <Navbar />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/neuro-quiz" element={<NeuroQuiz />} />
            </Routes>
          </Suspense>
          <Footer />
          <ThemeSettings />
        </BrowserRouter>
      </ThemeProvider>
>>>>>>> Stashed changes
    </ThemeContextProvider>
  );
}

export default App;