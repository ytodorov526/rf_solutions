import React, { useState, useEffect } from 'react';
import {
  Box, 
  Typography, 
  Paper, 
  Grid, 
  TextField, 
  Button, 
  Slider, 
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Tooltip,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  IconButton,
  InputAdornment
} from '@mui/material';
import { 
  Info as InfoIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  SettingsBackupRestore as ResetIcon,
  PlayArrow as PlayArrowIcon,
  HelpOutline as HelpOutlineIcon
} from '@mui/icons-material';

const PCRSimulator = () => {
  // PCR parameters
  const [templateDNA, setTemplateDNA] = useState('ATCGATCGTAGCTACGATCGTAGCTAGCTAGCTCTCGAGCATCGATCGTAGTCG');
  const [forwardPrimer, setForwardPrimer] = useState('ATCGATCGTAGCTACG');
  const [reversePrimer, setReversePrimer] = useState('CGACTACGATCGATGC');
  const [cycles, setCycles] = useState(30);
  const [denaturationTemp, setDenaturationTemp] = useState(95);
  const [denaturationTime, setDenaturationTime] = useState(30);
  const [annealingTemp, setAnnealingTemp] = useState(55);
  const [annealingTime, setAnnealingTime] = useState(30);
  const [extensionTemp, setExtensionTemp] = useState(72);
  const [extensionTime, setExtensionTime] = useState(60);
  const [polymerase, setPolymerase] = useState('taq');
  const [mgConcentration, setMgConcentration] = useState(1.5);
  const [dntpConcentration, setDntpConcentration] = useState(200);
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Simulation state
  const [runningSimulation, setRunningSimulation] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [currentStep, setCurrentStep] = useState(null);
  const [amplificationData, setAmplificationData] = useState([]);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationResults, setSimulationResults] = useState({
    efficiency: 0,
    specificity: 0,
    productSize: 0,
    warnings: [],
    suggestions: []
  });
  
  // DNA visualization state (simplified for this implementation)
  const [dnaVisualization, setDnaVisualization] = useState([]);
  
  // Polymerase data
  const polymeraseData = {
    taq: {
      name: 'Taq Polymerase',
      optimalTemp: 72,
      errorRate: '1 error per 10,000 bases',
      processivity: '50-60 nucleotides/sec',
      features: 'Standard PCR enzyme, no proofreading activity'
    },
    pfu: {
      name: 'Pfu Polymerase',
      optimalTemp: 72,
      errorRate: '1 error per 1,000,000 bases',
      processivity: '25-30 nucleotides/sec',
      features: 'High-fidelity, has 3\'-5\' proofreading activity'
    },
    phusion: {
      name: 'Phusion Polymerase',
      optimalTemp: 72,
      errorRate: '1 error per 2,000,000 bases',
      processivity: '30-40 nucleotides/sec',
      features: 'Very high-fidelity, fusion of Pfu-like enzyme with DNA binding domain'
    }
  };
  
  // Template DNA computation (complement and reverse complement)
  const getComplementaryBase = (base) => {
    const complementMap = {
      'A': 'T',
      'T': 'A',
      'G': 'C',
      'C': 'G'
    };
    return complementMap[base] || base;
  };
  
  const getComplementaryStrand = (sequence) => {
    return sequence.split('').map(base => getComplementaryBase(base)).join('');
  };
  
  const getReverseComplementaryStrand = (sequence) => {
    return getComplementaryStrand(sequence).split('').reverse().join('');
  };
  
  const getAmplifiedRegion = () => {
    // Find forward primer binding site
    const forwardIndex = templateDNA.indexOf(forwardPrimer);
    
    if (forwardIndex === -1) {
      // Forward primer doesn't match template
      return null;
    }
    
    // Find reverse primer binding site in the complementary strand
    const templateComplement = getComplementaryStrand(templateDNA);
    const revPrimerComplement = getComplementaryStrand(reversePrimer);
    const reverseIndex = templateComplement.indexOf(revPrimerComplement);
    
    if (reverseIndex === -1) {
      // Reverse primer doesn't match template complement
      return null;
    }
    
    // Calculate amplicon size
    const amplifiedSize = templateDNA.length - reverseIndex - forwardIndex;
    
    return {
      start: forwardIndex,
      end: templateDNA.length - reverseIndex,
      size: amplifiedSize
    };
  };
  
  // Reset the simulation
  const resetSimulation = () => {
    setRunningSimulation(false);
    setCurrentCycle(0);
    setCurrentStep(null);
    setAmplificationData([]);
    setSimulationComplete(false);
    setSimulationResults({
      efficiency: 0,
      specificity: 0,
      productSize: 0,
      warnings: [],
      suggestions: []
    });
  };
  
  // PCR efficiency calculation based on parameters
  const calculateEfficiency = () => {
    let efficiency = 100; // Start with 100% efficiency
    let specificity = 100; // Start with 100% specificity
    let warnings = [];
    let suggestions = [];
    
    // Region and primer match check
    const amplifiedRegion = getAmplifiedRegion();
    if (!amplifiedRegion) {
      efficiency *= 0.1; // Major reduction if primers don't match
      specificity *= 0.3;
      warnings.push('Primers may not anneal efficiently to the template DNA.');
      suggestions.push('Check primer sequences for compatibility with the template.');
      return { efficiency, specificity, amplifiedRegion, warnings, suggestions };
    }
    
    // Primer length checks
    if (forwardPrimer.length < 15 || forwardPrimer.length > 30) {
      efficiency *= 0.9;
      warnings.push('Forward primer length is not optimal (ideally 18-25 bp).');
      suggestions.push('Consider redesigning primers to be 18-25 base pairs in length.');
    }
    
    if (reversePrimer.length < 15 || reversePrimer.length > 30) {
      efficiency *= 0.9;
      warnings.push('Reverse primer length is not optimal (ideally 18-25 bp).');
      suggestions.push('Consider redesigning primers to be 18-25 base pairs in length.');
    }
    
    // Annealing temperature checks
    const optimalAnnealingTemp = calculateOptimalAnnealingTemp();
    if (Math.abs(annealingTemp - optimalAnnealingTemp) > 5) {
      const adjustFactor = 1 - (Math.abs(annealingTemp - optimalAnnealingTemp) / 10);
      efficiency *= Math.max(0.5, adjustFactor);
      specificity *= Math.max(0.6, adjustFactor);
      warnings.push(`Annealing temperature ${annealingTemp}°C may not be optimal (calculated optimal: ~${optimalAnnealingTemp.toFixed(1)}°C).`);
      suggestions.push(`Consider adjusting annealing temperature to around ${optimalAnnealingTemp.toFixed(1)}°C.`);
    }
    
    // Denaturation parameters
    if (denaturationTemp < 94) {
      efficiency *= 0.8;
      warnings.push('Denaturation temperature may be too low for complete DNA melting.');
      suggestions.push('Increase denaturation temperature to 94-98°C.');
    }
    
    if (denaturationTime < 15) {
      efficiency *= 0.9;
      warnings.push('Denaturation time may be too short for complete DNA melting.');
      suggestions.push('Increase denaturation time to at least 15-30 seconds.');
    }
    
    // Extension time check
    const requiredExtensionTime = amplifiedRegion.size / 50; // Rough estimate: 50 bp/s for Taq
    if (extensionTime < requiredExtensionTime) {
      efficiency *= 0.7;
      warnings.push('Extension time may be too short for the amplicon length.');
      suggestions.push(`Consider extending the extension time to at least ${Math.ceil(requiredExtensionTime)} seconds.`);
    }
    
    // Polymerase-specific adjustments
    if (polymerase === 'pfu' && extensionTemp > 72) {
      efficiency *= 0.8;
      warnings.push('Pfu polymerase activity decreases significantly above 72°C.');
      suggestions.push('Use 72°C for optimal Pfu polymerase activity.');
    }
    
    // Mg2+ concentration check
    if (mgConcentration < 1.0 || mgConcentration > 4.0) {
      efficiency *= 0.8;
      specificity *= 0.8;
      warnings.push('Mg²⁺ concentration is outside the optimal range (1.0-4.0 mM).');
      suggestions.push('Adjust Mg²⁺ concentration to 1.5-2.5 mM for most PCR applications.');
    }
    
    // dNTP concentration check
    if (dntpConcentration < 50 || dntpConcentration > 400) {
      efficiency *= 0.9;
      warnings.push('dNTP concentration is outside the typical range (50-400 μM).');
      suggestions.push('Use 200-250 μM total dNTPs (50-62.5 μM each) for most PCR applications.');
    }
    
    // Cycle number check
    if (cycles < 25) {
      efficiency *= 0.95;
      warnings.push('Low cycle number may result in insufficient amplification.');
      suggestions.push('For most applications, 25-35 cycles are recommended.');
    } else if (cycles > 40) {
      specificity *= 0.8;
      warnings.push('High cycle number may increase non-specific amplification and errors.');
      suggestions.push('Reduce to 30-35 cycles to minimize non-specific products.');
    }
    
    return { 
      efficiency: Math.max(5, Math.round(efficiency)), 
      specificity: Math.max(5, Math.round(specificity)), 
      amplifiedRegion, 
      warnings, 
      suggestions 
    };
  };
  
  // Calculate the optimal annealing temperature based on primer sequences
  const calculateOptimalAnnealingTemp = () => {
    // Simple Tm calculation: 2(A+T) + 4(G+C)
    // This is a very basic approximation - real calculations are more complex
    
    const calculateSimpleTm = (sequence) => {
      const aCount = (sequence.match(/A/g) || []).length;
      const tCount = (sequence.match(/T/g) || []).length;
      const gCount = (sequence.match(/G/g) || []).length;
      const cCount = (sequence.match(/C/g) || []).length;
      
      return 2 * (aCount + tCount) + 4 * (gCount + cCount);
    };
    
    const forwardTm = calculateSimpleTm(forwardPrimer);
    const reverseTm = calculateSimpleTm(reversePrimer);
    
    // Use the lower of the two Tms and subtract 5°C as a starting point
    const lowerTm = Math.min(forwardTm, reverseTm);
    return Math.min(lowerTm - 5, 68); // Cap at 68°C as a reasonable maximum
  };
  
  // Run PCR simulation
  const runSimulation = () => {
    resetSimulation();
    setRunningSimulation(true);
    
    // Initial result calculation
    const { efficiency, specificity, amplifiedRegion, warnings, suggestions } = calculateEfficiency();
    
    // If amplification is theoretically impossible, end early
    if (!amplifiedRegion) {
      setSimulationResults({
        efficiency,
        specificity,
        productSize: 0,
        warnings,
        suggestions
      });
      setSimulationComplete(true);
      setRunningSimulation(false);
      return;
    }
    
    // Initialize amplification data
    const initialData = [
      { cycle: 0, copies: 1, cumulative: 1 }
    ];
    setAmplificationData(initialData);
    
    // Start simulation with cycle 1
    setCurrentCycle(1);
    setCurrentStep('denaturation');
    
    // Set results for display
    setSimulationResults({
      efficiency,
      specificity,
      productSize: amplifiedRegion.size,
      warnings,
      suggestions
    });
  };
  
  // Effect to handle the simulation steps
  useEffect(() => {
    if (!runningSimulation) return;
    
    const cycleSteps = ['denaturation', 'annealing', 'extension'];
    const currentStepIndex = cycleSteps.indexOf(currentStep);
    
    let timer;
    
    if (currentCycle <= cycles) {
      if (currentStepIndex < cycleSteps.length - 1) {
        // Move to next step in the current cycle
        timer = setTimeout(() => {
          setCurrentStep(cycleSteps[currentStepIndex + 1]);
        }, 1000);
      } else {
        // End of cycle, update data and move to next cycle or complete
        timer = setTimeout(() => {
          // Exponential growth: 2^cycle (simplified)
          // In reality, efficiency would vary by cycle
          const cycleEfficiency = simulationResults.efficiency / 100;
          const newCopies = Math.pow(2, currentCycle) * cycleEfficiency;
          
          const newData = [
            ...amplificationData,
            { 
              cycle: currentCycle, 
              copies: newCopies, 
              cumulative: newCopies 
            }
          ];
          
          setAmplificationData(newData);
          
          if (currentCycle === cycles) {
            // Simulation complete
            setSimulationComplete(true);
            setRunningSimulation(false);
          } else {
            // Move to next cycle
            setCurrentCycle(currentCycle + 1);
            setCurrentStep('denaturation');
          }
        }, 1000);
      }
    }
    
    return () => clearTimeout(timer);
  }, [runningSimulation, currentCycle, currentStep, cycles, amplificationData, simulationResults.efficiency]);
  
  // Generate visual representation of PCR product
  useEffect(() => {
    if (simulationComplete && simulationResults.productSize > 0) {
      // Create a simplified visual representation of the PCR product
      const amplifiedRegion = getAmplifiedRegion();
      if (amplifiedRegion) {
        const visualization = [];
        // Forward primer region (first 5 bases)
        visualization.push({
          sequence: forwardPrimer.substring(0, 5) + '...',
          type: 'forward-primer'
        });
        
        // Middle region (simplified)
        const middleLength = amplifiedRegion.size - forwardPrimer.length - reversePrimer.length;
        if (middleLength > 0) {
          visualization.push({
            sequence: '...',
            type: 'middle'
          });
        }
        
        // Reverse primer region (last 5 bases)
        visualization.push({
          sequence: '...' + reversePrimer.substring(reversePrimer.length - 5),
          type: 'reverse-primer'
        });
        
        setDnaVisualization(visualization);
      }
    }
  }, [simulationComplete, simulationResults.productSize, forwardPrimer, reversePrimer]);
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          PCR Simulator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Design and run a virtual PCR experiment. Adjust parameters to see how they affect amplification efficiency and specificity.
        </Typography>
        
        <Grid container spacing={3}>
          {/* Left column: PCR setup */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Template & Primer Design
              </Typography>
              
              <TextField
                label="Template DNA (5' to 3')"
                fullWidth
                value={templateDNA}
                onChange={(e) => {
                  setTemplateDNA(e.target.value.toUpperCase().replace(/[^ATGC]/g, ''));
                  resetSimulation();
                }}
                margin="normal"
                variant="outlined"
                size="small"
                helperText={`${templateDNA.length} base pairs`}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter the DNA sequence to be amplified. Only A, T, G, C bases are allowed.">
                        <IconButton edge="end" size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                label="Forward Primer (5' to 3')"
                fullWidth
                value={forwardPrimer}
                onChange={(e) => {
                  setForwardPrimer(e.target.value.toUpperCase().replace(/[^ATGC]/g, ''));
                  resetSimulation();
                }}
                margin="normal"
                variant="outlined"
                size="small"
                helperText={
                  templateDNA.includes(forwardPrimer) 
                    ? `${forwardPrimer.length} bp - Matches template at position ${templateDNA.indexOf(forwardPrimer) + 1}`
                    : `${forwardPrimer.length} bp - No match found in template`
                }
                error={!templateDNA.includes(forwardPrimer)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter the forward primer sequence. It should match a region at the 5' end of your target sequence.">
                        <IconButton edge="end" size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField
                label="Reverse Primer (5' to 3')"
                fullWidth
                value={reversePrimer}
                onChange={(e) => {
                  setReversePrimer(e.target.value.toUpperCase().replace(/[^ATGC]/g, ''));
                  resetSimulation();
                }}
                margin="normal"
                variant="outlined"
                size="small"
                helperText={
                  getComplementaryStrand(templateDNA).includes(getComplementaryStrand(reversePrimer))
                    ? `${reversePrimer.length} bp - Matches template complement`
                    : `${reversePrimer.length} bp - No match found in template complement`
                }
                error={!getComplementaryStrand(templateDNA).includes(getComplementaryStrand(reversePrimer))}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter the reverse primer sequence (5' to 3'). It should be the reverse complement of the 3' end of your target sequence.">
                        <IconButton edge="end" size="small">
                          <HelpOutlineIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
              
              {getAmplifiedRegion() && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Expected amplicon size: {getAmplifiedRegion()?.size} bp
                </Alert>
              )}
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Thermal Cycling Parameters
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <TextField
                    label="Cycles"
                    type="number"
                    value={cycles}
                    onChange={(e) => {
                      setCycles(Math.max(1, Math.min(45, parseInt(e.target.value || '25'))));
                      resetSimulation();
                    }}
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 45 }}
                  />
                </Grid>
                
                <Grid item xs={8}>
                  <FormControl fullWidth margin="normal" size="small">
                    <FormLabel id="polymerase-label">DNA Polymerase</FormLabel>
                    <RadioGroup
                      row
                      aria-labelledby="polymerase-label"
                      name="polymerase-group"
                      value={polymerase}
                      onChange={(e) => {
                        setPolymerase(e.target.value);
                        resetSimulation();
                      }}
                    >
                      <FormControlLabel value="taq" control={<Radio size="small" />} label="Taq" />
                      <FormControlLabel value="pfu" control={<Radio size="small" />} label="Pfu" />
                      <FormControlLabel value="phusion" control={<Radio size="small" />} label="Phusion" />
                    </RadioGroup>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                Denaturation
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Temperature (°C)"
                    type="number"
                    value={denaturationTemp}
                    onChange={(e) => {
                      setDenaturationTemp(Math.max(60, Math.min(100, parseInt(e.target.value || '95'))));
                      resetSimulation();
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 60, max: 100 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Time (seconds)"
                    type="number"
                    value={denaturationTime}
                    onChange={(e) => {
                      setDenaturationTime(Math.max(1, Math.min(120, parseInt(e.target.value || '30'))));
                      resetSimulation();
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 120 }}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Annealing
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Temperature (°C)"
                    type="number"
                    value={annealingTemp}
                    onChange={(e) => {
                      setAnnealingTemp(Math.max(40, Math.min(70, parseInt(e.target.value || '55'))));
                      resetSimulation();
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 40, max: 70 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Time (seconds)"
                    type="number"
                    value={annealingTime}
                    onChange={(e) => {
                      setAnnealingTime(Math.max(1, Math.min(120, parseInt(e.target.value || '30'))));
                      resetSimulation();
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 120 }}
                  />
                </Grid>
              </Grid>
              
              <Typography variant="body2" sx={{ mt: 2, mb: 1 }}>
                Extension
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    label="Temperature (°C)"
                    type="number"
                    value={extensionTemp}
                    onChange={(e) => {
                      setExtensionTemp(Math.max(60, Math.min(80, parseInt(e.target.value || '72'))));
                      resetSimulation();
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 60, max: 80 }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    label="Time (seconds)"
                    type="number"
                    value={extensionTime}
                    onChange={(e) => {
                      setExtensionTime(Math.max(1, Math.min(300, parseInt(e.target.value || '60'))));
                      resetSimulation();
                    }}
                    fullWidth
                    variant="outlined"
                    size="small"
                    inputProps={{ min: 1, max: 300 }}
                  />
                </Grid>
              </Grid>
              
              <Button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                endIcon={showAdvanced ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                sx={{ mt: 2 }}
              >
                {showAdvanced ? 'Hide Advanced Parameters' : 'Show Advanced Parameters'}
              </Button>
              
              {showAdvanced && (
                <Box sx={{ mt: 2 }}>
                  <Divider sx={{ mb: 2 }} />
                  <Typography variant="subtitle2" gutterBottom>
                    Advanced Parameters
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="Mg²⁺ Concentration (mM)"
                        type="number"
                        value={mgConcentration}
                        onChange={(e) => {
                          setMgConcentration(Math.max(0.5, Math.min(5, parseFloat(e.target.value || '1.5'))));
                          resetSimulation();
                        }}
                        fullWidth
                        variant="outlined"
                        size="small"
                        inputProps={{ step: 0.1, min: 0.5, max: 5 }}
                        helperText="Typical range: 1.0-4.0 mM"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="dNTP Concentration (μM)"
                        type="number"
                        value={dntpConcentration}
                        onChange={(e) => {
                          setDntpConcentration(Math.max(10, Math.min(500, parseFloat(e.target.value || '200'))));
                          resetSimulation();
                        }}
                        fullWidth
                        variant="outlined"
                        size="small"
                        inputProps={{ step: 10, min: 10, max: 500 }}
                        helperText="Total of all four dNTPs"
                      />
                    </Grid>
                  </Grid>
                  
                  <Typography variant="body2" sx={{ mt: 2 }}>
                    Optimal annealing temperature (calculated): ~{calculateOptimalAnnealingTemp().toFixed(1)}°C
                  </Typography>
                </Box>
              )}
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<ResetIcon />}
                onClick={resetSimulation}
              >
                Reset
              </Button>
              
              <Button 
                variant="contained" 
                startIcon={<PlayArrowIcon />}
                onClick={runSimulation}
                disabled={runningSimulation}
              >
                Run PCR
              </Button>
            </Box>
          </Grid>
          
          {/* Right column: Simulation and results */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                PCR Simulation Status
              </Typography>
              
              {!runningSimulation && !simulationComplete && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Set up your PCR parameters and click "Run PCR" to start the simulation.
                  </Typography>
                </Box>
              )}
              
              {runningSimulation && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Cycle {currentCycle} of {cycles}</Typography>
                    <Typography variant="body2" color="primary">
                      {currentStep === 'denaturation' && `Denaturation (${denaturationTemp}°C)`}
                      {currentStep === 'annealing' && `Annealing (${annealingTemp}°C)`}
                      {currentStep === 'extension' && `Extension (${extensionTemp}°C)`}
                    </Typography>
                  </Box>
                  
                  <LinearProgress sx={{ mb: 2 }} />
                  
                  <Box sx={{ height: 15, display: 'flex', width: '100%', mb: 1 }}>
                    {/* Visual representation of cycle progress */}
                    <Box sx={{ 
                      flex: 1, 
                      bgcolor: currentStep === 'denaturation' ? 'error.light' : 'action.disableBackground', 
                      mr: 0.5 
                    }} />
                    <Box sx={{ 
                      flex: 1, 
                      bgcolor: currentStep === 'annealing' ? 'info.light' : 'action.disableBackground', 
                      mr: 0.5 
                    }} />
                    <Box sx={{ 
                      flex: 1, 
                      bgcolor: currentStep === 'extension' ? 'success.light' : 'action.disableBackground'
                    }} />
                  </Box>
                  
                  <Typography variant="caption" color="text.secondary">
                    DNA copies: {amplificationData.length > 0 ? Math.round(amplificationData[amplificationData.length - 1].cumulative) : 1}
                  </Typography>
                </Box>
              )}
              
              {simulationComplete && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom>Amplification Efficiency</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={simulationResults.efficiency} 
                            color={simulationResults.efficiency > 70 ? "success" : "warning"}
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {simulationResults.efficiency}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={6}>
                      <Typography variant="body2" gutterBottom>Specificity</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={simulationResults.specificity} 
                            color={simulationResults.specificity > 70 ? "success" : "warning"}
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {simulationResults.specificity}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Typography variant="body2" gutterBottom>
                    Final DNA Copies: {amplificationData.length > 0 
                      ? Math.round(amplificationData[amplificationData.length - 1].cumulative).toLocaleString() 
                      : 0}
                  </Typography>
                  
                  <Typography variant="body2" gutterBottom>
                    Product Size: {simulationResults.productSize > 0 
                      ? `${simulationResults.productSize} bp` 
                      : 'No product detected'}
                  </Typography>
                  
                  {/* PCR product visualization */}
                  {dnaVisualization.length > 0 && (
                    <Box sx={{ my: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                      <Typography variant="caption" sx={{ mb: 1, display: 'block' }}>
                        Amplified Product Visualization
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {dnaVisualization.map((segment, index) => (
                          <Box 
                            key={index} 
                            sx={{ 
                              bgcolor: segment.type === 'forward-primer' 
                                ? '#2196f3' 
                                : segment.type === 'reverse-primer' 
                                  ? '#f44336' 
                                  : '#9e9e9e',
                              color: 'white',
                              p: 0.5,
                              borderRadius: 1,
                              fontSize: '0.75rem',
                              fontFamily: 'monospace'
                            }}
                          >
                            {segment.sequence}
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  )}
                  
                  {/* Analysis and recommendations */}
                  <Box sx={{ mt: 2 }}>
                    {simulationResults.warnings.map((warning, index) => (
                      <Alert key={`warning-${index}`} severity="warning" sx={{ mb: 1 }}>
                        {warning}
                      </Alert>
                    ))}
                    
                    {simulationResults.suggestions.map((suggestion, index) => (
                      <Alert key={`suggestion-${index}`} severity="info" sx={{ mb: 1 }}>
                        {suggestion}
                      </Alert>
                    ))}
                  </Box>
                </Box>
              )}
            </Paper>
            
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Polymerase Properties
                </Typography>
                
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  <strong>{polymeraseData[polymerase].name}</strong>
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="caption" component="div">
                      <strong>Optimal Temperature:</strong> {polymeraseData[polymerase].optimalTemp}°C
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption" component="div">
                      <strong>Error Rate:</strong> {polymeraseData[polymerase].errorRate}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" component="div">
                      <strong>Processivity:</strong> {polymeraseData[polymerase].processivity}
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="caption" component="div">
                      <strong>Features:</strong> {polymeraseData[polymerase].features}
                    </Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            PCR Educational Notes
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph>
          Polymerase Chain Reaction (PCR) is a technique used to amplify a specific DNA segment, generating millions of copies from even a single DNA molecule. The process involves repeated cycles of three steps:
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="error" gutterBottom>
                1. Denaturation (94-98°C)
              </Typography>
              <Typography variant="body2">
                The reaction mixture is heated to separate the double-stranded DNA template into single strands. This disrupts the hydrogen bonds between complementary bases.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="info.main" gutterBottom>
                2. Annealing (50-65°C)
              </Typography>
              <Typography variant="body2">
                The temperature is lowered to allow primers to bind (anneal) to their complementary sequences on the single-stranded template. The optimal annealing temperature depends on the primer length and sequence.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="success.main" gutterBottom>
                3. Extension (72°C)
              </Typography>
              <Typography variant="body2">
                DNA polymerase extends the primers by adding nucleotides (dNTPs) that are complementary to the template. This creates new DNA strands complementary to the template strands.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
        
        <Typography variant="body2" sx={{ mt: 2 }}>
          Each cycle theoretically doubles the amount of target DNA. After 30 cycles, a single DNA molecule can be amplified to over a billion copies. PCR is used in a wide range of applications including DNA cloning, genetic testing, forensic analysis, and molecular diagnostics.
        </Typography>
      </Paper>
    </Box>
  );
};

export default PCRSimulator;