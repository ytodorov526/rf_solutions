import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
  Tooltip,
  Alert,
  CircularProgress
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import SettingsIcon from '@mui/icons-material/Settings';
import SpeedIcon from '@mui/icons-material/Speed';
import BiotechIcon from '@mui/icons-material/Biotech';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import FastForwardIcon from '@mui/icons-material/FastForward';
import ScienceIcon from '@mui/icons-material/Science';
import InfoIcon from '@mui/icons-material/Info';
import TemperatureIcon from '@mui/icons-material/Thermostat';
import PrecisionManufacturingIcon from '@mui/icons-material/PrecisionManufacturing';

// Biochemical pathways data
const pathways = {
  glycolysis: {
    name: "Glycolysis",
    description: "The metabolic pathway that converts glucose into pyruvate, releasing energy in the form of ATP and NADH.",
    steps: [
      { 
        id: 1, 
        name: "Glucose Phosphorylation", 
        reactants: ["Glucose", "ATP"],
        products: ["Glucose-6-phosphate", "ADP"],
        enzyme: "Hexokinase",
        details: "Phosphorylation of glucose by ATP to form glucose-6-phosphate, catalyzed by hexokinase. This step requires energy from ATP hydrolysis."
      },
      { 
        id: 2, 
        name: "Isomerization", 
        reactants: ["Glucose-6-phosphate"],
        products: ["Fructose-6-phosphate"],
        enzyme: "Phosphoglucose isomerase",
        details: "Conversion of glucose-6-phosphate to fructose-6-phosphate, catalyzed by phosphoglucose isomerase. This isomerization prepares the molecule for the next phosphorylation step."
      },
      { 
        id: 3, 
        name: "Phosphorylation", 
        reactants: ["Fructose-6-phosphate", "ATP"],
        products: ["Fructose-1,6-bisphosphate", "ADP"],
        enzyme: "Phosphofructokinase",
        details: "Phosphorylation of fructose-6-phosphate by ATP to form fructose-1,6-bisphosphate, catalyzed by phosphofructokinase. This is a key regulatory step in glycolysis."
      },
      { 
        id: 4, 
        name: "Cleavage", 
        reactants: ["Fructose-1,6-bisphosphate"],
        products: ["Dihydroxyacetone phosphate", "Glyceraldehyde-3-phosphate"],
        enzyme: "Aldolase",
        details: "Cleavage of fructose-1,6-bisphosphate into two 3-carbon molecules: dihydroxyacetone phosphate and glyceraldehyde-3-phosphate, catalyzed by aldolase."
      },
      { 
        id: 5, 
        name: "Isomerization", 
        reactants: ["Dihydroxyacetone phosphate"],
        products: ["Glyceraldehyde-3-phosphate"],
        enzyme: "Triose phosphate isomerase",
        details: "Conversion of dihydroxyacetone phosphate to glyceraldehyde-3-phosphate, catalyzed by triose phosphate isomerase. This ensures both 3-carbon products can continue through the pathway."
      },
      { 
        id: 6, 
        name: "Oxidation and Phosphorylation", 
        reactants: ["Glyceraldehyde-3-phosphate", "NAD+", "Pi"],
        products: ["1,3-Bisphosphoglycerate", "NADH", "H+"],
        enzyme: "Glyceraldehyde-3-phosphate dehydrogenase",
        details: "Oxidation of glyceraldehyde-3-phosphate and addition of inorganic phosphate, producing 1,3-bisphosphoglycerate and NADH, catalyzed by glyceraldehyde-3-phosphate dehydrogenase."
      },
      { 
        id: 7, 
        name: "Phosphate Transfer", 
        reactants: ["1,3-Bisphosphoglycerate", "ADP"],
        products: ["3-Phosphoglycerate", "ATP"],
        enzyme: "Phosphoglycerate kinase",
        details: "Transfer of a phosphate group from 1,3-bisphosphoglycerate to ADP, forming 3-phosphoglycerate and ATP, catalyzed by phosphoglycerate kinase. This is the first ATP-generating step in glycolysis."
      },
      { 
        id: 8, 
        name: "Isomerization", 
        reactants: ["3-Phosphoglycerate"],
        products: ["2-Phosphoglycerate"],
        enzyme: "Phosphoglycerate mutase",
        details: "Relocation of the phosphate group from the 3rd to the 2nd carbon, converting 3-phosphoglycerate to 2-phosphoglycerate, catalyzed by phosphoglycerate mutase."
      },
      { 
        id: 9, 
        name: "Dehydration", 
        reactants: ["2-Phosphoglycerate"],
        products: ["Phosphoenolpyruvate", "H2O"],
        enzyme: "Enolase",
        details: "Removal of a water molecule from 2-phosphoglycerate to form phosphoenolpyruvate, catalyzed by enolase. This creates a high-energy phosphate bond."
      },
      { 
        id: 10, 
        name: "Phosphate Transfer", 
        reactants: ["Phosphoenolpyruvate", "ADP"],
        products: ["Pyruvate", "ATP"],
        enzyme: "Pyruvate kinase",
        details: "Transfer of a phosphate group from phosphoenolpyruvate to ADP, forming pyruvate and ATP, catalyzed by pyruvate kinase. This is the second ATP-generating step in glycolysis."
      }
    ],
    netReaction: "Glucose + 2 NAD+ + 2 ADP + 2 Pi → 2 Pyruvate + 2 NADH + 2 H+ + 2 ATP + 2 H2O",
    energyYield: "Net 2 ATP and 2 NADH per glucose molecule",
    regulatoryFactors: [
      "ATP levels (high ATP inhibits phosphofructokinase)",
      "Citrate concentration (inhibits phosphofructokinase)",
      "AMP levels (activates phosphofructokinase)",
      "Fructose-2,6-bisphosphate (activates phosphofructokinase)"
    ]
  },
  krebs: {
    name: "Krebs Cycle (Citric Acid Cycle)",
    description: "A series of reactions in cellular respiration that generates energy through the oxidation of acetyl-CoA derived from carbohydrates, fats, and proteins.",
    steps: [
      { 
        id: 1, 
        name: "Citrate Formation", 
        reactants: ["Acetyl-CoA", "Oxaloacetate", "H2O"],
        products: ["Citrate", "CoA-SH"],
        enzyme: "Citrate synthase",
        details: "Acetyl-CoA combines with oxaloacetate to form citrate, releasing coenzyme A. This is the first step of the cycle and is irreversible."
      },
      { 
        id: 2, 
        name: "Isomerization", 
        reactants: ["Citrate"],
        products: ["cis-Aconitate", "H2O"],
        enzyme: "Aconitase",
        details: "Citrate is converted to cis-aconitate through dehydration, as the first part of a two-step isomerization."
      },
      { 
        id: 3, 
        name: "Hydration", 
        reactants: ["cis-Aconitate", "H2O"],
        products: ["Isocitrate"],
        enzyme: "Aconitase",
        details: "cis-Aconitate is rehydrated to form isocitrate, completing the isomerization process catalyzed by aconitase."
      },
      { 
        id: 4, 
        name: "Oxidative Decarboxylation", 
        reactants: ["Isocitrate", "NAD+"],
        products: ["α-Ketoglutarate", "CO2", "NADH", "H+"],
        enzyme: "Isocitrate dehydrogenase",
        details: "Isocitrate undergoes oxidation and loses a carbon dioxide molecule, producing α-ketoglutarate and NADH. This is an important regulatory step."
      },
      { 
        id: 5, 
        name: "Oxidative Decarboxylation", 
        reactants: ["α-Ketoglutarate", "NAD+", "CoA-SH"],
        products: ["Succinyl-CoA", "CO2", "NADH", "H+"],
        enzyme: "α-Ketoglutarate dehydrogenase complex",
        details: "α-Ketoglutarate is oxidized, loses a carbon dioxide molecule, and is combined with coenzyme A to form succinyl-CoA, also producing NADH."
      },
      { 
        id: 6, 
        name: "Substrate-level Phosphorylation", 
        reactants: ["Succinyl-CoA", "GDP", "Pi"],
        products: ["Succinate", "CoA-SH", "GTP"],
        enzyme: "Succinyl-CoA synthetase",
        details: "The thioester bond in succinyl-CoA is cleaved, leading to phosphorylation of GDP to GTP (equivalent to generating ATP)."
      },
      { 
        id: 7, 
        name: "Oxidation", 
        reactants: ["Succinate", "FAD"],
        products: ["Fumarate", "FADH2"],
        enzyme: "Succinate dehydrogenase",
        details: "Succinate is oxidized to fumarate, reducing FAD to FADH2. This is the only enzyme of the Krebs cycle embedded in the inner mitochondrial membrane."
      },
      { 
        id: 8, 
        name: "Hydration", 
        reactants: ["Fumarate", "H2O"],
        products: ["Malate"],
        enzyme: "Fumarase",
        details: "Fumarate is hydrated to form malate. This reaction adds a hydroxyl group and hydrogen to the double bond of fumarate."
      },
      { 
        id: 9, 
        name: "Oxidation", 
        reactants: ["Malate", "NAD+"],
        products: ["Oxaloacetate", "NADH", "H+"],
        enzyme: "Malate dehydrogenase",
        details: "Malate is oxidized to regenerate oxaloacetate, producing NADH. This completes the cycle, as oxaloacetate can combine with a new acetyl-CoA molecule."
      }
    ],
    netReaction: "Acetyl-CoA + 3 NAD+ + FAD + GDP + Pi + 2 H2O → 2 CO2 + 3 NADH + 3 H+ + FADH2 + GTP + CoA-SH",
    energyYield: "Per acetyl-CoA: 3 NADH, 1 FADH2, 1 GTP (equivalent to 1 ATP)",
    regulatoryFactors: [
      "NADH levels (inhibit multiple enzymes including citrate synthase and isocitrate dehydrogenase)",
      "ATP/ADP ratio (high ratio inhibits isocitrate dehydrogenase)",
      "Calcium levels (activate pyruvate dehydrogenase, isocitrate dehydrogenase, and α-ketoglutarate dehydrogenase)",
      "Succinyl-CoA (inhibits α-ketoglutarate dehydrogenase)"
    ]
  },
  fattyAcidOxidation: {
    name: "Fatty Acid β-Oxidation",
    description: "The process by which fatty acids are broken down in the mitochondria to generate acetyl-CoA, NADH, and FADH2, which then enter other metabolic pathways for energy production.",
    steps: [
      { 
        id: 1, 
        name: "Activation", 
        reactants: ["Fatty acid", "CoA-SH", "ATP"],
        products: ["Fatty acyl-CoA", "AMP", "PPi"],
        enzyme: "Acyl-CoA synthetase",
        details: "Fatty acid is activated by combining with coenzyme A, using energy from ATP hydrolysis. This occurs in the cytosol before the fatty acid enters the mitochondria."
      },
      { 
        id: 2, 
        name: "Transport into Mitochondria", 
        reactants: ["Fatty acyl-CoA", "Carnitine"],
        products: ["Fatty acyl-carnitine", "CoA-SH"],
        enzyme: "Carnitine palmitoyltransferase I (CPT1)",
        details: "The acyl group is transferred from CoA to carnitine, forming fatty acyl-carnitine, which can cross the inner mitochondrial membrane."
      },
      { 
        id: 3, 
        name: "Regeneration of Fatty Acyl-CoA", 
        reactants: ["Fatty acyl-carnitine", "CoA-SH"],
        products: ["Fatty acyl-CoA", "Carnitine"],
        enzyme: "Carnitine palmitoyltransferase II (CPT2)",
        details: "Inside the mitochondrial matrix, the acyl group is transferred back to CoA, reforming fatty acyl-CoA and releasing carnitine."
      },
      { 
        id: 4, 
        name: "Oxidation", 
        reactants: ["Fatty acyl-CoA", "FAD"],
        products: ["trans-Δ2-Enoyl-CoA", "FADH2"],
        enzyme: "Acyl-CoA dehydrogenase",
        details: "Dehydrogenation of fatty acyl-CoA, introducing a double bond between C-2 and C-3, and reducing FAD to FADH2."
      },
      { 
        id: 5, 
        name: "Hydration", 
        reactants: ["trans-Δ2-Enoyl-CoA", "H2O"],
        products: ["3-Hydroxyacyl-CoA"],
        enzyme: "Enoyl-CoA hydratase",
        details: "Addition of water to the double bond, forming 3-hydroxyacyl-CoA."
      },
      { 
        id: 6, 
        name: "Oxidation", 
        reactants: ["3-Hydroxyacyl-CoA", "NAD+"],
        products: ["3-Ketoacyl-CoA", "NADH", "H+"],
        enzyme: "3-Hydroxyacyl-CoA dehydrogenase",
        details: "Oxidation of the hydroxyl group to a keto group, reducing NAD+ to NADH."
      },
      { 
        id: 7, 
        name: "Thiolysis", 
        reactants: ["3-Ketoacyl-CoA", "CoA-SH"],
        products: ["Acetyl-CoA", "Fatty acyl-CoA (shortened by 2C)"],
        enzyme: "β-Ketothiolase",
        details: "Cleavage of the bond between C-2 and C-3, releasing acetyl-CoA and a fatty acyl-CoA shortened by two carbon atoms."
      },
      { 
        id: 8, 
        name: "Repetition of Cycle", 
        reactants: ["Shortened fatty acyl-CoA", "FAD", "NAD+", "CoA-SH", "H2O"],
        products: ["Acetyl-CoA", "Further shortened fatty acyl-CoA", "FADH2", "NADH", "H+"],
        enzyme: "Multiple enzymes",
        details: "The cycle repeats with the shortened fatty acyl-CoA, continuing until the entire fatty acid chain is converted to acetyl-CoA units."
      }
    ],
    netReaction: "For palmitic acid (C16): Palmitate + CoA-SH + 7 O2 + 7 H2O + 15 NAD+ + 15 FAD → 8 Acetyl-CoA + 15 NADH + 15 H+ + 15 FADH2",
    energyYield: "For palmitic acid: 8 acetyl-CoA, 7 FADH2, 7 NADH (leading to approximately 108 ATP when fully oxidized)",
    regulatoryFactors: [
      "Malonyl-CoA (inhibits carnitine palmitoyltransferase I)",
      "Insulin/glucagon ratio (insulin promotes fatty acid synthesis over oxidation)",
      "NADH/NAD+ ratio (high ratio inhibits β-oxidation)",
      "Acetyl-CoA levels (inhibit β-oxidation through product inhibition)"
    ]
  },
  proteinSynthesis: {
    name: "Protein Synthesis (Translation)",
    description: "The process by which cellular ribosomes synthesize proteins using mRNA as a template, transferring the genetic code from nucleic acids to proteins.",
    steps: [
      { 
        id: 1, 
        name: "Initiation", 
        reactants: ["mRNA", "tRNA-Met", "Ribosomal subunits", "GTP", "Initiation factors"],
        products: ["Initiation complex", "GDP", "Pi"],
        enzyme: "None (facilitated by initiation factors)",
        details: "Assembly of the translation machinery, including binding of mRNA to the small ribosomal subunit, recruitment of the initiator tRNA with methionine, and addition of the large ribosomal subunit."
      },
      { 
        id: 2, 
        name: "Elongation: Aminoacyl-tRNA Binding", 
        reactants: ["Aminoacyl-tRNA", "GTP", "Elongation factor Tu"],
        products: ["Ribosome-bound aminoacyl-tRNA", "GDP", "Pi", "Elongation factor Tu"],
        enzyme: "None (facilitated by elongation factors)",
        details: "The appropriate aminoacyl-tRNA with an anticodon matching the codon on mRNA enters the A site of the ribosome."
      },
      { 
        id: 3, 
        name: "Elongation: Peptide Bond Formation", 
        reactants: ["Peptidyl-tRNA (P site)", "Aminoacyl-tRNA (A site)"],
        products: ["Deacylated tRNA (P site)", "Peptidyl-tRNA one amino acid longer (A site)"],
        enzyme: "Peptidyl transferase (part of the ribosome)",
        details: "The peptide chain is transferred from the tRNA in the P site to the amino acid on the tRNA in the A site, forming a new peptide bond."
      },
      { 
        id: 4, 
        name: "Elongation: Translocation", 
        reactants: ["Ribosome complex", "GTP", "Elongation factor G"],
        products: ["Advanced ribosome complex", "GDP", "Pi", "Elongation factor G"],
        enzyme: "None (facilitated by elongation factors)",
        details: "The ribosome shifts along the mRNA by one codon. The deacylated tRNA moves from the P site to the E site and exits, the peptidyl-tRNA moves from the A site to the P site, and a new codon is exposed in the A site."
      },
      { 
        id: 5, 
        name: "Elongation Cycle Repetition", 
        reactants: ["Multiple aminoacyl-tRNAs", "GTP", "Elongation factors"],
        products: ["Growing peptide chain", "GDP", "Pi", "Deacylated tRNAs"],
        enzyme: "None (facilitated by elongation factors and ribosome)",
        details: "Steps 2-4 repeat as the ribosome moves along the mRNA, adding amino acids to the growing peptide chain according to the mRNA sequence."
      },
      { 
        id: 6, 
        name: "Termination", 
        reactants: ["Completed peptidyl-tRNA", "Release factors", "GTP", "Stop codon"],
        products: ["Released polypeptide", "Deacylated tRNA", "GDP", "Pi"],
        enzyme: "None (facilitated by release factors)",
        details: "When a stop codon (UAA, UAG, or UGA) enters the A site, release factors bind instead of tRNA, triggering the hydrolysis of the bond between the peptide chain and the tRNA, releasing the completed polypeptide."
      },
      { 
        id: 7, 
        name: "Ribosome Recycling", 
        reactants: ["Terminated ribosome complex", "Recycling factors", "GTP"],
        products: ["Free ribosomal subunits", "mRNA", "Deacylated tRNA", "GDP", "Pi"],
        enzyme: "None (facilitated by recycling factors)",
        details: "The ribosomal subunits dissociate from the mRNA and from each other, allowing them to be used for another round of translation."
      }
    ],
    netReaction: "Amino acids + mRNA + tRNAs + GTP + ATP + Ribosome → Protein + Used tRNAs + GDP + Pi + ADP + Pi",
    energyYield: "Energy consuming process: Approximately 4-5 ATP equivalents per amino acid added to the peptide chain",
    regulatoryFactors: [
      "Availability of amino acids (shortage can stall translation)",
      "mRNA availability and stability",
      "Translation initiation factors (can be regulated by phosphorylation)",
      "Ribosome availability",
      "Various antibiotics act as inhibitors of protein synthesis in prokaryotes"
    ]
  }
};

