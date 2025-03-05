import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) => theme.palette.grey[900],
        color: 'white',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="white" gutterBottom>
              RF Solutions
            </Typography>
            <Typography variant="body2" color="white">
              Innovative RF, antenna, and radar design solutions for modern engineering challenges.
            </Typography>
            <Box sx={{ mt: 2 }}>
              <IconButton color="inherit" aria-label="LinkedIn">
                <LinkedInIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton color="inherit" aria-label="Facebook">
                <FacebookIcon />
              </IconButton>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="white" gutterBottom>
              Quick Links
            </Typography>
            <Link component={RouterLink} to="/" color="inherit" display="block" sx={{ mb: 1 }}>
              Home
            </Link>
            <Link component={RouterLink} to="/products" color="inherit" display="block" sx={{ mb: 1 }}>
              Products
            </Link>
            <Link component={RouterLink} to="/services" color="inherit" display="block" sx={{ mb: 1 }}>
              Services
            </Link>
            <Link component={RouterLink} to="/projects" color="inherit" display="block" sx={{ mb: 1 }}>
              Projects
            </Link>
            <Link component={RouterLink} to="/contact" color="inherit" display="block">
              Contact
            </Link>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <Typography variant="h6" color="white" gutterBottom>
              Contact Us
            </Typography>
            <Typography variant="body2" color="white" paragraph>
              123 Tech Park Dr.<br />
              Engineering City, CA 92123
            </Typography>
            <Typography variant="body2" color="white">
              Email: info@rfsolutions.com<br />
              Phone: (555) 123-4567
            </Typography>
          </Grid>
        </Grid>
        
        <Box mt={3}>
          <Typography variant="body2" color="white" align="center">
            © {new Date().getFullYear()} RF Solutions, Inc. All rights reserved.
          </Typography>
          <Typography variant="body2" color="white" align="center" sx={{ mt: 1 }}>
            Design and Implementation by Yavor Todorov
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;