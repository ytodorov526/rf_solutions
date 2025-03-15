// VVER1000Constants.js - Configuration for the VVER-1000 simulation

// VVER-1000 reactor parameters
export const VVER1000 = {
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

// Safety limits
export const SAFETY_LIMITS = {
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
export const SCRAM_CONDITIONS = [
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

// Initial state for the simulator
export const initialState = {
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
  powerRateOfChange: 0, // % per minute
  manualMode: true, // Whether operator has full manual control
  autoControlSystems: {
    pressurizer: true,  // Automatic pressurizer control
    feedwater: true,    // Automatic feedwater control
    turbineGovernor: true // Automatic turbine speed control
  }
};

// Reactor operational scenarios
export const SCENARIOS = [
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
    ],
    plannedEvents: []
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
    ],
    plannedEvents: []
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
    },
    goal: 'Stabilize the reactor at reduced power without scram',
    steps: [
      'Immediately reduce reactor power',
      'Adjust control rods to maintain core parameters',
      'Monitor temperature distribution for hot spots',
      'Stabilize at new power level (around 75%)'
    ],
    plannedEvents: [
      {
        time: 120, // After 2 minutes
        name: 'Pump Failure',
        message: 'Main Coolant Pump #2 has failed',
        effect: (state) => ({
          coolantFlowRate: 60000, // Reduced flow due to pump failure
          alarms: [...state.alarms, 'Main Coolant Pump #2 Failure']
        })
      }
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
    },
    goal: 'Prevent reactor trip and stabilize at house load operation',
    steps: [
      'Quickly reduce reactor power',
      'Control turbine speed to prevent overspeed trip',
      'Maintain steam pressure by controlling steam dump to condenser',
      'Stabilize at house load (~5-10% power)'
    ],
    plannedEvents: [
      {
        time: 90, // After 1.5 minutes
        name: 'Grid Disconnection',
        message: 'Generator has disconnected from the grid',
        effect: (state) => ({
          gridConnected: false,
          alarms: [...state.alarms, 'Generator Load Rejection', 'Turbine Overspeed Warning']
        })
      }
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
    ],
    plannedEvents: []
  }
];