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
import CalculateIcon from '@mui/icons-material/Calculate';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ConstructionIcon from '@mui/icons-material/Construction';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BiotechIcon from '@mui/icons-material/Biotech';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Tab panel component for content organization
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`nuclear-tabpanel-${index}`}
      aria-labelledby={`nuclear-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `nuclear-tab-${index}`,
    'aria-controls': `nuclear-tabpanel-${index}`,
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

// Reactor Types data for educational content
const reactorTypes = [
  {
    name: "Pressurized Water Reactor (PWR)",
    description: "The most common type of nuclear reactor, using ordinary water as both coolant and moderator. The primary cooling loop is kept under high pressure to prevent boiling.",
    features: [
      "Primary and secondary cooling loops",
      "Typically operates at about 325°C and 150 bar pressure",
      "Uranium oxide fuel enriched to 3-5% U-235",
      "Vertical fuel assemblies with control rods inserted from above"
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Pressurized_Water_Reactor.svg/800px-Pressurized_Water_Reactor.svg.png"
  },
  {
    name: "Boiling Water Reactor (BWR)",
    description: "Second most common reactor type, where water boils directly in the reactor core to produce steam for the turbines, simplifying design but requiring radiation shielding around the turbine loop.",
    features: [
      "Single cooling loop with direct steam cycle",
      "Lower pressure operation than PWR (about 75 bar)",
      "Control rods enter from below the core",
      "Similar fuel enrichment to PWR (3-5% U-235)"
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ec/Boiling_water_reactor_english.svg/800px-Boiling_water_reactor_english.svg.png"
  },
  {
    name: "Small Modular Reactor (SMR)",
    description: "Advanced nuclear reactors with power capacity under 300 MWe, designed for factory fabrication and modular construction, reducing on-site work and enhancing safety features.",
    features: [
      "Compact design for factory production",
      "Enhanced passive safety systems",
      "Lower capital costs and construction times",
      "Suitable for remote locations or replacing fossil fuel plants"
    ],
    image: "https://www.energy.gov/sites/default/files/styles/full_article_width/public/2021-11/doe-ne-smr.jpg?itok=QZuSf-4h"
  },
  {
    name: "Molten Salt Reactor (MSR)",
    description: "Advanced reactor concept where the fuel is dissolved in a molten salt coolant, offering passive safety features and potential for high-temperature operation.",
    features: [
      "Fuel dissolved in fluoride or chloride salts",
      "Can operate at atmospheric pressure with high temperatures",
      "Inherent passive safety due to negative temperature coefficient",
      "Potential for thorium fuel cycle and waste reduction"
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Molten_Salt_Reactor.svg/800px-Molten_Salt_Reactor.svg.png"
  }
];

// Sample nuclear quiz questions
const quizQuestions = [
  {
    question: "What material serves as both coolant and moderator in a Pressurized Water Reactor?",
    options: ["Heavy water (D₂O)", "Ordinary water (H₂O)", "Liquid sodium", "Graphite"],
    answer: 1
  },
  {
    question: "Which of the following is an advantage of Boiling Water Reactors over Pressurized Water Reactors?",
    options: ["Higher thermal efficiency", "Simpler design with fewer components", "Better radiation containment", "Easier refueling process"],
    answer: 1
  },
  {
    question: "What is the primary purpose of a moderator in a nuclear reactor?",
    options: ["Absorb excess neutrons", "Slow down neutrons to increase fission probability", "Cool the reactor core", "Shield against radiation"],
    answer: 1
  },
  {
    question: "Fuel rods in a typical commercial reactor contain uranium enriched to approximately what percentage of U-235?",
    options: ["0.7% (natural uranium)", "3-5%", "20-50%", "90% or higher"],
    answer: 1
  }
];

// Calculator formulas explained
const calculatorFormulas = [
  {
    name: "Reactivity",
    formula: "ρ = (k - 1) / k",
    description: "Measures the departure of a reactor from criticality, where k is the ratio of neutron population in one generation to the previous generation."
  },
  {
    name: "Critical Mass",
    formula: "M_c ∝ 1/ρ²",
    description: "The minimum amount of fissile material needed to maintain a nuclear chain reaction, inversely proportional to square of material density."
  },
  {
    name: "Reactor Power",
    formula: "P = E_f × Σ_f × φ × V",
    description: "Thermal power (P) equals energy per fission (E_f) times macroscopic fission cross-section (Σ_f) times neutron flux (φ) times core volume (V)."
  },
  {
    name: "Decay Heat",
    formula: "P(t) = P₀ × 0.066 × [t^(-0.2) - (t + T)^(-0.2)]",
    description: "Post-shutdown decay heat (P) as a function of time (t), where P₀ is the reactor power before shutdown and T is the operating time."
  },
  {
    name: "Four-factor Formula",
    formula: "k∞ = η × ε × p × f",
    description: "Infinite multiplication factor (k∞) equals reproduction factor (η) times fast fission factor (ε) times resonance escape probability (p) times thermal utilization factor (f)."
  }
];

// Nuclear Engineering simulators overview
const simulatorsOverview = [
  {
    title: "Reactor Kinetics Simulator",
    description: "Model the time-dependent behavior of neutron population in a reactor core, including delayed neutron effects and reactivity insertions.",
    status: "Under development"
  },
  {
    title: "Fuel Assembly Designer",
    description: "Interactive tool for designing nuclear fuel assemblies, calculating enrichment distributions, and thermal-hydraulic performance.",
    status: "Under development"
  },
  {
    title: "Containment System Analyzer",
    description: "Simulate containment system response during accident scenarios, including pressure and temperature transients.",
    status: "Coming soon"
  },
  {
    title: "Reactor Physics Calculator",
    description: "Comprehensive calculator for neutron diffusion, multiplication factors, and core lifecycle analysis.",
    status: "Coming soon"
  }
];

function NuclearEngineeringPage() {
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
          Nuclear Engineering Education Center
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Comprehensive resources for nuclear engineering concepts, reactor designs, and interactive learning tools
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
                aria-label="nuclear engineering tabs"
              >
                <Tab icon={<SchoolIcon />} iconPosition="start" label="Educational Resources" {...a11yProps(0)} />
                <Tab icon={<CalculateIcon />} iconPosition="start" label="Interactive Calculators" {...a11yProps(1)} />
                <Tab icon={<ScienceIcon />} iconPosition="start" label="Reactor Simulators" {...a11yProps(2)} />
                <Tab icon={<BiotechIcon />} iconPosition="start" label="Knowledge Quiz" {...a11yProps(3)} />
                <Tab icon={<ConstructionIcon />} iconPosition="start" label="Design Tools" {...a11yProps(4)} />
              </Tabs>
            </Box>
            
            {/* Educational Resources Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h4" gutterBottom>
                Reactor Types & Technologies
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Learn about different nuclear reactor designs, operational principles, and safety features. This comprehensive guide covers everything from conventional light water reactors to advanced Generation IV designs.
              </Typography>
              
              <Grid container spacing={4}>
                {reactorTypes.map((reactor) => (
                  <Grid item xs={12} md={6} key={reactor.name}>
                    <Card elevation={3}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={reactor.image}
                        alt={reactor.name}
                        sx={{ objectFit: 'contain', bgcolor: '#f5f5f5', p: 2 }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {reactor.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {reactor.description}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Features:
                        </Typography>
                        <List dense>
                          {reactor.features.map((feature, index) => (
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
                  Browse All Reactor Designs
                </Button>
                <Button variant="outlined">
                  Download Educational Materials
                </Button>
              </Box>
            </TabPanel>
            
            {/* Interactive Calculators Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h4" gutterBottom>
                Nuclear Engineering Calculators
              </Typography>
              <Typography variant="body1" paragraph>
                Interactive tools to calculate critical nuclear engineering parameters, explore reactor physics concepts, and visualize fundamental nuclear processes.
              </Typography>
              
              {/* Include the NuclearCalculator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Nuclear Calculator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/nuclear-engineering/NuclearCalculator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ mt: 6 }}>
                Coming Soon
              </Typography>
              <Paper sx={{ p: 3, bgcolor: '#f5f9ff' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="h6" gutterBottom>
                      Advanced Reactor Performance Analyzer
                    </Typography>
                    <Typography variant="body2">
                      A comprehensive suite of advanced calculators for core design, thermal hydraulics analysis, fuel cycle assessment, and safety parameter evaluation. Calculate everything from neutron flux distributions to containment response parameters with integrated 3D visualization.
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      disabled
                      startIcon={<AutoGraphIcon />}
                    >
                      Join Waitlist
                    </Button>
                    <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                      Expected release: Q3 2025
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            </TabPanel>
            
            {/* Reactor Simulators Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h4" gutterBottom>
                Nuclear Reactor Simulators
              </Typography>
              <Typography variant="body1" paragraph>
                Interactive simulations to model reactor behavior, practice operational procedures, and understand complex nuclear processes. Our simulators provide hands-on learning experiences for students and professionals.
              </Typography>
              
              {/* Import and include the ReactorKineticsSimulator component */}
              <Box sx={{ mt: 4 }}>
                {/* Include the dynamic simulator component */}
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Reactor Kinetics Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/nuclear-engineering/ReactorKineticsSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                {/* Include the fuel assembly designer */}
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Fuel Assembly Designer...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/nuclear-engineering/FuelAssemblyDesigner')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
                Coming Soon: Additional Simulator Modules
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Containment System Analyzer
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Simulate containment system response during accident scenarios, including pressure and temperature transients. Model emergency cooling systems and safety relief valves.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          bgcolor: 'rgba(0, 0, 0, 0.04)', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 1,
                          mt: 'auto'
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium">
                          Status: Coming Q3 2025
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button variant="outlined" fullWidth disabled>
                        Launch Simulator
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Core Loading Pattern Optimizer
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Design and optimize nuclear reactor core loading patterns for maximum fuel utilization, cycle length, and balanced power distribution. Evaluate thermal margins and safety parameters.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          bgcolor: 'rgba(0, 0, 0, 0.04)', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 1,
                          mt: 'auto'
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium">
                          Status: Coming Q4 2025
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button variant="outlined" fullWidth disabled>
                        Launch Simulator
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
              
              <Box sx={{ mt: 6, bgcolor: '#f5f5f5', p: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>
                  Request Early Access
                </Typography>
                <Typography variant="body2" paragraph>
                  We're currently developing our suite of nuclear engineering simulators. Join our early access program to be among the first to test these tools and provide valuable feedback.
                </Typography>
                <Button variant="contained" color="primary">
                  Apply for Early Access
                </Button>
              </Box>
            </TabPanel>
            
            {/* Knowledge Quiz Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h4" gutterBottom>
                Nuclear Engineering Quiz
              </Typography>
              <Typography variant="body1" paragraph>
                Test your knowledge of nuclear engineering concepts, reactor physics, and safety systems with our interactive quizzes.
              </Typography>
              
              <Paper elevation={3} sx={{ p: 4, mt: 4, maxWidth: 800, mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                  Sample Questions
                </Typography>
                <Typography variant="body2" paragraph>
                  These sample questions represent the types of knowledge assessments available in our full quiz modules.
                </Typography>
                
                {quizQuestions.map((question, index) => (
                  <Box key={index} sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {index + 1}. {question.question}
                    </Typography>
                    <List dense>
                      {question.options.map((option, optIndex) => (
                        <ListItem key={optIndex} sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {optIndex === question.answer ? (
                              <CheckCircleIcon color="success" />
                            ) : (
                              <Box sx={{ width: 24, height: 24, borderRadius: '50%', border: '1px solid #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
                                  {String.fromCharCode(65 + optIndex)}
                                </Typography>
                              </Box>
                            )}
                          </ListItemIcon>
                          <ListItemText primary={option} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                ))}
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button variant="contained" color="primary">
                    Take Full Quiz
                  </Button>
                  <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                    Full quiz contains 30+ questions across multiple difficulty levels
                  </Typography>
                </Box>
              </Paper>
            </TabPanel>
            
            {/* Design Tools Tab */}
            <TabPanel value={activeTab} index={4}>
              <Typography variant="h4" gutterBottom>
                Nuclear Plant Design Tools
              </Typography>
              <Typography variant="body1" paragraph>
                Professional-grade tools for nuclear power plant design, fuel assembly optimization, and safety system analysis. These upcoming tools are intended for educational purposes and professional development.
              </Typography>
              
              <Box sx={{ position: 'relative', width: '100%', height: 400, bgcolor: '#f5f5f5', mb: 4, borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="h5" color="textSecondary">
                  3D Design Tool Preview Coming Soon
                </Typography>
              </Box>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <EngineeringIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Reactor Vessel Designer
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Design reactor pressure vessels with consideration for neutron fluence, thermal stresses, and material selection. Includes templates for PWR, BWR, and SMR designs.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                      Status: In development • Expected Q3 2025
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AutoGraphIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Core Loading Pattern Optimizer
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Optimize fuel assembly loading patterns for maximum cycle length, minimum peaking factors, and efficient fuel utilization. Includes visualization of power distributions.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                      Status: In development • Expected Q4 2025
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LightbulbIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Plant Efficiency Analyzer
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Calculate and optimize overall plant efficiency with considerations for thermal cycles, component performance, and operational parameters. Compare different plant designs.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                      Status: Planning phase • Expected Q1 2026
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
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
                  Our nuclear engineering resources are designed for educational purposes, providing students, educators, and professionals with interactive tools to better understand nuclear technology.
                </Typography>
                <Typography variant="body2">
                  All simulations and calculators are simplified models intended to illustrate fundamental concepts and provide practice opportunities, not for actual plant design or operation.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <EngineeringIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Professional Development
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  For nuclear professionals, our tools provide opportunities to refresh knowledge, explore alternative designs, and practice skills in a risk-free environment.
                </Typography>
                <Typography variant="body2">
                  While not intended for critical applications, these resources can supplement professional training and development programs in the nuclear industry.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default NuclearEngineeringPage;