import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Divider,
  Slider,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tooltip,
  Chip,
  IconButton,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Stack
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import InfoIcon from '@mui/icons-material/Info';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

const ProteinExpressionSimulator = () => {
  // Expression system selection
  const [expressionSystem, setExpressionSystem] = useState('ecoli');
  const [vector, setVector] = useState('pet28a');
  const [proteinType, setProteinType] = useState('gfp');
  const [fusionTag, setFusionTag] = useState('his');
  
  // Expression conditions
  const [temperature, setTemperature] = useState(37);
  const [inductionOD, setInductionOD] = useState(0.6);
  const [inductionConcentration, setInductionConcentration] = useState(0.5);
  const [growthTime, setGrowthTime] = useState(4);
  
  // Advanced options
  const [mediaType, setMediaType] = useState('lb');
  const [antibioticConcentration, setAntibioticConcentration] = useState(50);
  const [aeration, setAeration] = useState(200);
  const [useAutoinduction, setUseAutoinduction] = useState(false);
  const [addSolubilityEnhancers, setAddSolubilityEnhancers] = useState(false);
  const [codonOptimization, setCodonOptimization] = useState(true);
  
  // Simulation state
  const [simulationRunning, setSimulationRunning] = useState(false);
  const [simulationComplete, setSimulationComplete] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  
  // Results state
  const [expressionResults, setExpressionResults] = useState({
    proteinYield: 0,
    solubility: 0,
    purity: 0,
    activity: 0,
    aggregation: 0,
    warningMessages: [],
    recommendationMessages: []
  });
  
  // Reference data
  const expressionSystems = [
    {
      id: 'ecoli',
      name: 'E. coli (Bacterial)',
      description: 'Fast and high-yield expression system for non-glycosylated proteins.',
      vectors: ['pet28a', 'pet22b', 'pbad', 'ptac'],
      optimalTemp: '18-37°C',
      inductionMethod: 'IPTG, arabinose, or autoinduction',
      advantages: ['Fast growth', 'High yields', 'Easy cultivation', 'Inexpensive'],
      disadvantages: ['No post-translational modifications', 'Inclusion body formation common', 'Endotoxin contamination']
    },
    {
      id: 'yeast',
      name: 'Saccharomyces cerevisiae (Yeast)',
      description: 'Eukaryotic system with some post-translational modifications.',
      vectors: ['pyesnt', 'pgap', 'pgal'],
      optimalTemp: '30°C',
      inductionMethod: 'Galactose or constitutive',
      advantages: ['Basic post-translational modifications', 'Secretion possible', 'Fast growth', 'GRAS status'],
      disadvantages: ['Hyperglycosylation', 'Lower yields than E. coli', 'Different codon usage']
    },
    {
      id: 'insect',
      name: 'Insect Cell / Baculovirus',
      description: 'Higher eukaryotic system for complex proteins requiring modifications.',
      vectors: ['pbac1', 'pfastbac'],
      optimalTemp: '27°C',
      inductionMethod: 'Viral infection',
      advantages: ['Complex folding possible', 'Post-translational modifications', 'High expression levels'],
      disadvantages: ['Slower process', 'More expensive', 'Technical complexity']
    },
    {
      id: 'mammalian',
      name: 'Mammalian Cell Culture',
      description: 'Most complex expression system for human proteins requiring native modifications.',
      vectors: ['pcmv', 'pcaggs', 'pcdna'],
      optimalTemp: '37°C',
      inductionMethod: 'Constitutive or inducible promoters',
      advantages: ['Human-like post-translational modifications', 'Proper folding of complex proteins', 'Native conformation'],
      disadvantages: ['Slowest growth', 'Most expensive', 'Lowest yields', 'Technical difficulty']
    }
  ];
  
  const vectors = {
    ecoli: [
      { id: 'pet28a', name: 'pET-28a(+)', tag: 'His-tag, T7 tag', promoter: 'T7', inducer: 'IPTG', features: 'High expression, N- or C-terminal His-tag' },
      { id: 'pet22b', name: 'pET-22b(+)', tag: 'pelB, His-tag', promoter: 'T7', inducer: 'IPTG', features: 'Periplasmic secretion with pelB signal' },
      { id: 'pbad', name: 'pBAD', tag: 'His-tag, V5', promoter: 'araBAD', inducer: 'Arabinose', features: 'Tightly regulated, tunable expression' },
      { id: 'ptac', name: 'pTac', tag: 'GST', promoter: 'tac', inducer: 'IPTG', features: 'Medium expression level, GST fusion' }
    ],
    yeast: [
      { id: 'pyesnt', name: 'pYES2/NT', tag: 'His-tag, V5', promoter: 'GAL1', inducer: 'Galactose', features: 'Inducible expression' },
      { id: 'pgap', name: 'pGAP', tag: 'His-tag, FLAG', promoter: 'GAP', inducer: 'Constitutive', features: 'Constitutive expression' },
      { id: 'pgal', name: 'pGAL', tag: 'MBP', promoter: 'GAL1-10', inducer: 'Galactose', features: 'Strong inducible expression' }
    ],
    insect: [
      { id: 'pbac1', name: 'pBacPAK9', tag: 'His-tag', promoter: 'Polyhedrin', inducer: 'Viral infection', features: 'Very high late expression' },
      { id: 'pfastbac', name: 'pFastBac', tag: 'His-tag, GST', promoter: 'Polyhedrin or p10', inducer: 'Viral infection', features: 'Bacmid generation for recombinant baculovirus' }
    ],
    mammalian: [
      { id: 'pcmv', name: 'pCMV', tag: 'FLAG, His-tag', promoter: 'CMV', inducer: 'Constitutive', features: 'Strong constitutive expression' },
      { id: 'pcaggs', name: 'pCAGGS', tag: 'Fc, His-tag', promoter: 'CAG', inducer: 'Constitutive', features: 'High-level constitutive expression' },
      { id: 'pcdna', name: 'pcDNA3.1', tag: 'V5, His-tag', promoter: 'CMV', inducer: 'Constitutive/Tet', features: 'Versatile, with inducible options' }
    ]
  };
  
  const proteinTypes = [
    { id: 'gfp', name: 'Green Fluorescent Protein (GFP)', size: '27 kDa', solubility: 'High', complexity: 'Low', description: 'Fluorescent protein used as a reporter and fusion tag.' },
    { id: 'lysozyme', name: 'Lysozyme', size: '14 kDa', solubility: 'High', complexity: 'Low-Medium', description: 'Enzyme that damages bacterial cell walls by catalyzing hydrolysis of peptidoglycan.' },
    { id: 'albumin', name: 'Serum Albumin', size: '66 kDa', solubility: 'High', complexity: 'Medium', description: 'Transport protein abundant in blood plasma, binds water, ions, fatty acids, hormones, and bilirubin.' },
    { id: 'antibody', name: 'Antibody (IgG)', size: '150 kDa', solubility: 'Medium', complexity: 'High', description: 'Complex glycoprotein used by the immune system to neutralize pathogens.' },
    { id: 'membrane', name: 'Membrane Protein', size: 'Variable', solubility: 'Low', complexity: 'Very High', description: 'Proteins associated with cell membranes, challenging to express in soluble form.' }
  ];
  
  const fusionTags = [
    { id: 'his', name: 'His-tag (6xHis)', size: '1 kDa', solubilityEffect: 'Neutral', purificationMethod: 'IMAC', cleavable: 'Yes', description: 'Small tag for purification using immobilized metal affinity chromatography.' },
    { id: 'gst', name: 'Glutathione S-transferase (GST)', size: '26 kDa', solubilityEffect: 'Enhancing', purificationMethod: 'Glutathione affinity', cleavable: 'Yes', description: 'Large tag that can enhance solubility of fusion partners.' },
    { id: 'mbp', name: 'Maltose Binding Protein (MBP)', size: '42 kDa', solubilityEffect: 'Strongly enhancing', purificationMethod: 'Amylose resin', cleavable: 'Yes', description: 'Large tag known for significantly improving solubility of difficult proteins.' },
    { id: 'sumo', name: 'SUMO', size: '11 kDa', solubilityEffect: 'Enhancing', purificationMethod: 'Various', cleavable: 'Yes (specific protease)', description: 'Small ubiquitin-like modifier that enhances expression and solubility.' },
    { id: 'none', name: 'No tag', size: '0 kDa', solubilityEffect: 'None', purificationMethod: 'Various', cleavable: 'N/A', description: 'Native protein without fusion tags. May require protein-specific purification strategy.' }
  ];
  
  // Get the current vector information based on expression system
  const getCurrentVectorInfo = () => {
    const systemVectors = vectors[expressionSystem] || [];
    return systemVectors.find(v => v.id === vector) || systemVectors[0] || {};
  };
  
  // Get info about the current expression system
  const getCurrentSystemInfo = () => {
    return expressionSystems.find(system => system.id === expressionSystem) || expressionSystems[0];
  };
  
  // Get current protein type information
  const getCurrentProteinInfo = () => {
    return proteinTypes.find(p => p.id === proteinType) || proteinTypes[0];
  };
  
  // Get current fusion tag information
  const getCurrentTagInfo = () => {
    return fusionTags.find(t => t.id === fusionTag) || fusionTags[0];
  };
  
  // Update the available vectors when the expression system changes
  useEffect(() => {
    // Set default vector for the selected expression system
    const systemVectors = vectors[expressionSystem] || [];
    if (systemVectors.length > 0 && !systemVectors.some(v => v.id === vector)) {
      setVector(systemVectors[0].id);
    }
    
    // Reset simulation if expression system changes
    resetSimulation();
  }, [expressionSystem]);
  
  // Handler functions for changes
  const handleExpressionSystemChange = (event) => {
    setExpressionSystem(event.target.value);
  };
  
  const handleVectorChange = (event) => {
    setVector(event.target.value);
    resetSimulation();
  };
  
  const handleProteinTypeChange = (event) => {
    setProteinType(event.target.value);
    resetSimulation();
  };
  
  const handleFusionTagChange = (event) => {
    setFusionTag(event.target.value);
    resetSimulation();
  };
  
  const handleTemperatureChange = (event) => {
    setTemperature(parseInt(event.target.value));
    resetSimulation();
  };
  
  const handleInductionODChange = (event, newValue) => {
    setInductionOD(newValue);
    resetSimulation();
  };
  
  const handleInductionConcentrationChange = (event, newValue) => {
    setInductionConcentration(newValue);
    resetSimulation();
  };
  
  const handleGrowthTimeChange = (event, newValue) => {
    setGrowthTime(newValue);
    resetSimulation();
  };
  
  // Reset the simulation state
  const resetSimulation = () => {
    setSimulationRunning(false);
    setSimulationComplete(false);
    setSimulationProgress(0);
    setCurrentStep('');
    setExpressionResults({
      proteinYield: 0,
      solubility: 0,
      purity: 0,
      activity: 0,
      aggregation: 0,
      warningMessages: [],
      recommendationMessages: []
    });
  };
  
  // Run the protein expression simulation
  const runSimulation = () => {
    resetSimulation();
    setSimulationRunning(true);
    setCurrentStep('Culture Growth');
    
    // Simulate the progression of the expression experiment
    const simulationSteps = [
      { name: 'Culture Growth', duration: 20 },
      { name: 'Induction', duration: 10 },
      { name: 'Protein Expression', duration: 40 },
      { name: 'Cell Harvesting', duration: 10 },
      { name: 'Cell Lysis', duration: 10 },
      { name: 'Protein Analysis', duration: 10 }
    ];
    
    let currentProgress = 0;
    let currentStepIndex = 0;
    
    const simulationInterval = setInterval(() => {
      if (currentProgress >= 100) {
        clearInterval(simulationInterval);
        setSimulationRunning(false);
        setSimulationComplete(true);
        const results = calculateExpressionResults();
        setExpressionResults(results);
        return;
      }
      
      const step = simulationSteps[currentStepIndex];
      setCurrentStep(step.name);
      
      currentProgress += 1;
      setSimulationProgress(currentProgress);
      
      // Move to next step if current step is complete
      if (currentProgress >= 
          simulationSteps.slice(0, currentStepIndex + 1).reduce((sum, s) => sum + s.duration, 0)) {
        currentStepIndex = Math.min(currentStepIndex + 1, simulationSteps.length - 1);
      }
    }, 200); // Update every 200ms for smooth progress
  };
  
  // Calculate the results of the protein expression
  const calculateExpressionResults = () => {
    let proteinYield = 0;
    let solubility = 0;
    let purity = 0;
    let activity = 0;
    let aggregation = 0;
    const warningMessages = [];
    const recommendationMessages = [];
    
    // Get the current system, vector, protein, and tag info
    const systemInfo = getCurrentSystemInfo();
    const vectorInfo = getCurrentVectorInfo();
    const proteinInfo = getCurrentProteinInfo();
    const tagInfo = getCurrentTagInfo();
    
    // Base yield based on expression system and vector
    switch (expressionSystem) {
      case 'ecoli':
        proteinYield = 75; // Base yield for E. coli
        solubility = 60;
        purity = 70;
        activity = 75;
        break;
      case 'yeast':
        proteinYield = 60;
        solubility = 70;
        purity = 65;
        activity = 80;
        break;
      case 'insect':
        proteinYield = 50;
        solubility = 80;
        purity = 75;
        activity = 85;
        break;
      case 'mammalian':
        proteinYield = 30;
        solubility = 85;
        purity = 80;
        activity = 90;
        break;
      default:
        proteinYield = 50;
    }
    
    // Adjust for protein type
    switch (proteinType) {
      case 'gfp':
        proteinYield *= 1.2; // GFP expresses well
        solubility *= 1.2;
        activity *= 1.1;
        break;
      case 'lysozyme':
        proteinYield *= 1.1;
        solubility *= 1.1;
        activity *= 1.0;
        break;
      case 'albumin':
        proteinYield *= 0.9;
        solubility *= 1.0;
        activity *= 1.0;
        break;
      case 'antibody':
        if (expressionSystem === 'ecoli') {
          proteinYield *= 0.3;
          solubility *= 0.4;
          activity *= 0.2;
          warningMessages.push('Antibodies typically require eukaryotic expression systems for proper folding and glycosylation.');
          recommendationMessages.push('Consider using mammalian or insect cell expression for antibody production.');
        } else {
          proteinYield *= 0.8;
          solubility *= 0.9;
          activity *= 1.0;
        }
        break;
      case 'membrane':
        proteinYield *= 0.4;
        solubility *= 0.3;
        activity *= 0.6;
        warningMessages.push('Membrane proteins are challenging to express in soluble form.');
        recommendationMessages.push('Consider adding detergents during lysis and purification, or using membrane-mimetic systems.');
        break;
      default:
        // No adjustment
    }
    
    // Adjust for fusion tag
    switch (fusionTag) {
      case 'his':
        // Minimal effect on solubility
        purity *= 1.1; // Good for purification
        break;
      case 'gst':
        solubility *= 1.2;
        proteinYield *= 0.9; // Slightly lower yield due to large tag
        purity *= 1.0;
        break;
      case 'mbp':
        solubility *= 1.4;
        proteinYield *= 0.8; // Lower yield due to large tag
        purity *= 0.9;
        if (proteinType === 'membrane') {
          solubility *= 1.5; // MBP especially helps membrane proteins
          recommendationMessages.push('MBP tag is a good choice for improving membrane protein solubility.');
        }
        break;
      case 'sumo':
        solubility *= 1.3;
        proteinYield *= 0.9;
        purity *= 1.0;
        break;
      case 'none':
        purity *= 0.8; // Harder to purify without tag
        if (proteinType === 'membrane' || proteinType === 'antibody') {
          warningMessages.push('Complex proteins often benefit from solubility-enhancing fusion tags.');
          recommendationMessages.push('Consider adding a solubility-enhancing tag like MBP or SUMO.');
        }
        break;
      default:
        // No adjustment
    }
    
    // Temperature effects
    if (expressionSystem === 'ecoli') {
      if (temperature < 20) {
        proteinYield *= 0.6; // Lower yield at low temp
        solubility *= 1.3; // But better solubility
        activity *= 1.1; // And better activity
        warningMessages.push('Low temperature expression reduces yield but can improve solubility.');
      } else if (temperature > 30) {
        proteinYield *= 1.2; // Higher yield at higher temp
        solubility *= 0.8; // But lower solubility
        activity *= 0.9; // And lower activity
        if (proteinType === 'membrane' || proteinType === 'antibody') {
          solubility *= 0.7; // Complex proteins suffer more at high temps
          activity *= 0.7;
          warningMessages.push('High temperature expression may cause inclusion body formation for complex proteins.');
          recommendationMessages.push('Consider reducing expression temperature to 18-25°C for better folding.');
        }
      }
    } else if (expressionSystem === 'yeast') {
      if (Math.abs(temperature - 30) > 5) {
        proteinYield *= 0.8; // Yield drops away from optimal
        warningMessages.push('Yeast expression is typically optimal around 30°C.');
      }
    } else if (expressionSystem === 'insect') {
      if (Math.abs(temperature - 27) > 3) {
        proteinYield *= 0.7;
        activity *= 0.8;
        warningMessages.push('Insect cell expression is typically performed at 27°C.');
      }
    } else if (expressionSystem === 'mammalian') {
      if (Math.abs(temperature - 37) > 2) {
        proteinYield *= 0.6;
        activity *= 0.7;
        warningMessages.push('Mammalian cell expression is typically performed at 37°C.');
      }
    }
    
    // Induction OD effects
    if (expressionSystem === 'ecoli' || expressionSystem === 'yeast') {
      if (inductionOD < 0.4) {
        proteinYield *= 0.7; // Too early induction reduces yield
        warningMessages.push('Induction at very low cell density may result in reduced yield.');
      } else if (inductionOD > 1.0) {
        proteinYield *= 0.9; // Late induction slightly reduces yield
        solubility *= 1.1; // But may improve solubility
      }
    }
    
    // Induction concentration effects
    if (expressionSystem === 'ecoli' && (vectorInfo.inducer === 'IPTG' || vectorInfo.inducer === 'Arabinose')) {
      if (inductionConcentration < 0.2) {
        proteinYield *= 0.7; // Low inducer concentration reduces yield
        solubility *= 1.1; // But may improve solubility
        warningMessages.push('Low inducer concentration may result in reduced protein yield.');
      } else if (inductionConcentration > 1.0) {
        proteinYield *= 1.1; // Higher concentration increases yield
        solubility *= 0.9; // But may reduce solubility
        activity *= 0.9; // And reduce activity
        if (inductionConcentration > 1.5) {
          warningMessages.push('High inducer concentration may be toxic to cells and reduce protein quality.');
          recommendationMessages.push('Consider using 0.5-1.0 mM IPTG for optimal balance between yield and quality.');
        }
      }
    }
    
    // Growth time effects
    if (growthTime < 2) {
      proteinYield *= 0.6; // Short expression time reduces yield
      warningMessages.push('Short expression time may result in reduced protein yield.');
    } else if (growthTime > 6) {
      if (expressionSystem === 'ecoli') {
        proteinYield *= 1.1; // More time can increase yield
        solubility *= 0.9; // But may reduce solubility
        activity *= 0.9; // And reduce activity
        if (growthTime > 12) {
          warningMessages.push('Very long expression times may lead to protein degradation or toxicity to host cells.');
        }
      }
    }
    
    // Media type effects
    if (mediaType === 'tb' && expressionSystem === 'ecoli') {
      proteinYield *= 1.3; // TB media generally gives higher yield
    } else if (mediaType === 'minimal' && expressionSystem === 'ecoli') {
      proteinYield *= 0.7; // Minimal media gives lower yield
      activity *= 1.1; // But may have better quality
    }
    
    // Autoinduction effects
    if (useAutoinduction && expressionSystem === 'ecoli') {
      proteinYield *= 1.2; // Autoinduction often increases yield
      solubility *= 1.1; // And can improve solubility
    }
    
    // Aeration effects
    if (aeration < 150) {
      proteinYield *= 0.8; // Low aeration reduces yield
      warningMessages.push('Insufficient aeration may limit cell growth and protein yield.');
    } else if (aeration > 250) {
      proteinYield *= 1.1; // High aeration can increase yield
    }
    
    // Solubility enhancers effect
    if (addSolubilityEnhancers) {
      solubility *= 1.2; // Improves solubility
      if (proteinType === 'membrane') {
        solubility *= 1.3; // Even more for membrane proteins
      }
    }
    
    // Codon optimization effect
    if (!codonOptimization) {
      proteinYield *= 0.7; // Reduces yield without codon optimization
      if (expressionSystem === 'ecoli' && (proteinType === 'antibody' || proteinType === 'albumin')) {
        proteinYield *= 0.7; // Even worse for mammalian proteins in E. coli
        warningMessages.push('Mammalian proteins expressed in E. coli benefit significantly from codon optimization.');
      }
    }
    
    // Calculate aggregation as inverse of solubility
    aggregation = Math.max(0, 100 - solubility);
    
    // Cap values between 0-100
    proteinYield = Math.min(100, Math.max(5, Math.round(proteinYield)));
    solubility = Math.min(100, Math.max(5, Math.round(solubility)));
    purity = Math.min(100, Math.max(5, Math.round(purity)));
    activity = Math.min(100, Math.max(5, Math.round(activity)));
    aggregation = Math.min(100, Math.max(0, Math.round(aggregation)));
    
    // Add general recommendations based on final results
    if (proteinYield < 30) {
      recommendationMessages.push('For improved yield, consider optimizing codon usage, changing vector, or adjusting induction parameters.');
    }
    
    if (solubility < 40) {
      recommendationMessages.push('To improve solubility, consider lower expression temperature, solubility-enhancing tags, or chaperone co-expression.');
    }
    
    if (activity < 40) {
      recommendationMessages.push('Low activity may indicate misfolding. Try expression conditions that promote proper folding and post-translational modifications.');
    }
    
    // Remove duplicate recommendations
    const uniqueRecommendations = [...new Set(recommendationMessages)];
    const uniqueWarnings = [...new Set(warningMessages)];
    
    return {
      proteinYield,
      solubility,
      purity,
      activity,
      aggregation,
      warningMessages: uniqueWarnings,
      recommendationMessages: uniqueRecommendations
    };
  };
  
  return (
    <Box sx={{ width: '100%' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Protein Expression Simulator
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Design and optimize a recombinant protein expression system. Set parameters to see how they affect protein yield, solubility, and activity.
        </Typography>
        
        <Grid container spacing={3}>
          {/* Left column - Expression Setup */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Expression System & Target Protein
              </Typography>
              
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="expression-system-label">Expression System</InputLabel>
                <Select
                  labelId="expression-system-label"
                  id="expression-system"
                  value={expressionSystem}
                  label="Expression System"
                  onChange={handleExpressionSystemChange}
                >
                  {expressionSystems.map((system) => (
                    <MenuItem key={system.id} value={system.id}>
                      {system.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="vector-label">Expression Vector</InputLabel>
                <Select
                  labelId="vector-label"
                  id="vector"
                  value={vector}
                  label="Expression Vector"
                  onChange={handleVectorChange}
                >
                  {(vectors[expressionSystem] || []).map((vectorOption) => (
                    <MenuItem key={vectorOption.id} value={vectorOption.id}>
                      {vectorOption.name} ({vectorOption.promoter})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {getCurrentVectorInfo().id && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Promoter:</strong> {getCurrentVectorInfo().promoter} | 
                    <strong> Inducer:</strong> {getCurrentVectorInfo().inducer} | 
                    <strong> Tags:</strong> {getCurrentVectorInfo().tag}
                  </Typography>
                </Box>
              )}
              
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="protein-type-label">Target Protein</InputLabel>
                <Select
                  labelId="protein-type-label"
                  id="protein-type"
                  value={proteinType}
                  label="Target Protein"
                  onChange={handleProteinTypeChange}
                >
                  {proteinTypes.map((protein) => (
                    <MenuItem key={protein.id} value={protein.id}>
                      {protein.name} ({protein.size})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {getCurrentProteinInfo().id && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Solubility:</strong> {getCurrentProteinInfo().solubility} | 
                    <strong> Complexity:</strong> {getCurrentProteinInfo().complexity}
                  </Typography>
                  <Typography variant="caption" display="block" color="text.secondary">
                    {getCurrentProteinInfo().description}
                  </Typography>
                </Box>
              )}
              
              <FormControl fullWidth margin="normal" size="small">
                <InputLabel id="fusion-tag-label">Fusion Tag</InputLabel>
                <Select
                  labelId="fusion-tag-label"
                  id="fusion-tag"
                  value={fusionTag}
                  label="Fusion Tag"
                  onChange={handleFusionTagChange}
                >
                  {fusionTags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name} ({tag.size})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              {getCurrentTagInfo().id && (
                <Box sx={{ mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    <strong>Solubility Effect:</strong> {getCurrentTagInfo().solubilityEffect} | 
                    <strong> Purification:</strong> {getCurrentTagInfo().purificationMethod}
                  </Typography>
                </Box>
              )}
            </Paper>
            
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Expression Conditions
              </Typography>
              
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth margin="normal" size="small">
                    <InputLabel id="temperature-label">Temperature (°C)</InputLabel>
                    <Select
                      labelId="temperature-label"
                      id="temperature"
                      value={temperature}
                      label="Temperature (°C)"
                      onChange={handleTemperatureChange}
                    >
                      {expressionSystem === 'ecoli' && (
                        <>
                          <MenuItem value={18}>18°C (Slow, improved folding)</MenuItem>
                          <MenuItem value={25}>25°C (Moderate)</MenuItem>
                          <MenuItem value={30}>30°C (Standard)</MenuItem>
                          <MenuItem value={37}>37°C (Fast growth)</MenuItem>
                        </>
                      )}
                      {expressionSystem === 'yeast' && (
                        <>
                          <MenuItem value={25}>25°C (Low)</MenuItem>
                          <MenuItem value={30}>30°C (Optimal)</MenuItem>
                          <MenuItem value={37}>37°C (High)</MenuItem>
                        </>
                      )}
                      {expressionSystem === 'insect' && (
                        <>
                          <MenuItem value={22}>22°C (Low)</MenuItem>
                          <MenuItem value={27}>27°C (Optimal)</MenuItem>
                          <MenuItem value={30}>30°C (High)</MenuItem>
                        </>
                      )}
                      {expressionSystem === 'mammalian' && (
                        <>
                          <MenuItem value={30}>30°C (Low)</MenuItem>
                          <MenuItem value={33}>33°C (Moderate)</MenuItem>
                          <MenuItem value={37}>37°C (Optimal)</MenuItem>
                        </>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  {(expressionSystem === 'ecoli' || expressionSystem === 'yeast') && (
                    <Box sx={{ width: '100%', padding: 1 }}>
                      <Typography id="induction-od-slider" gutterBottom variant="body2">
                        Induction Cell Density (OD₆₀₀)
                      </Typography>
                      <Slider
                        value={inductionOD}
                        onChange={handleInductionODChange}
                        aria-labelledby="induction-od-slider"
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks={[
                          { value: 0.2, label: '0.2' },
                          { value: 0.6, label: '0.6' },
                          { value: 1.0, label: '1.0' }
                        ]}
                        min={0.2}
                        max={1.2}
                      />
                    </Box>
                  )}
                  
                  {(expressionSystem === 'insect' || expressionSystem === 'mammalian') && (
                    <FormControl fullWidth margin="normal" size="small">
                      <InputLabel id="confluency-label">Cell Confluency (%)</InputLabel>
                      <Select
                        labelId="confluency-label"
                        id="confluency"
                        value={inductionOD * 100}
                        label="Cell Confluency (%)"
                        onChange={(e) => setInductionOD(e.target.value / 100)}
                      >
                        <MenuItem value={50}>50% (Low)</MenuItem>
                        <MenuItem value={70}>70% (Optimal)</MenuItem>
                        <MenuItem value={90}>90% (High)</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  {getCurrentVectorInfo().inducer !== 'Constitutive' && getCurrentVectorInfo().inducer !== 'Viral infection' && (
                    <Box sx={{ width: '100%', padding: 1 }}>
                      <Typography id="induction-concentration-slider" gutterBottom variant="body2">
                        {getCurrentVectorInfo().inducer === 'IPTG' ? 'IPTG Concentration (mM)' : 
                          getCurrentVectorInfo().inducer === 'Arabinose' ? 'Arabinose Concentration (%)' :
                            getCurrentVectorInfo().inducer === 'Galactose' ? 'Galactose Concentration (%)' :
                              'Inducer Concentration'}
                      </Typography>
                      <Slider
                        value={inductionConcentration}
                        onChange={handleInductionConcentrationChange}
                        aria-labelledby="induction-concentration-slider"
                        valueLabelDisplay="auto"
                        step={0.1}
                        marks={[
                          { value: 0.1, label: '0.1' },
                          { value: 0.5, label: '0.5' },
                          { value: 1.0, label: '1.0' }
                        ]}
                        min={0.1}
                        max={2.0}
                      />
                    </Box>
                  )}
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ width: '100%', padding: 1 }}>
                    <Typography id="growth-time-slider" gutterBottom variant="body2">
                      {expressionSystem === 'ecoli' ? 'Post-Induction Growth (hours)' : 
                        expressionSystem === 'yeast' ? 'Expression Time (hours)' :
                          expressionSystem === 'insect' ? 'Post-Infection Time (days)' :
                            'Expression Time (days)'}
                    </Typography>
                    <Slider
                      value={growthTime}
                      onChange={handleGrowthTimeChange}
                      aria-labelledby="growth-time-slider"
                      valueLabelDisplay="auto"
                      step={expressionSystem === 'ecoli' || expressionSystem === 'yeast' ? 1 : 0.5}
                      marks={
                        expressionSystem === 'ecoli' || expressionSystem === 'yeast' ? 
                          [
                            { value: 2, label: '2h' },
                            { value: 4, label: '4h' },
                            { value: 16, label: 'O/N' }
                          ] :
                          [
                            { value: 1, label: '1d' },
                            { value: 3, label: '3d' },
                            { value: 5, label: '5d' }
                          ]
                      }
                      min={expressionSystem === 'ecoli' || expressionSystem === 'yeast' ? 1 : 0.5}
                      max={expressionSystem === 'ecoli' || expressionSystem === 'yeast' ? 24 : 7}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Accordion sx={{ mt: 2 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="advanced-options-content"
                  id="advanced-options-header"
                >
                  <Typography variant="subtitle2">Advanced Options</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControl fullWidth size="small">
                        <InputLabel id="media-type-label">Growth Media</InputLabel>
                        <Select
                          labelId="media-type-label"
                          id="media-type"
                          value={mediaType}
                          label="Growth Media"
                          onChange={(e) => {
                            setMediaType(e.target.value);
                            resetSimulation();
                          }}
                        >
                          {expressionSystem === 'ecoli' && (
                            <>
                              <MenuItem value="lb">LB (Standard)</MenuItem>
                              <MenuItem value="tb">TB (High-yield)</MenuItem>
                              <MenuItem value="minimal">Minimal Media (Defined)</MenuItem>
                            </>
                          )}
                          {expressionSystem === 'yeast' && (
                            <>
                              <MenuItem value="ypd">YPD (Rich)</MenuItem>
                              <MenuItem value="sc">SC (Synthetic Complete)</MenuItem>
                            </>
                          )}
                          {expressionSystem === 'insect' && (
                            <>
                              <MenuItem value="sf900">Sf-900™ III SFM</MenuItem>
                              <MenuItem value="express">Express Five® SFM</MenuItem>
                            </>
                          )}
                          {expressionSystem === 'mammalian' && (
                            <>
                              <MenuItem value="dmem">DMEM + 10% FBS</MenuItem>
                              <MenuItem value="expi">Expi293™ Medium</MenuItem>
                            </>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <TextField
                        label="Antibiotic Concentration (μg/mL)"
                        type="number"
                        fullWidth
                        size="small"
                        value={antibioticConcentration}
                        onChange={(e) => {
                          setAntibioticConcentration(parseInt(e.target.value) || 50);
                          resetSimulation();
                        }}
                        inputProps={{ min: 10, max: 200 }}
                      />
                    </Grid>
                    
                    {(expressionSystem === 'ecoli' || expressionSystem === 'yeast') && (
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Aeration (RPM)"
                          type="number"
                          fullWidth
                          size="small"
                          value={aeration}
                          onChange={(e) => {
                            setAeration(parseInt(e.target.value) || 200);
                            resetSimulation();
                          }}
                          inputProps={{ min: 50, max: 350 }}
                        />
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <FormGroup>
                        {expressionSystem === 'ecoli' && (
                          <FormControlLabel
                            control={
                              <Checkbox 
                                checked={useAutoinduction} 
                                onChange={(e) => {
                                  setUseAutoinduction(e.target.checked);
                                  resetSimulation();
                                }}
                                size="small"
                              />
                            }
                            label="Use autoinduction media (for T7-based vectors)"
                          />
                        )}
                        
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={addSolubilityEnhancers} 
                              onChange={(e) => {
                                setAddSolubilityEnhancers(e.target.checked);
                                resetSimulation();
                              }}
                              size="small"
                            />
                          }
                          label={expressionSystem === 'ecoli' ? 
                                  "Add solubility enhancers (chaperones, glycerol, etc.)" : 
                                  "Optimize for solubility (additives, culture conditions)"}
                        />
                        
                        <FormControlLabel
                          control={
                            <Checkbox 
                              checked={codonOptimization} 
                              onChange={(e) => {
                                setCodonOptimization(e.target.checked);
                                resetSimulation();
                              }}
                              size="small"
                            />
                          }
                          label="Use codon-optimized gene sequence"
                        />
                      </FormGroup>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Paper>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="outlined" 
                startIcon={<RestartAltIcon />}
                onClick={resetSimulation}
              >
                Reset
              </Button>
              
              <Button 
                variant="contained" 
                startIcon={<PlayArrowIcon />}
                onClick={runSimulation}
                disabled={simulationRunning}
              >
                Run Expression
              </Button>
            </Box>
          </Grid>
          
          {/* Right column - Simulation and Results */}
          <Grid item xs={12} md={6}>
            <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
              <Typography variant="subtitle1" gutterBottom>
                Expression Simulation
              </Typography>
              
              {!simulationRunning && !simulationComplete && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    Set up your protein expression parameters and click "Run Expression" to start the simulation.
                  </Typography>
                </Box>
              )}
              
              {simulationRunning && (
                <Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" fontWeight="medium">Current Step:</Typography>
                    <Typography variant="body2" color="primary">{currentStep}</Typography>
                  </Box>
                  
                  <LinearProgress 
                    variant="determinate" 
                    value={simulationProgress} 
                    sx={{ height: 8, borderRadius: 1, mb: 2 }}
                  />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      {expressionSystem === 'ecoli' ? 'Simulating bacterial expression process...' :
                       expressionSystem === 'yeast' ? 'Simulating yeast expression process...' :
                       expressionSystem === 'insect' ? 'Simulating baculovirus expression process...' :
                       'Simulating mammalian cell expression process...'}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {simulationComplete && (
                <Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" gutterBottom>Protein Yield</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={expressionResults.proteinYield} 
                            color={expressionResults.proteinYield > 60 ? "success" : 
                                  expressionResults.proteinYield > 30 ? "warning" : "error"}
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {expressionResults.proteinYield}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" gutterBottom>Solubility</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={expressionResults.solubility} 
                            color={expressionResults.solubility > 60 ? "success" : 
                                  expressionResults.solubility > 30 ? "warning" : "error"}
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {expressionResults.solubility}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" gutterBottom>Protein Activity</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={expressionResults.activity} 
                            color={expressionResults.activity > 60 ? "success" : 
                                  expressionResults.activity > 30 ? "warning" : "error"}
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {expressionResults.activity}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" gutterBottom>Purity</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={expressionResults.purity} 
                            color={expressionResults.purity > 60 ? "success" : 
                                  expressionResults.purity > 30 ? "warning" : "error"}
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {expressionResults.purity}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                    
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" gutterBottom>Aggregation</Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress 
                            variant="determinate" 
                            value={expressionResults.aggregation} 
                            color={expressionResults.aggregation < 30 ? "success" : 
                                  expressionResults.aggregation < 60 ? "warning" : "error"}
                            sx={{ height: 10, borderRadius: 1 }}
                          />
                        </Box>
                        <Box>
                          <Typography variant="body2" fontWeight="medium">
                            {expressionResults.aggregation}%
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Analysis & Recommendations
                    </Typography>
                    
                    {expressionResults.warningMessages.length > 0 && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" gutterBottom>
                          Potential Issues:
                        </Typography>
                        {expressionResults.warningMessages.map((warning, index) => (
                          <Alert key={`warning-${index}`} severity="warning" sx={{ mb: 1 }}>
                            {warning}
                          </Alert>
                        ))}
                      </Box>
                    )}
                    
                    {expressionResults.recommendationMessages.length > 0 && (
                      <Box>
                        <Typography variant="body2" gutterBottom>
                          Recommendations:
                        </Typography>
                        {expressionResults.recommendationMessages.map((recommendation, index) => (
                          <Alert key={`rec-${index}`} severity="info" icon={<CheckCircleIcon />} sx={{ mb: 1 }}>
                            {recommendation}
                          </Alert>
                        ))}
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Expression Summary
                    </Typography>
                    
                    <Paper variant="outlined" sx={{ p: 1.5, bgcolor: '#f8f9fa' }}>
                      <Typography variant="body2">
                        {expressionResults.proteinYield > 70 ? "High" : 
                         expressionResults.proteinYield > 40 ? "Moderate" : "Low"} yield of 
                        {expressionResults.solubility > 70 ? " highly soluble " : 
                         expressionResults.solubility > 40 ? " moderately soluble " : " poorly soluble "}
                        protein with 
                        {expressionResults.activity > 70 ? " excellent " : 
                         expressionResults.activity > 40 ? " good " : " limited "} activity.
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        Expression in {getCurrentSystemInfo().name} using {getCurrentVectorInfo().name} vector
                        {fusionTag !== 'none' ? ` with ${getCurrentTagInfo().name}` : ''} resulted in 
                        {expressionResults.proteinYield > 70 ? " high-level" : 
                         expressionResults.proteinYield > 40 ? " moderate" : " low-level"} production of
                        {proteinType === 'gfp' ? " Green Fluorescent Protein" : 
                         proteinType === 'lysozyme' ? " Lysozyme" :
                         proteinType === 'albumin' ? " Serum Albumin" :
                         proteinType === 'antibody' ? " Antibody" : " Membrane Protein"}.
                      </Typography>
                    </Paper>
                  </Box>
                </Box>
              )}
            </Paper>
            
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  Expression System Properties
                </Typography>
                
                <Box>
                  <Typography variant="subtitle2" color="primary">
                    {getCurrentSystemInfo().name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {getCurrentSystemInfo().description}
                  </Typography>
                  
                  <Grid container spacing={1}>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="caption" component="div" fontWeight="medium">
                          Optimal Temp:
                        </Typography>
                        <Typography variant="caption" component="div">
                          {getCurrentSystemInfo().optimalTemp}
                        </Typography>
                      </Stack>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Stack direction="row" spacing={1}>
                        <Typography variant="caption" component="div" fontWeight="medium">
                          Induction:
                        </Typography>
                        <Typography variant="caption" component="div">
                          {getCurrentSystemInfo().inductionMethod}
                        </Typography>
                      </Stack>
                    </Grid>
                  </Grid>
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" fontWeight="medium">
                      Advantages:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {getCurrentSystemInfo().advantages.map((advantage, index) => (
                        <Chip 
                          key={index} 
                          label={advantage} 
                          size="small" 
                          color="success" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                  
                  <Box sx={{ mt: 1 }}>
                    <Typography variant="caption" fontWeight="medium">
                      Disadvantages:
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 0.5 }}>
                      {getCurrentSystemInfo().disadvantages.map((disadvantage, index) => (
                        <Chip 
                          key={index} 
                          label={disadvantage} 
                          size="small" 
                          color="error" 
                          variant="outlined"
                          sx={{ fontSize: '0.7rem' }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
      
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <InfoIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">
            Protein Expression Educational Notes
          </Typography>
        </Box>
        
        <Typography variant="body2" paragraph>
          Recombinant protein expression is the process of using host cells to produce proteins encoded by cloned DNA. The choice of expression system, vector, and culture conditions significantly affects protein yield, solubility, and activity.
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Expression Systems
              </Typography>
              <Typography variant="body2">
                Different host organisms offer distinct advantages. Bacterial systems (E. coli) provide high yields but lack post-translational modifications. Yeast combines high growth rates with some eukaryotic processing. Insect and mammalian cells offer complex folding and modifications but with lower yields and higher costs.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Key Parameters
              </Typography>
              <Typography variant="body2">
                Protein expression is influenced by numerous factors: temperature affects folding and growth rate; induction timing impacts yield and toxicity; media composition provides necessary nutrients; aeration supplies oxygen; and fusion tags can enhance solubility and facilitate purification.
              </Typography>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
              <Typography variant="subtitle2" color="primary" gutterBottom>
                Common Challenges
              </Typography>
              <Typography variant="body2">
                Protein expression often encounters issues such as inclusion body formation (insoluble aggregates), low yield, protein toxicity to host cells, improper folding, and lack of activity. Optimization strategies include lowering temperature, using solubility-enhancing tags, adjusting induction parameters, and selecting appropriate host systems.
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProteinExpressionSimulator;