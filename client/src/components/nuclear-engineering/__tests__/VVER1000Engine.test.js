// VVER1000Engine.test.js - Unit tests for the VVER-1000 simulation engine
import VVER1000Engine from '../VVER1000Engine';
import { initialState, SCENARIOS } from '../VVER1000Constants';

describe('VVER1000Engine', () => {
  let engine;
  let updateCallback;
  
  beforeEach(() => {
    // Mock the performance.now function
    global.performance = {
      now: jest.fn().mockReturnValue(0)
    };
    
    // Mock requestAnimationFrame
    global.requestAnimationFrame = jest.fn(callback => {
      setTimeout(callback, 0);
      return 1; // Return a mock animation frame ID
    });
    
    // Mock cancelAnimationFrame
    global.cancelAnimationFrame = jest.fn();
    
    // Create mock update callback
    updateCallback = jest.fn();
    
    // Create a new engine instance for each test
    engine = new VVER1000Engine({...initialState}, updateCallback);
  });
  
  afterEach(() => {
    // Clean up
    engine.cleanup();
    jest.clearAllMocks();
  });
  
  test('should initialize with the provided state', () => {
    // Check that the engine was initialized with the correct state
    expect(engine.state).toEqual(initialState);
  });
  
  test('should start and stop the simulation', () => {
    // Start the simulation
    engine.start();
    expect(engine.isRunning).toBe(true);
    expect(global.requestAnimationFrame).toHaveBeenCalled();
    
    // Stop the simulation
    engine.stop();
    expect(engine.isRunning).toBe(false);
    expect(global.cancelAnimationFrame).toHaveBeenCalled();
  });
  
  test('should reset the simulation state', () => {
    // Modify the state
    engine.state.reactorPower = 50;
    engine.state.controlRodPosition = 25;
    
    // Reset the state
    engine.reset(initialState);
    
    // Check that the state was reset
    expect(engine.state).toEqual(initialState);
    expect(updateCallback).toHaveBeenCalledWith(initialState);
  });
  
  test('should load a scenario correctly', () => {
    // Get a test scenario
    const testScenario = SCENARIOS[0];
    
    // Load the scenario
    engine.loadScenario(testScenario);
    
    // Check that the scenario was loaded
    expect(engine.state.activeScenario).toEqual(testScenario);
    expect(engine.state.powerHistory).toEqual([]);
    expect(engine.state.tempHistory).toEqual([]);
    expect(engine.state.pressureHistory).toEqual([]);
    expect(engine.state.scenarioComplete).toBe(false);
    expect(engine.state.scenarioFailed).toBe(false);
  });
  
  test('should update reactor power based on control rod position', () => {
    // Create a test state
    const testState = {...initialState, controlRodPosition: 50};
    
    // Update reactor power
    engine.updateReactorPower(testState, 1);
    
    // Power should have changed based on rod position
    expect(testState.reactorPower).toBeGreaterThan(0);
  });
  
  test('should emit events correctly', () => {
    // Create mock event handlers
    const mockHandler1 = jest.fn();
    const mockHandler2 = jest.fn();
    
    // Register event handlers
    engine.on('testEvent', mockHandler1);
    engine.on('testEvent', mockHandler2);
    
    // Emit an event
    const testData = { foo: 'bar' };
    engine.emit('testEvent', testData);
    
    // Check that both handlers were called with the correct data
    expect(mockHandler1).toHaveBeenCalledWith(testData);
    expect(mockHandler2).toHaveBeenCalledWith(testData);
  });
  
  test('should handle control rod adjustments', () => {
    // Set control rod position
    const newPosition = 35;
    engine.setControlRodPosition(newPosition);
    
    // Check that the position was updated
    expect(engine.state.controlRodPosition).toBe(newPosition);
  });
  
  test('should adjust time multiplier', () => {
    // Set time multiplier
    const newMultiplier = 5;
    engine.setTimeMultiplier(newMultiplier);
    
    // Check that the multiplier was updated
    expect(engine.state.timeMultiplier).toBe(newMultiplier);
  });
  
  test('should toggle grid connection correctly', () => {
    // Set up state for successful connection
    engine.state.turbineRpm = 3000;
    
    // Toggle grid connection
    const result = engine.toggleGridConnection();
    
    // Check that grid connection was toggled
    expect(result).toBe(true);
    expect(engine.state.gridConnected).toBe(true);
    
    // Now set turbine RPM to a value that should prevent connection
    engine.state.gridConnected = false;
    engine.state.turbineRpm = 2000;
    
    // Try to connect
    const failResult = engine.toggleGridConnection();
    
    // Connection should have failed
    expect(failResult).toBe(false);
    expect(engine.state.gridConnected).toBe(false);
  });
  
  test('should toggle automatic control systems', () => {
    // Toggle pressurizer control
    engine.toggleAutoControlSystem('pressurizer');
    
    // Check that it was toggled
    expect(engine.state.autoControlSystems.pressurizer).toBe(false);
    
    // Toggle it back
    engine.toggleAutoControlSystem('pressurizer');
    
    // Check that it was toggled back
    expect(engine.state.autoControlSystems.pressurizer).toBe(true);
  });
  
  test('should check for SCRAM conditions', () => {
    // Create a test state with values that should trigger a SCRAM
    const testState = {
      ...initialState,
      primaryPressure: 18 // Above the safety limit
    };
    
    // Check SCRAM conditions
    const result = engine.checkScramConditions(testState);
    
    // Should return true because a SCRAM condition was met
    expect(result).toBe(true);
  });
  
  test('should trigger a SCRAM', () => {
    // Create a test state
    const testState = {...initialState, reactorPower: 100, controlRodPosition: 20};
    
    // Trigger SCRAM
    engine.triggerScram(testState);
    
    // Check that the reactor was shut down
    expect(testState.reactorPower).toBe(0);
    expect(testState.controlRodPosition).toBe(100);
    expect(testState.gridConnected).toBe(false);
  });
  
  test('should record history data', () => {
    // Create a test state
    const testState = {
      ...initialState,
      reactorPower: 50,
      primaryTemp: 300,
      primaryPressure: 15.5,
      powerHistory: [],
      tempHistory: [],
      pressureHistory: [],
      time: 5 // To pass the data recording condition
    };
    
    // Record history data
    engine.recordHistoryData(testState, 1);
    
    // Check that data was recorded
    expect(testState.powerHistory.length).toBe(1);
    expect(testState.tempHistory.length).toBe(1);
    expect(testState.pressureHistory.length).toBe(1);
    expect(testState.powerHistory[0].value).toBe(50);
    expect(testState.tempHistory[0].value).toBe(300);
    expect(testState.pressureHistory[0].value).toBe(15.5);
  });
});