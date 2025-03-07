import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Divider, 
  Button, 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Slider,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Alert,
  CircularProgress
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';

const ReactorVesselDesigner = () => {
  // State for vessel parameters
  const [vesselType, setVesselType] = useState('pwr');
  const [vesselHeight, setVesselHeight] = useState(12); // meters
  const [vesselDiameter, setVesselDiameter] = useState(4.5); // meters
  const [wallThickness, setWallThickness] = useState(0.25); // meters
  const [designPressure, setDesignPressure] = useState(15.5); // MPa
  const [designTemperature, setDesignTemperature] = useState(350); // °C
  const [material, setMaterial] = useState('SA508');
  const [cladding, setCladding] = useState('ss304');
  const [activeTab, setActiveTab] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResults, setCalculationResults] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [viewMode, setViewMode] = useState('2d');
  
  // Canvas refs for drawing
  const canvasRef = useRef(null);
  
  // Materials database
  const materials = {
    'SA508': { 
      name: 'SA-508 Class 3', 
      type: 'Low Alloy Steel',
      yieldStrength: 345, // MPa
      tensileStrength: 550, // MPa
      thermalExpansion: 12.5, // 10^-6/°C
      thermalConductivity: 38, // W/m-K
      density: 7800, // kg/m^3
      maxTemperature: 371, // °C
      corrosionResistance: 'Low'
    },
    'SA533': { 
      name: 'SA-533 Grade B Class 1', 
      type: 'Low Alloy Steel',
      yieldStrength: 345, // MPa
      tensileStrength: 550, // MPa
      thermalExpansion: 12.5, // 10^-6/°C
      thermalConductivity: 38, // W/m-K
      density: 7800, // kg/m^3
      maxTemperature: 371, // °C
      corrosionResistance: 'Low'
    },
    '316L': { 
      name: '316L Stainless Steel', 
      type: 'Austenitic Stainless Steel',
      yieldStrength: 170, // MPa
      tensileStrength: 485, // MPa
      thermalExpansion: 16.0, // 10^-6/°C
      thermalConductivity: 16.3, // W/m-K
      density: 8000, // kg/m^3
      maxTemperature: 600, // °C
      corrosionResistance: 'High'
    }
  };
  
  // Cladding database
  const claddings = {
    'ss304': { 
      name: 'Type 304 Stainless Steel', 
      thickness: 0.005, // m
      corrosionResistance: 'High',
      thermalConductivity: 16.2 // W/m-K
    },
    'ss308': { 
      name: 'Type 308 Stainless Steel', 
      thickness: 0.007, // m
      corrosionResistance: 'High',
      thermalConductivity: 16.3 // W/m-K
    },
    'ss309': { 
      name: 'Type 309 Stainless Steel', 
      thickness: 0.006, // m
      corrosionResistance: 'Very High',
      thermalConductivity: 15.6 // W/m-K
    },
    'inconel': { 
      name: 'Inconel 600', 
      thickness: 0.004, // m
      corrosionResistance: 'Excellent',
      thermalConductivity: 14.9 // W/m-K
    }
  };
  
  // Vessel type templates
  const vesselTemplates = {
    'pwr': {
      name: 'Pressurized Water Reactor',
      typical: {
        height: 13,
        diameter: 4.5,
        wallThickness: 0.25,
        designPressure: 17.24, // MPa (2500 psi)
        designTemperature: 343, // °C
        material: 'SA508',
        cladding: 'ss304'
      },
      description: 'PWR vessels are designed for high pressure operation with moderate temperatures.',
      features: ['Cylindrical vessel with hemispherical heads', 'Inlet and outlet nozzles', 'Control rod drive mechanism penetrations'],
      nozzles: {
        inlet: { count: 2, diameter: 0.8 },
        outlet: { count: 4, diameter: 0.75 }
      }
    },
    'bwr': {
      name: 'Boiling Water Reactor',
      typical: {
        height: 22,
        diameter: 6.4,
        wallThickness: 0.15,
        designPressure: 7.58, // MPa (1100 psi)
        designTemperature: 302, // °C
        material: 'SA533',
        cladding: 'ss308'
      },
      description: 'BWR vessels are larger than PWR vessels but operate at lower pressure.',
      features: ['Larger diameter with internal steam separators', 'Multiple steam outlet nozzles', 'Bottom-mounted control rod drives'],
      nozzles: {
        feedwater: { count: 6, diameter: 0.3 },
        steamOutlet: { count: 4, diameter: 0.6 }
      }
    },
    'smr': {
      name: 'Small Modular Reactor',
      typical: {
        height: 9,
        diameter: 3.0,
        wallThickness: 0.18,
        designPressure: 14.0, // MPa
        designTemperature: 330, // °C
        material: 'SA508',
        cladding: 'inconel'
      },
      description: 'SMR vessels are compact with integrated components to reduce footprint.',
      features: ['Integrated design with internal steam generators', 'Compact layout', 'Factory fabrication capability'],
      nozzles: {
        inlet: { count: 2, diameter: 0.4 },
        outlet: { count: 2, diameter: 0.4 }
      }
    }
  };
  
  // Handle vessel type change
  const handleVesselTypeChange = (event) => {
    const type = event.target.value;
    setVesselType(type);
    
    // Load template values
    const template = vesselTemplates[type].typical;
    setVesselHeight(template.height);
    setVesselDiameter(template.diameter);
    setWallThickness(template.wallThickness);
    setDesignPressure(template.designPressure);
    setDesignTemperature(template.designTemperature);
    setMaterial(template.material);
    setCladding(template.cladding);
    
    // Clear any previous results and validation errors
    setCalculationResults(null);
    setValidationErrors({});
  };
  
  // Validation function
  const validateInputs = () => {
    const errors = {};
    
    if (vesselHeight <= 0 || vesselHeight > 30) {
      errors.vesselHeight = 'Height must be between 0 and 30 meters';
    }
    
    if (vesselDiameter <= 0 || vesselDiameter > 10) {
      errors.vesselDiameter = 'Diameter must be between 0 and 10 meters';
    }
    
    if (wallThickness <= 0 || wallThickness > 0.5) {
      errors.wallThickness = 'Wall thickness must be between 0 and 0.5 meters';
    }
    
    if (designPressure <= 0 || designPressure > 25) {
      errors.designPressure = 'Design pressure must be between 0 and 25 MPa';
    }
    
    if (designTemperature <= 0 || designTemperature > 450) {
      errors.designTemperature = 'Design temperature must be between 0 and 450 °C';
    }
    
    // Check material temperature limits
    if (designTemperature > materials[material].maxTemperature) {
      errors.designTemperature = `Temperature exceeds maximum for ${materials[material].name} (${materials[material].maxTemperature}°C)`;
    }
    
    return errors;
  };
  
  // Calculate vessel parameters
  const calculateVessel = () => {
    // Validate inputs first
    const errors = validateInputs();
    setValidationErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      return;
    }
    
    setIsCalculating(true);
    
    // Simulate calculation time
    setTimeout(() => {
      // Calculate key metrics
      const innerRadius = (vesselDiameter / 2) - wallThickness;
      const innerHeight = vesselHeight - (2 * wallThickness);
      const volume = Math.PI * Math.pow(innerRadius, 2) * innerHeight;
      
      // Use formulas for thin-walled pressure vessels
      const hoop_stress = (designPressure * vesselDiameter) / (2 * wallThickness);
      const longitudinal_stress = (designPressure * vesselDiameter) / (4 * wallThickness);
      
      // Safety factors
      let safetyFactor = materials[material].yieldStrength / hoop_stress;
      
      // Material thermal stress
      const thermal_gradient = 50; // Typical temperature difference across wall during operation
      const thermal_stress = materials[material].thermalExpansion * materials[material].yieldStrength * thermal_gradient / 100;
      
      // Calculate vessel weight
      const outer_volume = Math.PI * Math.pow(vesselDiameter/2, 2) * vesselHeight;
      const steel_volume = outer_volume - volume - (claddings[cladding].thickness * Math.PI * vesselDiameter * vesselHeight);
      const weight = steel_volume * materials[material].density;
      
      // Fracture toughness considerations (simplified)
      const rtNdt = -20; // Reference temperature for nil-ductility transition (typical value)
      const pvEndOfLife = rtNdt + 60; // Projected end-of-life transition temperature
      const marginToEmbrittlement = 100 - pvEndOfLife;
      
      // ASME compliance evaluation
      const asmeDesignMargin = materials[material].yieldStrength / hoop_stress;
      let asmeCompliance = 'Non-Compliant';
      
      if (asmeDesignMargin >= 2.4) {
        asmeCompliance = 'Fully Compliant';
      } else if (asmeDesignMargin >= 1.5) {
        asmeCompliance = 'Marginally Compliant';
      }
      
      setCalculationResults({
        innerRadius,
        innerHeight,
        volume,
        hoop_stress,
        longitudinal_stress,
        safetyFactor,
        thermal_stress,
        weight,
        rtNdt,
        pvEndOfLife,
        marginToEmbrittlement,
        asmeCompliance,
        asmeDesignMargin
      });
      
      setIsCalculating(false);
    }, 1500);
  };
  
  // Draw vessel on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    ctx.clearRect(0, 0, width, height);
    
    // Scale the drawing to fit the canvas
    const scale = Math.min(
      (width - 40) / vesselDiameter,
      (height - 40) / vesselHeight
    );
    
    const centerX = width / 2;
    const vesselRadiusPixels = (vesselDiameter / 2) * scale;
    const vesselHeightPixels = vesselHeight * scale;
    const wallThicknessPixels = wallThickness * scale;
    
    // Draw outer vessel boundary
    ctx.beginPath();
    ctx.fillStyle = '#f0f0f0';
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    
    // Draw vessel body
    ctx.moveTo(centerX - vesselRadiusPixels, (height - vesselHeightPixels) / 2);
    ctx.lineTo(centerX - vesselRadiusPixels, (height + vesselHeightPixels) / 2);
    ctx.arc(centerX, (height + vesselHeightPixels) / 2, vesselRadiusPixels, Math.PI, 0, false);
    ctx.lineTo(centerX + vesselRadiusPixels, (height - vesselHeightPixels) / 2);
    ctx.arc(centerX, (height - vesselHeightPixels) / 2, vesselRadiusPixels, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw inner vessel cavity
    const innerRadiusPixels = vesselRadiusPixels - wallThicknessPixels;
    ctx.beginPath();
    ctx.fillStyle = '#e6f7ff';
    ctx.moveTo(centerX - innerRadiusPixels, (height - vesselHeightPixels) / 2 + wallThicknessPixels);
    ctx.lineTo(centerX - innerRadiusPixels, (height + vesselHeightPixels) / 2 - wallThicknessPixels);
    ctx.arc(centerX, (height + vesselHeightPixels) / 2 - wallThicknessPixels, innerRadiusPixels, Math.PI, 0, false);
    ctx.lineTo(centerX + innerRadiusPixels, (height - vesselHeightPixels) / 2 + wallThicknessPixels);
    ctx.arc(centerX, (height - vesselHeightPixels) / 2 + wallThicknessPixels, innerRadiusPixels, 0, Math.PI, false);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Draw nozzles based on vessel type
    if (vesselType === 'pwr') {
      // Draw PWR inlet/outlet nozzles
      const nozzleVerticalPositions = [0.25, 0.75];
      const nozzleWidth = 0.5 * scale;
      const nozzleHeight = 1 * scale;
      
      nozzleVerticalPositions.forEach((pos) => {
        const nozzleY = (height - vesselHeightPixels) / 2 + vesselHeightPixels * pos;
        
        // Draw left inlet nozzle
        ctx.beginPath();
        ctx.fillStyle = '#e6f7ff';
        ctx.strokeStyle = '#333';
        ctx.rect(centerX - vesselRadiusPixels - nozzleWidth, nozzleY - nozzleHeight/2, nozzleWidth, nozzleHeight);
        ctx.fill();
        ctx.stroke();
        
        // Draw right outlet nozzle
        ctx.beginPath();
        ctx.fillStyle = '#e6f7ff';
        ctx.strokeStyle = '#333';
        ctx.rect(centerX + vesselRadiusPixels, nozzleY - nozzleHeight/2, nozzleWidth, nozzleHeight);
        ctx.fill();
        ctx.stroke();
      });
    } else if (vesselType === 'bwr') {
      // Draw BWR steam outlets at the top
      const steamNozzleWidth = 0.4 * scale;
      const steamNozzleHeight = 0.8 * scale;
      const nozzlePositions = [-0.6, -0.2, 0.2, 0.6];
      
      nozzlePositions.forEach((pos) => {
        const nozzleX = centerX + vesselRadiusPixels * pos;
        const nozzleY = (height - vesselHeightPixels) / 2;
        
        ctx.beginPath();
        ctx.fillStyle = '#e6f7ff';
        ctx.strokeStyle = '#333';
        ctx.rect(nozzleX - steamNozzleWidth/2, nozzleY - steamNozzleHeight, steamNozzleWidth, steamNozzleHeight);
        ctx.fill();
        ctx.stroke();
      });
    } else if (vesselType === 'smr') {
      // Draw SMR integrated design elements
      const nozzleWidth = 0.3 * scale;
      const nozzleHeight = 0.6 * scale;
      
      // Draw inlet/outlet nozzles
      ctx.beginPath();
      ctx.fillStyle = '#e6f7ff';
      ctx.strokeStyle = '#333';
      ctx.rect(centerX - vesselRadiusPixels - nozzleWidth, (height - vesselHeightPixels) / 2 + vesselHeightPixels * 0.3, nozzleWidth, nozzleHeight);
      ctx.fill();
      ctx.stroke();
      
      ctx.beginPath();
      ctx.rect(centerX + vesselRadiusPixels, (height - vesselHeightPixels) / 2 + vesselHeightPixels * 0.3, nozzleWidth, nozzleHeight);
      ctx.fill();
      ctx.stroke();
      
      // Draw internal components (simplified)
      ctx.beginPath();
      ctx.strokeStyle = '#555';
      ctx.setLineDash([5, 3]);
      ctx.lineWidth = 1;
      ctx.moveTo(centerX - innerRadiusPixels * 0.7, (height - vesselHeightPixels) / 2 + wallThicknessPixels + vesselHeightPixels * 0.2);
      ctx.lineTo(centerX + innerRadiusPixels * 0.7, (height - vesselHeightPixels) / 2 + wallThicknessPixels + vesselHeightPixels * 0.2);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(centerX - innerRadiusPixels * 0.7, (height - vesselHeightPixels) / 2 + wallThicknessPixels + vesselHeightPixels * 0.6);
      ctx.lineTo(centerX + innerRadiusPixels * 0.7, (height - vesselHeightPixels) / 2 + wallThicknessPixels + vesselHeightPixels * 0.6);
      ctx.stroke();
      ctx.setLineDash([]);
    }
    
    // Add labels and dimensions
    ctx.fillStyle = '#000';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    // Label height
    ctx.fillText(`${vesselHeight.toFixed(2)} m`, centerX + vesselRadiusPixels + 60, height / 2);
    ctx.beginPath();
    ctx.setLineDash([5, 3]);
    ctx.moveTo(centerX + vesselRadiusPixels + 30, (height - vesselHeightPixels) / 2);
    ctx.lineTo(centerX + vesselRadiusPixels + 50, (height - vesselHeightPixels) / 2);
    ctx.lineTo(centerX + vesselRadiusPixels + 50, (height + vesselHeightPixels) / 2);
    ctx.lineTo(centerX + vesselRadiusPixels + 30, (height + vesselHeightPixels) / 2);
    ctx.stroke();
    
    // Label diameter
    ctx.fillText(`Ø ${vesselDiameter.toFixed(2)} m`, centerX, (height - vesselHeightPixels) / 2 - 20);
    ctx.beginPath();
    ctx.moveTo(centerX - vesselRadiusPixels, (height - vesselHeightPixels) / 2 - 10);
    ctx.lineTo(centerX + vesselRadiusPixels, (height - vesselHeightPixels) / 2 - 10);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Add an annotation for wall thickness
    ctx.fillText(`Wall: ${wallThickness.toFixed(2)} m`, centerX, (height + vesselHeightPixels) / 2 + 30);
  }, [vesselHeight, vesselDiameter, wallThickness, vesselType]);
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Handle reset to defaults
  const handleReset = () => {
    handleVesselTypeChange({ target: { value: vesselType } });
  };
  
  // Save design function
  const handleSaveDesign = () => {
    const design = {
      vesselType,
      vesselHeight,
      vesselDiameter,
      wallThickness,
      designPressure,
      designTemperature,
      material,
      cladding,
      calculationResults,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would save to a database
    // For now, we'll just save to localStorage
    try {
      const savedDesigns = JSON.parse(localStorage.getItem('reactorVesselDesigns') || '[]');
      savedDesigns.push(design);
      localStorage.setItem('reactorVesselDesigns', JSON.stringify(savedDesigns));
      alert('Design saved successfully!');
    } catch (error) {
      console.error('Failed to save design:', error);
      alert('Failed to save design. Please try again.');
    }
  };
  
  // Export design function
  const handleExportDesign = () => {
    if (!calculationResults) {
      alert('Please calculate results before exporting.');
      return;
    }
    
    const design = {
      vesselType,
      vesselHeight,
      vesselDiameter,
      wallThickness,
      designPressure,
      designTemperature,
      material: materials[material].name,
      cladding: claddings[cladding].name,
      calculationResults,
      timestamp: new Date().toISOString()
    };
    
    const designJson = JSON.stringify(design, null, 2);
    const blob = new Blob([designJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `reactor_vessel_design_${vesselType}_${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Reactor Vessel Designer
      </Typography>
      <Typography variant="body1" paragraph>
        Design and analyze reactor pressure vessels for various nuclear reactor types.
        Configure vessel dimensions, materials, and operating parameters to evaluate safety and performance.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Grid container spacing={3}>
        {/* Left panel - Parameters */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Vessel Parameters
            </Typography>
            
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="vessel-type-label">Vessel Type</InputLabel>
              <Select
                labelId="vessel-type-label"
                value={vesselType}
                label="Vessel Type"
                onChange={handleVesselTypeChange}
              >
                <MenuItem value="pwr">PWR Vessel</MenuItem>
                <MenuItem value="bwr">BWR Vessel</MenuItem>
                <MenuItem value="smr">SMR Vessel</MenuItem>
              </Select>
              <Typography variant="caption" sx={{ mt: 1 }}>
                {vesselTemplates[vesselType].description}
              </Typography>
            </FormControl>
            
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange} 
              sx={{ mb: 2 }}
              variant="fullWidth"
            >
              <Tab label="Dimensions" />
              <Tab label="Materials" />
              <Tab label="Operating" />
            </Tabs>
            
            {activeTab === 0 && (
              <Box>
                <TextField
                  fullWidth
                  label="Vessel Height (m)"
                  type="number"
                  value={vesselHeight}
                  onChange={(e) => setVesselHeight(parseFloat(e.target.value))}
                  error={!!validationErrors.vesselHeight}
                  helperText={validationErrors.vesselHeight}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: <Typography variant="caption">m</Typography>
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Vessel Diameter (m)"
                  type="number"
                  value={vesselDiameter}
                  onChange={(e) => setVesselDiameter(parseFloat(e.target.value))}
                  error={!!validationErrors.vesselDiameter}
                  helperText={validationErrors.vesselDiameter}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: <Typography variant="caption">m</Typography>
                  }}
                />
                
                <Box sx={{ mb: 2 }}>
                  <Typography gutterBottom>Wall Thickness (m)</Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs>
                      <Slider
                        value={wallThickness}
                        min={0.05}
                        max={0.5}
                        step={0.01}
                        onChange={(e, newValue) => setWallThickness(newValue)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `${value} m`}
                      />
                    </Grid>
                    <Grid item>
                      <TextField
                        value={wallThickness}
                        onChange={(e) => setWallThickness(parseFloat(e.target.value))}
                        error={!!validationErrors.wallThickness}
                        helperText={validationErrors.wallThickness}
                        type="number"
                        size="small"
                        InputProps={{
                          endAdornment: <Typography variant="caption">m</Typography>
                        }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
            
            {activeTab === 1 && (
              <Box>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="material-label">Vessel Material</InputLabel>
                  <Select
                    labelId="material-label"
                    value={material}
                    label="Vessel Material"
                    onChange={(e) => setMaterial(e.target.value)}
                  >
                    {Object.keys(materials).map((key) => (
                      <MenuItem key={key} value={key}>
                        {materials[key].name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Material Properties:</Typography>
                  <Typography variant="body2">
                    Yield Strength: {materials[material].yieldStrength} MPa
                  </Typography>
                  <Typography variant="body2">
                    Tensile Strength: {materials[material].tensileStrength} MPa
                  </Typography>
                  <Typography variant="body2">
                    Max Temperature: {materials[material].maxTemperature} °C
                  </Typography>
                </Box>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="cladding-label">Internal Cladding</InputLabel>
                  <Select
                    labelId="cladding-label"
                    value={cladding}
                    label="Internal Cladding"
                    onChange={(e) => setCladding(e.target.value)}
                  >
                    {Object.keys(claddings).map((key) => (
                      <MenuItem key={key} value={key}>
                        {claddings[key].name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                
                <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2">Cladding Properties:</Typography>
                  <Typography variant="body2">
                    Thickness: {claddings[cladding].thickness * 1000} mm
                  </Typography>
                  <Typography variant="body2">
                    Corrosion Resistance: {claddings[cladding].corrosionResistance}
                  </Typography>
                </Box>
              </Box>
            )}
            
            {activeTab === 2 && (
              <Box>
                <TextField
                  fullWidth
                  label="Design Pressure (MPa)"
                  type="number"
                  value={designPressure}
                  onChange={(e) => setDesignPressure(parseFloat(e.target.value))}
                  error={!!validationErrors.designPressure}
                  helperText={validationErrors.designPressure}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: <Typography variant="caption">MPa</Typography>
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Design Temperature (°C)"
                  type="number"
                  value={designTemperature}
                  onChange={(e) => setDesignTemperature(parseFloat(e.target.value))}
                  error={!!validationErrors.designTemperature}
                  helperText={validationErrors.designTemperature}
                  sx={{ mb: 2 }}
                  InputProps={{
                    endAdornment: <Typography variant="caption">°C</Typography>
                  }}
                />
                
                <Box sx={{ mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle2">
                    Typical {vesselTemplates[vesselType].name} Parameters:
                  </Typography>
                  <Typography variant="body2">
                    Pressure: {vesselTemplates[vesselType].typical.designPressure} MPa
                  </Typography>
                  <Typography variant="body2">
                    Temperature: {vesselTemplates[vesselType].typical.designTemperature} °C
                  </Typography>
                </Box>
              </Box>
            )}
            
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Button
                variant="outlined"
                color="secondary"
                startIcon={<RestartAltIcon />}
                onClick={handleReset}
              >
                Reset
              </Button>
              
              <Button
                variant="contained"
                color="primary"
                onClick={calculateVessel}
                disabled={isCalculating}
              >
                {isCalculating ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Calculate'
                )}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Middle panel - Visualization */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Vessel Visualization
              </Typography>
              <Box>
                <Tooltip title="2D View">
                  <IconButton 
                    color={viewMode === '2d' ? 'primary' : 'default'}
                    onClick={() => setViewMode('2d')}
                  >
                    <SettingsIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="3D View (Experimental)">
                  <IconButton
                    color={viewMode === '3d' ? 'primary' : 'default'}
                    onClick={() => setViewMode('3d')}
                  >
                    <ThreeDRotationIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {viewMode === '2d' ? (
                <canvas 
                  ref={canvasRef} 
                  width={400} 
                  height={500} 
                  style={{ maxWidth: '100%', height: 'auto' }}
                />
              ) : (
                <Box sx={{ 
                  width: '100%', 
                  height: 400, 
                  bgcolor: '#f0f0f0', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <Typography variant="body2" color="textSecondary">
                    3D visualization coming soon
                  </Typography>
                  <img 
                    src="https://via.placeholder.com/300x300?text=3D+Vessel+Preview" 
                    alt="3D Vessel Preview Placeholder"
                    style={{ maxWidth: '100%', maxHeight: 300 }}
                  />
                </Box>
              )}
            </Box>
            
            <Divider sx={{ my: 2 }} />
            
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Key Features:
              </Typography>
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {vesselTemplates[vesselType].features.map((feature, index) => (
                  <li key={index}>
                    <Typography variant="body2">{feature}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </Paper>
        </Grid>
        
        {/* Right panel - Results */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Analysis Results
            </Typography>
            
            {!calculationResults && !isCalculating && (
              <Box sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2
              }}>
                <InfoIcon color="primary" sx={{ fontSize: 40 }} />
                <Typography align="center">
                  Configure vessel parameters and click "Calculate" to view analysis results.
                </Typography>
              </Box>
            )}
            
            {isCalculating && (
              <Box sx={{ 
                height: 300, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                flexDirection: 'column',
                gap: 2
              }}>
                <CircularProgress />
                <Typography>Performing structural analysis...</Typography>
              </Box>
            )}
            
            {calculationResults && !isCalculating && (
              <Box>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Inner Volume:</Typography>
                    <Typography variant="body1">
                      {calculationResults.volume.toFixed(1)} m³
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Vessel Weight:</Typography>
                    <Typography variant="body1">
                      {(calculationResults.weight/1000).toFixed(1)} tons
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Hoop Stress:</Typography>
                    <Typography variant="body1">
                      {calculationResults.hoop_stress.toFixed(1)} MPa
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Longitudinal Stress:</Typography>
                    <Typography variant="body1">
                      {calculationResults.longitudinal_stress.toFixed(1)} MPa
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Thermal Stress:</Typography>
                    <Typography variant="body1">
                      {calculationResults.thermal_stress.toFixed(1)} MPa
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={6}>
                    <Typography variant="subtitle2">Safety Factor:</Typography>
                    <Typography 
                      variant="body1"
                      color={calculationResults.safetyFactor < 1.5 ? 'error' : 
                             calculationResults.safetyFactor < 2.0 ? 'warning' : 'success'}
                    >
                      {calculationResults.safetyFactor.toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle2" gutterBottom>
                  ASME Code Compliance:
                </Typography>
                
                <Alert 
                  severity={
                    calculationResults.asmeCompliance === 'Fully Compliant' ? 'success' :
                    calculationResults.asmeCompliance === 'Marginally Compliant' ? 'warning' : 'error'
                  }
                  sx={{ mb: 2 }}
                >
                  {calculationResults.asmeCompliance} (Margin: {calculationResults.asmeDesignMargin.toFixed(2)})
                </Alert>
                
                <Typography variant="subtitle2" gutterBottom>
                  Material Aging Analysis:
                </Typography>
                <Typography variant="body2">
                  RTNDT (Initial): {calculationResults.rtNdt}°C
                </Typography>
                <Typography variant="body2">
                  RTNDT (End of Life): {calculationResults.pvEndOfLife}°C
                </Typography>
                <Typography variant="body2">
                  Margin to Embrittlement: {calculationResults.marginToEmbrittlement}°C
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    variant="outlined"
                    startIcon={<SaveIcon />}
                    onClick={handleSaveDesign}
                  >
                    Save Design
                  </Button>
                  
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={handleExportDesign}
                  >
                    Export
                  </Button>
                </Box>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReactorVesselDesigner;