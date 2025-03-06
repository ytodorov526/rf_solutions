import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Grid,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControl,
  InputLabel,
  Select,
  Tabs,
  Tab,
  Alert,
  CircularProgress
} from '@mui/material';
import CalculateIcon from '@mui/icons-material/Calculate';
import RefreshIcon from '@mui/icons-material/Refresh';

// Speed of light in m/s
const SPEED_OF_LIGHT = 299792458;

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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `calculator-tab-${index}`,
    'aria-controls': `calculator-tabpanel-${index}`,
  };
}

function RFCalculator() {
  const [tabValue, setTabValue] = useState(0);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState('');

  // Frequency to Wavelength Calculator
  const [freqValue, setFreqValue] = useState('');
  const [freqUnit, setFreqUnit] = useState('MHz');
  const [wavelength, setWavelength] = useState(null);

  // Path Loss Calculator
  const [distance, setDistance] = useState('');
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [frequency, setFrequency] = useState('');
  const [frequencyUnit, setFrequencyUnit] = useState('MHz');
  const [pathLoss, setPathLoss] = useState(null);

  // Antenna Gain Calculator
  const [diameter, setDiameter] = useState('');
  const [antennaFrequency, setAntennaFrequency] = useState('');
  const [antennaFreqUnit, setAntennaFreqUnit] = useState('GHz');
  const [efficiency, setEfficiency] = useState(0.55);
  const [antennaGain, setAntennaGain] = useState(null);
  
  // Link Budget Calculator
  const [txPower, setTxPower] = useState(30); // dBm
  const [txGain, setTxGain] = useState(12); // dBi
  const [rxGain, setRxGain] = useState(10); // dBi
  const [linkFrequency, setLinkFrequency] = useState(2.4); // GHz
  const [linkDistance, setLinkDistance] = useState(5); // km
  const [cableLoss, setCableLoss] = useState(2); // dB
  const [otherLosses, setOtherLosses] = useState(6); // dB
  const [sensitivity, setSensitivity] = useState(-90); // dBm
  const [linkBudget, setLinkBudget] = useState(null);
  const [linkMargin, setLinkMargin] = useState(null);
  const [receivedPower, setReceivedPower] = useState(null);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setError('');
    resetCurrentCalculator(newValue);
  };

  const resetCurrentCalculator = (calcIndex) => {
    switch(calcIndex) {
      case 0: // Frequency to Wavelength
        setFreqValue('');
        setFreqUnit('MHz');
        setWavelength(null);
        break;
      case 1: // Path Loss
        setDistance('');
        setDistanceUnit('km');
        setFrequency('');
        setFrequencyUnit('MHz');
        setPathLoss(null);
        break;
      case 2: // Antenna Gain
        setDiameter('');
        setAntennaFrequency('');
        setAntennaFreqUnit('GHz');
        setEfficiency(0.55);
        setAntennaGain(null);
        break;
      case 3: // Link Budget
        setLinkBudget(null);
        setLinkMargin(null);
        setReceivedPower(null);
        break;
      default:
        break;
    }
  };

  const calculateWavelength = () => {
    setError('');
    
    if (!freqValue || freqValue <= 0) {
      setError('Please enter a valid frequency value');
      return;
    }

    setCalculating(true);

    // Convert frequency to Hz based on selected unit
    let freqInHz = freqValue;
    switch(freqUnit) {
      case 'Hz':
        freqInHz = freqValue;
        break;
      case 'kHz':
        freqInHz = freqValue * 1000;
        break;
      case 'MHz':
        freqInHz = freqValue * 1000000;
        break;
      case 'GHz':
        freqInHz = freqValue * 1000000000;
        break;
      default:
        freqInHz = freqValue;
    }

    // Simulate calculation delay for more sophisticated feel
    setTimeout(() => {
      // λ = c/f
      const wavelengthInMeters = SPEED_OF_LIGHT / freqInHz;
      setWavelength(wavelengthInMeters);
      setCalculating(false);
    }, 500);
  };

  const calculatePathLoss = () => {
    setError('');
    
    if (!distance || distance <= 0 || !frequency || frequency <= 0) {
      setError('Please enter valid distance and frequency values');
      return;
    }

    setCalculating(true);

    // Convert distance to meters
    let distanceInMeters = distance;
    switch(distanceUnit) {
      case 'm':
        distanceInMeters = distance;
        break;
      case 'km':
        distanceInMeters = distance * 1000;
        break;
      case 'mi':
        distanceInMeters = distance * 1609.34;
        break;
      default:
        distanceInMeters = distance;
    }

    // Convert frequency to Hz
    let freqInHz = frequency;
    switch(frequencyUnit) {
      case 'Hz':
        freqInHz = frequency;
        break;
      case 'kHz':
        freqInHz = frequency * 1000;
        break;
      case 'MHz':
        freqInHz = frequency * 1000000;
        break;
      case 'GHz':
        freqInHz = frequency * 1000000000;
        break;
      default:
        freqInHz = frequency;
    }

    // Simulate calculation delay
    setTimeout(() => {
      // Free space path loss formula: FSPL(dB) = 20log10(d) + 20log10(f) + 20log10(4π/c)
      // Simplified: FSPL(dB) = 20log10(d) + 20log10(f) - 147.55
      const pathLossDb = 20 * Math.log10(distanceInMeters) + 20 * Math.log10(freqInHz) - 147.55;
      setPathLoss(pathLossDb);
      setCalculating(false);
    }, 500);
  };

  const calculateAntennaGain = () => {
    setError('');
    
    if (!diameter || diameter <= 0 || !antennaFrequency || antennaFrequency <= 0) {
      setError('Please enter valid diameter and frequency values');
      return;
    }

    setCalculating(true);

    // Convert frequency to Hz
    let freqInHz = antennaFrequency;
    switch(antennaFreqUnit) {
      case 'MHz':
        freqInHz = antennaFrequency * 1000000;
        break;
      case 'GHz':
        freqInHz = antennaFrequency * 1000000000;
        break;
      default:
        freqInHz = antennaFrequency;
    }

    // Simulate calculation delay
    setTimeout(() => {
      // Antenna gain formula: G = η(πD/λ)² = η(πDf/c)²
      const wavelength = SPEED_OF_LIGHT / freqInHz;
      const gain = efficiency * Math.pow((Math.PI * diameter) / wavelength, 2);
      const gainInDbI = 10 * Math.log10(gain);
      setAntennaGain(gainInDbI);
      setCalculating(false);
    }, 500);
  };
  
  const calculateLinkBudget = () => {
    setError('');
    
    if (linkFrequency <= 0 || linkDistance <= 0) {
      setError('Please enter valid frequency and distance values');
      return;
    }

    setCalculating(true);

    // Simulate calculation delay
    setTimeout(() => {
      // Free space path loss calculation in dB
      // FSPL (dB) = 20log10(d) + 20log10(f) + 20log10(4π/c)
      // Simplified for distance in km and frequency in GHz
      const pathLossDb = 20 * Math.log10(linkDistance) + 20 * Math.log10(linkFrequency) + 92.45;
      
      // Link budget calculation
      const budget = txPower + txGain + rxGain - pathLossDb - cableLoss - otherLosses;
      setLinkBudget(budget);
      
      // Calculate received power
      const rxPower = txPower + txGain + rxGain - pathLossDb - cableLoss - otherLosses;
      setReceivedPower(rxPower);
      
      // Link margin
      const margin = rxPower - sensitivity;
      setLinkMargin(margin);
      
      setCalculating(false);
    }, 500);
  };

  return (
    <Paper elevation={3} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
        <Typography variant="h5" component="h3" align="center">
          RF Engineering Calculator
        </Typography>
      </Box>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange} 
          aria-label="calculator tabs"
          variant="fullWidth"
        >
          <Tab label="Wavelength" {...a11yProps(0)} />
          <Tab label="Path Loss" {...a11yProps(1)} />
          <Tab label="Antenna Gain" {...a11yProps(2)} />
          <Tab label="Link Budget" {...a11yProps(3)} />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ m: 2 }}>{error}</Alert>
      )}

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Frequency"
              type="number"
              fullWidth
              value={freqValue}
              onChange={(e) => setFreqValue(parseFloat(e.target.value))}
              placeholder="Enter frequency"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select
                value={freqUnit}
                label="Unit"
                onChange={(e) => setFreqUnit(e.target.value)}
              >
                <MenuItem value="Hz">Hz</MenuItem>
                <MenuItem value="kHz">kHz</MenuItem>
                <MenuItem value="MHz">MHz</MenuItem>
                <MenuItem value="GHz">GHz</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CalculateIcon />}
                onClick={calculateWavelength}
                disabled={calculating}
                sx={{ mr: 1 }}
              >
                Calculate
              </Button>
              <Button 
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => resetCurrentCalculator(0)}
                disabled={calculating}
              >
                Reset
              </Button>
            </Box>
          </Grid>
          
          {calculating ? (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress size={30} />
            </Grid>
          ) : wavelength !== null && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider>
                  <Typography variant="subtitle2" color="textSecondary">Results</Typography>
                </Divider>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Wavelength (m)</TableCell>
                      <TableCell align="right">{wavelength.toFixed(6)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Wavelength (cm)</TableCell>
                      <TableCell align="right">{(wavelength * 100).toFixed(6)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Wavelength (mm)</TableCell>
                      <TableCell align="right">{(wavelength * 1000).toFixed(6)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Distance"
              type="number"
              fullWidth
              value={distance}
              onChange={(e) => setDistance(parseFloat(e.target.value))}
              placeholder="Enter distance"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Distance Unit</InputLabel>
              <Select
                value={distanceUnit}
                label="Distance Unit"
                onChange={(e) => setDistanceUnit(e.target.value)}
              >
                <MenuItem value="m">meters (m)</MenuItem>
                <MenuItem value="km">kilometers (km)</MenuItem>
                <MenuItem value="mi">miles (mi)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Frequency"
              type="number"
              fullWidth
              value={frequency}
              onChange={(e) => setFrequency(parseFloat(e.target.value))}
              placeholder="Enter frequency"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequency Unit</InputLabel>
              <Select
                value={frequencyUnit}
                label="Frequency Unit"
                onChange={(e) => setFrequencyUnit(e.target.value)}
              >
                <MenuItem value="kHz">kHz</MenuItem>
                <MenuItem value="MHz">MHz</MenuItem>
                <MenuItem value="GHz">GHz</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CalculateIcon />}
                onClick={calculatePathLoss}
                disabled={calculating}
                sx={{ mr: 1 }}
              >
                Calculate
              </Button>
              <Button 
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => resetCurrentCalculator(1)}
                disabled={calculating}
              >
                Reset
              </Button>
            </Box>
          </Grid>
          
          {calculating ? (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress size={30} />
            </Grid>
          ) : pathLoss !== null && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider>
                  <Typography variant="subtitle2" color="textSecondary">Results</Typography>
                </Divider>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Free Space Path Loss</TableCell>
                      <TableCell align="right">{pathLoss.toFixed(2)} dB</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Signal Attenuation Factor</TableCell>
                      <TableCell align="right">{Math.pow(10, pathLoss/10).toExponential(4)}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mt: 1 }}>
                *Based on free space path loss model without considering atmospheric absorption, terrain, or obstacles.
              </Typography>
            </Grid>
          )}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Antenna Diameter"
              type="number"
              fullWidth
              value={diameter}
              onChange={(e) => setDiameter(parseFloat(e.target.value))}
              placeholder="Enter diameter in meters"
              InputProps={{ inputProps: { min: 0 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Diameter in meters
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Frequency"
              type="number"
              fullWidth
              value={antennaFrequency}
              onChange={(e) => setAntennaFrequency(parseFloat(e.target.value))}
              placeholder="Enter frequency"
              InputProps={{ inputProps: { min: 0 } }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Frequency Unit</InputLabel>
              <Select
                value={antennaFreqUnit}
                label="Frequency Unit"
                onChange={(e) => setAntennaFreqUnit(e.target.value)}
              >
                <MenuItem value="MHz">MHz</MenuItem>
                <MenuItem value="GHz">GHz</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Aperture Efficiency"
              type="number"
              fullWidth
              value={efficiency}
              onChange={(e) => setEfficiency(parseFloat(e.target.value))}
              placeholder="Enter efficiency (0.0-1.0)"
              InputProps={{ inputProps: { min: 0, max: 1, step: 0.01 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Typical values: 0.55-0.70 for parabolic antennas
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CalculateIcon />}
                onClick={calculateAntennaGain}
                disabled={calculating}
                sx={{ mr: 1 }}
              >
                Calculate
              </Button>
              <Button 
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => resetCurrentCalculator(2)}
                disabled={calculating}
              >
                Reset
              </Button>
            </Box>
          </Grid>
          
          {calculating ? (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress size={30} />
            </Grid>
          ) : antennaGain !== null && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider>
                  <Typography variant="subtitle2" color="textSecondary">Results</Typography>
                </Divider>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Antenna Gain</TableCell>
                      <TableCell align="right">{antennaGain.toFixed(2)} dBi</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Linear Gain (dimensionless)</TableCell>
                      <TableCell align="right">{Math.pow(10, antennaGain/10).toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Effective Aperture</TableCell>
                      <TableCell align="right">{(efficiency * Math.PI * Math.pow(diameter/2, 2)).toFixed(2)} m²</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          )}
        </Grid>
      </TabPanel>
      
      {/* Link Budget Calculator */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Transmit Power (dBm)"
              type="number"
              fullWidth
              value={txPower}
              onChange={(e) => setTxPower(parseFloat(e.target.value))}
              InputProps={{ inputProps: { step: 0.1 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Typical range: 10-50 dBm
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Transmit Antenna Gain (dBi)"
              type="number"
              fullWidth
              value={txGain}
              onChange={(e) => setTxGain(parseFloat(e.target.value))}
              InputProps={{ inputProps: { step: 0.1 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Typically: 2-30 dBi
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Receive Antenna Gain (dBi)"
              type="number"
              fullWidth
              value={rxGain}
              onChange={(e) => setRxGain(parseFloat(e.target.value))}
              InputProps={{ inputProps: { step: 0.1 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Typically: 2-30 dBi
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Frequency (GHz)"
              type="number"
              fullWidth
              value={linkFrequency}
              onChange={(e) => setLinkFrequency(parseFloat(e.target.value))}
              InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Distance (km)"
              type="number"
              fullWidth
              value={linkDistance}
              onChange={(e) => setLinkDistance(parseFloat(e.target.value))}
              InputProps={{ inputProps: { min: 0.1, step: 0.1 } }}
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Cable/Connector Losses (dB)"
              type="number"
              fullWidth
              value={cableLoss}
              onChange={(e) => setCableLoss(parseFloat(e.target.value))}
              InputProps={{ inputProps: { min: 0, step: 0.1 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Total at both TX and RX ends
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              label="Other Losses (dB)"
              type="number"
              fullWidth
              value={otherLosses}
              onChange={(e) => setOtherLosses(parseFloat(e.target.value))}
              InputProps={{ inputProps: { min: 0, step: 0.1 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Atmosphere, rain, obstacles, polarization mismatch, etc.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={6}>
            <TextField
              label="Receiver Sensitivity (dBm)"
              type="number"
              fullWidth
              value={sensitivity}
              onChange={(e) => setSensitivity(parseFloat(e.target.value))}
              InputProps={{ inputProps: { step: 0.1 } }}
            />
            <Typography variant="caption" color="textSecondary">
              Typically: -80 to -110 dBm
            </Typography>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button 
                variant="contained" 
                color="primary"
                startIcon={<CalculateIcon />}
                onClick={calculateLinkBudget}
                disabled={calculating}
                sx={{ mr: 1 }}
              >
                Calculate Link Budget
              </Button>
              <Button 
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => resetCurrentCalculator(3)}
                disabled={calculating}
              >
                Reset
              </Button>
            </Box>
          </Grid>
          
          {calculating ? (
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <CircularProgress size={30} />
            </Grid>
          ) : linkBudget !== null && (
            <Grid item xs={12}>
              <Box sx={{ mt: 3, mb: 2 }}>
                <Divider>
                  <Typography variant="subtitle2" color="textSecondary">Link Budget Analysis</Typography>
                </Divider>
              </Box>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter</TableCell>
                      <TableCell align="right">Value</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Free Space Path Loss</TableCell>
                      <TableCell align="right">{(20 * Math.log10(linkDistance) + 20 * Math.log10(linkFrequency) + 92.45).toFixed(2)} dB</TableCell>
                      <TableCell>Loss due to signal propagation through free space</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>System Gain</TableCell>
                      <TableCell align="right">{(txPower + txGain + rxGain).toFixed(2)} dB</TableCell>
                      <TableCell>Combined gain of transmitter power and antennas</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>System Losses</TableCell>
                      <TableCell align="right">{(cableLoss + otherLosses).toFixed(2)} dB</TableCell>
                      <TableCell>Combined losses in the system</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Received Power</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          fontWeight: 'bold',
                          color: receivedPower > sensitivity ? 'success.main' : 'error.main'
                        }}
                      >
                        {receivedPower.toFixed(2)} dBm
                      </TableCell>
                      <TableCell>Expected power at the receiver</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" sx={{ fontWeight: 'bold' }}>Link Margin</TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          fontWeight: 'bold',
                          color: linkMargin > 10 ? 'success.main' : 
                                 linkMargin > 5 ? 'warning.main' : 'error.main'
                        }}
                      >
                        {linkMargin.toFixed(2)} dB
                      </TableCell>
                      <TableCell>
                        {linkMargin > 10 ? 'Excellent link quality' : 
                         linkMargin > 5 ? 'Good link quality, but vulnerable to fading' : 
                         linkMargin > 0 ? 'Poor link quality, likely unreliable' : 
                         'Link will not work, signal below sensitivity threshold'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                <Typography variant="subtitle2" gutterBottom>Link Assessment:</Typography>
                <Typography variant="body2">
                  {linkMargin > 20 ? 
                    'This link has an excellent margin and should be very reliable in all conditions.' : 
                   linkMargin > 10 ? 
                    'This link has a good margin and should be reliable in most conditions.' : 
                   linkMargin > 5 ? 
                    'This link has a moderate margin and may experience interruptions during adverse weather or interference.' : 
                   linkMargin > 0 ? 
                    'This link has a very small margin and will likely be unreliable. Consider using higher-gain antennas or reducing distance.' : 
                    'This link will not work as the received signal is below the receiver sensitivity. Significant improvements are needed.'}
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </TabPanel>
    </Paper>
  );
}

export default RFCalculator;