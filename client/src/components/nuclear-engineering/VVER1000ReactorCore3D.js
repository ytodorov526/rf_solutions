// VVER1000ReactorCore3D.js - 3D visualization of the VVER-1000 reactor core
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Color, BufferAttribute, BackSide } from 'three';
import { Box, Typography } from '@mui/material';
import { VVER1000, SIMULATION_MODES } from './VVER1000Constants';

// Color scale for heat visualization
const getHeatColor = (value) => {
  // Value should be between 0-1
  if (value < 0.2) return new Color(0x3333ff); // Blue (cold)
  if (value < 0.4) return new Color(0x33ffff); // Cyan
  if (value < 0.6) return new Color(0x33ff33); // Green
  if (value < 0.8) return new Color(0xffff33); // Yellow
  return new Color(0xff3333); // Red (hot)
};

// Fuel assembly component
const FuelAssembly = ({ position, power, temperature, burnup, mode }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Calculate color based on power and temperature
  const getColor = () => {
    if (mode === 'educational') {
      // Simple color scheme for educational mode
      return new THREE.Color(1, 1 - power, 0);
    } else {
      // Detailed color scheme for advanced modes
      const powerColor = new THREE.Color(1, 1 - power, 0);
      const tempColor = new THREE.Color(1, 0, 0).multiplyScalar(temperature / 400);
      return powerColor.lerp(tempColor, 0.5);
    }
  };
  
  // Animate assembly
  useFrame(() => {
    if (meshRef.current) {
      // Subtle floating animation
      meshRef.current.position.y = position[1] + Math.sin(Date.now() * 0.001 + position[0]) * 0.02;
      
      // Update color
      meshRef.current.material.color = getColor();
      
      // Add glow effect for high power
      if (power > 0.8) {
        meshRef.current.material.emissive = new THREE.Color(1, 0.5, 0).multiplyScalar(power);
      } else {
        meshRef.current.material.emissive = new THREE.Color(0, 0, 0);
      }
    }
  });
  
  return (
    <mesh
      ref={meshRef}
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.1 : 1}
    >
      <cylinderGeometry args={[0.4, 0.4, 3.55, 6]} />
      <meshStandardMaterial
        color={getColor()}
        metalness={0.8}
        roughness={0.2}
        emissive={new THREE.Color(0, 0, 0)}
        emissiveIntensity={power}
      />
      {hovered && (
        <Html position={[0, 2, 0]}>
          <div style={{
            background: 'rgba(0,0,0,0.8)',
            padding: '8px',
            borderRadius: '4px',
            color: 'white',
            fontSize: '12px'
          }}>
            <div>Power: {(power * 100).toFixed(1)}%</div>
            <div>Temp: {temperature.toFixed(1)}°C</div>
            {mode !== 'educational' && (
              <div>Burnup: {burnup.toFixed(0)} MWd/tU</div>
            )}
          </div>
        </Html>
      )}
    </mesh>
  );
};

// Control rod component
const ControlRod = ({ position, insertion, mode }) => {
  const meshRef = useRef();
  
  useFrame(() => {
    if (meshRef.current) {
      // Animate control rod movement
      const targetY = -1.5 + (insertion / 100) * 3;
      meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position}>
      <cylinderGeometry args={[0.1, 0.1, 3, 8]} />
      <meshStandardMaterial
        color={mode === 'educational' ? '#666666' : '#444444'}
        metalness={0.9}
        roughness={0.1}
      />
    </mesh>
  );
};

// Core visualization component
const ReactorCore = ({ reactorPower, controlRodPosition, mode, coreParameters }) => {
  const { camera } = useThree();
  const [showLabels, setShowLabels] = useState(mode === 'educational');
  
  // Set up camera
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Generate fuel assembly positions
  const generateAssemblyPositions = () => {
    const positions = [];
    const rows = 13;
    const spacing = 0.9;
    
    for (let i = 0; i < 163; i++) {
      const row = Math.floor(i / rows);
      const col = i % rows;
      const x = (col - 6) * spacing;
      const z = (row - 6) * spacing;
      positions.push([x, 0, z]);
    }
    
    return positions;
  };
  
  const assemblyPositions = generateAssemblyPositions();
  
  return (
    <group>
      {/* Core vessel */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[6, 6, 4, 32]} />
        <meshStandardMaterial
          color="#888888"
          metalness={0.7}
          roughness={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* Fuel assemblies */}
      {assemblyPositions.map((pos, i) => (
        <FuelAssembly
          key={i}
          position={pos}
          power={coreParameters?.powerDistribution[i] || reactorPower / 100}
          temperature={coreParameters?.temperatureDistribution[i] || 300}
          burnup={coreParameters?.burnupDistribution[i] || 0}
          mode={mode}
        />
      ))}
      
      {/* Control rods */}
      {Array.from({ length: 121 }).map((_, i) => (
        <ControlRod
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            0,
            (Math.random() - 0.5) * 10
          ]}
          insertion={controlRodPosition}
          mode={mode}
        />
      ))}
      
      {/* Labels for educational mode */}
      {showLabels && (
        <>
          <Text
            position={[0, 2.5, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            color="white"
            fontSize={0.5}
            anchorX="center"
            anchorY="middle"
          >
            Reactor Core
          </Text>
          <Text
            position={[0, -2, 0]}
            rotation={[Math.PI / 2, 0, 0]}
            color="white"
            fontSize={0.3}
            anchorX="center"
            anchorY="middle"
          >
            Power: {reactorPower.toFixed(1)}%
          </Text>
        </>
      )}
    </group>
  );
};

// Main component
function VVER1000ReactorCore3D({ reactorPower, controlRodPosition, mode = 'training', coreParameters }) {
  return (
    <div style={{ width: '100%', height: '400px' }}>
      <Canvas shadows camera={{ position: [0, 5, 10], fov: 50 }}>
        <color attach="background" args={['#1a1a1a']} />
        <fog attach="fog" args={['#1a1a1a', 10, 30]} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        {/* Scene */}
        <ReactorCore
          reactorPower={reactorPower}
          controlRodPosition={controlRodPosition}
          mode={mode}
          coreParameters={coreParameters}
        />
        
        {/* Controls */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}

export default VVER1000ReactorCore3D;