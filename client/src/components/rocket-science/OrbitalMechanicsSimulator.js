import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Slider, 
  Button, 
  Grid, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Divider, 
  TextField, 
  Paper,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  PlayArrow, 
  Pause, 
  Refresh, 
  Save, 
  InfoOutlined, 
  AddCircleOutline,
  RemoveCircleOutline
} from '@mui/icons-material';
import { useThemeContext } from '../../theme/ThemeContext';

const OrbitalMechanicsSimulator = () => {
  const { mode } = useThemeContext();
  const darkMode = mode === 'dark';
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const lastRenderData = useRef(null);
  
  // Canvas interaction state
  const [isDragging, setIsDragging] = useState(false);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [timeScale, setTimeScale] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // Orbital parameters
  const [centralBody, setCentralBody] = useState('earth');
  const [semiMajorAxis, setSemiMajorAxis] = useState(7000); // km
  const [eccentricity, setEccentricity] = useState(0.2);
  const [inclination, setInclination] = useState(0); // degrees
  const [argumentOfPeriapsis, setArgumentOfPeriapsis] = useState(0); // degrees
  const [orbitalObjects, setOrbitalObjects] = useState([
    { name: 'Satellite-1', semiMajorAxis: 7000, eccentricity: 0.2, inclination: 0, argumentOfPeriapsis: 0, color: '#1976d2' },
  ]);
  
  // Presets
  const [selectedPreset, setSelectedPreset] = useState('');
  
  const centralBodies = {
    earth: { 
      name: 'Earth', 
      radius: 6371, // km
      mass: 5.972e24, // kg
      color: '#2196f3',
      mu: 3.986e5 // km³/s²
    },
    mars: { 
      name: 'Mars', 
      radius: 3389, // km
      mass: 6.39e23, // kg
      color: '#f44336',
      mu: 4.282e4 // km³/s²
    },
    moon: { 
      name: 'Moon', 
      radius: 1737, // km
      mass: 7.34767309e22, // kg
      color: '#9e9e9e',
      mu: 4.9048695e3 // km³/s²
    }
  };
  
  const presets = {
    iss: { 
      name: 'ISS Orbit', 
      centralBody: 'earth',
      semiMajorAxis: 6771, // km (400km altitude)
      eccentricity: 0.0001, 
      inclination: 51.6, 
      argumentOfPeriapsis: 0
    },
    geostationary: { 
      name: 'Geostationary Orbit', 
      centralBody: 'earth',
      semiMajorAxis: 42164, // km
      eccentricity: 0, 
      inclination: 0, 
      argumentOfPeriapsis: 0
    },
    molniya: {
      name: 'Molniya Orbit',
      centralBody: 'earth',
      semiMajorAxis: 26600, // km
      eccentricity: 0.74,
      inclination: 63.4, // Critical inclination to minimize perturbations
      argumentOfPeriapsis: 270 // Apogee over northern hemisphere
    },
    lunarTransfer: {
      name: 'Earth-Moon Transfer',
      objects: [
        { name: 'Earth Orbit', semiMajorAxis: 6771, eccentricity: 0, inclination: 0, argumentOfPeriapsis: 0, color: '#2196f3' },
        { name: 'Transfer Orbit', semiMajorAxis: 200000, eccentricity: 0.966, inclination: 0, argumentOfPeriapsis: 0, color: '#ff9800' },
        { name: 'Moon Orbit', semiMajorAxis: 384400, eccentricity: 0.0549, inclination: 5.145, argumentOfPeriapsis: 0, color: '#9e9e9e' }
      ],
      centralBody: 'earth'
    },
    hohmannTransfer: { 
      name: 'Hohmann Transfer (LEO to GEO)', 
      objects: [
        { name: 'Start Orbit', semiMajorAxis: 6771, eccentricity: 0, inclination: 0, argumentOfPeriapsis: 0, color: '#4caf50' },
        { name: 'Transfer Orbit', semiMajorAxis: 24467.5, eccentricity: 0.7234, inclination: 0, argumentOfPeriapsis: 0, color: '#ff9800' },
        { name: 'Target Orbit', semiMajorAxis: 42164, eccentricity: 0, inclination: 0, argumentOfPeriapsis: 0, color: '#f44336' }
      ],
      centralBody: 'earth'
    },
    marsTransfer: { 
      name: 'Earth-Mars Transfer', 
      objects: [
        { name: 'Earth Orbit', semiMajorAxis: 149600000, eccentricity: 0.0167, inclination: 0, argumentOfPeriapsis: 0, color: '#2196f3' },
        { name: 'Transfer Orbit', semiMajorAxis: 188100000, eccentricity: 0.205, inclination: 1.85, argumentOfPeriapsis: 0, color: '#ff9800' },
        { name: 'Mars Orbit', semiMajorAxis: 227900000, eccentricity: 0.0934, inclination: 1.85, argumentOfPeriapsis: 0, color: '#f44336' }
      ],
      centralBody: 'sun',
      scaled: true
    }
  };
  
  // Apply preset
  const applyPreset = (presetKey) => {
    if (!presets[presetKey]) return;
    
    const preset = presets[presetKey];
    setCentralBody(preset.centralBody);
    
    if (preset.objects) {
      setOrbitalObjects(preset.objects);
    } else {
      setSemiMajorAxis(preset.semiMajorAxis);
      setEccentricity(preset.eccentricity);
      setInclination(preset.inclination);
      setArgumentOfPeriapsis(preset.argumentOfPeriapsis);
      
      setOrbitalObjects([{
        name: preset.name,
        semiMajorAxis: preset.semiMajorAxis,
        eccentricity: preset.eccentricity,
        inclination: preset.inclination,
        argumentOfPeriapsis: preset.argumentOfPeriapsis,
        color: '#1976d2'
      }]);
    }
    
    resetSimulation();
  };
  
  // Add orbital object
  const addOrbitalObject = () => {
    setOrbitalObjects([
      ...orbitalObjects,
      {
        name: `Satellite-${orbitalObjects.length + 1}`,
        semiMajorAxis: semiMajorAxis,
        eccentricity: eccentricity,
        inclination: inclination,
        argumentOfPeriapsis: argumentOfPeriapsis,
        color: getRandomColor()
      }
    ]);
  };
  
  // Remove orbital object
  const removeOrbitalObject = (index) => {
    if (orbitalObjects.length <= 1) return;
    
    const newObjects = [...orbitalObjects];
    newObjects.splice(index, 1);
    setOrbitalObjects(newObjects);
  };
  
  // Update orbital object parameters
  const updateOrbitalObject = (index, key, value) => {
    const newObjects = [...orbitalObjects];
    newObjects[index] = {
      ...newObjects[index],
      [key]: value
    };
    setOrbitalObjects(newObjects);
  };
  
  // Generate random color
  const getRandomColor = () => {
    const colors = ['#1976d2', '#f44336', '#4caf50', '#ff9800', '#9c27b0', '#00bcd4', '#ff5722'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  // Control functions
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };
  
  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationTime(0);
    setViewOffset({ x: 0, y: 0 }); // Reset view to center
    
    // Clear trails from objects
    setOrbitalObjects(prevObjects => 
      prevObjects.map(obj => ({
        ...obj,
        trail: []
      }))
    );
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    renderOrbits();
  };
  
  // Calculations
  const calculateOrbitPoints = (object, steps = 100) => {
    const points = [];
    const body = centralBodies[centralBody];
    const a = object.semiMajorAxis;
    const e = object.eccentricity;
    const omega = object.argumentOfPeriapsis * Math.PI / 180;
    const inclRad = object.inclination * Math.PI / 180;
    
    for (let i = 0; i <= steps; i++) {
      const theta = (i / steps) * 2 * Math.PI;
      const r = a * (1 - e*e) / (1 + e * Math.cos(theta));
      
      // Position in orbit plane
      let x = r * Math.cos(theta);
      let y = r * Math.sin(theta);
      
      // Apply argument of periapsis rotation
      const xRotated = x * Math.cos(omega) - y * Math.sin(omega);
      const yRotated = x * Math.sin(omega) + y * Math.cos(omega);
      
      // Apply inclination rotation
      const xFinal = xRotated;
      const yFinal = yRotated * Math.cos(inclRad);
      const zFinal = yRotated * Math.sin(inclRad);
      
      points.push({ x: xFinal, y: yFinal, z: zFinal });
    }
    
    return points;
  };
  
  // Calculate the position at a specific time
  const calculatePositionAtTime = (object, time) => {
    const body = centralBodies[centralBody];
    const a = object.semiMajorAxis;
    const e = object.eccentricity;
    const mu = body.mu;
    
    // Mean motion (rad/s)
    const n = Math.sqrt(mu / Math.pow(a, 3));
    
    // Mean anomaly
    const M = n * time % (2 * Math.PI);
    
    // Solve Kepler's equation for eccentric anomaly E
    // Using Newton-Raphson method for better convergence
    let E = M;
    let delta = 1.0;
    const epsilon = 1e-6; // Convergence threshold
    let iterations = 0;
    const maxIterations = 30;
    
    while (Math.abs(delta) > epsilon && iterations < maxIterations) {
      delta = (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
      E = E - delta;
      iterations++;
    }
    
    // True anomaly
    const theta = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2));
    
    // Radius
    const r = a * (1 - e*e) / (1 + e * Math.cos(theta));
    
    // Position in orbit plane
    let x = r * Math.cos(theta);
    let y = r * Math.sin(theta);
    
    // Apply argument of periapsis rotation
    const omega = object.argumentOfPeriapsis * Math.PI / 180;
    const xRotated = x * Math.cos(omega) - y * Math.sin(omega);
    const yRotated = x * Math.sin(omega) + y * Math.cos(omega);
    
    // Apply inclination rotation
    const inclRad = object.inclination * Math.PI / 180;
    const xFinal = xRotated;
    const yFinal = yRotated * Math.cos(inclRad);
    const zFinal = yRotated * Math.sin(inclRad);
    
    return { x: xFinal, y: yFinal, z: zFinal };
  };
  
  // Rendering
  const renderOrbits = () => {
    // If we have animation data, use it to render directly
    if (isRunning && lastRenderData.current) {
      renderOrbitsWithPositions(lastRenderData.current.objects, lastRenderData.current.time);
      return;
    }
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Center of canvas
    const centerX = width / 2 + viewOffset.x;
    const centerY = height / 2 + viewOffset.y;
    
    // Scale factor (pixels per km)
    const body = centralBodies[centralBody];
    const bodyRadius = body.radius;
    
    // Find maximum orbit radius to set scale
    let maxDistance = 0;
    orbitalObjects.forEach(obj => {
      const a = obj.semiMajorAxis;
      const e = obj.eccentricity;
      const apoapsis = a * (1 + e);
      if (apoapsis > maxDistance) maxDistance = apoapsis;
    });
    
    // Set scale to fit largest orbit with margin
    const scaleBase = Math.min(width, height) * 0.45 / maxDistance;
    const scale = scaleBase * zoomLevel;
    
    // Draw grid (optional)
    if (darkMode) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    }
    ctx.lineWidth = 1;
    
    // Draw coordinate grid
    const gridSize = Math.ceil(maxDistance / 4) * 1000; // Round to nearest 1000 km
    const gridStep = gridSize * scale;
    
    for (let i = -4; i <= 4; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * gridStep, 0);
      ctx.lineTo(centerX + i * gridStep, height);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * gridStep);
      ctx.lineTo(width, centerY + i * gridStep);
      ctx.stroke();
    }
    
    // Draw central body with gradient
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, bodyRadius * scale
    );
    
    // Set gradient colors based on the central body
    if (centralBody === 'earth') {
      gradient.addColorStop(0, '#4286f4');
      gradient.addColorStop(1, '#2356b4');
    } else if (centralBody === 'mars') {
      gradient.addColorStop(0, '#f4a582');
      gradient.addColorStop(1, '#d73027');
    } else if (centralBody === 'moon') {
      gradient.addColorStop(0, '#e0e0e0');
      gradient.addColorStop(1, '#9e9e9e');
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, bodyRadius * scale, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw orbits
    orbitalObjects.forEach(obj => {
      const points = calculateOrbitPoints(obj);
      
      // Draw orbital path with gradient or dash pattern based on type
      ctx.beginPath();
      const firstPoint = points[0];
      ctx.moveTo(centerX + firstPoint.x * scale, centerY - firstPoint.y * scale);
      
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        ctx.lineTo(centerX + point.x * scale, centerY - point.y * scale);
      }
      
      // Use dashed lines for transfer orbits
      if (obj.name.includes('Transfer')) {
        ctx.setLineDash([5, 3]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.strokeStyle = obj.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw periapsis and apoapsis markers for each orbit
      const a = obj.semiMajorAxis;
      const e = obj.eccentricity;
      const omega = obj.argumentOfPeriapsis * Math.PI / 180;
      
      // Calculate periapsis and apoapsis positions
      const periapsisDistance = a * (1 - e);
      const apoapsisDistance = a * (1 + e);
      
      // Periapsis position (direction based on argument of periapsis)
      const periX = periapsisDistance * Math.cos(omega);
      const periY = periapsisDistance * Math.sin(omega);
      
      // Apoapsis position (opposite direction from periapsis)
      const apoX = -apoapsisDistance * Math.cos(omega);
      const apoY = -apoapsisDistance * Math.sin(omega);
      
      // Draw periapsis marker (small circle)
      ctx.beginPath();
      ctx.arc(
        centerX + periX * scale, 
        centerY - periY * scale, 
        3, 0, 2 * Math.PI
      );
      ctx.fillStyle = obj.color;
      ctx.fill();
      
      // Draw apoapsis marker (small square)
      ctx.fillRect(
        centerX + apoX * scale - 3, 
        centerY - apoY * scale - 3,
        6, 6
      );
      
      // Draw spacecraft position if simulation is running
      if (simulationTime > 0) {
        const position = calculatePositionAtTime(obj, simulationTime);
        
        // Draw spacecraft
        ctx.beginPath();
        ctx.arc(
          centerX + position.x * scale, 
          centerY - position.y * scale, 
          5, 0, 2 * Math.PI
        );
        ctx.fillStyle = obj.color;
        ctx.fill();
        
        // Draw orbit trace (fading trail)
        if (obj.trail) {
          // Draw the trail points
          for (let i = 0; i < obj.trail.length; i++) {
            const point = obj.trail[i];
            const alpha = i / obj.trail.length; // Fade out older points
            
            ctx.beginPath();
            ctx.arc(
              centerX + point.x * scale,
              centerY - point.y * scale,
              2, 0, 2 * Math.PI
            );
            ctx.fillStyle = `${obj.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
          }
        }
        
        // Draw label for spacecraft
        ctx.fillStyle = darkMode ? '#ffffff' : '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          obj.name, 
          centerX + position.x * scale, 
          centerY - position.y * scale - 12
        );
      }
    });
    
    // Draw legend and scale
    const textColor = darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    ctx.fillStyle = textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Scale: 1 pixel = ${(1/scale).toFixed(1)} km`, 10, 20);
    ctx.fillText(`Central body: ${body.name}`, 10, 40);
    ctx.fillText(`Simulation time: ${simulationTime.toFixed(1)} s`, 10, 60);
    
    // Draw additional orbit information if needed
    if (orbitalObjects.length === 1) {
      const obj = orbitalObjects[0];
      const period = 2 * Math.PI * Math.sqrt(Math.pow(obj.semiMajorAxis, 3) / body.mu);
      ctx.fillText(`Orbital period: ${(period / 60).toFixed(1)} minutes`, 10, 80);
    }
    
    // Draw navigation instructions when zoomed
    if (zoomLevel > 1.5) {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.fillRect(width - 220, height - 35, 210, 25);
      ctx.fillStyle = 'white';
      ctx.textAlign = 'right';
      ctx.fillText('Click and drag to pan view', width - 15, height - 18);
    }
  };
  
  // Animation loop
  const animate = (timestamp) => {
    if (!isRunning) return;
    
    // Update simulation time
    const newTime = simulationTime + 0.1 * timeScale;
    setSimulationTime(newTime);
    
    // Calculate current positions without updating the whole object state
    // This prevents the React state update from blocking the animation
    const objectsWithTrails = orbitalObjects.map(obj => {
      // Calculate current position
      const position = calculatePositionAtTime(obj, newTime);
      
      // Add position to trail
      const maxTrailLength = 50;
      const trail = obj.trail || [];
      const newTrail = [...trail, position];
      
      // Keep only the last maxTrailLength points
      if (newTrail.length > maxTrailLength) {
        newTrail.shift();
      }
      
      return {
        ...obj,
        trail: newTrail,
        currentPosition: position // Store current position for rendering
      };
    });
    
    // Directly render with the calculated positions without waiting for state updates
    renderOrbitsWithPositions(objectsWithTrails, newTime);
    
    // Schedule the next frame
    animationRef.current = requestAnimationFrame(animate);
  };
  
  // Separate rendering function that doesn't depend on state updates
  const renderOrbitsWithPositions = (objectsWithPositions, currentTime) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Center of canvas
    const centerX = width / 2 + viewOffset.x;
    const centerY = height / 2 + viewOffset.y;
    
    // Scale factor (pixels per km)
    const body = centralBodies[centralBody];
    const bodyRadius = body.radius;
    
    // Find maximum orbit radius to set scale
    let maxDistance = 0;
    objectsWithPositions.forEach(obj => {
      const a = obj.semiMajorAxis;
      const e = obj.eccentricity;
      const apoapsis = a * (1 + e);
      if (apoapsis > maxDistance) maxDistance = apoapsis;
    });
    
    // Set scale to fit largest orbit with margin
    const scaleBase = Math.min(width, height) * 0.45 / maxDistance;
    const scale = scaleBase * zoomLevel;
    
    // Draw grid (optional)
    if (darkMode) {
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    } else {
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
    }
    ctx.lineWidth = 1;
    
    // Draw coordinate grid
    const gridSize = Math.ceil(maxDistance / 4) * 1000; // Round to nearest 1000 km
    const gridStep = gridSize * scale;
    
    for (let i = -4; i <= 4; i++) {
      // Vertical lines
      ctx.beginPath();
      ctx.moveTo(centerX + i * gridStep, 0);
      ctx.lineTo(centerX + i * gridStep, height);
      ctx.stroke();
      
      // Horizontal lines
      ctx.beginPath();
      ctx.moveTo(0, centerY + i * gridStep);
      ctx.lineTo(width, centerY + i * gridStep);
      ctx.stroke();
    }
    
    // Draw central body with gradient
    const gradient = ctx.createRadialGradient(
      centerX, centerY, 0,
      centerX, centerY, bodyRadius * scale
    );
    
    // Set gradient colors based on the central body
    if (centralBody === 'earth') {
      gradient.addColorStop(0, '#4286f4');
      gradient.addColorStop(1, '#2356b4');
    } else if (centralBody === 'mars') {
      gradient.addColorStop(0, '#f4a582');
      gradient.addColorStop(1, '#d73027');
    } else if (centralBody === 'moon') {
      gradient.addColorStop(0, '#e0e0e0');
      gradient.addColorStop(1, '#9e9e9e');
    }
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, bodyRadius * scale, 0, 2 * Math.PI);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw orbits
    objectsWithPositions.forEach(obj => {
      const points = calculateOrbitPoints(obj);
      
      // Draw orbital path with gradient or dash pattern based on type
      ctx.beginPath();
      const firstPoint = points[0];
      ctx.moveTo(centerX + firstPoint.x * scale, centerY - firstPoint.y * scale);
      
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        ctx.lineTo(centerX + point.x * scale, centerY - point.y * scale);
      }
      
      // Use dashed lines for transfer orbits
      if (obj.name.includes('Transfer')) {
        ctx.setLineDash([5, 3]);
      } else {
        ctx.setLineDash([]);
      }
      
      ctx.strokeStyle = obj.color;
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw periapsis and apoapsis markers for each orbit
      const a = obj.semiMajorAxis;
      const e = obj.eccentricity;
      const omega = obj.argumentOfPeriapsis * Math.PI / 180;
      
      // Calculate periapsis and apoapsis positions
      const periapsisDistance = a * (1 - e);
      const apoapsisDistance = a * (1 + e);
      
      // Periapsis position (direction based on argument of periapsis)
      const periX = periapsisDistance * Math.cos(omega);
      const periY = periapsisDistance * Math.sin(omega);
      
      // Apoapsis position (opposite direction from periapsis)
      const apoX = -apoapsisDistance * Math.cos(omega);
      const apoY = -apoapsisDistance * Math.sin(omega);
      
      // Draw periapsis marker (small circle)
      ctx.beginPath();
      ctx.arc(
        centerX + periX * scale, 
        centerY - periY * scale, 
        3, 0, 2 * Math.PI
      );
      ctx.fillStyle = obj.color;
      ctx.fill();
      
      // Draw apoapsis marker (small square)
      ctx.fillRect(
        centerX + apoX * scale - 3, 
        centerY - apoY * scale - 3,
        6, 6
      );
      
      // Draw spacecraft position if simulation is running
      if (currentTime > 0 && obj.currentPosition) {
        const position = obj.currentPosition;
        
        // Draw spacecraft
        ctx.beginPath();
        ctx.arc(
          centerX + position.x * scale, 
          centerY - position.y * scale, 
          5, 0, 2 * Math.PI
        );
        ctx.fillStyle = obj.color;
        ctx.fill();
        
        // Draw orbit trace (fading trail)
        if (obj.trail) {
          // Draw the trail points
          for (let i = 0; i < obj.trail.length; i++) {
            const point = obj.trail[i];
            const alpha = i / obj.trail.length; // Fade out older points
            
            ctx.beginPath();
            ctx.arc(
              centerX + point.x * scale,
              centerY - point.y * scale,
              2, 0, 2 * Math.PI
            );
            ctx.fillStyle = `${obj.color}${Math.floor(alpha * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
          }
        }
        
        // Draw label for spacecraft
        ctx.fillStyle = darkMode ? '#ffffff' : '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          obj.name, 
          centerX + position.x * scale, 
          centerY - position.y * scale - 12
        );
      }
    });
    
    // Draw legend and scale
    const textColor = darkMode ? 'rgba(255, 255, 255, 0.9)' : 'rgba(0, 0, 0, 0.9)';
    ctx.fillStyle = textColor;
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Scale: 1 pixel = ${(1/scale).toFixed(1)} km`, 10, 20);
    ctx.fillText(`Central body: ${body.name}`, 10, 40);
    ctx.fillText(`Simulation time: ${currentTime.toFixed(1)} s`, 10, 60);
    
    // Draw additional orbit information if needed
    if (objectsWithPositions.length === 1) {
      const obj = objectsWithPositions[0];
      const period = 2 * Math.PI * Math.sqrt(Math.pow(obj.semiMajorAxis, 3) / body.mu);
      ctx.fillText(`Orbital period: ${(period / 60).toFixed(1)} minutes`, 10, 80);
    }
    
    // Store the last successful rendering to avoid flicker during React updates
    lastRenderData.current = {
      objects: objectsWithPositions,
      time: currentTime
    };
  };
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (canvas) {
        const parentBox = canvas.parentElement.getBoundingClientRect();
        canvas.width = parentBox.width;
        canvas.height = 500;
        renderOrbits();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Effect hooks
  useEffect(() => {
    renderOrbits();
  }, [orbitalObjects, centralBody, zoomLevel, viewOffset]);
  
  useEffect(() => {
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning, timeScale]);
  
  // Add mouse event handlers for canvas navigation
  const handleCanvasMouseDown = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    setIsDragging(true);
    setDragStart({ 
      x: e.clientX - viewOffset.x, 
      y: e.clientY - viewOffset.y 
    });
  };
  
  const handleCanvasMouseMove = (e) => {
    if (!isDragging) return;
    
    const newOffsetX = e.clientX - dragStart.x;
    const newOffsetY = e.clientY - dragStart.y;
    setViewOffset({ x: newOffsetX, y: newOffsetY });
    
    // Re-render immediately to avoid lag
    renderOrbits();
  };
  
  const handleCanvasMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleCanvasWheel = (e) => {
    e.preventDefault();
    
    // Zoom in/out with mouse wheel
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(10, zoomLevel * zoomFactor));
    setZoomLevel(newZoom);
    
    // Center zoom on mouse position (more natural)
    // const canvas = canvasRef.current;
    // if (canvas) {
    //   const rect = canvas.getBoundingClientRect();
    //   const mouseX = e.clientX - rect.left;
    //   const mouseY = e.clientY - rect.top;
    //   const centerX = canvas.width / 2;
    //   const centerY = canvas.height / 2;
    //   
    //   // Adjust offset to zoom toward mouse position
    //   setViewOffset({
    //     x: viewOffset.x + (mouseX - centerX) * (1 - zoomFactor),
    //     y: viewOffset.y + (mouseY - centerY) * (1 - zoomFactor)
    //   });
    // }
  };
  
  useEffect(() => {
    // Initialize canvas
    const canvas = canvasRef.current;
    if (canvas) {
      // Set canvas size to parent container size
      const parentBox = canvas.parentElement.getBoundingClientRect();
      canvas.width = parentBox.width;
      canvas.height = 500;
      
      // Add mouse event listeners for navigation
      canvas.addEventListener('mousedown', handleCanvasMouseDown);
      canvas.addEventListener('mousemove', handleCanvasMouseMove);
      canvas.addEventListener('mouseup', handleCanvasMouseUp);
      canvas.addEventListener('mouseleave', handleCanvasMouseUp);
      canvas.addEventListener('wheel', handleCanvasWheel);
      
      renderOrbits();
    }
    
    // Cleanup on unmount
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (canvas) {
        canvas.removeEventListener('mousedown', handleCanvasMouseDown);
        canvas.removeEventListener('mousemove', handleCanvasMouseMove);
        canvas.removeEventListener('mouseup', handleCanvasMouseUp);
        canvas.removeEventListener('mouseleave', handleCanvasMouseUp);
        canvas.removeEventListener('wheel', handleCanvasWheel);
      }
    };
  }, []);
  
  // Track central body changes
  useEffect(() => {
    renderOrbits();
  }, [centralBody]);
  
  // Track preset changes
  useEffect(() => {
    if (selectedPreset) {
      applyPreset(selectedPreset);
    }
  }, [selectedPreset]);
  
  return (
    <Card elevation={3} sx={{ mb: 4, overflow: 'visible' }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Orbital Mechanics Simulator
        </Typography>
        
        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <Paper 
                elevation={1} 
                sx={{ 
                  width: '100%', 
                  height: '500px', 
                  bgcolor: darkMode ? '#1a1a2e' : '#f0f5ff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  overflow: 'hidden'
                }}
              >
                <canvas ref={canvasRef} />
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={1} sx={{ p: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>Simulation Controls</Typography>
                
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Button 
                    variant="contained" 
                    color={isRunning ? "secondary" : "primary"} 
                    startIcon={isRunning ? <Pause /> : <PlayArrow />}
                    onClick={toggleSimulation}
                    fullWidth
                  >
                    {isRunning ? "Pause" : "Start"}
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    startIcon={<Refresh />}
                    onClick={resetSimulation}
                    fullWidth
                  >
                    Reset
                  </Button>
                </Box>
                
                <Typography gutterBottom>Time Scale</Typography>
                <Slider
                  value={timeScale}
                  onChange={(_, newValue) => setTimeScale(newValue)}
                  min={0.1}
                  max={10}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1x' },
                    { value: 1, label: '1x' },
                    { value: 10, label: '10x' }
                  ]}
                  valueLabelDisplay="auto"
                />
                
                <Typography gutterBottom>Zoom Level</Typography>
                <Slider
                  value={zoomLevel}
                  onChange={(_, newValue) => setZoomLevel(newValue)}
                  min={0.1}
                  max={5}
                  step={0.1}
                  marks={[
                    { value: 0.1, label: '0.1x' },
                    { value: 1, label: '1x' },
                    { value: 5, label: '5x' }
                  ]}
                  valueLabelDisplay="auto"
                />
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Central Body</InputLabel>
                  <Select
                    value={centralBody}
                    onChange={(e) => setCentralBody(e.target.value)}
                    label="Central Body"
                  >
                    <MenuItem value="earth">Earth</MenuItem>
                    <MenuItem value="mars">Mars</MenuItem>
                    <MenuItem value="moon">Moon</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mt: 2 }}>
                  <InputLabel>Presets</InputLabel>
                  <Select
                    value={selectedPreset}
                    onChange={(e) => setSelectedPreset(e.target.value)}
                    label="Presets"
                  >
                    <MenuItem value="">Custom</MenuItem>
                    <MenuItem value="iss">ISS Orbit</MenuItem>
                    <MenuItem value="geostationary">Geostationary Orbit</MenuItem>
                    <MenuItem value="molniya">Molniya Orbit</MenuItem>
                    <MenuItem value="hohmannTransfer">Hohmann Transfer (LEO to GEO)</MenuItem>
                    <MenuItem value="lunarTransfer">Earth-Moon Transfer</MenuItem>
                  </Select>
                </FormControl>
              </Paper>
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Orbital Objects
            <Tooltip title="Add a new orbital object">
              <IconButton 
                color="primary" 
                size="small" 
                onClick={addOrbitalObject}
                sx={{ ml: 1 }}
              >
                <AddCircleOutline />
              </IconButton>
            </Tooltip>
          </Typography>
          
          {orbitalObjects.map((obj, index) => (
            <Paper key={index} elevation={1} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={10}>
                  <TextField
                    label="Name"
                    value={obj.name}
                    onChange={(e) => updateOrbitalObject(index, 'name', e.target.value)}
                    size="small"
                    fullWidth
                    sx={{ mb: 2 }}
                  />
                </Grid>
                <Grid item xs={2} textAlign="right">
                  <Tooltip title="Remove this orbital object">
                    <IconButton 
                      color="error" 
                      size="small" 
                      onClick={() => removeOrbitalObject(index)}
                      disabled={orbitalObjects.length <= 1}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </Tooltip>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Semi-Major Axis (km)</Typography>
                  <Slider
                    value={obj.semiMajorAxis}
                    onChange={(_, newValue) => updateOrbitalObject(index, 'semiMajorAxis', newValue)}
                    min={centralBodies[centralBody].radius + 100}
                    max={100000}
                    step={100}
                    valueLabelDisplay="auto"
                  />
                  <TextField
                    type="number"
                    value={obj.semiMajorAxis}
                    onChange={(e) => updateOrbitalObject(index, 'semiMajorAxis', Number(e.target.value))}
                    size="small"
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Eccentricity</Typography>
                  <Slider
                    value={obj.eccentricity}
                    onChange={(_, newValue) => updateOrbitalObject(index, 'eccentricity', newValue)}
                    min={0}
                    max={0.9}
                    step={0.01}
                    valueLabelDisplay="auto"
                  />
                  <TextField
                    type="number"
                    value={obj.eccentricity}
                    onChange={(e) => updateOrbitalObject(index, 'eccentricity', Number(e.target.value))}
                    size="small"
                    inputProps={{ min: 0, max: 0.9, step: 0.01 }}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Inclination (degrees)</Typography>
                  <Slider
                    value={obj.inclination}
                    onChange={(_, newValue) => updateOrbitalObject(index, 'inclination', newValue)}
                    min={0}
                    max={180}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                  <TextField
                    type="number"
                    value={obj.inclination}
                    onChange={(e) => updateOrbitalObject(index, 'inclination', Number(e.target.value))}
                    size="small"
                    inputProps={{ min: 0, max: 180, step: 1 }}
                    fullWidth
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Typography gutterBottom>Argument of Periapsis (degrees)</Typography>
                  <Slider
                    value={obj.argumentOfPeriapsis}
                    onChange={(_, newValue) => updateOrbitalObject(index, 'argumentOfPeriapsis', newValue)}
                    min={0}
                    max={360}
                    step={1}
                    valueLabelDisplay="auto"
                  />
                  <TextField
                    type="number"
                    value={obj.argumentOfPeriapsis}
                    onChange={(e) => updateOrbitalObject(index, 'argumentOfPeriapsis', Number(e.target.value))}
                    size="small"
                    inputProps={{ min: 0, max: 360, step: 1 }}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
        
        <Divider sx={{ my: 3 }} />
        
        <Box>
          <Typography variant="h6" gutterBottom>
            Orbital Mechanics Explained
            <Tooltip title="Educational information about orbital mechanics">
              <IconButton size="small" sx={{ ml: 1 }}>
                <InfoOutlined />
              </IconButton>
            </Tooltip>
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Kepler's Laws</Typography>
              <Typography variant="body2">
                1. All planets move in elliptical orbits, with the sun at one focus.
                <br />
                2. A line joining a planet and the sun sweeps out equal areas in equal times.
                <br />
                3. The square of the orbital period is proportional to the cube of the semi-major axis.
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', color: 'text.secondary' }}>
                Period = 2π√(a³/μ), where μ is the gravitational parameter.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Orbital Elements</Typography>
              <Typography variant="body2">
                <strong>Semi-Major Axis (a):</strong> Half the longest diameter of the elliptical orbit.
                <br />
                <strong>Eccentricity (e):</strong> Measures how much the orbit deviates from a circle (e=0).
                <br />
                <strong>Inclination (i):</strong> Angle between the orbit plane and reference plane.
                <br />
                <strong>Argument of Periapsis (ω):</strong> Defines the orientation of the ellipse in the orbital plane.
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" gutterBottom>Orbital Maneuvers</Typography>
              <Typography variant="body2">
                <strong>Hohmann Transfer:</strong> Fuel-efficient elliptical orbit used to transfer between two circular orbits.
                <br />
                <strong>Bi-Elliptic Transfer:</strong> More efficient than Hohmann for large orbit changes.
                <br />
                <strong>Inclination Change:</strong> Changing the angle of an orbit, typically expensive in terms of fuel.
                <br />
                <strong>Orbital Phasing:</strong> Adjusting position within the same orbit.
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
};

export default OrbitalMechanicsSimulator;