# VVER-1000 Nuclear Power Plant Control Room Simulator

An interactive, real-time nuclear power plant simulator that allows users to operate a VVER-1000 pressurized water reactor. This is a sophisticated simulator that accurately models the physics and operational characteristics of a nuclear power plant.

## Features

- Real-time physics simulation of reactor core, primary and secondary coolant loops
- Interactive 3D visualization of the reactor core with control rod movement
- Multiple operational scenarios with increasing difficulty
- Interactive control panel for adjusting reactor parameters
- Live monitoring of key parameters through charts and gauges
- Alarms and safety systems that respond to unsafe conditions
- Detailed operator log to track all actions and events
- Comprehensive instructions and educational information about VVER-1000 reactors

## Architecture

The simulator is built using a modular architecture:

- **VVER1000ControlRoom.js** - Main component that integrates all other components
- **VVER1000Engine.js** - Core simulation engine that handles physics calculations and state updates
- **VVER1000Constants.js** - Configuration parameters for the reactor and scenarios
- **VVER1000ControlPanel.js** - User interface for controlling the reactor
- **VVER1000DisplayPanel.js** - Displays for monitoring reactor parameters
- **VVER1000ReactorCore3D.js** - Interactive 3D visualization of the reactor core
- **VVER1000DetailedComponents.js** - Interactive 3D visualization of detailed plant systems
- **VVER1000Scenarios.js** - Scenario selection and management
- **VVER1000Utils.js** - Helper functions for formatting, data preparation, etc.

## Simulation Engine

The simulation engine uses a realistic model of nuclear reactor physics, including:

- Control rod reactivity effects
- Temperature and pressure dynamics
- Xenon poisoning effects
- Turbine and electrical generation
- Safety systems and SCRAM conditions

The engine runs on a requestAnimationFrame loop, providing smooth real-time updates to the user interface.

## Operational Scenarios

The simulator includes several operational scenarios:

1. **Reactor Startup** - Starting the reactor from cold shutdown to full power
2. **Planned Power Reduction** - Reducing power from 100% to 50% for maintenance
3. **Main Coolant Pump Failure** - Handling the failure of a primary coolant pump
4. **Generator Load Rejection** - Managing a sudden disconnection from the electrical grid
5. **Xenon Transient** - Restarting the reactor while dealing with xenon poisoning

Each scenario has specific goals and challenges, requiring different operational strategies.

## Testing

The simulator includes comprehensive unit and integration tests:

- **VVER1000Engine.test.js** - Tests for the simulation engine
- **VVER1000Utils.test.js** - Tests for utility functions
- **VVER1000Integration.test.js** - Integration tests for the complete simulator

## Usage

The simulator is designed to be educational and entertaining. Users can:

1. Select an operational scenario
2. Start the simulation
3. Adjust control rod position to control reactor power
4. Monitor key parameters like temperature, pressure, and power
5. Connect to the electrical grid when conditions are right
6. Toggle automatic control systems
7. Respond to events and alarms
8. Complete scenario objectives successfully

## Development

To extend or modify the simulator:

1. **Adding new scenarios** - Add entries to the SCENARIOS array in VVER1000Constants.js
2. **Modifying reactor parameters** - Update the VVER1000 and SAFETY_LIMITS objects in VVER1000Constants.js
3. **Enhancing the physics model** - Modify the update methods in VVER1000Engine.js
4. **UI improvements** - Update the relevant component files

## 3D Visualization

The simulator includes multiple interactive 3D visualizations, built with:

- **Three.js** - A JavaScript 3D library
- **React Three Fiber** - React renderer for Three.js
- **React Three Drei** - Useful helpers for React Three Fiber

### Reactor Core Visualization

The 3D reactor core visualization includes:

- Hexagonal fuel assembly layout matching the VVER-1000 design
- Control rod visualization showing insertion level
- Color-coded heat mapping based on reactor power
- Coolant flow visualization
- Interactive camera controls (rotate, zoom)
- Hover information for individual assemblies

### Detailed Plant Systems Visualization

The detailed plant systems visualization includes:

- **Primary Circuit** - Interactive 3D model of the reactor vessel, steam generators, main coolant pumps, and pressurizer with real-time animation based on plant parameters
- **Secondary Circuit** - Interactive 3D model of the steam generators, turbine, generator, and condenser with real-time animation based on plant parameters
- **Control Systems** - Interactive 3D model of the reactor control, pressurizer control, and feedwater control systems with real-time displays showing current parameters

Features of the detailed visualizations:

- Real-time parameter displays updated during simulation
- Interactive components with hover information
- Dynamic color changes and animations based on plant conditions
- Realistic representation of component interactions
- Multiple view options for different plant systems

## Future Enhancements

Potential improvements for future versions:

- Additional failure modes and emergency scenarios
- Multiplayer mode for team training
- VR/AR support for immersive experience
- More detailed scoring and evaluation system
- Additional reactor types (PWR, BWR, RBMK, etc.)
- Physics-based neutron flux visualization
- Detailed equipment malfunctions and troubleshooting scenarios
- Acoustic feedback with realistic plant sounds

## Credits

Designed and implemented for RF Solutions' nuclear engineering education platform.