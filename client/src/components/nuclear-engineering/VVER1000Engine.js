// VVER1000Engine.js - Core simulation engine for the VVER-1000 reactor
import { VVER1000, SAFETY_LIMITS, SCRAM_CONDITIONS, SIMULATION_MODES } from './VVER1000Constants';

/**
 * VVER-1000 Nuclear Reactor Simulation Engine
 * Handles physics calculations, state management, and real-time updates
 */
class VVER1000Engine {
  constructor(initialState, onUpdate) {
    this.state = { ...initialState };
    this.onUpdate = onUpdate;
    this.lastTime = performance.now();
    this.animationFrameId = null;
    this.isRunning = false;
    this.plannedEvents = [];
    this.eventListeners = {};
    this.simulationMode = SIMULATION_MODES.TRAINING.id;
    this.dataCollectionInterval = null;
  }

  // Set simulation mode
  setSimulationMode(mode) {
    this.simulationMode = mode;
    const modeConfig = SIMULATION_MODES[mode.toUpperCase()];
    
    // Update time multiplier
    this.state.timeMultiplier = modeConfig.features.timeScale;
    
    // Handle data collection
    if (modeConfig.features.dataCollection) {
      this.startDataCollection();
    } else {
      this.stopDataCollection();
    }
    
    // Reset state if needed
    if (modeConfig.features.simplifiedPhysics) {
      this.simplifyPhysicsModel();
    } else {
      this.restoreFullPhysicsModel();
    }
  }

  // Start data collection for research mode
  startDataCollection() {
    if (this.dataCollectionInterval) return;
    
    this.state.dataCollection.enabled = true;
    this.state.dataCollection.parameters = [
      'reactorPower',
      'primaryPressure',
      'primaryTemp',
      'controlRodPosition',
      'xenonLevel',
      'powerRateOfChange'
    ];
    
    this.dataCollectionInterval = setInterval(() => {
      const dataPoint = {
        timestamp: this.state.time,
        values: {}
      };
      
      this.state.dataCollection.parameters.forEach(param => {
        dataPoint.values[param] = this.state[param];
      });
      
      this.state.dataCollection.dataPoints.push(dataPoint);
      
      // Keep only last 1000 data points
      if (this.state.dataCollection.dataPoints.length > 1000) {
        this.state.dataCollection.dataPoints.shift();
      }
    }, this.state.dataCollection.samplingRate * 1000);
  }

  // Stop data collection
  stopDataCollection() {
    if (this.dataCollectionInterval) {
      clearInterval(this.dataCollectionInterval);
      this.dataCollectionInterval = null;
    }
    this.state.dataCollection.enabled = false;
    this.state.dataCollection.dataPoints = [];
  }

  // Simplify physics model for educational mode
  simplifyPhysicsModel() {
    // Store original state for restoration
    this.originalState = { ...this.state };
    
    // Simplify core parameters
    this.state.coreParameters = {
      powerDistribution: Array(163).fill(this.state.reactorPower / 100),
      burnupDistribution: Array(163).fill(0),
      temperatureDistribution: Array(163).fill(this.state.primaryTemp),
      neutronFlux: Array(163).fill(this.state.reactorPower / 100)
    };
    
    // Simplify primary circuit
    this.state.primaryCircuit = {
      loopTemperatures: Array(4).fill(this.state.primaryTemp),
      loopFlowRates: Array(4).fill(this.state.coolantFlowRate / 4),
      pressurizerLevel: 50,
      pressurizerTemperature: this.state.primaryTemp + 75
    };
    
    // Simplify secondary circuit
    this.state.secondaryCircuit = {
      steamGeneratorLevels: Array(4).fill(50),
      feedwaterFlow: this.state.reactorPower * 17,
      steamFlow: this.state.reactorPower * 17,
      condenserVacuum: 0.005
    };
  }

  // Restore full physics model
  restoreFullPhysicsModel() {
    if (this.originalState) {
      this.state = { ...this.originalState };
      this.originalState = null;
    }
  }

