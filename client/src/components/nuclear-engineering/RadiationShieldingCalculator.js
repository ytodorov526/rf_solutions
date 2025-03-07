import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Slider, 
  TextField, 
  Button, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Alert,
  Tooltip,
  IconButton,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(...registerables);

// Material half-value layer (HVL) data in cm
const MATERIAL_DATA = {
  lead: {
    name: 'Lead',
    density: 11.35, // g/cm³
    hvl: {
      // Energy (MeV): HVL (cm)
      0.1: 0.12,
      0.2: 0.25,
      0.5: 0.42,
      1.0: 0.83,
      1.5: 1.06,
      2.0: 1.20,
      3.0: 1.35,
      4.0: 1.44,
      5.0: 1.51,
      6.0: 1.56,
      8.0: 1.65,
      10.0: 1.73
    }
  },
  concrete: {
    name: 'Concrete',
    density: 2.35, // g/cm³
    hvl: {
      0.1: 2.14,
      0.2: 3.39,
      0.5: 4.57,
      1.0: 6.13,
      1.5: 7.06,
      2.0: 7.67,
      3.0: 8.51,
      4.0: 9.11,
      5.0: 9.53,
      6.0: 9.89,
      8.0: 10.48,
      10.0: 10.97
    }
  },
  water: {
    name: 'Water',
    density: 1.0, // g/cm³
    hvl: {
      0.1: 4.15,
      0.2: 5.10,
      0.5: 7.15,
      1.0: 9.90,
      1.5: 11.85,
      2.0: 13.28,
      3.0: 15.54,
      4.0: 17.22,
      5.0: 18.54,
      6.0: 19.64,
      8.0: 21.42,
      10.0: 22.86
    }
  },
  iron: {
    name: 'Iron',
    density: 7.87, // g/cm³
    hvl: {
      0.1: 0.26,
      0.2: 0.64,
      0.5: 1.22,
      1.0: 1.71,
      1.5: 2.01,
      2.0: 2.24,
      3.0: 2.53,
      4.0: 2.77,
      5.0: 2.95,
      6.0: 3.09,
      8.0: 3.34,
      10.0: 3.53
    }
  },
  aluminum: {
    name: 'Aluminum',
    density: 2.7, // g/cm³
    hvl: {
      0.1: 1.59,
      0.2: 2.79,
      0.5: 4.02,
      1.0: 5.11,
      1.5: 5.84,
      2.0: 6.35,
      3.0: 7.08,
      4.0: 7.58,
      5.0: 7.97,
      6.0: 8.29,
      8.0: 8.81,
      10.0: 9.24
    }
  }
};

// Radiation types with relative biological effectiveness (RBE)
const RADIATION_TYPES = {
  gamma: { label: 'Gamma/X-Rays', rbe: 1 },
  beta: { label: 'Beta Particles', rbe: 1 },
  alpha: { label: 'Alpha Particles', rbe: 20 },
  neutron: { label: 'Neutrons (Fast)', rbe: 10 }
};

// Preset scenarios
const PRESETS = {
  reactorShield: {
    name: 'Reactor Biological Shield',
    initialDoseRate: 100, // Sv/h
    distance: 200, // cm
    energy: 2.0, // MeV
    material: 'concrete',
    radiationType: 'gamma',
    thickness: 80 // cm
  },
  radioisotopeSafe: {
    name: 'Radioisotope Storage Safe',
    initialDoseRate: 50, // Sv/h
    distance: 30, // cm
    energy: 0.5, // MeV
    material: 'lead',
    radiationType: 'gamma',
    thickness: 5 // cm
  },
  wasteStorage: {
    name: 'Nuclear Waste Storage',
    initialDoseRate: 200, // Sv/h
    distance: 100, // cm
    energy: 1.0, // MeV
    material: 'concrete',
    radiationType: 'gamma',
    thickness: 60 // cm
  },
  medicalIrradiator: {
    name: 'Medical Irradiator Enclosure',
    initialDoseRate: 80, // Sv/h
    distance: 50, // cm
    energy: 1.5, // MeV
    material: 'lead',
    radiationType: 'gamma',
    thickness: 8 // cm
  }
};

