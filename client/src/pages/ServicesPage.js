import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Tabs,
  Tab
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EngineeringIcon from '@mui/icons-material/Engineering';
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import ScienceIcon from '@mui/icons-material/Science';
import SettingsIcon from '@mui/icons-material/Settings';
import BarChartIcon from '@mui/icons-material/BarChart';
import SchoolIcon from '@mui/icons-material/School';
import CalculateIcon from '@mui/icons-material/Calculate';
import ThreeDRotationIcon from '@mui/icons-material/ThreeDRotation';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';

// Import custom components
import RFCalculator from '../components/RFCalculator';
import AntennaVisualizer from '../components/AntennaVisualizer';
import RFSignalSimulator from '../components/RFSignalSimulator';

const serviceCategories = [
  {
    id: 1,
    title: 'RF Design Services',
    icon: <DesignServicesIcon sx={{ fontSize: 50 }} color="primary" />,
    description: 'Comprehensive RF design services from concept to production',
    services: [
      'RF circuit design for wireless communication systems',
      'Low-noise amplifier (LNA) design and optimization',
      'Power amplifier design for various applications',
      'RF filter design and implementation',
      'RF front-end module development',
      'Mixers, oscillators, and frequency synthesizers',
      'Custom RF solutions for specialized applications'
    ]
  },
  {
    id: 2,
    title: 'Antenna Engineering',
    icon: <EngineeringIcon sx={{ fontSize: 50 }} color="primary" />,
    description: 'Expert antenna design and optimization for all applications',
    services: [
      'Custom antenna design for specific requirements',
      'Antenna arrays and beamforming systems',
      'Phased array antenna design',
      'Microstrip and patch antenna development',
      'Reflector and horn antenna design',
      'Wideband and multiband antenna solutions',
      'Integration and testing of antenna systems'
    ]
  },
  {
    id: 3,
    title: 'Radar System Design',
    icon: <ScienceIcon sx={{ fontSize: 50 }} color="primary" />,
    description: 'End-to-end radar system engineering for various applications',
    services: [
      'FMCW radar design for automotive and industrial applications',
      'Pulse-Doppler radar system development',
      'Ground penetrating radar (GPR) solutions',
      'Weather radar systems',
      'Synthetic aperture radar (SAR) design',
      'Radar signal processing algorithm development',
      'Custom radar systems for specific detection requirements'
    ]
  },
  {
    id: 4,
    title: 'Testing & Validation',
    icon: <SettingsIcon sx={{ fontSize: 50 }} color="primary" />,
    description: 'Comprehensive testing and validation of RF systems',
    services: [
      'RF performance measurement and validation',
      'Antenna pattern measurement',
      'Over-the-air (OTA) testing',
      'EMC/EMI compliance testing',
      'Environmental testing for RF systems',
      'Production testing solutions',
      'Custom test fixture development'
    ]
  },
  {
    id: 5,
    title: 'Simulation & Analysis',
    icon: <BarChartIcon sx={{ fontSize: 50 }} color="primary" />,
    description: 'Advanced simulation and analysis for RF, antenna, and radar systems',
    services: [
      'Electromagnetic field simulation',
      'RF circuit simulation and optimization',
      'Antenna radiation pattern prediction',
      'Radar cross-section (RCS) analysis',
      'Propagation modeling for various environments',
      'System-level performance analysis',
      'Thermal analysis for high-power RF systems'
    ]
  },
  {
    id: 6,
    title: 'Training & Consultation',
    icon: <SchoolIcon sx={{ fontSize: 50 }} color="primary" />,
    description: 'Expert consultation and training for RF engineering teams',
    services: [
      'RF engineering best practices training',
      'Antenna design workshops',
      'Radar system engineering courses',
      'Custom training programs for engineering teams',
      'Technical consultation for complex RF projects',
      'Design reviews and optimization recommendations',
      'Technology roadmap development'
    ]
  }
];

const faqs = [
  {
    question: 'What industries do you typically work with?',
    answer: 'We work with clients from various industries including telecommunications, aerospace, defense, automotive, IoT, medical devices, and research institutions. Our RF engineering solutions are adaptable to any sector requiring wireless technology.'
  },
  {
    question: 'How long does a typical RF design project take?',
    answer: 'Project timelines vary significantly based on complexity, requirements, and scope. Simple designs might take 4-8 weeks, while complex systems could require 6-12 months of development. During our initial consultation, we\'ll provide a detailed timeline based on your specific project needs.'
  },
  {
    question: 'Do you offer prototyping services?',
    answer: 'Yes, we offer comprehensive prototyping services for RF, antenna, and radar systems. Our capabilities include PCB fabrication, assembly, housing design, and functional testing of prototypes. We can produce anything from proof-of-concept models to pre-production prototypes.'
  },
  {
    question: 'Can you help with regulatory compliance for RF products?',
    answer: 'Absolutely. We have extensive experience with regulatory requirements including FCC, CE, ETSI, and other international standards. We design with compliance in mind and can assist with testing, documentation, and certification processes.'
  },
  {
    question: 'Do you provide support after project completion?',
    answer: 'Yes, we offer various post-project support options including technical support, maintenance, updates, and training. We can also provide ongoing consulting as your product evolves or as you develop new features.'
  }
];

