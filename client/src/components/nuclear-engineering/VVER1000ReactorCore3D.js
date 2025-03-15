// VVER1000ReactorCore3D.js - 3D visualization of the VVER-1000 reactor core
import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Html, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { Color, BufferAttribute, BackSide } from 'three';
import { Box, Typography } from '@mui/material';
import { VVER1000 } from './VVER1000Constants';

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
const FuelAssembly = ({ position, powerLevel, isControlRod, controlRodPosition }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  
  // Calculate heat color based on powerLevel
  const heatColor = getHeatColor(powerLevel);
  
  // For control rod assemblies, calculate how much the rod is inserted
  const rodHeight = isControlRod ? 1.8 * (controlRodPosition / 100) : 0;
  
  useFrame(() => {
    if (meshRef.current) {
      // Small animation to make it look more alive
      meshRef.current.rotation.y += 0.001;
      
      // Update color based on power level
      meshRef.current.material.color = heatColor;
      meshRef.current.material.emissive = heatColor.clone().multiplyScalar(0.3);
    }
  });
  
  return (
    <group position={position}>
      {/* Fuel assembly - hexagonal prism */}
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <cylinderGeometry args={[0.5, 0.5, 2, 6, 1]} />
        <meshStandardMaterial 
          roughness={0.4} 
          metalness={0.6}
          transparent={hovered}
          opacity={hovered ? 0.8 : 1}
          color={heatColor}
          emissive={heatColor.clone().multiplyScalar(0.3)}
        />
      </mesh>
      
      {/* Control rod (if this is a control rod assembly) */}
      {isControlRod && (
        <mesh position={[0, rodHeight - 1, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 2, 6, 1]} />
          <meshStandardMaterial 
            color="#555555" 
            roughness={0.5} 
            metalness={0.8}
          />
        </mesh>
      )}
      
      {/* Show info when hovered */}
      {hovered && (
        <Html position={[0, 1.5, 0]} center>
          <div style={{ 
            background: 'rgba(0,0,0,0.7)', 
            color: 'white', 
            padding: '5px 10px',
            borderRadius: '4px',
            fontSize: '12px',
            pointerEvents: 'none'
          }}>
            {isControlRod ? 'Control Rod Assembly' : 'Fuel Assembly'}<br/>
            Power: {(powerLevel * 100).toFixed(1)}%
            {isControlRod && <><br/>Insertion: {controlRodPosition.toFixed(1)}%</>}
          </div>
        </Html>
      )}
    </group>
  );
};

// Reactor vessel component
const ReactorVessel = ({ children }) => {
  return (
    <group>
      {/* Reactor vessel wall */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[11, 11, 2.5, 32, 1, true]} />
        <meshStandardMaterial 
          color="#444444" 
          side={BackSide}
          roughness={0.3}
          metalness={0.8}
          transparent={true}
          opacity={0.5}
        />
      </mesh>
      
      {/* Reactor base */}
      <mesh position={[0, -1.25, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[11, 32]} />
        <meshStandardMaterial 
          color="#555555" 
          roughness={0.3}
          metalness={0.8}
        />
      </mesh>
      
      {children}
    </group>
  );
};

// Coolant flow visualization
const CoolantFlow = ({ power }) => {
  const particles = useRef();
  const particleCount = 100;
  const particlePositions = new Float32Array(particleCount * 3);
  
  // Initialize particle positions
  useEffect(() => {
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      // Random position within reactor vessel
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 10;
      particlePositions[i3] = Math.cos(angle) * radius;
      particlePositions[i3 + 1] = (Math.random() * 2 - 1) * 1.2;
      particlePositions[i3 + 2] = Math.sin(angle) * radius;
    }
    
    if (particles.current) {
      particles.current.geometry.setAttribute(
        'position',
        new BufferAttribute(particlePositions, 3)
      );
    }
  }, []);
  
  // Animate particles to simulate coolant flow
  useFrame(() => {
    if (!particles.current) return;
    
    const positions = particles.current.geometry.attributes.position.array;
    
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Move particles upward (coolant flow)
      positions[i3 + 1] += 0.01 * power;
      
      // If particle reaches top, reset to bottom
      if (positions[i3 + 1] > 1.2) {
        positions[i3 + 1] = -1.2;
        
        // Also randomize x/z position
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * 10;
        positions[i3] = Math.cos(angle) * radius;
        positions[i3 + 2] = Math.sin(angle) * radius;
      }
    }
    
    particles.current.geometry.attributes.position.needsUpdate = true;
  });
  
  return (
    <points ref={particles}>
      <bufferGeometry />
      <pointsMaterial 
        size={0.2} 
        color="#00BBFF" 
        transparent={true} 
        opacity={0.6 * power}
      />
    </points>
  );
};

