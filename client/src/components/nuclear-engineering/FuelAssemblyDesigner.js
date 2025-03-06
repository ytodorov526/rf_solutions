import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  TextField,
  Button,
  Divider,
  Stack,
  Tooltip,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import RefreshIcon from '@mui/icons-material/Refresh';
import DownloadIcon from '@mui/icons-material/Download';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import GridOnIcon from '@mui/icons-material/GridOn';
import ViewInArIcon from '@mui/icons-material/ViewInAr';

// Fuel pin types with their properties
const fuelPinTypes = {
  fuel: {
    name: 'Fuel Rod',
    color: '#ff6b6b',
    enrichment: 4.5, // % U-235
    description: 'Standard fuel rod containing uranium dioxide pellets',
  },
  gadolinia: {
    name: 'Gadolinia Rod',
    color: '#ffd166',
    enrichment: 3.5,
    gadolinia: 8.0, // % Gd2O3
    description: 'Fuel rod containing gadolinium oxide as a burnable absorber',
  },
  controlRod: {
    name: 'Guide Tube',
    color: '#118ab2',
    description: 'Guide tube for control rod or instrumentation',
  },
  water: {
    name: 'Water Hole',
    color: '#73d2de',
    description: 'Water-filled location for moderation and cooling',
  },
  empty: {
    name: 'Empty',
    color: '#e9ecef',
    description: 'Empty position',
  },
};

// Assembly design templates
const assemblyTemplates = {
  '17x17_PWR': {
    name: '17×17 PWR Assembly',
    rows: 17,
    cols: 17,
    pinDiameter: 9.5, // mm
    pinPitch: 12.6, // mm
    pattern: 'custom',
    description: 'Standard 17×17 PWR fuel assembly with 264 fuel rods and 25 guide tubes',
    defaultLayout: 'guide_tubes', // Predefined layout with guide tubes in typical locations
  },
  '8x8_BWR': {
    name: '8×8 BWR Assembly',
    rows: 8,
    cols: 8,
    pinDiameter: 12.3, // mm
    pinPitch: 16.2, // mm
    pattern: 'custom',
    description: 'Standard 8×8 BWR fuel assembly with water channel in center',
    defaultLayout: 'water_channel', // Predefined layout with water channel
  },
  'VVER_hexagonal': {
    name: 'VVER Hexagonal Assembly',
    rows: 11,
    cols: 11,
    hexagonal: true,
    pinDiameter: 9.1, // mm
    pinPitch: 12.75, // mm
    pattern: 'hexagonal',
    description: 'Hexagonal VVER-type fuel assembly with 126 fuel pins',
    defaultLayout: 'vver_standard', // Predefined hexagonal layout
  },
};

// Helper function to create an empty grid based on rows and columns
const createEmptyGrid = (rows, cols) => {
  return Array(rows).fill().map(() => Array(cols).fill('empty'));
};