// Tab panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`services-tabpanel-${index}`}
      aria-labelledby={`services-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ py: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function ServicesPage() {
  const [tabValue, setTabValue] = useState(0);
  const [requestFormOpen, setRequestFormOpen] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleScheduleConsultation = () => {
    // Use React Router's navigate function for better user experience
    // window.location.href approach can cause full page reloads
    // Instead we'll push to the contact page with a query parameter
    window.location.href = '/contact?from=services&action=consultation';
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Our Engineering Services
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Expert RF, antenna, and radar engineering solutions
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ width: '100%', mb: 4 }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="services tabs"
            centered
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 2 }}
          >
            <Tab 
              label="Services" 
              icon={<DesignServicesIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="RF Calculator" 
              icon={<CalculateIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Antenna Visualizer" 
              icon={<ThreeDRotationIcon />} 
              iconPosition="start"
            />
            <Tab 
              label="Signal Simulator" 
              icon={<DesktopWindowsIcon />} 
              iconPosition="start"
            />
          </Tabs>
        </Box>
        
        <TabPanel value={tabValue} index={0}>
          {/* Services Grid */}
          <Grid container spacing={4}>
            {serviceCategories.map((category) => (
              <Grid item key={category.id} xs={12} md={6}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      {category.icon}
                      <Typography variant="h4" component="h2" ml={2}>
                        {category.title}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle1" paragraph>
                      {category.description}
                    </Typography>
                    <List>
                      {category.services.map((service, index) => (
                        <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="secondary" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={service} />
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            RF Engineering Calculators
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph sx={{ mb: 4 }}>
            Professional tools for RF engineers - calculate wavelength, path loss, and antenna parameters
          </Typography>
          
          <RFCalculator />
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Need help with complex RF calculations for your project?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleScheduleConsultation}
            >
              Schedule a Consultation
            </Button>
          </Box>
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            3D Antenna Pattern Visualization
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph sx={{ mb: 4 }}>
            Interactive 3D visualization of antenna radiation patterns
          </Typography>
          
          <AntennaVisualizer />
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Need custom antenna design for your specific requirements?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleScheduleConsultation}
            >
              Request Custom Design
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Typography variant="h4" component="h2" align="center" gutterBottom>
            RF Signal Simulator
          </Typography>
          <Typography variant="subtitle1" align="center" paragraph sx={{ mb: 4 }}>
            Interactive simulation of RF modulation techniques
          </Typography>
          
          <RFSignalSimulator />
          
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Need expertise in RF modulation for your project?
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              size="large"
              onClick={handleScheduleConsultation}
            >
              Get Expert Consultation
            </Button>
          </Box>
        </TabPanel>
        
        {/* Process Section */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Our Engineering Process
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            A systematic approach to delivering high-quality RF solutions
          </Typography>
          
          <Grid container spacing={2} sx={{ mt: 4 }}>
            {[
              { 
                step: 1, 
                title: 'Requirements Analysis', 
                description: 'We begin with a thorough analysis of your requirements, constraints, and objectives to establish a solid foundation for the project.' 
              },
              { 
                step: 2, 
                title: 'Conceptual Design', 
                description: 'Our engineers develop conceptual designs, exploring various approaches and technologies to identify the optimal solution for your needs.' 
              },
              { 
                step: 3, 
                title: 'Detailed Design & Simulation', 
                description: 'We create detailed designs and use advanced simulation tools to verify performance before physical implementation.' 
              },
              { 
                step: 4, 
                title: 'Prototyping', 
                description: 'Functional prototypes are built and tested to validate the design in real-world conditions.' 
              },
              { 
                step: 5, 
                title: 'Testing & Optimization', 
                description: 'Rigorous testing ensures all specifications are met, with iterative optimization to enhance performance.' 
              },
              { 
                step: 6, 
                title: 'Documentation & Delivery', 
                description: 'Comprehensive documentation is provided along with the final product, ensuring you have everything needed for implementation and future reference.' 
              }
            ].map((step) => (
              <Grid item key={step.step} xs={12} sm={6} md={4}>
                <Paper 
                  elevation={3} 
                  sx={{ 
                    p: 3, 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    position: 'relative',
                    '&::before': {
                      content: `"${step.step}"`,
                      position: 'absolute',
                      top: -15,
                      left: -15,
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold',
                      fontSize: '1.2rem',
                      zIndex: 1
                    }
                  }}
                >
                  <Typography variant="h5" component="h3" gutterBottom>
                    {step.title}
                  </Typography>
                  <Typography variant="body1">
                    {step.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* FAQs */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>
          
          <Box sx={{ mt: 4 }}>
            {faqs.map((faq, index) => (
              <Accordion key={index} sx={{ mb: 1 }}>
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography variant="h6">{faq.question}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography>{faq.answer}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Box>
        
        {/* CTA */}
        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Ready to Discuss Your RF Engineering Project?
          </Typography>
          <Typography variant="body1" paragraph>
            Contact us today to schedule a consultation with our expert engineering team.
          </Typography>
          <Button variant="contained" color="primary" size="large">
            Schedule a Consultation
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ServicesPage;