// VVER1000Scenarios.js - Scenario selection and information component
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Chip,
  Card,
  CardContent,
  CardMedia,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import StarIcon from '@mui/icons-material/Star';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { SCENARIOS } from './VVER1000Constants';

/**
 * Difficulty rating component
 */
const DifficultyRating = ({ difficulty }) => {
  let color, stars;
  
  switch(difficulty) {
    case 'Easy':
      color = 'success';
      stars = 1;
      break;
    case 'Moderate':
      color = 'info';
      stars = 2;
      break;
    case 'Hard':
      color = 'warning';
      stars = 3;
      break;
    case 'Expert':
      color = 'error';
      stars = 4;
      break;
    default:
      color = 'default';
      stars = 0;
  }
  
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Chip 
        label={difficulty} 
        size="small" 
        color={color}
        sx={{ mr: 1 }}
      />
      <Box sx={{ color: 'warning.main' }}>
        {[...Array(stars)].map((_, i) => (
          <StarIcon key={i} fontSize="small" />
        ))}
      </Box>
    </Box>
  );
};

/**
 * Scenario selection and information component
 */
function VVER1000Scenarios({ 
  activeScenario, 
  onScenarioChange, 
  onShowInstructions, 
  onShowOperatorLog,
  onStartScenario,
  disabled
}) {
  // Get scenario thumbnail image based on scenario ID
  const getScenarioImage = (scenarioId) => {
    return `/images/reactor/${scenarioId}.jpg`;
  };
  
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6}>
          <FormControl fullWidth>
            <InputLabel id="scenario-select-label">Select Operational Scenario</InputLabel>
            <Select
              labelId="scenario-select-label"
              id="scenario-select"
              value={activeScenario ? activeScenario.id : ''}
              label="Select Operational Scenario"
              onChange={onScenarioChange}
              disabled={disabled}
            >
              <MenuItem value=""><em>Select a scenario</em></MenuItem>
              {SCENARIOS.map(scenario => (
                <MenuItem key={scenario.id} value={scenario.id}>
                  {scenario.name} - {scenario.difficulty}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              variant="outlined" 
              color="info" 
              startIcon={<LibraryBooksIcon />}
              onClick={onShowInstructions}
              sx={{ mr: 1 }}
            >
              Instructions
            </Button>
            
            <Button 
              variant="outlined" 
              startIcon={<AccessTimeIcon />}
              onClick={onShowOperatorLog}
            >
              Operator Log
            </Button>
          </Box>
        </Grid>
      </Grid>
      
      {activeScenario && (
        <Card sx={{ mt: 2 }}>
          <Grid container>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                height="200"
                image={getScenarioImage(activeScenario.id)}
                alt={activeScenario.name}
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = '/images/reactor/default.jpg';
                }}
                sx={{ objectFit: 'cover' }}
              />
            </Grid>
            
            <Grid item xs={12} md={8}>
              <CardContent>
                <Typography variant="h6" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  {activeScenario.name}
                  <DifficultyRating difficulty={activeScenario.difficulty} />
                </Typography>
                
                <Typography variant="body2" paragraph color="text.secondary">
                  {activeScenario.description}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>
                  Goal: {activeScenario.goal}
                </Typography>
                
                <List dense disablePadding>
                  {activeScenario.steps.map((step, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 0.25 }}>
                      <ListItemIcon sx={{ minWidth: 30 }}>
                        <ArrowRightIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText primary={step} />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="contained" 
                    color="primary"
                    startIcon={<PlayArrowIcon />}
                    onClick={onStartScenario}
                    disabled={disabled}
                  >
                    Start Scenario
                  </Button>
                </Box>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      )}
    </Box>
  );
}

export default VVER1000Scenarios;