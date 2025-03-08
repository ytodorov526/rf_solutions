import React, { useState, useEffect, useRef } from 'react';
import {
  Box, 
  Paper, 
  Typography, 
  Grid, 
  TextField, 
  Button, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Slider, 
  Divider, 
  Tabs, 
  Tab, 
  Alert, 
  Tooltip, 
  IconButton,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Link
} from '@mui/material';
import { 
  InfoOutlined, 
  GetApp, 
  BrightnessHigh, 
  WbSunny, 
  Thermostat, 
  LocalDrink, 
  Science, 
  AccessTime,
  Warning,
  BarChart,
  PhotoLibrary
} from '@mui/icons-material';
import { Line, Bar } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

// Constants and reference data
const FUEL_TYPES = {
  PWR: { name: "PWR Fuel Assembly", burnup: 45000, enrichment: 4.5, cooling: 5, assemblies: 1 },
  BWR: { name: "BWR Fuel Assembly", burnup: 40000, enrichment: 4.0, cooling: 5, assemblies: 1 },
  CANDU: { name: "CANDU Fuel Bundle", burnup: 7500, enrichment: 0.71, cooling: 5, assemblies: 12 },
  VVER: { name: "VVER Fuel Assembly", burnup: 42000, enrichment: 4.2, cooling: 5, assemblies: 1 },
  RBMK: { name: "RBMK Fuel Assembly", burnup: 30000, enrichment: 2.0, cooling: 5, assemblies: 1 },
  RESEARCH: { name: "Research Reactor Fuel", burnup: 20000, enrichment: 19.75, cooling: 5, assemblies: 1 },
  SMR: { name: "SMR Fuel Module", burnup: 60000, enrichment: 5.0, cooling: 5, assemblies: 1 },
  CUSTOM: { name: "Custom Fuel", burnup: 40000, enrichment: 4.0, cooling: 5, assemblies: 1 }
};

const STORAGE_TYPES = [
  { name: "Wet Storage (Spent Fuel Pool)", capacity: 2000, lifetimeYears: 40, coolingEfficiency: 0.9, 
    description: "Water-filled pools with active cooling systems that provide radiation shielding and heat removal." },
  { name: "Dry Cask Storage", capacity: 500, lifetimeYears: 100, coolingEfficiency: 0.7, 
    description: "Metal or concrete casks for older, cooler spent fuel with passive cooling via air circulation." },
  { name: "Deep Geological Repository", capacity: 7000, lifetimeYears: 10000, coolingEfficiency: 0.1, 
    description: "Permanent disposal in stable geological formations hundreds of meters underground." },
  { name: "Reprocessing", capacity: 1000, lifetimeYears: 3, coolingEfficiency: 0.95, 
    description: "Chemical separation of uranium and plutonium for reuse as new fuel, reducing final waste volume." }
];

// Key isotopes with their half-lives (in years), decay heat contribution (relative), 
// and radiation emissions (for both heat and external dose)
const KEY_ISOTOPES = [
  { id: "sr90", name: "Sr-90", halfLife: 28.8, heatContribution: 0.05, gammaEnergy: 0.01, neutronEmission: 0 },
  { id: "y90", name: "Y-90", halfLife: 0.007, heatContribution: 0.08, gammaEnergy: 0.02, neutronEmission: 0 },
  { id: "ru106", name: "Ru-106", halfLife: 1.02, heatContribution: 0.01, gammaEnergy: 0.03, neutronEmission: 0 },
  { id: "cs134", name: "Cs-134", halfLife: 2.06, heatContribution: 0.09, gammaEnergy: 0.14, neutronEmission: 0 },
  { id: "cs137", name: "Cs-137", halfLife: 30.1, heatContribution: 0.19, gammaEnergy: 0.06, neutronEmission: 0 },
  { id: "ba137m", name: "Ba-137m", halfLife: 0.00000775, heatContribution: 0.07, gammaEnergy: 0.56, neutronEmission: 0 },
  { id: "ce144", name: "Ce-144", halfLife: 0.78, heatContribution: 0.04, gammaEnergy: 0.03, neutronEmission: 0 },
  { id: "pr144", name: "Pr-144", halfLife: 0.000041, heatContribution: 0.07, gammaEnergy: 0.02, neutronEmission: 0 },
  { id: "pm147", name: "Pm-147", halfLife: 2.62, heatContribution: 0.01, gammaEnergy: 0.001, neutronEmission: 0 },
  { id: "eu154", name: "Eu-154", halfLife: 8.59, heatContribution: 0.05, gammaEnergy: 0.12, neutronEmission: 0 },
  { id: "pu238", name: "Pu-238", halfLife: 87.7, heatContribution: 0.09, gammaEnergy: 0.002, neutronEmission: 0.01 },
  { id: "pu239", name: "Pu-239", halfLife: 24100, heatContribution: 0.001, gammaEnergy: 0.001, neutronEmission: 0.01 },
  { id: "pu240", name: "Pu-240", halfLife: 6560, heatContribution: 0.004, gammaEnergy: 0.001, neutronEmission: 0.03 },
  { id: "pu241", name: "Pu-241", halfLife: 14.4, heatContribution: 0.0002, gammaEnergy: 0.001, neutronEmission: 0 },
  { id: "am241", name: "Am-241", halfLife: 432.2, heatContribution: 0.06, gammaEnergy: 0.04, neutronEmission: 0.05 },
  { id: "cm242", name: "Cm-242", halfLife: 0.45, heatContribution: 0.13, gammaEnergy: 0.002, neutronEmission: 0.4 },
  { id: "cm244", name: "Cm-244", halfLife: 18.1, heatContribution: 0.16, gammaEnergy: 0.001, neutronEmission: 0.5 }
];

