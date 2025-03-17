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
import ElectricBoltIcon from '@mui/icons-material/ElectricBolt';
import MemoryIcon from '@mui/icons-material/Memory';

// Tab panel component for content organization
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`electrical-tabpanel-${index}`}
      aria-labelledby={`electrical-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `electrical-tab-${index}`,
    'aria-controls': `electrical-tabpanel-${index}`,
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

// Circuit Types data for educational content
const circuitTypes = [
  {
    name: "Analog Circuits",
    description: "Circuits that process continuous signals, where the output is proportional to the input. They handle real-world signals like sound, light, temperature, and pressure.",
    features: [
      "Process continuous electrical signals",
      "Examples include amplifiers, filters, oscillators",
      "Used in radio, audio equipment, sensors",
      "Less immune to noise compared to digital circuits"
    ],
    image: "https://www.electronicshub.org/wp-content/uploads/2015/05/Analog-Circuit.jpg"
  },
  {
    name: "Digital Circuits",
    description: "Circuits that handle discrete signals (0s and 1s). They form the foundation of modern computing, communication systems, and signal processing applications.",
    features: [
      "Process binary signals (0 and 1)",
      "Examples include logic gates, microprocessors, memory",
      "Used in computers, smartphones, digital electronics",
      "Better noise immunity than analog circuits"
    ],
    image: "https://www.electronicshub.org/wp-content/uploads/2015/05/Digital-Circuit.jpg"
  },
  {
    name: "Power Electronics",
    description: "Specialized circuits that convert and control large amounts of electrical power, essential for energy conversion systems, motor drives, and renewable energy applications.",
    features: [
      "High power handling capability",
      "Voltage and current conversion",
      "Used in inverters, motor drives, power supplies",
      "Employs semiconductor devices like MOSFETs, IGBTs"
    ],
    image: "https://www.electrical4u.com/images/2020-August/1597048661.png"
  },
  {
    name: "Microelectronics",
    description: "The study and manufacturing of very small electronic designs and components, typically made using semiconductor materials like silicon.",
    features: [
      "Miniaturized electronic components",
      "Integrated circuits (ICs) and microchips",
      "System-on-Chip (SoC) and VLSI design",
      "Nanometer-scale manufacturing processes"
    ],
    image: "https://www.electronicdesign.com/sites/default/files/styles/500x400/public/Integrated-Circuit-Microchip_0.jpg?itok=kpUFDCJ4"
  }
];

// Sample electrical engineering quiz questions
const quizQuestions = [
  {
    question: "What is Ohm's Law?",
    options: ["V = I/R", "V = IR", "R = I/V", "I = V/R2"],
    answer: 1
  },
  {
    question: "Which component stores energy in an electric field?",
    options: ["Resistor", "Capacitor", "Inductor", "Transformer"],
    answer: 1
  },
  {
    question: "What is the unit of electrical resistance?",
    options: ["Volt", "Ampere", "Ohm", "Watt"],
    answer: 2
  },
  {
    question: "Which semiconductor device is used as a voltage regulator?",
    options: ["Diode", "Transistor", "Zener diode", "MOSFET"],
    answer: 2
  }
];

// Calculator formulas explained
const calculatorFormulas = [
  {
    name: "Ohm's Law",
    formula: "V = IR",
    description: "The relationship between voltage (V), current (I), and resistance (R) in an electrical circuit."
  },
  {
    name: "Power",
    formula: "P = VI",
    description: "The power (P) consumed or produced by an electrical component is the product of voltage (V) and current (I)."
  },
  {
    name: "RC Time Constant",
    formula: "τ = RC",
    description: "The time constant (τ) of an RC circuit, where R is resistance and C is capacitance, determines how quickly the circuit responds to changes."
  },
  {
    name: "Resonant Frequency",
    formula: "f = 1/(2π√(LC))",
    description: "The resonant frequency (f) of an LC circuit depends on the inductance (L) and capacitance (C)."
  },
  {
    name: "Impedance",
    formula: "Z = √(R² + (XL - XC)²)",
    description: "The impedance (Z) in an AC circuit is a function of resistance (R), inductive reactance (XL), and capacitive reactance (XC)."
  }
];

// Electrical Engineering simulators overview
const simulatorsOverview = [
  {
    title: "Circuit Simulator",
    description: "Design and analyze analog and digital circuits with realistic component behaviors and interactive controls.",
    status: "Available Now"
  },
  {
    title: "Power Systems Analyzer",
    description: "Simulate power distribution networks, analyze load flow, fault conditions, and stability of electrical power systems.",
    status: "Available Now"
  },
  {
    title: "Digital Logic Simulator",
    description: "Design and test digital logic circuits using standard gates, flip-flops, and programmable logic devices.",
    status: "Available Now"
  },
  {
    title: "Electromagnetic Field Simulator",
    description: "Visualize and analyze electric and magnetic fields for various conductor configurations and devices.",
    status: "Available Now"
  },
  {
    title: "Control Systems Simulator",
    description: "Model and analyze feedback control systems, PID controllers, and system responses to different inputs.",
    status: "Available Now"
  }
];

function ElectricalEngineeringPage() {
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
          Electrical Engineering Education Center
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Comprehensive resources for electrical engineering concepts, circuit design, and interactive learning tools
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
                aria-label="electrical engineering tabs"
              >
                <Tab icon={<SchoolIcon />} iconPosition="start" label="Educational Resources" {...a11yProps(0)} />
                <Tab icon={<CalculateIcon />} iconPosition="start" label="Interactive Calculators" {...a11yProps(1)} />
                <Tab icon={<ScienceIcon />} iconPosition="start" label="Circuit Simulators" {...a11yProps(2)} />
                <Tab icon={<BiotechIcon />} iconPosition="start" label="Knowledge Quiz" {...a11yProps(3)} />
                <Tab icon={<ConstructionIcon />} iconPosition="start" label="Design Tools" {...a11yProps(4)} />
              </Tabs>
            </Box>
            
            {/* Educational Resources Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h4" gutterBottom>
                Circuit Types & Technologies
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Learn about different electrical circuit types, operational principles, and applications. This comprehensive guide covers everything from basic analog circuits to advanced digital and power electronics designs.
              </Typography>
              
              <Grid container spacing={4}>
                {circuitTypes.map((circuit) => (
                  <Grid item xs={12} md={6} key={circuit.name}>
                    <Card elevation={3}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={circuit.image}
                        alt={circuit.name}
                        sx={{ objectFit: 'contain', bgcolor: '#f5f5f5', p: 2 }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {circuit.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {circuit.description}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Features:
                        </Typography>
                        <List dense>
                          {circuit.features.map((feature, index) => (
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
                  Browse All Circuit Designs
                </Button>
                <Button variant="outlined">
                  Download Educational Materials
                </Button>
              </Box>
            </TabPanel>
            
            {/* Interactive Calculators Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h4" gutterBottom>
                Electrical Engineering Calculators
              </Typography>
              <Typography variant="body1" paragraph>
                Interactive tools to calculate critical electrical engineering parameters, explore circuit behavior, and visualize fundamental electrical processes.
              </Typography>
              
              {/* Include the ElectricalCalculator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Electrical Calculator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/ElectricalCalculator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              {/* Include the PowerSystemsCalculator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Power Systems Calculator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/PowerSystemsCalculator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              {/* Include the SignalProcessingCalculator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Signal Processing Calculator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/SignalProcessingCalculator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Control Systems Analyzer...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/ControlSystemsAnalyzer')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Recently Added Calculators
                </Typography>
                <Paper sx={{ p: 3, mb: 2, bgcolor: '#f0f7f0', border: '1px solid #c8e6c9' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom color="success.main">
                        Control Systems Analyzer
                      </Typography>
                      <Typography variant="body2">
                        Our newest analytical tool allows you to design and analyze control systems. Create transfer functions, plot system responses, and tune PID controllers for optimal performance across various applications from motor control to process automation.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="success"
                        onClick={() => {
                          const controlAnalyzer = document.getElementById('control-systems-analyzer');
                          if (controlAnalyzer) controlAnalyzer.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Try It Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 3, mb: 2, bgcolor: '#f0f7f0', border: '1px solid #c8e6c9' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom color="success.main">
                        Power Systems Calculator
                      </Typography>
                      <Typography variant="body2">
                        Our interactive tool helps you design and analyze power distribution systems. Calculate load flows, fault currents, and voltage drops for power systems of various scales from residential installations to industrial power distribution networks.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="success"
                        onClick={() => {
                          const powerCalc = document.getElementById('power-systems-calculator');
                          if (powerCalc) powerCalc.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Try It Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 3, bgcolor: '#f0f7f0', border: '1px solid #c8e6c9', mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom color="success.main">
                        Signal Processing Calculator
                      </Typography>
                      <Typography variant="body2">
                        Design and analyze digital filters, perform spectral analysis, and simulate signal processing algorithms. This advanced tool supports time and frequency domain analysis, perfect for communications systems, audio processing, and sensor data analysis.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="success"
                        onClick={() => {
                          const signalCalc = document.getElementById('signal-processing-calculator');
                          if (signalCalc) signalCalc.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Try It Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 3, bgcolor: '#f0f7f0', border: '1px solid #c8e6c9', mb: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom color="success.main">
                        Electromagnetic Field Simulator
                      </Typography>
                      <Typography variant="body2">
                        Visualize and analyze electric and magnetic fields for various configurations. Model field patterns around conductors, antennas, transformers, and other electromagnetic devices to better understand field interactions and optimize designs.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="success"
                        onClick={() => {
                          const emSim = document.getElementById('electromagnetic-simulator');
                          if (emSim) emSim.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Try It Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
                
                <Paper sx={{ p: 3, bgcolor: '#f0f7f0', border: '1px solid #c8e6c9' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom color="success.main">
                        Digital Logic Simulator
                      </Typography>
                      <Typography variant="body2">
                        Design and test digital logic circuits using our interactive simulator. Build circuits with logic gates, flip-flops, registers, and memory elements. Test your designs with various input patterns and observe real-time operation of your digital systems.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                      <Button 
                        variant="outlined" 
                        color="success"
                        onClick={() => {
                          setActiveTab(2);
                          document.getElementById('digital-logic-simulator-section').scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Try It Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </TabPanel>
            
            {/* Circuit Simulators Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h4" gutterBottom>
                Electrical Circuit Simulators
              </Typography>
              <Typography variant="body1" paragraph>
                Interactive simulations to model circuit behavior, practice design techniques, and understand complex electrical processes. Our simulators provide hands-on learning experiences for students and professionals.
              </Typography>
              
              {/* Import and include the CircuitSimulator component */}
              <Box sx={{ mt: 4 }}>
                {/* Include the circuit simulator component */}
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Circuit Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/CircuitSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }} id="power-systems-section">
                {/* Include the power systems simulator */}
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Power Systems Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/PowerSystemsSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }} id="control-systems-section">
                {/* Include the control systems simulator */}
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Control Systems Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/ControlSystemsSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }} id="digital-logic-simulator-section">
                {/* Include the Digital Logic Simulator */}
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Digital Logic Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/DigitalLogicSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>

              <Box sx={{ mt: 4 }}>
                {/* Include the Electromagnetic Field Simulator */}
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Electromagnetic Field Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/ElectromagneticFieldSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
                Circuit Simulation Modules
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Circuit Simulator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Design and analyze analog and digital circuits with realistic component behaviors. Build circuits from basic components like resistors, capacitors, and transistors to complex integrated circuits.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          bgcolor: 'rgba(0, 100, 0, 0.08)', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 1,
                          mt: 'auto'
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium" color="success.main">
                          Status: Available Now
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => {
                          setActiveTab(2);
                          document.getElementById('circuit-simulator-section').scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Launch Simulator
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Power Systems Simulator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Simulate power distribution networks, analyze load flow, fault conditions, and stability of electrical power systems. Design and optimize power transmission and distribution networks.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          bgcolor: 'rgba(0, 100, 0, 0.08)', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 1,
                          mt: 'auto'
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium" color="success.main">
                          Status: Available Now
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => {
                          setActiveTab(2);
                          document.getElementById('power-systems-section').scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Launch Simulator
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Digital Logic Simulator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Design and test digital logic circuits using standard gates, flip-flops, and programmable logic devices. Create combinational and sequential circuits and verify their operation with timing diagrams.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          bgcolor: 'rgba(0, 100, 0, 0.08)', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 1,
                          mt: 'auto'
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium" color="success.main">
                          Status: Available Now
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => {
                          setActiveTab(2);
                          document.getElementById('digital-logic-simulator-section').scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Launch Simulator
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Control Systems Simulator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Model and analyze feedback control systems, PID controllers, and system responses to different inputs. Design controllers for various applications from motor control to process automation.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          bgcolor: 'rgba(0, 100, 0, 0.08)', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 1,
                          mt: 'auto'
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium" color="success.main">
                          Status: Available Now
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        onClick={() => {
                          setActiveTab(2);
                          document.getElementById('control-systems-section').scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
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
                  We're developing additional electrical engineering simulators. Join our early access program to be among the first to test these tools and provide valuable feedback.
                </Typography>
                <Button variant="contained" color="primary">
                  Apply for Early Access
                </Button>
              </Box>
            </TabPanel>
            
            {/* Knowledge Quiz Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h4" gutterBottom>
                Electrical Engineering Quiz
              </Typography>
              <Typography variant="body1" paragraph>
                Test your knowledge of electrical engineering concepts, circuit analysis, and electronic systems with our interactive quiz. Choose from multiple difficulty levels ranging from beginner to expert.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Electrical Engineering Quiz...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/ElectricalEngineeringQuiz')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
            </TabPanel>
            
            {/* Design Tools Tab */}
            <TabPanel value={activeTab} index={4}>
              <Typography variant="h4" gutterBottom>
                Electrical Design Tools
              </Typography>
              <Typography variant="body1" paragraph>
                Professional-grade tools for electrical system design, PCB layout, and control system analysis. These tools are intended for educational purposes and professional development.
              </Typography>
              
              <Box sx={{ mt: 2, mb: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: 200 }}>
                      <CircularProgress size={40} />
                      <Typography sx={{ ml: 2 }}>Loading PCB Designer...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/electrical-engineering/PCBDesigner')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h5" gutterBottom>
                Additional Design Tools
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AutoGraphIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Control Systems Analyzer
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Design and analyze control systems with transfer functions, state-space models, and frequency domain analysis. Create Bode plots, root locus diagrams, and simulate system responses to various inputs.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      Status: Available Now
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setActiveTab(1);
                        setTimeout(() => {
                          const element = document.getElementById('control-systems-analyzer');
                          if (element) element.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                    >
                      Launch Tool
                    </Button>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LightbulbIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Power System Efficiency Analyzer
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Calculate and optimize power system efficiency with considerations for component losses, power factor correction, and harmonic distortion. Compare different design approaches for best performance.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                      Status: Planning phase • Expected Q1 2026
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MemoryIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Microcontroller Programmer
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Develop, simulate and test microcontroller programs for various applications. The tool includes code editor, compiler, and simulator for popular microcontroller families with visual I/O representation.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      Status: Available Now
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        setActiveTab(2);
                        document.getElementById('digital-logic-simulator-section').scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Launch Tool
                    </Button>
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
                  Our electrical engineering resources are designed for educational purposes, providing students, educators, and professionals with interactive tools to better understand electrical systems and circuit design.
                </Typography>
                <Typography variant="body2">
                  All simulations and calculators are simplified models intended to illustrate fundamental concepts and provide practice opportunities, not for actual system design or implementation in critical applications.
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
                  For electrical engineering professionals, our tools provide opportunities to explore design alternatives, test theoretical approaches, and practice troubleshooting in a risk-free environment.
                </Typography>
                <Typography variant="body2">
                  While not intended for critical applications, these resources can supplement professional training and development programs in the electrical engineering field.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default ElectricalEngineeringPage;