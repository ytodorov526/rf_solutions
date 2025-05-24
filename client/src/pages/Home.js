import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to RF Solutions
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Your Gateway to Scientific Learning
        </Typography>
        <Typography variant="body1" paragraph>
          Explore our various educational resources and interactive quizzes to enhance your understanding of science and technology.
        </Typography>
      </Box>
    </Container>
  );
};

export default Home; 