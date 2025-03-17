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
      id={`power-tabpanel-${index}`}
      aria-labelledby={`power-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `power-tab-${index}`,
    'aria-controls': `power-tabpanel-${index}`,
  };
}

// Default calculator values
const defaultValues = {
  powerTransfer: {
    voltage: 230,
    current: 10,
    powerFactor: 0.8,
    distance: 1000,
    wireGauge: 10,
    wireMaterial: 'copper',
  },
  transformer: {
    primaryVoltage: 480,
    secondaryVoltage: 120,
    primaryTurns: 400,
    secondaryTurns: 100,
    frequency: 60,
    power: 5000,
  },
  threephase: {
    lineVoltage: 480,
    lineCurrent: 10,
    powerFactor: 0.85,
    connection: 'wye',
  }
};

// Material resistivities in Ω.m
const materialResistivity = {
  copper: 1.68e-8,
  aluminum: 2.82e-8,
  steel: 1.43e-7,
  gold: 2.44e-8,
  silver: 1.59e-8,
};

// AWG wire gauge to diameter mapping (in mm)
const wireGaugeDiameter = {
  0: 8.252,
  2: 6.544,
  4: 5.189,
  6: 4.115,
  8: 3.264,
  10: 2.588,
  12: 2.053,
  14: 1.628,
  16: 1.291,
  18: 1.024,
  20: 0.812,
  22: 0.644,
};

function PowerSystemsCalculator() {
  // State for the active calculator tab
  const [activeTab, setActiveTab] = useState(0);
  
  // State for calculator inputs
  const [powerTransferValues, setPowerTransferValues] = useState(defaultValues.powerTransfer);
  const [transformerValues, setTransformerValues] = useState(defaultValues.transformer);
  const [threephaseValues, setThreephaseValues] = useState(defaultValues.threephase);
  
  // State for calculated results
  const [powerTransferResults, setPowerTransferResults] = useState({});
  const [transformerResults, setTransformerResults] = useState({});
  const [threephaseResults, setThreephaseResults] = useState({});
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle calculator input changes
  const handlePowerTransferChange = (field, value) => {
    setPowerTransferValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleTransformerChange = (field, value) => {
    setTransformerValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleThreePhaseChange = (field, value) => {
    setThreephaseValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  // Calculator functions
  const calculatePowerTransfer = () => {
    const { voltage, current, powerFactor, distance, wireGauge, wireMaterial } = powerTransferValues;
    
    // Calculate apparent power
    const apparentPower = voltage * current;
    
    // Calculate active (real) power
    const activePower = apparentPower * powerFactor;
    
    // Calculate reactive power
    const reactivePower = apparentPower * Math.sin(Math.acos(powerFactor));
    
    // Calculate wire resistance
    const wireRadius = wireGaugeDiameter[wireGauge] / 2 / 1000; // radius in meters
    const wireArea = Math.PI * wireRadius * wireRadius; // area in m²
    const wireResistance = materialResistivity[wireMaterial] * distance / wireArea; // in Ω
    
    // Calculate voltage drop
    const voltageDrop = current * wireResistance;
    const voltageDropPercent = (voltageDrop / voltage) * 100;
    
    // Calculate power loss in the line
    const powerLoss = current * current * wireResistance;
    const powerLossPercent = (powerLoss / activePower) * 100;
    
    // Calculate efficiency
    const efficiency = ((activePower - powerLoss) / activePower) * 100;
    
    setPowerTransferResults({
      apparentPower: apparentPower.toFixed(2),
      activePower: activePower.toFixed(2),
      reactivePower: reactivePower.toFixed(2),
      wireResistance: wireResistance.toFixed(4),
      voltageDrop: voltageDrop.toFixed(2),
      voltageDropPercent: voltageDropPercent.toFixed(2),
      powerLoss: powerLoss.toFixed(2),
      powerLossPercent: powerLossPercent.toFixed(2),
      efficiency: efficiency.toFixed(2),
    });
  };
  
  const calculateTransformer = () => {
    const { primaryVoltage, secondaryVoltage, primaryTurns, secondaryTurns, frequency, power } = transformerValues;
    
    // Calculate turns ratio
    const turnsRatio = primaryTurns / secondaryTurns;
    
    // Calculate currents
    const primaryCurrent = power / primaryVoltage;
    const secondaryCurrent = power / secondaryVoltage;
    
    // Calculate impedance ratio
    const impedanceRatio = (primaryTurns / secondaryTurns) ** 2;
    
    // Calculate core cross-sectional area (simplified approach)
    // Using a typical value of 1.2 T for flux density
    const coreArea = (primaryVoltage / (4.44 * frequency * primaryTurns * 1.2)) * Math.pow(10, 4); // in cm²
    
    // Calculate efficiency (assuming 98% efficiency for simplicity)
    const efficiency = 98;
    const losses = power * (1 - efficiency / 100);
    
    setTransformerResults({
      turnsRatio: turnsRatio.toFixed(3),
      voltageRatio: (primaryVoltage / secondaryVoltage).toFixed(3),
      primaryCurrent: primaryCurrent.toFixed(2),
      secondaryCurrent: secondaryCurrent.toFixed(2),
      impedanceRatio: impedanceRatio.toFixed(2),
      coreArea: coreArea.toFixed(2),
      efficiency: efficiency.toFixed(2),
      losses: losses.toFixed(2),
    });
  };
  
  const calculateThreePhase = () => {
    const { lineVoltage, lineCurrent, powerFactor, connection } = threephaseValues;
    
    // Calculate phase voltage and current based on connection
    let phaseVoltage, phaseCurrent;
    
    if (connection === 'wye') {
      phaseVoltage = lineVoltage / Math.sqrt(3);
      phaseCurrent = lineCurrent;
    } else { // delta
      phaseVoltage = lineVoltage;
      phaseCurrent = lineCurrent / Math.sqrt(3);
    }
    
    // Calculate powers
    const apparentPowerPerPhase = phaseVoltage * phaseCurrent;
    const totalApparentPower = 3 * apparentPowerPerPhase;
    
    const activePowerPerPhase = apparentPowerPerPhase * powerFactor;
    const totalActivePower = 3 * activePowerPerPhase;
    
    const reactivePowerPerPhase = apparentPowerPerPhase * Math.sin(Math.acos(powerFactor));
    const totalReactivePower = 3 * reactivePowerPerPhase;
    
    setThreephaseResults({
      phaseVoltage: phaseVoltage.toFixed(2),
      phaseCurrent: phaseCurrent.toFixed(2),
      apparentPowerPerPhase: apparentPowerPerPhase.toFixed(2),
      activePowerPerPhase: activePowerPerPhase.toFixed(2),
      reactivePowerPerPhase: reactivePowerPerPhase.toFixed(2),
      totalApparentPower: totalApparentPower.toFixed(2),
      totalActivePower: totalActivePower.toFixed(2),
      totalReactivePower: totalReactivePower.toFixed(2),
    });
  };
  
  // Reset calculators
  const resetPowerTransfer = () => {
    setPowerTransferValues(defaultValues.powerTransfer);
    setPowerTransferResults({});
  };
  
  const resetTransformer = () => {
    setTransformerValues(defaultValues.transformer);
    setTransformerResults({});
  };
  
  const resetThreePhase = () => {
    setThreephaseValues(defaultValues.threephase);
    setThreephaseResults({});
  };
  
  return (
    <Box id="power-systems-calculator">
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Power Systems Calculator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Interactive tools for calculating and analyzing electrical power systems, including power transmission, transformers, and three-phase circuits.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Calculator Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="power systems calculator tabs"
          >
            <Tab label="Power Transmission" {...a11yProps(0)} />
            <Tab label="Transformer Analysis" {...a11yProps(1)} />
            <Tab label="Three-Phase Systems" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        {/* Power Transmission Calculator */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Power Transmission Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate power transmission parameters including voltage drop, power losses, and efficiency.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Inputs */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Parameters
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Voltage (V)"
                      type="number"
                      value={powerTransferValues.voltage}
                      onChange={(e) => handlePowerTransferChange('voltage', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">V</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Current (A)"
                      type="number"
                      value={powerTransferValues.current}
                      onChange={(e) => handlePowerTransferChange('current', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">A</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Power Factor"
                      type="number"
                      value={powerTransferValues.powerFactor}
                      onChange={(e) => handlePowerTransferChange('powerFactor', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      inputProps={{
                        min: 0,
                        max: 1,
                        step: 0.01,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Distance"
                      type="number"
                      value={powerTransferValues.distance}
                      onChange={(e) => handlePowerTransferChange('distance', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">m</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="wire-gauge-label">Wire Gauge (AWG)</InputLabel>
                      <Select
                        labelId="wire-gauge-label"
                        value={powerTransferValues.wireGauge}
                        label="Wire Gauge (AWG)"
                        onChange={(e) => handlePowerTransferChange('wireGauge', parseInt(e.target.value))}
                      >
                        {Object.keys(wireGaugeDiameter).map((gauge) => (
                          <MenuItem key={gauge} value={parseInt(gauge)}>
                            {gauge} AWG ({wireGaugeDiameter[gauge]} mm)
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="wire-material-label">Wire Material</InputLabel>
                      <Select
                        labelId="wire-material-label"
                        value={powerTransferValues.wireMaterial}
                        label="Wire Material"
                        onChange={(e) => handlePowerTransferChange('wireMaterial', e.target.value)}
                      >
                        <MenuItem value="copper">Copper</MenuItem>
                        <MenuItem value="aluminum">Aluminum</MenuItem>
                        <MenuItem value="steel">Steel</MenuItem>
                        <MenuItem value="gold">Gold</MenuItem>
                        <MenuItem value="silver">Silver</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculatePowerTransfer}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetPowerTransfer}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(powerTransferResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Apparent Power</TableCell>
                          <TableCell align="right">{powerTransferResults.apparentPower} VA</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Active Power</TableCell>
                          <TableCell align="right">{powerTransferResults.activePower} W</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Reactive Power</TableCell>
                          <TableCell align="right">{powerTransferResults.reactivePower} VAR</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Wire Resistance</TableCell>
                          <TableCell align="right">{powerTransferResults.wireResistance} Ω</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Voltage Drop</TableCell>
                          <TableCell align="right">{powerTransferResults.voltageDrop} V ({powerTransferResults.voltageDropPercent}%)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Power Loss</TableCell>
                          <TableCell align="right">{powerTransferResults.powerLoss} W ({powerTransferResults.powerLossPercent}%)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Transmission Efficiency</TableCell>
                          <TableCell align="right">{powerTransferResults.efficiency}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <strong>Power Transmission</strong> involves the transfer of electrical energy from generation sites to distribution networks. 
              The efficiency of this process is affected by factors such as wire resistance, distance, and voltage levels.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Voltage Drop</strong> occurs as current flows through transmission lines due to wire resistance. 
              Higher transmission voltages reduce current and thus minimize voltage drop and power losses.
            </Typography>
            <Typography variant="body2">
              <strong>Power Factor</strong> is the ratio of real power to apparent power, indicating how effectively electrical power is being used. 
              A higher power factor (closer to 1.0) indicates more efficient power transmission.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Transformer Analysis Tab */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Transformer Analysis Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate transformer parameters including turns ratio, currents, and core specifications.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Inputs */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Parameters
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Primary Voltage"
                      type="number"
                      value={transformerValues.primaryVoltage}
                      onChange={(e) => handleTransformerChange('primaryVoltage', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">V</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Secondary Voltage"
                      type="number"
                      value={transformerValues.secondaryVoltage}
                      onChange={(e) => handleTransformerChange('secondaryVoltage', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">V</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Primary Turns"
                      type="number"
                      value={transformerValues.primaryTurns}
                      onChange={(e) => handleTransformerChange('primaryTurns', parseInt(e.target.value))}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Secondary Turns"
                      type="number"
                      value={transformerValues.secondaryTurns}
                      onChange={(e) => handleTransformerChange('secondaryTurns', parseInt(e.target.value))}
                      fullWidth
                      margin="normal"
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Frequency"
                      type="number"
                      value={transformerValues.frequency}
                      onChange={(e) => handleTransformerChange('frequency', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">Hz</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Power Rating"
                      type="number"
                      value={transformerValues.power}
                      onChange={(e) => handleTransformerChange('power', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">VA</Typography>,
                      }}
                    />
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculateTransformer}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetTransformer}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(transformerResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Turns Ratio (N₁:N₂)</TableCell>
                          <TableCell align="right">{transformerResults.turnsRatio}:1</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Voltage Ratio (V₁:V₂)</TableCell>
                          <TableCell align="right">{transformerResults.voltageRatio}:1</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Primary Current</TableCell>
                          <TableCell align="right">{transformerResults.primaryCurrent} A</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Secondary Current</TableCell>
                          <TableCell align="right">{transformerResults.secondaryCurrent} A</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Impedance Ratio (Z₁:Z₂)</TableCell>
                          <TableCell align="right">{transformerResults.impedanceRatio}:1</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Core Cross-sectional Area</TableCell>
                          <TableCell align="right">{transformerResults.coreArea} cm²</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Efficiency (estimated)</TableCell>
                          <TableCell align="right">{transformerResults.efficiency}%</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Power Losses</TableCell>
                          <TableCell align="right">{transformerResults.losses} W</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <strong>Transformers</strong> are electrical devices that transfer energy between circuits through electromagnetic induction. 
              They are crucial for voltage conversion in power transmission and distribution systems.
            </Typography>
            <Typography variant="body2" paragraph>
              The <strong>turns ratio</strong> (primary to secondary windings) determines the voltage transformation ratio. 
              According to Faraday's law, this relationship is: V₁/V₂ = N₁/N₂, where V is voltage and N is the number of turns.
            </Typography>
            <Typography variant="body2">
              <strong>Current</strong> in the windings is inversely proportional to the voltage: I₁/I₂ = V₂/V₁. 
              This maintains power balance across the transformer (ignoring losses), where P₁ = P₂, or V₁I₁ = V₂I₂.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Three-Phase Systems Tab */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Three-Phase System Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate parameters for three-phase power systems, including power calculations for wye and delta connections.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Inputs */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Input Parameters
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Line Voltage"
                      type="number"
                      value={threephaseValues.lineVoltage}
                      onChange={(e) => handleThreePhaseChange('lineVoltage', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">V</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Line Current"
                      type="number"
                      value={threephaseValues.lineCurrent}
                      onChange={(e) => handleThreePhaseChange('lineCurrent', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      InputProps={{
                        endAdornment: <Typography variant="body2">A</Typography>,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Power Factor"
                      type="number"
                      value={threephaseValues.powerFactor}
                      onChange={(e) => handleThreePhaseChange('powerFactor', parseFloat(e.target.value))}
                      fullWidth
                      margin="normal"
                      inputProps={{
                        min: 0,
                        max: 1,
                        step: 0.01,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth margin="normal">
                      <InputLabel id="connection-type-label">Connection Type</InputLabel>
                      <Select
                        labelId="connection-type-label"
                        value={threephaseValues.connection}
                        label="Connection Type"
                        onChange={(e) => handleThreePhaseChange('connection', e.target.value)}
                      >
                        <MenuItem value="wye">Wye (Y)</MenuItem>
                        <MenuItem value="delta">Delta (Δ)</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculateThreePhase}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetThreePhase}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Box sx={{ mt: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Connection Diagram:
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  {threephaseValues.connection === 'wye' ? (
                    <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/3-phase_flow.svg/440px-3-phase_flow.svg.png" alt="Wye connection" sx={{ maxWidth: '100%', height: 150 }} />
                  ) : (
                    <Box component="img" src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/3-phase_delta.svg/440px-3-phase_delta.svg.png" alt="Delta connection" sx={{ maxWidth: '100%', height: 150 }} />
                  )}
                </Box>
              </Box>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(threephaseResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Parameter</TableCell>
                          <TableCell align="right">Per Phase</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Voltage</TableCell>
                          <TableCell align="right">{threephaseResults.phaseVoltage} V</TableCell>
                          <TableCell align="right">{threephaseValues.lineVoltage} V (line)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Current</TableCell>
                          <TableCell align="right">{threephaseResults.phaseCurrent} A</TableCell>
                          <TableCell align="right">{threephaseValues.lineCurrent} A (line)</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Apparent Power (S)</TableCell>
                          <TableCell align="right">{threephaseResults.apparentPowerPerPhase} VA</TableCell>
                          <TableCell align="right">{threephaseResults.totalApparentPower} VA</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Active Power (P)</TableCell>
                          <TableCell align="right">{threephaseResults.activePowerPerPhase} W</TableCell>
                          <TableCell align="right">{threephaseResults.totalActivePower} W</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Reactive Power (Q)</TableCell>
                          <TableCell align="right">{threephaseResults.reactivePowerPerPhase} VAR</TableCell>
                          <TableCell align="right">{threephaseResults.totalReactivePower} VAR</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
              <strong>Three-phase power</strong> systems use three alternating currents of the same frequency, offset by 120° phase angles. 
              They are widely used in power generation, transmission, and industrial applications due to their efficiency advantages.
            </Typography>
            <Typography variant="body2" paragraph>
              In a <strong>wye (Y) connection</strong>, the line voltage is √3 times the phase voltage (V<sub>L</sub> = √3 × V<sub>P</sub>), 
              while the line current equals the phase current (I<sub>L</sub> = I<sub>P</sub>).
            </Typography>
            <Typography variant="body2">
              In a <strong>delta (Δ) connection</strong>, the line voltage equals the phase voltage (V<sub>L</sub> = V<sub>P</sub>), 
              while the line current is √3 times the phase current (I<sub>L</sub> = √3 × I<sub>P</sub>).
            </Typography>
          </Box>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default PowerSystemsCalculator;