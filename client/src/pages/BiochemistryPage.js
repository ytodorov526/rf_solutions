import React, { useState, Suspense, Component } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Button,
  useMediaQuery,
  useTheme,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import ScienceIcon from '@mui/icons-material/Science';
import QuizIcon from '@mui/icons-material/Quiz';
import BiotechIcon from '@mui/icons-material/Biotech';
import CalculateIcon from '@mui/icons-material/Calculate';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ChemistryIcon from '@mui/icons-material/Science';

// Tab panel component for content organization
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`biochemistry-tabpanel-${index}`}
      aria-labelledby={`biochemistry-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `biochemistry-tab-${index}`,
    'aria-controls': `biochemistry-tabpanel-${index}`,
  };
}

// Error boundary for component isolation
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Component Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box sx={{ p: 3, border: '1px solid #f5c6cb', borderRadius: 1, bgcolor: '#f8d7da', color: '#721c24' }}>
          <Typography variant="h6">Component Error</Typography>
          <Typography variant="body2">This component couldn't be loaded. Please try refreshing the page.</Typography>
          <Button 
            variant="outlined" 
            color="error" 
            size="small" 
            sx={{ mt: 2 }}
            onClick={() => this.setState({ hasError: false })}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    return this.props.children;
  }
}

// Biochemistry topics data for educational content
const biochemistryTopics = [
  {
    name: "Protein Structure and Function",
    description: "Proteins are large, complex molecules essential for cell structure and function. They are made up of amino acids arranged in a linear chain and folded into a 3D structure that determines their function.",
    features: [
      "Levels of protein structure (primary, secondary, tertiary, quaternary)",
      "Protein folding and stability",
      "Structure-function relationships",
      "Protein modification and regulation"
    ],
    image: "https://www.genome.gov/sites/default/files/tg/protein.jpg"
  },
  {
    name: "Metabolism and Bioenergetics",
    description: "Metabolism is the set of life-sustaining chemical reactions in organisms. The main purpose of the metabolic pathways is to convert nutrients into energy, cell building blocks, and waste products.",
    features: [
      "Glycolysis and cellular respiration",
      "Krebs cycle and electron transport chain",
      "Energy storage and transfer (ATP, NAD+/NADH)",
      "Metabolic regulation and integration"
    ],
    image: "https://www.researchgate.net/publication/287590107/figure/fig1/AS:315654941904896@1452278594662/Major-pathways-of-energy-metabolism.png"
  },
  {
    name: "Enzyme Kinetics and Catalysis",
    description: "Enzymes are protein catalysts that accelerate chemical reactions in biological systems. Understanding enzyme kinetics helps explain how these molecular machines work and how they are regulated.",
    features: [
      "Enzyme structure and catalytic mechanisms",
      "Michaelis-Menten kinetics",
      "Enzyme inhibition and activation",
      "Allosteric regulation"
    ],
    image: "https://www.creative-enzymes.com/images/Enzyme-Kinetics.jpg"
  },
  {
    name: "Nucleic Acids and Molecular Genetics",
    description: "Nucleic acids (DNA and RNA) are essential biomolecules that encode and transmit genetic information. They play central roles in protein synthesis, cell division, and heredity.",
    features: [
      "DNA structure and replication",
      "Transcription and RNA processing",
      "Translation and protein synthesis",
      "Regulation of gene expression"
    ],
    image: "https://www.news-medical.net/image.axd?picture=2019%2F4%2Fshutterstock_507545889.jpg"
  }
];

// Sample biochemistry quiz questions
const quizPreview = [
  {
    question: "Which of the following is NOT one of the four major classes of biomolecules?",
    options: ["Carbohydrates", "Lipids", "Minerals", "Proteins"],
    answer: 2
  },
  {
    question: "What is the primary role of enzymes in biochemical reactions?",
    options: ["Provide energy", "Lower activation energy", "Supply reactants", "Consume products"],
    answer: 1
  },
  {
    question: "Which nucleotide base is found in RNA but not in DNA?",
    options: ["Adenine", "Guanine", "Thymine", "Uracil"],
    answer: 3
  },
  {
    question: "What type of bond links adjacent amino acids in a protein chain?",
    options: ["Hydrogen bond", "Ionic bond", "Peptide bond", "Disulfide bridge"],
    answer: 2
  }
];

// Calculator formulas explained
const calculatorFormulas = [
  {
    name: "Henderson-Hasselbalch Equation",
    formula: "pH = pKa + log([A-]/[HA])",
    description: "Calculates the pH of a buffer solution based on the acid dissociation constant (pKa) and the concentrations of the acid and its conjugate base."
  },
  {
    name: "Michaelis-Menten Equation",
    formula: "v = (Vmax × [S]) / (Km + [S])",
    description: "Describes the rate of enzymatic reactions, where v is the reaction rate, Vmax is the maximum rate, [S] is substrate concentration, and Km is the Michaelis constant."
  },
  {
    name: "Gibbs Free Energy",
    formula: "ΔG = ΔH - TΔS",
    description: "Determines the spontaneity of a biochemical reaction, where ΔG is the change in free energy, ΔH is the change in enthalpy, T is temperature, and ΔS is the change in entropy."
  },
  {
    name: "Beer-Lambert Law",
    formula: "A = ε × c × l",
    description: "Used in spectrophotometry to relate the absorbance of light to the properties of the material through which the light is traveling."
  },
  {
    name: "Nernst Equation",
    formula: "E = E° - (RT/nF)ln(Q)",
    description: "Relates the reduction potential of a half-cell at any point in time to the standard electrode potential, temperature, activity, and reaction quotient."
  }
];

// Biochemistry tools overview
const simulatorsOverview = [
  {
    title: "Molecular Viewer",
    description: "Visualize 3D structures of proteins, nucleic acids, and other biomolecules with interactive controls for rotation, zooming, and different display styles.",
    status: "Available Now"
  },
  {
    title: "Biochemical Pathway Simulator",
    description: "Simulate key metabolic pathways like glycolysis, the Krebs cycle, and fatty acid oxidation with adjustable parameters and visual representations.",
    status: "Available Now"
  },
  {
    title: "Enzyme Kinetics Analyzer",
    description: "Study enzyme-catalyzed reactions by manipulating substrate concentrations, inhibitors, and environmental factors to observe effects on reaction rates.",
    status: "Coming Soon"
  },
  {
    title: "Protein Folding Simulator",
    description: "Explore how amino acid sequences fold into complex 3D structures and how mutations can affect protein structure and function.",
    status: "Coming Soon"
  },
  {
    title: "Gene Expression Modeler",
    description: "Model transcription, translation, and regulation of gene expression to understand how DNA information is converted to functional proteins.",
    status: "In Development"
  }
];

function BiochemistryPage() {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  
  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="xl">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Biochemistry Education Center
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Explore the molecular foundations of life through interactive simulations, comprehensive educational resources, and challenging quizzes
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ width: '100%' }}>
          <Paper sx={{ borderRadius: 2, overflow: 'hidden' }} elevation={3}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                variant={isMobile ? "scrollable" : "fullWidth"}
                scrollButtons={isMobile ? "auto" : false}
                textColor="primary"
                indicatorColor="primary"
                aria-label="biochemistry tabs"
              >
                <Tab icon={<SchoolIcon />} iconPosition="start" label="Educational Resources" {...a11yProps(0)} />
                <Tab icon={<BiotechIcon />} iconPosition="start" label="Molecular Viewer" {...a11yProps(1)} />
                <Tab icon={<ChemistryIcon />} iconPosition="start" label="Pathway Simulator" {...a11yProps(2)} />
                <Tab icon={<QuizIcon />} iconPosition="start" label="Knowledge Quiz" {...a11yProps(3)} />
                <Tab icon={<CalculateIcon />} iconPosition="start" label="Calculators" {...a11yProps(4)} />
              </Tabs>
            </Box>
            
            {/* Educational Resources Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h4" gutterBottom>
                Biochemistry Fundamentals
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Explore the fascinating world of biochemistry, the study of chemical processes within and relating to living organisms. From the structure and function of biomolecules to the intricate pathways of metabolism, these resources provide a comprehensive introduction to key biochemical concepts.
              </Typography>
              
              <Grid container spacing={4}>
                {biochemistryTopics.map((topic) => (
                  <Grid item xs={12} md={6} key={topic.name}>
                    <Card elevation={3}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={topic.image}
                        alt={topic.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {topic.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {topic.description}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Concepts:
                        </Typography>
                        <List dense>
                          {topic.features.map((feature, index) => (
                            <ListItem key={index} sx={{ py: 0 }}>
                              <ListItemIcon sx={{ minWidth: 30 }}>
                                <CheckCircleIcon color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={feature} />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                  Browse All Topics
                </Button>
                <Button variant="outlined">
                  Download Educational Materials
                </Button>
              </Box>
            </TabPanel>
            
            {/* Molecular Viewer Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h4" gutterBottom>
                Biochemistry Molecular Viewer
              </Typography>
              <Typography variant="body1" paragraph>
                Explore the three-dimensional structure of important biomolecules. Our interactive molecular viewer allows you to examine proteins, nucleic acids, and other macromolecules from various perspectives.
              </Typography>
              
              {/* Include the MolecularViewer component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Molecular Viewer...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/biochemistry/MolecularViewer')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Understanding Molecular Structures
                </Typography>
                <Typography variant="body2" paragraph>
                  The 3D structure of biomolecules is essential to understanding their function in living systems. Proteins fold into complex structures that enable them to perform specific roles, from catalysis to structural support. Nucleic acids form regular patterns that allow for information storage and transfer, while lipids and carbohydrates have their own unique structural characteristics.
                </Typography>
                <Typography variant="body2" paragraph>
                  Our molecular viewer helps you visualize these complex structures and understand how their shape relates to their biological function. Use the different visualization modes to explore various aspects of molecular structure, from the backbone arrangement to the detailed atom-by-atom view.
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Pathway Simulator Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h4" gutterBottom>
                Biochemical Pathway Simulator
              </Typography>
              <Typography variant="body1" paragraph>
                Explore key metabolic pathways through interactive simulations. Visualize reaction steps and understand how enzymes catalyze biochemical transformations essential for life.
              </Typography>
              
              {/* Import and include the BiochemicalPathwaySimulator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Pathway Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/biochemistry/BiochemicalPathwaySimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  The Importance of Metabolic Pathways
                </Typography>
                <Typography variant="body2" paragraph>
                  Metabolic pathways are series of chemical reactions occurring within a cell. They are organized into intricate networks that allow organisms to break down nutrients to produce energy, synthesize essential molecules, and eliminate waste products. These pathways are highly regulated and interconnected, ensuring that cellular resources are used efficiently.
                </Typography>
                <Typography variant="body2" paragraph>
                  Our pathway simulator helps you understand how these complex sequences of reactions work together to maintain cellular function. By visualizing each step and the enzymes involved, you can gain insight into the molecular basis of metabolism and how disruptions can lead to disease states.
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Knowledge Quiz Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h4" gutterBottom>
                Biochemistry Knowledge Quiz
              </Typography>
              <Typography variant="body1" paragraph>
                Test your understanding of biochemistry concepts with our interactive quiz. Challenge yourself with questions on protein structure, enzyme kinetics, metabolic pathways, and more.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Biochemistry Quiz...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/biochemistry/BiochemistryQuiz')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
            </TabPanel>
            
            {/* Calculators Tab */}
            <TabPanel value={activeTab} index={4}>
              <Typography variant="h4" gutterBottom>
                Biochemistry Calculators
              </Typography>
              <Typography variant="body1" paragraph>
                Access specialized tools for biochemical calculations. Our calculators help with enzyme kinetics, buffer preparation, molecular weight determination, and more.
              </Typography>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="primary">
                        pH and Buffer Calculator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Calculate pH values, prepare buffer solutions, and determine acid-base properties with this comprehensive tool.
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Features:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Henderson-Hasselbalch equation calculations" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Buffer capacity estimation" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Titration curve simulation" />
                          </ListItem>
                        </List>
                      </Box>
                      <Button variant="outlined" color="primary" fullWidth>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="primary">
                        Enzyme Kinetics Calculator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Analyze enzyme reaction data, calculate kinetic parameters, and visualize Michaelis-Menten plots.
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Features:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Determination of Vmax and Km values" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Lineweaver-Burk and other linearization methods" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Inhibition analysis (competitive, noncompetitive)" />
                          </ListItem>
                        </List>
                      </Box>
                      <Button variant="outlined" color="primary" fullWidth>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="primary">
                        Protein Analysis Tools
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Calculate protein properties, predict isoelectric points, and analyze amino acid compositions.
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Features:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Molecular weight calculation" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Extinction coefficient estimation" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Hydropathy plot generation" />
                          </ListItem>
                        </List>
                      </Box>
                      <Button variant="outlined" color="primary" fullWidth>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h5" gutterBottom color="primary">
                        Thermodynamics Calculator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Calculate free energy changes, equilibrium constants, and predict reaction spontaneity.
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                          Features:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Gibbs free energy calculations" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Temperature and concentration effects" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon>
                              <CheckCircleIcon color="primary" fontSize="small" />
                            </ListItemIcon>
                            <ListItemText primary="Coupled reaction analysis" />
                          </ListItem>
                        </List>
                      </Box>
                      <Button variant="outlined" color="primary" fullWidth>
                        Coming Soon
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Biochemistry Formula Reference
                </Typography>
                <Typography variant="body2" paragraph>
                  Common equations used in biochemical calculations. These formulas are the foundation for many of our specialized calculators.
                </Typography>
                
                <Grid container spacing={3}>
                  {calculatorFormulas.map((formula) => (
                    <Grid item xs={12} md={6} key={formula.name}>
                      <Paper sx={{ p: 3 }} elevation={2}>
                        <Typography variant="h6" gutterBottom color="primary">
                          {formula.name}
                        </Typography>
                        <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderRadius: 1, mb: 2, fontFamily: 'monospace' }}>
                          <Typography variant="body2">
                            {formula.formula}
                          </Typography>
                        </Box>
                        <Typography variant="body2">
                          {formula.description}
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Educational Purpose
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Our biochemistry resources are designed for educational purposes, providing students, educators, and science enthusiasts with interactive tools to better understand the molecular basis of life.
                </Typography>
                <Typography variant="body2">
                  All simulations and visualizations are simplified models intended to illustrate fundamental concepts in biochemistry and cellular metabolism. They are not intended for research applications or clinical use.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HealthAndSafetyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Scientific Foundation
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  All content is based on established biochemical principles and current scientific understanding. Our resources are regularly updated to reflect advances in molecular life sciences.
                </Typography>
                <Typography variant="body2">
                  We strive to present accurate information while making complex concepts accessible through interactive visualization and simulation. This approach bridges the gap between textbook knowledge and practical understanding.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default BiochemistryPage;