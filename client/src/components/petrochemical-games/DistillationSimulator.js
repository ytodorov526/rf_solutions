import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Slider,
  Button,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  FormControlLabel,
  Switch,
  Alert,
  LinearProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import InfoIcon from '@mui/icons-material/Info';

function DistillationSimulator() {
  // Simulation parameters
  const [feedRate, setFeedRate] = useState(100); // barrels per day
  const [feedTemperature, setFeedTemperature] = useState(20); // degrees C
  const [refluxRatio, setRefluxRatio] = useState(3);
  const [reboilerDuty, setReboilerDuty] = useState(70); // percent
  const [numberOfTrays, setNumberOfTrays] = useState(20);
  const [pressureProfile, setPressureProfile] = useState({ top: 1.0, bottom: 1.5 }); // bar
  
  // Simulation state
  const [isRunning, setIsRunning] = useState(false);
  const [simulationTime, setSimulationTime] = useState(0);
  const [showTutorial, setShowTutorial] = useState(true);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  
  // Results
  const [results, setResults] = useState(null);
  const [convergence, setConvergence] = useState(0);
  const [temperatureProfile, setTemperatureProfile] = useState([]);
  const [columnDiagram, setColumnDiagram] = useState([]);
  
  // Initialize temperature profile (one value per tray)
  useEffect(() => {
    if (numberOfTrays > 0) {
      // Create a temperature gradient from top to bottom
      const topTemp = 80; // C
      const bottomTemp = 350; // C
      const step = (bottomTemp - topTemp) / (numberOfTrays - 1);
      
      const temps = Array(numberOfTrays).fill(0).map((_, idx) => ({
        tray: idx + 1,
        temperature: topTemp + idx * step,
        pressure: pressureProfile.top + (idx / (numberOfTrays - 1)) * (pressureProfile.bottom - pressureProfile.top)
      }));
      
      setTemperatureProfile(temps);
    }
  }, [numberOfTrays, pressureProfile]);
  
  // Initialize column diagram
  useEffect(() => {
    if (numberOfTrays > 0) {
      // Create column segments (simplified for illustration)
      const segments = [];
      
      // Condenser
      segments.push({ 
        type: 'condenser', 
        position: 0, 
        temperature: temperatureProfile[0]?.temperature || 80
      });
      
      // Trays
      for (let i = 0; i < numberOfTrays; i++) {
        segments.push({ 
          type: 'tray', 
          position: i + 1, 
          number: i + 1,
          temperature: temperatureProfile[i]?.temperature || 100 + i * 10,
          liquidFlow: 100 - (i / numberOfTrays * 30), // Simplified for demo
          vaporFlow: 50 + (i / numberOfTrays * 40) // Simplified for demo
        });
      }
      
      // Reboiler
      segments.push({ 
        type: 'reboiler', 
        position: numberOfTrays + 1, 
        temperature: temperatureProfile[numberOfTrays - 1]?.temperature || 350,
        duty: reboilerDuty
      });
      
      setColumnDiagram(segments);
    }
  }, [numberOfTrays, temperatureProfile, reboilerDuty]);
  
  // Run simulation
  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      // Update simulation time
      setSimulationTime(prev => {
        const newTime = prev + 1;
        
        // Cap at 100% convergence
        if (newTime >= 60) {
          setIsRunning(false);
          setConvergence(100);
          
          // Generate final results when simulation completes
          generateResults();
          return 60;
        }
        
        // Update convergence (non-linear to simulate slow startup, faster mid-run)
        const newConvergence = Math.min(100, Math.pow(newTime / 60, 0.7) * 100);
        setConvergence(newConvergence);
        
        // Update temperature profile with some random fluctuations
        updateTemperatureProfile(newTime);
        
        return newTime;
      });
    }, 500);
    
    return () => clearInterval(interval);
  }, [isRunning]);
  
  // Update temperature profile during simulation to show dynamics
  const updateTemperatureProfile = (time) => {
    if (temperatureProfile.length === 0) return;
    
    // Add small random fluctuations to create a "live" feeling
    const updatedProfile = temperatureProfile.map((tray, idx) => {
      const fluctuation = (Math.random() - 0.5) * 2; // -1 to 1
      let tempAdjustment = 0;
      
      // Apply feed rate effect (higher feed rate lowers temps in feed zone)
      const feedTray = Math.floor(numberOfTrays / 2);
      if (Math.abs(idx - feedTray) < 3) {
        tempAdjustment -= (feedRate - 100) * 0.05;
      }
      
      // Apply reboiler duty effect (higher duty increases temps)
      tempAdjustment += (reboilerDuty - 70) * 0.1 * (idx / numberOfTrays);
      
      // Apply reflux effect (higher reflux lowers top temps)
      if (idx < numberOfTrays / 3) {
        tempAdjustment -= (refluxRatio - 3) * 1.5;
      }
      
      // Make adjustments smaller at start of simulation
      const timeScale = Math.min(1, time / 30);
      
      return {
        ...tray,
        temperature: Math.max(50, Math.min(400, tray.temperature + (fluctuation + tempAdjustment) * timeScale)),
      };
    });
    
    setTemperatureProfile(updatedProfile);
    
    // Update column diagram with new temperatures
    setColumnDiagram(prev => prev.map((segment, idx) => {
      if (segment.type === 'tray' && idx > 0 && idx <= numberOfTrays) {
        return {
          ...segment,
          temperature: updatedProfile[idx - 1].temperature,
          liquidFlow: 100 - ((idx - 1) / numberOfTrays * 30) + (Math.random() - 0.5) * 3,
          vaporFlow: 50 + ((idx - 1) / numberOfTrays * 40) + (Math.random() - 0.5) * 3
        };
      } else if (segment.type === 'condenser') {
        return {
          ...segment,
          temperature: updatedProfile[0].temperature
        };
      } else if (segment.type === 'reboiler') {
        return {
          ...segment,
          temperature: updatedProfile[updatedProfile.length - 1].temperature,
          duty: reboilerDuty
        };
      }
      return segment;
    }));
  };
  
  // Generate simulation results
  const generateResults = () => {
    // In a real implementation, this would use actual simulation data
    // Here we'll generate realistic-looking results based on inputs
    
    const topTemp = temperatureProfile[0]?.temperature || 80;
    const bottomTemp = temperatureProfile[temperatureProfile.length - 1]?.temperature || 350;
    
    // Calculate product yields and qualities
    const totalFeed = feedRate;
    
    // Distillate yield increases with higher reflux ratio and reboiler duty
    const distillateYield = Math.min(45, 30 + (refluxRatio - 3) * 3 + (reboilerDuty - 70) * 0.2);
    
    // Sidestream yield is affected by number of trays and feed temperature
    const sideStreamYield = Math.min(35, 25 + (numberOfTrays - 20) * 0.5 + (feedTemperature - 20) * 0.2);
    
    // Bottoms is the remainder
    const bottomsYield = Math.max(20, 100 - distillateYield - sideStreamYield);
    
    // Calculate product volumes
    const distillateVolume = (distillateYield / 100) * totalFeed;
    const sideStreamVolume = (sideStreamYield / 100) * totalFeed;
    const bottomsVolume = (bottomsYield / 100) * totalFeed;
    
    // Calculate product qualities (degree of separation) based on operation parameters
    // Purity is affected by reflux, number of trays, and reboiler duty
    const refluxEffect = (reflux) => Math.min(1, 0.7 + reflux * 0.05);
    const traysEffect = (trays) => Math.min(1, 0.5 + trays * 0.025);
    const reboilerEffect = (duty) => Math.min(1, 0.6 + duty * 0.005);
    
    const separationQuality = refluxEffect(refluxRatio) * traysEffect(numberOfTrays) * reboilerEffect(reboilerDuty);
    
    // Energy metrics
    const energyConsumption = reboilerDuty * feedRate * 0.2; // Simplified calculation
    const energyEfficiency = Math.min(90, 60 + (refluxRatio < 4 ? 15 : 0) + (numberOfTrays > 15 ? 10 : 0));
    
    setResults({
      productYields: {
        distillate: {
          yield: distillateYield.toFixed(1),
          volume: distillateVolume.toFixed(1),
          temperature: topTemp.toFixed(1),
          purity: (90 + separationQuality * 9).toFixed(1)
        },
        sideStream: {
          yield: sideStreamYield.toFixed(1),
          volume: sideStreamVolume.toFixed(1),
          temperature: ((topTemp + bottomTemp) / 2).toFixed(1),
          purity: (80 + separationQuality * 12).toFixed(1)
        },
        bottoms: {
          yield: bottomsYield.toFixed(1),
          volume: bottomsVolume.toFixed(1),
          temperature: bottomTemp.toFixed(1),
          purity: (85 + separationQuality * 10).toFixed(1)
        }
      },
      energyMetrics: {
        consumption: energyConsumption.toFixed(1),
        efficiency: energyEfficiency.toFixed(1)
      },
      separationEfficiency: (separationQuality * 100).toFixed(1),
      floodingRisk: refluxRatio > 5 ? 'High' : refluxRatio > 3.5 ? 'Medium' : 'Low',
      temperatureProfile: temperatureProfile
    });
  };
  
  // Start or pause simulation
  const toggleSimulation = () => {
    if (isRunning) {
      setIsRunning(false);
    } else {
      setIsRunning(true);
    }
  };
  
  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationTime(0);
    setConvergence(0);
    setResults(null);
    
    // Reset temperature profile
    const topTemp = 80;
    const bottomTemp = 350;
    const step = (bottomTemp - topTemp) / (numberOfTrays - 1);
    
    const temps = Array(numberOfTrays).fill(0).map((_, idx) => ({
      tray: idx + 1,
      temperature: topTemp + idx * step,
      pressure: pressureProfile.top + (idx / (numberOfTrays - 1)) * (pressureProfile.bottom - pressureProfile.top)
    }));
    
    setTemperatureProfile(temps);
  };

  return (
    <Box>
      {showTutorial && (
        <Alert 
          severity="info" 
          sx={{ mb: 3 }}
          onClose={() => setShowTutorial(false)}
        >
          <Typography variant="subtitle1" gutterBottom>About the Distillation Simulator:</Typography>
          <Typography variant="body2">
            This simulator demonstrates how changing operating parameters affects the performance of a distillation column.
            Adjust parameters like feed rate, reflux ratio, and reboiler duty to see their impact on separation efficiency
            and product quality.
          </Typography>
        </Alert>
      )}
      
      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                Operating Parameters
              </Typography>
              <FormControlLabel
                control={
                  <Switch 
                    checked={isAdvancedMode}
                    onChange={(e) => setIsAdvancedMode(e.target.checked)}
                    size="small"
                  />
                }
                label="Advanced"
              />
            </Box>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography id="feed-rate-slider" gutterBottom>
                Feed Rate: {feedRate} bpd
              </Typography>
              <Slider
                value={feedRate}
                onChange={(e, newValue) => setFeedRate(newValue)}
                min={50}
                max={200}
                disabled={isRunning}
                aria-labelledby="feed-rate-slider"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography id="feed-temp-slider" gutterBottom>
                Feed Temperature: {feedTemperature}°C
              </Typography>
              <Slider
                value={feedTemperature}
                onChange={(e, newValue) => setFeedTemperature(newValue)}
                min={10}
                max={50}
                disabled={isRunning}
                aria-labelledby="feed-temp-slider"
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography id="reflux-ratio-slider" gutterBottom>
                Reflux Ratio: {refluxRatio.toFixed(1)}
              </Typography>
              <Slider
                value={refluxRatio}
                onChange={(e, newValue) => setRefluxRatio(newValue)}
                min={1}
                max={8}
                step={0.1}
                disabled={isRunning}
                aria-labelledby="reflux-ratio-slider"
                marks={[
                  { value: 1, label: '1' },
                  { value: 8, label: '8' }
                ]}
              />
            </Box>
            
            <Box sx={{ mb: 3 }}>
              <Typography id="reboiler-duty-slider" gutterBottom>
                Reboiler Duty: {reboilerDuty}%
              </Typography>
              <Slider
                value={reboilerDuty}
                onChange={(e, newValue) => setReboilerDuty(newValue)}
                min={30}
                max={100}
                disabled={isRunning}
                aria-labelledby="reboiler-duty-slider"
              />
            </Box>
            
            {isAdvancedMode && (
              <>
                <Box sx={{ mb: 3 }}>
                  <Typography id="number-of-trays-slider" gutterBottom>
                    Number of Trays: {numberOfTrays}
                  </Typography>
                  <Slider
                    value={numberOfTrays}
                    onChange={(e, newValue) => setNumberOfTrays(newValue)}
                    min={5}
                    max={40}
                    step={1}
                    disabled={isRunning}
                    aria-labelledby="number-of-trays-slider"
                  />
                </Box>
                
                <Box sx={{ mb: 3 }}>
                  <Typography gutterBottom>
                    Column Pressure (bar):
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="caption">
                        Top: {pressureProfile.top.toFixed(1)}
                      </Typography>
                      <Slider
                        value={pressureProfile.top}
                        onChange={(e, newValue) => setPressureProfile(prev => ({ ...prev, top: newValue }))}
                        min={0.5}
                        max={3}
                        step={0.1}
                        disabled={isRunning}
                        size="small"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="caption">
                        Bottom: {pressureProfile.bottom.toFixed(1)}
                      </Typography>
                      <Slider
                        value={pressureProfile.bottom}
                        onChange={(e, newValue) => setPressureProfile(prev => ({ ...prev, bottom: newValue }))}
                        min={0.5}
                        max={3}
                        step={0.1}
                        disabled={isRunning}
                        size="small"
                      />
                    </Grid>
                  </Grid>
                </Box>
              </>
            )}
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button 
                variant="contained" 
                color={isRunning ? "warning" : "success"}
                startIcon={isRunning ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={toggleSimulation}
              >
                {isRunning ? "Pause" : convergence > 0 ? "Resume" : "Start"} Simulation
              </Button>
              
              <Button 
                variant="outlined"
                startIcon={<RestartAltIcon />}
                onClick={resetSimulation}
                disabled={isRunning && convergence < 10}
              >
                Reset
              </Button>
            </Box>
            
            {isRunning && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" gutterBottom>
                  Convergence: {convergence.toFixed(1)}%
                </Typography>
                <LinearProgress variant="determinate" value={convergence} sx={{ height: 8, borderRadius: 1 }} />
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Visualization Panel */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Distillation Column
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ 
              height: 500, 
              position: 'relative',
              border: '1px solid #eee',
              borderRadius: 1,
              display: 'flex',
              justifyContent: 'center'
            }}>
              {/* Draw the column */}
              <Box sx={{ 
                width: 120, 
                height: '100%', 
                bgcolor: '#f5f5f5',
                borderRadius: 1,
                position: 'relative',
                my: 2,
                overflow: 'hidden'
              }}>
                {columnDiagram.map((segment, idx) => {
                  if (segment.type === 'condenser') {
                    return (
                      <Box 
                        key={`condenser`}
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: 60,
                          bgcolor: '#e3f2fd',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderBottom: '1px solid #ccc'
                        }}
                      >
                        <Typography variant="caption">Condenser</Typography>
                        <Typography variant="caption">{segment.temperature.toFixed(0)}°C</Typography>
                      </Box>
                    );
                  } else if (segment.type === 'reboiler') {
                    return (
                      <Box 
                        key={`reboiler`}
                        sx={{ 
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          width: '100%',
                          height: 60,
                          bgcolor: '#ffebee',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          borderTop: '1px solid #ccc'
                        }}
                      >
                        <Typography variant="caption">Reboiler</Typography>
                        <Typography variant="caption">{segment.temperature.toFixed(0)}°C</Typography>
                      </Box>
                    );
                  } else if (segment.type === 'tray') {
                    const trayHeight = 380 / numberOfTrays;
                    const trayTop = 60 + (segment.number - 1) * trayHeight;
                    
                    // Calculate color based on temperature (blue to red)
                    const tempMin = 80, tempMax = 350;
                    const normalizedTemp = Math.min(1, Math.max(0, (segment.temperature - tempMin) / (tempMax - tempMin)));
                    const r = Math.floor(normalizedTemp * 255);
                    const b = Math.floor((1 - normalizedTemp) * 255);
                    const trayColor = `rgb(${r}, 240, ${b})`;
                    
                    return (
                      <Box 
                        key={`tray-${segment.number}`}
                        sx={{ 
                          position: 'absolute',
                          top: trayTop,
                          left: 0,
                          width: '100%',
                          height: trayHeight,
                          bgcolor: trayColor,
                          borderTop: '1px solid rgba(0,0,0,0.1)',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center'
                        }}
                      >
                        {trayHeight > 12 && (
                          <Typography variant="caption" sx={{ fontSize: '0.6rem' }}>
                            {segment.temperature.toFixed(0)}°C
                          </Typography>
                        )}
                      </Box>
                    );
                  }
                  return null;
                })}
                
                {/* Column labels */}
                <Box sx={{ position: 'absolute', top: 10, right: -70, fontSize: '0.75rem' }}>
                  Distillate
                </Box>
                <Box sx={{ position: 'absolute', top: '50%', right: -60, fontSize: '0.75rem' }}>
                  Feed
                </Box>
                <Box sx={{ position: 'absolute', bottom: 10, right: -60, fontSize: '0.75rem' }}>
                  Bottoms
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Results Panel */}
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Simulation Results
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {convergence < 100 ? (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'text.secondary',
                textAlign: 'center'
              }}>
                <Typography>
                  {convergence === 0 
                    ? "Start the simulation to view results" 
                    : `Simulation in progress (${convergence.toFixed(0)}% complete)`}
                </Typography>
                {convergence > 0 && convergence < 100 && (
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Initial results will appear as the simulation progresses
                  </Typography>
                )}
              </Box>
            ) : results ? (
              <Box sx={{ overflowY: 'auto', maxHeight: 500 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Product Yields & Properties
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Product</TableCell>
                        <TableCell align="right">Yield (%)</TableCell>
                        <TableCell align="right">Purity (%)</TableCell>
                        <TableCell align="right">Temp (°C)</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Distillate</TableCell>
                        <TableCell align="right">{results.productYields.distillate.yield}</TableCell>
                        <TableCell align="right">{results.productYields.distillate.purity}</TableCell>
                        <TableCell align="right">{results.productYields.distillate.temperature}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Side Stream</TableCell>
                        <TableCell align="right">{results.productYields.sideStream.yield}</TableCell>
                        <TableCell align="right">{results.productYields.sideStream.purity}</TableCell>
                        <TableCell align="right">{results.productYields.sideStream.temperature}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Bottoms</TableCell>
                        <TableCell align="right">{results.productYields.bottoms.yield}</TableCell>
                        <TableCell align="right">{results.productYields.bottoms.purity}</TableCell>
                        <TableCell align="right">{results.productYields.bottoms.temperature}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="subtitle2" gutterBottom>
                  Performance Metrics
                </Typography>
                <TableContainer component={Paper} variant="outlined" sx={{ mb: 2 }}>
                  <Table size="small">
                    <TableBody>
                      <TableRow>
                        <TableCell>Separation Efficiency</TableCell>
                        <TableCell align="right">
                          {results.separationEfficiency}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Energy Consumption</TableCell>
                        <TableCell align="right">
                          {results.energyMetrics.consumption} MJ/hr
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Energy Efficiency</TableCell>
                        <TableCell align="right">
                          {results.energyMetrics.efficiency}%
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Flooding Risk</TableCell>
                        <TableCell 
                          align="right"
                          sx={{ 
                            color: results.floodingRisk === 'High' 
                              ? 'error.main' 
                              : results.floodingRisk === 'Medium' 
                                ? 'warning.main' 
                                : 'success.main'
                          }}
                        >
                          {results.floodingRisk}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Alert 
                  severity={
                    results.separationEfficiency > 85 
                      ? "success" 
                      : results.separationEfficiency > 70 
                        ? "info" 
                        : "warning"
                  }
                  icon={<InfoIcon />}
                  sx={{ mt: 1 }}
                >
                  <Typography variant="body2">
                    {results.separationEfficiency > 85 
                      ? "Excellent separation achieved. This configuration is highly efficient." 
                      : results.separationEfficiency > 70 
                        ? "Good separation achieved with reasonable energy efficiency." 
                        : "Marginal separation. Consider increasing reflux ratio or number of trays."}
                  </Typography>
                </Alert>
              </Box>
            ) : (
              <Box sx={{ 
                height: '100%', 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center',
                color: 'text.secondary'
              }}>
                <Typography>No simulation results yet</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default DistillationSimulator;