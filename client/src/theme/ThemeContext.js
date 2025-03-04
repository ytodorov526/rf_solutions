import React, { createContext, useState, useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// Create theme context
const ThemeContext = createContext({
  mode: 'light',
  primaryColor: 'blue',
  toggleMode: () => {},
  setPrimaryColor: () => {}
});

// Available primary colors
export const PRIMARY_COLORS = [
  { name: 'blue', main: '#1976d2', light: '#42a5f5', dark: '#1565c0' },
  { name: 'indigo', main: '#3f51b5', light: '#7986cb', dark: '#303f9f' },
  { name: 'teal', main: '#009688', light: '#4db6ac', dark: '#00796b' },
  { name: 'green', main: '#4caf50', light: '#81c784', dark: '#388e3c' },
  { name: 'purple', main: '#9c27b0', light: '#ba68c8', dark: '#7b1fa2' },
  { name: 'orange', main: '#ff9800', light: '#ffb74d', dark: '#f57c00' },
  { name: 'red', main: '#f44336', light: '#e57373', dark: '#d32f2f' }
];

// Secondary colors that pair well with primaries
const SECONDARY_COLORS = {
  blue: '#dc004e', // pink
  indigo: '#f44336', // red
  teal: '#ff9800', // orange
  green: '#9c27b0', // purple
  purple: '#ff9800', // orange
  orange: '#3f51b5', // indigo
  red: '#009688', // teal
};

export const ThemeContextProvider = ({ children }) => {
  // Try to get stored theme preferences, or use defaults
  const storedMode = localStorage.getItem('themeMode') || 'light';
  const storedColor = localStorage.getItem('themePrimaryColor') || 'blue';
  
  const [mode, setMode] = useState(storedMode);
  const [primaryColor, setPrimaryColor] = useState(storedColor);
  
  // Toggle between light and dark mode
  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };
  
  // Set a new primary color
  const changePrimaryColor = (color) => {
    setPrimaryColor(color);
  };
  
  // Update localStorage when preferences change
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
    localStorage.setItem('themePrimaryColor', primaryColor);
  }, [mode, primaryColor]);
  
  // Find the selected primary color object
  const selectedColor = PRIMARY_COLORS.find(color => color.name === primaryColor) || PRIMARY_COLORS[0];
  
  // Create theme based on current settings
  const theme = createTheme({
    palette: {
      mode,
      primary: {
        main: selectedColor.main,
        light: selectedColor.light,
        dark: selectedColor.dark,
      },
      secondary: {
        main: SECONDARY_COLORS[primaryColor] || '#dc004e',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 500,
      },
      h2: {
        fontWeight: 500,
      },
      h3: {
        fontWeight: 500,
      },
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          rounded: {
            borderRadius: 12,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            overflow: 'hidden',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'light' 
              ? `linear-gradient(145deg, ${selectedColor.main} 30%, ${selectedColor.dark} 90%)`
              : `linear-gradient(145deg, ${selectedColor.dark} 30%, #121212 90%)`,
            boxShadow: mode === 'light' 
              ? '0 3px 5px 2px rgba(0, 0, 0, .1)'
              : '0 3px 5px 2px rgba(0, 0, 0, .3)',
          },
        },
      },
    },
  });
  
  return (
    <ThemeContext.Provider 
      value={{ 
        mode, 
        primaryColor, 
        toggleMode, 
        setPrimaryColor: changePrimaryColor 
      }}
    >
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);