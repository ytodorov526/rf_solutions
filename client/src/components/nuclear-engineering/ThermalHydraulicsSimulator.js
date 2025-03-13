import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Slider, 
  TextField, 
  Button, 
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Alert,
  Divider,
  Card,
  CardContent,
  Collapse
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DownloadIcon from '@mui/icons-material/Download';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(...registerables);

// Constants and models
const COOLANT_TYPES = {
  water: {
    name: 'Water',
    density: 1000, // kg/m³
    specificHeat: 4186, // J/(kg·K)
    thermalConductivity: 0.6, // W/(m·K)
    viscosity: 0.001, // Pa·s at 20°C
    boilingPoint: 373.15, // K (100°C)
    pressureCoefficient: 0.0025 // MPa/K - simplified pressure increase per K increase
  },
  heavyWater: {
    name: 'Heavy Water (D₂O)',
    density: 1100, // kg/m³
    specificHeat: 4200, // J/(kg·K)
    thermalConductivity: 0.59, // W/(m·K)
    viscosity: 0.00125, // Pa·s at 20°C
    boilingPoint: 374.55, // K (101.4°C)
    pressureCoefficient: 0.0026 // MPa/K
  },
  sodium: {
    name: 'Liquid Sodium',
    density: 927, // kg/m³
    specificHeat: 1230, // J/(kg·K)
    thermalConductivity: 72.3, // W/(m·K)
    viscosity: 0.00068, // Pa·s at 400°C
    boilingPoint: 1156, // K (883°C)
    pressureCoefficient: 0.00038 // MPa/K
  },
  lead: {
    name: 'Liquid Lead',
    density: 10500, // kg/m³
    specificHeat: 145, // J/(kg·K)
    thermalConductivity: 16, // W/(m·K)
    viscosity: 0.0045, // Pa·s at operating temperature
    boilingPoint: 2022, // K (1749°C)
    pressureCoefficient: 0.00011 // MPa/K
  },
  helium: {
    name: 'Helium Gas',
    density: 4.9, // kg/m³ at 4 MPa, 350°C
    specificHeat: 5193, // J/(kg·K)
    thermalConductivity: 0.36, // W/(m·K)
    viscosity: 0.000041, // Pa·s at operating temperature
    boilingPoint: 4.22, // K (-269°C)
    pressureCoefficient: 0.0135 // MPa/K - gases have higher pressure coefficients
  }
};

// Reactor type presets
const REACTOR_PRESETS = {
  pwr: {
    name: 'Pressurized Water Reactor',
    power: 3500, // MWth
    coolant: 'water',
    coolantFlowRate: 18000, // kg/s
    coreInletTemp: 290, // K (adjusted to match 290°C + 273.15 = 563.15 K)
    systemPressure: 15.5, // MPa
    fuelRods: 50952, // Total number of fuel rods
    coreHeight: 3.66, // m
    coreDiameter: 3.4, // m
    channelDiameter: 0.01, // m
    activeFuelLength: 3.66, // m
    bypassFlow: 5 // %
  },
  bwr: {
    name: 'Boiling Water Reactor',
    power: 3900, // MWth
    coolant: 'water',
    coolantFlowRate: 14000, // kg/s
    coreInletTemp: 273 + 215, // K
    systemPressure: 7.1, // MPa
    fuelRods: 46000,
    coreHeight: 3.7, // m
    coreDiameter: 4.8, // m
    channelDiameter: 0.012, // m
    activeFuelLength: 3.7, // m
    bypassFlow: 12 // %
  },
  phwr: {
    name: 'Pressurized Heavy Water Reactor (CANDU)',
    power: 2800, // MWth
    coolant: 'heavyWater',
    coolantFlowRate: 8800, // kg/s
    coreInletTemp: 273 + 266, // K
    systemPressure: 10.0, // MPa
    fuelRods: 4560, // Based on CANDU design
    coreHeight: 5.94, // m
    coreDiameter: 7.06, // m
    channelDiameter: 0.103, // m
    activeFuelLength: 5.94, // m
    bypassFlow: 4 // %
  },
  sfr: {
    name: 'Sodium-cooled Fast Reactor',
    power: 1500, // MWth
    coolant: 'sodium',
    coolantFlowRate: 8000, // kg/s
    coreInletTemp: 273 + 390, // K
    systemPressure: 0.1, // MPa (near atmospheric)
    fuelRods: 30000,
    coreHeight: 1.0, // m
    coreDiameter: 1.9, // m
    channelDiameter: 0.008, // m
    activeFuelLength: 1.0, // m
    bypassFlow: 2 // %
  },
  lfr: {
    name: 'Lead-cooled Fast Reactor',
    power: 1200, // MWth
    coolant: 'lead',
    coolantFlowRate: 25000, // kg/s
    coreInletTemp: 273 + 420, // K
    systemPressure: 0.1, // MPa (near atmospheric)
    fuelRods: 25000,
    coreHeight: 1.2, // m
    coreDiameter: 2.0, // m
    channelDiameter: 0.01, // m
    activeFuelLength: 1.2, // m
    bypassFlow: 3 // %
  },
  gfr: {
    name: 'Gas-cooled Fast Reactor',
    power: 600, // MWth
    coolant: 'helium',
    coolantFlowRate: 320, // kg/s
    coreInletTemp: 273 + 450, // K
    systemPressure: 10.0, // MPa
    fuelRods: 33000,
    coreHeight: 1.55, // m
    coreDiameter: 1.95, // m
    channelDiameter: 0.007, // m
    activeFuelLength: 1.55, // m
    bypassFlow: 10 // %
  }
};

