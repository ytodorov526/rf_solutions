import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  Button,
  useMediaQuery,
  useTheme
} from '@mui/material';
import RefinerySandbox from '../components/petrochemical-games/RefinerySandbox';
import DistillationSimulator from '../components/petrochemical-games/DistillationSimulator';
import PetrochemicalQuiz from '../components/petrochemical-games/PetrochemicalQuiz';
import MolecularMatchingGame from '../components/petrochemical-games/MolecularMatchingGame';
import ChemistryCrossword from '../components/petrochemical-games/ChemistryCrossword';
import SchoolIcon from '@mui/icons-material/School';
import GamesIcon from '@mui/icons-material/Games';
import ScienceIcon from '@mui/icons-material/Science';
import ConstructionIcon from '@mui/icons-material/Construction';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';

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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Interactive Petrochemistry Games
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Learn about molecular structures, refinery processes, and petrochemical engineering through engaging educational games
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={3}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                textColor="primary"
                indicatorColor="primary"
                aria-label="petrochemistry games tabs"
              >
                <Tab icon={<GamesIcon />} iconPosition="start" label="Molecular Matching" {...a11yProps(0)} />
                <Tab icon={<ScienceIcon />} iconPosition="start" label="Chemistry Crossword" {...a11yProps(1)} />
                <Tab icon={<SchoolIcon />} iconPosition="start" label="Petrochemical Quiz" {...a11yProps(2)} />
                <Tab icon={<ConstructionIcon />} iconPosition="start" label="Refinery Sandbox" {...a11yProps(3)} />
                <Tab icon={<ScienceIcon />} iconPosition="start" label="Distillation Simulator" {...a11yProps(4)} />
              </Tabs>
            </Box>
            
            <TabPanel value={activeTab} index={0}>
              <MolecularMatchingGame />
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <ChemistryCrossword />
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              <PetrochemicalQuiz />
            </TabPanel>
            
            <TabPanel value={activeTab} index={3}>
              <RefinerySandbox />
            </TabPanel>
            
            <TabPanel value={activeTab} index={4}>
              <DistillationSimulator />
            </TabPanel>
          </Paper>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Educational Benefits
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Our interactive petrochemistry games are designed to help students and professionals understand complex molecular structures and refining processes through engaging, hands-on learning.
                </Typography>
                <Typography variant="body2">
                  These tools visualize difficult concepts like molecular bonding, distillation, catalytic reactions, and refinery integration in an intuitive and enjoyable way.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <ScienceIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Industry Applications
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  These simulations and games can be used for training new engineers, exploring design alternatives, and understanding the fundamentals of petrochemical processes without real-world risks.
                </Typography>
                <Typography variant="body2">
                  The games incorporate real-world constraints and operational parameters that reflect actual chemical structures, reactions, and refinery equipment.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <MilitaryTechIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Skill Development
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  From basic molecular understanding to complex refinery operations, our games help develop critical thinking, problem-solving, and technical knowledge across multiple difficulty levels.
                </Typography>
                <Typography variant="body2">
                  Users can track their progress through increasing difficulty levels and different aspects of petrochemistry, from molecular structure to process engineering.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6} lg={3}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <GamesIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Learning Progression
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Start with the molecular matching and crossword puzzles to learn terminology and basic concepts, then progress to the quizzes and interactive simulations to deepen your knowledge.
                </Typography>
                <Typography variant="body2">
                  The Refinery Sandbox allows you to build complex integrated processing systems, providing a capstone experience after mastering individual components and reactions.
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