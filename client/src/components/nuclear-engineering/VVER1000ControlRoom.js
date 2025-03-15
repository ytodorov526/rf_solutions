// VVER1000ControlRoom.js - Main component for the VVER-1000 simulator
import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  Divider,
  Collapse,
  Card,
  CardContent,
  Snackbar,
  Alert,
  Tabs,
  Tab
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import BarChartIcon from '@mui/icons-material/BarChart';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Import simulator components
import VVER1000Engine from './VVER1000Engine';
import VVER1000ControlPanel from './VVER1000ControlPanel';
import VVER1000DisplayPanel from './VVER1000DisplayPanel';
import VVER1000Scenarios from './VVER1000Scenarios';
import VVER1000ReactorCore3D from './VVER1000ReactorCore3D';
import VVER1000DetailedComponents from './VVER1000DetailedComponents';
import { initialState, VVER1000, SAFETY_LIMITS, SCENARIOS } from './VVER1000Constants';
import { formatTime, chartOptions, prepareChartData } from './VVER1000Utils';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

/**
 * VVER-1000 Nuclear Power Plant Control Room Simulator
 * Interactive, real-time simulation of a VVER-1000 nuclear reactor
 */
function VVER1000ControlRoom() {
  // State management
  const [showSimulator, setShowSimulator] = useState(false);
  const [state, setState] = useState(initialState);
  const [isRunning, setIsRunning] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showOperatorLog, setShowOperatorLog] = useState(false);
  const [operatorLogEntries, setOperatorLogEntries] = useState([]);
  const [notification, setNotification] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  
  // Simulation engine reference
  const engineRef = useRef(null);
  
  // Initialize the simulation engine
  useEffect(() => {
    engineRef.current = new VVER1000Engine(initialState, (newState) => {
      setState(newState);
    });
    
    // Set up event listeners
    engineRef.current.on('alarm', (data) => {
      addLogEntry(data.message, data.type);
    });
    
    engineRef.current.on('scram', (data) => {
      addLogEntry(data.reason, 'error');
    });
    
    engineRef.current.on('scenarioEvent', (data) => {
      addLogEntry(`Event: ${data.message || data.eventName}`, 'warning');
    });
    
    engineRef.current.on('scenarioComplete', (data) => {
      addLogEntry(data.message, 'success');
    });
    
    // Clean up on unmount
    return () => {
      if (engineRef.current) {
        engineRef.current.cleanup();
      }
    };
  }, []);
  
  // Function to add an entry to the operator log
  const addLogEntry = useCallback((message, type = 'info') => {
    const newEntry = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      simulationTime: formatTime(state.time)
    };
    
    setOperatorLogEntries(prev => [newEntry, ...prev]);
  }, [state.time]);
  
  // Function to load a scenario
  const loadScenario = useCallback((scenarioId) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (!scenario) return;
    
    // Set up the scenario in the engine
    engineRef.current?.loadScenario(scenario);
    
    // Add first log entry
    addLogEntry(`Scenario loaded: ${scenario.name}`);
  }, [addLogEntry]);
  
  // Event handler for scenario selection
  const handleScenarioChange = useCallback((event) => {
    const scenarioId = event.target.value;
    if (scenarioId) {
      loadScenario(scenarioId);
    } else {
      engineRef.current?.reset(initialState);
    }
  }, [loadScenario]);
  
  // Function to start/stop simulation
  const toggleSimulation = useCallback(() => {
    if (isRunning) {
      // Stop simulation
      engineRef.current?.stop();
      setIsRunning(false);
      addLogEntry("Simulation paused", "warning");
    } else {
      // Start simulation
      engineRef.current?.start();
      setIsRunning(true);
      addLogEntry("Simulation started", "success");
    }
  }, [isRunning, addLogEntry]);
  
  // Reset simulation
  const resetSimulation = useCallback(() => {
    // Stop any current simulation
    if (isRunning) {
      engineRef.current?.stop();
      setIsRunning(false);
    }
    
    // If there's an active scenario, reload it. Otherwise, reset to initial state.
    if (state.activeScenario) {
      loadScenario(state.activeScenario.id);
    } else {
      engineRef.current?.reset(initialState);
    }
    
    addLogEntry("Simulation reset", "warning");
  }, [isRunning, state.activeScenario, loadScenario, addLogEntry]);
  
  // Event handler for control rod adjustment
  const handleControlRodChange = useCallback((event, newValue) => {
    // Update control rod position in the engine
    engineRef.current?.setControlRodPosition(newValue);
    
    // Log the action
    addLogEntry(`Control rods adjusted to ${newValue}% insertion`, 'info');
  }, [addLogEntry]);
  
  // Event handler for connecting/disconnecting from grid
  const handleGridToggle = useCallback(() => {
    const success = engineRef.current?.toggleGridConnection();
    
    // Log the action
    if (success !== false) {
      addLogEntry(state.gridConnected ? 'Disconnected from grid' : 'Connected to grid', 'info');
    } else {
      addLogEntry('Failed to connect to grid - Turbine RPM not synchronized', 'error');
    }
  }, [state.gridConnected, addLogEntry]);
  
  // Event handler for changing simulation speed
  const handleSpeedChange = useCallback((event) => {
    const speed = Number(event.target.value);
    engineRef.current?.setTimeMultiplier(speed);
    
    // Log the action
    addLogEntry(`Simulation speed set to ${speed}x`, 'info');
  }, [addLogEntry]);
  
  // Event handler for toggling automatic control systems
  const handleAutoControlToggle = useCallback((system) => {
    const newState = engineRef.current?.toggleAutoControlSystem(system);
    
    // Log the action
    const systemName = {
      pressurizer: 'Pressurizer',
      feedwater: 'Feedwater',
      turbineGovernor: 'Turbine Governor'
    }[system];
    
    addLogEntry(`${systemName} control set to ${newState ? 'AUTO' : 'MANUAL'}`, 'info');
  }, [addLogEntry]);
  
  // Event handler for starting a scenario
  const handleStartScenario = useCallback(() => {
    if (!state.activeScenario) return;
    
    // Reset scenario first
    loadScenario(state.activeScenario.id);
    
    // Start the simulation
    engineRef.current?.start();
    setIsRunning(true);
    
    // Log the action
    addLogEntry(`Started scenario: ${state.activeScenario.name}`, 'success');
    
    // Show notification to user
    setNotification({
      message: `Scenario "${state.activeScenario.name}" started`,
      severity: 'success'
    });
  }, [state.activeScenario, loadScenario, addLogEntry]);
  
  // Prepare chart data
  const powerChartData = prepareChartData(
    state.powerHistory, 
    'Reactor Power (%)', 
    'rgba(255, 99, 132, 1)'
  );
  
  const temperatureChartData = prepareChartData(
    state.tempHistory, 
    'Primary Temperature (°C)', 
    'rgba(255, 159, 64, 1)'
  );
  
  const pressureChartData = prepareChartData(
    state.pressureHistory, 
    'Primary Pressure (MPa)', 
    'rgba(54, 162, 235, 1)'
  );
  
  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  // Effect to handle stopping simulation when hiding simulator
  useEffect(() => {
    if (!showSimulator && isRunning) {
      engineRef.current?.stop();
      setIsRunning(false);
    }
  }, [showSimulator, isRunning]);
  
  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          VVER-1000 Nuclear Power Plant Control Room Simulator
        </Typography>
        
        <Typography variant="body2" color="text.secondary" paragraph>
          Experience operating a VVER-1000 nuclear reactor as a control room operator. 
          Choose from various operational scenarios and manage reactor parameters to ensure safe and efficient operation.
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={showSimulator ? <ExpandMoreIcon /> : <LaunchIcon />}
          onClick={() => setShowSimulator(!showSimulator)}
          sx={{ my: 2 }}
        >
          {showSimulator ? "Hide Simulator" : "Launch Simulator"}
        </Button>
        
        <Collapse in={showSimulator} timeout="auto" unmountOnExit>
          <Divider sx={{ my: 2 }} />
          
          {/* Scenario Selection */}
          <VVER1000Scenarios 
            activeScenario={state.activeScenario} 
            onScenarioChange={handleScenarioChange}
            onShowInstructions={() => setShowInstructions(true)}
            onShowOperatorLog={() => setShowOperatorLog(true)}
            onStartScenario={handleStartScenario}
            disabled={isRunning || state.scenarioComplete || state.scenarioFailed}
          />
          
          {/* Status and Controls */}
          <Grid container spacing={3}>
            {/* Main Control Panel */}
            <Grid item xs={12} md={4}>
              <VVER1000ControlPanel 
                state={state}
                onControlRodChange={handleControlRodChange}
                onGridToggle={handleGridToggle}
                onAutoControlToggle={handleAutoControlToggle}
                disabled={!isRunning || state.scenarioComplete || state.scenarioFailed}
              />
            </Grid>
            
            {/* Charts, 3D View and Displays */}
            <Grid item xs={12} md={8}>
              {/* Tab navigation */}
              <Paper sx={{ mb: 2 }}>
                <Tabs 
                  value={activeTab} 
                  onChange={handleTabChange} 
                  variant="fullWidth"
                  textColor="primary"
                  indicatorColor="primary"
                >
                  <Tab icon={<BarChartIcon />} label="Parameters" />
                  <Tab icon={<ViewInArIcon />} label="3D Core View" />
                  <Tab icon={<PrecisionManufacturingIcon />} label="Systems" />
                </Tabs>
              </Paper>
              
              {/* Tab content */}
              <Box sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                <VVER1000DisplayPanel 
                  state={state}
                  isRunning={isRunning}
                  onToggleSimulation={toggleSimulation}
                  onReset={resetSimulation}
                  onSpeedChange={handleSpeedChange}
                  powerChartData={powerChartData}
                  temperatureChartData={temperatureChartData}
                  pressureChartData={pressureChartData}
                  chartOptions={chartOptions}
                />
              </Box>
              
              <Box sx={{ display: activeTab === 1 ? 'block' : 'none' }}>
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Reactor Core 3D Visualization</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Typography variant="body2">
                          Power: {state.reactorPower.toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          color={isRunning ? "warning" : "success"}
                          onClick={toggleSimulation}
                          disabled={!state.activeScenario || state.scenarioComplete || state.scenarioFailed}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          {isRunning ? "Pause" : "Run"}
                        </Button>
                        
                        <Button
                          variant="outlined"
                          onClick={resetSimulation}
                          size="small"
                        >
                          Reset
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  
                  <VVER1000ReactorCore3D 
                    reactorPower={state.reactorPower}
                    controlRodPosition={state.controlRodPosition}
                  />
                </Paper>
              </Box>
              
              {/* Detailed Components View */}
              <Box sx={{ display: activeTab === 2 ? 'block' : 'none' }}>
                <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Plant Systems Visualization</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                        <Typography variant="body2">
                          Power: {state.reactorPower.toFixed(1)}%
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Button
                          variant="contained"
                          color={isRunning ? "warning" : "success"}
                          onClick={toggleSimulation}
                          disabled={!state.activeScenario || state.scenarioComplete || state.scenarioFailed}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          {isRunning ? "Pause" : "Run"}
                        </Button>
                        
                        <Button
                          variant="outlined"
                          onClick={resetSimulation}
                          size="small"
                        >
                          Reset
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  
                  <VVER1000DetailedComponents
                    reactorPower={state.reactorPower}
                    controlRodPosition={state.controlRodPosition}
                    primaryTemp={state.primaryTemp}
                    primaryPressure={state.primaryPressure}
                    secondaryPressure={state.secondaryPressure}
                    turbineRpm={state.turbineRpm}
                    gridConnected={state.gridConnected}
                    coolantFlowRate={state.coolantFlowRate}
                    autoControlSystems={state.autoControlSystems}
                  />
                </Paper>
              </Box>
            </Grid>
          </Grid>
          
          {/* Additional Information */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" gutterBottom>VVER-1000 Reactor Information</Typography>
            <Typography variant="body2" paragraph>
              The VVER-1000 is a Russian-designed pressurized water reactor with a thermal output of 3000 MWth, 
              producing approximately 1000 MWe. It features a hex-lattice core design with 163 fuel assemblies 
              and water as both coolant and moderator. The primary coolant circuit operates at around 15.7 MPa 
              pressure with temperatures ranging from 290°C (inlet) to 320°C (outlet).
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography color="primary" variant="subtitle1" gutterBottom>
                      Core Design
                    </Typography>
                    <Typography variant="body2" component="div">
                      <ul style={{ paddingLeft: 16, marginTop: 0 }}>
                        <li>163 hexagonal fuel assemblies</li>
                        <li>121 control rod assemblies</li>
                        <li>Core height: 3.55 m</li>
                        <li>Fuel enrichment: 4-5% U-235</li>
                        <li>12-month fuel cycle</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography color="primary" variant="subtitle1" gutterBottom>
                      Primary Circuit
                    </Typography>
                    <Typography variant="body2" component="div">
                      <ul style={{ paddingLeft: 16, marginTop: 0 }}>
                        <li>Four circulation loops</li>
                        <li>Pressure: 15.7 MPa</li>
                        <li>Coolant flow: 80,000 m³/h</li>
                        <li>Inlet temperature: 290°C</li>
                        <li>Outlet temperature: 320°C</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography color="primary" variant="subtitle1" gutterBottom>
                      Secondary Circuit
                    </Typography>
                    <Typography variant="body2" component="div">
                      <ul style={{ paddingLeft: 16, marginTop: 0 }}>
                        <li>Four horizontal steam generators</li>
                        <li>Steam pressure: 6.3 MPa</li>
                        <li>Steam temperature: 278.5°C</li>
                        <li>Superheat: 278.5°C - 278.2°C</li>
                        <li>Steam flow: 1600 t/h</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography color="primary" variant="subtitle1" gutterBottom>
                      Safety Systems
                    </Typography>
                    <Typography variant="body2" component="div">
                      <ul style={{ paddingLeft: 16, marginTop: 0 }}>
                        <li>High/low pressure injection</li>
                        <li>Passive hydrogen recombiners</li>
                        <li>Containment spray system</li>
                        <li>Emergency boron injection</li>
                        <li>Core catcher (in newer units)</li>
                      </ul>
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>
        </Collapse>
      </Paper>
      
      {/* Instructions Dialog */}
      <Dialog
        open={showInstructions}
        onClose={() => setShowInstructions(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>VVER-1000 Simulator Instructions</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Typography variant="h6" gutterBottom>How to Operate the Simulator</Typography>
            
            <Typography variant="body1" paragraph>
              1. <strong>Select a scenario</strong> from the dropdown menu. Each scenario has different objectives and operational challenges.
            </Typography>
            
            <Typography variant="body1" paragraph>
              2. <strong>Start the simulation</strong> by clicking the "Run" button. You can adjust the simulation speed using the dropdown.
            </Typography>
            
            <Typography variant="body1" paragraph>
              3. <strong>Control the reactor</strong> primarily by adjusting the control rod position slider:
            </Typography>
            
            <ul>
              <li>0% = fully withdrawn (maximum reactivity)</li>
              <li>100% = fully inserted (shutdown)</li>
            </ul>
            
            <Typography variant="body1" paragraph>
              4. <strong>Monitor key parameters</strong> such as reactor power, primary temperature and pressure, and secondary circuit conditions.
            </Typography>
            
            <Typography variant="body1" paragraph>
              5. <strong>Connect to the grid</strong> once the turbine is at the correct speed (approximately 3000 RPM).
            </Typography>
            
            <Typography variant="body1" paragraph>
              6. <strong>Toggle automatic control systems</strong> to switch between automatic and manual operation for different plant systems.
            </Typography>
            
            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Safety Requirements</Typography>
            
            <ul>
              <li>Keep primary pressure between {SAFETY_LIMITS.minPrimaryPressure} MPa and {SAFETY_LIMITS.maxPrimaryPressure} MPa</li>
              <li>Keep primary temperature between {SAFETY_LIMITS.minPrimaryTemp}°C and {SAFETY_LIMITS.maxPrimaryTemp}°C</li>
              <li>Avoid rapid power changes (exceeding {SAFETY_LIMITS.maxPowerRate}% per minute)</li>
              <li>Ensure turbine speed doesn't exceed {SAFETY_LIMITS.maxTurbineRpm} RPM</li>
            </ul>
            
            <Typography variant="body1" color="error" sx={{ mt: 2 }}>
              Exceeding these limits will trigger automatic safety systems and may result in a reactor SCRAM.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowInstructions(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Operator Log Dialog */}
      <Dialog
        open={showOperatorLog}
        onClose={() => setShowOperatorLog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Operator Action Log</DialogTitle>
        <DialogContent>
          <DialogContentText component="div">
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {operatorLogEntries.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Time</th>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Simulation Time</th>
                      <th style={{ textAlign: 'left', padding: '8px', borderBottom: '1px solid #ddd' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {operatorLogEntries.map((entry, index) => (
                      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : 'white' }}>
                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{entry.timestamp}</td>
                        <td style={{ padding: '8px', borderBottom: '1px solid #ddd' }}>{entry.simulationTime}</td>
                        <td style={{ 
                          padding: '8px', 
                          borderBottom: '1px solid #ddd',
                          color: entry.type === 'error' ? '#f44336' : 
                                 entry.type === 'warning' ? '#ff9800' : 
                                 entry.type === 'success' ? '#4caf50' : 'inherit'
                        }}>
                          {entry.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <Typography variant="body1" align="center" sx={{ p: 3 }}>
                  No log entries yet
                </Typography>
              )}
            </Box>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowOperatorLog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
      
      {/* Notification Snackbar */}
      <Snackbar
        open={notification !== null}
        autoHideDuration={6000}
        onClose={() => setNotification(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {notification && (
          <Alert 
            onClose={() => setNotification(null)} 
            severity={notification.severity} 
            variant="filled"
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        )}
      </Snackbar>
    </Box>
  );
}

export default VVER1000ControlRoom;