// Helper function: TabPanel component for tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`spent-fuel-tabpanel-${index}`}
      aria-labelledby={`spent-fuel-tab-${index}`}
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

const SpentFuelManagementSimulator = () => {
  // State for tab management
  const [tabValue, setTabValue] = useState(0);
  
  // State for fuel parameters
  const [fuelType, setFuelType] = useState('PWR');
  const [isCustomFuel, setIsCustomFuel] = useState(false);
  const [burnup, setBurnup] = useState(FUEL_TYPES.PWR.burnup);
  const [enrichment, setEnrichment] = useState(FUEL_TYPES.PWR.enrichment);
  const [coolingTime, setCoolingTime] = useState(FUEL_TYPES.PWR.cooling);
  const [numberOfAssemblies, setNumberOfAssemblies] = useState(FUEL_TYPES.PWR.assemblies);
  
  // State for storage parameters
  const [selectedStorageIndex, setSelectedStorageIndex] = useState(0);

  // State for projection parameters
  const [projectionYears, setProjectionYears] = useState(100);
  
  // State for calculation results
  const [decayHeat, setDecayHeat] = useState(0);
  const [radiationLevel, setRadiationLevel] = useState(0);
  const [isotopeInventory, setIsotopeInventory] = useState([]);
  const [heatProjection, setHeatProjection] = useState([]);
  const [doseProjection, setDoseProjection] = useState([]);
  const [storageRequirements, setStorageRequirements] = useState({});
  
  // Reference for chart rendering
  const heatChartRef = useRef(null);
  const doseChartRef = useRef(null);
  const isotopeChartRef = useRef(null);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle fuel type change
  const handleFuelTypeChange = (event) => {
    const newFuelType = event.target.value;
    setFuelType(newFuelType);
    
    if (newFuelType === 'CUSTOM') {
      setIsCustomFuel(true);
    } else {
      setIsCustomFuel(false);
      setBurnup(FUEL_TYPES[newFuelType].burnup);
      setEnrichment(FUEL_TYPES[newFuelType].enrichment);
      setCoolingTime(FUEL_TYPES[newFuelType].cooling);
      setNumberOfAssemblies(FUEL_TYPES[newFuelType].assemblies);
    }
  };

  // Calculate decay heat based on burnup, enrichment, cooling time and number of assemblies
  const calculateDecayHeat = (burnup, enrichment, cooling, assemblies) => {
    // Simplified decay heat model based on empirical formula
    // P = P0 * (t^-0.2 - t^-0.4) * burnup_factor * enrichment_factor * assemblies
    // where P0 is a normalization constant
    const P0 = 10.5; // kW per assembly for reference PWR fuel at 1 day cooling
    const burnupFactor = burnup / 40000; // normalized to 40 GWd/tU
    const enrichmentFactor = Math.pow(enrichment / 4.0, 0.15); // weak dependence on initial enrichment
    
    // First term models fission products, second term actinides
    const fissionProductTerm = Math.pow(cooling + 0.01, -0.2); // +0.01 prevents division by zero
    const actinideTerm = Math.pow(cooling + 0.01, -0.4);
    
    // Combined decay heat
    const heatPerAssembly = P0 * (fissionProductTerm - 0.5 * actinideTerm) * burnupFactor * enrichmentFactor;
    
    // Total heat for all assemblies (kW)
    return heatPerAssembly * assemblies;
  };

  // Calculate radiation level based on decay heat, cooling time and number of assemblies
  const calculateRadiationLevel = (decayHeat, cooling, assemblies) => {
    // Simplified radiation level model based on empirical formula
    // Dominated by Cs-137 after a few years of cooling
    const baseDoseRate = 200; // Sv/h at 1 meter for reference assembly at 1 year cooling
    const dosePerAssembly = baseDoseRate * Math.pow(cooling, -0.7) * (decayHeat / (assemblies * 10));
    
    // Total dose rate for all assemblies (Sv/h at 1 meter)
    return dosePerAssembly * assemblies;
  };

  // Calculate isotope inventory based on fuel parameters
  const calculateIsotopeInventory = (burnup, enrichment, cooling, assemblies) => {
    // Calculate inventory for each isotope based on production and decay
    return KEY_ISOTOPES.map(isotope => {
      // Simplified model for isotope production
      // Depends on burnup, enrichment and fuel type
      let initialActivity = 0;
      
      // Different production factors for different isotope types
      if (isotope.id.startsWith('sr') || isotope.id.startsWith('cs') || isotope.id.startsWith('y')) {
        // Fission products - depend primarily on burnup
        initialActivity = 10 * burnup / 40000 * assemblies;
      } else if (isotope.id.startsWith('pu') || isotope.id.startsWith('am') || isotope.id.startsWith('cm')) {
        // Actinides - depend on burnup and enrichment
        initialActivity = 5 * burnup / 40000 * Math.pow(4.5 / enrichment, 0.8) * assemblies;
      } else {
        // Other isotopes
        initialActivity = 7 * burnup / 40000 * assemblies;
      }
      
      // Apply radioactive decay based on cooling time
      const decayFactor = Math.pow(2, -cooling / isotope.halfLife);
      const currentActivity = initialActivity * decayFactor;
      
      // Heat contribution (kW)
      const heatOutput = currentActivity * isotope.heatContribution / 100;
      
      // Radiation contribution (Sv/h at 1 meter)
      const radiationOutput = currentActivity * (isotope.gammaEnergy + isotope.neutronEmission) / 10;
      
      return {
        ...isotope,
        activity: currentActivity.toFixed(3),
        heatOutput: heatOutput.toFixed(3),
        radiationOutput: radiationOutput.toFixed(3)
      };
    }).sort((a, b) => parseFloat(b.heatOutput) - parseFloat(a.heatOutput));
  };

  // Calculate heat projection over time
  const calculateHeatProjection = (burnup, enrichment, initialCooling, assemblies, years) => {
    const projection = [];
    
    for (let year = 0; year <= years; year++) {
      const totalCooling = initialCooling + year;
      const heat = calculateDecayHeat(burnup, enrichment, totalCooling, assemblies);
      projection.push({
        year,
        cooling: totalCooling,
        heat
      });
    }
    
    return projection;
  };

  // Calculate dose projection over time
  const calculateDoseProjection = (burnup, enrichment, initialCooling, assemblies, years) => {
    const projection = [];
    
    for (let year = 0; year <= years; year++) {
      const totalCooling = initialCooling + year;
      const heat = calculateDecayHeat(burnup, enrichment, totalCooling, assemblies);
      const dose = calculateRadiationLevel(heat, totalCooling, assemblies);
      projection.push({
        year,
        cooling: totalCooling,
        dose
      });
    }
    
    return projection;
  };

  // Calculate storage requirements
  const calculateStorageRequirements = (heatProjection, doseProjection, storageType) => {
    const { capacity, lifetimeYears, coolingEfficiency } = STORAGE_TYPES[storageType];
    
    // Calculate space requirements based on number of assemblies
    const spaceRequired = Math.ceil(numberOfAssemblies / capacity * 100);
    
    // Calculate cooling requirements based on decay heat
    const initialHeat = heatProjection[0].heat;
    const coolingRequired = initialHeat / coolingEfficiency;
    
    // Calculate yearly operational costs (simplified model)
    const baseCost = storageType === 0 ? 100000 : // Wet storage has higher operational costs
                    storageType === 1 ? 50000 :   // Dry cask storage has medium costs
                    storageType === 2 ? 20000 :   // Repository has low annual costs
                    80000;                        // Reprocessing has high costs
    
    // Scale costs based on heat and number of assemblies
    const operatingCost = baseCost * (initialHeat / 100) * (numberOfAssemblies / 10);
    
    // Calculate total lifecycle cost
    const lifecycleCost = operatingCost * Math.min(lifetimeYears, projectionYears);
    
    // Calculate safety metrics
    const safetyMetric = 100 - Math.min(100, (initialHeat / coolingEfficiency) * 
                         (doseProjection[0].dose / 100) / (storageType === 2 ? 0.1 : 1));
    
    return {
      spaceUtilization: spaceRequired,
      coolingRequirements: coolingRequired.toFixed(2),
      annualOperatingCost: operatingCost.toFixed(2),
      totalLifecycleCost: lifecycleCost.toFixed(2),
      safetyIndex: safetyMetric.toFixed(1),
      recommendedDuration: storageType === 0 ? Math.min(40, Math.max(5, Math.ceil(coolingTime + 5))) :
                           storageType === 1 ? Math.min(100, Math.max(40, Math.ceil(coolingTime * 3))) :
                           storageType === 2 ? 'Permanent' :
                           Math.min(5, Math.max(3, Math.ceil(coolingTime / 2))),
      nextStepRecommendation: storageType === 0 ? 'Transfer to dry storage after sufficient cooling' :
                             storageType === 1 ? 'Transfer to geological repository after interim storage period' :
                             storageType === 2 ? 'No further steps needed' :
                             'Return recycled fuel to fabrication facility'
    };
  };

  // Handle export data as CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Add fuel parameters
    csvContent += "Spent Fuel Management Simulation Results\n";
    csvContent += `Fuel Type,${FUEL_TYPES[fuelType].name}\n`;
    csvContent += `Burnup (MWd/tU),${burnup}\n`;
    csvContent += `Initial Enrichment (%),${enrichment}\n`;
    csvContent += `Cooling Time (years),${coolingTime}\n`;
    csvContent += `Number of Assemblies,${numberOfAssemblies}\n\n`;
    
    // Add decay heat and radiation level
    csvContent += `Total Decay Heat (kW),${decayHeat.toFixed(2)}\n`;
    csvContent += `Radiation Level (Sv/h at 1m),${radiationLevel.toFixed(2)}\n\n`;
    
    // Add storage information
    csvContent += `Storage Type,${STORAGE_TYPES[selectedStorageIndex].name}\n`;
    csvContent += `Space Utilization (%),${storageRequirements.spaceUtilization}\n`;
    csvContent += `Cooling Requirements (kW),${storageRequirements.coolingRequirements}\n`;
    csvContent += `Annual Operating Cost ($),${storageRequirements.annualOperatingCost}\n`;
    csvContent += `Total Lifecycle Cost ($),${storageRequirements.totalLifecycleCost}\n`;
    csvContent += `Safety Index,${storageRequirements.safetyIndex}\n\n`;
    
    // Add isotope inventory
    csvContent += "Isotope Inventory\n";
    csvContent += "Isotope,Activity (relative),Heat Output (kW),Radiation Output (Sv/h)\n";
    isotopeInventory.forEach(isotope => {
      csvContent += `${isotope.name},${isotope.activity},${isotope.heatOutput},${isotope.radiationOutput}\n`;
    });
    
    csvContent += "\nDecay Heat Projection\n";
    csvContent += "Year,Cooling Time (years),Heat (kW)\n";
    heatProjection.forEach(point => {
      csvContent += `${point.year},${point.cooling},${point.heat.toFixed(2)}\n`;
    });
    
    csvContent += "\nRadiation Level Projection\n";
    csvContent += "Year,Cooling Time (years),Dose Rate (Sv/h)\n";
    doseProjection.forEach(point => {
      csvContent += `${point.year},${point.cooling},${point.dose.toFixed(4)}\n`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "spent_fuel_data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Handle save chart as image
  const handleSaveChart = (chartRef, filename) => {
    if (chartRef.current) {
      const link = document.createElement('a');
      link.download = filename;
      link.href = chartRef.current.toBase64Image();
      link.click();
    }
  };

  // Effect hook to perform calculations when parameters change
  useEffect(() => {
    // Calculate decay heat
    const heat = calculateDecayHeat(burnup, enrichment, coolingTime, numberOfAssemblies);
    setDecayHeat(heat);
    
    // Calculate radiation level
    const radiation = calculateRadiationLevel(heat, coolingTime, numberOfAssemblies);
    setRadiationLevel(radiation);
    
    // Calculate isotope inventory
    const inventory = calculateIsotopeInventory(burnup, enrichment, coolingTime, numberOfAssemblies);
    setIsotopeInventory(inventory);
    
    // Calculate heat projection
    const heatProj = calculateHeatProjection(burnup, enrichment, coolingTime, numberOfAssemblies, projectionYears);
    setHeatProjection(heatProj);
    
    // Calculate dose projection
    const doseProj = calculateDoseProjection(burnup, enrichment, coolingTime, numberOfAssemblies, projectionYears);
    setDoseProjection(doseProj);
    
    // Calculate storage requirements
    const storageReqs = calculateStorageRequirements(heatProj, doseProj, selectedStorageIndex);
    setStorageRequirements(storageReqs);
  }, [burnup, enrichment, coolingTime, numberOfAssemblies, projectionYears, selectedStorageIndex]);

  // Heat projection chart data
  const heatChartData = {
    labels: heatProjection.map(point => point.year),
    datasets: [
      {
        label: 'Decay Heat (kW)',
        data: heatProjection.map(point => point.heat),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1
      }
    ]
  };

  // Heat projection chart options
  const heatChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Decay Heat Projection Over Time'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Heat: ${context.parsed.y.toFixed(2)} kW`;
          },
          title: (context) => {
            const year = context[0].parsed.x;
            return `Year ${year} (Cooling ${coolingTime + year} years)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years from Now'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Decay Heat (kW)'
        },
        beginAtZero: true
      }
    }
  };

  // Dose projection chart data
  const doseChartData = {
    labels: doseProjection.map(point => point.year),
    datasets: [
      {
        label: 'Radiation Level (Sv/h)',
        data: doseProjection.map(point => point.dose),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderWidth: 2,
        pointRadius: 0,
        tension: 0.1
      }
    ]
  };

  // Dose projection chart options
  const doseChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Radiation Level Projection Over Time'
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            return `Dose Rate: ${context.parsed.y.toFixed(4)} Sv/h`;
          },
          title: (context) => {
            const year = context[0].parsed.x;
            return `Year ${year} (Cooling ${coolingTime + year} years)`;
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Years from Now'
        }
      },
      y: {
        type: 'logarithmic',
        title: {
          display: true,
          text: 'Radiation Level (Sv/h)'
        }
      }
    }
  };

  // Isotope contribution chart data
  const isotopeChartData = {
    labels: isotopeInventory.slice(0, 10).map(isotope => isotope.name),
    datasets: [
      {
        label: 'Heat Contribution (kW)',
        data: isotopeInventory.slice(0, 10).map(isotope => parseFloat(isotope.heatOutput)),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderWidth: 1
      }
    ]
  };

  // Isotope contribution chart options
  const isotopeChartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Top 10 Isotopes by Heat Contribution'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Heat Contribution (kW)'
        }
      }
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Spent Fuel Management Simulator
        <Tooltip title="Simulate spent nuclear fuel decay heat, radiation levels, and storage requirements based on fuel type, burnup, and cooling time.">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoOutlined />
          </IconButton>
        </Tooltip>
      </Typography>
      
      <Divider sx={{ mb: 3 }} />
      
      <Tabs value={tabValue} onChange={handleTabChange} centered sx={{ mb: 2 }}>
        <Tab label="Fuel Parameters" />
        <Tab label="Storage Options" />
        <Tab label="Results & Projections" />
        <Tab label="Isotope Inventory" />
        <Tab label="Education" />
      </Tabs>
      
      {/* Fuel Parameters Tab */}
      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Fuel Selection
                <Tooltip title="Select from common fuel types or create a custom configuration">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoOutlined />
                  </IconButton>
                </Tooltip>
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Fuel Type</InputLabel>
                <Select 
                  value={fuelType} 
                  onChange={handleFuelTypeChange}
                  label="Fuel Type"
                >
                  {Object.entries(FUEL_TYPES).map(([key, value]) => (
                    <MenuItem key={key} value={key}>{value.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Burnup (MWd/tU)"
                    type="number"
                    value={burnup}
                    onChange={(e) => setBurnup(Math.max(0, Number(e.target.value)))}
                    disabled={!isCustomFuel}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Initial Enrichment (%)"
                    type="number"
                    value={enrichment}
                    onChange={(e) => setEnrichment(Math.max(0.1, Math.min(20, Number(e.target.value))))}
                    disabled={!isCustomFuel}
                    fullWidth
                    InputProps={{ inputProps: { min: 0.1, max: 20, step: 0.1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Storage Parameters
                <Tooltip title="Configure cooling time and inventory size">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <InfoOutlined />
                  </IconButton>
                </Tooltip>
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography id="cooling-time-slider" gutterBottom>
                    Cooling Time (years): {coolingTime}
                  </Typography>
                  <Slider
                    value={coolingTime}
                    onChange={(e, newValue) => setCoolingTime(newValue)}
                    min={1}
                    max={100}
                    step={1}
                    aria-labelledby="cooling-time-slider"
                    valueLabelDisplay="auto"
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Number of Assemblies"
                    type="number"
                    value={numberOfAssemblies}
                    onChange={(e) => setNumberOfAssemblies(Math.max(1, Number(e.target.value)))}
                    fullWidth
                    InputProps={{ inputProps: { min: 1, step: 1 } }}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Projection Settings
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography id="projection-years-slider" gutterBottom>
                    Projection Period (years): {projectionYears}
                  </Typography>
                  <Slider
                    value={projectionYears}
                    onChange={(e, newValue) => setProjectionYears(newValue)}
                    min={10}
                    max={300}
                    step={10}
                    aria-labelledby="projection-years-slider"
                    valueLabelDisplay="auto"
                  />
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Current Calculation Results</Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Thermostat color="error" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Total Decay Heat:</Typography>
                  </Box>
                  <Typography variant="h5">{decayHeat.toFixed(2)} kW</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BrightnessHigh color="warning" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Radiation Level:</Typography>
                  </Box>
                  <Typography variant="h5">{radiationLevel.toFixed(2)} Sv/h</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <WbSunny color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Gamma Dose Rate:</Typography>
                  </Box>
                  <Typography variant="h5">{(radiationLevel * 0.8).toFixed(2)} Sv/h</Typography>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Science color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">Neutron Dose Rate:</Typography>
                  </Box>
                  <Typography variant="h5">{(radiationLevel * 0.2).toFixed(2)} Sv/h</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Storage Options Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Spent Fuel Storage Options
          <Tooltip title="Compare different storage options for spent nuclear fuel">
            <IconButton size="small" sx={{ ml: 1 }}>
              <InfoOutlined />
            </IconButton>
          </Tooltip>
        </Typography>
        
        <Grid container spacing={3}>
          {STORAGE_TYPES.map((storage, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Paper 
                elevation={selectedStorageIndex === index ? 4 : 1} 
                sx={{ 
                  p: 2, 
                  minHeight: 200, 
                  cursor: 'pointer',
                  border: selectedStorageIndex === index ? '2px solid #3f51b5' : 'none',
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    elevation: 4,
                    backgroundColor: 'rgba(63, 81, 181, 0.05)'
                  }
                }}
                onClick={() => setSelectedStorageIndex(index)}
              >
                <Typography variant="h6" color="primary" gutterBottom>
                  {storage.name}
                </Typography>
                
                <Typography variant="body2" paragraph>
                  {storage.description}
                </Typography>
                
                <Divider sx={{ my: 1 }} />
                
                <Typography variant="body2">
                  <strong>Capacity:</strong> {storage.capacity} assemblies
                </Typography>
                
                <Typography variant="body2">
                  <strong>Expected Lifetime:</strong> {storage.lifetimeYears === 10000 ? 'Permanent' : `${storage.lifetimeYears} years`}
                </Typography>
                
                <Typography variant="body2">
                  <strong>Cooling Efficiency:</strong> {storage.coolingEfficiency * 100}%
                </Typography>
                
                {selectedStorageIndex === index && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    Selected for calculation
                  </Alert>
                )}
              </Paper>
            </Grid>
          ))}
        </Grid>
        
        {Object.keys(storageRequirements).length > 0 && (
          <Paper elevation={3} sx={{ p: 2, mt: 3 }}>
            <Typography variant="h6" gutterBottom>
              Storage Requirements Analysis
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>Space Utilization:</Typography>
                <Typography variant="body1" paragraph>
                  {storageRequirements.spaceUtilization}% of capacity
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>Cooling Requirements:</Typography>
                <Typography variant="body1">
                  {storageRequirements.coolingRequirements} kW
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" gutterBottom>Annual Operating Cost:</Typography>
                <Typography variant="body1" paragraph>
                  ${Number(storageRequirements.annualOperatingCost).toLocaleString()} per year
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>Total Lifecycle Cost:</Typography>
                <Typography variant="body1">
                  ${Number(storageRequirements.totalLifecycleCost).toLocaleString()}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Safety Index:</Typography>
                <Typography variant="body1" paragraph>
                  {storageRequirements.safetyIndex}/100
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom>Recommended Duration:</Typography>
                <Typography variant="body1">
                  {storageRequirements.recommendedDuration}
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <Alert 
                  severity={
                    Number(storageRequirements.safetyIndex) > 80 ? "success" : 
                    Number(storageRequirements.safetyIndex) > 60 ? "info" : 
                    Number(storageRequirements.safetyIndex) > 40 ? "warning" : "error"
                  }
                  sx={{ mt: 1 }}
                >
                  <Typography variant="subtitle2">
                    Recommendation: {storageRequirements.nextStepRecommendation}
                  </Typography>
                </Alert>
              </Grid>
            </Grid>
          </Paper>
        )}
      </TabPanel>
      
      {/* Results & Projections Tab */}
      <TabPanel value={tabValue} index={2}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Decay Heat Projection
              </Typography>
              <Button 
                startIcon={<PhotoLibrary />} 
                size="small" 
                onClick={() => handleSaveChart(heatChartRef, 'decay_heat_projection.png')}
              >
                Save Chart
              </Button>
            </Box>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={heatChartData} 
                  options={heatChartOptions} 
                  ref={heatChartRef}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Radiation Level Projection
              </Typography>
              <Button 
                startIcon={<PhotoLibrary />} 
                size="small" 
                onClick={() => handleSaveChart(doseChartRef, 'radiation_projection.png')}
              >
                Save Chart
              </Button>
            </Box>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={doseChartData} 
                  options={doseChartOptions} 
                  ref={doseChartRef}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Key Time Points
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Time Period</TableCell>
                      <TableCell>Total Cooling (years)</TableCell>
                      <TableCell>Decay Heat (kW)</TableCell>
                      <TableCell>Radiation Level (Sv/h)</TableCell>
                      <TableCell>Notes</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell>Current</TableCell>
                      <TableCell>{coolingTime}</TableCell>
                      <TableCell>{decayHeat.toFixed(2)}</TableCell>
                      <TableCell>{radiationLevel.toFixed(2)}</TableCell>
                      <TableCell>Starting point</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>+5 years</TableCell>
                      <TableCell>{coolingTime + 5}</TableCell>
                      <TableCell>
                        {heatProjection.find(p => p.year === 5)?.heat.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>
                        {doseProjection.find(p => p.year === 5)?.dose.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>Short-term storage</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>+20 years</TableCell>
                      <TableCell>{coolingTime + 20}</TableCell>
                      <TableCell>
                        {heatProjection.find(p => p.year === 20)?.heat.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>
                        {doseProjection.find(p => p.year === 20)?.dose.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>Medium-term considerations</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>+50 years</TableCell>
                      <TableCell>{coolingTime + 50}</TableCell>
                      <TableCell>
                        {heatProjection.find(p => p.year === 50)?.heat.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>
                        {doseProjection.find(p => p.year === 50)?.dose.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>Long-term planning</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>+100 years</TableCell>
                      <TableCell>{coolingTime + 100}</TableCell>
                      <TableCell>
                        {heatProjection.find(p => p.year === 100)?.heat.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>
                        {doseProjection.find(p => p.year === 100)?.dose.toFixed(2) || '-'}
                      </TableCell>
                      <TableCell>Very long-term storage</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<GetApp />}
              onClick={handleExportCSV}
            >
              Export Data as CSV
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Isotope Inventory Tab */}
      <TabPanel value={tabValue} index={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Top Contributors to Decay Heat
              </Typography>
              <Button 
                startIcon={<PhotoLibrary />} 
                size="small" 
                onClick={() => handleSaveChart(isotopeChartRef, 'isotope_inventory.png')}
              >
                Save Chart
              </Button>
            </Box>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Box sx={{ height: 300 }}>
                <Bar 
                  data={isotopeChartData} 
                  options={isotopeChartOptions} 
                  ref={isotopeChartRef}
                />
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Detailed Isotope Inventory
              </Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Isotope</TableCell>
                      <TableCell>Half-Life (years)</TableCell>
                      <TableCell>Relative Activity</TableCell>
                      <TableCell>Heat Output (kW)</TableCell>
                      <TableCell>Radiation Output (Sv/h)</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {isotopeInventory.map((isotope) => (
                      <TableRow key={isotope.id}>
                        <TableCell>{isotope.name}</TableCell>
                        <TableCell>{isotope.halfLife}</TableCell>
                        <TableCell>{isotope.activity}</TableCell>
                        <TableCell>{isotope.heatOutput}</TableCell>
                        <TableCell>{isotope.radiationOutput}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Key Insights for {FUEL_TYPES[fuelType].name}
              </Typography>
              
              <Typography variant="body1" paragraph>
                The following isotopes dominate the decay heat and radiation output for this fuel configuration:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">
                    For decay heat at {coolingTime} years cooling:
                  </Typography>
                  <ul>
                    {isotopeInventory.slice(0, 3).map(isotope => (
                      <li key={`heat-${isotope.id}`}>
                        <Typography variant="body2">
                          {isotope.name} – {isotope.heatOutput} kW ({(parseFloat(isotope.heatOutput) / decayHeat * 100).toFixed(1)}% of total)
                        </Typography>
                      </li>
                    ))}
                  </ul>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2">
                    For radiation at {coolingTime} years cooling:
                  </Typography>
                  <ul>
                    {isotopeInventory
                      .sort((a, b) => parseFloat(b.radiationOutput) - parseFloat(a.radiationOutput))
                      .slice(0, 3)
                      .map(isotope => (
                        <li key={`rad-${isotope.id}`}>
                          <Typography variant="body2">
                            {isotope.name} – {isotope.radiationOutput} Sv/h ({(parseFloat(isotope.radiationOutput) / radiationLevel * 100).toFixed(1)}% of total)
                          </Typography>
                        </li>
                      ))}
                  </ul>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle2" gutterBottom>
                Implications for Storage and Handling:
              </Typography>
              
              <Typography variant="body2" paragraph>
                {coolingTime < 5 ? 
                  "During early cooling (<5 years), short-lived fission products dominate both decay heat and radiation. Wet storage with active cooling is required." :
                 coolingTime < 20 ? 
                  "At medium cooling times (5-20 years), Cs-137/Ba-137m and Sr-90/Y-90 dominate radiation while actinides become more significant for heat generation. Dry storage becomes feasible." :
                  "With extended cooling (>20 years), long-lived actinides like Am-241, Pu-238, and Pu-241 dominate decay heat, while Cs-137 remains the primary radiation source. Long-term geological disposal or reprocessing should be considered."
                }
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Education Tab */}
      <TabPanel value={tabValue} index={4}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Spent Nuclear Fuel Basics
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>What is spent nuclear fuel?</strong> When nuclear fuel can no longer efficiently sustain a chain reaction, it is considered "spent" and removed from the reactor. However, it still contains about 95% of its original uranium, along with plutonium, other actinides, and fission products.
              </Typography>
              
              <Typography variant="body1" paragraph>
                <strong>Key characteristics of spent fuel:</strong>
              </Typography>
              
              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Thermostat color="error" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Decay Heat</Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Due to continued radioactive decay, spent fuel generates heat and requires cooling. This heat decreases over time but remains significant for decades.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <BrightnessHigh color="warning" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Radiation</Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Spent fuel emits alpha, beta, gamma radiation and neutrons. Initially dominated by short-lived isotopes, long-lived isotopes become more prominent over time.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Science color="primary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Isotopic Composition</Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Contains uranium, plutonium, minor actinides, and hundreds of fission products in varying concentrations depending on the reactor type and burnup.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <AccessTime color="secondary" sx={{ mr: 1 }} />
                    <Typography variant="subtitle2">Long-lived Nature</Typography>
                  </Box>
                  <Typography variant="body2" paragraph>
                    Some radionuclides have half-lives of thousands to millions of years, requiring long-term management solutions.
                  </Typography>
                </Grid>
              </Grid>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Spent Fuel Management Options
              </Typography>
              
              <Typography variant="body1" paragraph>
                There are several approaches to managing spent nuclear fuel:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Wet Storage (Spent Fuel Pools)</Typography>
                  <Typography variant="body2" paragraph>
                    Initially, spent fuel assemblies are stored in water-filled pools that provide cooling and radiation shielding. The water is continuously circulated and purified to remove heat and maintain water quality. This is the first step in spent fuel management.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Dry Cask Storage</Typography>
                  <Typography variant="body2" paragraph>
                    After 3-5 years in wet storage, when decay heat has decreased significantly, spent fuel can be transferred to dry casks made of concrete and steel. These provide passive cooling through natural air circulation and radiation shielding. Dry storage is considered safe for decades.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Geological Repositories</Typography>
                  <Typography variant="body2" paragraph>
                    The long-term solution for spent fuel involves deep geological disposal in stable rock formations. Spent fuel is encapsulated in corrosion-resistant containers and placed in tunnels hundreds of meters underground, with multiple engineered barriers to prevent radionuclide release.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle2" gutterBottom>Reprocessing</Typography>
                  <Typography variant="body2" paragraph>
                    Some countries reprocess spent fuel to recover uranium and plutonium for reuse as fresh fuel. This reduces the volume of high-level waste but generates different waste streams. The separated materials can be used in thermal or fast reactors as mixed oxide (MOX) fuel.
                  </Typography>
                </Grid>
              </Grid>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">
                  Did you know?
                </Typography>
                <Typography variant="body2">
                  Used nuclear fuel is extremely energy-dense. A typical 1000 MWe nuclear reactor using 20 tons of fuel annually can power a city of one million people. The same energy from coal would require 3 million tons of coal. Additionally, all the used nuclear fuel produced by U.S. reactors in over 60 years would cover a football field to a depth of less than 10 meters.
                </Typography>
              </Alert>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                The Science of Decay Heat and Radiation
              </Typography>
              
              <Typography variant="subtitle2" gutterBottom>
                Decay Heat Generation
              </Typography>
              
              <Typography variant="body2" paragraph>
                Decay heat in spent fuel comes from the energy released during radioactive decay of fission products and actinides. Initially dominated by short-lived fission products, the contribution shifts over time:
              </Typography>
              
              <ul>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>First days to weeks:</strong> Dominated by very short-lived fission products (e.g., I-131, Xe-133)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>First 1-5 years:</strong> Dominated by medium-lived fission products (e.g., Ru-106, Ce-144)
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>5-100 years:</strong> Longer-lived fission products (Cs-137, Sr-90) and actinides (Pu-238, Am-241) become more significant
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <strong>Beyond 100 years:</strong> Dominated by long-lived actinides and their decay products
                  </Typography>
                </li>
              </ul>
              
              <Typography variant="subtitle2" gutterBottom>
                Decay Heat Formula
              </Typography>
              
              <Typography variant="body2" paragraph>
                The decay heat from spent fuel can be approximated by the following equation:
              </Typography>
              
              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1, my: 2 }}>
                <Typography variant="body2" component="div" sx={{ fontFamily: 'monospace' }}>
                  P(t) = P₀(t₀/t)^n
                </Typography>
              </Box>
              
              <Typography variant="body2" paragraph>
                where:
              </Typography>
              
              <ul>
                <li>
                  <Typography variant="body2">
                    P(t) is the decay heat power at time t after shutdown
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    P₀ is the decay heat power at a reference time t₀
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    n is an exponent that varies between 0.2-0.4 depending on cooling time
                  </Typography>
                </li>
              </ul>
              
              <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                Radiation Source Terms
              </Typography>
              
              <Typography variant="body2" paragraph>
                Spent fuel emits several types of radiation:
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" paragraph>
                    <strong>Alpha radiation:</strong> Primarily from actinides (Pu, Am, Cm isotopes). Easily shielded but hazardous if inhaled or ingested.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" paragraph>
                    <strong>Beta radiation:</strong> From fission products like Sr-90 and Cs-137. Can be shielded by moderate materials but contributes to dose rates.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" paragraph>
                    <strong>Gamma radiation:</strong> Primarily from Ba-137m (daughter of Cs-137) and other fission products. Penetrating and requires substantial shielding.
                  </Typography>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" paragraph>
                    <strong>Neutron radiation:</strong> From spontaneous fission of certain actinides (Cm-244, Cf-252) and (α,n) reactions. Requires hydrogen-rich materials for shielding.
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Learn More
              </Typography>
              
              <Typography variant="body1" paragraph>
                If you're interested in learning more about spent nuclear fuel management, consider exploring these resources:
              </Typography>
              
              <ul>
                <li>
                  <Typography variant="body2" paragraph>
                    <Link href="https://www.world-nuclear.org/information-library/nuclear-fuel-cycle/nuclear-wastes/radioactive-waste-management.aspx" target="_blank" rel="noopener">
                      World Nuclear Association - Radioactive Waste Management
                    </Link>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <Link href="https://www.nrc.gov/waste/spent-fuel-storage.html" target="_blank" rel="noopener">
                      U.S. Nuclear Regulatory Commission - Spent Fuel Storage
                    </Link>
                  </Typography>
                </li>
                <li>
                  <Typography variant="body2" paragraph>
                    <Link href="https://www.iaea.org/topics/spent-fuel-management" target="_blank" rel="noopener">
                      International Atomic Energy Agency - Spent Fuel Management
                    </Link>
                  </Typography>
                </li>
              </ul>
              
              <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="subtitle2">
                  Educational Disclaimer
                </Typography>
                <Typography variant="body2">
                  This simulator provides educational insights into spent fuel management but uses simplified models. Real-world spent fuel management involves more complex models, regulatory requirements, and site-specific considerations. The data presented should be used for educational purposes only.
                </Typography>
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default SpentFuelManagementSimulator;