  // Enhanced update method with mode-specific behavior
  update(deltaTime) {
    const modeConfig = SIMULATION_MODES[this.simulationMode.toUpperCase()];
    
    // Apply time scaling
    const scaledDeltaTime = deltaTime * this.state.timeMultiplier;
    
    // Update reactor power based on mode
    if (modeConfig.features.simplifiedPhysics) {
      this.updateReactorPowerSimple(scaledDeltaTime);
    } else {
      this.updateReactorPowerDetailed(scaledDeltaTime);
    }
    
    // Update other parameters
    this.updatePrimaryCircuit(scaledDeltaTime);
    this.updateSecondaryCircuit(scaledDeltaTime);
    this.updateSafetySystems(scaledDeltaTime);
    
    // Check for alarms and SCRAM conditions
    if (modeConfig.features.safetyChecks) {
      this.checkSafetyConditions();
    }
    
    // Update time
    this.state.time += scaledDeltaTime;
    
    // Emit update event
    this.onUpdate(this.state);
  }

  // Simple power update for educational mode
  updateReactorPowerSimple(deltaTime) {
    // Use same non-linear response as detailed mode for consistency
    const rodReactivity = -0.15 * Math.pow(this.state.controlRodPosition, 1.2);
    const targetPower = 100 * (1 - rodReactivity);
    const powerChange = (targetPower - this.state.reactorPower) * (deltaTime / 20);
    this.state.reactorPower += powerChange;
    this.state.reactorPower = Math.max(0, Math.min(100, this.state.reactorPower));
  }

  // Detailed power update for advanced modes
  updateReactorPowerDetailed(deltaTime) {
    // Calculate reactivity based on control rod position with non-linear response
    const rodReactivity = -0.15 * Math.pow(this.state.controlRodPosition, 1.2);
    
    // Calculate temperature feedback with reduced coefficient
    const tempFeedback = -0.00005 * (this.state.primaryTemp - 290);
    
    // Calculate xenon feedback with reduced coefficient
    const xenonFeedback = -0.0001 * this.state.xenonLevel;
    
    // Calculate total reactivity
    const totalReactivity = rodReactivity + tempFeedback + xenonFeedback;
    
    // Calculate power change with improved response
    const powerChange = totalReactivity * this.state.reactorPower * deltaTime;
    
    // Update power
    this.state.reactorPower += powerChange;
    this.state.reactorPower = Math.max(0, Math.min(100, this.state.reactorPower));
    
    // Update xenon level
    this.updateXenonLevel(deltaTime);
    
    // Update power distribution
    this.updatePowerDistribution();
  }

  // Update xenon level
  updateXenonLevel(deltaTime) {
    const xenonProduction = 0.1 * this.state.reactorPower;
    const xenonDecay = 0.05 * this.state.xenonLevel;
    this.state.xenonLevel += (xenonProduction - xenonDecay) * deltaTime;
    this.state.xenonLevel = Math.max(0, this.state.xenonLevel);
  }

  // Update power distribution in core
  updatePowerDistribution() {
    const basePower = this.state.reactorPower / 100;
    
    // Calculate power distribution based on control rod position and xenon
    for (let i = 0; i < 163; i++) {
      const distanceFromCenter = Math.sqrt(
        Math.pow(Math.floor(i / 13) - 6, 2) + 
        Math.pow((i % 13) - 6, 2)
      );
      
      // Power is higher in center and decreases with distance
      const radialFactor = 1 - 0.03 * distanceFromCenter;
      
      // Control rod effect
      const rodFactor = 1 - 0.5 * (this.state.controlRodPosition / 100);
      
      // Xenon effect
      const xenonFactor = 1 - 0.2 * (this.state.xenonLevel / 100);
      
      this.state.coreParameters.powerDistribution[i] = basePower * radialFactor * rodFactor * xenonFactor;
    }
  }

