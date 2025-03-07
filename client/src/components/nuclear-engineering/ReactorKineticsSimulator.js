import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Slider,
  Button,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Tooltip,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';

// Import chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// Initial reactor parameters
const initialParameters = {
  // Reactor kinetics parameters
  beta: 0.0065, // Delayed neutron fraction
  promptNeutronLifetime: 1e-4, // seconds
  // Reactivity parameters
  initialReactivity: 0.0, // Initial reactivity (Δk/k)
  reactivityInsertionRate: 0.0001, // per second
  reactivityInsertionDuration: 5, // seconds
  // Simulation parameters
  simulationTime: 30, // seconds
  timeStep: 0.1, // seconds
  // Delayed neutron groups parameters (simplified to one group for this demo)
  lambda: 0.1, // delayed neutron decay constant, 1/s
  delayedNeutronFraction: 1.0, // all delayed neutrons in one group
};

// Simulation presets
const simulationPresets = [
  {
    id: 'prompt-critical',
    name: 'Prompt Critical Excursion',
    description: 'Reactivity insertion exceeding the delayed neutron fraction, causing a rapid power increase',
    parameters: {
      ...initialParameters,
      initialReactivity: 0.0,
      reactivityInsertionRate: 0.002, // High insertion rate
      reactivityInsertionDuration: 4,
      simulationTime: 10,
    },
  },
  {
    id: 'delayed-critical',
    name: 'Delayed Critical Operation',
    description: 'Reactivity insertion below the delayed neutron fraction, showing the stabilizing effect of delayed neutrons',
    parameters: {
      ...initialParameters,
      initialReactivity: 0.0,
      reactivityInsertionRate: 0.0005,
      reactivityInsertionDuration: 10,
      simulationTime: 50,
    },
  },
  {
    id: 'negative-reactivity',
    name: 'Negative Reactivity Insertion',
    description: 'Demonstration of reactor power decrease following negative reactivity insertion',
    parameters: {
      ...initialParameters,
      initialReactivity: 0.003,
      reactivityInsertionRate: -0.001,
      reactivityInsertionDuration: 5,
      simulationTime: 20,
    },
  },
  {
    id: 'oscillation',
    name: 'Reactivity Oscillation',
    description: 'Alternating positive and negative reactivity insertions causing power oscillation',
    parameters: {
      ...initialParameters,
      initialReactivity: 0.0,
      reactivityInsertionRate: 0.0008,
      reactivityInsertionDuration: 15,
      oscillation: true,
      simulationTime: 60,
    },
  },
];

