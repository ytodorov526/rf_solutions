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
  reactivity: {
    k: 1.0,
    beta: 0.0065,
  },
  criticality: {
    enrichment: 3.5,
    moderatorRatio: 2.0,
    geometryFactor: 0.85,
  },
  decay: {
    initialPower: 3000,
    operatingTime: 365,
    coolingTime: 30,
  },
  conversion: {
    value: 1.0,
    fromUnit: 'rem',
    toUnit: 'sievert',
  }
};

// Conversion factors for radiation units
const radiationConversions = {
  activity: {
    becquerel: { becquerel: 1, curie: 2.7e-11 },
    curie: { becquerel: 3.7e10, curie: 1 },
  },
  dose: {
    gray: { gray: 1, rad: 100 },
    rad: { gray: 0.01, rad: 1 },
  },
  doseEquivalent: {
    sievert: { sievert: 1, rem: 100 },
    rem: { sievert: 0.01, rem: 1 },
  },
};

function NuclearCalculator() {
  // State for the active calculator tab
  const [activeTab, setActiveTab] = useState(0);
  
  // State for calculator inputs
  const [reactivityValues, setReactivityValues] = useState(defaultValues.reactivity);
  const [criticalityValues, setCriticalityValues] = useState(defaultValues.criticality);
  const [decayValues, setDecayValues] = useState(defaultValues.decay);
  const [conversionValues, setConversionValues] = useState(defaultValues.conversion);
  
  // State for calculated results
  const [reactivityResults, setReactivityResults] = useState({});
  const [criticalityResults, setCriticalityResults] = useState({});
  const [decayResults, setDecayResults] = useState({});
  const [conversionResult, setConversionResult] = useState(null);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle calculator input changes
  const handleReactivityChange = (field, value) => {
    setReactivityValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleCriticalityChange = (field, value) => {
    setCriticalityValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleDecayChange = (field, value) => {
    setDecayValues(prev => ({
      ...prev,
      [field]: value,
    }));
  };
  
  const handleConversionChange = (field, value) => {
    setConversionValues(prev => ({
      ...prev,
      [field]: value,
    }));
    
    // Auto-calculate for conversions
    if (field === 'value' || field === 'fromUnit' || field === 'toUnit') {
      calculateConversion();
    }
  };
  
  // Calculator functions
  const calculateReactivity = () => {
    const k = reactivityValues.k;
    const beta = reactivityValues.beta;
    
    // Calculate reactivity (ρ)
    const reactivity = (k - 1) / k;
    
    // Calculate reactivity in dollars
    const reactivityDollars = reactivity / beta;
    
    // Calculate reactor period (assuming prompt jump approximation for simplicity)
    // T = (β - ρ) / (λ * ρ) for ρ < β, where λ is the average delayed neutron precursor decay constant
    const lambda = 0.1; // 1/s, approximate value
    let period;
    
    if (reactivity > 0 && reactivity < beta) {
      period = (beta - reactivity) / (lambda * reactivity);
    } else if (reactivity > beta) {
      // Prompt critical - using prompt neutron lifetime
      const promptNeutronLifetime = 1e-4; // seconds
      period = promptNeutronLifetime / (reactivity - beta);
    } else if (reactivity < 0) {
      // Subcritical
      period = beta / (lambda * Math.abs(reactivity));
      period = -period; // Negative period for power decrease
    } else {
      // Critical
      period = Infinity;
    }
    
    setReactivityResults({
      reactivity: reactivity.toExponential(5),
      reactivityPCM: (reactivity * 1e5).toFixed(2),
      reactivityDollars: reactivityDollars.toFixed(5),
      period: period === Infinity ? '∞' : Math.abs(period) < 1e-2 ? period.toExponential(3) : period.toFixed(3),
      status: 
        reactivity > beta ? 'Prompt Supercritical (Unsafe)' :
        reactivity > 0 ? 'Delayed Supercritical' :
        reactivity < 0 ? 'Subcritical' : 'Critical',
    });
  };
  
  const calculateCriticality = () => {
    const { enrichment, moderatorRatio, geometryFactor } = criticalityValues;
    
    // This is a simplified model - in a real calculator, 
    // these would be based on more complex neutronics calculations
    
    // Simplified estimation of infinite multiplication factor (k-infinity)
    const kInfinity = 1.0 + (0.1 * Math.log(enrichment)) + 
                     (0.05 * Math.log(moderatorRatio)) - 
                     (Math.pow(moderatorRatio - 2.0, 2) / 20);
    
    // Effective multiplication factor accounting for geometric leakage
    const kEffective = kInfinity * geometryFactor;
    
    // Calculate critical mass (simplified relationship)
    const criticalMass = (30 / Math.pow(enrichment / 3, 1.5)) * 
                        (1 / Math.pow(geometryFactor, 2));
    
    // Calculate buckling (simplified)
    const buckling = (1 - geometryFactor) * 10;
    
    setCriticalityResults({
      kInfinity: kInfinity.toFixed(5),
      kEffective: kEffective.toFixed(5),
      criticalMass: criticalMass.toFixed(1),
      buckling: buckling.toExponential(3),
      status: 
        kEffective > 1.05 ? 'Highly Supercritical' :
        kEffective > 1.0 ? 'Supercritical' :
        kEffective > 0.98 ? 'Near Critical' :
        kEffective > 0.9 ? 'Subcritical' : 'Deeply Subcritical',
    });
  };
  
  const calculateDecay = () => {
    const { initialPower, operatingTime, coolingTime } = decayValues;
    
    // Way-Wigner formula for decay heat: P(t) = P₀ × 0.066 × [t^(-0.2) - (t + T)^(-0.2)]
    // where P₀ is initial power, t is cooling time, T is operating time
    
    // Convert days to seconds
    const T = operatingTime * 24 * 3600;
    const t = coolingTime * 24 * 3600;
    
    // Calculate decay heat fraction
    const decayHeatFraction = 0.066 * (Math.pow(t, -0.2) - Math.pow(t + T, -0.2));
    
    // Calculate decay heat power
    const decayHeatPower = initialPower * decayHeatFraction;
    
    // Calculate for several time points
    const timePoints = [1, 7, 30, 90, 180, 365];
    const heatCurve = timePoints.map(days => {
      const timeInSeconds = days * 24 * 3600;
      const fraction = 0.066 * (Math.pow(timeInSeconds, -0.2) - Math.pow(timeInSeconds + T, -0.2));
      return {
        time: days,
        fraction: fraction,
        power: initialPower * fraction
      };
    });
    
    setDecayResults({
      decayHeatFraction: decayHeatFraction.toExponential(5),
      decayHeatPower: decayHeatPower.toFixed(3),
      decayHeatPercent: (decayHeatFraction * 100).toFixed(4),
      heatCurve: heatCurve,
    });
  };
  
  const calculateConversion = () => {
    const { value, fromUnit, toUnit } = conversionValues;
    
    // Determine conversion category
    let category;
    if (['becquerel', 'curie'].includes(fromUnit)) {
      category = 'activity';
    } else if (['gray', 'rad'].includes(fromUnit)) {
      category = 'dose';
    } else if (['sievert', 'rem'].includes(fromUnit)) {
      category = 'doseEquivalent';
    }
    
    // Calculate conversion
    if (category && radiationConversions[category][fromUnit][toUnit]) {
      const factor = radiationConversions[category][fromUnit][toUnit];
      const result = value * factor;
      
      setConversionResult({
        value: result,
        unit: toUnit,
        formula: value + ' ' + fromUnit + ' × ' + factor + ' = ' + result.toPrecision(6) + ' ' + toUnit,
      });
    } else {
      setConversionResult({
        error: "Invalid conversion units selected."
      });
    }
  };
  
  // Reset calculators
  const resetReactivity = () => {
    setReactivityValues(defaultValues.reactivity);
    setReactivityResults({});
  };
  
  const resetCriticality = () => {
    setCriticalityValues(defaultValues.criticality);
    setCriticalityResults({});
  };
  
  const resetDecay = () => {
    setDecayValues(defaultValues.decay);
    setDecayResults({});
  };
  
  const resetConversion = () => {
    setConversionValues(defaultValues.conversion);
    setConversionResult(null);
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Nuclear Engineering Calculators
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Interactive calculators for common nuclear engineering formulas and conversions. These tools demonstrate the fundamental relationships in reactor physics and radiation protection.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Calculator Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="nuclear calculator tabs"
          >
            <Tab label="Reactivity Calculator" {...a11yProps(0)} />
            <Tab label="Criticality Estimator" {...a11yProps(1)} />
            <Tab label="Decay Heat Calculator" {...a11yProps(2)} />
            <Tab label="Unit Conversion" {...a11yProps(3)} />
          </Tabs>
        </Box>
        
        {/* Reactivity Calculator */}
        <TabPanel value={activeTab} index={0}>
          <Typography variant="h6" gutterBottom>
            Reactivity & Reactor Period Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate reactivity (ρ), reactivity in dollars, and approximate reactor period based on the effective multiplication factor (k).
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
                        label="Multiplication Factor (k)"
                        type="number"
                        value={reactivityValues.k}
                        onChange={(e) => handleReactivityChange('k', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.0001,
                          min: 0.9,
                          max: 1.1,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="The effective multiplication factor is the ratio of neutrons in one generation to the previous generation">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Delayed Neutron Fraction (β)"
                        type="number"
                        value={reactivityValues.beta}
                        onChange={(e) => handleReactivityChange('beta', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.0001,
                          min: 0.0001,
                          max: 0.01,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="The fraction of neutrons that are produced from fission product decay rather than directly from fission">
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
                    onClick={calculateReactivity}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetReactivity}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom>
                Formula:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                <Typography>Reactivity: ρ = (k - 1) / k</Typography>
                <Typography>Reactivity in dollars: ρ$ = ρ / β</Typography>
                <Typography>Reactor period depends on reactivity regime:</Typography>
                <Typography sx={{ pl: 2 }}>- Subcritical: T = -β / (λ * |ρ|)</Typography>
                <Typography sx={{ pl: 2 }}>- Delayed supercritical: T = (β - ρ) / (λ * ρ)</Typography>
                <Typography sx={{ pl: 2 }}>- Prompt supercritical: T = ℓ / (ρ - β)</Typography>
                <Typography sx={{ fontSize: '0.8rem', mt: 1 }}>where λ is the delayed neutron precursor decay constant and ℓ is the prompt neutron lifetime</Typography>
              </Box>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(reactivityResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Reactivity (ρ)</TableCell>
                          <TableCell align="right">{reactivityResults.reactivity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Reactivity (pcm)</TableCell>
                          <TableCell align="right">{reactivityResults.reactivityPCM} pcm</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Reactivity (dollars)</TableCell>
                          <TableCell align="right">{reactivityResults.reactivityDollars} $</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Reactor Period</TableCell>
                          <TableCell align="right">{reactivityResults.period} seconds</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Reactor Status</TableCell>
                          <TableCell align="right" 
                            sx={{ 
                              color: 
                                reactivityResults.status.includes('Unsafe') ? 'error.main' :
                                reactivityResults.status.includes('Supercritical') ? 'warning.main' :
                                reactivityResults.status === 'Critical' ? 'success.main' :
                                'text.primary'
                            }}
                          >
                            {reactivityResults.status}
                          </TableCell>
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
              <strong>Reactivity (ρ)</strong> is a measure of how far a reactor is from the critical state. 
              A positive reactivity indicates the reactor is supercritical (power increasing), while a negative 
              reactivity indicates subcritical (power decreasing).
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>Dollar Units</strong>: One dollar of reactivity is equal to the delayed neutron fraction (β).
              Reactivity insertions less than one dollar allow the reactor to be controlled by delayed neutrons,
              while insertions greater than one dollar can lead to prompt criticality and rapid power excursions.
            </Typography>
            <Typography variant="body2">
              <strong>Reactor Period</strong> is the time required for the reactor power to change by a factor of e (≈2.718).
              Shorter periods indicate faster power changes.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Criticality Estimator */}
        <TabPanel value={activeTab} index={1}>
          <Typography variant="h6" gutterBottom>
            Criticality & Critical Mass Estimator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Estimate the neutron multiplication factor and critical mass based on fuel enrichment, moderation ratio, and geometry.
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
                        label="Fuel Enrichment (% U-235)"
                        type="number"
                        value={criticalityValues.enrichment}
                        onChange={(e) => handleCriticalityChange('enrichment', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.1,
                          min: 0.5,
                          max: 20,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Percentage of U-235 in the uranium fuel">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Moderator Ratio (H/U)"
                        type="number"
                        value={criticalityValues.moderatorRatio}
                        onChange={(e) => handleCriticalityChange('moderatorRatio', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.1,
                          min: 0.1,
                          max: 10,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Ratio of hydrogen atoms to uranium atoms (approximation of moderation)">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Geometry Factor"
                        type="number"
                        value={criticalityValues.geometryFactor}
                        onChange={(e) => handleCriticalityChange('geometryFactor', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 0.01,
                          min: 0.5,
                          max: 0.99,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Factor accounting for neutron leakage (1.0 = no leakage, lower values indicate more leakage)">
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
                    onClick={calculateCriticality}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetCriticality}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom>
                Note:
              </Typography>
              <Typography variant="body2" color="text.secondary">
                This is a simplified educational model. Actual criticality calculations require detailed neutron 
                transport simulations with accurate nuclear data.
              </Typography>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(criticalityResults).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableBody>
                        <TableRow>
                          <TableCell component="th" scope="row">Infinite Multiplication Factor (k∞)</TableCell>
                          <TableCell align="right">{criticalityResults.kInfinity}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Effective Multiplication Factor (keff)</TableCell>
                          <TableCell align="right">{criticalityResults.kEffective}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Estimated Critical Mass</TableCell>
                          <TableCell align="right">{criticalityResults.criticalMass} kg</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">Buckling (B²)</TableCell>
                          <TableCell align="right">{criticalityResults.buckling} cm⁻²</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell component="th" scope="row">System Status</TableCell>
                          <TableCell align="right" 
                            sx={{ 
                              color: 
                                criticalityResults.status.includes('Highly Supercritical') ? 'error.main' :
                                criticalityResults.status.includes('Supercritical') ? 'warning.main' :
                                criticalityResults.status.includes('Near Critical') ? 'success.main' :
                                'text.primary'
                            }}
                          >
                            {criticalityResults.status}
                          </TableCell>
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
              Four-Factor Formula:
            </Typography>
            <Typography variant="body2" paragraph>
              The infinite multiplication factor (k∞) is often calculated using the four-factor formula:
            </Typography>
            <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', p: 2, borderRadius: 1, mb: 2, fontFamily: 'monospace' }}>
              <Typography>k∞ = η × ε × p × f</Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                where:
              </Typography>
              <Typography variant="body2">
                η = reproduction factor (neutrons produced per thermal neutron absorbed in fuel)
              </Typography>
              <Typography variant="body2">
                ε = fast fission factor (ratio of total neutrons produced to neutrons from thermal fission)
              </Typography>
              <Typography variant="body2">
                p = resonance escape probability (probability of neutrons slowing down without being absorbed)
              </Typography>
              <Typography variant="body2">
                f = thermal utilization factor (fraction of thermal neutrons absorbed in fuel)
              </Typography>
            </Box>
            <Typography variant="body2">
              The effective multiplication factor (keff) is then calculated by accounting for neutron leakage:
              keff = k∞ × PNL, where PNL is the probability of non-leakage.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Decay Heat Calculator */}
        <TabPanel value={activeTab} index={2}>
          <Typography variant="h6" gutterBottom>
            Decay Heat Calculator
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Calculate decay heat generation after reactor shutdown based on operating history.
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
                        label="Reactor Power (MW)"
                        type="number"
                        value={decayValues.initialPower}
                        onChange={(e) => handleDecayChange('initialPower', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 1,
                          min: 1,
                          max: 5000,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="The thermal power of the reactor before shutdown">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Operating Time (days)"
                        type="number"
                        value={decayValues.operatingTime}
                        onChange={(e) => handleDecayChange('operatingTime', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 1,
                          min: 1,
                          max: 1500,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Duration of reactor operation at power before shutdown">
                        <IconButton size="small">
                          <InfoIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <TextField
                        label="Cooling Time (days)"
                        type="number"
                        value={decayValues.coolingTime}
                        onChange={(e) => handleDecayChange('coolingTime', parseFloat(e.target.value))}
                        fullWidth
                        inputProps={{
                          step: 1,
                          min: 0.01,
                          max: 1000,
                        }}
                        sx={{ mr: 1 }}
                      />
                      <Tooltip title="Time after shutdown for which to calculate decay heat">
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
                    onClick={calculateDecay}
                  >
                    Calculate
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetDecay}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              <Typography variant="subtitle2" gutterBottom>
                Formula:
              </Typography>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', p: 2, borderRadius: 1, fontFamily: 'monospace' }}>
                <Typography>P(t) = P₀ × 0.066 × [t^(-0.2) - (t + T)^(-0.2)]</Typography>
                <Typography sx={{ fontSize: '0.8rem', mt: 1 }}>
                  where P₀ is the operating power, t is the cooling time, and T is the operating time
                </Typography>
              </Box>
            </Grid>
            
            {/* Results */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Results
                </Typography>
                
                {Object.keys(decayResults).length > 0 ? (
                  <>
                    <TableContainer sx={{ mb: 2 }}>
                      <Table size="small">
                        <TableBody>
                          <TableRow>
                            <TableCell component="th" scope="row">Decay Heat Fraction</TableCell>
                            <TableCell align="right">{decayResults.decayHeatFraction}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Decay Heat (% of full power)</TableCell>
                            <TableCell align="right">{decayResults.decayHeatPercent}%</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell component="th" scope="row">Decay Heat Power</TableCell>
                            <TableCell align="right">{decayResults.decayHeatPower} MW</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                    
                    {/* Decay heat over time */}
                    {decayResults.heatCurve && (
                      <>
                        <Typography variant="subtitle2" gutterBottom>
                          Decay Heat Trend
                        </Typography>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Cooling Time (days)</TableCell>
                                <TableCell align="right">Heat Fraction</TableCell>
                                <TableCell align="right">Power (MW)</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {decayResults.heatCurve.map((point) => (
                                <TableRow key={point.time}>
                                  <TableCell>{point.time}</TableCell>
                                  <TableCell align="right">{point.fraction.toExponential(4)}</TableCell>
                                  <TableCell align="right">{point.power.toFixed(2)}</TableCell>
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
              <strong>Decay Heat</strong> is the thermal power produced by a nuclear reactor after shutdown, 
              due to the radioactive decay of fission products. It's a critical safety consideration for 
              reactor cooling systems design and spent fuel management.
            </Typography>
            <Typography variant="body2">
              The Way-Wigner formula provides a reasonable approximation for decay heat calculations, 
              though more sophisticated methods are used in safety analyses. The decay heat decreases 
              over time but requires continuous cooling for extended periods after shutdown.
            </Typography>
          </Box>
        </TabPanel>
        
        {/* Unit Conversion */}
        <TabPanel value={activeTab} index={3}>
          <Typography variant="h6" gutterBottom>
            Radiation Unit Converter
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Convert between different radiation measurement units.
          </Typography>
          
          <Grid container spacing={3}>
            {/* Input form */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Unit Conversion
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Value"
                      type="number"
                      value={conversionValues.value}
                      onChange={(e) => handleConversionChange('value', parseFloat(e.target.value))}
                      fullWidth
                      inputProps={{
                        step: 0.1,
                      }}
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="from-unit-label">From Unit</InputLabel>
                      <Select
                        labelId="from-unit-label"
                        value={conversionValues.fromUnit}
                        label="From Unit"
                        onChange={(e) => handleConversionChange('fromUnit', e.target.value)}
                      >
                        <MenuItem value="becquerel">Becquerel (Bq)</MenuItem>
                        <MenuItem value="curie">Curie (Ci)</MenuItem>
                        <MenuItem value="gray">Gray (Gy)</MenuItem>
                        <MenuItem value="rad">Rad</MenuItem>
                        <MenuItem value="sievert">Sievert (Sv)</MenuItem>
                        <MenuItem value="rem">Rem</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel id="to-unit-label">To Unit</InputLabel>
                      <Select
                        labelId="to-unit-label"
                        value={conversionValues.toUnit}
                        label="To Unit"
                        onChange={(e) => handleConversionChange('toUnit', e.target.value)}
                      >
                        <MenuItem value="becquerel">Becquerel (Bq)</MenuItem>
                        <MenuItem value="curie">Curie (Ci)</MenuItem>
                        <MenuItem value="gray">Gray (Gy)</MenuItem>
                        <MenuItem value="rad">Rad</MenuItem>
                        <MenuItem value="sievert">Sievert (Sv)</MenuItem>
                        <MenuItem value="rem">Rem</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={calculateConversion}
                  >
                    Convert
                  </Button>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={resetConversion}
                  >
                    Reset
                  </Button>
                </Box>
              </Card>
              
              {/* Results */}
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Conversion Result
                </Typography>
                
                {conversionResult ? (
                  conversionResult.error ? (
                    <Typography color="error">{conversionResult.error}</Typography>
                  ) : (
                    <>
                      <Typography variant="h6" align="center" gutterBottom>
                        {conversionResult.value.toPrecision(6)} {conversionResult.unit}
                      </Typography>
                      <Typography variant="body2" align="center" color="text.secondary">
                        {conversionResult.formula}
                      </Typography>
                    </>
                  )
                ) : (
                  <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">
                      Select units and enter a value to convert
                    </Typography>
                  </Box>
                )}
              </Card>
            </Grid>
            
            {/* Unit reference */}
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Radiation Units Reference
                </Typography>
                
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Quantity</TableCell>
                        <TableCell>SI Unit</TableCell>
                        <TableCell>Traditional Unit</TableCell>
                        <TableCell>Conversion</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Activity</TableCell>
                        <TableCell>Becquerel (Bq)</TableCell>
                        <TableCell>Curie (Ci)</TableCell>
                        <TableCell>1 Ci = 3.7×10¹⁰ Bq</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Absorbed Dose</TableCell>
                        <TableCell>Gray (Gy)</TableCell>
                        <TableCell>Rad</TableCell>
                        <TableCell>1 Gy = 100 rad</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Dose Equivalent</TableCell>
                        <TableCell>Sievert (Sv)</TableCell>
                        <TableCell>Rem</TableCell>
                        <TableCell>1 Sv = 100 rem</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="subtitle1" sx={{ mt: 3, mb: 1 }}>
                  Common Radiation Levels:
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Average natural background</TableCell>
                        <TableCell>2-3 mSv/year</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Chest X-ray</TableCell>
                        <TableCell>0.1 mSv</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>CT scan</TableCell>
                        <TableCell>5-10 mSv</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>U.S. radiation worker limit</TableCell>
                        <TableCell>50 mSv/year</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Acute radiation syndrome onset</TableCell>
                        <TableCell>~1 Sv</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default NuclearCalculator;