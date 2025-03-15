import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Slider,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Alert,
  CircularProgress,
  Tooltip,
  IconButton,
  Badge,
  Chip,
  Card,
  CardContent,
  Collapse,
  Divider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import NotificationsIcon from '@mui/icons-material/Notifications';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LaunchIcon from '@mui/icons-material/Launch';

// Import chart.js
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  ChartTooltip,
  Legend
);

// VVER-1000 reactor parameters
const VVER1000 = {
  thermalPower: 3000, // MWth
  electricalPower: 1000, // MWe
  coolantType: 'water',
  coolantFlowRate: 80000, // m³/h
  primaryLoops: 4,
  coreInletTemp: 290, // °C
  coreOutletTemp: 320, // °C
  primaryPressure: 15.7, // MPa
  secondaryPressure: 6.3, // MPa
  steamTemp: 278.5, // °C
  controlRods: 121, // number of control rod assemblies
  fuelAssemblies: 163, // number of fuel assemblies
  turbineRpm: 3000, // RPM
  nominalFrequency: 50, // Hz
};

// Reactor operational scenarios
const SCENARIOS = [
  {
    id: 'startup',
    name: 'Reactor Startup',
    description: 'Perform a safe startup of the VVER-1000 reactor from cold shutdown to 100% power.',
    difficulty: 'Moderate',
    initialState: {
      reactorPower: 0,
      controlRodPosition: 100, // 100% inserted (fully down)
      primaryPressure: 15.7,
      primaryTemp: 270,
      secondaryPressure: 6.0,
      turbineRpm: 0,
      gridConnected: false,
      coolantFlowRate: 80000,
      boronConcentration: 10.5, // g/kg
      alarms: [],
      time: 0,
      timeMultiplier: 1,
    },
    goal: 'Reach 100% power and connect to the grid',
    steps: [
      'Withdraw control rods to establish criticality',
      'Stabilize the reactor at low power (~5%)',
      'Gradually increase power while monitoring primary parameters',
      'Start turbine when steam parameters are acceptable',
      'Synchronize generator to the grid',
      'Increase to full power'
    ]
  },
  {
    id: 'powerReduction',
    name: 'Planned Power Reduction',
    description: 'Perform a controlled power reduction from 100% to 50% for planned maintenance.',
    difficulty: 'Easy',
    initialState: {
      reactorPower: 100,
      controlRodPosition: 20, // 20% inserted
      primaryPressure: 15.7,
      primaryTemp: 320,
      secondaryPressure: 6.3,
      turbineRpm: 3000,
      gridConnected: true,
      coolantFlowRate: 80000,
      boronConcentration: 7.2, // g/kg
      alarms: [],
      time: 0,
      timeMultiplier: 1,
    },
    goal: 'Reduce power to 50% without triggering safety systems',
    steps: [
      'Gradually insert control rods to reduce power',
      'Maintain primary temperature and pressure within operating range',
      'Adjust turbine load following reactor power',
      'Stabilize at 50% power'
    ]
  },
  {
    id: 'pumpFailure',
    name: 'Main Coolant Pump Failure',
    description: 'Respond to the failure of one main coolant pump while at 100% power.',
    difficulty: 'Hard',
    initialState: {
      reactorPower: 100,
      controlRodPosition: 20, // 20% inserted
      primaryPressure: 15.7,
      primaryTemp: 320,
      secondaryPressure: 6.3,
      turbineRpm: 3000,
      gridConnected: true,
      coolantFlowRate: 80000,
      boronConcentration: 7.2, // g/kg
      alarms: [],
      time: 0,
      timeMultiplier: 1,
      plannedEvents: [
        {
          time: 120, // After 2 minutes
          effect: (state) => {
            const newState = {...state};
            newState.coolantFlowRate = 60000; // Reduced flow due to pump failure
            newState.alarms.push('Main Coolant Pump #2 Failure');
            return newState;
          }
        }
      ]
    },
    goal: 'Stabilize the reactor at reduced power without scram',
    steps: [
      'Immediately reduce reactor power',
      'Adjust control rods to maintain core parameters',
      'Monitor temperature distribution for hot spots',
      'Stabilize at new power level (around 75%)'
    ]
  },
  {
    id: 'loadRejection',
    name: 'Generator Load Rejection',
    description: 'Handle a sudden load rejection when the generator disconnects from the grid.',
    difficulty: 'Hard',
    initialState: {
      reactorPower: 100,
      controlRodPosition: 20, // 20% inserted
      primaryPressure: 15.7,
      primaryTemp: 320,
      secondaryPressure: 6.3,
      turbineRpm: 3000,
      gridConnected: true,
      coolantFlowRate: 80000,
      boronConcentration: 7.2, // g/kg
      alarms: [],
      time: 0,
      timeMultiplier: 1,
      plannedEvents: [
        {
          time: 90, // After 1.5 minutes
          effect: (state) => {
            const newState = {...state};
            newState.gridConnected = false;
            newState.alarms.push('Generator Load Rejection');
            newState.alarms.push('Turbine Overspeed Warning');
            return newState;
          }
        }
      ]
    },
    goal: 'Prevent reactor trip and stabilize at house load operation',
    steps: [
      'Quickly reduce reactor power',
      'Control turbine speed to prevent overspeed trip',
      'Maintain steam pressure by controlling steam dump to condenser',
      'Stabilize at house load (~5-10% power)'
    ]
  },
  {
    id: 'xenonTransient',
    name: 'Xenon Transient After Shutdown',
    description: 'Manage reactor restart after a short shutdown, dealing with xenon poisoning.',
    difficulty: 'Expert',
    initialState: {
      reactorPower: 0,
      controlRodPosition: 30, // 30% inserted
      primaryPressure: 15.7,
      primaryTemp: 290,
      secondaryPressure: 6.0,
      turbineRpm: 0,
      gridConnected: false,
      coolantFlowRate: 80000,
      boronConcentration: 8.5, // g/kg
      xenonLevel: 90, // % of peak
      time: 0,
      timeMultiplier: 1,
      alarms: ['Reactor Recently Shutdown - High Xenon'],
    },
    goal: 'Successfully restart the reactor and reach 50% power',
    steps: [
      'Assess xenon concentration and reactivity margin',
      'Carefully withdraw control rods to overcome negative reactivity',
      'Establish criticality and stabilize at low power',
      'Gradually increase power while monitoring xenon burnout'
    ]
  }
];

