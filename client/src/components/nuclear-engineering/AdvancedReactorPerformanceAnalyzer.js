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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import CalculateIcon from '@mui/icons-material/Calculate';
import DeleteIcon from '@mui/icons-material/Delete';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar, Radar, Doughnut } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

// Register Chart.js components
ChartJS.register(...registerables, annotationPlugin);

// Reactor design presets
const REACTOR_DESIGNS = {
  pwr: {
    name: 'Traditional PWR',
    thermalPower: 3200,
    electricalEfficiency: 33,
    fuelEnrichment: 4.95,
    fuelCycleDuration: 18,
    coolingSystem: 'active',
    containmentType: 'large-dry',
    safetySystem: 'active',
    operationalLifetime: 60,
    constructionTime: 72,
    capitalCost: 5500,
    operationalCost: 25,
    fuelCost: 9.2,
    wasteProduction: 20,
    landUse: 40,
    carbonIntensity: 12,
    waterUsage: 2700,
    fuelUtilization: 4.5,
    powerDensity: 100,
    loadFollowingCapability: 50,
    accidentRiskIndex: 1.0,
    proliferationResistance: 3,
    publicAcceptance: 2.5
  },
  bwr: {
    name: 'Traditional BWR',
    thermalPower: 3900,
    electricalEfficiency: 34,
    fuelEnrichment: 4.5,
    fuelCycleDuration: 24,
    coolingSystem: 'active',
    containmentType: 'pressure-suppression',
    safetySystem: 'active',
    operationalLifetime: 60,
    constructionTime: 70,
    capitalCost: 5300,
    operationalCost: 24,
    fuelCost: 8.8,
    wasteProduction: 22,
    landUse: 45,
    carbonIntensity: 13,
    waterUsage: 2500,
    fuelUtilization: 4.8,
    powerDensity: 55,
    loadFollowingCapability: 60,
    accidentRiskIndex: 1.1,
    proliferationResistance: 3,
    publicAcceptance: 2.3
  },
  apwr: {
    name: 'Advanced PWR (AP1000)',
    thermalPower: 3400,
    electricalEfficiency: 35,
    fuelEnrichment: 4.8,
    fuelCycleDuration: 18,
    coolingSystem: 'passive',
    containmentType: 'steel',
    safetySystem: 'passive',
    operationalLifetime: 60,
    constructionTime: 60,
    capitalCost: 6000,
    operationalCost: 22,
    fuelCost: 9.0,
    wasteProduction: 19,
    landUse: 35,
    carbonIntensity: 11,
    waterUsage: 2400,
    fuelUtilization: 5.0,
    powerDensity: 105,
    loadFollowingCapability: 60,
    accidentRiskIndex: 0.7,
    proliferationResistance: 3.5,
    publicAcceptance: 3.0
  },
  esbwr: {
    name: 'Economic Simplified BWR',
    thermalPower: 4500,
    electricalEfficiency: 36,
    fuelEnrichment: 4.9,
    fuelCycleDuration: 24,
    coolingSystem: 'passive',
    containmentType: 'reinforced',
    safetySystem: 'passive',
    operationalLifetime: 60,
    constructionTime: 54,
    capitalCost: 5800,
    operationalCost: 21,
    fuelCost: 8.9,
    wasteProduction: 18,
    landUse: 32,
    carbonIntensity: 10,
    waterUsage: 2200,
    fuelUtilization: 5.2,
    powerDensity: 58,
    loadFollowingCapability: 65,
    accidentRiskIndex: 0.6,
    proliferationResistance: 3.5,
    publicAcceptance: 3.2
  },
  smr: {
    name: 'Small Modular Reactor',
    thermalPower: 600,
    electricalEfficiency: 31,
    fuelEnrichment: 4.95,
    fuelCycleDuration: 36,
    coolingSystem: 'passive',
    containmentType: 'integral',
    safetySystem: 'passive',
    operationalLifetime: 60,
    constructionTime: 36,
    capitalCost: 7000,
    operationalCost: 28,
    fuelCost: 9.5,
    wasteProduction: 15,
    landUse: 20,
    carbonIntensity: 14,
    waterUsage: 1800,
    fuelUtilization: 4.8,
    powerDensity: 90,
    loadFollowingCapability: 85,
    accidentRiskIndex: 0.5,
    proliferationResistance: 4.0,
    publicAcceptance: 3.8
  },
  sfr: {
    name: 'Sodium-cooled Fast Reactor',
    thermalPower: 1500,
    electricalEfficiency: 40,
    fuelEnrichment: 19.5,
    fuelCycleDuration: 24,
    coolingSystem: 'active',
    containmentType: 'containment-dome',
    safetySystem: 'hybrid',
    operationalLifetime: 60,
    constructionTime: 84,
    capitalCost: 7500,
    operationalCost: 30,
    fuelCost: 12.0,
    wasteProduction: 8,
    landUse: 30,
    carbonIntensity: 8,
    waterUsage: 1500,
    fuelUtilization: 80.0,
    powerDensity: 350,
    loadFollowingCapability: 40,
    accidentRiskIndex: 1.4,
    proliferationResistance: 2.0,
    publicAcceptance: 2.0
  },
  msr: {
    name: 'Molten Salt Reactor',
    thermalPower: 750,
    electricalEfficiency: 44,
    fuelEnrichment: 5.0,
    fuelCycleDuration: 84,
    coolingSystem: 'active',
    containmentType: 'multi-barrier',
    safetySystem: 'inherent',
    operationalLifetime: 60,
    constructionTime: 48,
    capitalCost: 6800,
    operationalCost: 24,
    fuelCost: 8.0,
    wasteProduction: 5,
    landUse: 25,
    carbonIntensity: 6,
    waterUsage: 1200,
    fuelUtilization: 85.0,
    powerDensity: 22,
    loadFollowingCapability: 90,
    accidentRiskIndex: 0.4,
    proliferationResistance: 3.8,
    publicAcceptance: 3.0
  },
  htgr: {
    name: 'High-Temperature Gas Reactor',
    thermalPower: 600,
    electricalEfficiency: 42,
    fuelEnrichment: 15.5,
    fuelCycleDuration: 30,
    coolingSystem: 'active',
    containmentType: 'concrete',
    safetySystem: 'passive',
    operationalLifetime: 60,
    constructionTime: 60,
    capitalCost: 6500,
    operationalCost: 27,
    fuelCost: 11.0,
    wasteProduction: 12,
    landUse: 30,
    carbonIntensity: 7,
    waterUsage: 900,
    fuelUtilization: 15.0,
    powerDensity: 6,
    loadFollowingCapability: 70,
    accidentRiskIndex: 0.5,
    proliferationResistance: 4.5,
    publicAcceptance: 3.2
  },
  lfr: {
    name: 'Lead-cooled Fast Reactor',
    thermalPower: 1200,
    electricalEfficiency: 42,
    fuelEnrichment: 19.0,
    fuelCycleDuration: 30,
    coolingSystem: 'active',
    containmentType: 'compact',
    safetySystem: 'passive',
    operationalLifetime: 60,
    constructionTime: 72,
    capitalCost: 7000,
    operationalCost: 29,
    fuelCost: 11.5,
    wasteProduction: 7,
    landUse: 28,
    carbonIntensity: 7,
    waterUsage: 1300,
    fuelUtilization: 75.0,
    powerDensity: 100,
    loadFollowingCapability: 45,
    accidentRiskIndex: 0.8,
    proliferationResistance: 2.5,
    publicAcceptance: 2.8
  },
  fusion: {
    name: 'Fusion Reactor (Projected)',
    thermalPower: 2000,
    electricalEfficiency: 40,
    fuelEnrichment: 0,
    fuelCycleDuration: 12,
    coolingSystem: 'active',
    containmentType: 'magnetic',
    safetySystem: 'inherent',
    operationalLifetime: 40,
    constructionTime: 120,
    capitalCost: 12000,
    operationalCost: 35,
    fuelCost: 4.0,
    wasteProduction: 2,
    landUse: 45,
    carbonIntensity: 3,
    waterUsage: 1800,
    fuelUtilization: 100.0,
    powerDensity: 5,
    loadFollowingCapability: 30,
    accidentRiskIndex: 0.2,
    proliferationResistance: 5.0,
    publicAcceptance: 4.5
  }
};

