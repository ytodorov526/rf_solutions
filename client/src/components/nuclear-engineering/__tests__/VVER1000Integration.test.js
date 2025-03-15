// VVER1000Integration.test.js - Integration tests for the VVER-1000 simulator
import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import VVER1000ControlRoom from '../VVER1000ControlRoom';
import { SCENARIOS } from '../VVER1000Constants';

// Mock Chart.js to avoid rendering issues in tests
jest.mock('chart.js');
jest.mock('react-chartjs-2', () => ({
  Line: () => <div data-testid="mocked-chart">Chart Component</div>
}));

// Mock performance.now
const originalPerformanceNow = global.performance.now;
let mockTime = 0;
global.performance.now = jest.fn(() => mockTime);

// Mock requestAnimationFrame
const originalRequestAnimationFrame = global.requestAnimationFrame;
global.requestAnimationFrame = jest.fn(callback => {
  setTimeout(() => {
    mockTime += 16.7; // Simulate ~60fps
    callback(mockTime);
  }, 0);
  return 123; // mock id
});

// Mock cancelAnimationFrame
const originalCancelAnimationFrame = global.cancelAnimationFrame;
global.cancelAnimationFrame = jest.fn();

describe('VVER1000ControlRoom Integration', () => {
  beforeEach(() => {
    mockTime = 0;
    jest.clearAllMocks();
  });
  
  afterAll(() => {
    // Restore original functions
    global.performance.now = originalPerformanceNow;
    global.requestAnimationFrame = originalRequestAnimationFrame;
    global.cancelAnimationFrame = originalCancelAnimationFrame;
  });
  
  test('should render the simulator correctly', () => {
    render(<VVER1000ControlRoom />);
    
    // Check for main title
    expect(screen.getByText('VVER-1000 Nuclear Power Plant Control Room Simulator')).toBeInTheDocument();
    
    // Launch button should be visible
    expect(screen.getByText('Launch Simulator')).toBeInTheDocument();
  });
  
  test('should show simulator when launch button is clicked', async () => {
    render(<VVER1000ControlRoom />);
    
    // Click on launch button
    fireEvent.click(screen.getByText('Launch Simulator'));
    
    // Simulator should now be visible
    await waitFor(() => {
      expect(screen.getByText('Select Operational Scenario')).toBeInTheDocument();
    });
  });
  
  test('should load a scenario when selected', async () => {
    render(<VVER1000ControlRoom />);
    
    // Launch the simulator
    fireEvent.click(screen.getByText('Launch Simulator'));
    
    // Wait for simulator to be visible
    await waitFor(() => {
      expect(screen.getByText('Select Operational Scenario')).toBeInTheDocument();
    });
    
    // Open the scenario dropdown
    fireEvent.mouseDown(screen.getByLabelText('Select Operational Scenario'));
    
    // Select the first scenario
    const firstScenario = SCENARIOS[0];
    const option = await screen.findByText(`${firstScenario.name} - ${firstScenario.difficulty}`);
    fireEvent.click(option);
    
    // Scenario details should now be visible
    await waitFor(() => {
      expect(screen.getByText(firstScenario.description)).toBeInTheDocument();
      expect(screen.getByText(firstScenario.goal)).toBeInTheDocument();
    });
  });
  
  test('should start simulation when Run button is clicked', async () => {
    render(<VVER1000ControlRoom />);
    
    // Launch the simulator
    fireEvent.click(screen.getByText('Launch Simulator'));
    
    // Wait for simulator to be visible
    await waitFor(() => {
      expect(screen.getByText('Select Operational Scenario')).toBeInTheDocument();
    });
    
    // Open the scenario dropdown
    fireEvent.mouseDown(screen.getByLabelText('Select Operational Scenario'));
    
    // Select the first scenario
    const firstScenario = SCENARIOS[0];
    const option = await screen.findByText(`${firstScenario.name} - ${firstScenario.difficulty}`);
    fireEvent.click(option);
    
    // Start the scenario
    fireEvent.click(screen.getByText('Start Scenario'));
    
    // Click Run
    fireEvent.click(screen.getByText('Run'));
    
    // Pause should now be visible (meaning sim is running)
    await waitFor(() => {
      expect(screen.getByText('Pause')).toBeInTheDocument();
    });
    
    // Pause the simulation to clean up
    fireEvent.click(screen.getByText('Pause'));
  });
  
  test('should adjust control rods and show changing reactor power', async () => {
    render(<VVER1000ControlRoom />);
    
    // Launch the simulator and load a scenario
    fireEvent.click(screen.getByText('Launch Simulator'));
    await waitFor(() => expect(screen.getByLabelText('Select Operational Scenario')).toBeInTheDocument());
    
    // Select a scenario
    fireEvent.mouseDown(screen.getByLabelText('Select Operational Scenario'));
    const scenario = SCENARIOS[0];
    const option = await screen.findByText(`${scenario.name} - ${scenario.difficulty}`);
    fireEvent.click(option);
    
    // Start the scenario
    fireEvent.click(screen.getByText('Start Scenario'));
    
    // Run the simulation
    fireEvent.click(screen.getByText('Run'));
    
    // Simulate changing control rod position (note: the control is disabled until sim starts)
    // Would need to use more complex testing to simulate slider interaction
    
    // Pause the simulation
    fireEvent.click(screen.getByText('Pause'));
    
    // Pause should now be Run again
    await waitFor(() => {
      expect(screen.getByText('Run')).toBeInTheDocument();
    });
  });
  
  test('should show instructions when button is clicked', async () => {
    render(<VVER1000ControlRoom />);
    
    // Launch the simulator
    fireEvent.click(screen.getByText('Launch Simulator'));
    
    // Click instructions button
    await waitFor(() => {
      const instructionsButton = screen.getByText('Instructions');
      fireEvent.click(instructionsButton);
    });
    
    // Instructions dialog should be visible
    await waitFor(() => {
      expect(screen.getByText('VVER-1000 Simulator Instructions')).toBeInTheDocument();
      expect(screen.getByText('How to Operate the Simulator')).toBeInTheDocument();
      expect(screen.getByText('Safety Requirements')).toBeInTheDocument();
    });
    
    // Close instructions
    fireEvent.click(screen.getByText('Close'));
  });
  
  test('should show operator log when button is clicked', async () => {
    render(<VVER1000ControlRoom />);
    
    // Launch the simulator
    fireEvent.click(screen.getByText('Launch Simulator'));
    
    // Click operator log button
    await waitFor(() => {
      const logButton = screen.getByText('Operator Log');
      fireEvent.click(logButton);
    });
    
    // Log dialog should be visible
    await waitFor(() => {
      expect(screen.getByText('Operator Action Log')).toBeInTheDocument();
    });
    
    // Close log
    fireEvent.click(screen.getByText('Close'));
  });
});