function ReactorKineticsSimulator() {
  // State for reactor parameters
  const [parameters, setParameters] = useState(initialParameters);
  
  // State for simulation data
  const [simulationData, setSimulationData] = useState({
    time: [],
    power: [],
    reactivity: [],
    delayedNeutronPrecursors: [],
  });
  
  // State for simulation control
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('');
  
  // Additional options
  const [showDelayedNeutrons, setShowDelayedNeutrons] = useState(false);
  const [logScale, setLogScale] = useState(false);
  
  // Animation frame reference
  const animationRef = useRef(null);
  
  // Chart reference
  const chartRef = useRef(null);
  
  // Effect to handle animation
  useEffect(() => {
    if (isRunning) {
      let lastTimestamp = performance.now();
      
      const animate = (timestamp) => {
        const elapsed = timestamp - lastTimestamp;
        
        if (elapsed > 100) { // Update every 100ms
          lastTimestamp = timestamp;
          
          setCurrentTime(prevTime => {
            const newTime = prevTime + 0.1;
            
            if (newTime >= parameters.simulationTime) {
              setIsRunning(false);
              return parameters.simulationTime;
            }
            
            runSimulationStep(newTime);
            return newTime;
          });
        }
        
        if (isRunning) {
          animationRef.current = requestAnimationFrame(animate);
        }
      };
      
      animationRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, parameters.simulationTime]);
  
  // Effect to clear simulation when parameters change
  useEffect(() => {
    if (typeof resetSimulation === 'function') {
      resetSimulation();
    }
  }, [parameters, resetSimulation]);
  
  // Function to reset simulation
  const resetSimulation = React.useCallback(() => {
    setIsRunning(false);
    setCurrentTime(0);
    setSimulationData({
      time: [0],
      power: [1.0], // Normalized power starting at 100%
      reactivity: [parameters.initialReactivity / parameters.beta], // Initial reactivity in dollars
      delayedNeutronPrecursors: [parameters.beta / parameters.lambda], // Initial delayed neutron concentration
    });
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [parameters.initialReactivity, parameters.beta, parameters.lambda]);

  // Function to run a simulation step
  const runSimulationStep = React.useCallback((time) => {
    // Simplified point-kinetics equations
    // This is a basic implementation for educational purposes
    
    // Calculate current reactivity based on insertion rate and duration
    let currentReactivity = parameters.initialReactivity;
    
    if (time <= parameters.reactivityInsertionDuration) {
      currentReactivity += time * parameters.reactivityInsertionRate;
    } else {
      currentReactivity += parameters.reactivityInsertionDuration * parameters.reactivityInsertionRate;
      
      // If oscillation is enabled, reverse reactivity after the insertion duration
      if (parameters.oscillation && time <= parameters.reactivityInsertionDuration * 2) {
        const oscillationTime = time - parameters.reactivityInsertionDuration;
        currentReactivity -= oscillationTime * parameters.reactivityInsertionRate;
      }
    }
    
    // Get previous values
    const prevTime = simulationData.time.length > 0 ? simulationData.time[simulationData.time.length - 1] : 0;
    const prevPower = simulationData.power.length > 0 ? simulationData.power[simulationData.power.length - 1] : 1.0;
    const prevDelayedNeutrons = simulationData.delayedNeutronPrecursors.length > 0 
      ? simulationData.delayedNeutronPrecursors[simulationData.delayedNeutronPrecursors.length - 1] 
      : parameters.beta / parameters.lambda;
    
    // Calculate reactivity in dollars
    const reactivityDollars = currentReactivity / parameters.beta;
    
    // Calculate new values
    // Simplified point kinetics equations
    const dt = time - prevTime;
    
    // Update delayed neutron precursors
    const newDelayedNeutrons = prevDelayedNeutrons + dt * (
      (parameters.beta / parameters.promptNeutronLifetime) * prevPower - 
      parameters.lambda * prevDelayedNeutrons
    );
    
    // Update power
    const newPower = prevPower + dt * (
      ((currentReactivity - parameters.beta) / parameters.promptNeutronLifetime) * prevPower +
      parameters.lambda * prevDelayedNeutrons
    );
    
    // Update simulation data
    setSimulationData(prev => ({
      time: [...prev.time, time],
      power: [...prev.power, Math.max(0.001, newPower)], // Ensure power is positive for log scale
      reactivity: [...prev.reactivity, reactivityDollars],
      delayedNeutronPrecursors: [...prev.delayedNeutronPrecursors, newDelayedNeutrons],
    }));
  }, [parameters.beta, parameters.initialReactivity, parameters.lambda, parameters.promptNeutronLifetime, parameters.reactivityInsertionDuration, parameters.reactivityInsertionRate, parameters.oscillation, simulationData.time, simulationData.power, simulationData.delayedNeutronPrecursors]);
  
  // Function to start/pause simulation
  const toggleSimulation = () => {
    if (currentTime >= parameters.simulationTime) {
      // If at the end, restart
      resetSimulation();
      setIsRunning(true);
    } else {
      // Otherwise toggle
      setIsRunning(prev => !prev);
    }
  };
  
  // Function to handle parameter change
  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: value,
    }));
  };
  
  // Function to handle preset selection
  const handlePresetChange = (event) => {
    const presetId = event.target.value;
    setSelectedPreset(presetId);
    
    if (presetId) {
      const preset = simulationPresets.find(p => p.id === presetId);
      if (preset) {
        setParameters(preset.parameters);
      }
    }
  };
  
  // Prepare chart data
  const chartData = {
    labels: simulationData.time,
    datasets: [
      {
        label: 'Reactor Power',
        data: simulationData.power,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Reactivity (dollars)',
        data: simulationData.reactivity,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y1',
      },
      ...(showDelayedNeutrons ? [{
        label: 'Delayed Neutron Precursors',
        data: simulationData.delayedNeutronPrecursors,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        yAxisID: 'y2',
      }] : []),
    ],
  };
  
  // Chart options
  const chartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Reactor Kinetics Simulation',
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time (s)',
        },
      },
      y: {
        type: logScale ? 'logarithmic' : 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Relative Power',
        },
        min: logScale ? 0.001 : 0,
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false,
        },
        title: {
          display: true,
          text: 'Reactivity (dollars)',
        },
      },
      ...(showDelayedNeutrons ? {
        y2: {
          type: 'linear',
          display: true,
          position: 'right',
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Delayed Neutron Concentration',
          },
        },
      } : {}),
    },
  };
  
  // Function to export data
  const exportData = () => {
    const csvContent = [
      'Time (s),Power,Reactivity (dollars)' + (showDelayedNeutrons ? ',Delayed Neutrons' : ''),
      ...simulationData.time.map((time, index) => 
        time + ',' + simulationData.power[index] + ',' + simulationData.reactivity[index] + 
        (showDelayedNeutrons ? ',' + simulationData.delayedNeutronPrecursors[index] : '')
      ),
    ].join('\\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'reactor_simulation_data.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Function to save chart as image
  const saveChart = () => {
    if (chartRef.current) {
      const url = chartRef.current.toBase64Image();
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'reactor_simulation_chart.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Point Kinetics Reactor Simulator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This educational tool simulates the time-dependent behavior of a nuclear reactor using the point kinetics 
          equations. Adjust parameters to see how reactivity changes affect reactor power level.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Simulation Presets */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="preset-select-label">Simulation Preset</InputLabel>
              <Select
                labelId="preset-select-label"
                id="preset-select"
                value={selectedPreset}
                label="Simulation Preset"
                onChange={handlePresetChange}
              >
                <MenuItem value=""><em>Custom Parameters</em></MenuItem>
                {simulationPresets.map(preset => (
                  <MenuItem key={preset.id} value={preset.id}>{preset.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {selectedPreset && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {simulationPresets.find(p => p.id === selectedPreset)?.description}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        {/* Parameter Controls */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Simulation Parameters
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Initial Reactivity (Δk/k):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.initialReactivity}
                  onChange={(e) => handleParameterChange('initialReactivity', parseFloat(e.target.value))}
                  inputProps={{
                    min: -0.01,
                    max: 0.01,
                    step: 0.0001,
                  }}
                  disabled={isRunning}
                />
                <Tooltip title="Initial reactivity of the reactor. Positive values are supercritical, negative values are subcritical.">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Reactivity Insertion Rate:
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.reactivityInsertionRate}
                  onChange={(e) => handleParameterChange('reactivityInsertionRate', parseFloat(e.target.value))}
                  inputProps={{
                    min: -0.01,
                    max: 0.01,
                    step: 0.0001,
                  }}
                  disabled={isRunning}
                />
                <Tooltip title="Rate of reactivity insertion in Δk/k per second">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Insertion Duration (s):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.reactivityInsertionDuration}
                  onChange={(e) => handleParameterChange('reactivityInsertionDuration', parseFloat(e.target.value))}
                  inputProps={{
                    min: 0,
                    max: 60,
                    step: 1,
                  }}
                  disabled={isRunning}
                />
                <Tooltip title="Duration of reactivity insertion in seconds">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Delayed Neutron Fraction (β):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.beta}
                  onChange={(e) => handleParameterChange('beta', parseFloat(e.target.value))}
                  inputProps={{
                    min: 0.001,
                    max: 0.01,
                    step: 0.0001,
                  }}
                  disabled={isRunning}
                />
                <Tooltip title="Fraction of neutrons that are delayed. Typically ~0.0065 for U-235">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Prompt Neutron Lifetime (s):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.promptNeutronLifetime}
                  onChange={(e) => handleParameterChange('promptNeutronLifetime', parseFloat(e.target.value))}
                  inputProps={{
                    min: 1e-5,
                    max: 1e-3,
                    step: 1e-5,
                  }}
                  disabled={isRunning}
                />
                <Tooltip title="Average time between neutron generation and absorption, typically ~1e-4 seconds">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Simulation Time (s):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.simulationTime}
                  onChange={(e) => handleParameterChange('simulationTime', parseFloat(e.target.value))}
                  inputProps={{
                    min: 1,
                    max: 120,
                    step: 1,
                  }}
                  disabled={isRunning}
                />
                <Tooltip title="Total simulation time in seconds">
                  <IconButton size="small">
                    <InfoIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={parameters.oscillation || false}
                    onChange={(e) => handleParameterChange('oscillation', e.target.checked)}
                    disabled={isRunning}
                  />
                }
                label="Reactivity Oscillation"
              />
              <Tooltip title="Enable to create an oscillating reactivity pattern">
                <IconButton size="small">
                  <InfoIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={showDelayedNeutrons}
                    onChange={(e) => setShowDelayedNeutrons(e.target.checked)}
                  />
                }
                label="Show Delayed Neutrons"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={logScale}
                    onChange={(e) => setLogScale(e.target.checked)}
                  />
                }
                label="Log Scale for Power"
              />
            </Grid>
          </Grid>
        </Box>
        
        {/* Simulation Controls */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Button
              variant="contained"
              color={isRunning ? "warning" : "success"}
              startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
              onClick={toggleSimulation}
              sx={{ mr: 1 }}
            >
              {isRunning ? "Pause" : currentTime > 0 ? "Resume" : "Start"}
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={resetSimulation}
              disabled={isRunning}
            >
              Reset
            </Button>
          </Box>
          
          <Box>
            <Button
              variant="outlined"
              startIcon={<SaveIcon />}
              onClick={saveChart}
              disabled={simulationData.time.length <= 1}
              sx={{ mr: 1 }}
            >
              Save Chart
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={exportData}
              disabled={simulationData.time.length <= 1}
            >
              Export Data
            </Button>
          </Box>
        </Box>
        
        {/* Simulation Progress */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" gutterBottom>
            Simulation Progress: {currentTime.toFixed(1)}s / {parameters.simulationTime}s
          </Typography>
          <Slider
            value={currentTime}
            max={parameters.simulationTime}
            step={0.1}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(1) + 's'}
            disabled={isRunning}
            onChange={(_, value) => {
              setCurrentTime(value);
              // Simulate up to this point
              resetSimulation();
              let time = 0;
              while (time < value) {
                time += 0.1;
                runSimulationStep(time);
              }
            }}
          />
        </Box>
        
        {/* Simulation Results */}
        <Box sx={{ height: 400 }}>
          <Line 
            data={chartData} 
            options={chartOptions}
            ref={chartRef}
          />
        </Box>
        
        {/* Key Insights */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Key Insights
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Prompt Critical vs. Delayed Critical
                </Typography>
                <Typography variant="body2">
                  When reactivity exceeds the delayed neutron fraction (β), the reactor becomes "prompt critical," 
                  leading to extremely rapid power increases. Below this threshold, reactor power changes more 
                  gradually, controlled by the delayed neutron precursors.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Reactivity Measurement
                </Typography>
                <Typography variant="body2">
                  Reactivity is often measured in units of "dollars," where 1 dollar equals the delayed neutron 
                  fraction (β). A reactivity of 1 dollar corresponds to exactly prompt critical, making it a 
                  critical safety threshold in reactor operation.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default ReactorKineticsSimulator;