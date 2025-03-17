import React from 'react';
import { Box, Paper, Typography, Divider } from '@mui/material';

function DigitalLogicSimulator() {
  return (
    <Box id="digital-logic-simulator-section">
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Digital Logic Simulator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Design and test digital logic circuits with interactive gate-level simulation.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Typography variant="body1" sx={{ mt: 4, textAlign: 'center' }}>
          This component is currently under development.
        </Typography>
      </Paper>
    </Box>
  );
}

export default DigitalLogicSimulator;