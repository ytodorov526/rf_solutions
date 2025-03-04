import React, { useRef, useEffect, useState } from 'react';
import { Box, Paper, Typography, Slider, FormControl, InputLabel, Select, MenuItem, Grid, Button } from '@mui/material';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const antennaTypes = [
  { 
    name: 'Dipole', 
    description: 'A dipole antenna consists of two conductive elements such as metal wires or rods.',
    pattern: 'omnidirectional',
    gain: '2.15 dBi'
  },
  { 
    name: 'Yagi-Uda', 
    description: 'A directional antenna consisting of a driven element and additional parasitic elements.',
    pattern: 'directional',
    gain: '8-20 dBi'
  },
  { 
    name: 'Parabolic', 
    description: 'A high-gain reflector antenna that uses a parabolic reflector to direct radio waves.',
    pattern: 'highly directional',
    gain: '15-45 dBi'
  },
  { 
    name: 'Patch', 
    description: 'A low-profile antenna that consists of a flat rectangular sheet or patch of metal.',
    pattern: 'directional',
    gain: '5-8 dBi'
  }
];

function AntennaVisualizer() {
  const mountRef = useRef(null);
  const controlsRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const patternMeshRef = useRef(null);

  const [antennaType, setAntennaType] = useState('Dipole');
  const [frequency, setFrequency] = useState(2.4);
  const [gain, setGain] = useState(2.15);
  const [rotating, setRotating] = useState(true);

  // Setup and cleanup Three.js scene
  useEffect(() => {
    if (!mountRef.current) return;

    // Create scene, camera, and renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controlsRef.current = controls;

    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 10, 10);
    scene.add(directionalLight);

    // Add coordinate axes for reference
    const axesHelper = new THREE.AxesHelper(3);
    scene.add(axesHelper);

    // Create ground grid
    const gridHelper = new THREE.GridHelper(10, 10);
    gridHelper.position.y = -1.5;
    scene.add(gridHelper);

    // Animation loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      if (rotating && patternMeshRef.current) {
        patternMeshRef.current.rotation.y += 0.005;
      }
      
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Initial antenna creation
    createAntenna(antennaType, gain);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement);
      }
      
      // Dispose of geometries and materials
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    };
  }, []);

  // Update antenna visualization when type or gain changes
  useEffect(() => {
    createAntenna(antennaType, gain);
  }, [antennaType, gain]);

  const createAntenna = (type, gainValue) => {
    if (!sceneRef.current) return;

    // Remove previous antenna and pattern
    if (patternMeshRef.current) {
      sceneRef.current.remove(patternMeshRef.current);
    }

    // Clear all meshes except helpers
    sceneRef.current.children = sceneRef.current.children.filter(
      child => child.type === 'AmbientLight' || 
              child.type === 'DirectionalLight' || 
              child.type === 'GridHelper' || 
              child.type === 'AxesHelper'
    );

    // Create antenna base
    const baseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 0.2, 32);
    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = -1.4;
    sceneRef.current.add(base);

    // Create antenna and radiation pattern based on type
    switch (type) {
      case 'Dipole':
        createDipoleAntenna();
        createOmnidirectionalPattern(gainValue);
        break;
      case 'Yagi-Uda':
        createYagiAntenna();
        createDirectionalPattern(gainValue, 0.3);
        break;
      case 'Parabolic':
        createParabolicAntenna();
        createDirectionalPattern(gainValue, 0.15);
        break;
      case 'Patch':
        createPatchAntenna();
        createHemisphericalPattern(gainValue, 0.6);
        break;
      default:
        createDipoleAntenna();
        createOmnidirectionalPattern(gainValue);
    }
  };

  const createDipoleAntenna = () => {
    // Main dipole element
    const dipoleGeometry = new THREE.CylinderGeometry(0.03, 0.03, 2, 32);
    const dipoleMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0 });
    const dipole = new THREE.Mesh(dipoleGeometry, dipoleMaterial);
    sceneRef.current.add(dipole);

    // Feed point
    const feedGeometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
    const feedMaterial = new THREE.MeshStandardMaterial({ color: 0xffaa00 });
    const feed = new THREE.Mesh(feedGeometry, feedMaterial);
    sceneRef.current.add(feed);
  };

  const createYagiAntenna = () => {
    // Boom (horizontal support)
    const boomGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 32);
    const boomMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const boom = new THREE.Mesh(boomGeometry, boomMaterial);
    boom.rotation.z = Math.PI / 2;
    sceneRef.current.add(boom);

    // Driven element (dipole)
    const drivenGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.5, 32);
    const drivenMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0 });
    const driven = new THREE.Mesh(drivenGeometry, drivenMaterial);
    driven.position.z = 0;
    sceneRef.current.add(driven);

    // Reflector element
    const reflectorGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.7, 32);
    const reflectorMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0 });
    const reflector = new THREE.Mesh(reflectorGeometry, reflectorMaterial);
    reflector.position.x = -0.8;
    sceneRef.current.add(reflector);

    // Director elements
    for (let i = 1; i <= 3; i++) {
      const directorGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1.3 - i * 0.1, 32);
      const directorMaterial = new THREE.MeshStandardMaterial({ color: 0xa0a0a0 });
      const director = new THREE.Mesh(directorGeometry, directorMaterial);
      director.position.x = i * 0.5;
      sceneRef.current.add(director);
    }
  };

  const createParabolicAntenna = () => {
    // Parabolic dish
    const dishGeometry = new THREE.SphereGeometry(1.5, 32, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xcccccc, 
      side: THREE.DoubleSide,
      metalness: 0.7,
      roughness: 0.2
    });
    const dish = new THREE.Mesh(dishGeometry, dishMaterial);
    dish.rotation.x = Math.PI;
    dish.scale.z = 0.7; // Make it more parabolic
    sceneRef.current.add(dish);

    // Feed horn
    const feedGeometry = new THREE.CylinderGeometry(0.15, 0.25, 0.5, 32);
    const feedMaterial = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const feed = new THREE.Mesh(feedGeometry, feedMaterial);
    feed.position.z = 0.8;
    feed.rotation.x = Math.PI / 2;
    sceneRef.current.add(feed);

    // Support struts
    for (let i = 0; i < 3; i++) {
      const strutGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.6, 16);
      const strutMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const strut = new THREE.Mesh(strutGeometry, strutMaterial);
      strut.position.z = 0.4;
      strut.rotation.x = Math.PI / 4;
      strut.rotation.y = i * Math.PI * 2 / 3;
      sceneRef.current.add(strut);
    }
  };

  const createPatchAntenna = () => {
    // Ground plane
    const groundGeometry = new THREE.BoxGeometry(1.5, 0.05, 1.5);
    const groundMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x777777,
      metalness: 0.8,
      roughness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -0.5;
    sceneRef.current.add(ground);

    // Dielectric substrate
    const substrateGeometry = new THREE.BoxGeometry(1.2, 0.1, 1.2);
    const substrateMaterial = new THREE.MeshStandardMaterial({ 
      color: 0x81c784,
      transparent: true,
      opacity: 0.7
    });
    const substrate = new THREE.Mesh(substrateGeometry, substrateMaterial);
    substrate.position.y = -0.4;
    sceneRef.current.add(substrate);

    // Patch element
    const patchGeometry = new THREE.BoxGeometry(0.8, 0.02, 0.8);
    const patchMaterial = new THREE.MeshStandardMaterial({ 
      color: 0xc0c0c0,
      metalness: 0.8,
      roughness: 0.1
    });
    const patch = new THREE.Mesh(patchGeometry, patchMaterial);
    patch.position.y = -0.35;
    sceneRef.current.add(patch);

    // Feed line
    const feedGeometry = new THREE.BoxGeometry(0.1, 0.02, 0.5);
    const feedMaterial = new THREE.MeshStandardMaterial({ color: 0xc0c0c0 });
    const feed = new THREE.Mesh(feedGeometry, feedMaterial);
    feed.position.y = -0.35;
    feed.position.z = 0.65;
    sceneRef.current.add(feed);
  };

  const createOmnidirectionalPattern = (gainValue) => {
    // Create donut shape for omnidirectional pattern
    const scale = 0.5 + gainValue / 5;
    const torusGeometry = new THREE.TorusGeometry(scale, 0.1, 16, 100);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x2196f3,
      transparent: true,
      opacity: 0.4
    });
    const torus = new THREE.Mesh(torusGeometry, material);
    
    // Add wireframe
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x0d47a1, 
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const wireframe = new THREE.Mesh(torusGeometry, wireframeMaterial);
    
    // Create group to hold pattern
    const group = new THREE.Group();
    group.add(torus);
    group.add(wireframe);
    
    // Add second torus rotated 90 degrees
    const torus2 = new THREE.Mesh(torusGeometry, material);
    torus2.rotation.x = Math.PI / 2;
    const wireframe2 = new THREE.Mesh(torusGeometry, wireframeMaterial);
    wireframe2.rotation.x = Math.PI / 2;
    
    group.add(torus2);
    group.add(wireframe2);
    
    sceneRef.current.add(group);
    patternMeshRef.current = group;
  };

  const createDirectionalPattern = (gainValue, beamwidth) => {
    // Higher gain means narrower beamwidth
    const scale = 0.5 + gainValue / 5;
    const adj_beamwidth = beamwidth * (10 / gainValue);
    
    // Create teardrop shape for directional pattern
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const angle = (i / 20) * Math.PI;
      const x = scale * Math.sin(angle);
      // Shape narrows based on beamwidth parameter
      const y = scale * Math.cos(angle) * Math.pow(Math.sin(angle), adj_beamwidth);
      points.push(new THREE.Vector2(x, y));
    }
    
    const latheGeometry = new THREE.LatheGeometry(points, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0x4caf50,
      transparent: true,
      opacity: 0.4
    });
    const pattern = new THREE.Mesh(latheGeometry, material);
    pattern.rotation.x = Math.PI;
    
    // Add wireframe
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x1b5e20, 
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const wireframe = new THREE.Mesh(latheGeometry, wireframeMaterial);
    wireframe.rotation.x = Math.PI;
    
    // Create group to hold pattern
    const group = new THREE.Group();
    group.add(pattern);
    group.add(wireframe);
    
    sceneRef.current.add(group);
    patternMeshRef.current = group;
  };

  const createHemisphericalPattern = (gainValue, coverage) => {
    const scale = 0.5 + gainValue / 5;
    
    // Create hemisphere for pattern
    const sphereGeometry = new THREE.SphereGeometry(
      scale, 32, 32, 
      0, Math.PI * 2,
      0, Math.PI * coverage
    );
    
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xff9800,
      transparent: true,
      opacity: 0.4,
      side: THREE.DoubleSide
    });
    const pattern = new THREE.Mesh(sphereGeometry, material);
    
    // Add wireframe
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xe65100, 
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const wireframe = new THREE.Mesh(sphereGeometry, wireframeMaterial);
    
    // Create group to hold pattern
    const group = new THREE.Group();
    group.add(pattern);
    group.add(wireframe);
    
    sceneRef.current.add(group);
    patternMeshRef.current = group;
  };

  const handleAntennaChange = (event) => {
    const newType = event.target.value;
    setAntennaType(newType);
    
    // Set appropriate default gain for antenna type
    switch(newType) {
      case 'Dipole':
        setGain(2.15);
        break;
      case 'Yagi-Uda':
        setGain(12);
        break;
      case 'Parabolic':
        setGain(30);
        break;
      case 'Patch':
        setGain(6);
        break;
      default:
        setGain(2.15);
    }
  };

  const handleGainChange = (event, newValue) => {
    setGain(newValue);
  };

  const handleFrequencyChange = (event, newValue) => {
    setFrequency(newValue);
  };

  const toggleRotation = () => {
    setRotating(!rotating);
  };

  // Get current antenna info
  const currentAntenna = antennaTypes.find(ant => ant.name === antennaType) || antennaTypes[0];

  return (
    <Paper elevation={3} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
        <Typography variant="h5" component="h3" align="center">
          3D Antenna Pattern Visualizer
        </Typography>
      </Box>
      
      <Grid container>
        <Grid item xs={12} md={8}>
          <Box
            ref={mountRef}
            sx={{
              width: '100%',
              height: '400px',
              position: 'relative',
              '& canvas': {
                outline: 'none',
              },
            }}
          />
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Box sx={{ p: 3 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Antenna Type</InputLabel>
              <Select
                value={antennaType}
                label="Antenna Type"
                onChange={handleAntennaChange}
              >
                {antennaTypes.map((antenna) => (
                  <MenuItem key={antenna.name} value={antenna.name}>
                    {antenna.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            
            <Typography gutterBottom>Gain (dBi)</Typography>
            <Slider
              value={gain}
              onChange={handleGainChange}
              min={0}
              max={antennaType === 'Parabolic' ? 45 : 20}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />
            
            <Typography gutterBottom>Frequency (GHz)</Typography>
            <Slider
              value={frequency}
              onChange={handleFrequencyChange}
              min={0.1}
              max={10}
              step={0.1}
              valueLabelDisplay="auto"
              sx={{ mb: 3 }}
            />
            
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={toggleRotation}
              sx={{ mb: 3 }}
            >
              {rotating ? 'Stop Rotation' : 'Start Rotation'}
            </Button>
            
            <Typography variant="h6" gutterBottom>
              {currentAntenna.name}
            </Typography>
            <Typography variant="body2" gutterBottom>
              {currentAntenna.description}
            </Typography>
            <Typography variant="body2" gutterBottom>
              <strong>Pattern:</strong> {currentAntenna.pattern}
            </Typography>
            <Typography variant="body2">
              <strong>Typical Gain:</strong> {currentAntenna.gain}
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default AntennaVisualizer;