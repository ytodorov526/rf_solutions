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
  Badge,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import GridOnIcon from '@mui/icons-material/GridOn';
import CalculateIcon from '@mui/icons-material/Calculate';
import SpeedIcon from '@mui/icons-material/Speed';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import WarningIcon from '@mui/icons-material/Warning';

// Initial core parameters
const initialParameters = {
  // Core geometry
  coreSize: 15, // NxN assembly grid (odd number for symmetry)
  assemblySize: 17, // Number of fuel rods per assembly dimension
  fuelAssemblyTypes: 4, // Number of different assembly types available
  
  // Core operation
  cycleLength: 18, // Desired cycle length in months
  thermalPower: 3400, // Thermal output in MW
  fluxPeakingLimit: 2.5, // Max allowed power peaking factor
  
  // Optimization parameters
  optimizationTarget: 'cycle-length', // cycle-length, fuel-economy, power-distribution
  enrichmentDistribution: 'radial-zones', // uniform, radial-zones, custom
  loadingStrategy: 'in-out', // in-out, out-in, low-leakage
  
  // Technical constraints
  maxEnrichment: 5.0, // Maximum allowed enrichment in %
  minBurnupLimit: 45000, // Minimum burnup target in MWd/tU
  safetyMargin: 15, // % margin to regulatory limits
};

// Assembly types with properties
const fuelAssemblyTypes = [
  {
    id: 'fresh-high',
    name: 'Fresh Fuel (4.95% U-235)',
    enrichment: 4.95,
    burnup: 0,
    color: '#FF5252', // Red
    description: 'Fresh fuel assembly with high enrichment for high reactivity',
    residualReactivity: 1.0,
  },
  {
    id: 'fresh-medium',
    name: 'Fresh Fuel (4.2% U-235)',
    enrichment: 4.2,
    burnup: 0,
    color: '#FF9800', // Orange
    description: 'Fresh fuel assembly with medium enrichment for balanced reactivity',
    residualReactivity: 0.85,
  },
  {
    id: 'once-burned',
    name: 'Once-Burned Fuel',
    enrichment: 4.95,
    burnup: 25000,
    color: '#FFEB3B', // Yellow
    description: 'Fuel assembly that has undergone one cycle of irradiation',
    residualReactivity: 0.65,
  },
  {
    id: 'twice-burned',
    name: 'Twice-Burned Fuel',
    enrichment: 4.95,
    burnup: 45000,
    color: '#8BC34A', // Light green
    description: 'Fuel assembly that has undergone two cycles of irradiation',
    residualReactivity: 0.35,
  },
  {
    id: 'gad-bearing',
    name: 'Gadolinia Bearing (4.4%)',
    enrichment: 4.4,
    burnup: 0,
    color: '#9C27B0', // Purple
    description: 'Fresh fuel assembly with gadolinium burnable poison for reactivity control',
    residualReactivity: 0.75,
    hasBurnablePoison: true,
  },
  {
    id: 'reflector',
    name: 'Reflector',
    enrichment: 0,
    burnup: 0,
    color: '#2196F3', // Blue
    description: 'Reflector assembly (water or steel) for neutron reflection and core boundary',
    residualReactivity: 0,
    isReflector: true,
  },
];

// Loading pattern presets
const loadingPatternPresets = [
  {
    id: 'classic-in-out',
    name: 'Classic In-Out Loading',
    description: 'Fresh fuel placed in center with burned fuel towards periphery, optimized for cycle length',
    parameters: {
      ...initialParameters,
      loadingStrategy: 'in-out',
      optimizationTarget: 'cycle-length',
    },
  },
  {
    id: 'low-leakage',
    name: 'Low-Leakage Pattern',
    description: 'Burned fuel placed at periphery to reduce neutron leakage, improving fuel economy',
    parameters: {
      ...initialParameters,
      loadingStrategy: 'low-leakage',
      optimizationTarget: 'fuel-economy',
    },
  },
  {
    id: 'power-flattening',
    name: 'Power Distribution Flattening',
    description: 'Balanced placement of fresh and burned fuel to create flatter power distribution',
    parameters: {
      ...initialParameters,
      loadingStrategy: 'out-in',
      optimizationTarget: 'power-distribution',
    },
  },
  {
    id: 'extended-cycle',
    name: 'Extended Cycle Pattern',
    description: 'Optimized for 24-month cycle with high-enrichment fresh fuel',
    parameters: {
      ...initialParameters,
      cycleLength: 24,
      maxEnrichment: 5.0,
      loadingStrategy: 'in-out',
      optimizationTarget: 'cycle-length',
    },
  },
];

// Tabs for the optimizer
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`optimizer-tabpanel-${index}`}
      aria-labelledby={`optimizer-tab-${index}`}
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
    id: `optimizer-tab-${index}`,
    'aria-controls': `optimizer-tabpanel-${index}`,
  };
}