// Simulation factors that affect rate
const simulationFactors = {
  temperature: {
    name: "Temperature",
    description: "Affects reaction rate by changing molecular kinetic energy",
    options: [
      { value: 10, label: "10°C (Slow)" },
      { value: 25, label: "25°C (Room Temp)" },
      { value: 37, label: "37°C (Body Temp)" },
      { value: 50, label: "50°C (Elevated)" }
    ],
    effect: "Higher temperatures generally increase reaction rates until enzymes begin to denature"
  },
  pH: {
    name: "pH",
    description: "Affects enzyme structure and activity",
    options: [
      { value: 3, label: "pH 3 (Acidic)" },
      { value: 5, label: "pH 5 (Slightly Acidic)" },
      { value: 7, label: "pH 7 (Neutral)" }, 
      { value: 9, label: "pH 9 (Alkaline)" }
    ],
    effect: "Each enzyme has an optimal pH range; activity decreases outside this range"
  },
  substrateConcentration: {
    name: "Substrate Concentration",
    description: "Amount of reactants available",
    options: [
      { value: 0.1, label: "Low" },
      { value: 0.5, label: "Medium" },
      { value: 1.0, label: "High" },
      { value: 2.0, label: "Very High" }
    ],
    effect: "Higher substrate concentration increases reaction rate until enzyme saturation"
  },
  enzymeConcentration: {
    name: "Enzyme Concentration",
    description: "Amount of catalyst available",
    options: [
      { value: 0.1, label: "Low" },
      { value: 0.5, label: "Medium" },
      { value: 1.0, label: "High" },
      { value: 2.0, label: "Very High" }
    ],
    effect: "Higher enzyme concentration generally increases reaction rate proportionally"
  }
};

