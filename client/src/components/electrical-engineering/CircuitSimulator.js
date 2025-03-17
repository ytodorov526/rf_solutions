import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Button,
  Divider,
  Tabs,
  Tab,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  MenuItem,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  Tooltip,
  Slider,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import StopIcon from '@mui/icons-material/Stop';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import RotateRightIcon from '@mui/icons-material/RotateRight';
import DeleteIcon from '@mui/icons-material/Delete';
import BatteryFullIcon from '@mui/icons-material/BatteryFull';
import SettingsInputComponentIcon from '@mui/icons-material/SettingsInputComponent';
import InductorIcon from '@mui/icons-material/Timeline';
import CapacitorIcon from '@mui/icons-material/HorizontalRule';
import ResistorIcon from '@mui/icons-material/SettingsEthernet';
import SwitchIcon from '@mui/icons-material/ToggleOn';
import GroundIcon from '@mui/icons-material/AllInclusive';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`circuit-tabpanel-${index}`}
      aria-labelledby={`circuit-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `circuit-tab-${index}`,
    'aria-controls': `circuit-tabpanel-${index}`,
  };
}

// Component data
const componentLibrary = [
  { id: 'resistor', name: 'Resistor', icon: <ResistorIcon />, properties: { resistance: 1000 } },
  { id: 'capacitor', name: 'Capacitor', icon: <CapacitorIcon />, properties: { capacitance: 0.000001 } },
  { id: 'inductor', name: 'Inductor', icon: <InductorIcon />, properties: { inductance: 0.001 } },
  { id: 'battery', name: 'Battery', icon: <BatteryFullIcon />, properties: { voltage: 9 } },
  { id: 'switch', name: 'Switch', icon: <SwitchIcon />, properties: { state: 'open' } },
  { id: 'lamp', name: 'Lamp', icon: <LightbulbIcon />, properties: { resistance: 100 } },
  { id: 'ground', name: 'Ground', icon: <GroundIcon />, properties: {} },
];

// Circuit presets for examples
const circuitPresets = [
  {
    id: 'rc-circuit',
    name: 'RC Circuit',
    description: 'Simple RC (Resistor-Capacitor) circuit showing charging and discharging behavior.',
    components: [
      { id: 'battery1', type: 'battery', position: { x: 100, y: 150 }, rotation: 0, properties: { voltage: 9 } },
      { id: 'resistor1', type: 'resistor', position: { x: 250, y: 150 }, rotation: 0, properties: { resistance: 10000 } },
      { id: 'capacitor1', type: 'capacitor', position: { x: 400, y: 150 }, rotation: 0, properties: { capacitance: 0.000001 } },
      { id: 'switch1', type: 'switch', position: { x: 175, y: 150 }, rotation: 0, properties: { state: 'open' } },
      { id: 'ground1', type: 'ground', position: { x: 250, y: 300 }, rotation: 0, properties: {} }
    ],
    connections: [
      { from: 'battery1', to: 'switch1' },
      { from: 'switch1', to: 'resistor1' },
      { from: 'resistor1', to: 'capacitor1' },
      { from: 'capacitor1', to: 'ground1' },
      { from: 'ground1', to: 'battery1' }
    ]
  },
  {
    id: 'rl-circuit',
    name: 'RL Circuit',
    description: 'Simple RL (Resistor-Inductor) circuit showing inductive behavior and time constants.',
    components: [
      { id: 'battery1', type: 'battery', position: { x: 100, y: 150 }, rotation: 0, properties: { voltage: 12 } },
      { id: 'resistor1', type: 'resistor', position: { x: 250, y: 150 }, rotation: 0, properties: { resistance: 1000 } },
      { id: 'inductor1', type: 'inductor', position: { x: 400, y: 150 }, rotation: 0, properties: { inductance: 0.1 } },
      { id: 'switch1', type: 'switch', position: { x: 175, y: 150 }, rotation: 0, properties: { state: 'open' } },
      { id: 'ground1', type: 'ground', position: { x: 250, y: 300 }, rotation: 0, properties: {} }
    ],
    connections: [
      { from: 'battery1', to: 'switch1' },
      { from: 'switch1', to: 'resistor1' },
      { from: 'resistor1', to: 'inductor1' },
      { from: 'inductor1', to: 'ground1' },
      { from: 'ground1', to: 'battery1' }
    ]
  },
  {
    id: 'series-parallel',
    name: 'Series-Parallel Circuit',
    description: 'A combined series and parallel resistor circuit demonstrating current division.',
    components: [
      { id: 'battery1', type: 'battery', position: { x: 100, y: 150 }, rotation: 0, properties: { voltage: 9 } },
      { id: 'resistor1', type: 'resistor', position: { x: 250, y: 100 }, rotation: 0, properties: { resistance: 1000 } },
      { id: 'resistor2', type: 'resistor', position: { x: 250, y: 200 }, rotation: 0, properties: { resistance: 2000 } },
      { id: 'resistor3', type: 'resistor', position: { x: 400, y: 150 }, rotation: 0, properties: { resistance: 3000 } },
      { id: 'ground1', type: 'ground', position: { x: 250, y: 300 }, rotation: 0, properties: {} }
    ],
    connections: [
      { from: 'battery1', to: 'resistor1' },
      { from: 'battery1', to: 'resistor2' },
      { from: 'resistor1', to: 'resistor3' },
      { from: 'resistor2', to: 'resistor3' },
      { from: 'resistor3', to: 'ground1' },
      { from: 'ground1', to: 'battery1' }
    ]
  }
];

function CircuitSimulator() {
  const [activeTab, setActiveTab] = useState(0);
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [components, setComponents] = useState([]);
  const [connections, setConnections] = useState([]);
  const [time, setTime] = useState(0);
  const [results, setResults] = useState({});
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  // Initialize canvas
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      
      // Set canvas dimensions
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      
      // Initial draw
      drawCircuit(ctx);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Redraw circuit when components or connections change
  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      drawCircuit(ctx);
    }
  }, [components, connections, selectedComponent]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleComponentSelect = (component) => {
    setSelectedComponent(component);
  };

  const handleAddComponent = () => {
    if (selectedComponent) {
      const newComponent = {
        id: `${selectedComponent.id}${components.length + 1}`,
        type: selectedComponent.id,
        position: { x: 250, y: 150 },
        rotation: 0,
        properties: { ...selectedComponent.properties }
      };
      
      setComponents([...components, newComponent]);
    }
  };

  const handlePresetSelect = (preset) => {
    setSelectedPreset(preset);
    setComponents(preset.components);
    setConnections(preset.connections);
    resetSimulation();
  };

  const startSimulation = () => {
    setSimulationRunning(true);
    setTime(0);
    
    // Simple simulation results for demonstration
    // In a real app, this would involve actual circuit simulation calculations
    const simulationResults = {
      voltage: {},
      current: {},
      power: {}
    };
    
    // Add some sample data for each component
    components.forEach(component => {
      if (component.type === 'resistor') {
        // V = IR for resistors
        const voltage = 5; // Assuming 5V across the resistor for simplicity
        const current = voltage / component.properties.resistance;
        const power = voltage * current;
        
        simulationResults.voltage[component.id] = voltage;
        simulationResults.current[component.id] = current;
        simulationResults.power[component.id] = power;
      }
      else if (component.type === 'capacitor') {
        // V = Q/C for capacitors, current varies with time
        simulationResults.voltage[component.id] = 0; // Initial voltage is 0, it would change with time
        simulationResults.current[component.id] = 0;
        simulationResults.power[component.id] = 0;
      }
      else if (component.type === 'inductor') {
        // V = L di/dt for inductors
        simulationResults.voltage[component.id] = 0;
        simulationResults.current[component.id] = 0;
        simulationResults.power[component.id] = 0;
      }
      else if (component.type === 'battery') {
        simulationResults.voltage[component.id] = component.properties.voltage;
        simulationResults.current[component.id] = 0; // Would depend on the circuit
        simulationResults.power[component.id] = 0;
      }
    });
    
    setResults(simulationResults);
    
    // Animate
    const animate = () => {
      setTime(prevTime => prevTime + 0.1);
      
      // Update simulation results based on time
      // This is a simplified example - real simulation would be more complex
      const updatedResults = { ...simulationResults };
      
      components.forEach(component => {
        if (component.type === 'capacitor') {
          // Capacitor charging curve: V = V0(1-e^(-t/RC))
          const R = 10000; // Assuming a 10k resistor in series
          const C = component.properties.capacitance;
          const tau = R * C;
          const V0 = 5; // Assuming 5V source
          
          const voltage = V0 * (1 - Math.exp(-time / tau));
          const current = V0 / R * Math.exp(-time / tau);
          
          updatedResults.voltage[component.id] = voltage;
          updatedResults.current[component.id] = current;
          updatedResults.power[component.id] = voltage * current;
        }
        else if (component.type === 'inductor') {
          // Inductor current growth: I = I0(1-e^(-Rt/L))
          const R = 1000; // Assuming a 1k resistor in series
          const L = component.properties.inductance;
          const tau = L / R;
          const V0 = 5; // Assuming 5V source
          const I0 = V0 / R;
          
          const current = I0 * (1 - Math.exp(-time / tau));
          const voltage = V0 * Math.exp(-time / tau);
          
          updatedResults.voltage[component.id] = voltage;
          updatedResults.current[component.id] = current;
          updatedResults.power[component.id] = voltage * current;
        }
      });
      
      setResults(updatedResults);
      
      if (simulationRunning) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    
    animationRef.current = requestAnimationFrame(animate);
  };

  const stopSimulation = () => {
    setSimulationRunning(false);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const resetSimulation = () => {
    stopSimulation();
    setTime(0);
    setResults({});
  };

  const drawCircuit = (ctx) => {
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // Draw connections
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 2;
    connections.forEach(connection => {
      const fromComponent = components.find(c => c.id === connection.from);
      const toComponent = components.find(c => c.id === connection.to);
      
      if (fromComponent && toComponent) {
        ctx.beginPath();
        ctx.moveTo(fromComponent.position.x, fromComponent.position.y);
        ctx.lineTo(toComponent.position.x, toComponent.position.y);
        ctx.stroke();
      }
    });
    
    // Draw components
    components.forEach(component => {
      const isSelected = selectedComponent && component.id === selectedComponent.id;
      
      // Draw component representation
      ctx.fillStyle = isSelected ? '#2196f3' : '#333';
      ctx.strokeStyle = isSelected ? '#2196f3' : '#333';
      ctx.lineWidth = isSelected ? 3 : 2;
      
      // Draw based on component type
      switch (component.type) {
        case 'resistor':
          drawResistor(ctx, component);
          break;
        case 'capacitor':
          drawCapacitor(ctx, component);
          break;
        case 'inductor':
          drawInductor(ctx, component);
          break;
        case 'battery':
          drawBattery(ctx, component);
          break;
        case 'switch':
          drawSwitch(ctx, component);
          break;
        case 'ground':
          drawGround(ctx, component);
          break;
        case 'lamp':
          drawLamp(ctx, component);
          break;
        default:
          break;
      }
      
      // Draw component label
      ctx.fillStyle = '#000';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(component.id, component.position.x, component.position.y + 30);
    });
  };

  // Drawing functions for different components
  const drawResistor = (ctx, component) => {
    const { x, y } = component.position;
    const width = 40;
    const height = 20;
    
    ctx.strokeRect(x - width/2, y - height/2, width, height);
    
    // Draw zigzag inside if space permits
    if (width > 10) {
      ctx.beginPath();
      ctx.moveTo(x - width/2, y);
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(x - width/2 + width/4 * (i+0.5), y - height/3);
        ctx.lineTo(x - width/2 + width/4 * (i+1), y + height/3);
      }
      ctx.lineTo(x + width/2, y);
      ctx.stroke();
    }
  };

  const drawCapacitor = (ctx, component) => {
    const { x, y } = component.position;
    const width = 30;
    const gap = 10;
    
    // Draw plates
    ctx.beginPath();
    ctx.moveTo(x - width/2, y - 15);
    ctx.lineTo(x - width/2, y + 15);
    ctx.moveTo(x + width/2, y - 15);
    ctx.lineTo(x + width/2, y + 15);
    ctx.stroke();
  };

  const drawInductor = (ctx, component) => {
    const { x, y } = component.position;
    const width = 40;
    
    // Draw coil
    ctx.beginPath();
    ctx.moveTo(x - width/2, y);
    
    // Draw loops
    for (let i = 0; i < 4; i++) {
      const loopX = x - width/2 + i * width/4;
      ctx.arc(loopX, y, width/8, Math.PI, 0, false);
    }
    
    ctx.stroke();
  };

  const drawBattery = (ctx, component) => {
    const { x, y } = component.position;
    const width = 30;
    const gap = 10;
    
    // Draw battery cells
    ctx.beginPath();
    // First cell (longer line)
    ctx.moveTo(x - width/2, y - 15);
    ctx.lineTo(x - width/2, y + 15);
    // Second cell (shorter line)
    ctx.moveTo(x + width/2, y - 8);
    ctx.lineTo(x + width/2, y + 8);
    ctx.stroke();
  };

  const drawSwitch = (ctx, component) => {
    const { x, y } = component.position;
    const width = 40;
    const isOpen = component.properties.state === 'open';
    
    ctx.beginPath();
    ctx.moveTo(x - width/2, y);
    if (isOpen) {
      // Draw open switch
      ctx.lineTo(x, y - 15);
    } else {
      // Draw closed switch
      ctx.lineTo(x + width/2, y);
    }
    ctx.stroke();
    
    // Draw connection point
    ctx.beginPath();
    ctx.arc(x - width/2, y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + width/2, y, 3, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawGround = (ctx, component) => {
    const { x, y } = component.position;
    const width = 20;
    
    // Draw ground symbol
    ctx.beginPath();
    ctx.moveTo(x, y - 10);
    ctx.lineTo(x, y);
    
    // Draw horizontal lines
    for (let i = 0; i < 3; i++) {
      const lineWidth = width - i * 5;
      ctx.moveTo(x - lineWidth/2, y + i * 5);
      ctx.lineTo(x + lineWidth/2, y + i * 5);
    }
    
    ctx.stroke();
  };

  const drawLamp = (ctx, component) => {
    const { x, y } = component.position;
    const radius = 15;
    
    // Draw bulb
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Draw filament
    ctx.beginPath();
    ctx.moveTo(x - radius/2, y);
    ctx.lineTo(x + radius/2, y);
    ctx.moveTo(x, y - radius/2);
    ctx.lineTo(x, y + radius/2);
    ctx.stroke();
  };

  return (
    <Box sx={{ mb: 4 }} id="circuit-simulator-section">
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Interactive Circuit Simulator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Design and simulate electrical circuits with our interactive tool. Add components, connect them, and observe real-time behavior.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            {/* Circuit Canvas */}
            <Box sx={{ bgcolor: '#f5f5f5', borderRadius: 1, p: 1, mb: 2, height: 400, position: 'relative' }}>
              <canvas 
                ref={canvasRef} 
                style={{ width: '100%', height: '100%', border: '1px solid #ddd' }}
              />
              {/* Overlay message if no components */}
              {components.length === 0 && (
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: '50%', 
                    left: '50%', 
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center',
                    color: 'text.secondary'
                  }}
                >
                  <Typography variant="body1" gutterBottom>
                    No components added yet.
                  </Typography>
                  <Typography variant="body2">
                    Select a component from the library or load a preset circuit.
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Box>
                <Button 
                  variant="contained" 
                  startIcon={<PlayArrowIcon />}
                  onClick={startSimulation}
                  disabled={simulationRunning || components.length === 0}
                  sx={{ mr: 1 }}
                >
                  Run Simulation
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<StopIcon />}
                  onClick={stopSimulation}
                  disabled={!simulationRunning}
                  sx={{ mr: 1 }}
                >
                  Stop
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<RestartAltIcon />}
                  onClick={resetSimulation}
                  sx={{ mr: 1 }}
                >
                  Reset
                </Button>
              </Box>
              <Box>
                <Button 
                  variant="outlined" 
                  startIcon={<SaveIcon />}
                  sx={{ mr: 1 }}
                >
                  Save Circuit
                </Button>
                <Button 
                  variant="outlined" 
                  startIcon={<FolderOpenIcon />}
                >
                  Load Circuit
                </Button>
              </Box>
            </Box>
            
            {/* Simulation Results */}
            {Object.keys(results).length > 0 && (
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Simulation Results (t = {time.toFixed(2)} s)
                  </Typography>
                  <Grid container spacing={2}>
                    {components.map(component => (
                      <Grid item xs={12} sm={6} md={4} key={component.id}>
                        <Card variant="outlined">
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom>
                              {component.id} ({component.type})
                            </Typography>
                            <Typography variant="body2">
                              Voltage: {results.voltage[component.id]?.toFixed(3) || 'N/A'} V
                            </Typography>
                            <Typography variant="body2">
                              Current: {results.current[component.id]?.toFixed(6) || 'N/A'} A
                            </Typography>
                            <Typography variant="body2">
                              Power: {results.power[component.id]?.toFixed(6) || 'N/A'} W
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
          
          <Grid item xs={12} md={3}>
            {/* Component Library and Circuit Configuration */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange}
                aria-label="circuit simulator tabs"
                variant="fullWidth"
              >
                <Tab label="Components" {...a11yProps(0)} />
                <Tab label="Presets" {...a11yProps(1)} />
                <Tab label="Settings" {...a11yProps(2)} />
              </Tabs>
            </Box>
            
            <TabPanel value={activeTab} index={0}>
              <Typography variant="subtitle1" gutterBottom>
                Component Library
              </Typography>
              <List dense>
                {componentLibrary.map((component) => (
                  <ListItem 
                    key={component.id}
                    button
                    selected={selectedComponent?.id === component.id}
                    onClick={() => handleComponentSelect(component)}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: selectedComponent?.id === component.id ? 'action.selected' : 'background.paper',
                    }}
                  >
                    <ListItemIcon>
                      {component.icon}
                    </ListItemIcon>
                    <ListItemText primary={component.name} />
                    <IconButton 
                      edge="end" 
                      aria-label="add"
                      onClick={handleAddComponent}
                      disabled={!selectedComponent}
                    >
                      <AddIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
              
              {selectedComponent && (
                <Card variant="outlined" sx={{ mt: 2 }}>
                  <CardContent>
                    <Typography variant="subtitle2" gutterBottom>
                      Component Properties
                    </Typography>
                    {Object.entries(selectedComponent.properties).map(([key, value]) => (
                      <TextField
                        key={key}
                        label={key.charAt(0).toUpperCase() + key.slice(1)}
                        value={value}
                        size="small"
                        fullWidth
                        sx={{ mb: 1 }}
                      />
                    ))}
                  </CardContent>
                </Card>
              )}
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              <Typography variant="subtitle1" gutterBottom>
                Circuit Presets
              </Typography>
              <List dense>
                {circuitPresets.map((preset) => (
                  <ListItem 
                    key={preset.id}
                    button
                    selected={selectedPreset?.id === preset.id}
                    onClick={() => handlePresetSelect(preset)}
                    sx={{ 
                      border: '1px solid',
                      borderColor: 'divider',
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: selectedPreset?.id === preset.id ? 'action.selected' : 'background.paper',
                    }}
                  >
                    <ListItemText 
                      primary={preset.name} 
                      secondary={preset.description}
                    />
                  </ListItem>
                ))}
              </List>
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              <Typography variant="subtitle1" gutterBottom>
                Simulation Settings
              </Typography>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="sim-type-label">Simulation Type</InputLabel>
                <Select
                  labelId="sim-type-label"
                  value="transient"
                  label="Simulation Type"
                >
                  <MenuItem value="transient">Transient Analysis</MenuItem>
                  <MenuItem value="dc">DC Analysis</MenuItem>
                  <MenuItem value="ac">AC Analysis</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="body2" gutterBottom>
                Simulation Duration (s)
              </Typography>
              <Slider
                defaultValue={5}
                step={0.1}
                min={0.1}
                max={10}
                valueLabelDisplay="auto"
                marks={[
                  { value: 0.1, label: '0.1s' },
                  { value: 5, label: '5s' },
                  { value: 10, label: '10s' },
                ]}
              />
              
              <Typography variant="body2" gutterBottom sx={{ mt: 2 }}>
                Time Step (ms)
              </Typography>
              <Slider
                defaultValue={10}
                step={1}
                min={1}
                max={100}
                valueLabelDisplay="auto"
                marks={[
                  { value: 1, label: '1ms' },
                  { value: 50, label: '50ms' },
                  { value: 100, label: '100ms' },
                ]}
              />
            </TabPanel>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Educational Notes
          </Typography>
          <Typography variant="body2" paragraph>
            This simulator demonstrates basic circuit behavior through real-time visualization and analysis. Key concepts illustrated include:
          </Typography>
          <ul>
            <li>Ohm's Law and current flow in circuits</li>
            <li>Series and parallel component configurations</li>
            <li>RC and RL circuit time constants</li>
            <li>Kirchhoff's voltage and current laws</li>
          </ul>
          <Typography variant="body2">
            Experiment with different component values and circuit configurations to see how they affect circuit behavior.
            For more advanced simulation needs, consider professional tools like SPICE or dedicated circuit simulation software.
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}

export default CircuitSimulator;