// Main component
// Tab panel component for tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`shield-tabpanel-${index}`}
      aria-labelledby={`shield-tab-${index}`}
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

const RadiationShieldingCalculator = () => {
  // State variables
  const [material, setMaterial] = useState('lead');
  const [thickness, setThickness] = useState(5.0);
  const [initialDoseRate, setInitialDoseRate] = useState(100);
  const [distance, setDistance] = useState(100);
  const [energy, setEnergy] = useState(1.0);
  const [radiationType, setRadiationType] = useState('gamma');
  const [shieldedDoseRate, setShieldedDoseRate] = useState(0);
  const [transmissionFactor, setTransmissionFactor] = useState(0);
  const [tabValue, setTabValue] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [materialComparison, setMaterialComparison] = useState([]);
  const [preset, setPreset] = useState('');

  const chartRef = useRef(null);

  // Calculate the linear attenuation coefficient based on HVL
  const getAttenuationCoefficient = (material, energy) => {
    // Find nearest energy values in the material data
    const energies = Object.keys(MATERIAL_DATA[material].hvl).map(Number);
    let lowerEnergy = energies[0];
    let upperEnergy = energies[energies.length - 1];
    
    for (let i = 0; i < energies.length; i++) {
      if (energies[i] <= energy && (i === energies.length - 1 || energies[i + 1] > energy)) {
        lowerEnergy = energies[i];
        upperEnergy = i < energies.length - 1 ? energies[i + 1] : energies[i];
        break;
      }
    }

    // Get HVL values for interpolation
    const lowerHVL = MATERIAL_DATA[material].hvl[lowerEnergy];
    const upperHVL = MATERIAL_DATA[material].hvl[upperEnergy];
    
    // Linear interpolation of HVL
    let hvl;
    if (lowerEnergy === upperEnergy) {
      hvl = lowerHVL;
    } else {
      hvl = lowerHVL + (upperHVL - lowerHVL) * (energy - lowerEnergy) / (upperEnergy - lowerEnergy);
    }
    
    // Convert HVL to linear attenuation coefficient
    return 0.693 / hvl; // ln(2) / HVL
  };

  // Calculate shielded dose rate
  useEffect(() => {
    if (!material || !MATERIAL_DATA[material]) return;

    // Get attenuation coefficient
    const mu = getAttenuationCoefficient(material, energy);
    
    // Calculate transmission factor (with buildup factor approximation)
    // Simplified buildup factor: B ≈ 1 + μ·x for gammas in common shield materials
    const buildup = radiationType === 'gamma' ? 1 + mu * thickness * 0.5 : 1;
    const transmission = Math.exp(-mu * thickness) * buildup;
    setTransmissionFactor(transmission);
    
    // Calculate dose rate at distance
    const inverseSquare = distance > 0 ? (1 / (distance * distance)) * 10000 : 1; // normalize to 100cm
    let dose = initialDoseRate * transmission * inverseSquare;
    
    // Apply RBE factor for equivalent dose
    dose *= RADIATION_TYPES[radiationType].rbe;
    
    setShieldedDoseRate(dose);

    // Update chart data
    const thicknessValues = [];
    const doseValues = [];
    
    for (let t = 0; t <= thickness * 2; t += thickness / 20) {
      thicknessValues.push(t);
      const trans = Math.exp(-mu * t) * (radiationType === 'gamma' ? 1 + mu * t * 0.5 : 1);
      doseValues.push(initialDoseRate * trans * inverseSquare * RADIATION_TYPES[radiationType].rbe);
    }

    setChartData({
      labels: thicknessValues,
      datasets: [
        {
          label: 'Dose Rate (Sv/h)',
          data: doseValues,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1
        }
      ]
    });

    // Material comparison
    const comparison = Object.keys(MATERIAL_DATA).map(mat => {
      const materialMu = getAttenuationCoefficient(mat, energy);
      const materialTransmission = Math.exp(-materialMu * thickness) * 
        (radiationType === 'gamma' ? 1 + materialMu * thickness * 0.5 : 1);
      
      const materialDose = initialDoseRate * materialTransmission * inverseSquare * 
        RADIATION_TYPES[radiationType].rbe;
      
      // Calculate required thickness for 1/1000 attenuation (without buildup)
      const requiredThickness = Math.log(1000) / materialMu;
      
      return {
        material: MATERIAL_DATA[mat].name,
        dose: materialDose,
        transmission: materialTransmission,
        requiredThickness: requiredThickness
      };
    });
    
    setMaterialComparison(comparison);
  }, [material, thickness, initialDoseRate, distance, energy, radiationType]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Apply preset configuration
  const applyPreset = (presetKey) => {
    if (PRESETS[presetKey]) {
      const config = PRESETS[presetKey];
      setMaterial(config.material);
      setThickness(config.thickness);
      setInitialDoseRate(config.initialDoseRate);
      setDistance(config.distance);
      setEnergy(config.energy);
      setRadiationType(config.radiationType);
      setPreset(presetKey);
    }
  };

  // Export data as CSV
  const exportData = () => {
    if (!chartData) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Thickness (cm),Dose Rate (Sv/h)\n"
      + chartData.labels.map((x, i) => `${x},${chartData.datasets[0].data[i]}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `radiation-shield-${material}-${energy}MeV.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }} id="radiation-shielding-calculator">
      <Typography variant="h4" gutterBottom>
        Radiation Shielding Calculator
        <Tooltip title="This calculator helps you determine the effectiveness of various shielding materials against different types of radiation and energies. It calculates dose rates, transmission factors, and helps compare different materials.">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="shield calculator tabs">
          <Tab label="Calculator" />
          <Tab label="Material Comparison" />
          <Tab label="Theory" />
        </Tabs>
      </Box>
      
      {/* Calculator Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          {/* Parameter Controls */}
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Parameters</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Preset Scenarios</InputLabel>
                <Select
                  value={preset}
                  label="Preset Scenarios"
                  onChange={(e) => applyPreset(e.target.value)}
                >
                  <MenuItem value="">Custom</MenuItem>
                  {Object.keys(PRESETS).map((key) => (
                    <MenuItem key={key} value={key}>{PRESETS[key].name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Shield Material</InputLabel>
                <Select
                  value={material}
                  label="Shield Material"
                  onChange={(e) => setMaterial(e.target.value)}
                >
                  {Object.keys(MATERIAL_DATA).map((key) => (
                    <MenuItem key={key} value={key}>{MATERIAL_DATA[key].name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Thickness: {thickness} cm</Typography>
                <Slider
                  value={thickness}
                  onChange={(e, val) => setThickness(val)}
                  step={0.1}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 50, label: '50' },
                    { value: 100, label: '100' }
                  ]}
                />
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Radiation Type</InputLabel>
                <Select
                  value={radiationType}
                  label="Radiation Type"
                  onChange={(e) => setRadiationType(e.target.value)}
                >
                  {Object.keys(RADIATION_TYPES).map((key) => (
                    <MenuItem key={key} value={key}>{RADIATION_TYPES[key].label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Box sx={{ mb: 2 }}>
                <Typography gutterBottom>Energy: {energy} MeV</Typography>
                <Slider
                  value={energy}
                  onChange={(e, val) => setEnergy(val)}
                  step={0.1}
                  min={0.1}
                  max={10}
                  marks={[
                    { value: 0.1, label: '0.1' },
                    { value: 5, label: '5' },
                    { value: 10, label: '10' }
                  ]}
                />
              </Box>
              
              <TextField
                label="Initial Dose Rate (Sv/h)"
                type="number"
                fullWidth
                value={initialDoseRate}
                onChange={(e) => setInitialDoseRate(Number(e.target.value))}
                sx={{ mb: 2 }}
                inputProps={{ min: 0 }}
              />
              
              <TextField
                label="Distance (cm)"
                type="number"
                fullWidth
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Paper>
            
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={<DownloadIcon />}
              onClick={exportData}
              fullWidth
            >
              Export Data
            </Button>
          </Grid>
          
          {/* Results and Visualization */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Results</Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                    <Typography variant="subtitle2">Shielded Dose Rate</Typography>
                    <Typography variant="h5">{shieldedDoseRate.toFixed(6)} Sv/h</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={6}>
                  <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                    <Typography variant="subtitle2">Transmission Factor</Typography>
                    <Typography variant="h5">{(transmissionFactor * 100).toFixed(6)}%</Typography>
                  </Paper>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 2, height: 300 }}>
                {chartData && (
                  <Line
                    ref={chartRef}
                    data={chartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          title: {
                            display: true,
                            text: 'Shield Thickness (cm)'
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: 'Dose Rate (Sv/h)'
                          },
                          type: 'logarithmic'
                        }
                      }
                    }}
                  />
                )}
              </Box>
              
              {shieldedDoseRate > 20 && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  Warning: Calculated dose rate exceeds emergency exposure levels!
                </Alert>
              )}
              {shieldedDoseRate > 0.05 && shieldedDoseRate <= 20 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                  Caution: Calculated dose rate exceeds occupational limits!
                </Alert>
              )}
              {shieldedDoseRate <= 0.05 && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  Calculated dose rate is within acceptable occupational limits.
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Material Comparison Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Material Comparison</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Material</TableCell>
                <TableCell>Dose Rate (Sv/h)</TableCell>
                <TableCell>Transmission (%)</TableCell>
                <TableCell>Thickness for 1/1000 Attenuation (cm)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {materialComparison.map((item, index) => (
                <TableRow key={index} sx={{ bgcolor: item.material === MATERIAL_DATA[material].name ? 'rgba(75, 192, 192, 0.1)' : 'inherit' }}>
                  <TableCell>{item.material}</TableCell>
                  <TableCell>{item.dose.toExponential(4)}</TableCell>
                  <TableCell>{(item.transmission * 100).toFixed(6)}</TableCell>
                  <TableCell>{item.requiredThickness.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
      
      {/* Theory Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Radiation Shielding Theory</Typography>
        
        <Typography variant="body1" paragraph>
          Radiation shielding calculations are based on the principle of exponential attenuation. For a shield of thickness x, the intensity of radiation I after passing through the shield is related to the initial intensity I₀ by:
        </Typography>
        
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
            I = I₀ × e^(-μx) × B
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          where:
        </Typography>
        
        <Typography component="ul">
          <li>I = transmitted intensity (or dose rate)</li>
          <li>I₀ = initial intensity (or dose rate)</li>
          <li>μ = linear attenuation coefficient (cm⁻¹)</li>
          <li>x = shield thickness (cm)</li>
          <li>B = buildup factor, accounting for scattered radiation</li>
        </Typography>
        
        <Typography variant="body1" paragraph sx={{ mt: 2 }}>
          For gamma radiation, the buildup factor B increases with shield thickness and is approximately 1 + μx for shields that aren't too thick. For other types of radiation like alpha particles or neutrons, different models are used.
        </Typography>
        
        <Typography variant="body1" paragraph>
          The effectiveness of a shield is often described in terms of the Half-Value Layer (HVL), which is the thickness of material needed to reduce the radiation intensity by half:
        </Typography>
        
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
            HVL = ln(2)/μ ≈ 0.693/μ
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          The equivalent dose takes into account the biological effectiveness of different types of radiation, using the Relative Biological Effectiveness (RBE) factor:
        </Typography>
        
        <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2 }}>
          <Typography variant="h6" sx={{ fontFamily: 'monospace' }}>
            Equivalent Dose = Absorbed Dose × RBE
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" sx={{ mt: 3, fontWeight: 'bold' }}>
          Key Concepts in Radiation Shielding:
        </Typography>
        
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Material Selection</Typography>
              <Typography variant="body2">
                High-Z materials (like lead) are effective for gamma radiation, while hydrogen-rich materials (like water or polyethylene) are better for neutrons. Concrete is often used for its cost-effectiveness and structural properties.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Energy Dependence</Typography>
              <Typography variant="body2">
                Shield effectiveness varies with radiation energy. For gamma radiation, the attenuation coefficient generally decreases as energy increases until pair production becomes significant at high energies.
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Distance Factor</Typography>
              <Typography variant="body2">
                Radiation intensity follows the inverse square law with distance. Doubling the distance from a point source reduces the intensity to one-fourth, making distance an effective form of "shielding."
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Regulatory Limits</Typography>
              <Typography variant="body2">
                Occupational dose limits are typically 20 mSv/year, while public limits are 1 mSv/year. Emergency response may allow up to 100 mSv in exceptional circumstances.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default RadiationShieldingCalculator;