function CoreLoadingPatternOptimizer() {
  // State for core parameters
  const [parameters, setParameters] = useState(initialParameters);
  
  // State for loading pattern
  const [loadingPattern, setLoadingPattern] = useState([]);
  
  // State for selected assembly type
  const [selectedAssemblyType, setSelectedAssemblyType] = useState(fuelAssemblyTypes[0].id);
  
  // State for editing mode
  const [editMode, setEditMode] = useState('paint'); // paint, erase, analyze
  
  // State for analysis results
  const [analysisResults, setAnalysisResults] = useState(null);
  
  // State for active tab
  const [activeTab, setActiveTab] = useState(0);
  
  // State for selected preset
  const [selectedPreset, setSelectedPreset] = useState('');
  
  // State for messages
  const [messages, setMessages] = useState([]);

  // Canvas reference for exporting
  const canvasRef = useRef(null);
  
  // Initialize loading pattern
  useEffect(() => {
    initializeLoadingPattern();
  }, [parameters.coreSize]);
  
  // Function to initialize loading pattern
  const initializeLoadingPattern = () => {
    const size = parameters.coreSize;
    const newPattern = Array(size).fill().map(() => Array(size).fill(null));
    
    // Fill with reflectors by default
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        // Check if position is at the edge of the core
        if (i === 0 || i === size - 1 || j === 0 || j === size - 1) {
          newPattern[i][j] = 'reflector';
        }
      }
    }
    
    setLoadingPattern(newPattern);
    setAnalysisResults(null);
  };
  
  // Function to update loading pattern at a specific position
  const updateLoadingPattern = (row, col) => {
    if (editMode === 'paint') {
      const newPattern = [...loadingPattern];
      newPattern[row][col] = selectedAssemblyType;
      setLoadingPattern(newPattern);
      setAnalysisResults(null);
    } else if (editMode === 'erase') {
      const newPattern = [...loadingPattern];
      newPattern[row][col] = null;
      setLoadingPattern(newPattern);
      setAnalysisResults(null);
    }
  };
  
  // Function to handle assembly selection
  const handleAssemblyTypeChange = (event) => {
    setSelectedAssemblyType(event.target.value);
  };
  
  // Function to handle editing mode change
  const handleEditModeChange = (event, newMode) => {
    if (newMode !== null) {
      setEditMode(newMode);
    }
  };
  
  // Function to handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Function to handle preset selection
  const handlePresetChange = (event) => {
    const presetId = event.target.value;
    setSelectedPreset(presetId);
    
    if (presetId) {
      const preset = loadingPatternPresets.find(p => p.id === presetId);
      if (preset) {
        setParameters(preset.parameters);
        applyPresetPattern(presetId);
      }
    }
  };
  
  // Function to handle parameter change
  const handleParameterChange = (param, value) => {
    setParameters(prev => ({
      ...prev,
      [param]: value,
    }));
  };
  
  // Function to apply preset loading pattern
  const applyPresetPattern = (presetId) => {
    const size = parameters.coreSize;
    const newPattern = Array(size).fill().map(() => Array(size).fill(null));
    
    // Fill with reflectors at the edge
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === 0 || i === size - 1 || j === 0 || j === size - 1) {
          newPattern[i][j] = 'reflector';
        }
      }
    }
    
    // Apply pattern based on preset
    const center = Math.floor(size / 2);
    
    if (presetId === 'classic-in-out') {
      // Classic in-out: fresh fuel in center, once-burned in middle, twice-burned at periphery
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if (distanceFromCenter <= center / 3) {
            newPattern[i][j] = 'fresh-high';
          } else if (distanceFromCenter <= center * 2 / 3) {
            newPattern[i][j] = 'fresh-medium';
          } else if (distanceFromCenter < center) {
            newPattern[i][j] = 'once-burned';
          } else {
            newPattern[i][j] = 'twice-burned';
          }
          
          // Add some gadolinia assemblies for reactivity control
          if ((i + j) % 5 === 0 && distanceFromCenter <= center / 2) {
            newPattern[i][j] = 'gad-bearing';
          }
        }
      }
    } else if (presetId === 'low-leakage') {
      // Low-leakage: twice-burned at periphery, fresh in middle
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if (distanceFromCenter === center - 1) {
            newPattern[i][j] = 'twice-burned';
          } else if (distanceFromCenter >= center * 2 / 3) {
            newPattern[i][j] = 'once-burned';
          } else if (distanceFromCenter >= center / 3) {
            newPattern[i][j] = 'fresh-medium';
          } else {
            newPattern[i][j] = 'fresh-high';
          }
          
          // Add some gadolinia assemblies for reactivity control
          if ((i + j) % 4 === 0 && distanceFromCenter <= center * 2 / 3) {
            newPattern[i][j] = 'gad-bearing';
          }
        }
      }
    } else if (presetId === 'power-flattening') {
      // Power flattening: checkerboard pattern of fresh and burned fuel
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if ((i + j) % 2 === 0) {
            newPattern[i][j] = distanceFromCenter < center / 2 ? 'fresh-high' : 'fresh-medium';
          } else {
            newPattern[i][j] = distanceFromCenter < center / 2 ? 'once-burned' : 'twice-burned';
          }
          
          // Add some gadolinia assemblies in a pattern
          if ((i * j) % 7 === 0) {
            newPattern[i][j] = 'gad-bearing';
          }
        }
      }
    } else if (presetId === 'extended-cycle') {
      // Extended cycle: mostly fresh fuel with high enrichment
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if (distanceFromCenter <= center * 2 / 3) {
            newPattern[i][j] = 'fresh-high';
          } else if (distanceFromCenter < center - 1) {
            newPattern[i][j] = 'fresh-medium';
          } else {
            newPattern[i][j] = 'once-burned';
          }
          
          // Add many gadolinia assemblies for reactivity control in longer cycle
          if ((i + j) % 3 === 0) {
            newPattern[i][j] = 'gad-bearing';
          }
        }
      }
    }
    
    setLoadingPattern(newPattern);
    setAnalysisResults(null);
    
    // Add message about preset application
    addMessage('info', `Applied ${loadingPatternPresets.find(p => p.id === presetId).name} preset loading pattern.`);
  };
  
  // Function to analyze loading pattern
  const analyzeLoadingPattern = () => {
    // Check if there are empty positions
    let hasEmpty = false;
    for (let i = 0; i < loadingPattern.length; i++) {
      for (let j = 0; j < loadingPattern[i].length; j++) {
        if (loadingPattern[i][j] === null) {
          hasEmpty = true;
          break;
        }
      }
      if (hasEmpty) break;
    }
    
    if (hasEmpty) {
      addMessage('warning', 'Please fill all core positions before analyzing.');
      return;
    }
    
    // Count assembly types
    const assemblyCounts = {};
    fuelAssemblyTypes.forEach(type => {
      assemblyCounts[type.id] = 0;
    });
    
    let totalAssemblies = 0;
    let totalReactivity = 0;
    let maxPPF = 0; // Peak Power Factor
    const powerDistribution = Array(loadingPattern.length).fill().map(() => Array(loadingPattern.length).fill(0));
    
    // Calculate basic metrics from the loading pattern
    for (let i = 0; i < loadingPattern.length; i++) {
      for (let j = 0; j < loadingPattern[i].length; j++) {
        const assemblyType = loadingPattern[i][j];
        if (assemblyType) {
          assemblyCounts[assemblyType]++;
          totalAssemblies++;
          
          const assembly = fuelAssemblyTypes.find(a => a.id === assemblyType);
          if (assembly && !assembly.isReflector) {
            // Calculate contribution to reactivity
            totalReactivity += assembly.residualReactivity;
            
            // Simulate power distribution (simplified model)
            const distanceFromCenter = Math.sqrt(
              Math.pow(i - loadingPattern.length / 2, 2) + 
              Math.pow(j - loadingPattern.length / 2, 2)
            );
            
            // Power is higher for fresher fuel and decreases with distance from center
            // This is a very simplified model
            const relativePower = assembly.residualReactivity * (1 - 0.03 * distanceFromCenter);
            powerDistribution[i][j] = relativePower;
            
            if (relativePower > maxPPF) {
              maxPPF = relativePower;
            }
          }
        }
      }
    }
    
    // Normalize power distribution
    let totalPower = 0;
    for (let i = 0; i < powerDistribution.length; i++) {
      for (let j = 0; j < powerDistribution[i].length; j++) {
        totalPower += powerDistribution[i][j];
      }
    }
    
    const avgPower = totalPower / (totalAssemblies - assemblyCounts['reflector']);
    for (let i = 0; i < powerDistribution.length; i++) {
      for (let j = 0; j < powerDistribution[i].length; j++) {
        if (powerDistribution[i][j] > 0) {
          powerDistribution[i][j] /= avgPower;
        }
      }
    }
    
    // Calculate estimated cycle length based on loading pattern
    // This is a simplified model
    const freshFuelRatio = (assemblyCounts['fresh-high'] + assemblyCounts['fresh-medium'] + assemblyCounts['gad-bearing']) / 
                          (totalAssemblies - assemblyCounts['reflector']);
    
    const estimatedReactivity = totalReactivity / (totalAssemblies - assemblyCounts['reflector']);
    const estimatedCycleLength = Math.round(18 * estimatedReactivity * (1 + freshFuelRatio * 0.3));
    
    // Calculate fuel economy (MWd/kgU)
    // Simplified approximation based on enrichment and cycle length
    const totalEnrichment = fuelAssemblyTypes.reduce((sum, type) => {
      return sum + type.enrichment * assemblyCounts[type.id];
    }, 0);
    
    const avgEnrichment = totalEnrichment / (totalAssemblies - assemblyCounts['reflector']);
    const estimatedBurnup = Math.round(10000 * estimatedCycleLength / 18 * avgEnrichment / 3.5);
    
    // Calculate real PPF from normalized power distribution
    const powerPeakingFactor = Math.max(...powerDistribution.flat().filter(p => !isNaN(p) && isFinite(p)));
    
    // Set analysis results
    setAnalysisResults({
      assemblyCounts,
      estimatedCycleLength,
      estimatedBurnup,
      powerPeakingFactor,
      powerDistribution,
      avgEnrichment,
      totalAssemblies,
      effectiveReactivity: estimatedReactivity,
    });
    
    // Check limits and add messages
    if (powerPeakingFactor > parameters.fluxPeakingLimit) {
      addMessage('error', `Power peaking factor (${powerPeakingFactor.toFixed(2)}) exceeds limit of ${parameters.fluxPeakingLimit}. Consider redistributing fresh fuel.`);
    } else {
      addMessage('success', `Analysis complete. Power peaking factor: ${powerPeakingFactor.toFixed(2)}, Estimated cycle length: ${estimatedCycleLength} months.`);
    }
    
    if (estimatedCycleLength < parameters.cycleLength) {
      addMessage('warning', `Estimated cycle length (${estimatedCycleLength} months) is below target of ${parameters.cycleLength} months. Consider adding more fresh fuel or increasing enrichment.`);
    }
    
    if (avgEnrichment > parameters.maxEnrichment) {
      addMessage('error', `Average enrichment (${avgEnrichment.toFixed(2)}%) exceeds maximum allowed enrichment of ${parameters.maxEnrichment}%.`);
    }
    
    // Auto-switch to Results tab
    setActiveTab(1);
  };
  
  // Function to optimize loading pattern automatically
  const optimizeLoadingPattern = () => {
    addMessage('info', 'Optimizing loading pattern. This may take a moment...');
    
    // Start with a basic pattern based on optimization target
    const size = parameters.coreSize;
    const newPattern = Array(size).fill().map(() => Array(size).fill(null));
    const center = Math.floor(size / 2);
    
    // Always fill the edge with reflectors
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (i === 0 || i === size - 1 || j === 0 || j === size - 1) {
          newPattern[i][j] = 'reflector';
        }
      }
    }
    
    if (parameters.optimizationTarget === 'cycle-length') {
      // Maximize cycle length: more fresh high-enrichment fuel in center
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if (distanceFromCenter <= center / 2.5) {
            newPattern[i][j] = 'fresh-high';
          } else if (distanceFromCenter <= center / 1.5) {
            newPattern[i][j] = 'fresh-medium';
          } else if (distanceFromCenter <= center / 1.2) {
            newPattern[i][j] = 'once-burned';
          } else {
            newPattern[i][j] = 'twice-burned';
          }
          
          // Add gadolinia for reactivity control
          if ((i * j) % 8 === 0 || (i + j) % 7 === 0) {
            newPattern[i][j] = 'gad-bearing';
          }
        }
      }
    } else if (parameters.optimizationTarget === 'fuel-economy') {
      // Maximize fuel economy: use more once/twice-burned fuel, minimize fresh
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if (distanceFromCenter <= center / 3) {
            newPattern[i][j] = 'fresh-high';
          } else if (distanceFromCenter <= center / 2) {
            newPattern[i][j] = 'fresh-medium';
          } else if (distanceFromCenter <= center * 2 / 3) {
            newPattern[i][j] = 'once-burned';
          } else {
            newPattern[i][j] = 'twice-burned';
          }
          
          // Add gadolinia for reactivity control
          if ((i * j) % 7 === 0) {
            newPattern[i][j] = 'gad-bearing';
          }
        }
      }
    } else if (parameters.optimizationTarget === 'power-distribution') {
      // Flatten power distribution: checkerboard pattern
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if ((i + j) % 2 === 0) {
            if (distanceFromCenter < center / 2) {
              newPattern[i][j] = 'once-burned';
            } else {
              newPattern[i][j] = 'fresh-medium';
            }
          } else {
            if (distanceFromCenter < center / 2) {
              newPattern[i][j] = 'fresh-high';
            } else {
              newPattern[i][j] = 'twice-burned';
            }
          }
          
          // Add gadolinia in a strategic pattern
          if ((i * j) % 6 === 0 || (i + j) % 9 === 0) {
            newPattern[i][j] = 'gad-bearing';
          }
        }
      }
    }
    
    // Apply additional optimizations based on loading strategy
    if (parameters.loadingStrategy === 'low-leakage') {
      // Ensure periphery has burned fuel to reduce leakage
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if (distanceFromCenter >= center - 1) {
            newPattern[i][j] = 'twice-burned';
          }
        }
      }
    } else if (parameters.loadingStrategy === 'out-in') {
      // Out-in: fresh fuel at periphery, burned in center
      for (let i = 1; i < size - 1; i++) {
        for (let j = 1; j < size - 1; j++) {
          const distanceFromCenter = Math.max(Math.abs(i - center), Math.abs(j - center));
          
          if (distanceFromCenter <= center / 3) {
            // Swap some center assemblies with periphery
            if (newPattern[i][j] === 'fresh-high' || newPattern[i][j] === 'fresh-medium') {
              newPattern[i][j] = 'once-burned';
            }
          }
          
          if (distanceFromCenter >= center * 2 / 3) {
            // Add fresh fuel to periphery
            if (newPattern[i][j] === 'once-burned' || newPattern[i][j] === 'twice-burned') {
              newPattern[i][j] = 'fresh-medium';
            }
          }
        }
      }
    }
    
    setLoadingPattern(newPattern);
    addMessage('success', 'Loading pattern optimized based on selected criteria. Please run analysis to see results.');
  };
  
  // Function to export loading pattern as CSV
  const exportLoadingPattern = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add header with metadata
    csvContent += `# Core Loading Pattern Optimizer Export\n`;
    csvContent += `# Date: ${new Date().toISOString()}\n`;
    csvContent += `# Core Size: ${parameters.coreSize}x${parameters.coreSize}\n`;
    csvContent += `# Optimization Target: ${parameters.optimizationTarget}\n`;
    csvContent += `# Loading Strategy: ${parameters.loadingStrategy}\n\n`;
    
    // Add assembly type mapping
    csvContent += '# Assembly Type Mapping:\n';
    fuelAssemblyTypes.forEach(type => {
      csvContent += `# ${type.id},${type.name},${type.enrichment}%,${type.burnup} MWd/tU\n`;
    });
    csvContent += '\n';
    
    // Add the loading pattern
    loadingPattern.forEach(row => {
      csvContent += row.map(cell => cell || 'empty').join(',');
      csvContent += '\n';
    });
    
    // Add analysis results if available
    if (analysisResults) {
      csvContent += '\n# Analysis Results:\n';
      csvContent += `# Estimated Cycle Length: ${analysisResults.estimatedCycleLength} months\n`;
      csvContent += `# Power Peaking Factor: ${analysisResults.powerPeakingFactor.toFixed(3)}\n`;
      csvContent += `# Average Enrichment: ${analysisResults.avgEnrichment.toFixed(2)}%\n`;
      csvContent += `# Estimated Discharge Burnup: ${analysisResults.estimatedBurnup} MWd/tU\n`;
      
      // Add assembly counts
      csvContent += '\n# Assembly Counts:\n';
      for (const [type, count] of Object.entries(analysisResults.assemblyCounts)) {
        if (count > 0) {
          const assemblyType = fuelAssemblyTypes.find(a => a.id === type);
          csvContent += `# ${assemblyType.name}: ${count}\n`;
        }
      }
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'core_loading_pattern.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    addMessage('info', 'Exported loading pattern to CSV file.');
  };
  
  // Function to export visualization as image
  const exportVisualization = () => {
    if (canvasRef.current) {
      // Use canvas method to export as PNG
      const canvasImage = canvasRef.current.toDataURL('image/png');
      const link = document.createElement('a');
      link.setAttribute('href', canvasImage);
      link.setAttribute('download', 'core_loading_pattern.png');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      addMessage('info', 'Exported visualization as PNG image.');
    }
  };
  
  // Function to add a message
  const addMessage = (type, text) => {
    const newMessage = {
      id: Date.now(),
      type,
      text,
    };
    
    setMessages(prev => [newMessage, ...prev.slice(0, 4)]);
    
    // Auto-remove after 8 seconds
    setTimeout(() => {
      setMessages(prev => prev.filter(msg => msg.id !== newMessage.id));
    }, 8000);
  };
  
  // Function to clear all messages
  const clearMessages = () => {
    setMessages([]);
  };
  
  // Find assembly type by ID
  const getAssemblyById = (id) => {
    return fuelAssemblyTypes.find(assembly => assembly.id === id) || null;
  };
  
  // Function to get cell color based on assembly type and power
  const getCellColor = (assemblyType, row, col) => {
    const assembly = getAssemblyById(assemblyType);
    
    if (!assembly) {
      return '#EEEEEE'; // Default light gray for empty cells
    }
    
    let color = assembly.color;
    
    // Adjust color based on power distribution if available
    if (analysisResults && analysisResults.powerDistribution && analysisResults.powerDistribution[row] && analysisResults.powerDistribution[row][col] > 0) {
      const power = analysisResults.powerDistribution[row][col];
      
      // Make colors more intense for high power
      if (power > 1.2) {
        // Darken the color for high power
        const darkenFactor = Math.min(1, (power - 1) * 0.5);
        color = adjustColor(color, -darkenFactor * 30);
      } else if (power < 0.8) {
        // Lighten the color for low power
        const lightenFactor = Math.min(1, (1 - power) * 0.8);
        color = adjustColor(color, lightenFactor * 50);
      }
    }
    
    return color;
  };
  
  // Helper function to adjust color brightness
  const adjustColor = (color, amount) => {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    const newR = Math.max(0, Math.min(255, r + amount));
    const newG = Math.max(0, Math.min(255, g + amount));
    const newB = Math.max(0, Math.min(255, b + amount));
    
    return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Core Loading Pattern Optimizer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Design and optimize nuclear reactor core loading patterns to maximize cycle length, fuel utilization, 
          or flatten power distribution. Arrange different fuel assembly types to create an optimized loading pattern.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        {/* Messages */}
        {messages.length > 0 && (
          <Box sx={{ mb: 2 }}>
            {messages.map(message => (
              <Alert key={message.id} severity={message.type} sx={{ mb: 1 }}>
                {message.text}
              </Alert>
            ))}
          </Box>
        )}
        
        {/* Loading Pattern Presets */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <FormControl fullWidth>
              <InputLabel id="preset-select-label">Loading Pattern Preset</InputLabel>
              <Select
                labelId="preset-select-label"
                id="preset-select"
                value={selectedPreset}
                label="Loading Pattern Preset"
                onChange={handlePresetChange}
              >
                <MenuItem value=""><em>Custom Pattern</em></MenuItem>
                {loadingPatternPresets.map(preset => (
                  <MenuItem key={preset.id} value={preset.id}>{preset.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          {selectedPreset && (
            <Grid item xs={12} md={6}>
              <Typography variant="body2" color="text.secondary">
                {loadingPatternPresets.find(p => p.id === selectedPreset)?.description}
              </Typography>
            </Grid>
          )}
        </Grid>
        
        {/* Tabs for design, results, settings */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="core optimizer tabs">
            <Tab icon={<GridOnIcon />} iconPosition="start" label="Design" {...a11yProps(0)} />
            <Tab icon={<ShowChartIcon />} iconPosition="start" label="Results" {...a11yProps(1)} />
            <Tab icon={<CalculateIcon />} iconPosition="start" label="Settings" {...a11yProps(2)} />
          </Tabs>
        </Box>
        
        {/* Design Tab */}
        <TabPanel value={activeTab} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={2} 
                sx={{ 
                  p: 2, 
                  height: '100%', 
                  position: 'relative',
                  overflow: 'auto'
                }}
              >
                <Typography variant="subtitle1" gutterBottom>
                  Core Loading Pattern
                </Typography>
                
                {/* Core Visualization */}
                <Box 
                  sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    my: 2,
                    overflow: 'auto'
                  }}
                >
                  <Box 
                    sx={{
                      display: 'inline-block',
                      border: '1px solid #ccc',
                      borderRadius: 1,
                      backgroundColor: '#f5f5f5',
                      p: 2
                    }}
                    ref={canvasRef}
                  >
                    {loadingPattern.map((row, rowIndex) => (
                      <Box key={rowIndex} sx={{ display: 'flex' }}>
                        {row.map((cell, colIndex) => (
                          <Box
                            key={colIndex}
                            sx={{
                              width: 40,
                              height: 40,
                              border: '1px solid #888',
                              m: 0.5,
                              backgroundColor: getCellColor(cell, rowIndex, colIndex),
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              fontSize: '11px',
                              color: '#fff',
                              textShadow: '0px 0px 2px rgba(0,0,0,0.7)',
                              position: 'relative',
                              '&:hover': {
                                boxShadow: '0 0 0 2px #2196F3',
                              }
                            }}
                            onClick={() => updateLoadingPattern(rowIndex, colIndex)}
                          >
                            {/* Cell content - first two letters of assembly type */}
                            {cell && cell.substring(0, 2).toUpperCase()}
                            
                            {/* Power value overlay when analysis is available */}
                            {analysisResults && 
                             analysisResults.powerDistribution && 
                             analysisResults.powerDistribution[rowIndex] && 
                             analysisResults.powerDistribution[rowIndex][colIndex] > 0 && (
                              <Box 
                                sx={{ 
                                  position: 'absolute', 
                                  bottom: 0, 
                                  right: 1, 
                                  fontSize: '9px',
                                  fontWeight: 'bold'
                                }}
                              >
                                {analysisResults.powerDistribution[rowIndex][colIndex].toFixed(2)}
                              </Box>
                            )}
                          </Box>
                        ))}
                      </Box>
                    ))}
                  </Box>
                </Box>
                
                {/* Editing Controls */}
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 2 }}>
                  <ToggleButtonGroup
                    value={editMode}
                    exclusive
                    onChange={handleEditModeChange}
                    size="small"
                    sx={{ mr: 2 }}
                  >
                    <ToggleButton value="paint">
                      <Tooltip title="Paint mode: click cells to place selected assembly">
                        <ColorLensIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                    <ToggleButton value="erase">
                      <Tooltip title="Erase mode: click cells to remove assemblies">
                        <RestartAltIcon fontSize="small" />
                      </Tooltip>
                    </ToggleButton>
                  </ToggleButtonGroup>
                  
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={analyzeLoadingPattern}
                    sx={{ mr: 1 }}
                  >
                    Analyze
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<AutoFixHighIcon />}
                    onClick={optimizeLoadingPattern}
                  >
                    Auto-Optimize
                  </Button>
                </Box>
                
                {/* Legend */}
                <Box sx={{ mt: 3, borderTop: '1px solid #eee', pt: 2 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Legend
                  </Typography>
                  <Grid container spacing={1}>
                    {fuelAssemblyTypes.map(type => (
                      <Grid item xs={6} sm={4} md={4} key={type.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 20, 
                              height: 20, 
                              backgroundColor: type.color, 
                              mr: 1, 
                              border: '1px solid #888' 
                            }} 
                          />
                          <Typography variant="caption">
                            {type.name}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Assembly Selection
                </Typography>
                
                <FormControl fullWidth sx={{ mb: 3 }}>
                  <InputLabel id="assembly-select-label">Assembly Type</InputLabel>
                  <Select
                    labelId="assembly-select-label"
                    id="assembly-select"
                    value={selectedAssemblyType}
                    label="Assembly Type"
                    onChange={handleAssemblyTypeChange}
                  >
                    {fuelAssemblyTypes.map(assembly => (
                      <MenuItem key={assembly.id} value={assembly.id}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box 
                            sx={{ 
                              width: 16, 
                              height: 16, 
                              backgroundColor: assembly.color, 
                              mr: 1, 
                              border: '1px solid #888' 
                            }} 
                          />
                          {assembly.name}
                        </Box>
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                {/* Selected Assembly Details */}
                {selectedAssemblyType && (
                  <Card variant="outlined" sx={{ mb: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="primary">
                        {getAssemblyById(selectedAssemblyType)?.name}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {getAssemblyById(selectedAssemblyType)?.description}
                      </Typography>
                      <Grid container spacing={1}>
                        <Grid item xs={6}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Enrichment:
                          </Typography>
                          <Typography variant="body2">
                            {getAssemblyById(selectedAssemblyType)?.enrichment}%
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Burnup:
                          </Typography>
                          <Typography variant="body2">
                            {getAssemblyById(selectedAssemblyType)?.burnup} MWd/tU
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Reactivity:
                          </Typography>
                          <Typography variant="body2">
                            {getAssemblyById(selectedAssemblyType)?.residualReactivity.toFixed(2)}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="caption" display="block" color="text.secondary">
                            Special:
                          </Typography>
                          <Typography variant="body2">
                            {getAssemblyById(selectedAssemblyType)?.hasBurnablePoison ? 'Burnable Poison' : 
                             getAssemblyById(selectedAssemblyType)?.isReflector ? 'Reflector' : 'None'}
                          </Typography>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                )}
                
                {/* Actions */}
                <Box sx={{ mt: 2 }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<RestartAltIcon />}
                    onClick={initializeLoadingPattern}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Reset Pattern
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<SaveIcon />}
                    onClick={exportLoadingPattern}
                    fullWidth
                    sx={{ mb: 1 }}
                  >
                    Export Data (CSV)
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<DownloadIcon />}
                    onClick={exportVisualization}
                    fullWidth
                  >
                    Export Visualization
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </TabPanel>
        
        {/* Results Tab */}
        <TabPanel value={activeTab} index={1}>
          {analysisResults ? (
            <Grid container spacing={3}>
              <Grid item xs={12} md={7}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Analysis Results
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Cycle Length
                          </Typography>
                          <Typography variant="h4" sx={{ my: 1 }}>
                            {analysisResults.estimatedCycleLength} <Typography component="span" variant="body2">months</Typography>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {analysisResults.estimatedCycleLength < parameters.cycleLength ? (
                              <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Below target of {parameters.cycleLength} months
                              </Box>
                            ) : (
                              `Exceeds target by ${analysisResults.estimatedCycleLength - parameters.cycleLength} months`
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Power Peaking Factor
                          </Typography>
                          <Typography variant="h4" sx={{ my: 1 }}>
                            {analysisResults.powerPeakingFactor.toFixed(2)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {analysisResults.powerPeakingFactor > parameters.fluxPeakingLimit ? (
                              <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Exceeds limit of {parameters.fluxPeakingLimit}
                              </Box>
                            ) : (
                              `Within limit (${((1 - analysisResults.powerPeakingFactor / parameters.fluxPeakingLimit) * 100).toFixed(1)}% margin)`
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Average Enrichment
                          </Typography>
                          <Typography variant="h4" sx={{ my: 1 }}>
                            {analysisResults.avgEnrichment.toFixed(2)}% <Typography component="span" variant="body2">U-235</Typography>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {analysisResults.avgEnrichment > parameters.maxEnrichment ? (
                              <Box sx={{ color: 'error.main', display: 'flex', alignItems: 'center' }}>
                                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Exceeds maximum of {parameters.maxEnrichment}%
                              </Box>
                            ) : (
                              `Within regulatory limits`
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Card sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="primary">
                            Discharge Burnup
                          </Typography>
                          <Typography variant="h4" sx={{ my: 1 }}>
                            {analysisResults.estimatedBurnup} <Typography component="span" variant="body2">MWd/tU</Typography>
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {analysisResults.estimatedBurnup < parameters.minBurnupLimit ? (
                              <Box sx={{ color: 'warning.main', display: 'flex', alignItems: 'center' }}>
                                <WarningIcon fontSize="small" sx={{ mr: 0.5 }} />
                                Below target of {parameters.minBurnupLimit} MWd/tU
                              </Box>
                            ) : (
                              `Good fuel utilization`
                            )}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Key Parameters
                  </Typography>
                  
                  <Grid container spacing={1} sx={{ mb: 3 }}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Core Size:
                      </Typography>
                      <Typography variant="body2">
                        {parameters.coreSize}×{parameters.coreSize} assemblies
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Thermal Power:
                      </Typography>
                      <Typography variant="body2">
                        {parameters.thermalPower} MWt
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Loading Strategy:
                      </Typography>
                      <Typography variant="body2">
                        {parameters.loadingStrategy.replace('-', ' ')}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Fuel Assemblies:
                      </Typography>
                      <Typography variant="body2">
                        {analysisResults.totalAssemblies - (analysisResults.assemblyCounts.reflector || 0)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Effective Reactivity:
                      </Typography>
                      <Typography variant="body2">
                        {analysisResults.effectiveReactivity.toFixed(3)}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={6} sm={4}>
                      <Typography variant="body2" color="text.secondary">
                        Optimization Target:
                      </Typography>
                      <Typography variant="body2">
                        {parameters.optimizationTarget.replace('-', ' ')}
                      </Typography>
                    </Grid>
                  </Grid>
                  
                  <Button 
                    variant="contained" 
                    startIcon={<CalculateIcon />}
                    onClick={analyzeLoadingPattern}
                    size="small"
                  >
                    Re-analyze Pattern
                  </Button>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={5}>
                <Paper elevation={2} sx={{ p: 2 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Assembly Distribution
                  </Typography>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', mb: 3 }}>
                    {/* Custom assembly distribution visualization */}
                    {Object.entries(analysisResults.assemblyCounts)
                      .filter(([_, count]) => count > 0)
                      .map(([type, count]) => {
                        const assembly = getAssemblyById(type);
                        const percentage = ((count / analysisResults.totalAssemblies) * 100).toFixed(1);
                        return (
                          <Box 
                            key={type} 
                            sx={{ 
                              m: 1, 
                              width: 90, 
                              height: 90, 
                              borderRadius: '50%', 
                              backgroundColor: assembly.color,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: '#fff',
                              textShadow: '0px 0px 2px rgba(0,0,0,0.7)',
                              border: '2px solid #fff',
                              boxShadow: '0 0 5px rgba(0,0,0,0.2)'
                            }}
                          >
                            <Typography variant="subtitle2">{count}</Typography>
                            <Typography variant="caption">{percentage}%</Typography>
                          </Box>
                        );
                      })}
                  </Box>
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Assembly Counts
                  </Typography>
                  
                  <Grid container spacing={1}>
                    {Object.entries(analysisResults.assemblyCounts)
                      .filter(([_, count]) => count > 0)
                      .map(([type, count]) => {
                        const assembly = getAssemblyById(type);
                        return (
                          <Grid item xs={12} key={type}>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Box 
                                  sx={{ 
                                    width: 16, 
                                    height: 16, 
                                    backgroundColor: assembly.color, 
                                    mr: 1, 
                                    border: '1px solid #888' 
                                  }} 
                                />
                                <Typography variant="body2">
                                  {assembly.name}
                                </Typography>
                              </Box>
                              <Typography variant="body2" fontWeight="bold">
                                {count} ({((count / analysisResults.totalAssemblies) * 100).toFixed(1)}%)
                              </Typography>
                            </Box>
                          </Grid>
                        );
                      })}
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="subtitle2" gutterBottom>
                    Recommendations
                  </Typography>
                  
                  <Box sx={{ mb: 1 }}>
                    {analysisResults.powerPeakingFactor > parameters.fluxPeakingLimit && (
                      <Alert severity="warning" sx={{ mb: 1 }}>
                        Reduce power peaking by redistributing fresh fuel more evenly or adding more burnable poisons.
                      </Alert>
                    )}
                    
                    {analysisResults.estimatedCycleLength < parameters.cycleLength && (
                      <Alert severity="info" sx={{ mb: 1 }}>
                        Increase cycle length by adding more fresh fuel or using higher enrichment.
                      </Alert>
                    )}
                    
                    {analysisResults.avgEnrichment > parameters.maxEnrichment && (
                      <Alert severity="error" sx={{ mb: 1 }}>
                        Reduce average enrichment by using more low-enriched or once-burned assemblies.
                      </Alert>
                    )}
                    
                    {analysisResults.estimatedBurnup < parameters.minBurnupLimit && (
                      <Alert severity="info" sx={{ mb: 1 }}>
                        Improve fuel utilization by increasing cycle length or using fewer fresh assemblies.
                      </Alert>
                    )}
                    
                    {analysisResults.powerPeakingFactor <= parameters.fluxPeakingLimit && 
                     analysisResults.estimatedCycleLength >= parameters.cycleLength && 
                     analysisResults.avgEnrichment <= parameters.maxEnrichment && (
                      <Alert severity="success" sx={{ mb: 1 }}>
                        Pattern meets all design criteria. Consider optimizing for fuel economy or further flattening power distribution.
                      </Alert>
                    )}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          ) : (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No Analysis Results Available
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Please design a loading pattern and click "Analyze" to see results here.
              </Typography>
              <Button 
                variant="contained" 
                startIcon={<CalculateIcon />}
                onClick={() => setActiveTab(0)}
              >
                Go to Design
              </Button>
            </Box>
          )}
        </TabPanel>
        
        {/* Settings Tab */}
        <TabPanel value={activeTab} index={2}>
          <Paper elevation={2} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Core Parameters
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Core Size ({parameters.coreSize}×{parameters.coreSize}):
                  </Typography>
                  <Slider
                    value={parameters.coreSize}
                    step={2}
                    marks
                    min={11}
                    max={19}
                    onChange={(_, value) => handleParameterChange('coreSize', value)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Number of assemblies across core (must be odd for symmetry)
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Target Cycle Length:
                  </Typography>
                  <Slider
                    value={parameters.cycleLength}
                    step={1}
                    marks
                    min={12}
                    max={24}
                    onChange={(_, value) => handleParameterChange('cycleLength', value)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} months`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Desired operational period in months between refuelings
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Max Power Peaking Factor:
                  </Typography>
                  <Slider
                    value={parameters.fluxPeakingLimit}
                    step={0.1}
                    min={1.5}
                    max={3.0}
                    onChange={(_, value) => handleParameterChange('fluxPeakingLimit', value)}
                    valueLabelDisplay="auto"
                  />
                  <Typography variant="caption" color="text.secondary">
                    Maximum allowed power peaking factor for thermal limits
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Maximum Enrichment:
                  </Typography>
                  <Slider
                    value={parameters.maxEnrichment}
                    step={0.1}
                    min={3.0}
                    max={5.0}
                    onChange={(_, value) => handleParameterChange('maxEnrichment', value)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Maximum allowed U-235 enrichment (regulatory limit)
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Minimum Burnup Target:
                  </Typography>
                  <Slider
                    value={parameters.minBurnupLimit}
                    step={1000}
                    min={30000}
                    max={60000}
                    onChange={(_, value) => handleParameterChange('minBurnupLimit', value)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value} MWd/tU`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Minimum target for discharge burnup (fuel utilization)
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <Stack spacing={1}>
                  <Typography variant="body2">
                    Safety Margin:
                  </Typography>
                  <Slider
                    value={parameters.safetyMargin}
                    step={5}
                    min={5}
                    max={30}
                    onChange={(_, value) => handleParameterChange('safetyMargin', value)}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => `${value}%`}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Safety margin to regulatory thermal limits
                  </Typography>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="optimization-target-label">Optimization Target</InputLabel>
                  <Select
                    labelId="optimization-target-label"
                    value={parameters.optimizationTarget}
                    label="Optimization Target"
                    onChange={(e) => handleParameterChange('optimizationTarget', e.target.value)}
                  >
                    <MenuItem value="cycle-length">Maximize Cycle Length</MenuItem>
                    <MenuItem value="fuel-economy">Maximize Fuel Economy</MenuItem>
                    <MenuItem value="power-distribution">Flatten Power Distribution</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary">
                  Primary goal for optimization
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="loading-strategy-label">Loading Strategy</InputLabel>
                  <Select
                    labelId="loading-strategy-label"
                    value={parameters.loadingStrategy}
                    label="Loading Strategy"
                    onChange={(e) => handleParameterChange('loadingStrategy', e.target.value)}
                  >
                    <MenuItem value="in-out">In-Out (Fresh in center)</MenuItem>
                    <MenuItem value="out-in">Out-In (Fresh at periphery)</MenuItem>
                    <MenuItem value="low-leakage">Low-Leakage</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary">
                  General strategy for fuel placement
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="enrichment-distribution-label">Enrichment Distribution</InputLabel>
                  <Select
                    labelId="enrichment-distribution-label"
                    value={parameters.enrichmentDistribution}
                    label="Enrichment Distribution"
                    onChange={(e) => handleParameterChange('enrichmentDistribution', e.target.value)}
                  >
                    <MenuItem value="uniform">Uniform Enrichment</MenuItem>
                    <MenuItem value="radial-zones">Radial Zoning</MenuItem>
                    <MenuItem value="custom">Custom Distribution</MenuItem>
                  </Select>
                </FormControl>
                <Typography variant="caption" color="text.secondary">
                  How enrichment varies across assemblies
                </Typography>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={() => {
                  setParameters(initialParameters);
                  initializeLoadingPattern();
                }}
              >
                Reset to Defaults
              </Button>
              
              <Button
                variant="contained"
                onClick={() => setActiveTab(0)}
              >
                Apply Settings
              </Button>
            </Box>
          </Paper>
        </TabPanel>
      </Paper>
    </Box>
  );
}

export default CoreLoadingPatternOptimizer;