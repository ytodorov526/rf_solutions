import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CalculateIcon from '@mui/icons-material/Calculate';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

// TabPanel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`calculator-tabpanel-${index}`}
      aria-labelledby={`calculator-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: 'calculator-tab-' + index,
    'aria-controls': 'calculator-tabpanel-' + index,
  };
}

// Default calculator values
const defaultValues = {
  ohmsLaw: {
    voltage: 12,
    current: 1,
    resistance: 12,
    calculate: 'resistance',
  },
  power: {
    voltage: 120,
    current: 2,
    resistance: 60,
    power: 240,
    calculate: 'power',
  },
  rcCircuit: {
    resistance: 10000,
    capacitance: 0.000001,
    startVoltage: 5,
    timeConstant: 0.01,
    time: 0.03,
  },
  resonance: {
    inductance: 0.001,
    capacitance: 0.0000001,
    resistanceRLC: 10,
    resonantFreq: 15915.49,
    qualityFactor: 10,
  }
};

function ElectricalCalculator() {
  // State for the active calculator tab
  const [activeTab, setActiveTab] = useState(0);
  
  // State for calculator inputs
  const [ohmsLawValues, setOhmsLawValues] = useState(defaultValues.ohmsLaw);
  const [powerValues, setPowerValues] = useState(defaultValues.power);
  const [rcCircuitValues, setRcCircuitValues] = useState(defaultValues.rcCircuit);
  const [resonanceValues, setResonanceValues] = useState(defaultValues.resonance);
  
  // State for calculated results
  const [ohmsLawResults, setOhmsLawResults] = useState({});
  const [powerResults, setPowerResults] = useState({});
  const [rcCircuitResults, setRcCircuitResults] = useState({});
  const [resonanceResults, setResonanceResults] = useState({});
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle calculator input changes
  const handleOhmsLawChange = (field, value) => {
    setOhmsLawValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handlePowerChange = (field, value) => {
    setPowerValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleRcCircuitChange = (field, value) => {
    setRcCircuitValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleResonanceChange = (field, value) => {
    setResonanceValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Calculator functions
  const calculateOhmsLaw = () => {
    const { voltage, current, resistance, calculate } = ohmsLawValues;
    
    let result = {};
    
    switch (calculate) {
      case 'voltage':
        const calculatedVoltage = current * resistance;
        result = {
          voltage: calculatedVoltage.toFixed(3),
          current: current,
          resistance: resistance,
          formula: `V = I × R = ${current} × ${resistance} = ${calculatedVoltage.toFixed(3)} V`,
        };
        break;
      case 'current':
        const calculatedCurrent = voltage / resistance;
        result = {
          voltage: voltage,
          current: calculatedCurrent.toFixed(3),
          resistance: resistance,
          formula: `I = V / R = ${voltage} / ${resistance} = ${calculatedCurrent.toFixed(3)} A`,
        };
        break;
      case 'resistance':
        const calculatedResistance = voltage / current;
        result = {
          voltage: voltage,
          current: current,
          resistance: calculatedResistance.toFixed(3),
          formula: `R = V / I = ${voltage} / ${current} = ${calculatedResistance.toFixed(3)} Ω`,
        };
        break;
      default:
        break;
    }
    
    setOhmsLawResults(result);
  };
  
  const calculatePower = () => {
    const { voltage, current, resistance, power, calculate } = powerValues;
    
    let result = {};
    
    switch (calculate) {
      case 'power':
        const calculatedPower = voltage * current;
        result = {
          power: calculatedPower.toFixed(3),
          voltage: voltage,
          current: current,
          resistance: resistance,
          formula: `P = V × I = ${voltage} × ${current} = ${calculatedPower.toFixed(3)} W`,
          powerLoss: (calculatedPower * 24 * 365 / 1000).toFixed(2), // kWh per year
        };
        break;
      case 'voltage':
        const calculatedVoltage = power / current;
        result = {
          power: power,
          voltage: calculatedVoltage.toFixed(3),
          current: current,
          resistance: (calculatedVoltage / current).toFixed(3),
          formula: `V = P / I = ${power} / ${current} = ${calculatedVoltage.toFixed(3)} V`,
          powerLoss: (power * 24 * 365 / 1000).toFixed(2), // kWh per year
        };
        break;
      case 'current':
        const calculatedCurrent = power / voltage;
        result = {
          power: power,
          voltage: voltage,
          current: calculatedCurrent.toFixed(3),
          resistance: (voltage / calculatedCurrent).toFixed(3),
          formula: `I = P / V = ${power} / ${voltage} = ${calculatedCurrent.toFixed(3)} A`,
          powerLoss: (power * 24 * 365 / 1000).toFixed(2), // kWh per year
        };
        break;
      case 'resistance':
        // P = V²/R, so R = V²/P
        const calculatedResistance = (voltage * voltage) / power;
        const currentFromResistance = voltage / calculatedResistance;
        result = {
          power: power,
          voltage: voltage,
          current: currentFromResistance.toFixed(3),
          resistance: calculatedResistance.toFixed(3),
          formula: `R = V² / P = ${voltage}² / ${power} = ${calculatedResistance.toFixed(3)} Ω`,
          powerLoss: (power * 24 * 365 / 1000).toFixed(2), // kWh per year
        };
        break;
      default:
        break;
    }
    
    setPowerResults(result);
  };
  
  const calculateRcCircuit = () => {
    const { resistance, capacitance, startVoltage, time } = rcCircuitValues;
    
    // Calculate time constant (τ = RC)
    const timeConstant = resistance * capacitance;
    
    // Calculate voltage at time t: V(t) = V₀ × e^(-t/RC)
    const voltage = startVoltage * Math.exp(-time / timeConstant);
    
    // Calculate current at time t: I(t) = (V₀/R) × e^(-t/RC)
    const current = (startVoltage / resistance) * Math.exp(-time / timeConstant);
    
    // Calculate energy stored in capacitor: E = 0.5 × C × V(t)²
    const energy = 0.5 * capacitance * Math.pow(voltage, 2);
    
    // Calculate time points for discharge curve
    const timePoints = [0, timeConstant * 0.5, timeConstant, timeConstant * 2, timeConstant * 3, timeConstant * 5];
    const dischargeCurve = timePoints.map(t => {
      const voltageAtTime = startVoltage * Math.exp(-t / timeConstant);
      return {
        time: t,
        voltage: voltageAtTime,
        percentCharge: (voltageAtTime / startVoltage) * 100
      };
    });
    
    setRcCircuitResults({
      timeConstant: timeConstant.toExponential(3),
      voltage: voltage.toFixed(3),
      current: current.toExponential(6),
      energy: energy.toExponential(6),
      dischargeCurve: dischargeCurve,
    });
  };
  
  const calculateResonance = () => {
    const { inductance, capacitance, resistanceRLC } = resonanceValues;
    
    // Calculate resonant frequency: f = 1/(2π√(LC))
    const resonantFreq = 1 / (2 * Math.PI * Math.sqrt(inductance * capacitance));
    
    // Calculate angular frequency: ω = 2πf
    const angularFreq = 2 * Math.PI * resonantFreq;
    
    // Calculate impedance at resonance (should equal resistance)
    const impedanceAtResonance = resistanceRLC;
    
    // Calculate quality factor: Q = (1/R) × √(L/C)
    const qualityFactor = (1 / resistanceRLC) * Math.sqrt(inductance / capacitance);
    
    // Calculate bandwidth: BW = f/Q
    const bandwidth = resonantFreq / qualityFactor;
    
    setResonanceResults({
      resonantFreq: resonantFreq.toFixed(2),
      angularFreq: angularFreq.toFixed(2),
      impedanceAtResonance: impedanceAtResonance.toFixed(2),
      qualityFactor: qualityFactor.toFixed(2),
      bandwidth: bandwidth.toFixed(2),
    });
  };
  
  // Reset calculators
  const resetOhmsLaw = () => {
    setOhmsLawValues(defaultValues.ohmsLaw);
    setOhmsLawResults({});
  };
  
  const resetPower = () => {
    setPowerValues(defaultValues.power);
    setPowerResults({});
  };
  
  const resetRcCircuit = () => {
    setRcCircuitValues(defaultValues.rcCircuit);
    setRcCircuitResults({});
  };
  
  const resetResonance = () => {
    setResonanceValues(defaultValues.resonance);
    setResonanceResults({});
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Electrical Engineering Calculators
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Interactive calculators for common electrical engineering formulas and circuit analysis. These tools demonstrate the fundamental relationships in circuit theory and electronic systems.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Calculator Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="electrical calculator tabs"
          >
            <Tab label="Ohm's Law" {...a11yProps(0)} />
            <Tab label="Power Calculator" {...a11yProps(1)} />
            <Tab label="RC Circuit" {...a11yProps(2)} />
            <Tab label="Resonance Calculator" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        {/* Ohm's Law Calculator */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Ohm's Law Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate voltage, current, or resistance using Ohm's Law: V = IR.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Inputs */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Parameters
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="calculate-label">Calculate</InputLabel>
                      <Select
                        labelId="calculate-label"
                        value={ohmsLawValues.calculate}
                        label="Calculate"
                        onChange={(e) => handleOhmsLawChange('calculate', e.target.value)}
                      >
                        <MenuItem value="voltage">Voltage (V)</MenuItem>
                        <MenuItem value="current">Current (I)</MenuItem>
                        <MenuItem value="resistance">Resistance (R)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {ohmsLawValues.calculate !== 'voltage' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          label="Voltage (V)"
                          type="number"
                          value={ohmsLawValues.voltage}
                          onChange={(e) => handleOhmsLawChange('voltage', parseFloat(e.target.value))}
                          fullWidth
                          inputProps={{
                            step: 0.1,
                          }}
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="Voltage is measured in volts (V)">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )}
                  
                  {ohmsLawValues.calculate !== 'current' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          label="Current (I)"
                          type="number"
                          value={ohmsLawValues.current}
                          onChange={(e) => handleOhmsLawChange('current', parseFloat(e.target.value))}
                          fullWidth
                          inputProps={{
                            step: 0.1,
                          }}
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="Current is measured in amperes (A)">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )}
                  
                  {ohmsLawValues.calculate !== 'resistance' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          label="Resistance (R)"
                          type="number"
                          value={ohmsLawValues.resistance}
                          onChange={(e) => handleOhmsLawChange('resistance', parseFloat(e.target.value))}
                          fullWidth
                          inputProps={{
                            step: 0.1,
                          }}
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="Resistance is measured in ohms (Ω)">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )}
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculateOhmsLaw}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetOhmsLaw}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom>
                Formula:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                <Typography>Ohm's Law: V = I × R</Typography>
                <Typography>where:</Typography>
                <Typography sx={{ pl: 2 }}>V is voltage in volts (V)</Typography>
                <Typography sx={{ pl: 2 }}>I is current in amperes (A)</Typography>
                <Typography sx={{ pl: 2 }}>R is resistance in ohms (Ω)</Typography>
              </Box>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(ohmsLawResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Voltage (V)</TableCell>
                          <TableCell align="right">{ohmsLawResults.voltage} V</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Current (I)</TableCell>
                          <TableCell align="right">{ohmsLawResults.current} A</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Resistance (R)</TableCell>
                          <TableCell align="right">{ohmsLawResults.resistance} Ω</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Formula Used</TableCell>
                          <TableCell align="right">{ohmsLawResults.formula}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Enter parameters and click Calculate to see results
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Key Concepts:
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Ohm's Law</strong> is a fundamental principle in electrical engineering that describes the 
              relationship between voltage (V), current (I), and resistance (R). It states that the current flowing 
              through a conductor is directly proportional to the voltage and inversely proportional to the resistance.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Voltage</strong> is the electrical pressure that drives the flow of electrons in a circuit, 
              measured in volts (V). <strong>Current</strong> is the rate of flow of electric charge, measured 
              in amperes (A). <strong>Resistance</strong> is the opposition to current flow, measured in ohms (Ω).
            </Typography>
            <Typography variant="body2">
              These three quantities are interrelated, and knowing any two allows you to calculate the third 
              using Ohm's Law. This principle forms the basis for analyzing and designing electrical circuits.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Power Calculator */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Electrical Power Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate power, voltage, current, or resistance in electrical circuits using power formulas.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Inputs */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Parameters
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="power-calculate-label">Calculate</InputLabel>
                      <Select
                        labelId="power-calculate-label"
                        value={powerValues.calculate}
                        label="Calculate"
                        onChange={(e) => handlePowerChange('calculate', e.target.value)}
                      >
                        <MenuItem value="power">Power (P)</MenuItem>
                        <MenuItem value="voltage">Voltage (V)</MenuItem>
                        <MenuItem value="current">Current (I)</MenuItem>
                        <MenuItem value="resistance">Resistance (R)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  {powerValues.calculate !== 'power' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          label="Power (P)"
                          type="number"
                          value={powerValues.power}
                          onChange={(e) => handlePowerChange('power', parseFloat(e.target.value))}
                          fullWidth
                          inputProps={{
                            step: 1,
                          }}
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="Power is measured in watts (W)">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )}
                  
                  {powerValues.calculate !== 'voltage' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          label="Voltage (V)"
                          type="number"
                          value={powerValues.voltage}
                          onChange={(e) => handlePowerChange('voltage', parseFloat(e.target.value))}
                          fullWidth
                          inputProps={{
                            step: 1,
                          }}
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="Voltage is measured in volts (V)">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )}
                  
                  {powerValues.calculate !== 'current' && (
                    <Grid item xs={12}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField
                          label="Current (I)"
                          type="number"
                          value={powerValues.current}
                          onChange={(e) => handlePowerChange('current', parseFloat(e.target.value))}
                          fullWidth
                          inputProps={{
                            step: 0.1,
                          }}
                          sx={{ mr: 1 }}
                        />
                        <Tooltip title="Current is measured in amperes (A)">
                          <IconButton size="small">
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Grid>
                  )}
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculatePower}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetPower}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom>
                Formulas:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                <Typography>Power: P = V × I</Typography>
                <Typography>Power: P = I² × R</Typography>
                <Typography>Power: P = V² / R</Typography>
                <Typography sx={{ mt: 1 }}>where:</Typography>
                <Typography sx={{ pl: 2 }}>P is power in watts (W)</Typography>
                <Typography sx={{ pl: 2 }}>V is voltage in volts (V)</Typography>
                <Typography sx={{ pl: 2 }}>I is current in amperes (A)</Typography>
                <Typography sx={{ pl: 2 }}>R is resistance in ohms (Ω)</Typography>
              </Box>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(powerResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Power (P)</TableCell>
                          <TableCell align="right">{powerResults.power} W</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Voltage (V)</TableCell>
                          <TableCell align="right">{powerResults.voltage} V</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Current (I)</TableCell>
                          <TableCell align="right">{powerResults.current} A</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Resistance (R)</TableCell>
                          <TableCell align="right">{powerResults.resistance} Ω</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Energy Use (per year)</TableCell>
                          <TableCell align="right">{powerResults.powerLoss} kWh</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Formula Used</TableCell>
                          <TableCell align="right">{powerResults.formula}</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Enter parameters and click Calculate to see results
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Key Concepts:
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Electrical power</strong> is the rate at which electrical energy is transferred in a circuit. 
              It can be calculated using several equivalent formulas, depending on which variables are known.
            </Typography>
            <Typography variant="body2" paragraph>
              The basic formula for electrical power is P = V × I (power equals voltage times current), which shows 
              that power increases with either voltage or current. For resistive circuits, the power can also be 
              calculated using P = I² × R or P = V² / R.
            </Typography>
            <Typography variant="body2">
              Understanding power calculations is essential for designing electrical systems, determining 
              energy consumption, selecting appropriate components, and ensuring safe operation of circuits.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* RC Circuit Calculator */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            RC Circuit Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate time constant, voltage decay, and current in an RC circuit during discharge.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Inputs */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Parameters
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Resistance (R)"
                        type="number"
                        value={rcCircuitValues.resistance}
                        onChange={(e) => handleRcCircuitChange('resistance', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 100,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Resistance in ohms (Ω)">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Capacitance (C)"
                        type="number"
                        value={rcCircuitValues.capacitance}
                        onChange={(e) => handleRcCircuitChange('capacitance', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.000001,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Capacitance in farads (F). Use scientific notation: 1e-6 for 1 µF">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Initial Voltage (V₀)"
                        type="number"
                        value={rcCircuitValues.startVoltage}
                        onChange={(e) => handleRcCircuitChange('startVoltage', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.1,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="The initial voltage across the capacitor in volts (V)">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Time (t)"
                        type="number"
                        value={rcCircuitValues.time}
                        onChange={(e) => handleRcCircuitChange('time', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.001,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Time since discharge began, in seconds (s)">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculateRcCircuit}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetRcCircuit}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom>
                Formula:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                <Typography>Time Constant: τ = R × C</Typography>
                <Typography>Voltage at time t: V(t) = V₀ × e^(-t/τ)</Typography>
                <Typography>Current at time t: I(t) = (V₀/R) × e^(-t/τ)</Typography>
                <Typography>Energy stored: E = 0.5 × C × V(t)²</Typography>
                <Typography sx={{ mt: 1 }}>where:</Typography>
                <Typography sx={{ pl: 2 }}>τ is the time constant in seconds (s)</Typography>
                <Typography sx={{ pl: 2 }}>V₀ is the initial voltage in volts (V)</Typography>
                <Typography sx={{ pl: 2 }}>t is the time in seconds (s)</Typography>
              </Box>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(rcCircuitResults).length > 0 ? (
                  <>
                    <TableContainer sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">Time Constant (τ)</TableCell>
                            <TableCell align="right">{rcCircuitResults.timeConstant} s</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Voltage at time t</TableCell>
                            <TableCell align="right">{rcCircuitResults.voltage} V</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Current at time t</TableCell>
                            <TableCell align="right">{rcCircuitResults.current} A</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Energy stored</TableCell>
                            <TableCell align="right">{rcCircuitResults.energy} J</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {/* Discharge curve */}
                    {rcCircuitResults.dischargeCurve && (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          Discharge Curve
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Time (τ units)</TableCell>
                                <TableCell align="right">Voltage (V)</TableCell>
                                <TableCell align="right">Charge (%)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rcCircuitResults.dischargeCurve.map((point, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    {point.time === 0 ? "0" : 
                                      point.time === parseFloat(rcCircuitResults.timeConstant) ? "1τ" : 
                                      point.time === parseFloat(rcCircuitResults.timeConstant) * 2 ? "2τ" : 
                                      point.time === parseFloat(rcCircuitResults.timeConstant) * 3 ? "3τ" : 
                                      point.time === parseFloat(rcCircuitResults.timeConstant) * 5 ? "5τ" : 
                                      `${(point.time / parseFloat(rcCircuitResults.timeConstant)).toFixed(1)}τ`}
                                  </TableCell>
                                  <TableCell align="right">{point.voltage.toFixed(3)}</TableCell>
                                  <TableCell align="right">{point.percentCharge.toFixed(1)}%</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </>
                    )}
                  </>
                ) : (
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Enter parameters and click Calculate to see results
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Key Concepts:
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>RC Circuits</strong> consist of a resistor and capacitor connected in series, and 
              they exhibit a characteristic response when charged or discharged. The <strong>time constant</strong> 
              (τ = RC) determines how quickly the circuit responds to changes.
            </Typography>
            <Typography variant="body2" paragraph>
              When a charged capacitor is allowed to discharge through a resistor, the voltage decreases 
              exponentially. After one time constant, the voltage drops to about 37% of its initial value. 
              After five time constants, the capacitor is considered practically discharged (less than 1% charge remaining).
            </Typography>
            <Typography variant="body2">
              RC circuits are widely used in timing applications, filters, and signal coupling/decoupling. 
              Understanding their behavior is essential for designing circuits with specific timing characteristics.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Resonance Calculator */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Resonance Calculator for RLC Circuits
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate resonant frequency, quality factor, and bandwidth for series RLC circuits.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Inputs */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Parameters
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Inductance (L)"
                        type="number"
                        value={resonanceValues.inductance}
                        onChange={(e) => handleResonanceChange('inductance', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.001,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Inductance in henries (H). Use scientific notation: 1e-3 for 1 mH">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Capacitance (C)"
                        type="number"
                        value={resonanceValues.capacitance}
                        onChange={(e) => handleResonanceChange('capacitance', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.0000001,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Capacitance in farads (F). Use scientific notation: 1e-7 for 0.1 µF">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Resistance (R)"
                        type="number"
                        value={resonanceValues.resistanceRLC}
                        onChange={(e) => handleResonanceChange('resistanceRLC', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 1,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Resistance in ohms (Ω)">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculateResonance}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetResonance}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom>
                Formulas:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                <Typography>Resonant Frequency: f = 1 / (2π√(LC))</Typography>
                <Typography>Angular Frequency: ω = 2πf</Typography>
                <Typography>Quality Factor: Q = (1/R) × √(L/C)</Typography>
                <Typography>Bandwidth: BW = f / Q</Typography>
                <Typography sx={{ mt: 1 }}>where:</Typography>
                <Typography sx={{ pl: 2 }}>f is the resonant frequency in hertz (Hz)</Typography>
                <Typography sx={{ pl: 2 }}>ω is the angular frequency in radians per second (rad/s)</Typography>
                <Typography sx={{ pl: 2 }}>Q is the quality factor (dimensionless)</Typography>
                <Typography sx={{ pl: 2 }}>BW is the bandwidth in hertz (Hz)</Typography>
              </Box>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(resonanceResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Resonant Frequency (f)</TableCell>
                          <TableCell align="right">{resonanceResults.resonantFreq} Hz</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Angular Frequency (ω)</TableCell>
                          <TableCell align="right">{resonanceResults.angularFreq} rad/s</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Impedance at Resonance</TableCell>
                          <TableCell align="right">{resonanceResults.impedanceAtResonance} Ω</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Quality Factor (Q)</TableCell>
                          <TableCell align="right">{resonanceResults.qualityFactor}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Bandwidth (BW)</TableCell>
                          <TableCell align="right">{resonanceResults.bandwidth} Hz</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Enter parameters and click Calculate to see results
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4 }}>
            <Typography variant="subtitle1" gutterBottom>
              Key Concepts:
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Resonance</strong> in RLC circuits occurs at a specific frequency where the inductive and 
              capacitive reactances are equal in magnitude but opposite in phase, resulting in a purely resistive 
              circuit impedance.
            </Typography>
            <Typography variant="body2" paragraph>
              At the <strong>resonant frequency</strong>, a series RLC circuit has minimum impedance (equal to the 
              resistance), resulting in maximum current flow. The <strong>quality factor (Q)</strong> indicates 
              how sharply the circuit resonates—higher Q values indicate sharper resonance peaks with narrower 
              bandwidths.
            </Typography>
            <Typography variant="body2">
              RLC resonant circuits are widely used in filters, oscillators, tuning circuits, and impedance matching 
              networks. Understanding resonance is crucial for designing frequency-selective circuits in communication 
              systems, radio receivers, and signal processing applications.
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default ElectricalCalculator;