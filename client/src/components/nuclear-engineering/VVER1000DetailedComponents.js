// VVER1000DetailedComponents.js - Detailed component visualizations for the VVER-1000 simulator
import React, { useState, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, useTexture, useGLTF, Environment, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { Box, Typography, Paper, Grid, Button, IconButton, Tooltip, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { VVER1000 } from './VVER1000Constants';
import InfoIcon from '@mui/icons-material/Info';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import CenterFocusStrongIcon from '@mui/icons-material/CenterFocusStrong';

/**
 * Primary Circuit component - Visualizes the primary coolant loop
 */
const PrimaryCircuit = ({ reactorPower, primaryTemp, primaryPressure, coolantFlowRate }) => {
  // Calculate normalized values for visualization
  const normalizedFlow = coolantFlowRate / VVER1000.coolantFlowRate;
  const normalizedTemp = (primaryTemp - 260) / (330 - 260); // Min/max temps
  const normalizedPressure = (primaryPressure - 13) / (17 - 13); // Min/max pressure

  // Refs for animated elements
  const coolantRef = useRef();
  const pressurizerRef = useRef();
  const flowRateRef = useRef();
  
  // Heat color based on temperature
  const getHeatColor = (value) => {
    // Value between 0-1
    if (value < 0.2) return new THREE.Color(0x3333ff); // Blue (cold)
    if (value < 0.4) return new THREE.Color(0x33ffff); // Cyan
    if (value < 0.6) return new THREE.Color(0x33ff33); // Green
    if (value < 0.8) return new THREE.Color(0xffff33); // Yellow
    return new THREE.Color(0xff3333); // Red (hot)
  };
  
  // Animation for the flow indicators and components
  useFrame(() => {
    if (coolantRef.current) {
      // Rotate flow indicators based on flow rate
      coolantRef.current.rotation.z += 0.01 * normalizedFlow;
      
      // Update coolant color based on temperature
      const heatColor = getHeatColor(normalizedTemp);
      coolantRef.current.material.color = heatColor;
    }
    
    if (pressurizerRef.current) {
      // Pressurizer water level changes with pressure
      const waterLevel = 1 + normalizedPressure * 2;
      pressurizerRef.current.scale.y = waterLevel;
      pressurizerRef.current.position.y = -2.5 + (waterLevel / 2);
    }
    
    if (flowRateRef.current) {
      // Pulse the flow rate indicators based on flow
      const pulse = 1 + 0.1 * Math.sin(Date.now() * 0.005 * normalizedFlow);
      flowRateRef.current.scale.set(pulse, pulse, pulse);
    }
  });
  
  const [hoveredPart, setHoveredPart] = useState(null);
  
  return (
    <group>
      {/* Reactor Vessel */}
      <group position={[0, 0, 0]}>
        <mesh
          position={[0, 0, 0]}
          onPointerOver={() => setHoveredPart('reactor')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <cylinderGeometry args={[2, 2, 5, 32]} />
          <meshStandardMaterial 
            color="#555555" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Reactor Core (visible inside vessel) */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[1.5, 1.5, 4, 16]} />
          <meshStandardMaterial 
            color={getHeatColor(normalizedTemp)}
            emissive={getHeatColor(normalizedTemp)}
            emissiveIntensity={reactorPower / 100}
          />
        </mesh>
        
        {hoveredPart === 'reactor' && (
          <Html position={[3, 0, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Reactor Vessel</strong>
              <p>Power: {reactorPower.toFixed(1)}%</p>
              <p>Temp: {primaryTemp.toFixed(1)}°C</p>
              <p>Contains 163 fuel assemblies and 121 control rod assemblies</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Steam Generator */}
      <group position={[7, 0, 0]}>
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          onPointerOver={() => setHoveredPart('steamgen')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <cylinderGeometry args={[1.5, 1.5, 5, 32]} />
          <meshStandardMaterial 
            color="#777777" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Steam Generator Tubes */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.8, 0.2, 16, 100, Math.PI * 2]} />
          <meshStandardMaterial 
            color="#999999" 
            metalness={0.5} 
            roughness={0.5}
          />
        </mesh>
        
        {hoveredPart === 'steamgen' && (
          <Html position={[0, 3, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Steam Generator</strong>
              <p>Primary Temp: {primaryTemp.toFixed(1)}°C</p>
              <p>Transfers heat from primary to secondary circuit</p>
              <p>Produces steam for turbine</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Main Coolant Pump */}
      <group position={[7, -5, 0]}>
        <mesh
          position={[0, 0, 0]}
          onPointerOver={() => setHoveredPart('pump')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial 
            color="#3366aa" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Pump rotor */}
        <mesh 
          ref={flowRateRef}
          position={[0, 0, 1.1]}
          rotation={[Math.PI / 2, 0, 0]}
        >
          <cylinderGeometry args={[0.8, 0.2, 0.5, 16]} />
          <meshStandardMaterial 
            color="#aaccff" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {hoveredPart === 'pump' && (
          <Html position={[0, -3, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Main Coolant Pump</strong>
              <p>Flow Rate: {(coolantFlowRate / 1000).toFixed(1)} m³/s</p>
              <p>Circulates coolant through the primary circuit</p>
              <p>Power: 5.1 MW</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Pressurizer */}
      <group position={[-5, 3, 0]}>
        <mesh
          position={[0, 0, 0]}
          onPointerOver={() => setHoveredPart('pressurizer')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <cylinderGeometry args={[1, 1, 4, 32]} />
          <meshStandardMaterial 
            color="#aa6633" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Pressurizer water level */}
        <mesh
          ref={pressurizerRef}
          position={[0, -1, 0]}
          scale={[0.9, 2, 0.9]}
        >
          <cylinderGeometry args={[1, 1, 1, 32]} />
          <meshStandardMaterial 
            color="#3399ff" 
            transparent={true} 
            opacity={0.7}
          />
        </mesh>
        
        {/* Steam space */}
        <mesh
          position={[0, 1, 0]}
          scale={[0.9, 1, 0.9]}
        >
          <cylinderGeometry args={[1, 1, 2, 32]} />
          <meshStandardMaterial 
            color="#dddddd" 
            transparent={true} 
            opacity={0.3}
          />
        </mesh>
        
        {hoveredPart === 'pressurizer' && (
          <Html position={[-3, 0, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Pressurizer</strong>
              <p>Pressure: {primaryPressure.toFixed(2)} MPa</p>
              <p>Controls primary circuit pressure using heaters and spray system</p>
              <p>Volume: 79 m³</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Primary Circuit Piping */}
      <group>
        {/* Hot Leg (Reactor to Steam Generator) */}
        <mesh position={[3.5, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 7, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color={getHeatColor(normalizedTemp)}
          />
        </mesh>
        
        {/* Cold Leg (Steam Generator to Pump) */}
        <mesh position={[7, -2.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.5, 0.5, 5, 16]} />
          <meshStandardMaterial 
            color={getHeatColor(normalizedTemp * 0.7)} // Cooler
          />
        </mesh>
        
        {/* Cold Leg (Pump to Reactor) */}
        <mesh position={[3.5, -5, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 7, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color={getHeatColor(normalizedTemp * 0.7)} // Cooler
          />
        </mesh>
        
        {/* Pressurizer Connection */}
        <mesh position={[-2.5, 1.5, 0]} rotation={[0, 0, Math.PI / 4]}>
          <cylinderGeometry args={[0.3, 0.3, 3.5, 16]} />
          <meshStandardMaterial 
            color={getHeatColor(normalizedTemp * 0.9)}
          />
        </mesh>
      </group>
      
      {/* Flow Indicators */}
      <group>
        <mesh 
          ref={coolantRef}
          position={[3.5, 0, 0.6]} 
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[0.7, 0.1, 16, 100, Math.PI * 1.5]} />
          <meshStandardMaterial 
            color={getHeatColor(normalizedTemp)}
          />
        </mesh>
        
        <mesh 
          ref={coolantRef}
          position={[3.5, -5, 0.6]} 
          rotation={[0, Math.PI / 2, 0]}
        >
          <torusGeometry args={[0.7, 0.1, 16, 100, Math.PI * 1.5]} />
          <meshStandardMaterial 
            color={getHeatColor(normalizedTemp * 0.7)}
          />
        </mesh>
      </group>
      
      {/* Labels */}
      <Text 
        position={[0, -3, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Reactor
      </Text>
      
      <Text 
        position={[7, -7, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Pump
      </Text>
      
      <Text 
        position={[7, 2.5, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Steam Generator
      </Text>
      
      <Text 
        position={[-5, 5.5, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Pressurizer
      </Text>
    </group>
  );
};

/**
 * Secondary Circuit component - Visualizes the steam and feedwater systems
 */
const SecondaryCircuit = ({ reactorPower, secondaryPressure, turbineRpm, gridConnected }) => {
  // Normalized values for visualization
  const normalizedPower = reactorPower / 100;
  const normalizedPressure = (secondaryPressure - 5) / (7 - 5); // Min/max pressure
  const normalizedRpm = turbineRpm / 3000;
  
  // Refs for animated elements
  const turbineRef = useRef();
  const steamRef = useRef();
  const generatorRef = useRef();
  
  // Animation for turbine and steam flow
  useFrame(() => {
    if (turbineRef.current) {
      // Rotate turbine based on RPM
      turbineRef.current.rotation.z += 0.1 * normalizedRpm;
    }
    
    if (steamRef.current) {
      // Update steam flow based on power and pressure
      steamRef.current.scale.x = 0.8 + 0.4 * normalizedPower;
      steamRef.current.scale.y = 0.8 + 0.4 * normalizedPower;
      steamRef.current.scale.z = 0.8 + 0.4 * normalizedPower;
      
      // Update steam opacity based on pressure
      steamRef.current.material.opacity = 0.3 + 0.4 * normalizedPressure;
    }
    
    if (generatorRef.current) {
      // Pulse the generator when connected to grid
      if (gridConnected) {
        const pulse = 1 + 0.05 * Math.sin(Date.now() * 0.003);
        generatorRef.current.scale.set(pulse, pulse, pulse);
      }
    }
  });
  
  const [hoveredPart, setHoveredPart] = useState(null);
  
  return (
    <group>
      {/* Steam Generator (Secondary Side) */}
      <group position={[-7, 0, 0]}>
        <mesh
          position={[0, 0, 0]}
          rotation={[0, 0, Math.PI / 2]}
          onPointerOver={() => setHoveredPart('steamgen')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <cylinderGeometry args={[1.5, 1.5, 5, 32]} />
          <meshStandardMaterial 
            color="#777777" 
            metalness={0.7} 
            roughness={0.3}
          />
        </mesh>
        
        {/* Water Level */}
        <mesh 
          position={[0, -1, 0]} 
          rotation={[0, 0, Math.PI / 2]}
          scale={[1, 0.9, 0.9]}
        >
          <cylinderGeometry args={[1.4, 1.4, 3, 32]} />
          <meshStandardMaterial 
            color="#3399ff" 
            transparent={true} 
            opacity={0.5}
          />
        </mesh>
        
        {/* Steam Space */}
        <mesh 
          position={[0, 1, 0]} 
          rotation={[0, 0, Math.PI / 2]}
          scale={[1, 0.9, 0.9]}
        >
          <cylinderGeometry args={[1.4, 1.4, 3, 32]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent={true} 
            opacity={0.2}
          />
        </mesh>
        
        {hoveredPart === 'steamgen' && (
          <Html position={[0, 3, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Steam Generator</strong>
              <p>Steam Pressure: {secondaryPressure.toFixed(2)} MPa</p>
              <p>Steam Temperature: {(secondaryPressure * 44 + 1).toFixed(1)}°C</p>
              <p>Four horizontal steam generators transfer heat from primary to secondary circuit</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Turbine */}
      <group position={[0, 0, 0]}>
        <mesh
          position={[0, 0, 0]}
          onPointerOver={() => setHoveredPart('turbine')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <boxGeometry args={[4, 2, 1.5]} />
          <meshStandardMaterial 
            color="#446688" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {/* Turbine Shaft */}
        <mesh
          ref={turbineRef}
          position={[0, 0, 2]}
          rotation={[0, 0, 0]}
        >
          <cylinderGeometry args={[1, 1, 0.5, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial 
            color="#aaaaaa" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {/* Turbine Blades */}
        <mesh
          ref={turbineRef}
          position={[0, 0, 2]}
          rotation={[0, 0, 0]}
        >
          <torusGeometry args={[0.8, 0.1, 16, 8]} />
          <meshStandardMaterial 
            color="#cccccc" 
            metalness={0.9} 
            roughness={0.1}
          />
        </mesh>
        
        {hoveredPart === 'turbine' && (
          <Html position={[0, -3, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Turbine</strong>
              <p>Speed: {turbineRpm.toFixed(0)} RPM</p>
              <p>Power: {(reactorPower * 10).toFixed(0)} MWe</p>
              <p>High/low pressure stages with moisture separators</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Generator */}
      <group position={[6, 0, 0]}>
        <mesh
          ref={generatorRef}
          position={[0, 0, 0]}
          onPointerOver={() => setHoveredPart('generator')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <cylinderGeometry args={[1.5, 1.5, 3, 32]} rotation={[Math.PI / 2, 0, 0]} />
          <meshStandardMaterial 
            color={gridConnected ? "#33aa33" : "#aa3333"} 
            metalness={0.7} 
            roughness={0.3}
            emissive={gridConnected ? new THREE.Color(0x33aa33) : new THREE.Color(0)}
            emissiveIntensity={0.5}
          />
        </mesh>
        
        {hoveredPart === 'generator' && (
          <Html position={[0, 3, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Generator</strong>
              <p>Status: {gridConnected ? "Connected to Grid" : "Disconnected"}</p>
              <p>Output: {gridConnected ? (reactorPower * 10).toFixed(0) : "0"} MWe</p>
              <p>Type: 3-phase synchronous, hydrogen-cooled</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Condenser */}
      <group position={[0, -5, 0]}>
        <mesh
          position={[0, 0, 0]}
          onPointerOver={() => setHoveredPart('condenser')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <boxGeometry args={[5, 2, 2]} />
          <meshStandardMaterial 
            color="#55aacc" 
            metalness={0.6} 
            roughness={0.4}
          />
        </mesh>
        
        {hoveredPart === 'condenser' && (
          <Html position={[0, -3, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Condenser</strong>
              <p>Condenses exhaust steam from turbine</p>
              <p>Cooling Water: Sea/river water</p>
              <p>Vacuum: 0.0035 MPa</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Feedwater Pump */}
      <group position={[-6, -5, 0]}>
        <mesh
          position={[0, 0, 0]}
          onPointerOver={() => setHoveredPart('feedpump')}
          onPointerOut={() => setHoveredPart(null)}
        >
          <cylinderGeometry args={[0.8, 0.8, 1.5, 32]} />
          <meshStandardMaterial 
            color="#3366cc" 
            metalness={0.8} 
            roughness={0.2}
          />
        </mesh>
        
        {hoveredPart === 'feedpump' && (
          <Html position={[0, -3, 0]}>
            <div style={{
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              width: '180px',
              fontSize: '12px'
            }}>
              <strong>Feedwater Pump</strong>
              <p>Pumps water from condenser to steam generator</p>
              <p>Flow Rate: {(reactorPower * 17).toFixed(0)} kg/s</p>
              <p>Head: 80 MPa</p>
            </div>
          </Html>
        )}
      </group>
      
      {/* Steam Lines */}
      <group>
        {/* Main Steam Line */}
        <mesh 
          ref={steamRef}
          position={[-3.5, 0, 0]}
        >
          <cylinderGeometry args={[0.5, 0.5, 7, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#ffffff" 
            transparent={true} 
            opacity={0.3}
          />
        </mesh>
        
        {/* Turbine to Condenser */}
        <mesh position={[0, -2.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.7, 0.7, 5, 16]} />
          <meshStandardMaterial 
            color="#aaddff" 
            transparent={true} 
            opacity={0.4}
          />
        </mesh>
        
        {/* Condenser to Feedwater Pump */}
        <mesh position={[-3, -5, 0]}>
          <cylinderGeometry args={[0.4, 0.4, 6, 16]} rotation={[0, 0, Math.PI / 2]} />
          <meshStandardMaterial 
            color="#3399ff"
          />
        </mesh>
        
        {/* Feedwater to Steam Generator */}
        <mesh position={[-6.5, -2.5, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.4, 0.4, 5, 16]} />
          <meshStandardMaterial 
            color="#3399ff"
          />
        </mesh>
      </group>
      
      {/* Grid connection */}
      {gridConnected && (
        <group position={[9, 0, 0]}>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.2, 4, 0.2]} />
            <meshStandardMaterial color="#aaaaaa" />
          </mesh>
          <mesh position={[0, 1.5, 0]}>
            <boxGeometry args={[2, 0.2, 0.2]} />
            <meshStandardMaterial color="#aaaaaa" />
          </mesh>
          <mesh position={[0, 0.5, 0]}>
            <boxGeometry args={[1.5, 0.2, 0.2]} />
            <meshStandardMaterial color="#aaaaaa" />
          </mesh>
          <mesh position={[0, -0.5, 0]}>
            <boxGeometry args={[1, 0.2, 0.2]} />
            <meshStandardMaterial color="#aaaaaa" />
          </mesh>
        </group>
      )}
      
      {/* Labels */}
      <Text 
        position={[-7, -7, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Feedwater Pump
      </Text>
      
      <Text 
        position={[0, -7, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Condenser
      </Text>
      
      <Text 
        position={[0, 2.5, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Turbine
      </Text>
      
      <Text 
        position={[6, 2.5, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Generator
      </Text>
      
      <Text 
        position={[-7, 2.5, 0]} 
        rotation={[0, 0, 0]} 
        color="white" 
        anchorX="center" 
        anchorY="middle"
        fontSize={0.5}
      >
        Steam Generator
      </Text>
      
      {gridConnected && (
        <Text 
          position={[10, 2.5, 0]} 
          rotation={[0, 0, 0]} 
          color="#33ff33" 
          anchorX="center" 
          anchorY="middle"
          fontSize={0.5}
        >
          Grid
        </Text>
      )}
    </group>
  );
};

/**
 * Control Systems component - Visualizes plant control systems
 */
const ControlSystems = ({ 
  reactorPower, 
  controlRodPosition, 
  primaryPressure, 
  primaryTemp, 
  secondaryPressure, 
  autoControlSystems 
}) => {
  return (
    <group>
      {/* Reactor Control System */}
      <group position={[-6, 3, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 3, 1]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        
        {/* Control Rod Control Display */}
        <mesh position={[0, 0.5, 0.6]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        
        {/* Control Rod Position Indicator */}
        <mesh position={[-1.5 + (3 * (1 - controlRodPosition / 100)), 0.5, 0.7]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshBasicMaterial color="#33ff33" />
        </mesh>
        
        {/* Power Display */}
        <mesh position={[0, -0.7, 0.6]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        
        {/* Power Indicator */}
        <mesh position={[-1.5 + (3 * reactorPower / 100), -0.7, 0.7]} scale={[reactorPower / 100, 1, 1]}>
          <boxGeometry args={[3, 0.3, 0.1]} />
          <meshBasicMaterial color="#ff3333" />
        </mesh>
        
        <Text 
          position={[0, 1.8, 0.5]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          fontSize={0.4}
        >
          Reactor Control System
        </Text>
        
        <Text 
          position={[-1.5, 0.5, 0.7]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="right" 
          anchorY="middle"
          fontSize={0.25}
        >
          Rod: {controlRodPosition.toFixed(1)}%
        </Text>
        
        <Text 
          position={[-1.5, -0.7, 0.7]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="right" 
          anchorY="middle"
          fontSize={0.25}
        >
          Power: {reactorPower.toFixed(1)}%
        </Text>
      </group>
      
      {/* Pressurizer Control System */}
      <group position={[0, 3, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 3, 1]} />
          <meshStandardMaterial color={autoControlSystems.pressurizer ? "#335533" : "#553333"} />
        </mesh>
        
        {/* Pressure Display */}
        <mesh position={[0, 0.5, 0.6]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        
        {/* Pressure Scale */}
        <mesh position={[0, 0.5, 0.7]}>
          <boxGeometry args={[3, 0.05, 0.05]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
        
        {/* Pressure Setpoint */}
        <mesh position={[-1.5 + 3 * ((15.7 - 13) / 4), 0.5, 0.7]}>
          <boxGeometry args={[0.1, 0.8, 0.05]} />
          <meshBasicMaterial color="#ffff33" />
        </mesh>
        
        {/* Pressure Indicator */}
        <mesh position={[-1.5 + 3 * ((primaryPressure - 13) / 4), 0.5, 0.8]}>
          <boxGeometry args={[0.1, 0.6, 0.05]} />
          <meshBasicMaterial color="#ff3333" />
        </mesh>
        
        {/* Temperature Display */}
        <mesh position={[0, -0.7, 0.6]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        
        {/* Temperature Scale */}
        <mesh position={[0, -0.7, 0.7]}>
          <boxGeometry args={[3, 0.05, 0.05]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
        
        {/* Temperature Indicator */}
        <mesh position={[-1.5 + 3 * ((primaryTemp - 260) / 70), -0.7, 0.8]}>
          <boxGeometry args={[0.1, 0.6, 0.05]} />
          <meshBasicMaterial color="#ff9933" />
        </mesh>
        
        <Text 
          position={[0, 1.8, 0.5]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          fontSize={0.4}
        >
          Pressurizer Control {autoControlSystems.pressurizer ? "(AUTO)" : "(MANUAL)"}
        </Text>
        
        <Text 
          position={[-1.5, 0.5, 0.7]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="right" 
          anchorY="middle"
          fontSize={0.25}
        >
          Press: {primaryPressure.toFixed(2)} MPa
        </Text>
        
        <Text 
          position={[-1.5, -0.7, 0.7]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="right" 
          anchorY="middle"
          fontSize={0.25}
        >
          Temp: {primaryTemp.toFixed(1)}°C
        </Text>
      </group>
      
      {/* Feedwater Control System */}
      <group position={[6, 3, 0]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[4, 3, 1]} />
          <meshStandardMaterial color={autoControlSystems.feedwater ? "#335533" : "#553333"} />
        </mesh>
        
        {/* Steam Pressure Display */}
        <mesh position={[0, 0.5, 0.6]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        
        {/* Pressure Scale */}
        <mesh position={[0, 0.5, 0.7]}>
          <boxGeometry args={[3, 0.05, 0.05]} />
          <meshBasicMaterial color="#666666" />
        </mesh>
        
        {/* Pressure Setpoint */}
        <mesh position={[-1.5 + 3 * ((6.3 - 5) / 2), 0.5, 0.7]}>
          <boxGeometry args={[0.1, 0.8, 0.05]} />
          <meshBasicMaterial color="#ffff33" />
        </mesh>
        
        {/* Pressure Indicator */}
        <mesh position={[-1.5 + 3 * ((secondaryPressure - 5) / 2), 0.5, 0.8]}>
          <boxGeometry args={[0.1, 0.6, 0.05]} />
          <meshBasicMaterial color="#33ccff" />
        </mesh>
        
        {/* Flow Display */}
        <mesh position={[0, -0.7, 0.6]}>
          <planeGeometry args={[3.5, 1]} />
          <meshBasicMaterial color="#111111" />
        </mesh>
        
        {/* Flow Indicator */}
        <mesh position={[-1.5 + (3 * reactorPower / 100), -0.7, 0.7]} scale={[reactorPower / 100, 1, 1]}>
          <boxGeometry args={[3, 0.3, 0.1]} />
          <meshBasicMaterial color="#3399ff" />
        </mesh>
        
        <Text 
          position={[0, 1.8, 0.5]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          fontSize={0.4}
        >
          Feedwater Control {autoControlSystems.feedwater ? "(AUTO)" : "(MANUAL)"}
        </Text>
        
        <Text 
          position={[-1.5, 0.5, 0.7]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="right" 
          anchorY="middle"
          fontSize={0.25}
        >
          Press: {secondaryPressure.toFixed(2)} MPa
        </Text>
        
        <Text 
          position={[-1.5, -0.7, 0.7]} 
          rotation={[0, 0, 0]} 
          color="white" 
          anchorX="right" 
          anchorY="middle"
          fontSize={0.25}
        >
          Flow: {(reactorPower * 17).toFixed(0)} kg/s
        </Text>
      </group>
      
      {/* Control Room Background */}
      <mesh position={[0, 0, -1]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshBasicMaterial color="#222222" />
      </mesh>
      
      <mesh position={[0, -2, -0.5]} rotation={[Math.PI / 4, 0, 0]}>
        <planeGeometry args={[20, 4]} />
        <meshBasicMaterial color="#333333" />
      </mesh>
    </group>
  );
};

/**
 * Main scene setup
 */
const DetailedSystemsScene = ({ componentType, ...props }) => {
  const { camera } = useThree();
  
  // Set up camera position based on component type
  useEffect(() => {
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);
  }, [camera, componentType]);
  
  return (
    <>
      {/* Main lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />
      <pointLight position={[0, 0, 5]} intensity={0.5} />
      
      {/* Orbit controls for interactive viewing */}
      <OrbitControls enablePan={true} minDistance={5} maxDistance={30} />
      
      {/* Render the selected component type */}
      {componentType === 'primary' && <PrimaryCircuit {...props} />}
      {componentType === 'secondary' && <SecondaryCircuit {...props} />}
      {componentType === 'control' && <ControlSystems {...props} />}
    </>
  );
};

/**
 * VVER-1000 Detailed Components Visualization
 * Displays interactive 3D models of reactor components
 */
function VVER1000DetailedComponents(props) {
  const [componentType, setComponentType] = useState('primary');
  const [cameraPosition, setCameraPosition] = useState({ x: 0, y: 0, z: 15 });
  
  const handleComponentChange = (event) => {
    setComponentType(event.target.value);
  };
  
  const handleZoomIn = () => {
    setCameraPosition(prev => ({ ...prev, z: Math.max(prev.z - 5, 5) }));
  };
  
  const handleZoomOut = () => {
    setCameraPosition(prev => ({ ...prev, z: Math.min(prev.z + 5, 30) }));
  };
  
  const handleResetView = () => {
    setCameraPosition({ x: 0, y: 0, z: 15 });
  };
  
  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]}>
        <DetailedSystemsScene 
          componentType={componentType}
          {...props}
        />
      </Canvas>
      
      {/* Control panel overlay */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1
        }}
      >
        <FormControl variant="outlined" size="small" sx={{ minWidth: 200, mr: 2 }}>
          <InputLabel id="component-select-label" sx={{ color: 'white' }}>Component</InputLabel>
          <Select
            labelId="component-select-label"
            value={componentType}
            onChange={handleComponentChange}
            label="Component"
            sx={{ 
              color: 'white',
              '.MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.5)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.8)',
              },
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: 'white',
              },
              '.MuiSvgIcon-root': {
                color: 'white',
              }
            }}
          >
            <MenuItem value="primary">Primary Circuit</MenuItem>
            <MenuItem value="secondary">Secondary Circuit</MenuItem>
            <MenuItem value="control">Control Systems</MenuItem>
          </Select>
        </FormControl>
        
        <IconButton 
          onClick={handleZoomIn} 
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', mr: 1 }}
          size="small"
        >
          <ZoomInIcon />
        </IconButton>
        
        <IconButton 
          onClick={handleZoomOut} 
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)', mr: 1 }}
          size="small"
        >
          <ZoomOutIcon />
        </IconButton>
        
        <IconButton 
          onClick={handleResetView} 
          sx={{ color: 'white', bgcolor: 'rgba(255,255,255,0.1)' }}
          size="small"
        >
          <CenterFocusStrongIcon />
        </IconButton>
      </Box>
      
      {/* Instructions overlay */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 10, 
          right: 10, 
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1,
          fontSize: '0.8rem'
        }}
      >
        <Typography variant="caption">
          Click and drag to rotate • Scroll to zoom • Mouse over components for info
        </Typography>
      </Box>
      
      {/* Component description */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 10, 
          left: 10, 
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1,
          maxWidth: '300px'
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
          {componentType === 'primary' && 'Primary Circuit'}
          {componentType === 'secondary' && 'Secondary Circuit'}
          {componentType === 'control' && 'Control Systems'}
        </Typography>
        <Typography variant="caption">
          {componentType === 'primary' && 
            'The primary circuit contains the reactor core, pressurizer, steam generators, and main coolant pumps. It circulates pressurized water to transfer heat from the reactor to the steam generators.'}
          {componentType === 'secondary' && 
            'The secondary circuit includes steam generators, turbine, generator, and condenser. It converts thermal energy to mechanical and then electrical energy.'}
          {componentType === 'control' && 
            'The control systems maintain reactor parameters within safe operating limits. This includes reactor control, pressurizer control, and feedwater control systems.'}
        </Typography>
      </Box>
    </Box>
  );
}

export default VVER1000DetailedComponents;