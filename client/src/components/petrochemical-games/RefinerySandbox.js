import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Card,
  CardContent,
  Slider,
  TextField,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import OpacityIcon from '@mui/icons-material/Opacity';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import ScienceIcon from '@mui/icons-material/Science';
import LoopIcon from '@mui/icons-material/Loop';
import ConstructionIcon from '@mui/icons-material/Construction';

// Define the refinery unit operations
const UNITS = [
  {
    id: 'atm-distillation',
    name: 'Atmospheric Distillation',
    icon: <OpacityIcon />,
    description: 'Separates crude oil into fractions based on boiling point',
    inputs: ['Crude Oil'],
    outputs: ['Gas', 'Naphtha', 'Kerosene', 'Diesel', 'Atmospheric Residue'],
    color: '#8884d8'
  },
  {
    id: 'vac-distillation',
    name: 'Vacuum Distillation',
    icon: <OpacityIcon />,
    description: 'Distills atmospheric residue under vacuum to extract additional fractions',
    inputs: ['Atmospheric Residue'],
    outputs: ['Light Vacuum Gas Oil', 'Heavy Vacuum Gas Oil', 'Vacuum Residue'],
    color: '#82ca9d'
  },
  {
    id: 'fcc',
    name: 'Fluid Catalytic Cracker',
    icon: <LocalFireDepartmentIcon />,
    description: 'Cracks heavy hydrocarbons into lighter, more valuable products',
    inputs: ['Vacuum Gas Oil'],
    outputs: ['FCC Gasoline', 'LPG', 'Light Cycle Oil', 'Clarified Oil'],
    color: '#ff8042'
  },
  {
    id: 'reformer',
    name: 'Catalytic Reformer',
    icon: <LoopIcon />,
    description: 'Converts naphtha into high-octane gasoline components',
    inputs: ['Naphtha'],
    outputs: ['Reformate', 'Hydrogen'],
    color: '#ffc658'
  },
  {
    id: 'hydrotreater',
    name: 'Hydrotreater',
    icon: <ScienceIcon />,
    description: 'Removes sulfur and other impurities using hydrogen',
    inputs: ['Diesel', 'Hydrogen'],
    outputs: ['Ultra-Low Sulfur Diesel'],
    color: '#0088fe'
  },
  {
    id: 'alkylation',
    name: 'Alkylation Unit',
    icon: <ConstructionIcon />,
    description: 'Converts LPG into high-octane gasoline components',
    inputs: ['LPG'],
    outputs: ['Alkylate'],
    color: '#d0ed57'
  }
];

