import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
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
  Tooltip,
  IconButton,
  Divider,
  Alert,
  Stack
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(...registerables);

// Element data for common materials in neutron activation analysis
// Cross sections are in barns (10^-24 cm^2) for thermal neutrons (0.025 eV)
const ELEMENT_DATA = {
  "H-1": { name: "Hydrogen-1", atomicMass: 1.008, crossSection: 0.332, abundance: 99.985, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "H-2": { name: "Deuterium", atomicMass: 2.014, crossSection: 0.000519, abundance: 0.015, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "C-12": { name: "Carbon-12", atomicMass: 12.011, crossSection: 0.0035, abundance: 98.93, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "C-13": { name: "Carbon-13", atomicMass: 13.003, crossSection: 0.0014, abundance: 1.07, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "N-14": { name: "Nitrogen-14", atomicMass: 14.007, crossSection: 1.83, abundance: 99.632, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "O-16": { name: "Oxygen-16", atomicMass: 15.999, crossSection: 0.00019, abundance: 99.757, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Na-23": { name: "Sodium-23", atomicMass: 22.99, crossSection: 0.53, abundance: 100, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Al-27": { name: "Aluminum-27", atomicMass: 26.982, crossSection: 0.231, abundance: 100, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Si-28": { name: "Silicon-28", atomicMass: 28.085, crossSection: 0.177, abundance: 92.223, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "P-31": { name: "Phosphorus-31", atomicMass: 30.974, crossSection: 0.172, abundance: 100, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "S-32": { name: "Sulfur-32", atomicMass: 32.06, crossSection: 0.528, abundance: 94.99, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Cl-35": { name: "Chlorine-35", atomicMass: 35.45, crossSection: 43.6, abundance: 75.76, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "K-39": { name: "Potassium-39", atomicMass: 39.098, crossSection: 2.1, abundance: 93.258, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Ca-40": { name: "Calcium-40", atomicMass: 40.078, crossSection: 0.41, abundance: 96.941, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Fe-56": { name: "Iron-56", atomicMass: 55.845, crossSection: 2.59, abundance: 91.754, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Co-59": { name: "Cobalt-59", atomicMass: 58.933, crossSection: 37.18, abundance: 100, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Cu-63": { name: "Copper-63", atomicMass: 63.546, crossSection: 4.5, abundance: 69.15, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Zn-64": { name: "Zinc-64", atomicMass: 65.38, crossSection: 0.78, abundance: 48.63, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Ag-107": { name: "Silver-107", atomicMass: 107.868, crossSection: 37.6, abundance: 51.839, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Cd-114": { name: "Cadmium-114", atomicMass: 114.818, crossSection: 0.3, abundance: 28.73, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "In-115": { name: "Indium-115", atomicMass: 114.818, crossSection: 202, abundance: 95.7, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Au-197": { name: "Gold-197", atomicMass: 196.967, crossSection: 98.65, abundance: 100, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Hg-202": { name: "Mercury-202", atomicMass: 200.59, crossSection: 4.89, abundance: 29.86, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "Pb-208": { name: "Lead-208", atomicMass: 207.2, crossSection: 0.00048, abundance: 52.4, halfLife: 0, decayEnergy: 0, decayMode: "stable" },
  "U-235": { name: "Uranium-235", atomicMass: 238.029, crossSection: 98.3, abundance: 0.72, halfLife: 7.04e8, decayEnergy: 4.679, decayMode: "alpha" },
  "U-238": { name: "Uranium-238", atomicMass: 238.029, crossSection: 2.68, abundance: 99.275, halfLife: 4.468e9, decayEnergy: 4.267, decayMode: "alpha" }
};

// Product nuclides after activation (n,gamma reaction)
const PRODUCT_NUCLIDES = {
  "H-1": { product: "H-2", halfLife: 0, decayMode: "stable", decayEnergy: 0, gamma: [] },
  "H-2": { product: "H-3", halfLife: 12.32 * 365 * 24 * 3600, decayMode: "beta-", decayEnergy: 0.0186, gamma: [] },
  "C-12": { product: "C-13", halfLife: 0, decayMode: "stable", decayEnergy: 0, gamma: [] },
  "C-13": { product: "C-14", halfLife: 5730 * 365 * 24 * 3600, decayMode: "beta-", decayEnergy: 0.156, gamma: [] },
  "N-14": { product: "N-15", halfLife: 0, decayMode: "stable", decayEnergy: 0, gamma: [] },
  "O-16": { product: "O-17", halfLife: 0, decayMode: "stable", decayEnergy: 0, gamma: [] },
  "Na-23": { product: "Na-24", halfLife: 14.997 * 3600, decayMode: "beta-", decayEnergy: 5.515, gamma: [1.369, 2.754] },
  "Al-27": { product: "Al-28", halfLife: 134.4, decayMode: "beta-", decayEnergy: 4.642, gamma: [1.779] },
  "Si-28": { product: "Si-29", halfLife: 0, decayMode: "stable", decayEnergy: 0, gamma: [] },
  "P-31": { product: "P-32", halfLife: 14.263 * 24 * 3600, decayMode: "beta-", decayEnergy: 1.711, gamma: [] },
  "S-32": { product: "S-33", halfLife: 0, decayMode: "stable", decayEnergy: 0, gamma: [] },
  "Cl-35": { product: "Cl-36", halfLife: 3.01e5 * 365 * 24 * 3600, decayMode: "beta-", decayEnergy: 0.709, gamma: [] },
  "K-39": { product: "K-40", halfLife: 1.248e9 * 365 * 24 * 3600, decayMode: "beta-/EC", decayEnergy: 1.311, gamma: [1.461] },
  "Ca-40": { product: "Ca-41", halfLife: 1.02e5 * 365 * 24 * 3600, decayMode: "EC", decayEnergy: 0.421, gamma: [] },
  "Fe-56": { product: "Fe-57", halfLife: 0, decayMode: "stable", decayEnergy: 0, gamma: [] },
  "Co-59": { product: "Co-60", halfLife: 5.2714 * 365 * 24 * 3600, decayMode: "beta-", decayEnergy: 2.824, gamma: [1.173, 1.332] },
  "Cu-63": { product: "Cu-64", halfLife: 12.701 * 3600, decayMode: "beta+/beta-", decayEnergy: 1.673, gamma: [1.346] },
  "Zn-64": { product: "Zn-65", halfLife: 243.93 * 24 * 3600, decayMode: "EC", decayEnergy: 1.352, gamma: [1.116] },
  "Ag-107": { product: "Ag-108m", halfLife: 418 * 365 * 24 * 3600, decayMode: "EC/beta-", decayEnergy: 1.836, gamma: [0.434, 0.614, 0.723] },
  "Cd-114": { product: "Cd-115", halfLife: 53.46 * 3600, decayMode: "beta-", decayEnergy: 1.448, gamma: [0.528] },
  "In-115": { product: "In-116m", halfLife: 54.29 * 60, decayMode: "beta-", decayEnergy: 3.274, gamma: [1.097, 1.294, 2.112] },
  "Au-197": { product: "Au-198", halfLife: 2.6941 * 24 * 3600, decayMode: "beta-", decayEnergy: 1.372, gamma: [0.412] },
  "Hg-202": { product: "Hg-203", halfLife: 46.595 * 24 * 3600, decayMode: "beta-", decayEnergy: 0.492, gamma: [0.279] },
  "Pb-208": { product: "Pb-209", halfLife: 3.253 * 3600, decayMode: "beta-", decayEnergy: 0.644, gamma: [] },
  "U-235": { product: "U-236", halfLife: 2.342e7 * 365 * 24 * 3600, decayMode: "alpha", decayEnergy: 4.572, gamma: [0.049] },
  "U-238": { product: "U-239", halfLife: 23.45 * 60, decayMode: "beta-", decayEnergy: 1.262, gamma: [0.074] }
};

// Sample materials for quick setup
const SAMPLE_MATERIALS = [
  {
    name: "Stainless Steel 304",
    composition: [
      { element: "Fe-56", weight: 70.0 },
      { element: "Cr-52", weight: 18.0 },
      { element: "Ni-58", weight: 10.0 },
      { element: "Mn-55", weight: 2.0 }
    ]
  },
  {
    name: "Aluminum Alloy 6061",
    composition: [
      { element: "Al-27", weight: 97.9 },
      { element: "Mg-24", weight: 1.0 },
      { element: "Si-28", weight: 0.6 },
      { element: "Cu-63", weight: 0.28 },
      { element: "Cr-52", weight: 0.2 }
    ]
  },
  {
    name: "Concrete (Standard)",
    composition: [
      { element: "O-16", weight: 49.0 },
      { element: "Si-28", weight: 31.0 },
      { element: "Ca-40", weight: 8.0 },
      { element: "Al-27", weight: 5.0 },
      { element: "Fe-56", weight: 2.0 },
      { element: "Na-23", weight: 1.6 },
      { element: "K-39", weight: 1.4 },
      { element: "H-1", weight: 1.0 }
    ]
  },
  {
    name: "Biological Tissue (ICRU)",
    composition: [
      { element: "H-1", weight: 10.0 },
      { element: "C-12", weight: 14.0 },
      { element: "N-14", weight: 3.0 },
      { element: "O-16", weight: 71.0 },
      { element: "Na-23", weight: 0.2 },
      { element: "P-31", weight: 0.4 },
      { element: "S-32", weight: 0.2 },
      { element: "Cl-35", weight: 0.2 },
      { element: "K-39", weight: 0.3 }
    ]
  }
];

// Flux profiles for different neutron sources
const NEUTRON_SOURCES = {
  "thermal": {
    name: "Thermal Reactor",
    flux: 1.0e13, // n/cm²/s
    energy: 0.025, // eV
    description: "Moderated neutrons in a typical research reactor, predominantly thermal energy spectrum."
  },
  "fast": { 
    name: "Fast Reactor",
    flux: 5.0e14,
    energy: 1.0e6, // 1 MeV
    description: "Fast neutron spectrum typical in a sodium-cooled fast reactor."
  },
  "fusion": {
    name: "Fusion Source",
    flux: 1.0e14,
    energy: 14.1e6, // 14.1 MeV (D-T fusion)
    description: "High energy neutrons from deuterium-tritium fusion reactions."
  },
  "spallation": {
    name: "Spallation Source",
    flux: 5.0e16,
    energy: 1.0e6, // Mixed spectrum
    description: "Pulsed neutron source from spallation reactions, broad energy spectrum."
  }
};

const NeutronActivationCalculator = () => {
  // State variables for calculation parameters
  const [materialName, setMaterialName] = useState("");
  const [composition, setComposition] = useState([{ element: "Al-27", weight: 100 }]);
  const [neutronSource, setNeutronSource] = useState("thermal");
  const [neutronFlux, setNeutronFlux] = useState(1.0e13);
  const [irradiationTime, setIrradiationTime] = useState(3600); // 1 hour in seconds
  const [decayTime, setDecayTime] = useState(0); // 0 seconds
  const [sampleMass, setSampleMass] = useState(1.0); // 1 gram
  const [customSource, setCustomSource] = useState(false);
  
  // State variables for results
  const [activationResults, setActivationResults] = useState([]);
  const [totalActivity, setTotalActivity] = useState(0);
  const [chartData, setChartData] = useState(null);
  const [doseRate, setDoseRate] = useState(0);
  
  // Add new element to composition
  const addElement = () => {
    setComposition([...composition, { element: "Fe-56", weight: 0 }]);
  };
  
  // Remove element from composition
  const removeElement = (index) => {
    const newComposition = [...composition];
    newComposition.splice(index, 1);
    setComposition(newComposition);
  };
  
  // Handle composition change
  const handleCompositionChange = (index, field, value) => {
    const newComposition = [...composition];
    newComposition[index][field] = value;
    setComposition(newComposition);
  };
  
  // Apply sample material
  const applySampleMaterial = (materialIndex) => {
    if (materialIndex >= 0 && materialIndex < SAMPLE_MATERIALS.length) {
      setMaterialName(SAMPLE_MATERIALS[materialIndex].name);
      setComposition([...SAMPLE_MATERIALS[materialIndex].composition]);
    }
  };
  
  // Apply neutron source
  const applyNeutronSource = (sourceKey) => {
    if (NEUTRON_SOURCES[sourceKey]) {
      setNeutronSource(sourceKey);
      setNeutronFlux(NEUTRON_SOURCES[sourceKey].flux);
      setCustomSource(false);
    }
  };
  
  // Calculate activation
  useEffect(() => {
    // Skip calculation if no elements or flux/time is zero
    if (composition.length === 0 || neutronFlux <= 0 || irradiationTime <= 0) {
      setActivationResults([]);
      setTotalActivity(0);
      setChartData(null);
      return;
    }
    
    // Calculate activation for each element
    const results = composition.map(item => {
      const element = item.element;
      const weight = item.weight;
      
      // Skip if element not in database
      if (!ELEMENT_DATA[element] || !PRODUCT_NUCLIDES[element]) {
        return {
          element,
          product: "Unknown",
          activity: 0,
          halfLife: 0,
          decayMode: "unknown",
          dose: 0
        };
      }
      
      const elementData = ELEMENT_DATA[element];
      const productData = PRODUCT_NUCLIDES[element];
      
      // Number of atoms
      const atomicMass = elementData.atomicMass;
      const atoms = (weight / 100) * sampleMass * 6.022e23 / atomicMass;
      
      // Cross-section (adjust for energy if needed)
      const crossSection = elementData.crossSection * 1e-24; // convert from barns to cm²
      
      // Calculate saturation activity (Bq)
      const satActivity = atoms * crossSection * neutronFlux;
      
      // Calculate actual activity based on irradiation time and decay time
      let activity = 0;
      const lambda = productData.halfLife > 0 ? Math.log(2) / productData.halfLife : 0;
      
      if (lambda > 0) {
        // For radioactive products
        activity = satActivity * (1 - Math.exp(-lambda * irradiationTime)) * Math.exp(-lambda * decayTime);
      } else if (productData.halfLife === 0) {
        // For stable products (no decay)
        activity = 0;
      }
      
      // Estimate dose rate (simplified model, microSv/h at 1m)
      // Using dose conversion factor based on gamma energy and intensity
      let dose = 0;
      if (productData.gamma && productData.gamma.length > 0) {
        dose = activity * 0.00057 * productData.gamma.reduce((sum, energy) => sum + energy, 0) / Math.pow(100, 2);
      }
      
      return {
        element,
        product: productData.product,
        activity,
        halfLife: productData.halfLife,
        decayMode: productData.decayMode,
        gamma: productData.gamma,
        dose
      };
    });
    
    // Calculate total activity and dose rate
    const totalAct = results.reduce((sum, item) => sum + item.activity, 0);
    const totalDose = results.reduce((sum, item) => sum + item.dose, 0);
    
    setActivationResults(results);
    setTotalActivity(totalAct);
    setDoseRate(totalDose);
    
    // Generate decay curve for chart
    if (totalAct > 0) {
      const times = [];
      const activities = [];
      const doses = [];
      
      // Get maximum half-life for time scale
      const maxHalfLife = Math.max(...results.map(item => item.halfLife).filter(t => t > 0));
      
      if (maxHalfLife > 0) {
        // Generate time points from 0 to 10 half-lives
        const maxTime = Math.min(maxHalfLife * 10, 3.154e7 * 100); // Cap at 100 years
        const timePoints = 100;
        
        for (let i = 0; i < timePoints; i++) {
          // Use logarithmic scale for time
          const t = i === 0 ? 0 : Math.exp(Math.log(1 + maxTime) * i / (timePoints - 1)) - 1;
          times.push(t);
          
          // Calculate total activity at this time
          let activityAtTime = 0;
          let doseAtTime = 0;
          
          for (const item of results) {
            if (item.halfLife > 0) {
              const lambda = Math.log(2) / item.halfLife;
              
              // Calculate activity using item's properties
              const elementData = ELEMENT_DATA[item.element];
              const weight = composition.find(comp => comp.element === item.element)?.weight || 0;
              const atomicMass = elementData?.atomicMass || 1;
              const atoms = (weight / 100) * sampleMass * 6.022e23 / atomicMass;
              const crossSection = (elementData?.crossSection || 0) * 1e-24; // convert from barns to cm²
              const itemSatActivity = atoms * crossSection * neutronFlux;
              
              const act = itemSatActivity * (1 - Math.exp(-lambda * irradiationTime)) * Math.exp(-lambda * (decayTime + t));
              activityAtTime += act;
              
              // Calculate dose
              if (item.gamma && item.gamma.length > 0) {
                doseAtTime += act * 0.00057 * item.gamma.reduce((sum, energy) => sum + energy, 0) / Math.pow(100, 2);
              }
            }
          }
          
          activities.push(activityAtTime);
          doses.push(doseAtTime);
        }
        
        setChartData({
          labels: times,
          datasets: [
            {
              label: 'Activity (Bq)',
              data: activities,
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              yAxisID: 'y'
            },
            {
              label: 'Dose Rate (µSv/h at 1m)',
              data: doses,
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
              yAxisID: 'y1'
            }
          ]
        });
      } else {
        setChartData(null);
      }
    } else {
      setChartData(null);
    }
  }, [composition, neutronFlux, irradiationTime, decayTime, sampleMass]);
  
  // Format time for display
  const formatTime = (seconds) => {
    if (seconds === 0) return "stable";
    if (seconds < 60) return `${seconds.toFixed(1)} seconds`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)} minutes`;
    if (seconds < 86400) return `${(seconds / 3600).toFixed(1)} hours`;
    if (seconds < 31536000) return `${(seconds / 86400).toFixed(1)} days`;
    return `${(seconds / 31536000).toFixed(1)} years`;
  };
  
  // Format activity for display
  const formatActivity = (becquerels) => {
    if (becquerels === 0) return "0 Bq";
    if (becquerels < 1000) return `${becquerels.toFixed(2)} Bq`;
    if (becquerels < 1e6) return `${(becquerels / 1e3).toFixed(2)} kBq`;
    if (becquerels < 1e9) return `${(becquerels / 1e6).toFixed(2)} MBq`;
    if (becquerels < 1e12) return `${(becquerels / 1e9).toFixed(2)} GBq`;
    return `${(becquerels / 1e12).toFixed(2)} TBq`;
  };
  
  // Export data as CSV
  const exportData = () => {
    if (activationResults.length === 0) return;
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Element,Product,Activity (Bq),Half-Life,Decay Mode,Dose Rate (µSv/h at 1m)\n"
      + activationResults.map(item => 
          `${item.element},${item.product},${item.activity},${formatTime(item.halfLife)},${item.decayMode},${item.dose.toExponential(4)}`
        ).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `neutron-activation-${materialName || "custom"}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }} id="neutron-activation-calculator">
      <Typography variant="h4" gutterBottom>
        Neutron Activation Calculator
        <Tooltip title="This calculator estimates the activation of materials exposed to neutron radiation. It calculates induced radioactivity, dose rates, and decay characteristics based on material composition and neutron irradiation parameters.">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        {/* Input Parameters */}
        <Grid item xs={12} md={5}>
          <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>Material Composition</Typography>
            
            <TextField
              label="Material Name"
              value={materialName}
              onChange={(e) => setMaterialName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Sample Material</InputLabel>
              <Select
                value=""
                label="Sample Material"
                onChange={(e) => applySampleMaterial(Number(e.target.value))}
              >
                <MenuItem value="">Select a predefined material</MenuItem>
                {SAMPLE_MATERIALS.map((material, index) => (
                  <MenuItem key={index} value={index}>{material.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
              Composition (wt%)
            </Typography>
            
            {composition.map((item, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <FormControl sx={{ flexGrow: 1, mr: 1 }}>
                  <InputLabel size="small">Element</InputLabel>
                  <Select
                    value={item.element}
                    label="Element"
                    size="small"
                    onChange={(e) => handleCompositionChange(index, 'element', e.target.value)}
                  >
                    {Object.keys(ELEMENT_DATA).map(key => (
                      <MenuItem key={key} value={key}>{ELEMENT_DATA[key].name} ({key})</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Weight %"
                  type="number"
                  value={item.weight}
                  onChange={(e) => handleCompositionChange(index, 'weight', Number(e.target.value))}
                  size="small"
                  sx={{ width: '120px', mr: 1 }}
                  InputProps={{ inputProps: { min: 0, max: 100, step: 0.1 } }}
                />
                <Button 
                  size="small" 
                  color="error" 
                  variant="outlined"
                  onClick={() => removeElement(index)}
                  disabled={composition.length <= 1}
                >
                  X
                </Button>
              </Box>
            ))}
            
            <Button 
              variant="outlined" 
              size="small"
              onClick={addElement}
              sx={{ mt: 1 }}
            >
              Add Element
            </Button>
            
            <Box sx={{ mt: 4, mb: 2 }}>
              <TextField
                label="Sample Mass (g)"
                type="number"
                fullWidth
                value={sampleMass}
                onChange={(e) => setSampleMass(Number(e.target.value))}
                sx={{ mb: 2 }}
                InputProps={{ inputProps: { min: 0, step: 0.1 } }}
              />
            </Box>
          </Paper>
          
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Irradiation Parameters</Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Neutron Source</InputLabel>
              <Select
                value={customSource ? "" : neutronSource}
                label="Neutron Source"
                onChange={(e) => {
                  if (e.target.value) {
                    applyNeutronSource(e.target.value);
                  } else {
                    setCustomSource(true);
                  }
                }}
              >
                <MenuItem value="">Custom</MenuItem>
                {Object.keys(NEUTRON_SOURCES).map((key) => (
                  <MenuItem key={key} value={key}>{NEUTRON_SOURCES[key].name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <TextField
              label="Neutron Flux (n/cm²/s)"
              type="number"
              fullWidth
              value={neutronFlux}
              onChange={(e) => setNeutronFlux(Number(e.target.value))}
              sx={{ mb: 2 }}
            />
            
            <TextField
              label="Irradiation Time (seconds)"
              type="number"
              fullWidth
              value={irradiationTime}
              onChange={(e) => setIrradiationTime(Number(e.target.value))}
              sx={{ mb: 2 }}
              InputProps={{ inputProps: { min: 0 } }}
            />
            
            <TextField
              label="Decay Time (seconds)"
              type="number"
              fullWidth
              value={decayTime}
              onChange={(e) => setDecayTime(Number(e.target.value))}
              InputProps={{ inputProps: { min: 0 } }}
            />
            
            <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
              <Button 
                variant="outlined" 
                onClick={() => setIrradiationTime(3600)} 
                size="small"
              >
                1 hour
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setIrradiationTime(24 * 3600)} 
                size="small"
              >
                1 day
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setIrradiationTime(30 * 24 * 3600)} 
                size="small"
              >
                30 days
              </Button>
            </Stack>
            
            <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
              <Button 
                variant="outlined" 
                onClick={() => setDecayTime(3600)} 
                size="small"
                color="secondary"
              >
                1 hour
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setDecayTime(24 * 3600)} 
                size="small"
                color="secondary"
              >
                1 day
              </Button>
              <Button 
                variant="outlined" 
                onClick={() => setDecayTime(30 * 24 * 3600)} 
                size="small"
                color="secondary"
              >
                30 days
              </Button>
            </Stack>
          </Paper>
          
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<DownloadIcon />}
            onClick={exportData}
            fullWidth
            sx={{ mt: 2 }}
            disabled={activationResults.length === 0}
          >
            Export Results
          </Button>
        </Grid>
        
        {/* Results */}
        <Grid item xs={12} md={7}>
          <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>Results Summary</Typography>
            
            <Grid container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={6}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="subtitle2">Total Activity</Typography>
                  <Typography variant="h5">{formatActivity(totalActivity)}</Typography>
                </Paper>
              </Grid>
              <Grid item xs={6}>
                <Paper elevation={1} sx={{ p: 2, textAlign: 'center', bgcolor: 'secondary.light', color: 'white' }}>
                  <Typography variant="subtitle2">Dose Rate at 1 meter</Typography>
                  <Typography variant="h5">{doseRate.toExponential(4)} µSv/h</Typography>
                </Paper>
              </Grid>
            </Grid>
            
            {doseRate > 10 && (
              <Alert severity="error" sx={{ mb: 2 }}>
                Warning: Estimated dose rate exceeds recommended handling limits!
              </Alert>
            )}
            
            <Typography variant="subtitle1" gutterBottom>
              Activation Products:
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3, maxHeight: 300, overflow: 'auto' }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Element</TableCell>
                    <TableCell>Product</TableCell>
                    <TableCell>Activity</TableCell>
                    <TableCell>Half-Life</TableCell>
                    <TableCell>Dose (µSv/h)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {activationResults
                    .filter(item => item.activity > 0)
                    .sort((a, b) => b.activity - a.activity)
                    .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.element}</TableCell>
                      <TableCell>{item.product}</TableCell>
                      <TableCell>{formatActivity(item.activity)}</TableCell>
                      <TableCell>{formatTime(item.halfLife)}</TableCell>
                      <TableCell>{item.dose.toExponential(2)}</TableCell>
                    </TableRow>
                  ))}
                  {activationResults.filter(item => item.activity > 0).length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} align="center">No significant activation products</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            
            {chartData && (
              <Box sx={{ height: 300 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Decay Curve:
                </Typography>
                <Line
                  data={chartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      x: {
                        title: {
                          display: true,
                          text: 'Time (seconds)'
                        },
                        type: 'logarithmic',
                        min: 1
                      },
                      y: {
                        title: {
                          display: true,
                          text: 'Activity (Bq)'
                        },
                        type: 'logarithmic',
                        position: 'left'
                      },
                      y1: {
                        title: {
                          display: true,
                          text: 'Dose Rate (µSv/h)'
                        },
                        type: 'logarithmic',
                        position: 'right',
                        grid: {
                          drawOnChartArea: false
                        }
                      }
                    }
                  }}
                />
              </Box>
            )}
          </Paper>
          
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Neutron Activation Theory</Typography>
            <Typography variant="body2" paragraph>
              Neutron activation is the process where stable isotopes capture neutrons and become radioactive. The activation depends on:
            </Typography>
            
            <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1, my: 2 }}>
              <Typography variant="subtitle2" sx={{ fontFamily: 'monospace' }}>
                A = N·σ·φ·(1-e<sup>-λt</sup>)·e<sup>-λt<sub>d</sub></sup>
              </Typography>
            </Box>
            
            <Typography component="ul" variant="body2" sx={{ pl: 2 }}>
              <li>A = Activity (Bq)</li>
              <li>N = Number of target atoms</li>
              <li>σ = Neutron capture cross-section (cm²)</li>
              <li>φ = Neutron flux (n/cm²/s)</li>
              <li>λ = Decay constant (0.693/half-life)</li>
              <li>t = Irradiation time</li>
              <li>t<sub>d</sub> = Decay time after irradiation</li>
            </Typography>
            
            <Typography variant="body2" paragraph sx={{ mt: 2 }}>
              The calculator accounts for material composition, neutron flux, irradiation time, and decay time to estimate induced radioactivity and resulting dose rates from the activated material.
            </Typography>
            
            <Alert severity="info" sx={{ mt: 2 }}>
              <Typography variant="body2">
                Note: This calculator provides estimates for educational purposes. Actual activation may vary due to neutron energy spectrum effects, self-shielding, and complex decay chains. Professional analysis is required for safety-critical applications.
              </Typography>
            </Alert>
          </Paper>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default NeutronActivationCalculator;