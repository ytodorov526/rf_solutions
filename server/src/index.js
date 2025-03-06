const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mock data for demo purposes
const mockData = {
  projects: [
    {
      id: 1,
      title: '5G Antenna Array for Urban Deployment',
      image: 'https://source.unsplash.com/random/800x600/?antenna,5g',
      summary: 'Advanced 5G antenna array design for high-density urban environments',
      description: 'This project involved the design and implementation of a compact MIMO antenna array for 5G infrastructure deployment in dense urban environments. The solution achieved excellent coverage while minimizing visual impact and power consumption.',
      technologies: ['5G', 'MIMO', 'Antenna Array', 'Urban RF Propagation'],
      category: 'Telecommunications',
      results: 'The deployed antenna arrays increased network capacity by 300% while reducing energy consumption by 25% compared to traditional solutions.'
    },
    {
      id: 2,
      title: 'Automotive Radar System for ADAS',
      image: 'https://source.unsplash.com/random/800x600/?radar,automotive',
      summary: 'High-resolution radar system for advanced driver assistance systems',
      description: 'Developed a 77 GHz FMCW radar system for automotive applications with enhanced resolution and range capabilities. The system was designed to detect and classify multiple objects in complex traffic scenarios for advanced driver assistance systems.',
      technologies: ['77 GHz FMCW Radar', 'Signal Processing', 'ADAS', 'Object Classification'],
      category: 'Automotive',
      results: 'The radar system achieved 0.5° angular resolution and 15cm range resolution, significantly improving obstacle detection in poor visibility conditions.'
    }
  ],
  products: [
    {
      id: 1,
      name: 'RF Signal Analyzer Pro',
      image: 'https://source.unsplash.com/random/400x300/?electronics,analyzer',
      description: 'High-performance RF signal analyzer with frequency range from 9kHz to 44GHz. Features real-time spectrum analysis, advanced triggering, and intuitive touchscreen interface.',
      features: ['9kHz-44GHz range', 'Real-time analysis', 'Advanced triggering', 'Touchscreen interface'],
      category: 'Test Equipment'
    },
    {
      id: 2,
      name: 'Wideband Antenna Array',
      image: 'https://source.unsplash.com/random/400x300/?antenna,array',
      description: 'Configurable antenna array system for beamforming applications. Supports multiple frequency bands and can be customized for various deployment scenarios.',
      features: ['Configurable elements', 'Multiple frequency bands', 'Beamforming capability', 'Weatherproof design'],
      category: 'Antennas'
    }
  ],
  contacts: []
};

// API routes with mock data
app.get('/api/projects', (req, res) => {
  const { category, featured } = req.query;
  let filteredProjects = [...mockData.projects];
  
  if (category && category !== 'all') {
    filteredProjects = filteredProjects.filter(project => project.category === category);
  }
  
  res.json(filteredProjects);
});

app.get('/api/projects/categories', (req, res) => {
  const categories = [...new Set(mockData.projects.map(project => project.category))];
  res.json(categories);
});

app.get('/api/projects/:id', (req, res) => {
  const project = mockData.projects.find(p => p.id.toString() === req.params.id);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }
  res.json(project);
});

app.get('/api/products', (req, res) => {
  const { category } = req.query;
  let filteredProducts = [...mockData.products];
  
  if (category && category !== 'all') {
    filteredProducts = filteredProducts.filter(product => product.category === category);
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/categories', (req, res) => {
  const categories = [...new Set(mockData.products.map(product => product.category))];
  res.json(categories);
});

app.get('/api/products/:id', (req, res) => {
  const product = mockData.products.find(p => p.id.toString() === req.params.id);
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  res.json(product);
});

// Import routes
const contactRoutes = require('./routes/contactRoutes');
const productRoutes = require('./routes/productRoutes');
const projectRoutes = require('./routes/projectRoutes');

// Check if we're in demo mode or production
const DEMO_MODE = process.env.DEMO_MODE === 'true';

if (DEMO_MODE) {
  // Use mock data routes for demo
  app.post('/api/contacts', (req, res) => {
    const newContact = {
      id: mockData.contacts.length + 1,
      ...req.body,
      createdAt: new Date().toISOString()
    };
    mockData.contacts.push(newContact);
    
    // Try to send email notifications if email is configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      try {
        const emailService = require('./services/emailService');
        emailService.sendContactConfirmation(newContact).catch(err => 
          console.error('Failed to send confirmation email:', err)
        );
        emailService.sendAdminNotification(newContact).catch(err => 
          console.error('Failed to send admin notification:', err)
        );
      } catch (err) {
        console.error('Error with email service:', err);
      }
    }
    
    res.status(201).json(newContact);
  });
} else {
  // Use actual routes with database
  app.use('/api/contacts', contactRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/projects', projectRoutes);
}

// Serve static assets in production or for demo
// Check if we're in Azure deployment (where client build is copied to server/public)
// or in local development (where client build is in client/build)
const staticPath = fs.existsSync(path.join(__dirname, '../public'))
  ? path.join(__dirname, '../public')
  : path.join(__dirname, '../../client/build');

app.use(express.static(staticPath));

app.get('*', (req, res) => {
  const indexPath = fs.existsSync(path.join(staticPath, 'index.html'))
    ? path.join(staticPath, 'index.html')
    : path.join(__dirname, '../../client/build/index.html');
  res.sendFile(indexPath);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'An error occurred on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (using mock data for demo)`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Static files served from: ${staticPath}`);
});