// Initial state for the simulator
const initialState = {
  reactorPower: 0, // % of rated power
  controlRodPosition: 100, // % inserted
  primaryPressure: 15.7, // MPa
  primaryTemp: 270, // °C
  secondaryPressure: 6.0, // MPa
  turbineRpm: 0,
  gridConnected: false,
  coolantFlowRate: 80000, // m³/h
  boronConcentration: 10.5, // g/kg
  alarms: [],
  time: 0, // simulation time in seconds
  timeMultiplier: 1, // simulation speed
  activeScenario: null,
  scenarioComplete: false,
  scenarioFailed: false,
  failureReason: '',
  notifications: [],
  xenonLevel: 0, // % of equilibrium
  powerHistory: [],
  tempHistory: [],
  pressureHistory: [],
  manualMode: true, // Whether operator has full manual control
  autoControlSystems: {
    pressurizer: true,  // Automatic pressurizer control
    feedwater: true,    // Automatic feedwater control
    turbineGovernor: true // Automatic turbine speed control
  }
};

// Safety limits
const SAFETY_LIMITS = {
  maxPrimaryPressure: 17.0, // MPa
  minPrimaryPressure: 13.0, // MPa
  maxPrimaryTemp: 330, // °C
  minPrimaryTemp: 260, // °C (when at pressure)
  maxSecondaryPressure: 7.0, // MPa
  minSecondaryPressure: 5.0, // MPa (when operating)
  maxPowerRate: 5, // % per minute
  maxControlRodRate: 2, // % per minute when in automatic mode
  maxTurbineRpm: 3300, // RPM
};

// SCRAM conditions
const SCRAM_CONDITIONS = [
  {
    parameter: 'primaryPressure',
    condition: (value) => value > SAFETY_LIMITS.maxPrimaryPressure,
    message: 'High Primary Pressure - SCRAM'
  },
  {
    parameter: 'primaryPressure',
    condition: (value) => value < SAFETY_LIMITS.minPrimaryPressure && value > 10, // Only when system is pressurized
    message: 'Low Primary Pressure - SCRAM'
  },
  {
    parameter: 'primaryTemp',
    condition: (value) => value > SAFETY_LIMITS.maxPrimaryTemp,
    message: 'High Primary Temperature - SCRAM'
  },
  {
    parameter: 'secondaryPressure',
    condition: (value) => value > SAFETY_LIMITS.maxSecondaryPressure,
    message: 'High Secondary Pressure - SCRAM'
  },
  {
    parameter: 'turbineRpm',
    condition: (value) => value > SAFETY_LIMITS.maxTurbineRpm,
    message: 'Turbine Overspeed - SCRAM'
  }
];