// Tab panel component for tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`thermal-tabpanel-${index}`}
      aria-labelledby={`thermal-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ThermalHydraulicsSimulator = () => {
  // UI state
  const [showSimulator, setShowSimulator] = useState(false);
  
  // State variables
  const [reactorType, setReactorType] = useState('');
  const [coolantType, setCoolantType] = useState('water');
  const [power, setPower] = useState(3000); // MWth
  const [coolantFlowRate, setCoolantFlowRate] = useState(15000); // kg/s
  const [coreInletTemp, setCoreInletTemp] = useState(563.15); // K
  const [systemPressure, setSystemPressure] = useState(15.5); // MPa
  const [fuelRods, setFuelRods] = useState(50000);
  const [coreHeight, setCoreHeight] = useState(3.66); // m
  const [coreDiameter, setCoreDiameter] = useState(3.4); // m
  const [channelDiameter, setChannelDiameter] = useState(0.01); // m
  const [activeFuelLength, setActiveFuelLength] = useState(3.66); // m
  const [bypassFlow, setBypassFlow] = useState(5); // %
  
  const [isSimulationRunning, setIsSimulationRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [tabValue, setTabValue] = useState(0);
  
  // Results state
  const [coreOutletTemp, setCoreOutletTemp] = useState(0);
  const [temperatureRise, setTemperatureRise] = useState(0);
  const [maxFuelTemp, setMaxFuelTemp] = useState(0);
  const [dryoutMargin, setDryoutMargin] = useState(0);
  const [pressureDrop, setPressureDrop] = useState(0);
  const [flowVelocity, setFlowVelocity] = useState(0);
  const [reynoldsNumber, setReynoldsNumber] = useState(0);
  const [heatFlux, setHeatFlux] = useState(0);
  const [voidFraction, setVoidFraction] = useState(0);
  const [safetyStatus, setSafetyStatus] = useState('normal');
  const [warningMessage, setWarningMessage] = useState('');
  
  // Chart data
  const [axialTempProfile, setAxialTempProfile] = useState(null);
  const [timeSeriesData, setTimeSeriesData] = useState(null);
  
  // For simulation
  const animationFrameRef = useRef(null);
  const chartRef = useRef(null);
  const timeSeriesRef = useRef(null);
  const lastTimestampRef = useRef(0);
  const timeHistoryRef = useRef([]);
  const tempHistoryRef = useRef([]);
  
  // Apply reactor preset
  const applyReactorPreset = (presetKey) => {
    if (REACTOR_PRESETS[presetKey]) {
      const preset = REACTOR_PRESETS[presetKey];
      setReactorType(presetKey);
      setCoolantType(preset.coolant);
      setPower(preset.power);
      setCoolantFlowRate(preset.coolantFlowRate);
      setCoreInletTemp(preset.coreInletTemp);
      setSystemPressure(preset.systemPressure);
      setFuelRods(preset.fuelRods);
      setCoreHeight(preset.coreHeight);
      setCoreDiameter(preset.coreDiameter);
      setChannelDiameter(preset.channelDiameter);
      setActiveFuelLength(preset.activeFuelLength);
      setBypassFlow(preset.bypassFlow);
    }
  };
  
  // Calculate thermal-hydraulic parameters
  const calculateThermalHydraulics = () => {
    // Get coolant properties
    const coolant = COOLANT_TYPES[coolantType];
    if (!coolant) return;
    
    // Convert power from MW to W
    const powerWatts = power * 1e6;
    
    // Effective coolant flow considering bypass
    const effectiveFlow = coolantFlowRate * (1 - bypassFlow / 100);
    
    // Calculate core cross-sectional area
    const coreArea = Math.PI * Math.pow(coreDiameter / 2, 2);
    
    // Calculate coolant channel flow area (total)
    const channelArea = Math.PI * Math.pow(channelDiameter / 2, 2) * fuelRods;
    
    // Calculate temperature rise using Q = m·cp·ΔT
    const deltaT = powerWatts / (effectiveFlow * coolant.specificHeat);
    setTemperatureRise(deltaT);
    setCoreOutletTemp(coreInletTemp + deltaT);
    
    // Calculate flow velocity in channels
    const velocity = effectiveFlow / (channelArea * coolant.density);
    setFlowVelocity(velocity);
    
    // Calculate Reynolds number
    const reynolds = coolant.density * velocity * channelDiameter / coolant.viscosity;
    setReynoldsNumber(reynolds);
    
    // Calculate average heat flux
    const totalHeatTransferArea = Math.PI * channelDiameter * activeFuelLength * fuelRods;
    const avgHeatFlux = powerWatts / totalHeatTransferArea;
    setHeatFlux(avgHeatFlux);
    
    // Calculate pressure drop (simplified Darcy-Weisbach)
    const frictionFactor = reynolds > 2300 ? 0.316 * Math.pow(reynolds, -0.25) : 64 / reynolds;
    const pressureLoss = frictionFactor * (activeFuelLength / channelDiameter) * 
                         0.5 * coolant.density * Math.pow(velocity, 2) / 1e6; // Convert to MPa
    setPressureDrop(pressureLoss);
    
    // Estimate max fuel temperature (very simplified model)
    // Assuming a typical temperature difference between fuel centerline and coolant
    const fuelConductivity = 3.6; // W/(m·K) for UO2 (simplified)
    const fuelPelletRadius = 0.004; // m (typical)
    const fuelCenterlineToSurfaceDelta = (powerWatts / fuelRods) / 
                                        (2 * Math.PI * activeFuelLength * fuelConductivity) * 
                                        Math.log(fuelPelletRadius / (fuelPelletRadius / 2));
    
    // Simplified gap and cladding temperature difference
    const cladToSurfaceDelta = avgHeatFlux * 0.0001; // Simple approximation
    
    // Estimate fuel centerline temperature
    const avgCoolantTemp = coreInletTemp + deltaT / 2;
    const fuelTemp = avgCoolantTemp + fuelCenterlineToSurfaceDelta + cladToSurfaceDelta;
    setMaxFuelTemp(fuelTemp);
    
    // Calculate margin to dryout/burnout (simplified)
    // Critical heat flux based on Zuber correlation (very simplified for this demo)
    let criticalHeatFlux;
    if (coolantType === 'water' || coolantType === 'heavyWater') {
      // For water or heavy water cooled systems
      const latentHeat = 2257000; // J/kg for water
      criticalHeatFlux = 0.131 * latentHeat * Math.pow(coolant.density * 9.81 * 0.06, 0.25) * 
                         Math.pow(coolant.density / 1.6, 0.5); // Simplified Zuber
    } else {
      // For liquid metals, high heat capacity, simplified
      criticalHeatFlux = 5000000; // W/m² - much higher for liquid metals
    }
    
    const dryoutRatio = criticalHeatFlux / avgHeatFlux;
    setDryoutMargin(dryoutRatio);
    
    // Calculate void fraction (only relevant for water at high temperature/low pressure)
    let voidFrac = 0;
    if ((coolantType === 'water' || coolantType === 'heavyWater') && 
        coreOutletTemp > coolant.boilingPoint * (1 + systemPressure * 0.01)) {
      // Very simplified approximation of void fraction
      const saturationTemp = coolant.boilingPoint * (1 + systemPressure * 0.01);
      voidFrac = Math.max(0, Math.min(0.7, (coreOutletTemp - saturationTemp) / 50));
    }
    setVoidFraction(voidFrac);
    
    // Determine safety status based on various parameters
    let status = 'normal';
    let message = '';
    
    if (dryoutRatio < 1.3) {
      status = 'critical';
      message = 'WARNING: Critical heat flux margin too low! Risk of fuel damage.';
    } else if (dryoutRatio < 1.8) {
      status = 'warning';
      message = 'Caution: Heat flux approaching critical limits.';
    }
    
    if (fuelTemp > 2500) {
      status = 'critical';
      message = 'WARNING: Fuel temperature exceeding design limits! Risk of meltdown.';
    } else if (fuelTemp > 1800) {
      status = 'warning';
      message = 'Caution: Elevated fuel temperatures detected.';
    }
    
    if (coreOutletTemp > coolant.boilingPoint && systemPressure < 2) {
      status = 'critical';
      message = 'WARNING: Coolant boiling at low pressure! Risk of vapor binding.';
    }
    
    if (voidFrac > 0.5) {
      status = 'warning';
      message = 'Significant void fraction detected in coolant channels.';
    }
    
    setSafetyStatus(status);
    setWarningMessage(message);
    
    // Update axial temperature profile chart
    updateAxialTemperatureProfile();
    
    // Update time series data if simulation is running
    if (isSimulationRunning) {
      updateTimeSeriesData();
    }
  };
  
  // Calculate axial temperature profile
  const updateAxialTemperatureProfile = () => {
    // Create points along the axial length (normalized from 0 to 1)
    const axialPoints = [];
    const coolantTempPoints = [];
    const fuelSurfaceTempPoints = [];
    const fuelCenterlineTempPoints = [];
    
    // Get coolant properties
    const coolant = COOLANT_TYPES[coolantType];
    
    // Number of points along the axis
    const numPoints = 50;
    
    // Power distribution - cosine shape for axial power profile (typical in reactors)
    const powerDistribution = [];
    for (let i = 0; i < numPoints; i++) {
      const normalizedPosition = i / (numPoints - 1);
      axialPoints.push(normalizedPosition);
      
      // Cosine power shape (simplified representation of typical flux profile)
      const axialPowerFactor = Math.cos(Math.PI * (normalizedPosition - 0.5));
      powerDistribution.push(1.25 * axialPowerFactor * axialPowerFactor);
    }
    
    // Calculate temperatures along the axis
    for (let i = 0; i < numPoints; i++) {
      const normalizedPosition = axialPoints[i];
      
      // Coolant temperature increases linearly with position (simplified)
      const localCoolantTemp = coreInletTemp + temperatureRise * normalizedPosition;
      coolantTempPoints.push(localCoolantTemp);
      
      // Local heat flux affected by axial power distribution
      const localHeatFlux = heatFlux * powerDistribution[i];
      
      // Simplified fuel surface temperature
      const localFuelSurfaceTemp = localCoolantTemp + localHeatFlux * 0.0001;
      fuelSurfaceTempPoints.push(localFuelSurfaceTemp);
      
      // Simplified fuel centerline temperature
      const localFuelCenterlineTemp = localFuelSurfaceTemp + 
                                     (localHeatFlux * 0.004) / (2 * 3.6) * 
                                     (1 + powerDistribution[i]);
      fuelCenterlineTempPoints.push(localFuelCenterlineTemp);
    }
    
    // Update chart data
    setAxialTempProfile({
      labels: axialPoints.map(p => (p * activeFuelLength).toFixed(2)),
      datasets: [
        {
          label: 'Coolant Temperature (K)',
          data: coolantTempPoints,
          borderColor: 'rgba(0, 123, 255, 1)',
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          tension: 0.4
        },
        {
          label: 'Fuel Surface Temperature (K)',
          data: fuelSurfaceTempPoints,
          borderColor: 'rgba(255, 193, 7, 1)',
          backgroundColor: 'rgba(255, 193, 7, 0.1)',
          tension: 0.4
        },
        {
          label: 'Fuel Centerline Temperature (K)',
          data: fuelCenterlineTempPoints,
          borderColor: 'rgba(220, 53, 69, 1)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4
        }
      ]
    });
  };
  
  // Update time series data
  const updateTimeSeriesData = () => {
    // Maximum number of points to keep in the time series
    const MAX_POINTS = 100;
    
    // Add current time and temperature to history
    timeHistoryRef.current.push(simulationTime);
    tempHistoryRef.current.push(coreOutletTemp);
    
    // Limit the number of points
    if (timeHistoryRef.current.length > MAX_POINTS) {
      timeHistoryRef.current.shift();
      tempHistoryRef.current.shift();
    }
    
    // Update chart data
    setTimeSeriesData({
      labels: timeHistoryRef.current,
      datasets: [
        {
          label: 'Core Outlet Temperature (K)',
          data: tempHistoryRef.current,
          borderColor: 'rgba(220, 53, 69, 1)',
          backgroundColor: 'rgba(220, 53, 69, 0.1)',
          tension: 0.4
        }
      ]
    });
  };
  
  // Start simulation
  const startSimulation = () => {
    if (isSimulationRunning) return;
    
    // Reset history if starting a new simulation
    if (simulationTime === 0) {
      timeHistoryRef.current = [];
      tempHistoryRef.current = [];
    }
    
    setIsSimulationRunning(true);
    lastTimestampRef.current = performance.now();
    runSimulation();
  };
  
  // Stop simulation
  const stopSimulation = () => {
    setIsSimulationRunning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    stopSimulation();
    setSimulationTime(0);
    timeHistoryRef.current = [];
    tempHistoryRef.current = [];
    setTimeSeriesData(null);
    calculateThermalHydraulics();
  };
  
  // Main simulation loop
  const runSimulation = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTimestampRef.current) / 1000; // Convert to seconds
    lastTimestampRef.current = currentTime;
    
    // Update simulation time
    setSimulationTime(prevTime => {
      const newTime = prevTime + deltaTime * simulationSpeed;
      return newTime;
    });
    
    // Add some dynamic behavior for demonstration (simplified)
    // In a real simulation, you'd have a full set of differential equations for core behavior
    const randomVariation = (Math.random() - 0.5) * 2; // Random number between -1 and 1
    
    // Apply small random variations to the inlet temperature for realism
    setCoreInletTemp(prevTemp => {
      const newTemp = prevTemp + randomVariation * 0.2;
      return newTemp;
    });
    
    // Recalculate thermal-hydraulics with the new values
    calculateThermalHydraulics();
    
    // Continue the simulation if it's still running
    if (isSimulationRunning) {
      animationFrameRef.current = requestAnimationFrame(runSimulation);
    }
  };
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Export data as CSV
  const exportData = () => {
    if (!timeSeriesData || !timeSeriesData.labels) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Time (s),Core Outlet Temperature (K)\n"
      + timeSeriesData.labels.map((time, i) => `${time.toFixed(2)},${timeSeriesData.datasets[0].data[i].toFixed(2)}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `thermal_hydraulics_${reactorType || "custom"}_sim.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Calculate thermal-hydraulics whenever parameters change
  useEffect(() => {
    calculateThermalHydraulics();
  }, [
    coolantType, power, coolantFlowRate, coreInletTemp, systemPressure, 
    fuelRods, coreHeight, coreDiameter, channelDiameter, activeFuelLength, bypassFlow
  ]);
  
  // Effect to handle stopping simulation when hiding simulator
  useEffect(() => {
    if (!showSimulator && animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [showSimulator]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }} id="thermal-hydraulics-simulator">
      <Typography variant="h4" gutterBottom>
        Thermal-Hydraulics Simulator
        <Tooltip title="This simulator models the thermal-hydraulic behavior of different reactor types. You can explore how parameters like power, flow rate, and geometry affect core temperatures, pressure drops, and safety margins.">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      
      <Typography variant="body2" color="text.secondary" paragraph>
        Simulate thermal-hydraulic behavior in nuclear reactors with different coolant types and core geometries.
        Visualize temperature distributions, pressure drops, and safety margins.
      </Typography>
      
      <Button
        variant="contained"
        color="primary"
        startIcon={showSimulator ? <ExpandMoreIcon /> : <LaunchIcon />}
        onClick={() => setShowSimulator(!showSimulator)}
        sx={{ my: 2 }}
      >
        {showSimulator ? "Hide Simulator" : "Launch Simulator"}
      </Button>
      
      <Collapse in={showSimulator} timeout="auto" unmountOnExit>
        <Divider sx={{ my: 2 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="thermal hydraulics simulator tabs">
          <Tab label="Simulator" />
          <Tab label="Results" />
          <Tab label="Theory" />
        </Tabs>
      </Box>
      
      {/* Simulator Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Parameter Controls */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Reactor Configuration</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Reactor Type</InputLabel>
                <Select
                  value={reactorType}
                  label="Reactor Type"
                  onChange={(e) => applyReactorPreset(e.target.value)}
                >
                  <MenuItem value="">Custom</MenuItem>
                  {Object.keys(REACTOR_PRESETS).map((key) => (
                    <MenuItem key={key} value={key}>{REACTOR_PRESETS[key].name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Coolant Type</InputLabel>
                <Select
                  value={coolantType}
                  label="Coolant Type"
                  onChange={(e) => setCoolantType(e.target.value)}
                >
                  {Object.keys(COOLANT_TYPES).map((key) => (
                    <MenuItem key={key} value={key}>{COOLANT_TYPES[key].name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Thermal Power (MWth)"
                type="number"
                fullWidth
                value={power}
                onChange={(e) => setPower(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0 }}
              />
              
              <TextField
                label="Core Inlet Temperature (K)"
                type="number"
                fullWidth
                value={coreInletTemp}
                onChange={(e) => setCoreInletTemp(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 273 }}
              />
              
              <TextField
                label="System Pressure (MPa)"
                type="number"
                fullWidth
                value={systemPressure}
                onChange={(e) => setSystemPressure(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0.1, step: 0.1 }}
              />
            </Paper>
            
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Core Geometry</Typography>
              
              <TextField
                label="Coolant Flow Rate (kg/s)"
                type="number"
                fullWidth
                value={coolantFlowRate}
                onChange={(e) => setCoolantFlowRate(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0 }}
              />
              
              <TextField
                label="Number of Fuel Rods"
                type="number"
                fullWidth
                value={fuelRods}
                onChange={(e) => setFuelRods(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0 }}
              />
              
              <TextField
                label="Core Height (m)"
                type="number"
                fullWidth
                value={coreHeight}
                onChange={(e) => setCoreHeight(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0, step: 0.1 }}
              />
              
              <TextField
                label="Core Diameter (m)"
                type="number"
                fullWidth
                value={coreDiameter}
                onChange={(e) => setCoreDiameter(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0, step: 0.1 }}
              />
              
              <TextField
                label="Coolant Channel Diameter (m)"
                type="number"
                fullWidth
                value={channelDiameter}
                onChange={(e) => setChannelDiameter(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0.001, step: 0.001 }}
              />
              
              <TextField
                label="Active Fuel Length (m)"
                type="number"
                fullWidth
                value={activeFuelLength}
                onChange={(e) => setActiveFuelLength(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0, step: 0.1 }}
              />
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Bypass Flow: {bypassFlow}%</Typography>
                <Slider
                  value={bypassFlow}
                  onChange={(e, val) => setBypassFlow(val)}
                  step={0.5}
                  min={0}
                  max={20}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 10, label: '10%' },
                    { value: 20, label: '20%' }
                  ]}
                />
              </Box>
            </Paper>
          </Grid>
          
          {/* Main Visualization */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Axial Temperature Distribution</Typography>
                <Box>
                  <Typography variant="caption" sx={{ mr: 1 }}>Time: {simulationTime.toFixed(1)} s</Typography>
                  <Tooltip title="Simulation Speed">
                    <FormControl size="small" sx={{ width: 120, mr: 1 }}>
                      <Select
                        value={simulationSpeed}
                        onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                        disabled={isSimulationRunning}
                      >
                        <MenuItem value={0.5}>0.5x</MenuItem>
                        <MenuItem value={1}>1.0x</MenuItem>
                        <MenuItem value={2}>2.0x</MenuItem>
                        <MenuItem value={5}>5.0x</MenuItem>
                        <MenuItem value={10}>10.0x</MenuItem>
                      </Select>
                    </FormControl>
                  </Tooltip>
                  {!isSimulationRunning ? (
                    <Button 
                      variant="contained" 
                      color="primary" 
                      startIcon={<PlayArrowIcon />}
                      onClick={startSimulation}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Run
                    </Button>
                  ) : (
                    <Button 
                      variant="contained" 
                      color="secondary" 
                      startIcon={<PauseIcon />}
                      onClick={stopSimulation}
                      size="small"
                      sx={{ mr: 1 }}
                    >
                      Pause
                    </Button>
                  )}
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetSimulation}
                    size="small"
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
              
              <Box sx={{ height: 300, mb: 2 }}>
                {axialTempProfile && (
                  <Line
                    ref={chartRef}
                    data={axialTempProfile}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Axial Position (m)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Temperature (K)'
                          }
                        }
                      },
                      plugins: {
                      }
                    }}
                  />
                )}
              </Box>
              
              <Box sx={{ height: 240 }}>
                {timeSeriesData && (
                  <Line
                    ref={timeSeriesRef}
                    data={timeSeriesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Time (s)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Temperature (K)'
                          }
                        }
                      }
                    }}
                  />
                )}
              </Box>
              
              {simulationTime > 0 && (
                <Button 
                  variant="outlined" 
                  color="primary" 
                  startIcon={<DownloadIcon />}
                  onClick={exportData}
                  sx={{ mt: 2 }}
                >
                  Export Data
                </Button>
              )}
            </Paper>
            
            {/* Results Summary */}
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Primary Results</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Core Inlet Temp:</Typography>
                      <Typography variant="body1" fontWeight="medium">{coreInletTemp.toFixed(2)} K</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Core Outlet Temp:</Typography>
                      <Typography variant="body1" fontWeight="medium">{coreOutletTemp.toFixed(2)} K</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Temperature Rise:</Typography>
                      <Typography variant="body1" fontWeight="medium">{temperatureRise.toFixed(2)} K</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Max Fuel Temp:</Typography>
                      <Typography variant="body1" fontWeight="medium">{maxFuelTemp.toFixed(2)} K</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Pressure Drop:</Typography>
                      <Typography variant="body1" fontWeight="medium">{pressureDrop.toFixed(4)} MPa</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Flow Velocity:</Typography>
                      <Typography variant="body1" fontWeight="medium">{flowVelocity.toFixed(2)} m/s</Typography>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                  <Typography variant="h6" gutterBottom>Safety Parameters</Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Heat Flux:</Typography>
                      <Typography variant="body1" fontWeight="medium">{(heatFlux/1000).toFixed(2)} kW/m²</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">DNBR/Dryout Margin:</Typography>
                      <Typography 
                        variant="body1" 
                        fontWeight="medium"
                        color={dryoutMargin < 1.3 ? 'error.main' : dryoutMargin < 1.8 ? 'warning.main' : 'success.main'}
                      >
                        {dryoutMargin.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Reynolds Number:</Typography>
                      <Typography variant="body1" fontWeight="medium">{reynoldsNumber.toExponential(2)}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="textSecondary">Void Fraction:</Typography>
                      <Typography variant="body1" fontWeight="medium">{(voidFraction * 100).toFixed(2)}%</Typography>
                    </Grid>
                  </Grid>
                  
                  {warningMessage && (
                    <Alert 
                      severity={safetyStatus === 'critical' ? 'error' : safetyStatus === 'warning' ? 'warning' : 'success'} 
                      sx={{ mt: 2 }}
                    >
                      {warningMessage || 'System operating within normal parameters'}
                    </Alert>
                  )}
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Results Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h5" gutterBottom>Detailed Simulation Results</Typography>
        
        <Grid container spacing={3}>
          {/* Temperature Profile */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Temperature Profile</Typography>
              <Box sx={{ height: 350 }}>
                {axialTempProfile && (
                  <Line
                    data={axialTempProfile}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Axial Position (m)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Temperature (K)'
                          }
                        }
                      },
                      plugins: {
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Time Series */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>Temperature Time Series</Typography>
              <Box sx={{ height: 350 }}>
                {timeSeriesData ? (
                  <Line
                    data={timeSeriesData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Time (s)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Temperature (K)'
                          }
                        }
                      }
                    }}
                  />
                ) : (
                  <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="textSecondary">
                      Run the simulation to generate time series data
                    </Typography>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>
          
          {/* Detailed Results */}
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Detailed Parameters</Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Thermal Parameters
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">Core Power:</Typography>
                        <Typography variant="body1">{power} MWth</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Core Inlet Temperature:</Typography>
                        <Typography variant="body1">{coreInletTemp.toFixed(2)} K</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Core Outlet Temperature:</Typography>
                        <Typography variant="body1">{coreOutletTemp.toFixed(2)} K</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Temperature Rise:</Typography>
                        <Typography variant="body1">{temperatureRise.toFixed(2)} K</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Maximum Fuel Temperature:</Typography>
                        <Typography variant="body1">{maxFuelTemp.toFixed(2)} K</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Flow Parameters
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">Coolant Type:</Typography>
                        <Typography variant="body1">{COOLANT_TYPES[coolantType].name}</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Total Flow Rate:</Typography>
                        <Typography variant="body1">{coolantFlowRate.toFixed(2)} kg/s</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Bypass Flow:</Typography>
                        <Typography variant="body1">{bypassFlow}%</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Flow Velocity:</Typography>
                        <Typography variant="body1">{flowVelocity.toFixed(2)} m/s</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Reynolds Number:</Typography>
                        <Typography variant="body1">{reynoldsNumber.toExponential(2)}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Hydraulic Parameters
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">System Pressure:</Typography>
                        <Typography variant="body1">{systemPressure.toFixed(2)} MPa</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Core Pressure Drop:</Typography>
                        <Typography variant="body1">{pressureDrop.toFixed(4)} MPa</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Void Fraction (outlet):</Typography>
                        <Typography variant="body1">{(voidFraction * 100).toFixed(2)}%</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Coolant Density:</Typography>
                        <Typography variant="body1">{COOLANT_TYPES[coolantType].density} kg/m³</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Boiling Point (at pressure):</Typography>
                        <Typography variant="body1">
                          {(COOLANT_TYPES[coolantType].boilingPoint * (1 + systemPressure * 0.01)).toFixed(2)} K
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Safety Parameters
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2" color="textSecondary">Heat Flux:</Typography>
                        <Typography variant="body1">{(heatFlux/1000).toFixed(2)} kW/m²</Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">DNBR/Dryout Margin:</Typography>
                        <Typography 
                          variant="body1"
                          color={dryoutMargin < 1.3 ? 'error.main' : dryoutMargin < 1.8 ? 'warning.main' : 'success.main'}
                        >
                          {dryoutMargin.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Safety Status:</Typography>
                        <Typography 
                          variant="body1"
                          color={
                            safetyStatus === 'critical' ? 'error.main' : 
                            safetyStatus === 'warning' ? 'warning.main' : 
                            'success.main'
                          }
                        >
                          {safetyStatus === 'critical' ? 'Critical' : 
                           safetyStatus === 'warning' ? 'Warning' : 
                           'Normal'}
                        </Typography>
                      </Box>
                      <Box sx={{ mt: 1 }}>
                        <Typography variant="body2" color="textSecondary">Margin to Saturation:</Typography>
                        <Typography variant="body1">
                          {(COOLANT_TYPES[coolantType].boilingPoint * (1 + systemPressure * 0.01) - coreOutletTemp).toFixed(2)} K
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              {warningMessage && (
                <Alert 
                  severity={safetyStatus === 'critical' ? 'error' : safetyStatus === 'warning' ? 'warning' : 'success'} 
                  sx={{ mt: 3 }}
                >
                  {warningMessage || 'System operating within normal parameters'}
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Theory Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h5" gutterBottom>Thermal-Hydraulics Theory</Typography>
        
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Fundamental Principles</Typography>
          
          <Typography variant="body1" paragraph>
            Thermal-hydraulics is the study of fluid flow and heat transfer in nuclear reactors. It's crucial for ensuring safe and efficient operation by maintaining adequate cooling of the fuel and preventing scenarios that could lead to fuel damage.
          </Typography>
          
          <Typography variant="subtitle1" gutterBottom>Key Equations:</Typography>
          
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2, fontFamily: 'monospace' }}>
            <Typography variant="body1" component="div">
              1. Energy Balance Equation:
              <br />
              Q = ṁ·cp·ΔT
              <br /><br />
              Where:
              <br />
              Q = Thermal power (W)
              <br />
              ṁ = Coolant mass flow rate (kg/s)
              <br />
              cp = Specific heat capacity (J/kg·K)
              <br />
              ΔT = Temperature rise (K)
            </Typography>
          </Box>
          
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2, fontFamily: 'monospace' }}>
            <Typography variant="body1" component="div">
              2. Pressure Drop Calculation:
              <br />
              ΔP = f·(L/D)·(ρ·v²/2)
              <br /><br />
              Where:
              <br />
              ΔP = Pressure drop (Pa)
              <br />
              f = Friction factor
              <br />
              L = Channel length (m)
              <br />
              D = Hydraulic diameter (m)
              <br />
              ρ = Coolant density (kg/m³)
              <br />
              v = Flow velocity (m/s)
            </Typography>
          </Box>
          
          <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2, fontFamily: 'monospace' }}>
            <Typography variant="body1" component="div">
              3. Heat Flux Calculation:
              <br />
              q" = Q / (π·D·L·N)
              <br /><br />
              Where:
              <br />
              q" = Heat flux (W/m²)
              <br />
              Q = Thermal power (W)
              <br />
              D = Fuel rod diameter (m)
              <br />
              L = Active fuel length (m)
              <br />
              N = Number of fuel rods
            </Typography>
          </Box>
        </Paper>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Heat Transfer Mechanisms</Typography>
              
              <Typography variant="body1" paragraph>
                Heat transfer in nuclear reactors involves:
              </Typography>
              
              <Typography component="ol" sx={{ pl: 2 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Conduction</strong>: Heat transfer through the fuel pellet and cladding. The temperature gradient in the fuel is described by the heat conduction equation.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Convection</strong>: Heat transfer from the cladding surface to the coolant. Described by Newton's law of cooling: q" = h·(Ts - Tb), where h is the heat transfer coefficient.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Radiation</strong>: Important at high temperatures, especially in gas-cooled reactors or accident scenarios.
                  </Typography>
                </li>
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>Heat Transfer Regimes:</Typography>
              
              <Typography variant="body1" paragraph>
                For water-cooled reactors, several heat transfer regimes exist:
              </Typography>
              
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <Typography variant="body1">
                    <strong>Single-phase convection</strong>: Normal operation in PWRs
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Subcooled boiling</strong>: Bubbles form at surface but condense in bulk fluid
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Nucleate boiling</strong>: Normal operation in BWRs
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Critical heat flux (CHF)</strong>: Transition point where bubble formation reduces heat transfer
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Film boiling</strong>: Dangerous condition with vapor blanketing the fuel surface
                  </Typography>
                </li>
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Safety Considerations</Typography>
              
              <Typography variant="body1" paragraph>
                Thermal-hydraulic analysis is vital for reactor safety, focusing on:
              </Typography>
              
              <Typography component="ol" sx={{ pl: 2 }}>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Departure from Nucleate Boiling Ratio (DNBR)</strong>: Measures margin to critical heat flux. DNBR = qCHF / qactual. Must stay above 1.3-1.5 for safety.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Flow instabilities</strong>: Particularly in boiling water systems, oscillations can develop under certain conditions.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Loss of coolant accidents (LOCA)</strong>: Emergency core cooling systems must be designed to prevent fuel damage during coolant loss.
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1" paragraph>
                    <strong>Natural circulation</strong>: Many reactors rely on natural circulation for passive safety, which depends on thermal-hydraulic design.
                  </Typography>
                </li>
              </Typography>
              
              <Typography variant="subtitle1" gutterBottom>Different Reactor Designs:</Typography>
              
              <Typography variant="body1" paragraph>
                Thermal-hydraulic challenges vary by reactor type:
              </Typography>
              
              <Typography component="ul" sx={{ pl: 2 }}>
                <li>
                  <Typography variant="body1">
                    <strong>PWRs</strong>: Focus on DNBR margin, single-phase heat transfer
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>BWRs</strong>: Two-phase flow stability, void fraction control
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Liquid metal reactors</strong>: Managing high thermal conductivity but poor volumetric heat capacity
                  </Typography>
                </li>
                <li>
                  <Typography variant="body1">
                    <strong>Gas-cooled reactors</strong>: Maintaining sufficient cooling with low-density coolant
                  </Typography>
                </li>
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      </Collapse>
    </Paper>
  );
};

export default ThermalHydraulicsSimulator;