  // Start the simulation loop
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.lastTime = performance.now();
    this.animationFrameId = requestAnimationFrame(this.updateLoop.bind(this));
    this.emit('start', { time: this.state.time });
  }

  // Stop the simulation loop
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    this.emit('stop', { time: this.state.time });
  }

  // Reset the simulation to initial state
  reset(initialState) {
    this.stop();
    this.state = { ...initialState };
    this.plannedEvents = initialState.activeScenario?.plannedEvents?.map(event => ({
      ...event,
      executed: false
    })) || [];
    
    // Initialize empty history arrays if they don't exist
    if (!this.state.powerHistory) this.state.powerHistory = [];
    if (!this.state.tempHistory) this.state.tempHistory = [];
    if (!this.state.pressureHistory) this.state.pressureHistory = [];
    
    this.onUpdate(this.state);
    this.emit('reset', { time: this.state.time });
  }

  // Main update loop - called on each animation frame
  updateLoop() {
    if (!this.isRunning) return;
    
    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000; // Convert to seconds
    this.lastTime = currentTime;
    
    // Update the simulation state
    this.update(deltaTime * this.state.timeMultiplier);
    
    // Call onUpdate with the new state
    this.onUpdate(this.state);
    
    // Continue the loop
    this.animationFrameId = requestAnimationFrame(this.updateLoop.bind(this));
  }

  // Check for planned scenario events
  checkPlannedEvents(newState, deltaTime) {
    if (!this.plannedEvents || this.plannedEvents.length === 0) return;
    
    for (const event of this.plannedEvents) {
      if (!event.executed && newState.time >= event.time) {
        // Execute the event effect
        const result = event.effect(newState);
        if (result) {
          Object.assign(newState, result);
        }
        
        // Mark as executed
        event.executed = true;
        
        // Emit event
        this.emit('scenarioEvent', {
          eventName: event.name || 'Unnamed event',
          time: newState.time,
          message: event.message
        });
      }
    }
  }

  // Update primary coolant temperature based on power
  updatePrimaryTemperature(newState, deltaTime) {
    // Calculate temperature based on power and flow rate
    const nominalDeltaT = VVER1000.coreOutletTemp - VVER1000.coreInletTemp;
    const actualDeltaT = nominalDeltaT * (newState.reactorPower / 100) * (VVER1000.coolantFlowRate / newState.coolantFlowRate);
    
    // Add realistic thermal inertia
    const targetTemp = VVER1000.coreInletTemp + actualDeltaT * (newState.reactorPower / 100);
    const tempTimeConstant = 30; // seconds for temperature changes to take effect
    const tempChange = (targetTemp - newState.primaryTemp) * (deltaTime / tempTimeConstant);
    
    newState.primaryTemp += tempChange;
  }

  // Update primary pressure response
  updatePrimaryPressure(newState, deltaTime) {
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
      
      // Add some realistic variation
      if (Math.random() < 0.05) {
        newState.primaryPressure += (Math.random() - 0.5) * 0.01;
      }
    }
  }

  // Update secondary pressure based on turbine load
  updateSecondaryPressure(newState, deltaTime) {
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
      
      // Add some realistic variation
      if (Math.random() < 0.05) {
        newState.secondaryPressure += (Math.random() - 0.5) * 0.02;
      }
    }
  }

  // Update turbine response
  updateTurbine(newState, deltaTime) {
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
      
      // Add some realistic variation
      if (Math.random() < 0.05) {
        newState.turbineRpm += (Math.random() - 0.5) * 5;
      }
    }
  }

  // Update xenon transient behavior
  updateXenonEffects(newState, deltaTime) {
    if (newState.xenonLevel > 0) {
      // Xenon burnout rate depends on power level
      const xenonBurnoutRate = (newState.reactorPower / 100) * 2; // % per minute
      newState.xenonLevel -= xenonBurnoutRate * (deltaTime / 60);
      newState.xenonLevel = Math.max(0, newState.xenonLevel);
    } else if (newState.reactorPower > 50 && Math.random() < 0.001 * deltaTime) {
      // Small chance of xenon oscillation starting at high power
      newState.xenonLevel = 5;
      this.addNotification(newState, 'warning', 'Xenon oscillation detected');
    }
  }

  // Record history data for trending charts
  recordHistoryData(newState, deltaTime) {
    // Only record every few seconds to avoid overwhelming memory
    if (newState.time % 5 < deltaTime) {
      // Record power history
      newState.powerHistory.push({
        time: newState.time,
        value: newState.reactorPower
      });
      
      // Record temperature history
      newState.tempHistory.push({
        time: newState.time,
        value: newState.primaryTemp
      });
      
      // Record pressure history
      newState.pressureHistory.push({
        time: newState.time,
        value: newState.primaryPressure
      });
      
      // Limit history length to avoid memory issues
      if (newState.powerHistory.length > 100) {
        newState.powerHistory.shift();
        newState.tempHistory.shift();
        newState.pressureHistory.shift();
      }
    }
  }

  // Check for alarm conditions
  checkAlarmConditions(newState) {
    const currentAlarms = [...newState.alarms];
    
    // Check primary pressure
    this.checkAlarm(
      newState,
      currentAlarms,
      newState.primaryPressure > SAFETY_LIMITS.maxPrimaryPressure * 0.95,
      'High Primary Pressure Warning'
    );
    
    // Check primary temperature
    this.checkAlarm(
      newState,
      currentAlarms,
      newState.primaryTemp > SAFETY_LIMITS.maxPrimaryTemp * 0.95,
      'High Primary Temperature Warning'
    );
    
    // Check turbine rpm
    this.checkAlarm(
      newState,
      currentAlarms,
      newState.turbineRpm > SAFETY_LIMITS.maxTurbineRpm * 0.95,
      'Turbine Overspeed Warning'
    );
    
    // Check power rate of change
    this.checkAlarm(
      newState,
      currentAlarms,
      Math.abs(newState.powerRateOfChange) > SAFETY_LIMITS.maxPowerRate * 0.9,
      'Excessive Power Rate of Change'
    );
    
    // Update alarms
    newState.alarms = currentAlarms;
  }

  // Helper method to check and manage alarms
  checkAlarm(newState, currentAlarms, condition, alarmMessage) {
    // Check if the condition is true and alarm isn't already active
    if (condition && !currentAlarms.includes(alarmMessage)) {
      // Add the alarm
      currentAlarms.push(alarmMessage);
      
      // Add notification
      this.addNotification(newState, 'warning', alarmMessage);
      
      // Emit alarm event
      this.emit('alarm', { 
        type: 'warning',
        message: alarmMessage,
        time: newState.time
      });
    } 
    // Check if the condition is false but alarm is active
    else if (!condition && currentAlarms.includes(alarmMessage)) {
      // Remove the alarm
      const index = currentAlarms.indexOf(alarmMessage);
      if (index !== -1) {
        currentAlarms.splice(index, 1);
      }
      
      // Add notification for cleared alarm
      this.addNotification(newState, 'info', `${alarmMessage} - Cleared`);
    }
  }

  // Check for SCRAM conditions
  checkScramConditions(newState) {
    for (const condition of SCRAM_CONDITIONS) {
      if (condition.condition(newState[condition.parameter])) {
        this.emit('scram', {
          reason: condition.message,
          parameter: condition.parameter,
          value: newState[condition.parameter],
          time: newState.time
        });
        return true;
      }
    }
    return false;
  }

  // Trigger a reactor SCRAM
  triggerScram(newState) {
    // Shut down reactor
    newState.reactorPower = 0;
    newState.controlRodPosition = 100; // Fully inserted
    newState.turbineRpm = newState.turbineRpm * 0.9; // Begin slowing
    newState.gridConnected = false;
    
    // Add notification
    this.addNotification(newState, 'error', 'REACTOR SCRAM');
    
    // Check if we're in a scenario
    if (newState.activeScenario) {
      newState.scenarioFailed = true;
      newState.failureReason = 'Reactor SCRAM triggered';
      this.stop();
    }
  }

  // Check for scenario completion
  checkScenarioCompletion(newState) {
    if (!newState.activeScenario || newState.scenarioComplete || newState.scenarioFailed) {
      return;
    }
    
    const scenario = newState.activeScenario;
    
    // Different completion criteria for each scenario
    switch (scenario.id) {
      case 'startup':
        if (newState.reactorPower >= 95 && newState.gridConnected) {
          this.completeScenario(newState, 'Startup scenario completed successfully!');
        }
        break;
        
      case 'powerReduction':
        if (Math.abs(newState.reactorPower - 50) < 2) {
          // Within 2% of target power
          this.completeScenario(newState, 'Power reduction completed successfully!');
        }
        break;
        
      case 'pumpFailure':
        // Check if we've stabilized at reduced power
        if (newState.coolantFlowRate < 70000 && 
            Math.abs(newState.reactorPower - 75) < 5 && 
            newState.time > 300) { // Give some time to stabilize
          
          this.completeScenario(newState, 'Pump failure handled successfully!');
        }
        break;
        
      case 'loadRejection':
        // Check if we've stabilized at house load
        if (!newState.gridConnected && 
            newState.reactorPower >= 5 && 
            newState.reactorPower <= 15 && 
            Math.abs(newState.turbineRpm - 3000) < 100 &&
            newState.time > 300) { // Give some time to stabilize
          
          this.completeScenario(newState, 'Load rejection handled successfully!');
        }
        break;
        
      case 'xenonTransient':
        // Check if we've reached target power with xenon
        if (newState.reactorPower >= 45 && 
            newState.reactorPower <= 55 && 
            newState.time > 300) { // Give some time to stabilize
          
          this.completeScenario(newState, 'Xenon transient handled successfully!');
        }
        break;
      
      default:
        break;
    }
  }

  // Complete the current scenario
  completeScenario(newState, message) {
    newState.scenarioComplete = true;
    this.addNotification(newState, 'success', message);
    this.emit('scenarioComplete', {
      scenarioId: newState.activeScenario.id,
      time: newState.time,
      message
    });
    this.stop();
  }

  // Add a notification to the state
  addNotification(newState, type, message) {
    newState.notifications.push({
      type,
      message,
      time: newState.time
    });
    
    // Limit notifications to avoid memory issues
    if (newState.notifications.length > 50) {
      newState.notifications.shift();
    }
  }

  // Simulation control methods
  setControlRodPosition(position) {
    const newPosition = Math.max(0, Math.min(100, position));
    this.state.controlRodPosition = newPosition;
    this.emit('controlAction', { type: 'controlRods', value: newPosition });
    return newPosition;
  }

  setTimeMultiplier(multiplier) {
    this.state.timeMultiplier = multiplier;
    this.emit('timeMultiplierChanged', { value: multiplier });
    return multiplier;
  }

  toggleGridConnection() {
    // Cannot connect to grid if turbine rpm is too far from nominal
    if (!this.state.gridConnected && Math.abs(this.state.turbineRpm - VVER1000.turbineRpm) > 50) {
      this.addNotification(this.state, 'error', 'Cannot connect to grid: Turbine speed not synchronized');
      this.emit('gridConnectionFailed', { reason: 'Turbine speed not synchronized' });
      return false;
    }
    
    // Toggle grid connection
    this.state.gridConnected = !this.state.gridConnected;
    
    this.emit('gridConnectionChanged', { 
      connected: this.state.gridConnected,
      time: this.state.time
    });
    
    return this.state.gridConnected;
  }

  toggleAutoControlSystem(system) {
    if (!this.state.autoControlSystems.hasOwnProperty(system)) {
      return false;
    }
    
    this.state.autoControlSystems[system] = !this.state.autoControlSystems[system];
    
    this.emit('autoControlChanged', {
      system,
      enabled: this.state.autoControlSystems[system]
    });
    
    return this.state.autoControlSystems[system];
  }

  loadScenario(scenario) {
    if (!scenario) return false;
    
    // Stop any current simulation
    this.stop();
    
    // Merge initialState with scenario.initialState to ensure all properties are present
    this.reset({ ...require('./VVER1000Constants').initialState, ...scenario.initialState });
    
    // Set the active scenario
    this.state.activeScenario = scenario;
    
    // Set planned events from scenario
    this.plannedEvents = scenario.plannedEvents?.map(event => ({
      ...event,
      executed: false
    })) || [];
    
    // Initialize history arrays
    this.state.powerHistory = [];
    this.state.tempHistory = [];
    this.state.pressureHistory = [];
    
    // Reset scenario status
    this.state.scenarioComplete = false;
    this.state.scenarioFailed = false;
    this.state.failureReason = '';
    
    // Add initial notification
    this.addNotification(this.state, 'info', `Scenario loaded: ${scenario.name}`);
    
    // Emit event
    this.emit('scenarioLoaded', {
      scenarioId: scenario.id,
      name: scenario.name,
      difficulty: scenario.difficulty
    });
    
    // Update state
    this.onUpdate(this.state);
    
    return true;
  }

  // Event system for communicating with React components
  on(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
    
    return () => {
      this.eventListeners[event] = this.eventListeners[event].filter(cb => cb !== callback);
    };
  }

  emit(event, data) {
    if (!this.eventListeners[event]) return;
    
    for (const callback of this.eventListeners[event]) {
      callback(data);
    }
  }

  // Clean up resources
  cleanup() {
    this.stop();
    this.eventListeners = {};
  }
}

export default VVER1000Engine;