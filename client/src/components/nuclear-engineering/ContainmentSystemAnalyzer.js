import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
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
  Slider,
  Alert,
  Tab,
  Tabs,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import TableViewIcon from '@mui/icons-material/TableView';
import ThermostatIcon from '@mui/icons-material/Thermostat';
import SpeedIcon from '@mui/icons-material/Speed';
import OpacityIcon from '@mui/icons-material/Opacity';
import WavesIcon from '@mui/icons-material/Waves';

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

// Initial containment parameters
const initialParameters = {
  // Containment geometry
  containmentVolume: 60000, // m³ (typical PWR dry containment)
  containmentDesignPressure: 0.5, // MPa
  containmentWallThickness: 1.2, // m
  containmentWallThermalConductivity: 1.5, // W/(m·K)
  containmentFreeSurface: 10000, // m² (heat transfer surface)
  
  // Initial conditions
  initialPressure: 0.101, // MPa (atmospheric)
  initialTemperature: 40, // °C (operational temperature)
  initialHumidity: 30, // %
  
  // Accident scenario
  accidentType: 'loca', // Loss of Coolant Accident
  breakSize: 0.1, // m² (break area)
  breakLocation: 'cold-leg', // Break location
  breakFlow: 2000, // kg/s initial mass flow
  breakEnthalpy: 1200, // kJ/kg
  breakDuration: 300, // seconds before isolation
  
  // Safety systems
  sprayCoolingAvailable: true,
  sprayFlowRate: 400, // kg/s
  sprayTemperature: 30, // °C
  sprayStartTime: 60, // seconds
  
  fanCoolersAvailable: true,
  fanCoolerCapacity: 15, // MW
  fanCoolerStartTime: 30, // seconds
  
  // Simulation parameters
  simulationTime: 3600, // seconds (1 hour)
  timeStep: 5, // seconds
};

// Accident scenario presets
const accidentPresets = [
  {
    id: 'small-loca',
    name: 'Small-Break LOCA',
    description: 'Small-break loss of coolant accident with 0.05 m² break in cold leg piping',
    parameters: {
      ...initialParameters,
      accidentType: 'loca',
      breakSize: 0.05,
      breakLocation: 'cold-leg',
      breakFlow: 1000,
      breakDuration: 600,
    },
  },
  {
    id: 'large-loca',
    name: 'Large-Break LOCA',
    description: 'Large-break loss of coolant accident with 0.3 m² break in cold leg piping',
    parameters: {
      ...initialParameters,
      accidentType: 'loca',
      breakSize: 0.3,
      breakLocation: 'cold-leg',
      breakFlow: 5000,
      breakDuration: 200,
    },
  },
  {
    id: 'steam-line-break',
    name: 'Main Steam Line Break',
    description: 'Break in main steam line releasing high-energy steam into containment',
    parameters: {
      ...initialParameters,
      accidentType: 'mslb',
      breakSize: 0.2,
      breakLocation: 'steam-line',
      breakFlow: 3000,
      breakEnthalpy: 2800,
      breakDuration: 180,
    },
  },
  {
    id: 'safety-system-failure',
    name: 'LOCA with Safety System Failure',
    description: 'Medium-break LOCA with spray cooling system unavailable',
    parameters: {
      ...initialParameters,
      accidentType: 'loca',
      breakSize: 0.15,
      breakLocation: 'hot-leg',
      breakFlow: 2500,
      breakDuration: 300,
      sprayCoolingAvailable: false,
    },
  },
];