function VVER1000ControlRoom() {
  // State management
  const [showSimulator, setShowSimulator] = useState(false);
  const [state, setState] = useState(initialState);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showOperatorLog, setShowOperatorLog] = useState(false);
  const [operatorLogEntries, setOperatorLogEntries] = useState([]);
  
  // Chart references
  const powerChartRef = useRef(null);
  const temperatureChartRef = useRef(null);
  const pressureChartRef = useRef(null);
  
  // Animation reference
  const animationRef = useRef(null);
  
  // Time reference for simulation steps
  const lastTimeRef = useRef(0);
  
  // Function to load a scenario
  const loadScenario = (scenarioId) => {
    const scenario = SCENARIOS.find(s => s.id === scenarioId);
    if (scenario) {
      // Stop any current simulation
      if (isRunning) {
        setIsRunning(false);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }
      
      // Set initial state for the scenario
      const newState = {
        ...initialState,
        ...scenario.initialState,
        activeScenario: scenario,
        powerHistory: [],
        tempHistory: [],
        pressureHistory: [],
        scenarioComplete: false,
        scenarioFailed: false,
        failureReason: '',
        notifications: [
          {
            type: 'info',
            message: `Scenario loaded: ${scenario.name}`,
            time: 0
          }
        ]
      };
      
      setState(newState);
      
      // Add first log entry
      addLogEntry(`Scenario started: ${scenario.name}`);
    }
  };
  
  // Function to add an entry to the operator log
  const addLogEntry = (message, type = 'info') => {
    const newEntry = {
      message,
      type,
      timestamp: new Date().toLocaleTimeString(),
      simulationTime: formatTime(state.time)
    };
    
    setOperatorLogEntries(prev => [newEntry, ...prev]);
  };
  
  // Function to format time in HH:MM:SS
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Function to start/stop simulation
  const toggleSimulation = () => {
    if (isRunning) {
      // Stop simulation
      setIsRunning(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      addLogEntry("Simulation paused", "warning");
    } else {
      // Start simulation
      setIsRunning(true);
      lastTimeRef.current = performance.now();
      runSimulation();
      addLogEntry("Simulation started", "success");
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    // Stop any current simulation
    if (isRunning) {
      setIsRunning(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    
    // If there's an active scenario, reload it. Otherwise, reset to initial state.
    if (state.activeScenario) {
      loadScenario(state.activeScenario.id);
    } else {
      setState({
        ...initialState,
        powerHistory: [],
        tempHistory: [],
        pressureHistory: []
      });
    }
    
    addLogEntry("Simulation reset", "warning");
  };
  
  // Main simulation loop
  const runSimulation = () => {
    const currentTime = performance.now();
    const deltaTime = (currentTime - lastTimeRef.current) / 1000; // Convert to seconds
    lastTimeRef.current = currentTime;
    
    // Update simulation state
    updateSimulation(deltaTime * state.timeMultiplier);
    
    // Continue the simulation loop
    if (isRunning) {
      animationRef.current = requestAnimationFrame(runSimulation);
    }
  };
  
  // Update all simulation parameters based on current state and controls
  const updateSimulation = (deltaTime) => {
    // Create a copy of current state to modify
    let newState = {...state};
    
    // Increment simulation time
    newState.time += deltaTime;
    
    // Check for planned events in active scenario
    if (newState.activeScenario && newState.activeScenario.plannedEvents) {
      for (const event of newState.activeScenario.plannedEvents) {
        if (!event.executed && newState.time >= event.time) {
          newState = event.effect(newState);
          event.executed = true;
          
          // Log the event
          addLogEntry(`Event triggered: ${newState.alarms[newState.alarms.length - 1]}`, "warning");
        }
      }
    }
    
    // Physics-based updates
    
    // 1. Reactor power response to control rod position
    // Simplified model: rod reactivity worth + time constant
    const targetPower = 100 - Math.pow(newState.controlRodPosition, 1.5) / 10;
    const powerTimeConstant = 20; // seconds for power changes to take effect
    const powerChange = (targetPower - newState.reactorPower) * (deltaTime / powerTimeConstant);
    
    // Account for xenon effects
    const xenonEffect = newState.xenonLevel > 0 ? (newState.xenonLevel / 100) * 5 : 0;
    
    newState.reactorPower += powerChange - xenonEffect * (deltaTime / 60);
    newState.reactorPower = Math.max(0, Math.min(100, newState.reactorPower));
    
    // 2. Primary temperature based on power
    const nominalDeltaT = VVER1000.coreOutletTemp - VVER1000.coreInletTemp;
    const actualDeltaT = nominalDeltaT * (newState.reactorPower / 100) * (VVER1000.coolantFlowRate / newState.coolantFlowRate);
    newState.primaryTemp = VVER1000.coreInletTemp + actualDeltaT * (newState.reactorPower / 100);
    
    // 3. Primary pressure response
    // Simplified model: pressure follows temperature with time delay
    // In real systems, pressurizer would control this with heaters and spray
    if (newState.autoControlSystems.pressurizer) {
      // Automatic pressure control tries to maintain setpoint
      const pressureSetpoint = 15.7;
      const pressureError = pressureSetpoint - newState.primaryPressure;
      const pressureCorrection = pressureError * 0.1 * deltaTime;
      newState.primaryPressure += pressureCorrection;
    } else {
      // Manual mode - pressure follows temperature with thermal expansion
      const pressureTimeConstant = 30; // seconds
      const targetPressure = 15.7 + (newState.primaryTemp - 290) * 0.05;
      const pressureChange = (targetPressure - newState.primaryPressure) * (deltaTime / pressureTimeConstant);
      newState.primaryPressure += pressureChange;
    }
    
    // 4. Secondary pressure based on turbine load
    if (newState.autoControlSystems.feedwater) {
      // Automatic secondary systems try to maintain steam pressure
      const secondarySetpoint = 6.3;
      const secondaryError = secondarySetpoint - newState.secondaryPressure;
      const secondaryCorrection = secondaryError * 0.15 * deltaTime;
      newState.secondaryPressure += secondaryCorrection;
    } else {
      // Manual mode - pressure based on steam production vs consumption
      const steamProduction = newState.reactorPower / 100;
      const steamConsumption = newState.turbineRpm / 3000;
      const secondaryPressureChange = (steamProduction - steamConsumption) * 0.2 * deltaTime;
      newState.secondaryPressure += secondaryPressureChange;
    }
    
    // 5. Turbine response
    if (newState.autoControlSystems.turbineGovernor && newState.gridConnected) {
      // When grid-connected, turbine speed is locked at nominal frequency
      newState.turbineRpm = VVER1000.turbineRpm;
    } else if (newState.gridConnected) {
      // Manual control but grid connected - limited deviation
      const rpmError = VVER1000.turbineRpm - newState.turbineRpm;
      const rpmCorrection = rpmError * 0.5 * deltaTime;
      newState.turbineRpm += rpmCorrection;
    } else {
      // Not grid connected - turbine speed depends on steam flow and load
      const steamAvailable = newState.secondaryPressure / 6.3;
      const targetRpm = 3000 * steamAvailable;
      const rpmTimeConstant = 10; // seconds
      const rpmChange = (targetRpm - newState.turbineRpm) * (deltaTime / rpmTimeConstant);
      newState.turbineRpm += rpmChange;
    }
    
    // 6. Xenon transient behavior
    // Simplified model of xenon buildup and burnout
    if (newState.xenonLevel > 0) {
      // Xenon burnout rate depends on power level
      const xenonBurnoutRate = (newState.reactorPower / 100) * 2; // % per minute
      newState.xenonLevel -= xenonBurnoutRate * (deltaTime / 60);
      newState.xenonLevel = Math.max(0, newState.xenonLevel);
    } else if (newState.reactorPower > 50 && Math.random() < 0.005) {
      // Small chance of xenon oscillation starting at high power
      newState.xenonLevel = 5;
      newState.notifications.push({
        type: 'warning',
        message: 'Xenon oscillation detected',
        time: newState.time
      });
    }
    
    // Record history for charts
    if (newState.time % 5 < deltaTime) { // Record every ~5 seconds
      newState.powerHistory.push({
        time: newState.time,
        value: newState.reactorPower
      });
      
      newState.tempHistory.push({
        time: newState.time,
        value: newState.primaryTemp
      });
      
      newState.pressureHistory.push({
        time: newState.time,
        value: newState.primaryPressure
      });
      
      // Limit history length
      if (newState.powerHistory.length > 100) {
        newState.powerHistory.shift();
        newState.tempHistory.shift();
        newState.pressureHistory.shift();
      }
    }
    
    // Check for alarms
    checkAlarms(newState);
    
    // Check for SCRAM conditions
    if (checkScramConditions(newState)) {
      // SCRAM occurred - shut down reactor
      newState.reactorPower = 0;
      newState.controlRodPosition = 100; // Fully inserted
      newState.turbineRpm = 0;
      newState.gridConnected = false;
      
      // Add notification
      newState.notifications.push({
        type: 'error',
        message: 'REACTOR SCRAM',
        time: newState.time
      });
      
      // Log the SCRAM
      addLogEntry('REACTOR SCRAM ACTIVATED', 'error');
      
      // Check if we're in a scenario
      if (newState.activeScenario) {
        newState.scenarioFailed = true;
        newState.failureReason = 'Reactor SCRAM triggered';
        setIsRunning(false);
      }
    }
    
    // Check for scenario completion
    checkScenarioCompletion(newState);
    
    // Update state
    setState(newState);
  };
  
  // Check for alarm conditions
  const checkAlarms = (newState) => {
    const currentAlarms = [...newState.alarms];
    
    // Check primary pressure
    if (newState.primaryPressure > SAFETY_LIMITS.maxPrimaryPressure * 0.95) {
      if (!currentAlarms.includes('High Primary Pressure Warning')) {
        currentAlarms.push('High Primary Pressure Warning');
        
        // Add notification
        newState.notifications.push({
          type: 'warning',
          message: 'High Primary Pressure Warning',
          time: newState.time
        });
        
        // Log the alarm
        addLogEntry('High Primary Pressure Warning', 'warning');
      }
    } else {
      const index = currentAlarms.indexOf('High Primary Pressure Warning');
      if (index !== -1) {
        currentAlarms.splice(index, 1);
      }
    }
    
    // Check primary temperature
    if (newState.primaryTemp > SAFETY_LIMITS.maxPrimaryTemp * 0.95) {
      if (!currentAlarms.includes('High Primary Temperature Warning')) {
        currentAlarms.push('High Primary Temperature Warning');
        
        // Add notification
        newState.notifications.push({
          type: 'warning',
          message: 'High Primary Temperature Warning',
          time: newState.time
        });
        
        // Log the alarm
        addLogEntry('High Primary Temperature Warning', 'warning');
      }
    } else {
      const index = currentAlarms.indexOf('High Primary Temperature Warning');
      if (index !== -1) {
        currentAlarms.splice(index, 1);
      }
    }
    
    // Check turbine rpm
    if (newState.turbineRpm > SAFETY_LIMITS.maxTurbineRpm * 0.95) {
      if (!currentAlarms.includes('Turbine Overspeed Warning')) {
        currentAlarms.push('Turbine Overspeed Warning');
        
        // Add notification
        newState.notifications.push({
          type: 'warning',
          message: 'Turbine Overspeed Warning',
          time: newState.time
        });
        
        // Log the alarm
        addLogEntry('Turbine Overspeed Warning', 'warning');
      }
    } else {
      const index = currentAlarms.indexOf('Turbine Overspeed Warning');
      if (index !== -1) {
        currentAlarms.splice(index, 1);
      }
    }
    
    // Update alarms
    newState.alarms = currentAlarms;
  };
  
  // Check for SCRAM conditions
  const checkScramConditions = (newState) => {
    for (const condition of SCRAM_CONDITIONS) {
      if (condition.condition(newState[condition.parameter])) {
        // Log the reason
        addLogEntry(condition.message, 'error');
        return true;
      }
    }
    return false;
  };
  
  // Check for scenario completion
  const checkScenarioCompletion = (newState) => {
    if (!newState.activeScenario || newState.scenarioComplete || newState.scenarioFailed) {
      return;
    }
    
    const scenario = newState.activeScenario;
    
    // Different completion criteria for each scenario
    switch (scenario.id) {
      case 'startup':
        if (newState.reactorPower >= 95 && newState.gridConnected) {
          newState.scenarioComplete = true;
          newState.notifications.push({
            type: 'success',
            message: 'Scenario completed successfully!',
            time: newState.time
          });
          
          addLogEntry('Startup scenario completed successfully!', 'success');
          setIsRunning(false);
        }
        break;
        
      case 'powerReduction':
        if (Math.abs(newState.reactorPower - 50) < 2) {
          // Within 2% of target power
          newState.scenarioComplete = true;
          newState.notifications.push({
            type: 'success',
            message: 'Power reduction completed successfully!',
            time: newState.time
          });
          
          addLogEntry('Power reduction scenario completed successfully!', 'success');
          setIsRunning(false);
        }
        break;
        
      case 'pumpFailure':
        // Check if we've stabilized at reduced power
        if (newState.coolantFlowRate < 70000 && 
            Math.abs(newState.reactorPower - 75) < 5 && 
            newState.time > 300) { // Give some time to stabilize
          
          newState.scenarioComplete = true;
          newState.notifications.push({
            type: 'success',
            message: 'Pump failure handled successfully!',
            time: newState.time
          });
          
          addLogEntry('Pump failure scenario completed successfully!', 'success');
          setIsRunning(false);
        }
        break;
        
      case 'loadRejection':
        // Check if we've stabilized at house load
        if (!newState.gridConnected && 
            newState.reactorPower >= 5 && 
            newState.reactorPower <= 15 && 
            Math.abs(newState.turbineRpm - 3000) < 100 &&
            newState.time > 300) { // Give some time to stabilize
          
          newState.scenarioComplete = true;
          newState.notifications.push({
            type: 'success',
            message: 'Load rejection handled successfully!',
            time: newState.time
          });
          
          addLogEntry('Load rejection scenario completed successfully!', 'success');
          setIsRunning(false);
        }
        break;
        
      case 'xenonTransient':
        // Check if we've reached target power with xenon
        if (newState.reactorPower >= 45 && 
            newState.reactorPower <= 55 && 
            newState.time > 300) { // Give some time to stabilize
          
          newState.scenarioComplete = true;
          newState.notifications.push({
            type: 'success',
            message: 'Xenon transient handled successfully!',
            time: newState.time
          });
          
          addLogEntry('Xenon transient scenario completed successfully!', 'success');
          setIsRunning(false);
        }
        break;
      
      default:
        break;
    }
  };
  
  // Event handler for control rod adjustment
  const handleControlRodChange = (event, newValue) => {
    // Update control rod position
    setState(prev => ({
      ...prev,
      controlRodPosition: newValue
    }));
    
    // Log the action
    addLogEntry(`Control rods adjusted to ${newValue}% insertion`, 'info');
  };
  
  // Event handler for scenario selection
  const handleScenarioChange = (event) => {
    const scenarioId = event.target.value;
    if (scenarioId) {
      loadScenario(scenarioId);
    }
  };
  
  // Event handler for connecting/disconnecting from grid
  const handleGridToggle = () => {
    // Cannot connect to grid if turbine rpm is too far from nominal
    if (!state.gridConnected && Math.abs(state.turbineRpm - VVER1000.turbineRpm) > 50) {
      // Add notification
      setState(prev => ({
        ...prev,
        notifications: [
          ...prev.notifications,
          {
            type: 'error',
            message: 'Cannot connect to grid: Turbine speed not synchronized',
            time: prev.time
          }
        ]
      }));
      
      addLogEntry('Grid synchronization failed: Turbine rpm not within acceptable range', 'error');
      return;
    }
    
    // Toggle grid connection
    setState(prev => ({
      ...prev,
      gridConnected: !prev.gridConnected
    }));
    
    // Log the action
    addLogEntry(state.gridConnected ? 'Disconnected from grid' : 'Connected to grid', 'info');
  };
  
  // Event handler for changing simulation speed
  const handleSpeedChange = (event) => {
    const speed = Number(event.target.value);
    setState(prev => ({
      ...prev,
      timeMultiplier: speed
    }));
    
    // Log the action
    addLogEntry(`Simulation speed set to ${speed}x`, 'info');
  };
  
  // Event handler for toggling automatic control systems
  const handleAutoControlToggle = (system) => {
    setState(prev => ({
      ...prev,
      autoControlSystems: {
        ...prev.autoControlSystems,
        [system]: !prev.autoControlSystems[system]
      }
    }));
    
    // Log the action
    const systemName = {
      pressurizer: 'Pressurizer',
      feedwater: 'Feedwater',
      turbineGovernor: 'Turbine Governor'
    }[system];
    
    const newState = !state.autoControlSystems[system] ? 'AUTO' : 'MANUAL';
    addLogEntry(`${systemName} control set to ${newState}`, 'info');
  };
  
  // Prepare chart data
  const powerChartData = {
    labels: state.powerHistory.map(p => formatTime(p.time)),
    datasets: [
      {
        label: 'Reactor Power (%)',
        data: state.powerHistory.map(p => p.value),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        tension: 0.4
      }
    ]
  };
  
  const temperatureChartData = {
    labels: state.tempHistory.map(p => formatTime(p.time)),
    datasets: [
      {
        label: 'Primary Temperature (°C)',
        data: state.tempHistory.map(p => p.value),
        borderColor: 'rgba(255, 159, 64, 1)',
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        tension: 0.4
      }
    ]
  };
  
  const pressureChartData = {
    labels: state.pressureHistory.map(p => formatTime(p.time)),
    datasets: [
      {
        label: 'Primary Pressure (MPa)',
        data: state.pressureHistory.map(p => p.value),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        tension: 0.4
      }
    ]
  };
  
  // Common chart options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Time'
        },
        ticks: {
          maxTicksLimit: 8,
          maxRotation: 0
        }
      },
      y: {
        title: {
          display: true,
          text: 'Value'
        }
      }
    },
    plugins: {
      legend: {
        position: 'top',
      }
    },
    animation: {
      duration: 0 // Disable animations for better performance
    }
  };
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Effect to handle stopping simulation when hiding simulator
  useEffect(() => {
    if (!showSimulator && isRunning) {
      setIsRunning(false);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
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
          <Box sx={{ mb: 3 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel id="scenario-select-label">Select Operational Scenario</InputLabel>
                  <Select
                    labelId="scenario-select-label"
                    id="scenario-select"
                    value={state.activeScenario ? state.activeScenario.id : ''}
                    label="Select Operational Scenario"
                    onChange={handleScenarioChange}
                    disabled={isRunning}
                  >
                    <MenuItem value=""><em>Select a scenario</em></MenuItem>
                    {SCENARIOS.map(scenario => (
                      <MenuItem key={scenario.id} value={scenario.id}>
                        {scenario.name} - {scenario.difficulty}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button 
                    variant="outlined" 
                    color="info" 
                    startIcon={<LibraryBooksIcon />}
                    onClick={() => setShowInstructions(true)}
                    sx={{ mr: 1 }}
                  >
                    Instructions
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<AccessTimeIcon />}
                    onClick={() => setShowOperatorLog(true)}
                  >
                    Operator Log
                  </Button>
                </Box>
              </Grid>
            </Grid>
            
            {state.activeScenario && (
              <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
                <Typography variant="h6">
                  {state.activeScenario.name}
                  <Chip 
                    label={state.activeScenario.difficulty} 
                    size="small" 
                    color={
                      state.activeScenario.difficulty === 'Easy' ? 'success' :
                      state.activeScenario.difficulty === 'Moderate' ? 'info' :
                      state.activeScenario.difficulty === 'Hard' ? 'warning' : 'error'
                    }
                    sx={{ ml: 1 }}
                  />
                </Typography>
                <Typography variant="body2" paragraph>{state.activeScenario.description}</Typography>
                <Typography variant="subtitle2" gutterBottom>Goal: {state.activeScenario.goal}</Typography>
                
                <Typography variant="body2" sx={{ mt: 1 }}>Key steps:</Typography>
                <ol>
                  {state.activeScenario.steps.map((step, index) => (
                    <li key={index}><Typography variant="body2">{step}</Typography></li>
                  ))}
                </ol>
              </Paper>
            )}
          </Box>
          
          {/* Status and Controls */}
          <Grid container spacing={3}>
            {/* Main Control Panel */}
            <Grid item xs={12} md={4}>
              <Paper elevation={2} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Reactor Controls</Typography>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Control Rod Position: {state.controlRodPosition}% inserted</Typography>
                    <Tooltip title="Controls reactor power. Fully inserted (100%) = shutdown. Fully withdrawn (0%) = maximum reactivity.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={state.controlRodPosition}
                    onChange={handleControlRodChange}
                    min={0}
                    max={100}
                    step={1}
                    marks={[
                      { value: 0, label: '0%' },
                      { value: 50, label: '50%' },
                      { value: 100, label: '100%' }
                    ]}
                    disabled={state.scenarioComplete || state.scenarioFailed}
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Reactor Power: {state.reactorPower.toFixed(1)}%</Typography>
                    <Tooltip title="Current reactor power as percentage of rated thermal power.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <LinearProgress 
                      variant="determinate" 
                      value={state.reactorPower} 
                      sx={{ 
                        flexGrow: 1, 
                        height: 10, 
                        borderRadius: 1,
                        backgroundColor: 'grey.300',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: state.reactorPower > 90 ? 'success.main' : 
                                          state.reactorPower > 50 ? 'warning.main' : 
                                          'primary.main'
                        }
                      }} 
                    />
                    <Typography variant="body2" sx={{ ml: 1, minWidth: 50 }}>
                      {state.reactorPower.toFixed(1)}%
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Primary Coolant Parameters</Typography>
                    <Tooltip title="Temperature and pressure in the primary coolant circuit.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Temperature:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{state.primaryTemp.toFixed(1)} °C</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Pressure:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{state.primaryPressure.toFixed(2)} MPa</Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Secondary Circuit Parameters</Typography>
                    <Tooltip title="Steam parameters in the secondary circuit.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Steam Pressure:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{state.secondaryPressure.toFixed(2)} MPa</Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">Turbine Speed:</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>{state.turbineRpm.toFixed(0)} RPM</Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Grid Connection</Typography>
                    <Tooltip title="Connect or disconnect generator from the power grid.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Button
                    variant={state.gridConnected ? "contained" : "outlined"}
                    color={state.gridConnected ? "success" : "primary"}
                    fullWidth
                    onClick={handleGridToggle}
                    disabled={state.scenarioComplete || state.scenarioFailed}
                    sx={{ mt: 1 }}
                  >
                    {state.gridConnected ? "Connected to Grid" : "Connect to Grid"}
                  </Button>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Automatic Control Systems</Typography>
                    <Tooltip title="Toggle between automatic and manual control for various plant systems.">
                      <IconButton size="small">
                        <InfoIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Grid container spacing={1} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                      <Button
                        variant={state.autoControlSystems.pressurizer ? "contained" : "outlined"}
                        color={state.autoControlSystems.pressurizer ? "success" : "info"}
                        size="small"
                        fullWidth
                        onClick={() => handleAutoControlToggle('pressurizer')}
                        disabled={state.scenarioComplete || state.scenarioFailed}
                      >
                        Pressurizer: {state.autoControlSystems.pressurizer ? "AUTO" : "MANUAL"}
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant={state.autoControlSystems.feedwater ? "contained" : "outlined"}
                        color={state.autoControlSystems.feedwater ? "success" : "info"}
                        size="small"
                        fullWidth
                        onClick={() => handleAutoControlToggle('feedwater')}
                        disabled={state.scenarioComplete || state.scenarioFailed}
                      >
                        Feedwater: {state.autoControlSystems.feedwater ? "AUTO" : "MANUAL"}
                      </Button>
                    </Grid>
                    <Grid item xs={12}>
                      <Button
                        variant={state.autoControlSystems.turbineGovernor ? "contained" : "outlined"}
                        color={state.autoControlSystems.turbineGovernor ? "success" : "info"}
                        size="small"
                        fullWidth
                        onClick={() => handleAutoControlToggle('turbineGovernor')}
                        disabled={state.scenarioComplete || state.scenarioFailed}
                      >
                        Turbine Governor: {state.autoControlSystems.turbineGovernor ? "AUTO" : "MANUAL"}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Paper>
            </Grid>
            
            {/* Charts and Displays */}
            <Grid item xs={12} md={8}>
              <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Reactor Parameters</Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                      Time: {formatTime(state.time)}
                    </Typography>
                    
                    <FormControl size="small" sx={{ minWidth: 100, mr: 1 }}>
                      <Select
                        value={state.timeMultiplier}
                        onChange={handleSpeedChange}
                        displayEmpty
                        disabled={isRunning}
                      >
                        <MenuItem value={0.5}>0.5x</MenuItem>
                        <MenuItem value={1}>1.0x</MenuItem>
                        <MenuItem value={2}>2.0x</MenuItem>
                        <MenuItem value={5}>5.0x</MenuItem>
                        <MenuItem value={10}>10.0x</MenuItem>
                      </Select>
                    </FormControl>
                    
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
                
                {/* Charts */}
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 200, mb: 2 }}>
                      {state.powerHistory.length > 0 ? (
                        <Line
                          ref={powerChartRef}
                          data={powerChartData}
                          options={{
                            ...chartOptions,
                            scales: {
                              ...chartOptions.scales,
                              y: {
                                ...chartOptions.scales.y,
                                title: {
                                  display: true,
                                  text: 'Power (%)'
                                },
                                min: 0,
                                max: 105
                              }
                            }
                          }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography color="text.secondary">
                            Run the simulation to see reactor power data
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Box sx={{ height: 200, mb: 2 }}>
                      {state.tempHistory.length > 0 ? (
                        <Line
                          ref={temperatureChartRef}
                          data={temperatureChartData}
                          options={{
                            ...chartOptions,
                            scales: {
                              ...chartOptions.scales,
                              y: {
                                ...chartOptions.scales.y,
                                title: {
                                  display: true,
                                  text: 'Temperature (°C)'
                                },
                                min: Math.floor(SAFETY_LIMITS.minPrimaryTemp / 10) * 10,
                                max: Math.ceil(SAFETY_LIMITS.maxPrimaryTemp / 10) * 10
                              }
                            }
                          }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography color="text.secondary">
                            Run the simulation to see temperature data
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ height: 200 }}>
                      {state.pressureHistory.length > 0 ? (
                        <Line
                          ref={pressureChartRef}
                          data={pressureChartData}
                          options={{
                            ...chartOptions,
                            scales: {
                              ...chartOptions.scales,
                              y: {
                                ...chartOptions.scales.y,
                                title: {
                                  display: true,
                                  text: 'Pressure (MPa)'
                                },
                                min: Math.floor(SAFETY_LIMITS.minPrimaryPressure),
                                max: Math.ceil(SAFETY_LIMITS.maxPrimaryPressure)
                              }
                            }
                          }}
                        />
                      ) : (
                        <Box sx={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center' }}>
                          <Typography color="text.secondary">
                            Run the simulation to see pressure data
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                </Grid>
                
                {/* Alarms and Notifications */}
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    <Badge badgeContent={state.alarms.length} color="error" sx={{ mr: 1 }}>
                      <NotificationsIcon color={state.alarms.length > 0 ? "error" : "action"} />
                    </Badge>
                    Alarms and Notifications
                  </Typography>
                  
                  <Box sx={{ maxHeight: 150, overflowY: 'auto', p: 1, bgcolor: 'background.default', borderRadius: 1 }}>
                    {state.alarms.length > 0 ? (
                      state.alarms.map((alarm, index) => (
                        <Alert 
                          key={index} 
                          severity="error" 
                          icon={<ErrorIcon />} 
                          sx={{ mb: 1 }}
                        >
                          {alarm}
                        </Alert>
                      ))
                    ) : (
                      <Alert severity="success" sx={{ mb: 1 }}>No active alarms</Alert>
                    )}
                    
                    {state.notifications.slice(-3).reverse().map((notification, index) => (
                      <Alert 
                        key={index} 
                        severity={notification.type} 
                        sx={{ mb: 1 }}
                      >
                        {notification.message} ({formatTime(notification.time)})
                      </Alert>
                    ))}
                  </Box>
                </Box>
                
                {/* Scenario Status */}
                {state.activeScenario && (state.scenarioComplete || state.scenarioFailed) && (
                  <Box sx={{ mt: 3 }}>
                    <Alert
                      severity={state.scenarioComplete ? "success" : "error"}
                      variant="filled"
                    >
                      {state.scenarioComplete 
                        ? `Scenario completed successfully!` 
                        : `Scenario failed: ${state.failureReason}`}
                    </Alert>
                  </Box>
                )}
              </Paper>
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
    </Box>
  );
}

export default VVER1000ControlRoom;