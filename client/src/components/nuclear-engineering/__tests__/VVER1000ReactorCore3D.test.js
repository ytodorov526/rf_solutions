// VVER1000ReactorCore3D.test.js - Unit tests for the VVER-1000 3D visualization
import React from 'react';
import { render } from '@testing-library/react';
import VVER1000ReactorCore3D from '../VVER1000ReactorCore3D';

// Mock the react-three-fiber components since they're challenging to test
jest.mock('@react-three/fiber', () => ({
  Canvas: ({ children }) => <div data-testid="canvas">{children}</div>,
  useFrame: jest.fn(),
  useThree: () => ({ camera: { position: { set: jest.fn() }, lookAt: jest.fn() } })
}));

jest.mock('@react-three/drei', () => ({
  OrbitControls: () => <div data-testid="orbit-controls"></div>,
  Text: ({ children, ...props }) => <div data-testid="text" {...props}>{children}</div>,
  Html: ({ children }) => <div data-testid="html">{children}</div>,
  useTexture: jest.fn()
}));

jest.mock('three', () => ({
  Color: jest.fn().mockImplementation(() => ({
    clone: () => ({ multiplyScalar: () => ({}) }),
  })),
  BufferAttribute: jest.fn(),
  BackSide: 'backside',
}));

describe('VVER1000ReactorCore3D', () => {
  test('renders without crashing', () => {
    render(
      <VVER1000ReactorCore3D 
        reactorPower={50} 
        controlRodPosition={30} 
      />
    );
  });
  
  test('passes props correctly', () => {
    // Since we're using mocked components, we can't do much beyond checking
    // for crashes. In a real app, more sophisticated testing would be appropriate.
    const { getByText } = render(
      <VVER1000ReactorCore3D 
        reactorPower={75} 
        controlRodPosition={20} 
      />
    );
    
    // Check if the legend is rendered
    expect(getByText('Legend:')).toBeInTheDocument();
    expect(getByText('Cold / Low Power')).toBeInTheDocument();
    expect(getByText('Medium Power')).toBeInTheDocument();
    expect(getByText('Hot / High Power')).toBeInTheDocument();
    expect(getByText('Control Rods')).toBeInTheDocument();
    
    // Check for instructions
    expect(getByText('Click and drag to rotate • Scroll to zoom')).toBeInTheDocument();
  });
});