// Parameter descriptions for tooltips
const PARAMETER_DESCRIPTIONS = {
  thermalPower: 'Reactor thermal output in MWth',
  electricalEfficiency: 'Conversion efficiency from thermal to electrical energy (%)',
  fuelEnrichment: 'Percentage of fissile isotopes in the fuel (%)',
  fuelCycleDuration: 'Duration between refueling operations (months)',
  coolingSystem: 'Primary cooling system type',
  containmentType: 'Design of the reactor containment structure',
  safetySystem: 'Primary safety system philosophy',
  operationalLifetime: 'Expected operational period (years)',
  constructionTime: 'Expected time from groundbreaking to operation (months)',
  capitalCost: 'Overnight capital cost ($/kWe)',
  operationalCost: 'Fixed and variable O&M costs ($/MWh)',
  fuelCost: 'Levelized fuel cost ($/MWh)',
  wasteProduction: 'Spent fuel and waste generation (m³/GWe-year)',
  landUse: 'Land area required for the plant (hectares/GWe)',
  carbonIntensity: 'Lifecycle carbon emissions (gCO₂-eq/kWh)',
  waterUsage: 'Cooling water withdrawal (m³/GWh)',
  fuelUtilization: 'Percentage of fuel energy potential utilized (%)',
  powerDensity: 'Core power density (MW/m³)',
  loadFollowingCapability: 'Ability to adjust output to match demand (%)',
  accidentRiskIndex: 'Relative risk of severe accidents (index)',
  proliferationResistance: 'Resistance to materials diversion (scale 1-5)',
  publicAcceptance: 'Public perception favorability (scale 1-5)'
};

// Define parameter categories for organization
const PARAMETER_CATEGORIES = {
  technical: [
    'thermalPower',
    'electricalEfficiency',
    'fuelEnrichment',
    'fuelCycleDuration',
    'coolingSystem',
    'containmentType',
    'safetySystem',
    'operationalLifetime'
  ],
  economic: [
    'constructionTime',
    'capitalCost',
    'operationalCost',
    'fuelCost'
  ],
  environmental: [
    'wasteProduction',
    'landUse',
    'carbonIntensity',
    'waterUsage',
    'fuelUtilization'
  ],
  operational: [
    'powerDensity',
    'loadFollowingCapability',
    'accidentRiskIndex',
    'proliferationResistance',
    'publicAcceptance'
  ]
};

// Tab panel component for tabbed interface
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`reactor-tabpanel-${index}`}
      aria-labelledby={`reactor-tab-${index}`}
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

