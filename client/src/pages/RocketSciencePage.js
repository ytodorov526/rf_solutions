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
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import CalculateIcon from '@mui/icons-material/Calculate';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ScienceIcon from '@mui/icons-material/Science';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExploreIcon from '@mui/icons-material/Explore';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

// Tab panel component for content organization
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`rocket-tabpanel-${index}`}
      aria-labelledby={`rocket-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `rocket-tab-${index}`,
    'aria-controls': `rocket-tabpanel-${index}`,
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

// Propulsion system types data for educational content
const propulsionSystems = [
  {
    name: "Liquid Propellant Rocket Engine",
    description: "Engines that use liquid propellants stored separately until combustion. Common propellant combinations include liquid oxygen/kerosene, liquid oxygen/liquid hydrogen, and nitrogen tetroxide/hydrazine.",
    features: [
      "High specific impulse (efficiency)",
      "Ability to throttle and restart",
      "Complex feed systems with turbopumps or pressurized tanks",
      "Regenerative, ablative, or radiative cooling systems"
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/8/8f/SpaceX_Merlin_1D_Engine.jpg"
  },
  {
    name: "Solid Rocket Motor",
    description: "Motors that use pre-mixed solid propellant (fuel and oxidizer) cast into a single grain. Used in boosters for many launch vehicles and for military applications.",
    features: [
      "Simple design with few moving parts",
      "Long storage life and high reliability",
      "Cannot be shut down once ignited",
      "Lower specific impulse than liquid systems"
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Solid_rocket_motor_ground_firing.jpg/640px-Solid_rocket_motor_ground_firing.jpg"
  },
  {
    name: "Hybrid Rocket Engine",
    description: "Engines that combine aspects of both solid and liquid systems, typically with a solid fuel and liquid or gaseous oxidizer. SpaceShipOne used a hybrid engine with rubber fuel and nitrous oxide.",
    features: [
      "Safer than solid motors (can be throttled or shut down)",
      "Simpler than liquid engines",
      "Performance between solid and liquid systems",
      "Potential for non-toxic propellants"
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Hybrid_rocket_diagram.svg/640px-Hybrid_rocket_diagram.svg.png"
  },
  {
    name: "Electric Propulsion",
    description: "Low-thrust, high-efficiency propulsion systems that use electricity to accelerate propellant. Includes ion thrusters, Hall effect thrusters, and pulsed plasma thrusters.",
    features: [
      "Extremely high specific impulse (2000-5000 seconds)",
      "Very low thrust levels",
      "Ideal for long-duration deep space missions",
      "Requires electrical power source (solar panels or nuclear)"
    ],
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Ion_engine_test_firing_-_GPN-2000-000482.jpg/640px-Ion_engine_test_firing_-_GPN-2000-000482.jpg"
  }
];

function RocketSciencePage() {
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
          Rocket Science Education Center
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Comprehensive resources for rocket propulsion, orbital mechanics, and spacecraft design
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
                aria-label="rocket science tabs"
              >
                <Tab icon={<SchoolIcon />} iconPosition="start" label="Educational Resources" {...a11yProps(0)} />
                <Tab icon={<CalculateIcon />} iconPosition="start" label="Orbital Mechanics" {...a11yProps(1)} />
                <Tab icon={<ScienceIcon />} iconPosition="start" label="Propulsion Systems" {...a11yProps(2)} />
                <Tab icon={<RocketLaunchIcon />} iconPosition="start" label="Simulator & Quiz" {...a11yProps(3)} />
              </Tabs>
            </Box>
            
            {/* Educational Resources Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h4" gutterBottom>
                Propulsion Systems & Technologies
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Learn about different rocket propulsion systems, from chemical rockets to advanced electric propulsion technologies. Understand the principles, advantages, and applications of each system.
              </Typography>
              
              <Grid container spacing={4}>
                {propulsionSystems.map((system) => (
                  <Grid item xs={12} md={6} key={system.name}>
                    <Card elevation={3}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={system.image}
                        alt={system.name}
                        sx={{ objectFit: 'cover', bgcolor: '#f5f5f5', p: 2 }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {system.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {system.description}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Features:
                        </Typography>
                        <List dense>
                          {system.features.map((feature, index) => (
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
                  Browse All Propulsion Systems
                </Button>
                <Button variant="outlined">
                  Download Educational Materials
                </Button>
              </Box>
            </TabPanel>
            
            {/* Orbital Mechanics Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h4" gutterBottom>
                Orbital Mechanics & Trajectory Design
              </Typography>
              <Typography variant="body1" paragraph>
                Explore the physics of orbital motion, transfer orbits, and trajectory design for spacecraft missions. Learn about Kepler's laws, orbital elements, and rocket equations.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Interactive Orbital Mechanics Simulator
                </Typography>
                <Paper sx={{ p: 3, bgcolor: '#f5f9ff' }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={8}>
                      <Typography variant="h6" gutterBottom>
                        Interactive Orbital Mechanics Simulator
                      </Typography>
                      <Typography variant="body2">
                        Design, analyze, and visualize spacecraft orbits with our comprehensive orbital mechanics simulator. Calculate transfer orbits, perform maneuvers, and plan complex missions with accurate physics models and interactive visualization.
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
                      <Button 
                        variant="contained" 
                        color="primary"
                        startIcon={<ExploreIcon />}
                        onClick={() => {
                          setActiveTab(3);
                          setTimeout(() => {
                            document.getElementById('orbital-simulator-section').scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        }}
                      >
                        Try It Now
                      </Button>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Fundamental Concepts
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Kepler's Laws of Planetary Motion
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Johannes Kepler's three laws that describe the motion of planets around the Sun:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Planets move in elliptical orbits with the Sun at one focus" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="A line connecting a planet to the Sun sweeps out equal areas in equal times" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="The square of a planet's orbital period is proportional to the cube of its semi-major axis" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Orbital Elements
                        </Typography>
                        <Typography variant="body2" paragraph>
                          The six parameters needed to uniquely define an orbit:
                        </Typography>
                        <List dense>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Semi-major axis (a): Size of the orbit" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Eccentricity (e): Shape of the orbit" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Inclination (i): Tilt of the orbit relative to the reference plane" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Longitude of ascending node (Ω): Orientation of the orbit's intersection with the reference plane" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="Argument of periapsis (ω): Orientation of the orbit's closest approach" />
                          </ListItem>
                          <ListItem>
                            <ListItemIcon><CheckCircleIcon color="primary" fontSize="small" /></ListItemIcon>
                            <ListItemText primary="True anomaly (ν): Position of the orbiting object at a specific time" />
                          </ListItem>
                        </List>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
            
            {/* Propulsion Systems Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h4" gutterBottom>
                Rocket Propulsion Systems
              </Typography>
              <Typography variant="body1" paragraph>
                Dive deep into the engineering and physics of rocket propulsion systems, from the fundamentals of thrust generation to advanced engine cycles and propellant chemistry.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Engine Cycles & Architectures
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Gas Generator Cycle
                        </Typography>
                        <Typography variant="body2" paragraph>
                          A portion of propellants is burned in a gas generator to power turbomachinery. The exhaust is then typically vented overboard.
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Examples: F-1 (Saturn V), Merlin (Falcon 9)
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="body2">Complexity: ★★★☆☆</Typography>
                          <Typography variant="body2">Efficiency: ★★★☆☆</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Staged Combustion Cycle
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Almost all propellant flows through preburners to drive turbopumps, then into the main combustion chamber, maximizing efficiency.
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Examples: RS-25 (Space Shuttle), RD-180 (Atlas V)
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="body2">Complexity: ★★★★★</Typography>
                          <Typography variant="body2">Efficiency: ★★★★★</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Expander Cycle
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Cryogenic fuel is heated in regenerative cooling channels around the combustion chamber, and the resulting gas drives the turbopumps.
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Examples: RL10 (Centaur upper stage), BE-3U (New Shepard)
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="body2">Complexity: ★★★☆☆</Typography>
                          <Typography variant="body2">Efficiency: ★★★★☆</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card elevation={2} sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Pressure-Fed System
                        </Typography>
                        <Typography variant="body2" paragraph>
                          Propellants are pushed to the combustion chamber by tank pressure alone, eliminating turbopumps at the cost of heavier tanks.
                        </Typography>
                        <Typography variant="subtitle2" color="text.secondary">
                          Examples: Apollo Service Module RCS, many small satellite thrusters
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                          <Typography variant="body2">Complexity: ★☆☆☆☆</Typography>
                          <Typography variant="body2">Efficiency: ★★☆☆☆</Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Common Propellant Combinations
                </Typography>
                <Paper sx={{ p: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Liquid Oxygen (LOX) / RP-1 (Refined Kerosene)
                      </Typography>
                      <Typography variant="body2" paragraph>
                        A widely used combination for first stages due to kerosene's density and storability.
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2">Isp (sea level): ~290s</Typography>
                        <Typography variant="body2">Isp (vacuum): ~330s</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Liquid Oxygen (LOX) / Liquid Hydrogen (LH2)
                      </Typography>
                      <Typography variant="body2" paragraph>
                        High-performance combination used for upper stages, with hydrogen's low density offset by its high energy content.
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2">Isp (sea level): ~380s</Typography>
                        <Typography variant="body2">Isp (vacuum): ~450s</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Nitrogen Tetroxide (NTO) / Hydrazines
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Hypergolic (self-igniting) combination used in spacecraft propulsion and reaction control systems.
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2">Isp (vacuum): ~320s</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Liquid Oxygen (LOX) / Liquid Methane (LCH4)
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Modern combination offering good performance, easier handling than hydrogen, and potential for in-situ resource utilization on Mars.
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                        <Typography variant="body2">Isp (sea level): ~310s</Typography>
                        <Typography variant="body2">Isp (vacuum): ~360s</Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Paper>
              </Box>
            </TabPanel>
            
            {/* Knowledge Quiz & Simulator Tab */}
            <TabPanel value={activeTab} index={3}>
              <Box id="orbital-simulator-section" sx={{ mb: 6 }}>
                <Typography variant="h4" gutterBottom>
                  Orbital Mechanics Simulator
                </Typography>
                <Typography variant="body1" paragraph>
                  Visualize and explore orbital mechanics with our interactive simulator. Design custom orbits, experiment with different parameters, and see how they affect spacecraft trajectories in real-time.
                </Typography>
                
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Orbital Mechanics Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/rocket-science/OrbitalMechanicsSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Divider sx={{ my: 6 }} />
              
              <Box>
                <Typography variant="h4" gutterBottom>
                  Rocket Science Quiz
                </Typography>
                <Typography variant="body1" paragraph>
                  Test your knowledge of rocket propulsion, orbital mechanics, and spacecraft engineering with our interactive quiz. Choose from multiple difficulty levels ranging from beginner to expert.
                </Typography>
                
                <Box sx={{ mt: 4 }}>
                  <ErrorBoundary>
                    <Suspense fallback={
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                        <CircularProgress size={24} />
                        <Typography sx={{ ml: 2 }}>Loading Rocket Science Quiz...</Typography>
                      </Box>
                    }>
                      {React.createElement(
                        React.lazy(() => import('../components/rocket-science/RocketScienceQuiz')),
                        {}
                      )}
                    </Suspense>
                  </ErrorBoundary>
                </Box>
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
                  Our rocket science resources are designed for educational purposes, providing students, educators, and professionals with interactive tools to better understand rocketry and spacecraft engineering.
                </Typography>
                <Typography variant="body2">
                  All simulations and calculators are simplified models intended to illustrate fundamental concepts and provide practice opportunities, not for actual vehicle design or mission planning.
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
                  For aerospace professionals, our tools provide opportunities to refresh knowledge, explore alternative designs, and practice skills in a risk-free environment.
                </Typography>
                <Typography variant="body2">
                  While not intended for critical applications, these resources can supplement professional training and development programs in the aerospace industry.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default RocketSciencePage;