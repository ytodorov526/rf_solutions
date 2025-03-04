import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  MenuItem,
  Snackbar,
  Alert,
  Divider,
  Card,
  CardContent,
  useTheme
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import SendIcon from '@mui/icons-material/Send';

const inquiryTypes = [
  'General Inquiry',
  'Product Information',
  'Custom Engineering Services',
  'Project Consultation',
  'Technical Support',
  'Career Opportunities',
  'Other'
];

function ContactPage() {
  const theme = useTheme();
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    inquiryType: '',
    message: ''
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formValues.name || !formValues.email || !formValues.message) {
      setSnackbarMessage('Please fill in all required fields');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
      return;
    }
    
    try {
      // Set loading state
      setSnackbarMessage('Sending your message...');
      setSnackbarSeverity('info');
      setOpenSnackbar(true);
      
      // Send data to backend API
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formValues),
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // Show success message
      setSnackbarMessage('Your message has been sent. We will contact you shortly!');
      setSnackbarSeverity('success');
      setOpenSnackbar(true);
      
      // Reset form
      setFormValues({
        name: '',
        email: '',
        phone: '',
        company: '',
        inquiryType: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSnackbarMessage('There was an error sending your message. Please try again or contact us directly.');
      setSnackbarSeverity('error');
      setOpenSnackbar(true);
    }
  };
  
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Contact Us
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Get in touch with our RF engineering team
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Grid container spacing={4}>
          {/* Contact Information */}
          <Grid item xs={12} md={4}>
            <Box sx={{ height: '100%' }}>
              <Card sx={{ height: '100%', bgcolor: theme.palette.primary.main, color: 'white' }}>
                <CardContent>
                  <Typography variant="h4" gutterBottom>
                    Get In Touch
                  </Typography>
                  <Typography variant="body1" paragraph>
                    Have questions about our RF engineering services or products? Our team is ready to help.
                  </Typography>
                  
                  <Box sx={{ mt: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <EmailIcon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Email Us
                        </Typography>
                        <Typography variant="body2">
                          info@rfsolutions.com
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <PhoneIcon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Call Us
                        </Typography>
                        <Typography variant="body2">
                          +1 (555) 123-4567
                        </Typography>
                      </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <LocationOnIcon sx={{ mr: 2 }} />
                      <Box>
                        <Typography variant="subtitle1" fontWeight="bold">
                          Visit Us
                        </Typography>
                        <Typography variant="body2">
                          123 Tech Park Dr.<br />
                          Engineering City, CA 92123
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 4 }}>
                    <Typography variant="h6" gutterBottom>
                      Office Hours
                    </Typography>
                    <Typography variant="body2">
                      Monday - Friday: 8:00 AM - 6:00 PM<br />
                      Saturday: By appointment only<br />
                      Sunday: Closed
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Grid>
          
          {/* Contact Form */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom>
                Send Us a Message
              </Typography>
              <Typography variant="body1" paragraph>
                Please fill out the form below and we'll get back to you as soon as possible.
              </Typography>
              
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Your Name"
                      name="name"
                      value={formValues.name}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formValues.email}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={formValues.phone}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Company/Organization"
                      name="company"
                      value={formValues.company}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      select
                      label="Inquiry Type"
                      name="inquiryType"
                      value={formValues.inquiryType}
                      onChange={handleChange}
                    >
                      {inquiryTypes.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      multiline
                      rows={6}
                      label="Your Message"
                      name="message"
                      value={formValues.message}
                      onChange={handleChange}
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size="large"
                      endIcon={<SendIcon />}
                    >
                      Send Message
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
        
        {/* Map Section */}
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Our Location
          </Typography>
          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Box
              component="iframe"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3356.994952826029!2d-117.16211592397331!3d32.7231976723051!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80d954c34d3a5027%3A0x38ebe74a32798d0!2sSan%20Diego%2C%20CA!5e0!3m2!1sen!2sus!4v1689172615895!5m2!1sen!2sus"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></Box>
          </Paper>
        </Box>
      </Container>
      
      {/* Snackbar for form submission feedback */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbarSeverity} 
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ContactPage;