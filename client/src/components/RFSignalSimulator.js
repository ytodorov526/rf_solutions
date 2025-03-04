import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Slider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TextField,
  Tooltip,
  Divider,
  Chip,
  Stack,
  CircularProgress,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SaveIcon from '@mui/icons-material/Save';
import DownloadIcon from '@mui/icons-material/Download';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import CloseIcon from '@mui/icons-material/Close';
import InfoIcon from '@mui/icons-material/Info';

function RFSignalSimulator() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const theme = useTheme();
  
  // Simulation parameters
  const [running, setRunning] = useState(false);
  const [modulationType, setModulationType] = useState('AM');
  const [carrierFrequency, setCarrierFrequency] = useState(100);
  const [modulationFrequency, setModulationFrequency] = useState(5);
  const [amplitude, setAmplitude] = useState(0.8);
  const [modulationIndex, setModulationIndex] = useState(0.5);
  const [snr, setSnr] = useState(20); // Signal-to-Noise Ratio in dB
  const [phaseShift, setPhaseShift] = useState(0);
  const [samplingRate, setSamplingRate] = useState(1000);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [showNoise, setShowNoise] = useState(true);
  const [currentPreset, setCurrentPreset] = useState(null);
  const [presetInfoOpen, setPresetInfoOpen] = useState(false);
  
  // Signal data
  const [dataPoints, setDataPoints] = useState({
    time: [],
    carrier: [],
    modulated: [],
    demodulated: [],
    noise: []
  });
  
  // Pre-defined waveform presets
  const presets = [
    // AM Presets
    { name: "AM Broadcast", modulationType: "AM", carrierFreq: 100, modFreq: 5, modIndex: 0.8, snr: 25, category: "AM" },
    { name: "AM Voice", modulationType: "AM", carrierFreq: 120, modFreq: 3, modIndex: 0.5, snr: 20, category: "AM" },
    { name: "AM Deep Modulation", modulationType: "AM", carrierFreq: 80, modFreq: 4, modIndex: 0.95, snr: 28, category: "AM" },
    { name: "AM Shortwave", modulationType: "AM", carrierFreq: 150, modFreq: 2, modIndex: 0.6, snr: 15, category: "AM" },
    
    // FM Presets
    { name: "FM Radio", modulationType: "FM", carrierFreq: 150, modFreq: 10, modIndex: 1.5, snr: 30, category: "FM" },
    { name: "FM Narrowband", modulationType: "FM", carrierFreq: 180, modFreq: 5, modIndex: 0.8, snr: 25, category: "FM" },
    { name: "FM Wideband", modulationType: "FM", carrierFreq: 200, modFreq: 15, modIndex: 3.0, snr: 35, category: "FM" },
    { name: "FM Telemetry", modulationType: "FM", carrierFreq: 250, modFreq: 25, modIndex: 2.0, snr: 32, category: "FM" },
    
    // Digital Presets
    { name: "QPSK Digital", modulationType: "QPSK", carrierFreq: 200, modFreq: 25, modIndex: 1.0, snr: 18, category: "Digital" },
    { name: "QPSK Satellite", modulationType: "QPSK", carrierFreq: 250, modFreq: 30, modIndex: 1.0, snr: 15, category: "Digital" },
    { name: "QPSK Mobile", modulationType: "QPSK", carrierFreq: 180, modFreq: 20, modIndex: 1.0, snr: 12, category: "Digital" },
    
    // Environmental Presets
    { name: "Noisy Channel", modulationType: "AM", carrierFreq: 100, modFreq: 5, modIndex: 0.7, snr: 5, category: "Environment" },
    { name: "Fading Channel", modulationType: "FM", carrierFreq: 120, modFreq: 8, modIndex: 1.2, snr: 10, category: "Environment" },
    { name: "High-Fidelity", modulationType: "FM", carrierFreq: 200, modFreq: 20, modIndex: 1.0, snr: 40, category: "Environment" },
    { name: "Urban Environment", modulationType: "QPSK", carrierFreq: 180, modFreq: 25, modIndex: 1.0, snr: 8, category: "Environment" },
    
    // Special Applications
    { name: "Radar Pulse", modulationType: "AM", carrierFreq: 300, modFreq: 50, modIndex: 1.0, snr: 35, category: "Special" },
    { name: "Sonar Signal", modulationType: "FM", carrierFreq: 80, modFreq: 2, modIndex: 4.0, snr: 25, category: "Special" },
    { name: "5G Signal", modulationType: "QPSK", carrierFreq: 350, modFreq: 40, modIndex: 1.0, snr: 22, category: "Special" }
  ];
  
  // Apply a preset
  const applyPreset = (preset) => {
    setRunning(false);
    setModulationType(preset.modulationType);
    setCarrierFrequency(preset.carrierFreq);
    setModulationFrequency(preset.modFreq);
    setModulationIndex(preset.modIndex);
    setSnr(preset.snr);
    setTimeElapsed(0);
    setCurrentPreset(preset);
    
    setTimeout(() => {
      generateSignalData(
        preset.modulationType,
        preset.carrierFreq,
        preset.modFreq,
        amplitude,
        preset.modIndex,
        preset.snr,
        phaseShift,
        samplingRate
      );
    }, 100);
  };
  
  // Show preset info dialog
  const showPresetInfo = (preset, event) => {
    event.stopPropagation();
    setCurrentPreset(preset);
    setPresetInfoOpen(true);
  };
  
  // Hide preset info dialog
  const hidePresetInfo = () => {
    setPresetInfoOpen(false);
  };
  
  // Start/pause simulation
  const toggleSimulation = () => {
    setRunning(!running);
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setRunning(false);
    setTimeElapsed(0);
    generateSignalData(
      modulationType,
      carrierFrequency,
      modulationFrequency,
      amplitude,
      modulationIndex,
      snr,
      phaseShift,
      samplingRate
    );
  };
  
  // Generate the data points for the signals
  const generateSignalData = (modType, carrierFreq, modFreq, amp, modIdx, signalNoise, phase, sampleRate) => {
    setProcessing(true);
    
    setTimeout(() => {
      const time = [];
      const carrier = [];
      const modulated = [];
      const demodulated = [];
      const noise = [];
      
      const duration = 1; // 1 second of data
      const numPoints = sampleRate * duration;
      const dt = 1 / sampleRate;
      
      const noiseAmplitude = amp / (10 ** (signalNoise / 20)); // Convert SNR from dB
      
      // Generate message signal (for visualization)
      const message = [];
      
      for (let i = 0; i < numPoints; i++) {
        const t = i * dt;
        time.push(t);
        
        let messageSignal;
        if (modType === 'QPSK') {
          // Simulate digital data for QPSK
          messageSignal = Math.sign(Math.sin(2 * Math.PI * modFreq * t * 4)) * amp/2;
        } else {
          // Analog signal for AM/FM
          messageSignal = amp/2 * Math.sin(2 * Math.PI * modFreq * t + phase);
        }
        message.push(messageSignal);
        
        // Carrier signal
        const carrierSignal = amp * Math.sin(2 * Math.PI * carrierFreq * t);
        carrier.push(carrierSignal);
        
        // Random noise component
        const noiseComponent = noiseAmplitude * (Math.random() * 2 - 1);
        noise.push(noiseComponent);
        
        // Modulated signal based on type
        let modulatedSignal;
        
        switch (modType) {
          case 'FM':
            // FM modulation
            modulatedSignal = amp * Math.sin(2 * Math.PI * carrierFreq * t + modIdx * Math.sin(2 * Math.PI * modFreq * t));
            break;
          case 'QPSK':
            // Simplified QPSK modulation
            const symbolIndex = Math.floor(t * modFreq * 4) % 4;
            const phaseAngles = [Math.PI/4, 3*Math.PI/4, 5*Math.PI/4, 7*Math.PI/4]; // Phase angles for QPSK
            modulatedSignal = amp * Math.sin(2 * Math.PI * carrierFreq * t + phaseAngles[symbolIndex]);
            break;
          case 'AM':
          default:
            // AM modulation
            modulatedSignal = amp * (1 + modIdx * Math.sin(2 * Math.PI * modFreq * t)) * Math.sin(2 * Math.PI * carrierFreq * t);
        }
        
        // Add noise to modulated signal
        modulatedSignal += showNoise ? noiseComponent : 0;
        modulated.push(modulatedSignal);
        
        // Simple demodulation (envelope detection for AM, frequency discrimination for FM)
        let demodulatedSignal;
        if (modType === 'FM') {
          // Simplified FM demodulation
          if (i > 0) {
            // Calculate phase difference between consecutive samples
            const prevPhase = Math.atan2(Math.sin(2 * Math.PI * carrierFreq * time[i-1] + modIdx * Math.sin(2 * Math.PI * modFreq * time[i-1])), 
                                        Math.cos(2 * Math.PI * carrierFreq * time[i-1] + modIdx * Math.sin(2 * Math.PI * modFreq * time[i-1])));
            const currentPhase = Math.atan2(Math.sin(2 * Math.PI * carrierFreq * t + modIdx * Math.sin(2 * Math.PI * modFreq * t)), 
                                           Math.cos(2 * Math.PI * carrierFreq * t + modIdx * Math.sin(2 * Math.PI * modFreq * t)));
            let phaseDiff = currentPhase - prevPhase;
            
            // Adjust for phase wrapping
            if (phaseDiff > Math.PI) phaseDiff -= 2 * Math.PI;
            if (phaseDiff < -Math.PI) phaseDiff += 2 * Math.PI;
            
            demodulatedSignal = amp/2 * phaseDiff / (2 * Math.PI * dt * modIdx);
          } else {
            demodulatedSignal = 0;
          }
        } else if (modType === 'QPSK') {
          // Simplified QPSK demodulation (just for visualization)
          demodulatedSignal = message[i];
        } else {
          // AM demodulation
          demodulatedSignal = Math.abs(modulatedSignal) - amp;
          // Apply low-pass filtering (simplified)
          if (i > 0) {
            demodulatedSignal = 0.9 * demodulated[i-1] + 0.1 * demodulatedSignal;
          }
        }
        
        demodulated.push(demodulatedSignal);
      }
      
      setDataPoints({ time, carrier, modulated, demodulated, noise });
      setProcessing(false);
    }, 500); // Simulated processing delay
  };
  
  // Initialize canvas and start drawing on component mount
  useEffect(() => {
    generateSignalData(
      modulationType,
      carrierFrequency,
      modulationFrequency,
      amplitude,
      modulationIndex,
      snr,
      phaseShift,
      samplingRate
    );
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);
  
  // Update animation based on running state
  useEffect(() => {
    if (running) {
      let lastTime = 0;
      const animate = (time) => {
        if (lastTime === 0) {
          lastTime = time;
        }
        
        const deltaTime = time - lastTime;
        lastTime = time;
        
        // Update time elapsed
        setTimeElapsed((prevTime) => {
          const newTime = prevTime + deltaTime / 1000; // Convert to seconds
          return newTime % 1; // Wrap around after 1 second
        });
        
        animationRef.current = requestAnimationFrame(animate);
      };
      
      animationRef.current = requestAnimationFrame(animate);
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [running]);
  
  // Draw signals on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || processing) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 0.5;
    
    // Vertical grid lines
    for (let x = 0; x <= width; x += width / 10) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    
    // Horizontal grid lines
    for (let y = 0; y <= height; y += height / 6) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    
    // Center line
    ctx.strokeStyle = '#c0c0c0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Calculate visible window based on timeElapsed
    const visiblePoints = dataPoints.time.length;
    const startIndex = Math.floor(timeElapsed * samplingRate) % visiblePoints;
    let pointsToShow;
    
    if (startIndex + 500 <= visiblePoints) {
      pointsToShow = 500;
    } else {
      pointsToShow = visiblePoints - startIndex;
    }
    
    const signalColor = theme.palette.primary.main;
    const demodulatedColor = theme.palette.secondary.main;
    const noiseColor = '#ff7043';
    
    // Draw carrier signal
    if (false) { // Disabled carrier display for clarity
      ctx.strokeStyle = '#a0a0a0';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      for (let i = 0; i < pointsToShow; i++) {
        const idx = (startIndex + i) % visiblePoints;
        const x = (i / pointsToShow) * width;
        const y = height / 2 - (dataPoints.carrier[idx] * height / 3);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    // Draw noise (if enabled)
    if (showNoise) {
      ctx.strokeStyle = noiseColor;
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      for (let i = 0; i < pointsToShow; i++) {
        const idx = (startIndex + i) % visiblePoints;
        const x = (i / pointsToShow) * width;
        const y = 3 * height / 4 - (dataPoints.noise[idx] * height / 8);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
    }
    
    // Draw modulated signal
    ctx.strokeStyle = signalColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < pointsToShow; i++) {
      const idx = (startIndex + i) % visiblePoints;
      const x = (i / pointsToShow) * width;
      const y = height / 2 - (dataPoints.modulated[idx] * height / 3);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw demodulated signal
    ctx.strokeStyle = demodulatedColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    for (let i = 0; i < pointsToShow; i++) {
      const idx = (startIndex + i) % visiblePoints;
      const x = (i / pointsToShow) * width;
      const y = 3 * height / 4 - (dataPoints.demodulated[idx] * height / 4);
      
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    
    ctx.stroke();
    
    // Draw labels
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText('Modulated Signal', 10, 20);
    ctx.fillText('Demodulated Signal', 10, height / 2 + 20);
    
    // Draw colored square indicators for each signal
    ctx.fillStyle = signalColor;
    ctx.fillRect(130, 12, 10, 10);
    ctx.fillStyle = demodulatedColor;
    ctx.fillRect(130, height / 2 + 12, 10, 10);
    
    if (showNoise) {
      ctx.fillStyle = noiseColor;
      ctx.fillText('Noise', 150, height / 2 + 20);
      ctx.fillRect(190, height / 2 + 12, 10, 10);
    }
    
  }, [dataPoints, timeElapsed, processing, showNoise, theme]);
  
  // Handle parameter changes
  useEffect(() => {
    if (!running) {
      generateSignalData(
        modulationType,
        carrierFrequency,
        modulationFrequency,
        amplitude,
        modulationIndex,
        snr,
        phaseShift,
        samplingRate
      );
    }
  }, [modulationType, carrierFrequency, modulationFrequency, amplitude, modulationIndex, snr, phaseShift, samplingRate, showNoise]);
  
  // Download signal data as CSV
  const downloadData = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Time,Carrier,Modulated,Demodulated,Noise\n";
    
    for (let i = 0; i < dataPoints.time.length; i++) {
      csvContent += `${dataPoints.time[i]},${dataPoints.carrier[i]},${dataPoints.modulated[i]},${dataPoints.demodulated[i]},${dataPoints.noise[i]}\n`;
    }
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `rf_signal_${modulationType}_${carrierFrequency}Hz.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Paper elevation={3} sx={{ p: 0, overflow: 'hidden', borderRadius: 2 }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
        <Typography variant="h5" component="h3" align="center">
          RF Signal Simulator
        </Typography>
      </Box>
      
      <Grid container spacing={2} sx={{ p: 3 }}>
        <Grid item xs={12}>
          <Box sx={{ position: 'relative', width: '100%', height: 300, bgcolor: '#f9f9f9', border: '1px solid #ddd', borderRadius: 1 }}>
            <canvas 
              ref={canvasRef} 
              width={800} 
              height={300} 
              style={{ width: '100%', height: '100%' }}
            />
            {processing && (
              <Box sx={{ 
                position: 'absolute', 
                top: 0, 
                left: 0, 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                bgcolor: 'rgba(255, 255, 255, 0.7)'
              }}>
                <CircularProgress />
              </Box>
            )}
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 2 }}>
            <Button
              variant="contained"
              color={running ? "secondary" : "primary"}
              startIcon={running ? <PauseIcon /> : <PlayArrowIcon />}
              onClick={toggleSimulation}
              disabled={processing}
            >
              {running ? 'Pause' : 'Start'} Simulation
            </Button>
            <Button
              variant="outlined"
              startIcon={<RestartAltIcon />}
              onClick={resetSimulation}
              disabled={processing}
            >
              Reset
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={downloadData}
              disabled={processing}
            >
              Download Data
            </Button>
          </Box>
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            Waveform Presets
          </Typography>
          
          {/* Group presets by category */}
          {['AM', 'FM', 'Digital', 'Environment', 'Special'].map(category => (
            <Box key={category} sx={{ mb: 2 }}>
              <Typography variant="caption" color="textSecondary" sx={{ display: 'block', mb: 0.5, fontWeight: 'bold' }}>
                {category === 'AM' ? 'Amplitude Modulation' : 
                 category === 'FM' ? 'Frequency Modulation' : 
                 category === 'Digital' ? 'Digital Modulation' :
                 category === 'Environment' ? 'Environmental Conditions' : 'Special Applications'}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {presets.filter(preset => preset.category === category).map((preset, index) => (
                  <Tooltip 
                    key={index}
                    title={
                      <Box sx={{ p: 0.5 }}>
                        <Typography variant="subtitle2">{preset.name}</Typography>
                        <Typography variant="caption" display="block">
                          Carrier: {preset.carrierFreq} Hz, Mod: {preset.modFreq} Hz
                        </Typography>
                        <Typography variant="caption" display="block">
                          {preset.modulationType === 'AM' 
                            ? `Modulation Depth: ${(preset.modIndex * 100).toFixed(0)}%` 
                            : `Modulation Index: ${preset.modIndex}`}, SNR: {preset.snr} dB
                        </Typography>
                        <Typography variant="caption" color="InfoText" sx={{ display: 'block', mt: 0.5, fontStyle: 'italic' }}>
                          Click to apply, or click info icon for details
                        </Typography>
                      </Box>
                    }
                    arrow
                  >
                    <Chip 
                      label={preset.name}
                      onClick={() => applyPreset(preset)}
                      deleteIcon={<HelpOutlineIcon />}
                      onDelete={(e) => showPresetInfo(preset, e)}
                      color={
                        category === 'AM' ? 'primary' : 
                        category === 'FM' ? 'secondary' : 
                        category === 'Digital' ? 'success' :
                        category === 'Environment' ? 'warning' : 'info'
                      }
                      variant={(currentPreset?.name === preset.name) ? "filled" : "outlined"}
                      disabled={processing}
                      sx={{
                        '&:hover': {
                          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        },
                        transition: 'all 0.2s',
                        fontWeight: (currentPreset?.name === preset.name) ? 'bold' : 'normal'
                      }}
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Box>
          ))}
        </Grid>
        
        <Grid item xs={12}>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1" gutterBottom>
            Signal Parameters
          </Typography>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel id="modulation-type-label">Modulation Type</InputLabel>
            <Select
              labelId="modulation-type-label"
              value={modulationType}
              label="Modulation Type"
              onChange={(e) => setModulationType(e.target.value)}
              disabled={processing}
            >
              <MenuItem value="AM">AM</MenuItem>
              <MenuItem value="FM">FM</MenuItem>
              <MenuItem value="QPSK">QPSK</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: '100%' }}>
            <Typography id="carrier-frequency-slider" gutterBottom>
              Carrier Frequency (Hz)
              <Tooltip title="The frequency of the carrier signal">
                <HelpOutlineIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Tooltip>
            </Typography>
            <Slider
              value={carrierFrequency}
              onChange={(e, newValue) => setCarrierFrequency(newValue)}
              min={50}
              max={500}
              step={10}
              disabled={processing}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: '100%' }}>
            <Typography id="modulation-frequency-slider" gutterBottom>
              Modulation Frequency (Hz)
              <Tooltip title="The frequency of the modulating signal">
                <HelpOutlineIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Tooltip>
            </Typography>
            <Slider
              value={modulationFrequency}
              onChange={(e, newValue) => setModulationFrequency(newValue)}
              min={1}
              max={50}
              step={1}
              disabled={processing}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: '100%' }}>
            <Typography id="modulation-index-slider" gutterBottom>
              Modulation {modulationType === 'AM' ? 'Depth' : 'Index'}
              <Tooltip title={modulationType === 'AM' ? "Amplitude modulation depth" : "Frequency modulation index"}>
                <HelpOutlineIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Tooltip>
            </Typography>
            <Slider
              value={modulationIndex}
              onChange={(e, newValue) => setModulationIndex(newValue)}
              min={0.1}
              max={modulationType === 'AM' ? 1 : 5}
              step={0.1}
              disabled={processing}
              valueLabelDisplay="auto"
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: '100%' }}>
            <Typography id="snr-slider" gutterBottom>
              SNR (dB)
              <Tooltip title="Signal-to-Noise Ratio in decibels">
                <HelpOutlineIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Tooltip>
            </Typography>
            <Slider
              value={snr}
              onChange={(e, newValue) => setSnr(newValue)}
              min={0}
              max={50}
              step={1}
              disabled={processing}
              valueLabelDisplay="auto"
              marks={[
                { value: 10, label: '10 dB' },
                { value: 30, label: '30 dB' }
              ]}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Box sx={{ width: '100%' }}>
            <Typography id="phase-shift-slider" gutterBottom>
              Phase Shift (rad)
              <Tooltip title="Phase shift of the modulating signal">
                <HelpOutlineIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} />
              </Tooltip>
            </Typography>
            <Slider
              value={phaseShift}
              onChange={(e, newValue) => setPhaseShift(newValue)}
              min={0}
              max={Math.PI * 2}
              step={Math.PI / 8}
              disabled={processing || modulationType === 'QPSK'}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => (value / Math.PI).toFixed(2) + 'π'}
              marks={[
                { value: 0, label: '0' },
                { value: Math.PI, label: 'π' },
                { value: Math.PI * 2, label: '2π' }
              ]}
            />
          </Box>
        </Grid>
        
        <Grid item xs={12} sm={6} md={6}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              Show Noise Component
            </Typography>
            <Button
              variant={showNoise ? "contained" : "outlined"}
              color={showNoise ? "warning" : "primary"}
              onClick={() => setShowNoise(!showNoise)}
              size="small"
            >
              {showNoise ? 'Noise On' : 'Noise Off'}
            </Button>
            
            <Box sx={{ ml: 4 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Effective {modulationType} Quality: {" "}
                <Chip 
                  label={snr > 25 ? 'Excellent' : snr > 15 ? 'Good' : snr > 8 ? 'Fair' : 'Poor'} 
                  color={snr > 25 ? 'success' : snr > 15 ? 'primary' : snr > 8 ? 'warning' : 'error'}
                  size="small"
                  onClick={() => {
                    // Provide information about signal quality
                    alert(`Signal quality is ${snr > 25 ? 'Excellent' : snr > 15 ? 'Good' : snr > 8 ? 'Fair' : 'Poor'} with SNR of ${snr}dB`);
                  }}
                />
              </Typography>
            </Box>
          </Box>
        </Grid>
      </Grid>
      
      <Box sx={{ p: 3, bgcolor: 'grey.50', borderTop: '1px solid', borderColor: 'divider' }}>
        <Typography variant="subtitle2" gutterBottom>
          {modulationType === 'AM' ? 'Amplitude Modulation (AM)' : 
           modulationType === 'FM' ? 'Frequency Modulation (FM)' :
           'Quadrature Phase Shift Keying (QPSK)'}
        </Typography>
        <Typography variant="body2">
          {modulationType === 'AM' ? 
            'Amplitude modulation varies the amplitude of a carrier wave in proportion to the message signal.' : 
           modulationType === 'FM' ? 
            'Frequency modulation varies the frequency of a carrier wave in proportion to the message signal.' :
            'QPSK is a digital modulation scheme that uses four different phase shifts to transmit two bits per symbol.'}
        </Typography>
      </Box>
      {/* Preset Info Dialog */}
      <Dialog 
        open={presetInfoOpen} 
        onClose={hidePresetInfo}
        maxWidth="sm"
        fullWidth
      >
        {currentPreset && (
          <>
            <DialogTitle sx={{ m: 0, pr: 6 }}>
              <Typography variant="h6">
                <Box component="span" sx={{ color: 
                  currentPreset.category === 'AM' ? 'primary.main' : 
                  currentPreset.category === 'FM' ? 'secondary.main' : 
                  currentPreset.category === 'Digital' ? 'success.main' :
                  currentPreset.category === 'Environment' ? 'warning.main' : 'info.main'
                }}>
                  {currentPreset.name}
                </Box> Preset
              </Typography>
              <IconButton
                aria-label="close"
                onClick={hidePresetInfo}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography variant="subtitle1" gutterBottom>
                Signal Characteristics
              </Typography>
              
              <List dense>
                <ListItem>
                  <ListItemText 
                    primary="Modulation Type" 
                    secondary={
                      currentPreset.modulationType === 'AM' ? 'Amplitude Modulation' : 
                      currentPreset.modulationType === 'FM' ? 'Frequency Modulation' : 
                      'Quadrature Phase Shift Keying'
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Carrier Frequency" 
                    secondary={`${currentPreset.carrierFreq} Hz`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Modulation Frequency" 
                    secondary={`${currentPreset.modFreq} Hz`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary={currentPreset.modulationType === 'AM' ? "Modulation Depth" : "Modulation Index"} 
                    secondary={
                      currentPreset.modulationType === 'AM' 
                        ? `${(currentPreset.modIndex * 100).toFixed(0)}%` 
                        : currentPreset.modIndex.toFixed(2)
                    }
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Signal-to-Noise Ratio" 
                    secondary={`${currentPreset.snr} dB (${
                      currentPreset.snr > 25 ? 'Excellent' : 
                      currentPreset.snr > 15 ? 'Good' : 
                      currentPreset.snr > 8 ? 'Fair' : 'Poor'
                    } quality)`}
                  />
                </ListItem>
              </List>
              
              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Application Notes
              </Typography>
              <Typography variant="body2" paragraph>
                {currentPreset.category === 'AM' && 
                  "Amplitude modulation varies the amplitude (strength) of the carrier wave in proportion to the message signal. AM is simpler to implement but more susceptible to noise."
                }
                {currentPreset.category === 'FM' && 
                  "Frequency modulation varies the frequency of the carrier wave in proportion to the message signal. FM provides better noise immunity than AM at the cost of higher bandwidth."
                }
                {currentPreset.category === 'Digital' && 
                  "QPSK is a digital modulation scheme that uses four different phase shifts to transmit two bits per symbol, offering good spectral efficiency and noise performance."
                }
                {currentPreset.category === 'Environment' && 
                  "These presets simulate various real-world signal propagation environments with different noise levels and channel conditions."
                }
                {currentPreset.category === 'Special' && 
                  "Specialized waveform configurations designed for specific applications like radar, sonar, or next-generation wireless communications."
                }
              </Typography>
              <Typography variant="body2">
                {currentPreset.name === "AM Broadcast" && 
                  "Simulates standard AM radio broadcasting in the medium wave band. Has moderate resistance to noise and good coverage range."
                }
                {currentPreset.name === "FM Radio" && 
                  "Represents commercial FM broadcasting with high audio quality and good noise immunity. Requires more bandwidth than AM."
                }
                {currentPreset.name === "QPSK Digital" && 
                  "Common in satellite communications, Wi-Fi, and many modern digital systems. Good balance of spectral efficiency and error performance."
                }
                {currentPreset.name === "High-Fidelity" && 
                  "Represents ideal transmission conditions with minimal noise and interference, showing optimal signal quality."
                }
                {currentPreset.name === "Noisy Channel" && 
                  "Demonstrates degraded signal conditions with high noise levels, useful for testing robustness of modulation schemes."
                }
                {currentPreset.name === "Radar Pulse" && 
                  "Simulates radar signal with high carrier frequency and fast modulation, used for target detection and tracking."
                }
                {currentPreset.name === "5G Signal" && 
                  "Represents next-generation mobile communications with high frequency, complex modulation, and moderate SNR in urban environments."
                }
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={hidePresetInfo}>Close</Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={() => {
                  applyPreset(currentPreset);
                  hidePresetInfo();
                }}
                autoFocus
              >
                Apply Preset
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Paper>
  );
}

export default RFSignalSimulator;