// Main scene setup
const ReactorScene = ({ reactorPower, controlRodPosition }) => {
  const { camera } = useThree();
  
  // Set up camera position
  useEffect(() => {
    camera.position.set(0, 12, 20);
    camera.lookAt(0, 0, 0);
  }, [camera]);
  
  // Prepare assembly positions - hexagonal grid
  const assemblyPositions = [];
  const gridSize = 8; // Approximating VVER-1000 core layout
  
  // Create positions for fuel assemblies in a hexagonal grid
  for (let q = -gridSize; q <= gridSize; q++) {
    const r1 = Math.max(-gridSize, -q - gridSize);
    const r2 = Math.min(gridSize, -q + gridSize);
    for (let r = r1; r <= r2; r++) {
      const x = q * 1.5;
      const z = (Math.sqrt(3) / 2) * (2 * r + q);
      
      // Check if within the circular reactor vessel
      if (Math.sqrt(x * x + z * z) <= 10) {
        assemblyPositions.push({ x, y: 0, z });
      }
    }
  }
  
  // Randomly select positions for control rod assemblies
  // VVER-1000 has 121 control assemblies out of 163 total
  const controlRodIndices = [];
  const totalAssemblies = assemblyPositions.length;
  const controlRodCount = Math.min(Math.floor(totalAssemblies * 0.4), 121);
  
  while (controlRodIndices.length < controlRodCount) {
    const index = Math.floor(Math.random() * totalAssemblies);
    if (!controlRodIndices.includes(index)) {
      controlRodIndices.push(index);
    }
  }
  
  return (
    <>
      {/* Main lighting */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <directionalLight position={[-10, -10, -5]} intensity={0.2} />
      
      {/* Orbit controls for interactive viewing */}
      <OrbitControls enablePan={false} minDistance={15} maxDistance={40} />
      
      {/* Reactor vessel */}
      <ReactorVessel>
        {/* Coolant visualization */}
        <CoolantFlow power={reactorPower / 100} />
        
        {/* Fuel and control rod assemblies */}
        {assemblyPositions.map((pos, index) => (
          <FuelAssembly
            key={index}
            position={[pos.x, pos.y, pos.z]}
            powerLevel={reactorPower / 100 * (1 - 0.2 * Math.random())} // Slight variation
            isControlRod={controlRodIndices.includes(index)}
            controlRodPosition={controlRodPosition}
          />
        ))}
      </ReactorVessel>
      
      {/* Annotations */}
      <Text
        position={[0, -3, 0]}
        color="white"
        fontSize={1}
        anchorX="center"
        anchorY="middle"
      >
        VVER-1000 Core
      </Text>
    </>
  );
};

/**
 * VVER-1000 Reactor Core 3D Visualization
 * Displays an interactive 3D model of the reactor core
 */
function VVER1000ReactorCore3D({ reactorPower, controlRodPosition }) {
  return (
    <Box sx={{ width: '100%', height: '400px', position: 'relative' }}>
      <Canvas shadows dpr={[1, 2]}>
        <ReactorScene 
          reactorPower={reactorPower} 
          controlRodPosition={controlRodPosition} 
        />
      </Canvas>
      
      {/* Legend overlay */}
      <Box 
        sx={{ 
          position: 'absolute', 
          bottom: 10, 
          right: 10, 
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1,
          fontSize: '0.8rem',
          maxWidth: '200px'
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>Legend:</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#3333ff', mr: 1 }}></Box>
          <Typography variant="caption">Cold / Low Power</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#33ff33', mr: 1 }}></Box>
          <Typography variant="caption">Medium Power</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#ff3333', mr: 1 }}></Box>
          <Typography variant="caption">Hot / High Power</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box sx={{ width: 12, height: 12, bgcolor: '#555555', mr: 1 }}></Box>
          <Typography variant="caption">Control Rods</Typography>
        </Box>
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          Fuel Assemblies: {VVER1000.fuelAssemblies}
          <br />
          Control Rods: {VVER1000.controlRods}
        </Typography>
      </Box>
      
      {/* Instructions overlay */}
      <Box 
        sx={{ 
          position: 'absolute', 
          top: 10, 
          left: 10, 
          bgcolor: 'rgba(0,0,0,0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1,
          fontSize: '0.8rem'
        }}
      >
        <Typography variant="caption">
          Click and drag to rotate • Scroll to zoom
        </Typography>
      </Box>
    </Box>
  );
}

export default VVER1000ReactorCore3D;