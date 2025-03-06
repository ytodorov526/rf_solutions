import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import RefinerySandbox from '../components/petrochemical-games/RefinerySandbox';
import DistillationSimulator from '../components/petrochemical-games/DistillationSimulator';
import PetrochemicalQuiz from '../components/petrochemical-games/PetrochemicalQuiz';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`game-tabpanel-${index}`}
      aria-labelledby={`game-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `game-tab-${index}`,
    'aria-controls': `game-tabpanel-${index}`,
  };
}

function PetrochemicalGamesPage() {
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Interactive Petrochemical Engineering Games
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Learn about refinery design, distillation processes, and petrochemical engineering through interactive simulations
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={3}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant="fullWidth"
                textColor="primary"
                indicatorColor="primary"
                aria-label="petrochemical games tabs"
              >
                <Tab label="Refinery Sandbox" {...a11yProps(0)} />
                <Tab label="Distillation Simulator" {...a11yProps(1)} />
                <Tab label="Petrochemical Quiz" {...a11yProps(2)} />
              </Tabs>
            </Box>
            
            <TabPanel value={activeTab} index={0}>
              <RefinerySandbox />
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <DistillationSimulator />
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              <PetrochemicalQuiz />
            </TabPanel>
          </Paper>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Typography variant="h5" component="h3" gutterBottom color="primary">
                  Educational Benefits
                </Typography>
                <Typography variant="body1" paragraph>
                  Our interactive petrochemical simulations are designed to help students and professionals understand complex refining processes through hands-on learning.
                </Typography>
                <Typography variant="body2">
                  These tools visualize difficult concepts like distillation, fluid catalytic cracking, and refinery integration in an engaging and intuitive way.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Typography variant="h5" component="h3" gutterBottom color="primary">
                  Industry Applications
                </Typography>
                <Typography variant="body1" paragraph>
                  These simulators can be used for training new engineers, exploring design alternatives, and understanding the fundamentals of petrochemical processes.
                </Typography>
                <Typography variant="body2">
                  The games incorporate real-world constraints and operational parameters that reflect actual refinery equipment and configurations.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Typography variant="h5" component="h3" gutterBottom color="primary">
                  Learning Progression
                </Typography>
                <Typography variant="body1" paragraph>
                  Start with the basic quizzes to learn terminology and fundamental concepts, then progress to the interactive simulations to apply your knowledge.
                </Typography>
                <Typography variant="body2">
                  The Refinery Sandbox allows you to build complex integrated processing systems, providing a capstone experience after mastering individual unit operations.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default PetrochemicalGamesPage;