const BiochemicalPathwaySimulator = () => {
  const [selectedPathway, setSelectedPathway] = useState('glycolysis');
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [showPathwayDetails, setShowPathwayDetails] = useState(false);
  const [visualizationType, setVisualizationType] = useState('diagram');
  const [simulationParams, setSimulationParams] = useState({
    temperature: 37,
    pH: 7,
    substrateConcentration: 1.0,
    enzymeConcentration: 1.0
  });
  
  const handlePathwayChange = (event) => {
    setSelectedPathway(event.target.value);
    setCurrentStep(0);
    setIsPlaying(false);
  };
  
  const handleSpeedChange = (event, newValue) => {
    setSimulationSpeed(newValue);
  };
  
  const handlePlay = () => {
    if (currentStep >= pathways[selectedPathway].steps.length) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
    // In a real implementation, this would start an animation or simulation
  };
  
  const handlePause = () => {
    setIsPlaying(false);
    // In a real implementation, this would pause the animation or simulation
  };
  
  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    // In a real implementation, this would reset the simulation state
  };
  
  const handleStepForward = () => {
    if (currentStep < pathways[selectedPathway].steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleVisualizationTypeChange = (event, newValue) => {
    if (newValue !== null) {
      setVisualizationType(newValue);
    }
  };
  
  const handleSimulationParamChange = (param, value) => {
    setSimulationParams({
      ...simulationParams,
      [param]: value
    });
  };
  
  const getCurrentStepInfo = () => {
    const pathway = pathways[selectedPathway];
    if (!pathway || currentStep >= pathway.steps.length) return null;
    return pathway.steps[currentStep];
  };
  
  const calculateSimulationEfficiency = () => {
    const { temperature, pH, substrateConcentration, enzymeConcentration } = simulationParams;
    
    // This is a simplified model of how these factors might affect reaction efficiency
    // In a real system, these relationships would be much more complex
    
    // Temperature effect - optimal near 37°C
    const tempFactor = 1 - Math.abs(temperature - 37) / 50;
    
    // pH effect - optimal typically around 7 for many enzymes
    const pHFactor = 1 - Math.abs(pH - 7) / 10;
    
    // Substrate concentration follows Michaelis-Menten kinetics (simplified)
    const substrateFactor = substrateConcentration / (substrateConcentration + 0.5);
    
    // Enzyme concentration typically has a linear effect
    const enzymeFactor = enzymeConcentration;
    
    // Combined effect - product of all factors
    const efficiency = tempFactor * pHFactor * substrateFactor * enzymeFactor * 100;
    
    return Math.min(Math.max(efficiency, 0), 100);
  };
  
  const stepInfo = getCurrentStepInfo();
  const efficiency = calculateSimulationEfficiency();

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <BiotechIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h2">
          Biochemical Pathway Simulator
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Explore key biochemical pathways through interactive simulations. Visualize reaction steps and understand how different factors affect reaction rates.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pathway Selection
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="pathway-select-label">Select Pathway</InputLabel>
                <Select
                  labelId="pathway-select-label"
                  id="pathway-select"
                  value={selectedPathway}
                  label="Select Pathway"
                  onChange={handlePathwayChange}
                >
                  <MenuItem value="glycolysis">Glycolysis</MenuItem>
                  <MenuItem value="krebs">Krebs Cycle</MenuItem>
                  <MenuItem value="fattyAcidOxidation">Fatty Acid β-Oxidation</MenuItem>
                  <MenuItem value="proteinSynthesis">Protein Synthesis</MenuItem>
                </Select>
              </FormControl>
              
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setShowPathwayDetails(!showPathwayDetails)}
                fullWidth
                sx={{ mb: 2 }}
              >
                {showPathwayDetails ? "Hide Pathway Details" : "Show Pathway Details"}
              </Button>
              
              {showPathwayDetails && (
                <Box sx={{ mb: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    {pathways[selectedPathway].name}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {pathways[selectedPathway].description}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Net Reaction:</strong> {pathways[selectedPathway].netReaction}
                  </Typography>
                  <Typography variant="body2" paragraph>
                    <strong>Energy Yield:</strong> {pathways[selectedPathway].energyYield}
                  </Typography>
                  <Typography variant="subtitle2" gutterBottom>
                    Regulatory Factors:
                  </Typography>
                  <List dense>
                    {pathways[selectedPathway].regulatoryFactors.map((factor, index) => (
                      <ListItem key={index} sx={{ py: 0 }}>
                        <ListItemIcon sx={{ minWidth: 24 }}>
                          <ArrowForwardIcon color="primary" sx={{ fontSize: 12 }} />
                        </ListItemIcon>
                        <ListItemText primary={factor} />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Simulation Controls
              </Typography>
              
              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {isPlaying ? (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PauseIcon />}
                    onClick={handlePause}
                  >
                    Pause
                  </Button>
                ) : (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    startIcon={<PlayArrowIcon />}
                    onClick={handlePlay}
                  >
                    Play
                  </Button>
                )}
                <Button 
                  variant="outlined"
                  startIcon={<RestartAltIcon />}
                  onClick={handleReset}
                >
                  Reset
                </Button>
                <Button 
                  variant="outlined"
                  startIcon={<FastForwardIcon />}
                  onClick={handleStepForward}
                >
                  Step
                </Button>
              </Stack>
              
              <Box sx={{ mb: 2 }}>
                <Typography id="speed-slider" gutterBottom>
                  Simulation Speed
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item>
                    <SpeedIcon fontSize="small" />
                  </Grid>
                  <Grid item xs>
                    <Slider
                      value={simulationSpeed}
                      onChange={handleSpeedChange}
                      aria-labelledby="speed-slider"
                      min={0.25}
                      max={2}
                      step={0.25}
                      marks={[
                        { value: 0.25, label: 'Slow' },
                        { value: 1, label: 'Normal' },
                        { value: 2, label: 'Fast' }
                      ]}
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Visualization Type
              </Typography>
              
              <ToggleButtonGroup
                value={visualizationType}
                exclusive
                onChange={handleVisualizationTypeChange}
                aria-label="visualization type"
                fullWidth
                sx={{ mb: 2 }}
              >
                <ToggleButton value="diagram" aria-label="diagram view">
                  Diagram
                </ToggleButton>
                <ToggleButton value="molecular" aria-label="molecular view">
                  Molecular
                </ToggleButton>
                <ToggleButton value="energy" aria-label="energy profile">
                  Energy Profile
                </ToggleButton>
              </ToggleButtonGroup>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  Reaction Parameters
                </Typography>
                <Tooltip title="These factors affect reaction rates">
                  <IconButton size="small">
                    <SettingsIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Grid container spacing={2} sx={{ mb: 1 }}>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="temperature-label">Temperature</InputLabel>
                    <Select
                      labelId="temperature-label"
                      id="temperature-select"
                      value={simulationParams.temperature}
                      label="Temperature"
                      onChange={(e) => handleSimulationParamChange('temperature', e.target.value)}
                    >
                      {simulationFactors.temperature.options.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="ph-label">pH</InputLabel>
                    <Select
                      labelId="ph-label"
                      id="ph-select"
                      value={simulationParams.pH}
                      label="pH"
                      onChange={(e) => handleSimulationParamChange('pH', e.target.value)}
                    >
                      {simulationFactors.pH.options.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="substrate-label">Substrate Conc.</InputLabel>
                    <Select
                      labelId="substrate-label"
                      id="substrate-select"
                      value={simulationParams.substrateConcentration}
                      label="Substrate Conc."
                      onChange={(e) => handleSimulationParamChange('substrateConcentration', e.target.value)}
                    >
                      {simulationFactors.substrateConcentration.options.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel id="enzyme-label">Enzyme Conc.</InputLabel>
                    <Select
                      labelId="enzyme-label"
                      id="enzyme-select"
                      value={simulationParams.enzymeConcentration}
                      label="Enzyme Conc."
                      onChange={(e) => handleSimulationParamChange('enzymeConcentration', e.target.value)}
                    >
                      {simulationFactors.enzymeConcentration.options.map(option => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              
              <Typography variant="subtitle2" gutterBottom>
                Reaction Efficiency: {efficiency.toFixed(1)}%
              </Typography>
              
              <LinearProgress 
                variant="determinate" 
                value={efficiency} 
                color={efficiency > 75 ? "success" : efficiency > 40 ? "primary" : "error"}
                sx={{ height: 8, borderRadius: 4, mb: 1 }}
              />
              
              <Alert 
                severity={efficiency > 75 ? "success" : efficiency > 40 ? "info" : "warning"} 
                sx={{ mt: 2 }}
                icon={efficiency > 75 ? <PrecisionManufacturingIcon /> : efficiency > 40 ? <ScienceIcon /> : <TemperatureIcon />}
              >
                {efficiency > 75 ? 
                  "Optimal conditions for this reaction!" : 
                  efficiency > 40 ? 
                  "Acceptable reaction conditions" : 
                  "Suboptimal conditions - adjust parameters to improve efficiency"}
              </Alert>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Visualization Area */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  {stepInfo ? 
                    `Step ${stepInfo.id}: ${stepInfo.name}` : 
                    "Pathway Overview"
                  }
                </Typography>
                <Chip 
                  label={`Step ${currentStep + 1} of ${pathways[selectedPathway].steps.length}`} 
                  color="primary" 
                  variant="outlined"
                  size="small"
                />
              </Box>
              
              <Box sx={{ position: 'relative', height: 300, bgcolor: '#f5f5f5', borderRadius: 1, mb: 3, p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {isPlaying ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={40} />
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Simulating reaction...
                    </Typography>
                  </Box>
                ) : (
                  visualizationType === 'diagram' ? (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      {stepInfo ? (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            Reaction Diagram
                          </Typography>
                          <Box component="img" 
                            src={`https://via.placeholder.com/600x200?text=${encodeURIComponent(stepInfo.name.replace(/\s/g, '+'))}`} 
                            alt={`Diagram of ${stepInfo.name}`}
                            sx={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                          />
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {stepInfo.reactants.join(" + ")} → {stepInfo.products.join(" + ")}
                          </Typography>
                        </>
                      ) : (
                        <>
                          <Typography variant="subtitle1" gutterBottom>
                            Pathway Overview
                          </Typography>
                          <Box component="img" 
                            src={`https://via.placeholder.com/600x200?text=${pathways[selectedPathway].name.replace(/\s/g, '+')}`} 
                            alt={`Overview of ${pathways[selectedPathway].name}`}
                            sx={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                          />
                        </>
                      )}
                    </Box>
                  ) : visualizationType === 'molecular' ? (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Molecular Visualization
                      </Typography>
                      {stepInfo ? (
                        <Box component="img" 
                          src={`https://via.placeholder.com/600x200?text=Molecular+Structure:+${encodeURIComponent(stepInfo.name.replace(/\s/g, '+'))}`} 
                          alt={`Molecular view of ${stepInfo.name}`}
                          sx={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                        />
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Select a step to view molecular details
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ width: '100%', textAlign: 'center' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Energy Profile
                      </Typography>
                      <Box component="img" 
                        src={`https://via.placeholder.com/600x200?text=Energy+Profile:+${pathways[selectedPathway].name.replace(/\s/g, '+')}`} 
                        alt={`Energy profile of ${pathways[selectedPathway].name}`}
                        sx={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                      />
                    </Box>
                  )
                )}
              </Box>
              
              {stepInfo && (
                <>
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Reactants
                        </Typography>
                        <Typography variant="body2">
                          {stepInfo.reactants.join(", ")}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Products
                        </Typography>
                        <Typography variant="body2">
                          {stepInfo.products.join(", ")}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                  
                  <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                    <Typography variant="subtitle2" color="primary" gutterBottom>
                      Enzyme: {stepInfo.enzyme}
                    </Typography>
                    <Typography variant="body2">
                      {stepInfo.details}
                    </Typography>
                  </Paper>
                </>
              )}
              
              <Box sx={{ mt: 2 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={(currentStep / (pathways[selectedPathway].steps.length - 1)) * 100} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption" color="text.secondary">
                    Pathway Start
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Pathway End
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
          
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Pathway Steps
              </Typography>
              
              <Box sx={{ maxHeight: 200, overflow: 'auto', pr: 1 }}>
                {pathways[selectedPathway].steps.map((step, index) => (
                  <Paper 
                    key={step.id}
                    variant="outlined"
                    sx={{ 
                      p: 1, 
                      mb: 1, 
                      bgcolor: currentStep === index ? 'primary.light' : 'background.paper',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: currentStep === index ? 'primary.light' : 'action.hover',
                      }
                    }}
                    onClick={() => setCurrentStep(index)}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="subtitle2">
                        {step.id}. {step.name}
                      </Typography>
                      <Tooltip title="View details">
                        <InfoIcon fontSize="small" color="action" />
                      </Tooltip>
                    </Box>
                    <Typography variant="caption" display="block" color="text.secondary">
                      {step.reactants.join(" + ")} → {step.products.join(" + ")}
                    </Typography>
                  </Paper>
                ))}
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mt: 2, fontStyle: 'italic' }}>
                Note: In a complete implementation, this simulator would show animated biochemical reactions with interactive molecular models and real-time parameter adjustments.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default BiochemicalPathwaySimulator;