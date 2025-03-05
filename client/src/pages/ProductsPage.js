import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  Chip,
  Divider
} from '@mui/material';

// Sample product data
const products = [
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
  },
  {
    id: 3,
    name: 'Compact Radar Module',
    image: 'https://source.unsplash.com/random/400x300/?radar,module',
    description: 'Compact FMCW radar module for short to medium range detection applications. Ideal for automotive, security, and industrial sensing systems.',
    features: ['24GHz FMCW radar', 'Range up to 100m', 'Low power consumption', 'Compact form factor'],
    category: 'Radar Systems'
  },
  {
    id: 4,
    name: 'RF Development Kit',
    image: 'https://source.unsplash.com/random/400x300/?development,kit',
    description: 'Complete development kit for RF engineers including software-defined radio, antennas, and comprehensive documentation for rapid prototyping.',
    features: ['Software-defined radio', 'Multiple antenna options', 'Comprehensive documentation', 'Example projects'],
    category: 'Development Tools'
  },
  {
    id: 5,
    name: 'High-Power RF Amplifier',
    image: 'https://source.unsplash.com/random/400x300/?amplifier,electronics',
    description: 'High-efficiency RF power amplifier with excellent linearity. Suitable for communications infrastructure, broadcasting, and research applications.',
    features: ['High efficiency', 'Excellent linearity', 'Thermal management', 'Remote monitoring'],
    category: 'RF Components'
  },
  {
    id: 6,
    name: 'Microwave Filter Bank',
    image: 'https://source.unsplash.com/random/400x300/?filter,microwave',
    description: 'Customizable filter bank for microwave frequency applications. Features low insertion loss and high selectivity for demanding RF environments.',
    features: ['Low insertion loss', 'High selectivity', 'Customizable passband', 'Compact design'],
    category: 'RF Components'
  }
];

function ProductsPage() {
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          RF Engineering Products
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Explore our range of professional RF, antenna, and radar solutions
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.name}
                    </Typography>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  <Typography paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Key Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {product.features.map((feature, index) => (
                      <Chip key={index} label={feature} size="small" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Technical Specs
                  </Button>
                  <Button size="small" color="secondary">
                    Request Quote
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        <Box sx={{ mt: 6, bgcolor: 'grey.100', p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Custom Solutions
          </Typography>
          <Typography paragraph>
            Don't see exactly what you need? Our engineering team specializes in creating custom RF, antenna, and radar solutions tailored to your specific requirements. From concept to production, we can help bring your ideas to reality.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => window.location.href = '/contact'}
          >
            Discuss Your Custom Requirements
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ProductsPage;