const AdvancedReactorPerformanceAnalyzer = () => {
  // State for reactor designs to compare
  const [selectedReactors, setSelectedReactors] = useState(['pwr', 'apwr']);
  const [customReactor, setCustomReactor] = useState(null);
  const [isCustomized, setIsCustomized] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [activeMetricCategory, setActiveMetricCategory] = useState('technical');
  const [weightings, setWeightings] = useState({
    technical: 25,
    economic: 25,
    environmental: 25,
    operational: 25
  });
  const [showNormalized, setShowNormalized] = useState(false);
  
  // Chart references
  const radarChartRef = useRef(null);
  const barChartRef = useRef(null);
  const doughnutChartRef = useRef(null);
  
  // Initialize custom reactor from PWR template
  useEffect(() => {
    if (!customReactor) {
      setCustomReactor({...REACTOR_DESIGNS.pwr, name: 'Custom Design'});
    }
  }, [customReactor]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  // Add reactor to comparison
  const addReactorToComparison = (reactorKey) => {
    if (selectedReactors.includes(reactorKey)) return;
    if (selectedReactors.length >= 4) {
      // Remove the oldest selection if we already have 4
      setSelectedReactors([...selectedReactors.slice(1), reactorKey]);
    } else {
      setSelectedReactors([...selectedReactors, reactorKey]);
    }
  };
  
  // Remove reactor from comparison
  const removeReactorFromComparison = (reactorKey) => {
    if (selectedReactors.length <= 1) return; // Keep at least one
    setSelectedReactors(selectedReactors.filter(r => r !== reactorKey));
  };
  
  // Handle custom reactor parameter change
  const handleCustomReactorChange = (parameter, value) => {
    if (!customReactor) return;
    
    setCustomReactor({
      ...customReactor,
      [parameter]: value
    });
    
    if (!isCustomized) {
      setIsCustomized(true);
    }
  };
  
  // Use custom reactor in comparison
  const useCustomReactor = () => {
    // If custom reactor is already in the comparison, remove it first
    const newSelection = selectedReactors.filter(r => r !== 'custom');
    
    // Add custom to the comparison
    if (newSelection.length >= 4) {
      setSelectedReactors([...newSelection.slice(1), 'custom']);
    } else {
      setSelectedReactors([...newSelection, 'custom']);
    }
  };
  
  // Handle changes to category weightings
  const handleWeightingChange = (category, value) => {
    const newWeightings = { ...weightings, [category]: value };
    
    // Recalculate to ensure total is 100%
    const total = Object.values(newWeightings).reduce((sum, val) => sum + val, 0);
    
    if (total !== 100) {
      // Adjust other categories proportionally
      const adjust = (100 - value) / (total - newWeightings[category]);
      
      Object.keys(newWeightings).forEach(key => {
        if (key !== category) {
          newWeightings[key] = Math.round(newWeightings[key] * adjust);
        }
      });
      
      // Fix any rounding errors
      const newTotal = Object.values(newWeightings).reduce((sum, val) => sum + val, 0);
      if (newTotal !== 100) {
        const diff = 100 - newTotal;
        // Add the difference to the largest category that's not the one being changed
        const largest = Object.entries(newWeightings)
          .filter(([key]) => key !== category)
          .sort(([, a], [, b]) => b - a)[0][0];
        
        newWeightings[largest] += diff;
      }
    }
    
    setWeightings(newWeightings);
  };
  
  // Calculate numerical score for a reactor design
  const calculateReactorScore = (reactorKey) => {
    let reactor;
    if (reactorKey === 'custom') {
      reactor = customReactor;
    } else {
      reactor = REACTOR_DESIGNS[reactorKey];
    }
    
    if (!reactor) return { total: 0, categories: {} };
    
    // Define min-max ranges for normalization
    const parameterRanges = {
      thermalPower: { min: 0, max: 5000, higher: true },
      electricalEfficiency: { min: 30, max: 45, higher: true },
      fuelEnrichment: { min: 0, max: 20, higher: false },
      fuelCycleDuration: { min: 12, max: 84, higher: true },
      operationalLifetime: { min: 40, max: 80, higher: true },
      constructionTime: { min: 36, max: 120, higher: false },
      capitalCost: { min: 5000, max: 12000, higher: false },
      operationalCost: { min: 20, max: 40, higher: false },
      fuelCost: { min: 4, max: 12, higher: false },
      wasteProduction: { min: 2, max: 25, higher: false },
      landUse: { min: 20, max: 50, higher: false },
      carbonIntensity: { min: 3, max: 15, higher: false },
      waterUsage: { min: 900, max: 3000, higher: false },
      fuelUtilization: { min: 4, max: 100, higher: true },
      powerDensity: { min: 5, max: 350, higher: true },
      loadFollowingCapability: { min: 30, max: 90, higher: true },
      accidentRiskIndex: { min: 0.2, max: 1.5, higher: false },
      proliferationResistance: { min: 1, max: 5, higher: true },
      publicAcceptance: { min: 1, max: 5, higher: true }
    };
    
    // Calculate scores by category
    const categoryScores = {};
    
    Object.keys(PARAMETER_CATEGORIES).forEach(category => {
      const params = PARAMETER_CATEGORIES[category];
      let categoryScore = 0;
      
      params.forEach(param => {
        if (typeof reactor[param] === 'number' && parameterRanges[param]) {
          const { min, max, higher } = parameterRanges[param];
          const range = max - min;
          
          // Normalize to 0-100 scale
          let normalizedValue = (reactor[param] - min) / range * 100;
          
          // For parameters where lower is better, invert score
          if (!higher) {
            normalizedValue = 100 - normalizedValue;
          }
          
          // Clamp values
          normalizedValue = Math.max(0, Math.min(100, normalizedValue));
          
          // Add to category score (equal weighting within category)
          categoryScore += normalizedValue / params.length;
        }
      });
      
      categoryScores[category] = categoryScore;
    });
    
    // Calculate total weighted score
    const totalScore = Object.keys(categoryScores).reduce((sum, category) => {
      return sum + (categoryScores[category] * (weightings[category] / 100));
    }, 0);
    
    return {
      total: totalScore,
      categories: categoryScores
    };
  };
  
  // Prepare radar chart data for reactor comparison
  const getRadarChartData = () => {
    const categories = Object.keys(PARAMETER_CATEGORIES);
    
    const datasets = selectedReactors.map((reactorKey, index) => {
      const reactor = reactorKey === 'custom' ? customReactor : REACTOR_DESIGNS[reactorKey];
      const score = calculateReactorScore(reactorKey);
      
      return {
        label: reactor.name,
        data: categories.map(category => score.categories[category]),
        borderColor: getReactorColor(index),
        backgroundColor: getReactorColor(index, 0.2),
        pointBackgroundColor: getReactorColor(index),
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: getReactorColor(index)
      };
    });
    
    return {
      labels: ['Technical', 'Economic', 'Environmental', 'Operational'],
      datasets
    };
  };
  
  // Prepare data for bar chart comparison
  const getBarChartData = () => {
    const metrics = PARAMETER_CATEGORIES[activeMetricCategory];
    const datasets = [];
    
    selectedReactors.forEach((reactorKey, index) => {
      const reactor = reactorKey === 'custom' ? customReactor : REACTOR_DESIGNS[reactorKey];
      
      datasets.push({
        label: reactor.name,
        data: metrics.map(metric => {
          if (showNormalized && (typeof reactor[metric] === 'number')) {
            // Normalize the value
            const { min, max, higher } = {
              thermalPower: { min: 0, max: 5000, higher: true },
              electricalEfficiency: { min: 30, max: 45, higher: true },
              fuelEnrichment: { min: 0, max: 20, higher: false },
              fuelCycleDuration: { min: 12, max: 84, higher: true },
              operationalLifetime: { min: 40, max: 80, higher: true },
              constructionTime: { min: 36, max: 120, higher: false },
              capitalCost: { min: 5000, max: 12000, higher: false },
              operationalCost: { min: 20, max: 40, higher: false },
              fuelCost: { min: 4, max: 12, higher: false },
              wasteProduction: { min: 2, max: 25, higher: false },
              landUse: { min: 20, max: 50, higher: false },
              carbonIntensity: { min: 3, max: 15, higher: false },
              waterUsage: { min: 900, max: 3000, higher: false },
              fuelUtilization: { min: 4, max: 100, higher: true },
              powerDensity: { min: 5, max: 350, higher: true },
              loadFollowingCapability: { min: 30, max: 90, higher: true },
              accidentRiskIndex: { min: 0.2, max: 1.5, higher: false },
              proliferationResistance: { min: 1, max: 5, higher: true },
              publicAcceptance: { min: 1, max: 5, higher: true }
            }[metric] || { min: 0, max: 100, higher: true };
            
            const range = max - min;
            let normalizedValue = (reactor[metric] - min) / range * 100;
            
            if (!higher) {
              normalizedValue = 100 - normalizedValue;
            }
            
            return Math.max(0, Math.min(100, normalizedValue));
          }
          return reactor[metric];
        }),
        backgroundColor: getReactorColor(index, 0.7),
        borderColor: getReactorColor(index),
        borderWidth: 1
      });
    });
    
    return {
      labels: metrics.map(formatMetricLabel),
      datasets
    };
  };
  
  // Prepare data for overall score doughnut chart
  const getDoughnutChartData = () => {
    const reactorScores = selectedReactors.map(reactorKey => {
      const reactor = reactorKey === 'custom' ? customReactor : REACTOR_DESIGNS[reactorKey];
      const score = calculateReactorScore(reactorKey);
      
      return {
        name: reactor.name,
        score: score.total
      };
    });
    
    return {
      labels: reactorScores.map(r => r.name),
      datasets: [{
        data: reactorScores.map(r => r.score),
        backgroundColor: selectedReactors.map((_, i) => getReactorColor(i, 0.7)),
        borderColor: selectedReactors.map((_, i) => getReactorColor(i)),
        borderWidth: 1
      }]
    };
  };
  
  // Get color for reactor visualization
  const getReactorColor = (index, alpha = 1) => {
    const colors = [
      `rgba(255, 99, 132, ${alpha})`,   // Red
      `rgba(54, 162, 235, ${alpha})`,   // Blue
      `rgba(255, 206, 86, ${alpha})`,   // Yellow
      `rgba(75, 192, 192, ${alpha})`,   // Green
      `rgba(153, 102, 255, ${alpha})`,  // Purple
      `rgba(255, 159, 64, ${alpha})`    // Orange
    ];
    
    return colors[index % colors.length];
  };
  
  // Format metric label for display
  const formatMetricLabel = (metric) => {
    return metric
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/([a-z])([A-Z])/g, '$1 $2');
  };
  
  // Export comparison data as CSV
  const exportComparisonData = () => {
    const reactors = selectedReactors.map(key => key === 'custom' ? customReactor : REACTOR_DESIGNS[key]);
    const allParams = [].concat(...Object.values(PARAMETER_CATEGORIES));
    
    let csvContent = "data:text/csv;charset=utf-8,Parameter";
    
    // Add reactor names as header row
    reactors.forEach(reactor => {
      csvContent += `,${reactor.name}`;
    });
    csvContent += "\n";
    
    // Add each parameter
    allParams.forEach(param => {
      csvContent += formatMetricLabel(param);
      
      reactors.forEach(reactor => {
        csvContent += `,${reactor[param]}`;
      });
      csvContent += "\n";
    });
    
    // Add score data
    csvContent += "\nScores\n";
    Object.keys(PARAMETER_CATEGORIES).forEach(category => {
      csvContent += formatMetricLabel(category);
      
      selectedReactors.forEach(reactorKey => {
        const score = calculateReactorScore(reactorKey);
        csvContent += `,${score.categories[category].toFixed(1)}`;
      });
      csvContent += "\n";
    });
    
    csvContent += "Overall Score";
    selectedReactors.forEach(reactorKey => {
      const score = calculateReactorScore(reactorKey);
      csvContent += `,${score.total.toFixed(1)}`;
    });
    
    // Create download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "reactor_comparison.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3, borderRadius: 2 }} id="advanced-reactor-analyzer">
      <Typography variant="h4" gutterBottom>
        Advanced Reactor Performance Analyzer
        <Tooltip title="Compare different reactor designs across technical, economic, environmental, and operational metrics. Customize parameters and weightings to assess overall performance.">
          <IconButton size="small" sx={{ ml: 1 }}>
            <InfoIcon />
          </IconButton>
        </Tooltip>
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="reactor analyzer tabs">
          <Tab label="Reactor Comparison" />
          <Tab label="Custom Design" />
          <Tab label="Metrics & Weightings" />
          <Tab label="Analysis" />
        </Tabs>
      </Box>
      
      {/* Reactor Comparison Tab */}
      <TabPanel value={tabValue} index={0}>
        <Typography variant="h6" gutterBottom>Compare Reactor Designs</Typography>
        
        <Grid container spacing={3}>
          {/* Reactor Selection */}
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Selected Designs</Typography>
              
              <Box sx={{ mb: 2 }}>
                {selectedReactors.map(reactorKey => {
                  const reactor = reactorKey === 'custom' ? customReactor : REACTOR_DESIGNS[reactorKey];
                  return (
                    <Chip
                      key={reactorKey}
                      label={reactor.name}
                      onDelete={() => removeReactorFromComparison(reactorKey)}
                      sx={{ m: 0.5 }}
                      color="primary"
                      variant="outlined"
                    />
                  );
                })}
              </Box>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Add Reactor Design</InputLabel>
                <Select
                  value=""
                  label="Add Reactor Design"
                  onChange={(e) => addReactorToComparison(e.target.value)}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Select a design to add</MenuItem>
                  {Object.keys(REACTOR_DESIGNS).map(key => (
                    <MenuItem 
                      key={key} 
                      value={key}
                      disabled={selectedReactors.includes(key)}
                    >
                      {REACTOR_DESIGNS[key].name}
                    </MenuItem>
                  ))}
                  {isCustomized && (
                    <MenuItem 
                      value="custom"
                      disabled={selectedReactors.includes('custom')}
                    >
                      {customReactor?.name || 'Custom Design'}
                    </MenuItem>
                  )}
                </Select>
              </FormControl>
              
              {isCustomized && !selectedReactors.includes('custom') && (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={useCustomReactor}
                  fullWidth
                >
                  Add Your Custom Design
                </Button>
              )}
            </Paper>
            
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Comparison Focus</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Parameter Category</InputLabel>
                <Select
                  value={activeMetricCategory}
                  label="Parameter Category"
                  onChange={(e) => setActiveMetricCategory(e.target.value)}
                >
                  <MenuItem value="technical">Technical Parameters</MenuItem>
                  <MenuItem value="economic">Economic Metrics</MenuItem>
                  <MenuItem value="environmental">Environmental Impact</MenuItem>
                  <MenuItem value="operational">Operational Characteristics</MenuItem>
                </Select>
              </FormControl>
              
              <FormControlLabel
                control={
                  <Switch
                    checked={showNormalized}
                    onChange={(e) => setShowNormalized(e.target.checked)}
                  />
                }
                label="Show Normalized Values"
              />
              
              <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={exportComparisonData}
                fullWidth
                sx={{ mt: 2 }}
              >
                Export Comparison Data
              </Button>
            </Paper>
            
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>Overall Score</Typography>
                <Box sx={{ height: 260 }}>
                  {selectedReactors.length > 0 && (
                    <Doughnut
                      ref={doughnutChartRef}
                      data={getDoughnutChartData()}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'right',
                          },
                          tooltip: {
                            callbacks: {
                              label: function(context) {
                                return `${context.label}: ${context.raw.toFixed(1)}`;
                              }
                            }
                          }
                        }
                      }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          {/* Comparison Charts */}
          <Grid item xs={12} md={8}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Performance by Category</Typography>
              <Box sx={{ height: 300, mb: 3 }}>
                {selectedReactors.length > 0 && (
                  <Radar
                    ref={radarChartRef}
                    data={getRadarChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        r: {
                          angleLines: {
                            display: true
                          },
                          suggestedMin: 0,
                          suggestedMax: 100
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                {formatMetricLabel(activeMetricCategory)} Parameters
                <FormControlLabel
                  control={
                    <Switch
                      checked={showNormalized}
                      onChange={(e) => setShowNormalized(e.target.checked)}
                      size="small"
                    />
                  }
                  label="Normalized"
                  sx={{ ml: 2 }}
                />
              </Typography>
              
              <Box sx={{ height: 340 }}>
                {selectedReactors.length > 0 && (
                  <Bar
                    ref={barChartRef}
                    data={getBarChartData()}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      scales: {
                        x: {
                          ticks: {
                            maxRotation: 45,
                            minRotation: 45
                          }
                        },
                        y: {
                          title: {
                            display: true,
                            text: showNormalized ? 'Normalized Score (0-100)' : 'Value'
                          },
                          beginAtZero: true
                        }
                      },
                      plugins: {
                        tooltip: {
                          callbacks: {
                            title: function(tooltipItems) {
                              const metric = PARAMETER_CATEGORIES[activeMetricCategory][tooltipItems[0].dataIndex];
                              return formatMetricLabel(metric);
                            },
                            label: function(context) {
                              const metric = PARAMETER_CATEGORIES[activeMetricCategory][context.dataIndex];
                              const value = context.raw;
                              
                              if (showNormalized) {
                                return `${context.dataset.label}: ${value.toFixed(1)}/100`;
                              }
                              
                              let unit = '';
                              if (metric === 'thermalPower') unit = ' MWth';
                              else if (metric === 'electricalEfficiency' || metric === 'fuelUtilization' || metric === 'loadFollowingCapability') unit = '%';
                              else if (metric === 'fuelEnrichment') unit = '% U-235';
                              else if (metric === 'fuelCycleDuration' || metric === 'constructionTime') unit = ' months';
                              else if (metric === 'operationalLifetime') unit = ' years';
                              else if (metric === 'capitalCost') unit = ' $/kWe';
                              else if (metric === 'operationalCost' || metric === 'fuelCost') unit = ' $/MWh';
                              else if (metric === 'wasteProduction') unit = ' m³/GWe-year';
                              else if (metric === 'landUse') unit = ' hectares/GWe';
                              else if (metric === 'carbonIntensity') unit = ' gCO₂/kWh';
                              else if (metric === 'waterUsage') unit = ' m³/GWh';
                              else if (metric === 'powerDensity') unit = ' MW/m³';
                              
                              return `${context.dataset.label}: ${value}${unit}`;
                            }
                          }
                        }
                      }
                    }}
                  />
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Custom Design Tab */}
      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>
          Create & Customize Reactor Design
          <Button
            variant="contained"
            startIcon={<CompareArrowsIcon />}
            onClick={useCustomReactor}
            disabled={selectedReactors.includes('custom')}
            sx={{ ml: 2 }}
            size="small"
          >
            Use in Comparison
          </Button>
        </Typography>
        
        <Grid container spacing={3}>
          {/* Templates */}
          <Grid item xs={12} md={3}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Start from Template</Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Reactor Template</InputLabel>
                <Select
                  value=""
                  label="Reactor Template"
                  onChange={(e) => {
                    if (e.target.value) {
                      setCustomReactor({
                        ...REACTOR_DESIGNS[e.target.value],
                        name: 'Custom ' + REACTOR_DESIGNS[e.target.value].name
                      });
                      setIsCustomized(true);
                    }
                  }}
                  displayEmpty
                >
                  <MenuItem value="" disabled>Select a template</MenuItem>
                  {Object.keys(REACTOR_DESIGNS).map(key => (
                    <MenuItem key={key} value={key}>
                      {REACTOR_DESIGNS[key].name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                label="Custom Design Name"
                value={customReactor?.name || ''}
                onChange={(e) => handleCustomReactorChange('name', e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
              />
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Customize parameters to create your own reactor design for comparison.
              </Alert>
            </Paper>
          </Grid>
          
          {/* Parameter Editors */}
          <Grid item xs={12} md={9}>
            {customReactor && (
              <Grid container spacing={2}>
                {/* Technical Parameters */}
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Technical Parameters</Typography>
                    
                    <TextField
                      label="Thermal Power (MWth)"
                      type="number"
                      value={customReactor.thermalPower}
                      onChange={(e) => handleCustomReactorChange('thermalPower', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.thermalPower}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Electrical Efficiency (%)"
                      type="number"
                      value={customReactor.electricalEfficiency}
                      onChange={(e) => handleCustomReactorChange('electricalEfficiency', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.electricalEfficiency}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Fuel Enrichment (%)"
                      type="number"
                      value={customReactor.fuelEnrichment}
                      onChange={(e) => handleCustomReactorChange('fuelEnrichment', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.fuelEnrichment}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Fuel Cycle Duration (months)"
                      type="number"
                      value={customReactor.fuelCycleDuration}
                      onChange={(e) => handleCustomReactorChange('fuelCycleDuration', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.fuelCycleDuration}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Cooling System</InputLabel>
                      <Select
                        value={customReactor.coolingSystem}
                        label="Cooling System"
                        onChange={(e) => handleCustomReactorChange('coolingSystem', e.target.value)}
                      >
                        <MenuItem value="active">Active Cooling</MenuItem>
                        <MenuItem value="passive">Passive Cooling</MenuItem>
                        <MenuItem value="hybrid">Hybrid System</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Containment Type</InputLabel>
                      <Select
                        value={customReactor.containmentType}
                        label="Containment Type"
                        onChange={(e) => handleCustomReactorChange('containmentType', e.target.value)}
                      >
                        <MenuItem value="large-dry">Large Dry Containment</MenuItem>
                        <MenuItem value="pressure-suppression">Pressure Suppression</MenuItem>
                        <MenuItem value="steel">Steel Containment</MenuItem>
                        <MenuItem value="concrete">Concrete Containment</MenuItem>
                        <MenuItem value="integral">Integral (SMR)</MenuItem>
                        <MenuItem value="multi-barrier">Multi-Barrier</MenuItem>
                        <MenuItem value="magnetic">Magnetic Confinement</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <FormControl fullWidth sx={{ mb: 2 }}>
                      <InputLabel>Safety System</InputLabel>
                      <Select
                        value={customReactor.safetySystem}
                        label="Safety System"
                        onChange={(e) => handleCustomReactorChange('safetySystem', e.target.value)}
                      >
                        <MenuItem value="active">Active Safety Systems</MenuItem>
                        <MenuItem value="passive">Passive Safety Systems</MenuItem>
                        <MenuItem value="hybrid">Hybrid Safety Approach</MenuItem>
                        <MenuItem value="inherent">Inherent Safety Features</MenuItem>
                      </Select>
                    </FormControl>
                    
                    <TextField
                      label="Operational Lifetime (years)"
                      type="number"
                      value={customReactor.operationalLifetime}
                      onChange={(e) => handleCustomReactorChange('operationalLifetime', Number(e.target.value))}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.operationalLifetime}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </Paper>
                  
                  <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Economic Parameters</Typography>
                    
                    <TextField
                      label="Construction Time (months)"
                      type="number"
                      value={customReactor.constructionTime}
                      onChange={(e) => handleCustomReactorChange('constructionTime', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.constructionTime}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Capital Cost ($/kWe)"
                      type="number"
                      value={customReactor.capitalCost}
                      onChange={(e) => handleCustomReactorChange('capitalCost', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.capitalCost}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Operational Cost ($/MWh)"
                      type="number"
                      value={customReactor.operationalCost}
                      onChange={(e) => handleCustomReactorChange('operationalCost', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.operationalCost}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Fuel Cost ($/MWh)"
                      type="number"
                      value={customReactor.fuelCost}
                      onChange={(e) => handleCustomReactorChange('fuelCost', Number(e.target.value))}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.fuelCost}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Paper elevation={2} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Environmental Parameters</Typography>
                    
                    <TextField
                      label="Waste Production (m³/GWe-year)"
                      type="number"
                      value={customReactor.wasteProduction}
                      onChange={(e) => handleCustomReactorChange('wasteProduction', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.wasteProduction}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Land Use (hectares/GWe)"
                      type="number"
                      value={customReactor.landUse}
                      onChange={(e) => handleCustomReactorChange('landUse', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.landUse}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Carbon Intensity (gCO₂-eq/kWh)"
                      type="number"
                      value={customReactor.carbonIntensity}
                      onChange={(e) => handleCustomReactorChange('carbonIntensity', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.carbonIntensity}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Water Usage (m³/GWh)"
                      type="number"
                      value={customReactor.waterUsage}
                      onChange={(e) => handleCustomReactorChange('waterUsage', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.waterUsage}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Fuel Utilization (%)"
                      type="number"
                      value={customReactor.fuelUtilization}
                      onChange={(e) => handleCustomReactorChange('fuelUtilization', Number(e.target.value))}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.fuelUtilization}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                  </Paper>
                  
                  <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>Operational Parameters</Typography>
                    
                    <TextField
                      label="Power Density (MW/m³)"
                      type="number"
                      value={customReactor.powerDensity}
                      onChange={(e) => handleCustomReactorChange('powerDensity', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.powerDensity}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Load Following Capability (%)"
                      type="number"
                      value={customReactor.loadFollowingCapability}
                      onChange={(e) => handleCustomReactorChange('loadFollowingCapability', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.loadFollowingCapability}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Accident Risk Index"
                      type="number"
                      value={customReactor.accidentRiskIndex}
                      onChange={(e) => handleCustomReactorChange('accidentRiskIndex', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.accidentRiskIndex}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                      }}
                    />
                    
                    <TextField
                      label="Proliferation Resistance (1-5)"
                      type="number"
                      value={customReactor.proliferationResistance}
                      onChange={(e) => handleCustomReactorChange('proliferationResistance', Number(e.target.value))}
                      fullWidth
                      sx={{ mb: 2 }}
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.proliferationResistance}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                        inputProps: { min: 1, max: 5, step: 0.1 }
                      }}
                    />
                    
                    <TextField
                      label="Public Acceptance (1-5)"
                      type="number"
                      value={customReactor.publicAcceptance}
                      onChange={(e) => handleCustomReactorChange('publicAcceptance', Number(e.target.value))}
                      fullWidth
                      InputProps={{
                        endAdornment: (
                          <Tooltip title={PARAMETER_DESCRIPTIONS.publicAcceptance}>
                            <IconButton size="small">
                              <InfoIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        ),
                        inputProps: { min: 1, max: 5, step: 0.1 }
                      }}
                    />
                  </Paper>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Metrics & Weightings Tab */}
      <TabPanel value={tabValue} index={2}>
        <Typography variant="h6" gutterBottom>Metrics & Scoring Methodology</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Category Weightings</Typography>
              <Typography variant="body2" color="textSecondary" paragraph>
                Adjust the relative importance of each category in the overall assessment. Total must equal 100%.
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Technical: {weightings.technical}%</Typography>
                <Slider
                  value={weightings.technical}
                  onChange={(e, val) => handleWeightingChange('technical', val)}
                  step={5}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Economic: {weightings.economic}%</Typography>
                <Slider
                  value={weightings.economic}
                  onChange={(e, val) => handleWeightingChange('economic', val)}
                  step={5}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Environmental: {weightings.environmental}%</Typography>
                <Slider
                  value={weightings.environmental}
                  onChange={(e, val) => handleWeightingChange('environmental', val)}
                  step={5}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" gutterBottom>Operational: {weightings.operational}%</Typography>
                <Slider
                  value={weightings.operational}
                  onChange={(e, val) => handleWeightingChange('operational', val)}
                  step={5}
                  min={0}
                  max={100}
                  marks={[
                    { value: 0, label: '0%' },
                    { value: 50, label: '50%' },
                    { value: 100, label: '100%' }
                  ]}
                />
              </Box>
              
              <Alert severity="info" sx={{ mt: 2 }}>
                The weighting distribution affects the overall score calculation. Current total: 100%
              </Alert>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper elevation={2} sx={{ p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Scoring Methodology</Typography>
              <Typography variant="body2" paragraph>
                Each parameter is normalized on a 0-100 scale based on industry benchmarks:
              </Typography>
              
              <Typography variant="body2" sx={{ ml: 2 }} paragraph>
                • Parameters where higher values are better (e.g., efficiency): 
                <br />
                Score = (Value - Min) / (Max - Min) × 100
              </Typography>
              
              <Typography variant="body2" sx={{ ml: 2 }} paragraph>
                • Parameters where lower values are better (e.g., waste): 
                <br />
                Score = 100 - (Value - Min) / (Max - Min) × 100
              </Typography>
              
              <Typography variant="body2" paragraph>
                Category scores are calculated as the average of normalized parameter scores within each category.
                The overall score is the weighted average of category scores using your weighting preferences.
              </Typography>
              
              <Button
                variant="contained"
                startIcon={<CalculateIcon />}
                onClick={() => setTabValue(3)}
                sx={{ mt: 2 }}
              >
                View Analysis Results
              </Button>
            </Paper>
            
            <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Parameter Descriptions</Typography>
              
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter</TableCell>
                      <TableCell>Description</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.entries(PARAMETER_DESCRIPTIONS).slice(0, 8).map(([param, desc]) => (
                      <TableRow key={param}>
                        <TableCell>{formatMetricLabel(param)}</TableCell>
                        <TableCell>{desc}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Button
                variant="text"
                onClick={() => window.open('/documentation/metrics.pdf', '_blank')}
                sx={{ mt: 2 }}
              >
                View Full Documentation
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
      
      {/* Analysis Tab */}
      <TabPanel value={tabValue} index={3}>
        <Typography variant="h6" gutterBottom>Comparative Analysis Results</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Performance Summary</Typography>
              
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Reactor Design</TableCell>
                      <TableCell>Technical Score</TableCell>
                      <TableCell>Economic Score</TableCell>
                      <TableCell>Environmental Score</TableCell>
                      <TableCell>Operational Score</TableCell>
                      <TableCell>Overall Score</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedReactors.map(reactorKey => {
                      const reactor = reactorKey === 'custom' ? customReactor : REACTOR_DESIGNS[reactorKey];
                      const score = calculateReactorScore(reactorKey);
                      
                      return (
                        <TableRow key={reactorKey}>
                          <TableCell>{reactor.name}</TableCell>
                          <TableCell>{score.categories.technical.toFixed(1)}</TableCell>
                          <TableCell>{score.categories.economic.toFixed(1)}</TableCell>
                          <TableCell>{score.categories.environmental.toFixed(1)}</TableCell>
                          <TableCell>{score.categories.operational.toFixed(1)}</TableCell>
                          <TableCell>
                            <Typography fontWeight="bold">
                              {score.total.toFixed(1)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Strengths and Weaknesses Analysis</Typography>
              
              {selectedReactors.length > 0 && selectedReactors.map(reactorKey => {
                const reactor = reactorKey === 'custom' ? customReactor : REACTOR_DESIGNS[reactorKey];
                
                // Calculate top strengths and weaknesses
                const allParams = [].concat(...Object.values(PARAMETER_CATEGORIES))
                  .filter(param => typeof reactor[param] === 'number');
                
                const paramScores = allParams.map(param => {
                  const { min, max, higher } = {
                    thermalPower: { min: 0, max: 5000, higher: true },
                    electricalEfficiency: { min: 30, max: 45, higher: true },
                    fuelEnrichment: { min: 0, max: 20, higher: false },
                    fuelCycleDuration: { min: 12, max: 84, higher: true },
                    operationalLifetime: { min: 40, max: 80, higher: true },
                    constructionTime: { min: 36, max: 120, higher: false },
                    capitalCost: { min: 5000, max: 12000, higher: false },
                    operationalCost: { min: 20, max: 40, higher: false },
                    fuelCost: { min: 4, max: 12, higher: false },
                    wasteProduction: { min: 2, max: 25, higher: false },
                    landUse: { min: 20, max: 50, higher: false },
                    carbonIntensity: { min: 3, max: 15, higher: false },
                    waterUsage: { min: 900, max: 3000, higher: false },
                    fuelUtilization: { min: 4, max: 100, higher: true },
                    powerDensity: { min: 5, max: 350, higher: true },
                    loadFollowingCapability: { min: 30, max: 90, higher: true },
                    accidentRiskIndex: { min: 0.2, max: 1.5, higher: false },
                    proliferationResistance: { min: 1, max: 5, higher: true },
                    publicAcceptance: { min: 1, max: 5, higher: true }
                  }[param] || { min: 0, max: 100, higher: true };
                  
                  const range = max - min;
                  let score = (reactor[param] - min) / range * 100;
                  
                  if (!higher) {
                    score = 100 - score;
                  }
                  
                  score = Math.max(0, Math.min(100, score));
                  
                  return { param, score };
                });
                
                const strengths = [...paramScores].sort((a, b) => b.score - a.score).slice(0, 3);
                const weaknesses = [...paramScores].sort((a, b) => a.score - b.score).slice(0, 3);
                
                return (
                  <Card key={reactorKey} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Typography variant="h6" gutterBottom>{reactor.name}</Typography>
                    
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="success.main" gutterBottom>
                          Key Strengths
                        </Typography>
                        
                        {strengths.map(({ param, score }) => (
                          <Box key={param} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {formatMetricLabel(param)}: {score.toFixed(1)}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={score} 
                              color="success"
                              sx={{ height: 8, borderRadius: 1 }}
                            />
                          </Box>
                        ))}
                      </Grid>
                      
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="error.main" gutterBottom>
                          Areas for Improvement
                        </Typography>
                        
                        {weaknesses.map(({ param, score }) => (
                          <Box key={param} sx={{ mb: 1 }}>
                            <Typography variant="body2">
                              {formatMetricLabel(param)}: {score.toFixed(1)}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={score} 
                              color="error"
                              sx={{ height: 8, borderRadius: 1 }}
                            />
                          </Box>
                        ))}
                      </Grid>
                    </Grid>
                  </Card>
                );
              })}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>Design Recommendations</Typography>
              
              {selectedReactors.map(reactorKey => {
                const reactor = reactorKey === 'custom' ? customReactor : REACTOR_DESIGNS[reactorKey];
                const score = calculateReactorScore(reactorKey);
                
                // Find lowest scoring category
                const lowestCategory = Object.entries(score.categories)
                  .sort(([, a], [, b]) => a - b)[0][0];
                
                // Generate recommendations based on reactor type and scores
                let recommendations = [];
                
                if (lowestCategory === 'economic') {
                  recommendations.push('Consider modular construction to reduce capital costs');
                  if (reactor.constructionTime > 60) {
                    recommendations.push('Streamline licensing and construction processes to reduce time to operation');
                  }
                } else if (lowestCategory === 'environmental') {
                  if (reactor.fuelUtilization < 10) {
                    recommendations.push('Explore closed fuel cycle options to improve fuel utilization');
                  }
                  if (reactor.wasteProduction > 15) {
                    recommendations.push('Implement advanced fuel designs to reduce waste volume');
                  }
                } else if (lowestCategory === 'operational') {
                  if (reactor.loadFollowingCapability < 60) {
                    recommendations.push('Improve control systems to enhance load-following capability');
                  }
                  if (reactor.accidentRiskIndex > 0.8) {
                    recommendations.push('Integrate additional passive safety features to reduce accident risk');
                  }
                } else if (lowestCategory === 'technical') {
                  if (reactor.electricalEfficiency < 35) {
                    recommendations.push('Explore advanced thermal cycles to improve electrical efficiency');
                  }
                  if (reactor.fuelCycleDuration < 24) {
                    recommendations.push('Develop higher burnup fuel to extend operational cycles');
                  }
                }
                
                // Add generic recommendations if we don't have enough specific ones
                if (recommendations.length < 2) {
                  recommendations.push('Consider hybrid energy systems for improved economics');
                }
                
                return (
                  <Card key={reactorKey} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>{reactor.name}</Typography>
                    
                    <Typography variant="body2" paragraph>
                      Improvement focus area: <strong>{formatMetricLabel(lowestCategory)}</strong>
                    </Typography>
                    
                    <Typography component="ul" sx={{ pl: 2 }}>
                      {recommendations.map((rec, i) => (
                        <Typography component="li" variant="body2" key={i}>
                          {rec}
                        </Typography>
                      ))}
                    </Typography>
                  </Card>
                );
              })}
              
              <Alert severity="info" sx={{ mt: 2 }}>
                Recommendations are based on the comparative analysis of selected reactor designs and industry benchmarks. Actual implementation would require detailed engineering studies.
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
};

export default AdvancedReactorPerformanceAnalyzer;