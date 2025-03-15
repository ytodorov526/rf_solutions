// VVER1000DetailedComponents.test.js - Unit tests for the VVER-1000 detailed components visualization
import React from 'react';
import { render } from '@testing-library/react';
import VVER1000DetailedComponents from '../VVER1000DetailedComponents';

// Mock the react-three-fiber components since they're challenging to test
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
  useFrame: jest.fn(),
  useThree: () => ({ camera: { position: { set: jest.fn() }, lookAt: jest.fn() } })
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls"></div>,
  Text: ({ children, ...props }) => <div data-testid="text" {...props}>{children}</div>,
  Html: ({ children }) => <div data-testid="html">{children}</div>
}));

jest.mock('three', () => ({
  Color: jest.fn().mockImplementation(() => ({
    clone: () => ({ multiplyScalar: () => ({}) }),
  })),
  BufferAttribute: jest.fn(),
  BackSide: 'backside',
}));

describe('VVER1000DetailedComponents', () => {
  const props = {
    reactorPower: 50,
    controlRodPosition: 30,
    primaryTemp: 300,
    primaryPressure: 15.5,
    secondaryPressure: 6.2,
    turbineRpm: 1500,
    gridConnected: false,
    coolantFlowRate: 60000,
    autoControlSystems: {
      pressurizer: true,
      feedwater: true,
      turbineGovernor: true
    }
  };

  test('renders without crashing', () => {
    render(<VVER1000DetailedComponents {...props} />);
  });
  
  test('renders component selector dropdown', () => {
    const { getByLabelText } = render(<VVER1000DetailedComponents {...props} />);
    expect(getByLabelText('Component')).toBeInTheDocument();
  });
  
  test('renders navigation controls', () => {
    const { getByText } = render(<VVER1000DetailedComponents {...props} />);
    expect(getByText('Click and drag to rotate • Scroll to zoom • Mouse over components for info')).toBeInTheDocument();
  });
});