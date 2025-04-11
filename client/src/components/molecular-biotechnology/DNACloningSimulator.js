import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Chip,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Tooltip,
  IconButton,
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

// DNA cloning simulator component
const DNACloningSimulator = () => {
  // State management
  const [activeStep, setActiveStep] = useState(0);
  const [selectedGene, setSelectedGene] = useState('');
  const [selectedVector, setSelectedVector] = useState('');
  const [restrictionEnzymes, setRestrictionEnzymes] = useState([]);
  const [ligationMixture, setLigationMixture] = useState({
    vectorAmount: 50,
    insertAmount: 50,
    ligaseUnits: 5,
    bufferAmount: 10,
    incubationHours: 16
  });
  const [transformationState, setTransformationState] = useState({
    cellType: 'dh5alpha',
    heatShockTime: 45,
    recoveryTime: 60,
    platingVolume: 100
  });
  const [simulationResults, setSimulationResults] = useState({
    digestionSuccess: false,
    ligationEfficiency: 0,
    transformationEfficiency: 0,
    colonies: 0,
    positiveColonies: 0
  });
  const [resultMessages, setResultMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Available genes to clone
  const availableGenes = [
    { id: 'gfp', name: 'Green Fluorescent Protein (GFP)', size: 714, description: 'A protein that exhibits bright green fluorescence when exposed to light in the blue to ultraviolet range.' },
    { id: 'lacz', name: 'Beta-galactosidase (LacZ)', size: 3075, description: 'An enzyme that catalyzes the hydrolysis of β-galactosides into monosaccharides.' },
    { id: 'kanr', name: 'Kanamycin Resistance (KanR)', size: 816, description: 'A gene conferring resistance to the antibiotic kanamycin.' },
    { id: 'luxAB', name: 'Bacterial Luciferase (LuxAB)', size: 2100, description: 'Genes encoding bacterial luciferase that produce bioluminescence.' }
  ];
  
  // Cloning vectors
  const vectors = [
    { id: 'puc19', name: 'pUC19', size: 2686, features: ['ampR', 'lacZ', 'high copy'], description: 'A small, high copy number E. coli plasmid cloning vector.' },
    { id: 'pbr322', name: 'pBR322', size: 4361, features: ['ampR', 'tetR', 'medium copy'], description: 'One of the first widely used E. coli cloning vectors.' },
    { id: 'pET28a', name: 'pET-28a(+)', size: 5369, features: ['kanR', 'T7 promoter', 'His-tag'], description: 'An expression vector for high-level protein production in E. coli.' },
    { id: 'pgem', name: 'pGEM-T Easy', size: 3015, features: ['ampR', 'T7/SP6 promoters', 'T-overhangs'], description: 'A vector system for cloning PCR products with A-overhangs.' }
  ];
  
  // Restriction enzymes
  const availableEnzymes = [
    { id: 'ecori', name: 'EcoRI', recognitionSite: 'G^AATTC', compatible: ['ecori'], bluntEnd: false },
    { id: 'bamhi', name: 'BamHI', recognitionSite: 'G^GATCC', compatible: ['bamhi', 'bglii'], bluntEnd: false },
    { id: 'hindiii', name: 'HindIII', recognitionSite: 'A^AGCTT', compatible: ['hindiii'], bluntEnd: false },
    { id: 'xhoi', name: 'XhoI', recognitionSite: 'C^TCGAG', compatible: ['xhoi', 'sali'], bluntEnd: false },
    { id: 'notI', name: 'NotI', recognitionSite: 'GC^GGCCGC', compatible: ['notI'], bluntEnd: false },
    { id: 'ecorv', name: 'EcoRV', recognitionSite: 'GAT|ATC', compatible: ['all blunt'], bluntEnd: true },
    { id: 'smai', name: 'SmaI', recognitionSite: 'CCC|GGG', compatible: ['all blunt'], bluntEnd: true }
  ];
  
  // Simulation logic
  const simulateDigestion = () => {
    if (!selectedGene || !selectedVector || restrictionEnzymes.length < 2) {
      return {
        success: false,
        messages: ['Please select a gene, vector, and at least two restriction enzymes.']
      };
    }
    
    // Check enzyme compatibility
    const compatibilityProblem = checkEnzymeCompatibility();
    if (compatibilityProblem) {
      return {
        success: false,
        messages: [compatibilityProblem]
      };
    }
    
    return {
      success: true,
      messages: [
        'Digestion successful. Vector and insert fragments have compatible ends.',
        'Gel purification complete. Fragments are ready for ligation.'
      ]
    };
  };
  
  const checkEnzymeCompatibility = () => {
    if (restrictionEnzymes.length !== 2) return 'Select exactly two restriction enzymes.';
    
    const enzyme1 = availableEnzymes.find(e => e.id === restrictionEnzymes[0]);
    const enzyme2 = availableEnzymes.find(e => e.id === restrictionEnzymes[1]);
    
    // If both are blunt end, they're compatible
    if (enzyme1.bluntEnd && enzyme2.bluntEnd) return null;
    
    // If one is blunt and one isn't, they're incompatible
    if (enzyme1.bluntEnd !== enzyme2.bluntEnd) {
      return 'Mixed blunt and sticky ends require additional processing. Consider using either all blunt or all sticky end enzymes.';
    }
    
    // Check sticky end compatibility
    if (!enzyme1.compatible.includes(enzyme2.id) && !enzyme2.compatible.includes(enzyme1.id)) {
      return 'The selected restriction enzymes generate incompatible sticky ends. Choose enzymes that create compatible overhangs.';
    }
    
    return null;
  };
  
  const simulateLigation = () => {
    const { vectorAmount, insertAmount, ligaseUnits, incubationHours } = ligationMixture;
    
    // Calculate ligation efficiency based on inputs
    let efficiency = 0;
    let messages = [];
    
    // Vector to insert ratio importance (optimal is around 1:3 for most cases)
    const ratio = insertAmount / vectorAmount;
    let ratioFactor = 0;
    
    if (ratio < 1) {
      ratioFactor = ratio * 0.6; // Too little insert
      messages.push('Insert to vector ratio is low. Consider increasing insert amount.');
    } else if (ratio >= 1 && ratio <= 5) {
      ratioFactor = 0.8 + (ratio - 1) * 0.04; // Optimal range
      messages.push('Good insert to vector ratio for efficient ligation.');
    } else {
      ratioFactor = 1 - (ratio - 5) * 0.05; // Too much insert
      ratioFactor = Math.max(0.5, ratioFactor); // Don't let it go below 50%
      messages.push('Insert to vector ratio is high. This may reduce ligation efficiency.');
    }
    
    // Ligase amount factor
    let ligaseFactor = 0;
    if (ligaseUnits < 2) {
      ligaseFactor = 0.3;
      messages.push('Insufficient ligase units. Ligation efficiency will be low.');
    } else if (ligaseUnits >= 2 && ligaseUnits <= 10) {
      ligaseFactor = 0.5 + (ligaseUnits - 2) * 0.06;
      messages.push('Adequate ligase concentration for the reaction.');
    } else {
      ligaseFactor = 1;
      messages.push('High ligase concentration. No further benefit beyond optimal amount.');
    }
    
    // Incubation time factor
    let timeFactor = 0;
    if (incubationHours < 2) {
      timeFactor = incubationHours * 0.2;
      messages.push('Incubation time is too short for optimal ligation.');
    } else if (incubationHours >= 2 && incubationHours <= 20) {
      timeFactor = 0.4 + (incubationHours - 2) * 0.03;
      if (incubationHours >= 12 && incubationHours <= 18) {
        messages.push('Optimal overnight incubation time for ligation.');
      } else {
        messages.push('Acceptable incubation time for ligation.');
      }
    } else {
      timeFactor = 0.95;
      messages.push('Extended incubation time. No significant benefit beyond optimal time.');
    }
    
    // Calculate overall efficiency
    efficiency = Math.min(1, ratioFactor * ligaseFactor * timeFactor);
    efficiency = Math.round(efficiency * 100);
    
    return {
      efficiency,
      messages
    };
  };
  
  const simulateTransformation = (ligationEfficiency) => {
    const { cellType, heatShockTime, recoveryTime, platingVolume } = transformationState;
    
    // Base values
    let baseEfficiency = 0;
    let messages = [];
    
    // Cell type factor
    switch (cellType) {
      case 'dh5alpha':
        baseEfficiency = 0.8;
        messages.push('DH5α cells provide good transformation efficiency for routine cloning.');
        break;
      case 'xl10gold':
        baseEfficiency = 0.95;
        messages.push('XL10-Gold cells offer high transformation efficiency, good for difficult ligations.');
        break;
      case 'bl21':
        baseEfficiency = 0.5;
        messages.push('BL21 cells are expression strains with lower transformation efficiency. Consider using a cloning strain instead.');
        break;
      case 'topten':
        baseEfficiency = 0.9;
        messages.push('TOP10 cells provide excellent transformation efficiency.');
        break;
      default:
        baseEfficiency = 0.7;
    }
    
    // Heat shock duration factor
    let heatShockFactor = 0;
    if (heatShockTime < 30) {
      heatShockFactor = 0.5 + (heatShockTime / 30) * 0.3;
      messages.push('Heat shock duration is shorter than optimal. This may reduce transformation efficiency.');
    } else if (heatShockTime >= 30 && heatShockTime <= 60) {
      heatShockFactor = 0.8 + (heatShockTime - 30) / 30 * 0.2;
      if (heatShockTime >= 40 && heatShockTime <= 50) {
        messages.push('Optimal heat shock duration for most E. coli strains.');
      } else {
        messages.push('Acceptable heat shock duration.');
      }
    } else {
      heatShockFactor = 0.9 - (heatShockTime - 60) / 60 * 0.3;
      heatShockFactor = Math.max(0.5, heatShockFactor);
      messages.push('Extended heat shock may damage cells and reduce transformation efficiency.');
    }
    
    // Recovery time factor
    let recoveryFactor = 0;
    if (recoveryTime < 30) {
      recoveryFactor = 0.6 + (recoveryTime / 30) * 0.2;
      messages.push('Recovery time is too short. Cells need time to express antibiotic resistance genes.');
    } else if (recoveryTime >= 30 && recoveryTime <= 90) {
      recoveryFactor = 0.8 + (recoveryTime - 30) / 60 * 0.2;
      if (recoveryTime >= 45 && recoveryTime <= 75) {
        messages.push('Good recovery time for transformations with ampicillin selection.');
      } else {
        messages.push('Acceptable recovery time.');
      }
    } else {
      recoveryFactor = 1;
      messages.push('Extended recovery time is beneficial, especially for antibiotics other than ampicillin.');
    }
    
    // Plating volume factor (optimal around 100-200μL for a standard transformation)
    let platingFactor = 0;
    if (platingVolume < 50) {
      platingFactor = 0.5 + (platingVolume / 50) * 0.3;
      messages.push('Small plating volume. You may miss colonies if transformation efficiency is low.');
    } else if (platingVolume >= 50 && platingVolume <= 250) {
      platingFactor = 0.8 + (platingVolume - 50) / 200 * 0.2;
      if (platingVolume >= 100 && platingVolume <= 200) {
        messages.push('Optimal plating volume for visualization of individual colonies.');
      } else {
        messages.push('Acceptable plating volume.');
      }
    } else {
      platingFactor = 0.9 - (platingVolume - 250) / 250 * 0.3;
      platingFactor = Math.max(0.5, platingFactor);
      messages.push('Large plating volume may cause confluent growth and make colony isolation difficult.');
    }
    
    // Calculate final transformation efficiency
    const transformationEfficiency = Math.min(1, baseEfficiency * heatShockFactor * recoveryFactor * platingFactor);
    
    // Calculate colony numbers based on transformation efficiency and ligation efficiency
    // Adjust this formula based on desired simulation behavior
    const totalColonies = Math.floor(transformationEfficiency * 500 * (ligationEfficiency / 100));
    
    // Calculate positive colonies (ones with the insert in the correct orientation)
    // Typically only a fraction of colonies have the correct construct
    const correctOrientation = Math.random() * 0.3 + 0.6; // 60-90% correct orientation
    const positiveColonies = Math.floor(totalColonies * correctOrientation);
    
    return {
      efficiency: Math.round(transformationEfficiency * 100),
      colonies: totalColonies,
      positiveColonies,
      messages
    };
  };
  
  // Step management
  const handleNext = () => {
    setLoading(true);
    
    setTimeout(() => {
      if (activeStep === 0) {
        // Digestion step
        const result = simulateDigestion();
        setSimulationResults({
          ...simulationResults,
          digestionSuccess: result.success
        });
        setResultMessages(result.messages);
        
        if (!result.success) {
          setLoading(false);
          return; // Don't proceed if digestion failed
        }
      } else if (activeStep === 1) {
        // Ligation step
        const result = simulateLigation();
        setSimulationResults({
          ...simulationResults,
          ligationEfficiency: result.efficiency
        });
        setResultMessages(result.messages);
      } else if (activeStep === 2) {
        // Transformation step
        const result = simulateTransformation(simulationResults.ligationEfficiency);
        setSimulationResults({
          ...simulationResults,
          transformationEfficiency: result.efficiency,
          colonies: result.colonies,
          positiveColonies: result.positiveColonies
        });
        setResultMessages(result.messages);
      }
      
      setLoading(false);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }, 1500); // Simulate processing time
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleReset = () => {
    setActiveStep(0);
    setSelectedGene('');
    setSelectedVector('');
    setRestrictionEnzymes([]);
    setLigationMixture({
      vectorAmount: 50,
      insertAmount: 50,
      ligaseUnits: 5,
      bufferAmount: 10,
      incubationHours: 16
    });
    setTransformationState({
      cellType: 'dh5alpha',
      heatShockTime: 45,
      recoveryTime: 60,
      platingVolume: 100
    });
    setSimulationResults({
      digestionSuccess: false,
      ligationEfficiency: 0,
      transformationEfficiency: 0,
      colonies: 0,
      positiveColonies: 0
    });
    setResultMessages([]);
  };
  
  // Handle enzyme selection
  const handleEnzymeChange = (event) => {
    const selectedEnzymes = event.target.value;
    // Limit to 2 enzymes
    if (selectedEnzymes.length <= 2) {
      setRestrictionEnzymes(selectedEnzymes);
    }
  };
  
  return (
    <Box sx={{ maxWidth: '100%' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          DNA Cloning Simulator
        </Typography>
        
        <Stepper activeStep={activeStep} orientation="vertical">
          {/* Step 1: DNA Preparation and Restriction Digestion */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1">Restriction Digestion</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Select a gene of interest, cloning vector, and restriction enzymes for digestion. The enzymes will create compatible ends for cloning the insert into the vector.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="gene-select-label">Gene of Interest</InputLabel>
                    <Select
                      labelId="gene-select-label"
                      id="gene-select"
                      value={selectedGene}
                      label="Gene of Interest"
                      onChange={(e) => setSelectedGene(e.target.value)}
                    >
                      {availableGenes.map((gene) => (
                        <MenuItem key={gene.id} value={gene.id}>
                          {gene.name} ({gene.size} bp)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {selectedGene && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {availableGenes.find(g => g.id === selectedGene)?.description}
                      </Typography>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="vector-select-label">Cloning Vector</InputLabel>
                    <Select
                      labelId="vector-select-label"
                      id="vector-select"
                      value={selectedVector}
                      label="Cloning Vector"
                      onChange={(e) => setSelectedVector(e.target.value)}
                    >
                      {vectors.map((vector) => (
                        <MenuItem key={vector.id} value={vector.id}>
                          {vector.name} ({vector.size} bp)
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  {selectedVector && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {vectors.find(v => v.id === selectedVector)?.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 1 }}>
                        {vectors.find(v => v.id === selectedVector)?.features.map((feature, index) => (
                          <Chip key={index} label={feature} size="small" color="primary" variant="outlined" />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="enzyme-select-label">Restriction Enzymes (select 2)</InputLabel>
                    <Select
                      labelId="enzyme-select-label"
                      id="enzyme-select"
                      multiple
                      value={restrictionEnzymes}
                      label="Restriction Enzymes (select 2)"
                      onChange={handleEnzymeChange}
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const enzyme = availableEnzymes.find(e => e.id === value);
                            return (
                              <Chip 
                                key={value} 
                                label={`${enzyme.name} (${enzyme.recognitionSite})`} 
                                size="small" 
                              />
                            );
                          })}
                        </Box>
                      )}
                    >
                      {availableEnzymes.map((enzyme) => (
                        <MenuItem key={enzyme.id} value={enzyme.id}>
                          <Typography>
                            {enzyme.name} - {enzyme.recognitionSite} 
                            {enzyme.bluntEnd ? " (blunt)" : " (sticky)"}
                          </Typography>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                      For directional cloning, select two different restriction enzymes that produce compatible ends. 
                      For blunt-end cloning, select enzymes that produce blunt ends.
                    </Typography>
                    
                    <Tooltip title="Restriction enzymes cut DNA at specific recognition sequences. For directional cloning, using two different enzymes ensures the insert can only be ligated in one orientation.">
                      <IconButton size="small" sx={{ ml: 1 }}>
                        <HelpOutlineIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ mb: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedGene || !selectedVector || restrictionEnzymes.length < 2 || loading}
                  sx={{ mt: 1, mr: 1 }}
                >
                  {loading ? 'Processing...' : 'Perform Digestion'}
                </Button>
                {loading && <LinearProgress sx={{ mt: 2 }} />}
              </Box>
            </StepContent>
          </Step>
          
          {/* Step 2: DNA Ligation */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1">DNA Ligation</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Set up a ligation reaction to join the digested vector and insert DNA. Adjust the component ratios for optimal ligation efficiency.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Vector DNA (ng)"
                    type="number"
                    fullWidth
                    size="small"
                    value={ligationMixture.vectorAmount}
                    onChange={(e) => setLigationMixture({...ligationMixture, vectorAmount: parseFloat(e.target.value)})}
                    inputProps={{ min: 10, max: 500 }}
                    helperText="Recommended: 50-100 ng"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Insert DNA (ng)"
                    type="number"
                    fullWidth
                    size="small"
                    value={ligationMixture.insertAmount}
                    onChange={(e) => setLigationMixture({...ligationMixture, insertAmount: parseFloat(e.target.value)})}
                    inputProps={{ min: 10, max: 500 }}
                    helperText="Optimal insert:vector molar ratio is typically 3:1"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="T4 DNA Ligase (units)"
                    type="number"
                    fullWidth
                    size="small"
                    value={ligationMixture.ligaseUnits}
                    onChange={(e) => setLigationMixture({...ligationMixture, ligaseUnits: parseFloat(e.target.value)})}
                    inputProps={{ min: 1, max: 20 }}
                    helperText="Recommended: 5-10 units"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Incubation Time (hours)"
                    type="number"
                    fullWidth
                    size="small"
                    value={ligationMixture.incubationHours}
                    onChange={(e) => setLigationMixture({...ligationMixture, incubationHours: parseFloat(e.target.value)})}
                    inputProps={{ min: 1, max: 24 }}
                    helperText="Typical: 1h (room temp) or 16h (4°C)"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mb: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Perform Ligation'}
                </Button>
                <Button
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={loading}
                >
                  Back
                </Button>
                {loading && <LinearProgress sx={{ mt: 2 }} />}
              </Box>
            </StepContent>
          </Step>
          
          {/* Step 3: Transformation */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1">Bacterial Transformation</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" sx={{ mb: 2 }}>
                Transform competent E. coli cells with the ligation mixture. Optimize transformation conditions for the highest efficiency.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="cell-type-label">Competent Cell Type</InputLabel>
                    <Select
                      labelId="cell-type-label"
                      id="cell-type-select"
                      value={transformationState.cellType}
                      label="Competent Cell Type"
                      onChange={(e) => setTransformationState({...transformationState, cellType: e.target.value})}
                    >
                      <MenuItem value="dh5alpha">DH5α (General Cloning)</MenuItem>
                      <MenuItem value="xl10gold">XL10-Gold (High Efficiency)</MenuItem>
                      <MenuItem value="bl21">BL21(DE3) (Protein Expression)</MenuItem>
                      <MenuItem value="topten">TOP10 (High Copy Plasmids)</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Heat Shock Duration (seconds)"
                    type="number"
                    fullWidth
                    size="small"
                    value={transformationState.heatShockTime}
                    onChange={(e) => setTransformationState({...transformationState, heatShockTime: parseFloat(e.target.value)})}
                    inputProps={{ min: 10, max: 120 }}
                    helperText="Typical: 30-60 seconds at 42°C"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Recovery Time (minutes)"
                    type="number"
                    fullWidth
                    size="small"
                    value={transformationState.recoveryTime}
                    onChange={(e) => setTransformationState({...transformationState, recoveryTime: parseFloat(e.target.value)})}
                    inputProps={{ min: 15, max: 120 }}
                    helperText="Recommended: 45-60 minutes"
                  />
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Plating Volume (μL)"
                    type="number"
                    fullWidth
                    size="small"
                    value={transformationState.platingVolume}
                    onChange={(e) => setTransformationState({...transformationState, platingVolume: parseFloat(e.target.value)})}
                    inputProps={{ min: 20, max: 500 }}
                    helperText="Typical: 100-200 μL"
                  />
                </Grid>
              </Grid>
              
              <Box sx={{ mb: 2, mt: 3 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Transform Cells'}
                </Button>
                <Button
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1 }}
                  disabled={loading}
                >
                  Back
                </Button>
                {loading && <LinearProgress sx={{ mt: 2 }} />}
              </Box>
            </StepContent>
          </Step>
          
          {/* Step 4: Results */}
          <Step>
            <StepLabel>
              <Typography variant="subtitle1">Cloning Results</Typography>
            </StepLabel>
            <StepContent>
              <Typography variant="body2" gutterBottom>
                Review the results of your cloning experiment.
              </Typography>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Efficiency Metrics
                      </Typography>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Ligation Efficiency
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={simulationResults.ligationEfficiency} 
                              color={simulationResults.ligationEfficiency > 60 ? "success" : "primary"}
                              sx={{ height: 10, borderRadius: 1 }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {simulationResults.ligationEfficiency}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Transformation Efficiency
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Box sx={{ width: '100%', mr: 1 }}>
                            <LinearProgress 
                              variant="determinate" 
                              value={simulationResults.transformationEfficiency} 
                              color={simulationResults.transformationEfficiency > 70 ? "success" : "primary"}
                              sx={{ height: 10, borderRadius: 1 }}
                            />
                          </Box>
                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              {simulationResults.transformationEfficiency}%
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                      
                      <Divider sx={{ my: 2 }} />
                      
                      <Typography variant="h6" gutterBottom>
                        Colony Analysis
                      </Typography>
                      
                      <Box>
                        <Typography variant="body2">
                          Total colonies: <strong>{simulationResults.colonies}</strong>
                        </Typography>
                        <Typography variant="body2">
                          Colonies with correct insert: <strong>{simulationResults.positiveColonies} ({Math.round(simulationResults.positiveColonies / simulationResults.colonies * 100)}%)</strong>
                        </Typography>
                      </Box>
                      
                      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
                        {simulationResults.colonies > 5 ? (
                          <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                        ) : (
                          <ErrorIcon color="error" sx={{ mr: 1 }} />
                        )}
                        <Typography variant="body2">
                          {simulationResults.colonies > 5 
                            ? "Sufficient colonies for screening." 
                            : "Low colony count. Consider optimizing protocol."}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Analysis & Recommendations
                      </Typography>
                      
                      {resultMessages.map((message, index) => (
                        <Alert 
                          key={index} 
                          severity={message.includes("low") || message.includes("insufficient") || message.includes("too short") ? "warning" : "info"}
                          icon={message.includes("optimal") || message.includes("good") ? <CheckCircleIcon /> : undefined}
                          sx={{ mb: 1 }}
                        >
                          {message}
                        </Alert>
                      ))}
                      
                      <Box sx={{ mt: 3 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Next Steps
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {simulationResults.positiveColonies > 2 
                            ? "Proceed with colony PCR or plasmid isolation to verify the presence and orientation of your insert."
                            : "Consider repeating the experiment with optimized parameters to increase efficiency."}
                        </Typography>
                        
                        {simulationResults.positiveColonies > 0 && (
                          <Typography variant="body2">
                            After verification, the recombinant plasmid can be used for protein expression, further genetic manipulation, or other downstream applications.
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 3 }}>
                <Button onClick={handleReset} variant="contained" color="primary">
                  Start New Cloning Experiment
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Educational Notes
          </Typography>
        </Box>
        <Typography variant="body2" paragraph>
          DNA cloning is a fundamental technique in molecular biology that allows for the isolation, amplification, and manipulation of specific DNA sequences. The process involves several critical steps, each requiring careful optimization for successful outcomes.
        </Typography>
        <Typography variant="body2">
          <strong>Key Concepts:</strong>
        </Typography>
        <ul>
          <li>
            <Typography variant="body2">
              <strong>Restriction Enzymes:</strong> These molecular scissors cut DNA at specific recognition sequences, creating compatible ends for ligation.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Vectors:</strong> Plasmids or other DNA molecules that can replicate independently, carrying inserted DNA fragments into host cells.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Ligation:</strong> The joining of DNA fragments using DNA ligase, which forms phosphodiester bonds between compatible DNA ends.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Transformation:</strong> The process of introducing recombinant DNA into host cells, typically bacteria, for replication and expression.
            </Typography>
          </li>
          <li>
            <Typography variant="body2">
              <strong>Selection:</strong> Methods to identify cells containing the recombinant DNA, often using antibiotic resistance markers.
            </Typography>
          </li>
        </ul>
      </Paper>
    </Box>
  );
};

export default DNACloningSimulator;