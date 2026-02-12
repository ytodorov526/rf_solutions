/**
 * API configuration for the RF Solutions client
 * Provides base URLs for different environments
 */

// Determine the base URL based on environment
const getBaseUrl = () => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:8788';  // Wrangler Pages dev server
  }
  return '';  // Same origin in production (Cloudflare Pages)
};

// API endpoints
const API = {
  baseUrl: getBaseUrl(),
  
  // Contact endpoints
  contacts: {
    create: '/api/contacts',
    list: '/api/contacts',
    get: (id) => `/api/contacts/${id}`,
  },
  
  // Project endpoints
  projects: {
    list: '/api/projects',
    categories: '/api/projects/categories',
    get: (id) => `/api/projects/${id}`,
  },
  
  // Product endpoints
  products: {
    list: '/api/products',
    categories: '/api/products/categories',
    get: (id) => `/api/products/${id}`,
  },
};

// Helper function to get full URL for an endpoint
export const getApiUrl = (endpoint) => `${API.baseUrl}${endpoint}`;

export default API;