// Tabs for the analyzer
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`analyzer-tabpanel-${index}`}
      aria-labelledby={`analyzer-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ pt: 2 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `analyzer-tab-${index}`,
    'aria-controls': `analyzer-tabpanel-${index}`,
  };
}

function ContainmentSystemAnalyzer() {
  // State for containment parameters
  const [parameters, setParameters] = useState(initialParameters);
  
  // State for simulation data
  const [simulationData, setSimulationData] = useState({
    time: [0],
    pressure: [initialParameters.initialPressure],
    temperature: [initialParameters.initialTemperature],
    humidity: [initialParameters.initialHumidity],
    energyRelease: [0],
    sprayCooling: [0],
    fanCooling: [0],
    wallHeatTransfer: [0],
  });
  
  // State for simulation control
  const [isRunning, setIsRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [showDataTable, setShowDataTable] = useState(false);
  
  // Animation frame reference
  const animationRef = useRef(null);
  
  // Chart reference
  const chartRef = useRef(null);

  // Function to calculate mass/energy release at a given time
  const calculateMassEnergyRelease = (time) => {
    if (time > parameters.breakDuration) {
      return 0; // Break isolated
    }
    
    // Simple model with linear decay of break flow
    const flowFraction = 1 - (time / parameters.breakDuration);
    const currentFlow = parameters.breakFlow * Math.max(0.1, flowFraction);
    
    // Energy release rate in MW
    const energyReleaseRate = currentFlow * parameters.breakEnthalpy / 1000;
    return energyReleaseRate;
  };

  // Function to calculate spray cooling effect
  const calculateSprayCooling = (time, currentTemperature) => {
    if (!parameters.sprayCoolingAvailable || time < parameters.sprayStartTime) {
      return 0;
    }
    
    // Simple model for spray cooling power based on temperature difference
    const deltaT = currentTemperature - parameters.sprayTemperature;
    const specificHeat = 4.18; // kJ/(kg·K)
    const coolingPower = parameters.sprayFlowRate * specificHeat * deltaT / 1000; // MW
    
    return Math.max(0, coolingPower);
  };

  // Function to calculate fan cooler effect
  const calculateFanCooling = (time, currentTemperature) => {
    if (!parameters.fanCoolersAvailable || time < parameters.fanCoolerStartTime) {
      return 0;
    }
    
    // Simple model with temperature dependence (more effective at higher temperatures)
    const baseCapacity = parameters.fanCoolerCapacity;
    const tempFactor = (currentTemperature - 30) / 100; // Normalized factor
    const adjustedCapacity = baseCapacity * (1 + Math.max(0, tempFactor));
    
    return Math.min(adjustedCapacity, baseCapacity * 1.5); // Cap at 150% of rated capacity
  };

  // Function to calculate wall heat transfer
  const calculateWallHeatTransfer = (currentTemperature) => {
    // Simple conduction model
    const outsideTemperature = 20; // °C
    const deltaT = currentTemperature - outsideTemperature;
    const heatTransferCoeff = parameters.containmentWallThermalConductivity / parameters.containmentWallThickness;
    const heatTransfer = heatTransferCoeff * parameters.containmentFreeSurface * deltaT / 1000; // MW
    
    return Math.max(0, heatTransfer);
  };

  // Function to calculate a simulation step
  const calculateSimulationStep = (time, prevTime, prevPressure, prevTemperature, prevHumidity) => {
    // Time step
    const dt = time - prevTime;
    
    // Energy balance calculations
    const energyRelease = calculateMassEnergyRelease(time) * dt;
    const sprayCooling = calculateSprayCooling(time, prevTemperature) * dt;
    const fanCooling = calculateFanCooling(time, prevTemperature) * dt;
    const wallHeatTransfer = calculateWallHeatTransfer(prevTemperature) * dt;
    
    // Net energy added to containment
    const netEnergy = energyRelease - sprayCooling - fanCooling - wallHeatTransfer;
    
    // Calculate new temperature using simple energy balance
    // Assuming constant volume specific heat capacity
    const airMass = 1.2 * parameters.containmentVolume; // kg, assuming density of 1.2 kg/m³
    const specificHeat = 1.005; // kJ/(kg·K)
    const temperatureChange = netEnergy * 1000 / (airMass * specificHeat); // K or °C
    const newTemperature = prevTemperature + temperatureChange;
    
    // Calculate new pressure using ideal gas law with temperature change
    const temperatureRatio = (newTemperature + 273.15) / (prevTemperature + 273.15);
    const newPressure = prevPressure * temperatureRatio;
    
    // Calculate new humidity with simple model
    // Moisture input from break (simplified)
    const moistureAddition = (parameters.accidentType === 'loca' || parameters.accidentType === 'mslb') ? 2 : 0;
    const newHumidity = Math.min(100, prevHumidity + moistureAddition * dt / 60);
    
    return {
      pressure: newPressure,
      temperature: newTemperature,
      humidity: newHumidity,
      energyRelease: energyRelease / dt, // MW
      sprayCooling: sprayCooling / dt, // MW
      fanCooling: fanCooling / dt, // MW
      wallHeatTransfer: wallHeatTransfer / dt, // MW
    };
  };

  // Function to reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setCurrentTime(0);
    setSimulationData({
      time: [0],
      pressure: [parameters.initialPressure],
      temperature: [parameters.initialTemperature],
      humidity: [parameters.initialHumidity],
      energyRelease: [0],
      sprayCooling: [0],
      fanCooling: [0],
      wallHeatTransfer: [0],
    });
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  // Function to run a simulation step
  const runSimulationStep = (time) => {
    // Get previous values
    const prevTime = simulationData.time.length > 0 ? simulationData.time[simulationData.time.length - 1] : 0;
    const prevPressure = simulationData.pressure.length > 0 ? simulationData.pressure[simulationData.pressure.length - 1] : parameters.initialPressure;
    const prevTemperature = simulationData.temperature.length > 0 ? simulationData.temperature[simulationData.temperature.length - 1] : parameters.initialTemperature;
    const prevHumidity = simulationData.humidity.length > 0 ? simulationData.humidity[simulationData.humidity.length - 1] : parameters.initialHumidity;
    
    const result = calculateSimulationStep(time, prevTime, prevPressure, prevTemperature, prevHumidity);
    
    // Update simulation data
    setSimulationData(prev => ({
      time: [...prev.time, time],
      pressure: [...prev.pressure, result.pressure],
      temperature: [...prev.temperature, result.temperature],
      humidity: [...prev.humidity, result.humidity],
      energyRelease: [...prev.energyRelease, result.energyRelease],
      sprayCooling: [...prev.sprayCooling, result.sprayCooling],
      fanCooling: [...prev.fanCooling, result.fanCooling],
      wallHeatTransfer: [...prev.wallHeatTransfer, result.wallHeatTransfer],
    }));
  };
  
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
      const preset = accidentPresets.find(p => p.id === presetId);
      if (preset) {
        setParameters(preset.parameters);
      }
    }
  };
  
  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Effect to clear simulation when parameters change
  useEffect(() => {
    resetSimulation();
  }, [parameters]);
  
  // Effect to handle animation
  useEffect(() => {
    if (isRunning) {
      let lastTimestamp = performance.now();
      
      const animate = (timestamp) => {
        const elapsed = timestamp - lastTimestamp;
        
        if (elapsed > 100) { // Update every 100ms
          lastTimestamp = timestamp;
          
          setCurrentTime(prevTime => {
            const newTime = prevTime + parameters.timeStep;
            
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
  }, [isRunning, parameters.simulationTime, parameters.timeStep]);
  
  // Function to export data
  const exportData = () => {
    const csvContent = [
      'Time (s),Pressure (MPa),Temperature (°C),Humidity (%),Energy Release (MW),Spray Cooling (MW),Fan Cooling (MW),Wall Heat Transfer (MW)',
      ...simulationData.time.map((time, index) => 
        time + ',' + 
        simulationData.pressure[index].toFixed(4) + ',' + 
        simulationData.temperature[index].toFixed(2) + ',' + 
        simulationData.humidity[index].toFixed(2) + ',' + 
        simulationData.energyRelease[index].toFixed(2) + ',' + 
        simulationData.sprayCooling[index].toFixed(2) + ',' + 
        simulationData.fanCooling[index].toFixed(2) + ',' + 
        simulationData.wallHeatTransfer[index].toFixed(2)
      ),
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'containment_analysis_data.csv');
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
      link.setAttribute('download', 'containment_analysis_chart.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  
  // Check if pressure exceeds design pressure
  const maxPressure = Math.max(...simulationData.pressure);
  const pressureExceeded = maxPressure > parameters.containmentDesignPressure;
  
  // Prepare chart data for different tabs
  const pressureTempChartData = {
    labels: simulationData.time,
    datasets: [
      {
        label: 'Pressure (MPa)',
        data: simulationData.pressure,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        yAxisID: 'y',
      },
      {
        label: 'Temperature (°C)',
        data: simulationData.temperature,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        yAxisID: 'y1',
      },
      {
        label: 'Design Pressure',
        data: simulationData.time.map(() => parameters.containmentDesignPressure),
        borderColor: 'rgba(255, 0, 0, 0.5)',
        borderDash: [5, 5],
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
        yAxisID: 'y',
      },
    ],
  };
  
  const humidityChartData = {
    labels: simulationData.time,
    datasets: [
      {
        label: 'Humidity (%)',
        data: simulationData.humidity,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };
  
  const energyBalanceChartData = {
    labels: simulationData.time,
    datasets: [
      {
        label: 'Energy Release (MW)',
        data: simulationData.energyRelease,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Spray Cooling (MW)',
        data: simulationData.sprayCooling,
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Fan Cooling (MW)',
        data: simulationData.fanCooling,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Wall Heat Transfer (MW)',
        data: simulationData.wallHeatTransfer,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };
  
  // Chart options
  const pressureTempChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    plugins: {
      title: {
        display: true,
        text: 'Containment Pressure and Temperature',
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
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Pressure (MPa)',
        },
        suggestedMin: 0,
        suggestedMax: Math.max(parameters.containmentDesignPressure * 1.2, maxPressure * 1.1),
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
          text: 'Temperature (°C)',
        },
        suggestedMin: 0,
        suggestedMax: Math.max(150, Math.max(...simulationData.temperature) * 1.1),
      },
    },
  };
  
  const humidityChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Containment Humidity',
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
        title: {
          display: true,
          text: 'Humidity (%)',
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
  };
  
  const energyBalanceChartOptions = {
    responsive: true,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    plugins: {
      title: {
        display: true,
        text: 'Energy Balance',
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
        title: {
          display: true,
          text: 'Power (MW)',
        },
        suggestedMin: 0,
      },
    },
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Containment System Analyzer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          This educational tool simulates the response of a nuclear reactor containment building during accident scenarios.
          Analyze pressure, temperature, and humidity transients and evaluate the effectiveness of safety systems.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Accident Presets */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="preset-select-label">Accident Scenario</InputLabel>
              <Select
                labelId="preset-select-label"
                id="preset-select"
                value={selectedPreset}
                label="Accident Scenario"
                onChange={handlePresetChange}
              >
                <MenuItem value=""><em>Custom Scenario</em></MenuItem>
                {accidentPresets.map(preset => (
                  <MenuItem key={preset.id} value={preset.id}>{preset.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {selectedPreset && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {accidentPresets.find(p => p.id === selectedPreset)?.description}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        {/* Parameter Controls */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Scenario Parameters
          </Typography>
          
          <Grid container spacing={3}>
            {/* Accident Parameters */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth size="small">
                <InputLabel>Accident Type</InputLabel>
                <Select
                  value={parameters.accidentType}
                  label="Accident Type"
                  onChange={(e) => handleParameterChange('accidentType', e.target.value)}
                  disabled={isRunning}
                >
                  <MenuItem value="loca">Loss of Coolant Accident (LOCA)</MenuItem>
                  <MenuItem value="mslb">Main Steam Line Break (MSLB)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={1}>
                <Typography variant="body2">
                  Break Size (m²):
                </Typography>
                <Slider
                  value={parameters.breakSize}
                  min={0.01}
                  max={0.5}
                  step={0.01}
                  onChange={(_, value) => handleParameterChange('breakSize', value)}
                  valueLabelDisplay="auto"
                  disabled={isRunning}
                />
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Initial Mass Flow (kg/s):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.breakFlow}
                  onChange={(e) => handleParameterChange('breakFlow', Number(e.target.value))}
                  inputProps={{
                    min: 100,
                    max: 10000,
                    step: 100,
                  }}
                  disabled={isRunning}
                />
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Break Duration (s):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.breakDuration}
                  onChange={(e) => handleParameterChange('breakDuration', Number(e.target.value))}
                  inputProps={{
                    min: 10,
                    max: 3600,
                    step: 10,
                  }}
                  disabled={isRunning}
                />
              </Stack>
            </Grid>
            
            {/* Safety Systems */}
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={parameters.sprayCoolingAvailable}
                    onChange={(e) => handleParameterChange('sprayCoolingAvailable', e.target.checked)}
                    disabled={isRunning}
                  />
                }
                label="Spray Cooling Available"
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControlLabel
                control={
                  <Switch
                    checked={parameters.fanCoolersAvailable}
                    onChange={(e) => handleParameterChange('fanCoolersAvailable', e.target.checked)}
                    disabled={isRunning}
                  />
                }
                label="Fan Coolers Available"
              />
            </Grid>
            
            {parameters.sprayCoolingAvailable && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="body2" sx={{ minWidth: 180 }}>
                      Spray Start Time (s):
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={parameters.sprayStartTime}
                      onChange={(e) => handleParameterChange('sprayStartTime', Number(e.target.value))}
                      inputProps={{
                        min: 0,
                        max: 3600,
                        step: 10,
                      }}
                      disabled={isRunning}
                    />
                  </Stack>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="body2" sx={{ minWidth: 180 }}>
                      Spray Flow Rate (kg/s):
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={parameters.sprayFlowRate}
                      onChange={(e) => handleParameterChange('sprayFlowRate', Number(e.target.value))}
                      inputProps={{
                        min: 50,
                        max: 1000,
                        step: 50,
                      }}
                      disabled={isRunning}
                    />
                  </Stack>
                </Grid>
              </>
            )}
            
            {parameters.fanCoolersAvailable && (
              <>
                <Grid item xs={12} sm={6} md={4}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="body2" sx={{ minWidth: 180 }}>
                      Fan Cooler Start Time (s):
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={parameters.fanCoolerStartTime}
                      onChange={(e) => handleParameterChange('fanCoolerStartTime', Number(e.target.value))}
                      inputProps={{
                        min: 0,
                        max: 3600,
                        step: 10,
                      }}
                      disabled={isRunning}
                    />
                  </Stack>
                </Grid>
                
                <Grid item xs={12} sm={6} md={4}>
                  <Stack spacing={2} direction="row" alignItems="center">
                    <Typography variant="body2" sx={{ minWidth: 180 }}>
                      Fan Cooler Capacity (MW):
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      value={parameters.fanCoolerCapacity}
                      onChange={(e) => handleParameterChange('fanCoolerCapacity', Number(e.target.value))}
                      inputProps={{
                        min: 1,
                        max: 50,
                        step: 1,
                      }}
                      disabled={isRunning}
                    />
                  </Stack>
                </Grid>
              </>
            )}
            
            {/* Simulation Parameters */}
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Simulation Time (s):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.simulationTime}
                  onChange={(e) => handleParameterChange('simulationTime', Number(e.target.value))}
                  inputProps={{
                    min: 600,
                    max: 36000,
                    step: 600,
                  }}
                  disabled={isRunning}
                />
              </Stack>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Stack spacing={2} direction="row" alignItems="center">
                <Typography variant="body2" sx={{ minWidth: 180 }}>
                  Time Step (s):
                </Typography>
                <TextField
                  type="number"
                  size="small"
                  value={parameters.timeStep}
                  onChange={(e) => handleParameterChange('timeStep', Number(e.target.value))}
                  inputProps={{
                    min: 1,
                    max: 60,
                    step: 1,
                  }}
                  disabled={isRunning}
                />
              </Stack>
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
              sx={{ mr: 1 }}
            >
              Reset
            </Button>
            
            <Button
              variant="outlined"
              startIcon={<TableViewIcon />}
              onClick={() => setShowDataTable(!showDataTable)}
              disabled={simulationData.time.length <= 1}
            >
              {showDataTable ? "Hide Data" : "Show Data"}
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
            Simulation Progress: {(currentTime).toFixed(0)}s / {parameters.simulationTime}s
          </Typography>
          <Slider
            value={currentTime}
            max={parameters.simulationTime}
            step={parameters.timeStep}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => value.toFixed(0) + 's'}
            disabled={isRunning}
            onChange={(_, value) => {
              // This functionality would require rerunning the entire simulation
              // up to this point - simplified here
              setCurrentTime(value);
            }}
          />
        </Box>
        
        {/* Pressure exceeded warning */}
        {pressureExceeded && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Warning: Containment pressure exceeded design pressure of {parameters.containmentDesignPressure.toFixed(3)} MPa
            at {simulationData.time[simulationData.pressure.findIndex(p => p > parameters.containmentDesignPressure)].toFixed(0)} seconds.
          </Alert>
        )}
        
        {/* Simulation Results Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="containment analysis tabs">
            <Tab icon={<SpeedIcon />} iconPosition="start" label="Pressure & Temperature" {...a11yProps(0)} />
            <Tab icon={<OpacityIcon />} iconPosition="start" label="Humidity" {...a11yProps(1)} />
            <Tab icon={<WavesIcon />} iconPosition="start" label="Energy Balance" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        <TabPanel value={activeTab} index={0}>
          <Box sx={{ height: 400 }}>
            <Line 
              data={pressureTempChartData} 
              options={pressureTempChartOptions}
              ref={chartRef}
            />
          </Box>
        </TabPanel>
        
        <TabPanel value={activeTab} index={1}>
          <Box sx={{ height: 400 }}>
            <Line 
              data={humidityChartData} 
              options={humidityChartOptions}
            />
          </Box>
        </TabPanel>
        
        <TabPanel value={activeTab} index={2}>
          <Box sx={{ height: 400 }}>
            <Line 
              data={energyBalanceChartData} 
              options={energyBalanceChartOptions}
            />
          </Box>
        </TabPanel>
        
        {/* Data Table (conditionally shown) */}
        {showDataTable && simulationData.time.length > 1 && (
          <Box sx={{ mt: 4, overflow: 'auto', maxHeight: 300 }}>
            <Typography variant="h6" gutterBottom>
              Simulation Data
            </Typography>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', textAlign: 'left' }}>
                  <th style={{ padding: '8px' }}>Time (s)</th>
                  <th style={{ padding: '8px' }}>Pressure (MPa)</th>
                  <th style={{ padding: '8px' }}>Temperature (°C)</th>
                  <th style={{ padding: '8px' }}>Humidity (%)</th>
                  <th style={{ padding: '8px' }}>Energy Release (MW)</th>
                  <th style={{ padding: '8px' }}>Spray Cooling (MW)</th>
                  <th style={{ padding: '8px' }}>Fan Cooling (MW)</th>
                  <th style={{ padding: '8px' }}>Wall Heat Transfer (MW)</th>
                </tr>
              </thead>
              <tbody>
                {/* Show only every 10th point to avoid overwhelming table */}
                {simulationData.time.filter((_, i) => i % 10 === 0 || i === simulationData.time.length - 1).map((time, i) => {
                  const index = i * 10 >= simulationData.time.length ? simulationData.time.length - 1 : i * 10;
                  return (
                    <tr key={i} style={{ borderBottom: '1px solid #ddd' }}>
                      <td style={{ padding: '8px' }}>{simulationData.time[index].toFixed(0)}</td>
                      <td style={{ padding: '8px' }}>{simulationData.pressure[index].toFixed(4)}</td>
                      <td style={{ padding: '8px' }}>{simulationData.temperature[index].toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{simulationData.humidity[index].toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{simulationData.energyRelease[index].toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{simulationData.sprayCooling[index].toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{simulationData.fanCooling[index].toFixed(2)}</td>
                      <td style={{ padding: '8px' }}>{simulationData.wallHeatTransfer[index].toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </Box>
        )}
        
        {/* Key Insights */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Key Insights
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Containment Safety Functions
                </Typography>
                <Typography variant="body2">
                  Nuclear containment buildings are designed to withstand high pressure and temperature during accidents.
                  The design basis typically includes worst-case scenarios like large-break LOCAs where significant 
                  energy and mass are released into the containment atmosphere.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={1} sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Safety Systems Effectiveness
                </Typography>
                <Typography variant="body2">
                  Containment spray systems and fan coolers are engineered safety features that help control pressure 
                  and temperature. They work by condensing steam and removing heat, preventing containment pressure from 
                  exceeding design limits during accident conditions.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
}

export default ContainmentSystemAnalyzer;