function RefinerySandbox() {
  const [selectedUnits, setSelectedUnits] = useState([]);
  const [feedRate, setFeedRate] = useState(100);
  const [crudeType, setCrudeType] = useState('Light');
  const [isSimulating, setIsSimulating] = useState(false);
  const [results, setResults] = useState(null);
  const [showTutorial, setShowTutorial] = useState(true);
  const canvasRef = useRef(null);
  
  // Function to add a unit to the refinery
  const addUnit = (unitId) => {
    const unitToAdd = UNITS.find(unit => unit.id === unitId);
    if (unitToAdd) {
      setSelectedUnits([...selectedUnits, { 
        ...unitToAdd, 
        id: \`\${unitId}-\${Date.now()}\`, // Unique ID
        x: Math.random() * 400 + 50, // Random position
        y: Math.random() * 200 + 50,
        efficiency: 0.85, // Default efficiency
        connections: []
      }]);
    }
  };
  
  // Function to remove a unit from the refinery
  const removeUnit = (unitId) => {
    setSelectedUnits(selectedUnits.filter(unit => unit.id !== unitId));
  };
  
  // Function to update unit efficiency
  const updateUnitEfficiency = (unitId, newEfficiency) => {
    setSelectedUnits(selectedUnits.map(unit => 
      unit.id === unitId ? { ...unit, efficiency: newEfficiency } : unit
    ));
  };
  
  // Function to connect units (simplified)
  const connectUnits = () => {
    // In a real implementation, this would handle drawing connections
    // and validating that inputs/outputs can be connected
    
    // For this demo, we'll just create some automatic connections based on input/output compatibility
    let updatedUnits = [...selectedUnits];
    
    // Simple algorithm to connect compatible units
    updatedUnits.forEach((unit, idx) => {
      unit.outputs.forEach(output => {
        updatedUnits.forEach((targetUnit, targetIdx) => {
          if (idx !== targetIdx && targetUnit.inputs.includes(output)) {
            // Check if this connection already exists
            const connectionExists = unit.connections && unit.connections.some(conn => 
              conn.to === targetUnit.id && conn.outputName === output
            );
            
            if (!connectionExists) {
              // Add connection
              if (!unit.connections) unit.connections = [];
              unit.connections.push({
                from: unit.id,
                to: targetUnit.id,
                outputName: output,
                inputName: output
              });
            }
          }
        });
      });
    });
    
    setSelectedUnits(updatedUnits);
  };
  
  // Function to simulate the refinery
  const simulateRefinery = () => {
    setIsSimulating(true);
    
    // In a real implementation, this would simulate the flow of materials through the refinery
    // based on the connections, efficiencies, and process conditions
    
    // For this demo, we'll just create some mock results after a delay
    setTimeout(() => {
      // Create mock simulation results
      const simulationResults = {
        products: {
          'Gasoline': (selectedUnits.some(u => u.id.includes('reformer')) ? 35 : 20) * (feedRate / 100),
          'Diesel': (selectedUnits.some(u => u.id.includes('hydrotreater')) ? 40 : 25) * (feedRate / 100),
          'Jet Fuel': 15 * (feedRate / 100),
          'Fuel Oil': 10 * (feedRate / 100),
          'LPG': (selectedUnits.some(u => u.id.includes('fcc')) ? 8 : 5) * (feedRate / 100),
        },
        efficiency: calculateOverallEfficiency(),
        throughput: feedRate,
        crudeType: crudeType,
        co2Emissions: calculateCO2Emissions(),
        energyConsumption: calculateEnergyConsumption()
      };
      
      setResults(simulationResults);
      setIsSimulating(false);
    }, 2000);
  };
  
  // Helper function to calculate overall efficiency
  const calculateOverallEfficiency = () => {
    if (selectedUnits.length === 0) return 0;
    const avgEfficiency = selectedUnits.reduce((sum, unit) => sum + unit.efficiency, 0) / selectedUnits.length;
    
    // Bonus for having a complete process train
    const hasDistillation = selectedUnits.some(u => u.id.includes('atm-distillation'));
    const hasConversion = selectedUnits.some(u => u.id.includes('fcc') || u.id.includes('reformer'));
    const hasTreating = selectedUnits.some(u => u.id.includes('hydrotreater'));
    
    let bonus = 0;
    if (hasDistillation) bonus += 0.05;
    if (hasConversion) bonus += 0.05;
    if (hasTreating) bonus += 0.05;
    
    return Math.min(1, avgEfficiency + bonus);
  };
  
  // Helper function to calculate CO2 emissions (mock)
  const calculateCO2Emissions = () => {
    const baseEmissions = feedRate * 0.5; // Base emissions per unit of feed
    const unitFactor = selectedUnits.length * 0.1; // More units = more emissions
    
    // Efficiency reduces emissions
    const efficiencyFactor = 1 - calculateOverallEfficiency();
    
    return baseEmissions * (1 + unitFactor) * efficiencyFactor;
  };
  
  // Helper function to calculate energy consumption (mock)
  const calculateEnergyConsumption = () => {
    const baseEnergy = feedRate * 0.8; // Base energy per unit of feed
    const unitFactor = selectedUnits.length * 0.15; // More units = more energy
    
    // Efficiency reduces energy consumption
    const efficiencyFactor = 1 - calculateOverallEfficiency();
    
    return baseEnergy * (1 + unitFactor) * efficiencyFactor;
  };
  
  // Reset the refinery layout
  const resetRefinery = () => {
    setSelectedUnits([]);
    setResults(null);
  };

  return (
    <Box>
      {showTutorial && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          onClose={() => setShowTutorial(false)}
        >
          <Typography variant="subtitle1" gutterBottom>How to use the Refinery Sandbox:</Typography>
          <Typography variant="body2">
            1. Add refinery units from the palette on the left<br />
            2. Adjust crude oil feed and type<br />
            3. Click "Auto-Connect" to create flows between compatible units<br />
            4. Click "Simulate" to run your refinery and see the results
          </Typography>
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Unit Palette */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Process Units
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {UNITS.map((unit) => (
                <ListItem 
                  key={unit.id}
                  button
                  onClick={() => addUnit(unit.id)}
                  sx={{ 
                    border: '1px solid #eee',
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemIcon sx={{ color: unit.color }}>
                    {unit.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={unit.name} 
                    secondary={
                      <Tooltip title={unit.description}>
                        <InfoIcon sx={{ fontSize: 16, ml: 1, verticalAlign: 'middle' }} />
                      </Tooltip>
                    } 
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
        
        {/* Refinery Canvas */}
        <Grid item xs={12} md={6}>
          <Paper 
            sx={{ 
              p: 2, 
              height: '500px', 
              position: 'relative',
              overflow: 'hidden',
              backgroundColor: '#f9f9f9'
            }}
            ref={canvasRef}
          >
            <Typography variant="h6" gutterBottom>
              Refinery Layout
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {/* Controls */}
            <Box sx={{ mb: 2, display: 'flex', gap: 1 }}>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                startIcon={<RestartAltIcon />}
                onClick={resetRefinery}
              >
                Reset
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                size="small"
                onClick={connectUnits}
              >
                Auto-Connect
              </Button>
              <Button 
                variant="contained" 
                color="success" 
                size="small"
                startIcon={<PlayArrowIcon />}
                onClick={simulateRefinery}
                disabled={isSimulating || selectedUnits.length === 0}
              >
                Simulate
              </Button>
            </Box>
            
            {/* Feed Controls */}
            <Box sx={{ mb: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Crude Oil Feed Rate (kbpd)
                  </Typography>
                  <Slider
                    value={feedRate}
                    onChange={(e, newValue) => setFeedRate(newValue)}
                    min={10}
                    max={200}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" gutterBottom>
                    Crude Type
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    value={crudeType}
                    onChange={(e) => setCrudeType(e.target.value)}
                    size="small"
                    SelectProps={{
                      native: true,
                    }}
                  >
                    <option value="Light">Light Sweet Crude</option>
                    <option value="Medium">Medium Sour Crude</option>
                    <option value="Heavy">Heavy Sour Crude</option>
                  </TextField>
                </Grid>
              </Grid>
            </Box>
            
            {/* Selected Units */}
            <Box sx={{ 
              position: 'relative', 
              height: 'calc(100% - 150px)', 
              border: '1px dashed #ccc',
              borderRadius: 1,
              p: 1,
              overflow: 'auto'
            }}>
              {selectedUnits.length === 0 ? (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  alignItems: 'center',
                  height: '100%',
                  color: 'text.secondary'
                }}>
                  <Typography>Add units from the palette to design your refinery</Typography>
                </Box>
              ) : (
                selectedUnits.map((unit) => (
                  <Box 
                    key={unit.id} 
                    sx={{ 
                      position: 'absolute',
                      left: unit.x,
                      top: unit.y,
                      width: 120,
                      backgroundColor: 'background.paper',
                      borderRadius: 1,
                      p: 1,
                      boxShadow: 1,
                      border: `2px solid ${unit.color}`,
                      cursor: 'move',
                      '&:hover': {
                        boxShadow: 3
                      }
                    }}
                    // In a real implementation, would add drag event handlers here
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2" noWrap>{unit.name}</Typography>
                      <IconButton 
                        size="small" 
                        onClick={() => removeUnit(unit.id)}
                        sx={{ p: 0.5 }}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="caption" display="block">Efficiency:</Typography>
                      <Slider
                        size="small"
                        value={unit.efficiency}
                        onChange={(e, value) => updateUnitEfficiency(unit.id, value)}
                        min={0.5}
                        max={1}
                        step={0.01}
                        valueLabelDisplay="auto"
                        valueLabelFormat={value => `${Math.round(value * 100)}%`}
                      />
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Results Panel */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Simulation Results
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {isSimulating ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography gutterBottom>Simulating refinery operation...</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                  <LoopIcon sx={{ animation: 'spin 2s linear infinite', fontSize: 40 }} />
                </Box>
              </Box>
            ) : results ? (
              <>
                <Typography variant="subtitle2" gutterBottom>
                  Products Yield (kbpd)
                </Typography>
                <List dense>
                  {Object.entries(results.products).map(([product, amount]) => (
                    <ListItem key={product} disablePadding sx={{ py: 0.5 }}>
                      <ListItemText 
                        primary={`${product}: ${amount.toFixed(1)} kbpd`}
                        primaryTypographyProps={{ variant: 'body2' }}
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Divider sx={{ my: 1 }} />
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Performance Metrics
                  </Typography>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            Overall Efficiency
                          </Typography>
                          <Typography variant="h6" color={results.efficiency > 0.8 ? 'success.main' : 'warning.main'}>
                            {Math.round(results.efficiency * 100)}%
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            Throughput
                          </Typography>
                          <Typography variant="h6">
                            {results.throughput} kbpd
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            CO₂ Emissions
                          </Typography>
                          <Typography variant="h6" color={results.co2Emissions < 30 ? 'success.main' : 'error.main'}>
                            {results.co2Emissions.toFixed(1)} t/d
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Card variant="outlined" sx={{ bgcolor: '#f5f5f5' }}>
                        <CardContent sx={{ py: 1, '&:last-child': { pb: 1 } }}>
                          <Typography variant="caption" color="text.secondary">
                            Energy Use
                          </Typography>
                          <Typography variant="h6" color={results.energyConsumption < 60 ? 'success.main' : 'warning.main'}>
                            {results.energyConsumption.toFixed(1)} GJ/d
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body2" sx={{ mt: 2, p: 1, bgcolor: 'background.paper', borderRadius: 1 }}>
                    Your refinery design processes {results.throughput} kbpd of {results.crudeType} crude oil with {Math.round(results.efficiency * 100)}% efficiency.
                  </Typography>
                </Box>
              </>
            ) : (
              <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                <Typography gutterBottom>No simulation results yet</Typography>
                <Typography variant="body2">
                  Build your refinery and click "Simulate" to see results
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default RefinerySandbox;