// Helper function to create a grid with a predefined layout
const createTemplateGrid = (template, rows, cols) => {
  // Start with an empty grid
  const grid = createEmptyGrid(rows, cols);
  
  switch (template) {
    case 'guide_tubes':
      // For 17x17 PWR with typical guide tube positions
      if (rows === 17 && cols === 17) {
        // Fill all with fuel rods initially
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            grid[i][j] = 'fuel';
          }
        }
        
        // Define guide tube positions (25 positions for 17x17)
        const guidePositions = [
          [2, 2], [2, 6], [2, 10], [2, 14], 
          [6, 2], [6, 6], [6, 10], [6, 14], 
          [8, 8], // center instrumentation tube
          [10, 2], [10, 6], [10, 10], [10, 14], 
          [14, 2], [14, 6], [14, 10], [14, 14],
          [4, 4], [4, 12], [12, 4], [12, 12],
          [6, 8], [8, 6], [10, 8], [8, 10]
        ];
        
        // Set guide tubes
        guidePositions.forEach(([row, col]) => {
          grid[row][col] = 'controlRod';
        });
        
        // Add some gadolinia pins
        const gadoliniaPins = [
          [1, 5], [1, 11], [5, 1], [5, 15], 
          [11, 1], [11, 15], [15, 5], [15, 11]
        ];
        
        gadoliniaPins.forEach(([row, col]) => {
          grid[row][col] = 'gadolinia';
        });
      }
      break;
      
    case 'water_channel':
      // For 8x8 BWR with water channel
      if (rows === 8 && cols === 8) {
        // Fill all with fuel rods initially
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            grid[i][j] = 'fuel';
          }
        }
        
        // Center water channel (2x2)
        grid[3][3] = 'water';
        grid[3][4] = 'water';
        grid[4][3] = 'water';
        grid[4][4] = 'water';
        
        // Add some gadolinia pins
        const gadoliniaPins = [
          [1, 1], [1, 6], [6, 1], [6, 6], 
          [2, 4], [4, 2], [5, 5]
        ];
        
        gadoliniaPins.forEach(([row, col]) => {
          grid[row][col] = 'gadolinia';
        });
      }
      break;
      
    case 'vver_standard':
      // For VVER hexagonal layout, use a simplified approximation in rectangular grid
      // In a real implementation, this would use proper hexagonal geometry
      if (rows === 11 && cols === 11) {
        // Fill center region with fuel
        for (let i = 0; i < rows; i++) {
          for (let j = 0; j < cols; j++) {
            // Create a hexagonal-like pattern in the rectangular grid
            const dx = Math.abs(i - 5);
            const dy = Math.abs(j - 5);
            
            if (dx + dy <= 7) {
              grid[i][j] = 'fuel';
            }
          }
        }
        
        // Define guide tube positions
        const guidePositions = [
          [2, 5], [5, 2], [5, 8], [8, 5],
          [3, 3], [3, 7], [7, 3], [7, 7]
        ];
        
        // Set guide tubes
        guidePositions.forEach(([row, col]) => {
          grid[row][col] = 'controlRod';
        });
        
        // Add some gadolinia pins
        const gadoliniaPins = [
          [4, 4], [4, 6], [6, 4], [6, 6]
        ];
        
        gadoliniaPins.forEach(([row, col]) => {
          grid[row][col] = 'gadolinia';
        });
      }
      break;
      
    default:
      // For any other cases, just return an empty grid
      break;
  }
  
  return grid;
};

// Function to calculate assembly characteristics
const calculateAssemblyStats = (grid, pinTypes, assemblyData) => {
  const { pinDiameter, pinPitch } = assemblyData;
  
  // Count different pin types
  let fuelCount = 0;
  let gadoliniaCount = 0;
  let guideCount = 0;
  let waterCount = 0;
  let emptyCount = 0;
  
  // Calculate average enrichment
  let totalUraniumWeight = 0;
  let totalU235Weight = 0;
  
  grid.forEach(row => {
    row.forEach(cell => {
      switch (cell) {
        case 'fuel':
          fuelCount++;
          // Calculate U-235 content based on enrichment
          const fuelWeight = 1; // Normalized weight
          totalUraniumWeight += fuelWeight;
          totalU235Weight += fuelWeight * (pinTypes.fuel.enrichment / 100);
          break;
        case 'gadolinia':
          gadoliniaCount++;
          // Gadolinia pins have lower uranium content due to Gd2O3
          const gadoliniaFuelWeight = 0.92; // Assumption: 8% Gd2O3 displaces uranium
          totalUraniumWeight += gadoliniaFuelWeight;
          totalU235Weight += gadoliniaFuelWeight * (pinTypes.gadolinia.enrichment / 100);
          break;
        case 'controlRod':
          guideCount++;
          break;
        case 'water':
          waterCount++;
          break;
        case 'empty':
          emptyCount++;
          break;
        default:
          break;
      }
    });
  });
  
  // Calculate average enrichment
  const averageEnrichment = totalUraniumWeight > 0 
    ? (totalU235Weight / totalUraniumWeight) * 100 
    : 0;
  
  // Calculate moderation ratio (approximation: water area / fuel area)
  const fuelArea = (fuelCount + gadoliniaCount) * Math.PI * Math.pow(pinDiameter / 2, 2);
  const waterEquivArea = (waterCount + guideCount) * Math.PI * Math.pow(pinDiameter / 2, 2);
  
  // Consider water in the gaps between pins
  const totalAssemblyArea = grid.length * grid[0].length * Math.pow(pinPitch, 2);
  const totalPinArea = (fuelCount + gadoliniaCount + guideCount + waterCount) * Math.PI * Math.pow(pinDiameter / 2, 2);
  const gapWaterArea = totalAssemblyArea - totalPinArea;
  
  const totalWaterArea = waterEquivArea + gapWaterArea;
  const moderationRatio = fuelArea > 0 ? totalWaterArea / fuelArea : 0;
  
  return {
    fuelRods: fuelCount,
    gadoliniaRods: gadoliniaCount,
    guideTubes: guideCount,
    waterHoles: waterCount,
    emptyPositions: emptyCount,
    totalPositions: grid.length * grid[0].length,
    averageEnrichment: averageEnrichment.toFixed(3),
    moderationRatio: moderationRatio.toFixed(3),
    heavyMetalWeight: totalUraniumWeight.toFixed(1), // Normalized units
    // Other characteristics could be calculated here
  };
};

function FuelAssemblyDesigner() {
  // Reference for the canvas element
  const canvasRef = useRef(null);
  
  // State for assembly configuration
  const [assemblyType, setAssemblyType] = useState('17x17_PWR');
  const [rows, setRows] = useState(17);
  const [cols, setCols] = useState(17);
  const [pinDiameter, setPinDiameter] = useState(9.5);
  const [pinPitch, setPinPitch] = useState(12.6);
  
  // State for the grid data
  const [grid, setGrid] = useState([]);
  
  // State for the currently selected pin type
  const [selectedPinType, setSelectedPinType] = useState('fuel');
  
  // State for view mode (2D or 3D)
  const [viewMode, setViewMode] = useState('2D');
  
  // State for assembly statistics
  const [assemblyStats, setAssemblyStats] = useState({});
  
  // State for selected cell (for detailed editing)
  const [selectedCell, setSelectedCell] = useState(null);
  
  // State for pin properties (for detailed editing)
  const [pinProperties, setPinProperties] = useState({
    enrichment: 4.5,
    gadolinia: 0,
    burnup: 0,
  });
  
  // Initialize grid when component loads or assembly type changes
  useEffect(() => {
    const template = assemblyTemplates[assemblyType];
    if (template) {
      setRows(template.rows);
      setCols(template.cols);
      setPinDiameter(template.pinDiameter);
      setPinPitch(template.pinPitch);
      
      // Create grid based on template
      const newGrid = createTemplateGrid(template.defaultLayout, template.rows, template.cols);
      setGrid(newGrid);
      
      // Calculate statistics
      const stats = calculateAssemblyStats(newGrid, fuelPinTypes, {
        pinDiameter: template.pinDiameter,
        pinPitch: template.pinPitch
      });
      setAssemblyStats(stats);
    }
  }, [assemblyType]);
  
  // Function to handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        // Maintain aspect ratio
        const container = canvas.parentElement;
        if (container) {
          const containerWidth = container.clientWidth;
          const containerHeight = container.clientHeight;
          const size = Math.min(containerWidth, containerHeight, 600);
          canvas.width = size;
          canvas.height = size;
          drawAssembly(); // Redraw with new size
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [grid, viewMode, rows, cols, selectedCell]);

  // Draw the assembly function
  const drawAssembly = () => {
    const canvas = canvasRef.current;
    if (!canvas || grid.length === 0) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    try {
      // Clear canvas
      ctx.clearRect(0, 0, width, height);
      
      // Calculate cell size to fit the grid
      const cellSize = Math.min(
        width / cols,
        height / rows
      );
      
      // Calculate offset to center the grid
      const offsetX = (width - cols * cellSize) / 2;
      const offsetY = (height - rows * cellSize) / 2;
      
      // Draw background grid
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;
      
      for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY + i * cellSize);
        ctx.lineTo(offsetX + cols * cellSize, offsetY + i * cellSize);
        ctx.stroke();
      }
      
      for (let j = 0; j <= cols; j++) {
        ctx.beginPath();
        ctx.moveTo(offsetX + j * cellSize, offsetY);
        ctx.lineTo(offsetX + j * cellSize, offsetY + rows * cellSize);
        ctx.stroke();
      }
      
      // Draw cells
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          if (i < grid.length && j < grid[i].length) {
            const pinType = grid[i][j];
            const pinInfo = fuelPinTypes[pinType] || fuelPinTypes.empty;
            
            // Calculate cell position
            const x = offsetX + j * cellSize;
            const y = offsetY + i * cellSize;
            
            // Draw pin
            ctx.fillStyle = pinInfo.color;
            
            if (viewMode === '2D') {
              // Simple 2D circles
              const radius = cellSize * 0.4; // Adjustable size relative to cell
              ctx.beginPath();
              ctx.arc(
                x + cellSize / 2,
                y + cellSize / 2,
                radius,
                0,
                2 * Math.PI
              );
              ctx.fill();
              
              // Draw pin outline
              ctx.strokeStyle = '#333';
              ctx.lineWidth = 1;
              ctx.stroke();
              
              // If it's a selected cell, highlight it
              if (selectedCell && selectedCell.row === i && selectedCell.col === j) {
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
              }
              
            } else if (viewMode === '3D') {
              // More detailed 3D-like pins with shading
              const radius = cellSize * 0.4;
              
              try {
                // Add gradient for 3D effect
                const gradient = ctx.createRadialGradient(
                  x + cellSize / 2 - radius * 0.3,
                  y + cellSize / 2 - radius * 0.3,
                  0,
                  x + cellSize / 2,
                  y + cellSize / 2,
                  radius
                );
                
                gradient.addColorStop(0, lightenColor(pinInfo.color, 40));
                gradient.addColorStop(0.7, pinInfo.color);
                gradient.addColorStop(1, darkenColor(pinInfo.color, 30));
                
                ctx.fillStyle = gradient;
              } catch (error) {
                console.error('Error creating gradient:', error);
                ctx.fillStyle = pinInfo.color; // Fallback to flat color
              }
              
              ctx.beginPath();
              ctx.arc(
                x + cellSize / 2,
                y + cellSize / 2,
                radius,
                0,
                2 * Math.PI
              );
              ctx.fill();
              
              // Draw pin outline
              ctx.strokeStyle = '#333';
              ctx.lineWidth = 1;
              ctx.stroke();
              
              // For fuel pins, add pellet stacking details
              if (pinType === 'fuel' || pinType === 'gadolinia') {
                const innerRadius = radius * 0.7;
                
                // Draw inner circle (pellet)
                ctx.fillStyle = pinType === 'fuel' ? '#d63031' : '#fdcb6e';
                ctx.beginPath();
                ctx.arc(
                  x + cellSize / 2,
                  y + cellSize / 2,
                  innerRadius,
                  0,
                  2 * Math.PI
                );
                ctx.fill();
                
                // Add pellet details (horizontal lines)
                ctx.strokeStyle = '#9e0d11';
                ctx.lineWidth = 0.5;
                
                for (let k = 1; k < 4; k++) {
                  ctx.beginPath();
                  ctx.moveTo(
                    x + cellSize / 2 - innerRadius,
                    y + cellSize / 2 - innerRadius / 2 + k * innerRadius / 4
                  );
                  ctx.lineTo(
                    x + cellSize / 2 + innerRadius,
                    y + cellSize / 2 - innerRadius / 2 + k * innerRadius / 4
                  );
                  ctx.stroke();
                }
              }
              
              // If it's a selected cell, highlight it
              if (selectedCell && selectedCell.row === i && selectedCell.col === j) {
                ctx.strokeStyle = '#ff0000';
                ctx.lineWidth = 2;
                ctx.strokeRect(x + 2, y + 2, cellSize - 4, cellSize - 4);
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error drawing assembly:', error);
    }
  };
  
  // Draw the assembly when grid or view mode changes
  useEffect(() => {
    drawAssembly();
  }, [grid, viewMode, rows, cols, selectedCell]);
  
  // Helper functions for color manipulation
  const lightenColor = (color, amount) => {
    try {
      // Remove the # if present
      color = color.replace('#', '');
      
      // Check if color is a valid hex
      if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
        return '#FFFFFF'; // Return white as fallback
      }
      
      // Parse the color
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);
      
      // Lighten
      const newR = Math.min(255, r + amount);
      const newG = Math.min(255, g + amount);
      const newB = Math.min(255, b + amount);
      
      // Convert back to hex
      return '#' + newR.toString(16).padStart(2, '0') + 
                    newG.toString(16).padStart(2, '0') + 
                    newB.toString(16).padStart(2, '0');
    } catch (error) {
      console.error('Error lightening color:', error);
      return '#FFFFFF'; // Return white as fallback
    }
  };
  
  const darkenColor = (color, amount) => {
    try {
      // Remove the # if present
      color = color.replace('#', '');
      
      // Check if color is a valid hex
      if (!/^[0-9A-Fa-f]{6}$/.test(color)) {
        return '#000000'; // Return black as fallback
      }
      
      // Parse the color
      const r = parseInt(color.substring(0, 2), 16);
      const g = parseInt(color.substring(2, 4), 16);
      const b = parseInt(color.substring(4, 6), 16);
      
      // Darken
      const newR = Math.max(0, r - amount);
      const newG = Math.max(0, g - amount);
      const newB = Math.max(0, b - amount);
      
      // Convert back to hex
      return '#' + newR.toString(16).padStart(2, '0') + 
                    newG.toString(16).padStart(2, '0') + 
                    newB.toString(16).padStart(2, '0');
    } catch (error) {
      console.error('Error darkening color:', error);
      return '#000000'; // Return black as fallback
    }
  };
  
  // Function to handle assembly type change
  const handleAssemblyTypeChange = (event) => {
    setAssemblyType(event.target.value);
  };
  
  // Function to handle pin type selection
  const handlePinTypeChange = (event) => {
    setSelectedPinType(event.target.value);
  };
  
  // Function to handle view mode change
  const handleViewModeChange = (event, newViewMode) => {
    if (newViewMode !== null) {
      setViewMode(newViewMode);
    }
  };
  
  // Function to handle canvas click (cell selection)
  const handleCanvasClick = (event) => {
    try {
      const canvas = canvasRef.current;
      if (!canvas || grid.length === 0) return;
      
      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      
      // Calculate cell size and offset
      const cellSize = Math.min(
        canvas.width / cols,
        canvas.height / rows
      );
      
      const offsetX = (canvas.width - cols * cellSize) / 2;
      const offsetY = (canvas.height - rows * cellSize) / 2;
      
      // Calculate grid indices
      const j = Math.floor((x - offsetX) / cellSize);
      const i = Math.floor((y - offsetY) / cellSize);
      
      // Check if click is within grid bounds
      if (i >= 0 && i < rows && j >= 0 && j < cols) {
        // Make sure grid is initialized properly
        const newGrid = [...grid];
        
        // Ensure the row exists
        if (!newGrid[i]) {
          // If row doesn't exist, initialize necessary rows
          for (let r = 0; r <= i; r++) {
            if (!newGrid[r]) {
              newGrid[r] = Array(cols).fill('empty');
            }
          }
        }
        
        const currentCellType = newGrid[i][j];
        
        if (currentCellType !== selectedPinType) {
          newGrid[i][j] = selectedPinType;
          setGrid(newGrid);
          
          // Update assembly statistics
          const stats = calculateAssemblyStats(newGrid, fuelPinTypes, {
            pinDiameter,
            pinPitch
          });
          setAssemblyStats(stats);
        }
        
        // Set this as the selected cell for detailed editing
        setSelectedCell({ row: i, col: j });
        
        // Update pin properties based on the selected cell
        const pinType = selectedPinType;
        setPinProperties({
          enrichment: pinType === 'fuel' ? fuelPinTypes.fuel.enrichment : 
                      pinType === 'gadolinia' ? fuelPinTypes.gadolinia.enrichment : 0,
          gadolinia: pinType === 'gadolinia' ? fuelPinTypes.gadolinia.gadolinia : 0,
          burnup: 0, // Default burnup value
        });
      }
    } catch (error) {
      console.error('Error handling canvas click:', error);
    }
  };
  
  // Function to handle pin property changes
  const handlePinPropertyChange = (property, value) => {
    setPinProperties(prev => ({
      ...prev,
      [property]: value,
    }));
    
    // If we were to implement detailed pin-by-pin tracking, we would update those values here
  };
  
  // Function to reset to template
  const handleResetToTemplate = () => {
    const template = assemblyTemplates[assemblyType];
    if (template) {
      const newGrid = createTemplateGrid(template.defaultLayout, template.rows, template.cols);
      setGrid(newGrid);
      
      // Calculate statistics
      const stats = calculateAssemblyStats(newGrid, fuelPinTypes, {
        pinDiameter: template.pinDiameter,
        pinPitch: template.pinPitch
      });
      setAssemblyStats(stats);
      
      // Clear selected cell
      setSelectedCell(null);
    }
  };
  
  // Function to handle clear assembly
  const handleClearAssembly = () => {
    const newGrid = createEmptyGrid(rows, cols);
    setGrid(newGrid);
    
    // Calculate statistics
    const stats = calculateAssemblyStats(newGrid, fuelPinTypes, {
      pinDiameter,
      pinPitch
    });
    setAssemblyStats(stats);
    
    // Clear selected cell
    setSelectedCell(null);
  };
  
  // Function to download assembly design as JSON
  const handleDownloadDesign = () => {
    const designData = {
      assemblyType,
      rows,
      cols,
      pinDiameter,
      pinPitch,
      grid,
      statistics: assemblyStats,
    };
    
    const dataStr = JSON.stringify(designData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileName = 'fuel_assembly_' + assemblyType + '_' + new Date().toISOString().split('T')[0] + '.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileName);
    linkElement.click();
  };
  
  // Function to save assembly visualization as image
  const handleSaveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = 'fuel_assembly_' + assemblyType + '_' + new Date().toISOString().split('T')[0] + '.png';
    link.href = dataUrl;
    link.click();
  };
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Fuel Assembly Designer
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Design nuclear fuel assemblies with different pin configurations. Select an assembly type, 
          configure pin arrangement, and analyze basic nuclear characteristics.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          {/* Left column: Design controls */}
          <Grid item xs={12} md={5} lg={4}>
            <Typography variant="h6" gutterBottom>
              Assembly Configuration
            </Typography>
            
            {/* Assembly Type Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="assembly-type-label">Assembly Type</InputLabel>
              <Select
                labelId="assembly-type-label"
                id="assembly-type"
                value={assemblyType}
                label="Assembly Type"
                onChange={handleAssemblyTypeChange}
              >
                {Object.entries(assemblyTemplates).map(([key, template]) => (
                  <MenuItem key={key} value={key}>{template.name}</MenuItem>
                ))}
              </Select>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                {assemblyTemplates[assemblyType]?.description}
              </Typography>
            </FormControl>
            
            {/* Pin Type Selection */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Place Pin Type:
              </Typography>
              <FormControl fullWidth>
                <Select
                  id="pin-type-select"
                  value={selectedPinType}
                  onChange={handlePinTypeChange}
                  sx={{ mb: 2 }}
                >
                  {Object.entries(fuelPinTypes).map(([key, type]) => (
                    <MenuItem key={key} value={key}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box 
                          sx={{ 
                            width: 20, 
                            height: 20, 
                            borderRadius: '50%', 
                            backgroundColor: type.color,
                            mr: 1,
                            border: '1px solid #333'
                          }} 
                        />
                        {type.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <Typography variant="body2" color="text.secondary">
                {fuelPinTypes[selectedPinType].description}
              </Typography>
            </Box>
            
            {/* View Controls */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                View Mode:
              </Typography>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                sx={{ mb: 2 }}
              >
                <ToggleButton value="2D" aria-label="2D view">
                  <GridOnIcon sx={{ mr: 1 }} />
                  2D View
                </ToggleButton>
                <ToggleButton value="3D" aria-label="3D view">
                  <ViewInArIcon sx={{ mr: 1 }} />
                  3D View
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
            
            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
              <Button 
                variant="outlined" 
                startIcon={<RefreshIcon />}
                onClick={handleResetToTemplate}
              >
                Reset to Template
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<DeleteIcon />}
                onClick={handleClearAssembly}
                color="error"
              >
                Clear All
              </Button>
            </Box>
            
            {/* Assembly Statistics */}
            <Typography variant="h6" gutterBottom>
              Assembly Characteristics
            </Typography>
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 3 }}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell>Fuel Rods</TableCell>
                    <TableCell align="right">{assemblyStats.fuelRods || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Gadolinia Rods</TableCell>
                    <TableCell align="right">{assemblyStats.gadoliniaRods || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Guide Tubes / Control Rod Positions</TableCell>
                    <TableCell align="right">{assemblyStats.guideTubes || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Water Holes</TableCell>
                    <TableCell align="right">{assemblyStats.waterHoles || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Total Positions</TableCell>
                    <TableCell align="right">{assemblyStats.totalPositions || 0}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Average Enrichment (%)</TableCell>
                    <TableCell align="right">{assemblyStats.averageEnrichment || "0.000"}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Moderation Ratio (H₂O/Fuel)</TableCell>
                    <TableCell align="right">{assemblyStats.moderationRatio || "0.000"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            
            {/* Export Options */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<DownloadIcon />}
                onClick={handleDownloadDesign}
              >
                Export Design
              </Button>
              <Button 
                variant="outlined" 
                startIcon={<SaveIcon />}
                onClick={handleSaveImage}
              >
                Save Image
              </Button>
            </Box>
          </Grid>
          
          {/* Right column: Assembly visualization */}
          <Grid item xs={12} md={7} lg={8}>
            <Paper 
              variant="outlined" 
              sx={{ 
                p: 2, 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                height: '100%'
              }}
            >
              <Typography variant="h6" gutterBottom align="center">
                {assemblyTemplates[assemblyType]?.name || 'Fuel Assembly'} Design
              </Typography>
              
              {/* Canvas for visualization */}
              <Box 
                sx={{ 
                  width: '100%', 
                  flexGrow: 1,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <canvas 
                  ref={canvasRef} 
                  width={600} 
                  height={600}
                  onClick={handleCanvasClick}
                  style={{ maxWidth: '100%', maxHeight: '100%', cursor: 'pointer' }}
                />
              </Box>
              
              {/* Selected pin details (if a cell is selected) */}
              {selectedCell && (
                <Paper elevation={2} sx={{ p: 2, width: '100%' }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Pin Details - Position ({selectedCell.row + 1}, {selectedCell.col + 1})
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2">
                        Type: {fuelPinTypes[grid[selectedCell.row][selectedCell.col]]?.name || 'Unknown'}
                      </Typography>
                    </Grid>
                    
                    {/* Enrichment editor (only for fuel and gadolinia) */}
                    {(grid[selectedCell.row][selectedCell.col] === 'fuel' || 
                      grid[selectedCell.row][selectedCell.col] === 'gadolinia') && (
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <Typography variant="body2" sx={{ minWidth: 100 }}>
                            Enrichment (%):
                          </Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={pinProperties.enrichment}
                            onChange={(e) => handlePinPropertyChange('enrichment', parseFloat(e.target.value))}
                            inputProps={{
                              min: 0.1,
                              max: 20,
                              step: 0.1,
                            }}
                            sx={{ width: 100 }}
                          />
                        </Stack>
                      </Grid>
                    )}
                    
                    {/* Gadolinia content (only for gadolinia pins) */}
                    {grid[selectedCell.row][selectedCell.col] === 'gadolinia' && (
                      <Grid item xs={12} sm={6}>
                        <Stack spacing={1} direction="row" alignItems="center">
                          <Typography variant="body2" sx={{ minWidth: 100 }}>
                            Gd₂O₃ (%):
                          </Typography>
                          <TextField
                            size="small"
                            type="number"
                            value={pinProperties.gadolinia}
                            onChange={(e) => handlePinPropertyChange('gadolinia', parseFloat(e.target.value))}
                            inputProps={{
                              min: 0,
                              max: 20,
                              step: 0.5,
                            }}
                            sx={{ width: 100 }}
                          />
                        </Stack>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default FuelAssemblyDesigner;