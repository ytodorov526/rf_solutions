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
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import CalculateIcon from '@mui/icons-material/Calculate';
import MedicationIcon from '@mui/icons-material/Medication';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import BiotechIcon from '@mui/icons-material/Biotech';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Tab panel component for content organization
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`health-tabpanel-${index}`}
      aria-labelledby={`health-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `health-tab-${index}`,
    'aria-controls': `health-tabpanel-${index}`,
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

// Health articles data
const healthArticles = [
  {
    title: "Biomarkers: What They Are and Why They Matter",
    description: "Biomarkers are measurable indicators of biological states or conditions. They can be used to assess health status, disease risk, and biological age. Learn how different biomarkers reflect various aspects of your health.",
    features: [
      "Types of biomarkers: molecular, imaging, and physiological",
      "How biomarkers are used in clinical settings",
      "Key biomarkers for cardiovascular, metabolic, and inflammatory health",
      "The future of personalized medicine through biomarker analysis"
    ],
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Understanding Biological Age vs. Chronological Age",
    description: "Your chronological age may not match your biological age. Biological age reflects how well your body functions compared to population averages and can be a better predictor of health outcomes than your birth certificate.",
    features: [
      "The science behind biological aging",
      "Factors that accelerate or slow biological aging",
      "How lifestyle choices impact your biological age",
      "Using biomarkers to assess biological age"
    ],
    image: "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Optimizing Health Through Lifestyle Medicine",
    description: "Lifestyle medicine focuses on evidence-based lifestyle interventions to prevent, treat, and sometimes reverse chronic disease. Learn how nutrition, physical activity, sleep, and stress management can transform your health.",
    features: [
      "Six pillars of lifestyle medicine",
      "Evidence-based approaches to disease prevention",
      "Creating sustainable health habits",
      "Measuring your progress with biomarkers"
    ],
    image: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "The Future of Personalized Health",
    description: "Advances in technology and data analytics are revolutionizing healthcare, enabling truly personalized approaches to disease prevention and treatment based on your unique genetic makeup, biomarkers, and lifestyle factors.",
    features: [
      "Precision medicine approaches",
      "AI-powered health analysis",
      "Continuous health monitoring technologies",
      "Personalized nutrition and exercise prescriptions"
    ],
    image: "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

// Sample health quiz questions
const quizQuestions = [
  {
    question: "Which of the following biomarkers is considered a strong predictor of cardiovascular health?",
    options: ["Hemoglobin A1c", "C-reactive protein", "Alanine aminotransferase (ALT)", "Thyroid-stimulating hormone"],
    answer: 1
  },
  {
    question: "What is the normal range for fasting blood glucose in a healthy adult?",
    options: ["40-60 mg/dL", "70-99 mg/dL", "120-140 mg/dL", "180-200 mg/dL"],
    answer: 1
  },
  {
    question: "Which vitamin deficiency is associated with poor bone health and increased fracture risk?",
    options: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin E"],
    answer: 2
  },
  {
    question: "What is the primary purpose of measuring HbA1c (glycated hemoglobin)?",
    options: ["Assess average blood glucose over ~3 months", "Evaluate kidney function", "Measure inflammation levels", "Screen for vitamin deficiencies"],
    answer: 0
  }
];

// Calculator formulas explained
const calculatorFormulas = [
  {
    name: "Biological Age",
    formula: "Phenotypic Age = 141.50 + ln(-0.00553×ln(1-mortality risk))",
    description: "Phenotypic age calculation based on biomarkers including albumin, creatinine, glucose, C-reactive protein, white blood cell count, and others."
  },
  {
    name: "Body Mass Index (BMI)",
    formula: "BMI = weight(kg) / height(m)²",
    description: "A simple ratio of weight to height squared, used as a screening tool for weight categories that may lead to health problems."
  },
  {
    name: "Basal Metabolic Rate (BMR)",
    formula: "BMR (men) = 10 × weight(kg) + 6.25 × height(cm) - 5 × age(y) + 5",
    description: "The Mifflin-St Jeor equation for calculating basal metabolic rate, which estimates calories burned at rest per day."
  },
  {
    name: "VO2 Max Estimation",
    formula: "VO2 Max = 15.3 × (HRmax/HRrest)",
    description: "A simple method to estimate maximal oxygen consumption, which reflects cardiovascular fitness level."
  },
  {
    name: "Insulin Sensitivity",
    formula: "HOMA-IR = (glucose × insulin) / 405",
    description: "Homeostatic Model Assessment of Insulin Resistance, used to quantify insulin resistance and beta-cell function."
  }
];

// Health tools overview
const toolsOverview = [
  {
    title: "Biological Age Calculator",
    description: "Estimate your biological age based on various biomarkers including inflammatory markers, metabolic health indicators, and cardiovascular parameters.",
    status: "Available Now"
  },
  {
    title: "Nutrition Analyzer",
    description: "Analyze your dietary intake for macro and micronutrient composition, identify potential deficiencies, and receive personalized recommendations.",
    status: "Available Now"
  },
  {
    title: "Sleep Quality Analyzer",
    description: "Evaluate sleep quality using inputs about duration, disruptions, and subjective experience, with personalized recommendations for improvement.",
    status: "Available Now"
  },
  {
    title: "Cardiovascular Risk Calculator",
    description: "Assess your 10-year cardiovascular disease risk based on established clinical risk factors and biomarkers.",
    status: "Available Now"
  },
  {
    title: "Metabolic Health Tracker",
    description: "Track key metabolic health markers over time, visualize trends, and receive actionable insights to optimize your metabolic health.",
    status: "Available Now"
  }
];

function HealthPage() {
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
          Health Optimization Center
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Comprehensive health analytics, biological age assessment, and personalized wellness strategies
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
                aria-label="health tabs"
              >
                <Tab icon={<MonitorHeartIcon />} iconPosition="start" label="Health Resources" {...a11yProps(0)} />
                <Tab icon={<CalculateIcon />} iconPosition="start" label="Health Calculators" {...a11yProps(1)} />
                <Tab icon={<FitnessCenterIcon />} iconPosition="start" label="Fitness Tools" {...a11yProps(2)} />
                <Tab icon={<BiotechIcon />} iconPosition="start" label="Health Quiz" {...a11yProps(3)} />
                <Tab icon={<RestaurantIcon />} iconPosition="start" label="Nutrition Tools" {...a11yProps(4)} />
              </Tabs>
            </Box>
            
            {/* Health Resources Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h4" gutterBottom>
                Understanding Health Biomarkers
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Explore our comprehensive guides to health biomarkers, biological aging, and personalized health optimization strategies. These evidence-based resources will help you understand how to interpret your health data and make informed decisions.
              </Typography>
              
              <Grid container spacing={4}>
                {healthArticles.map((article) => (
                  <Grid item xs={12} md={6} key={article.title}>
                    <Card elevation={3}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={article.image}
                        alt={article.title}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {article.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {article.description}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Points:
                        </Typography>
                        <List dense>
                          {article.features.map((feature, index) => (
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
                  Browse All Health Articles
                </Button>
                <Button variant="outlined">
                  Download Educational Materials
                </Button>
              </Box>
            </TabPanel>
            
            {/* Health Calculators Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h4" gutterBottom>
                Health & Biomarker Calculators
              </Typography>
              <Typography variant="body1" paragraph>
                Interactive tools to calculate your biological age, health risks, and optimal health parameters based on scientific research and clinical guidelines.
              </Typography>
              
              {/* Include the BiologicalAgeCalculator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Biological Age Calculator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/BiologicalAgeCalculator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              {/* Include the CardiovascularRiskCalculator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Cardiovascular Risk Calculator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/CardiovascularRiskCalculator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              {/* Include the MetabolicHealthCalculator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Metabolic Health Calculator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/MetabolicHealthCalculator')),
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
                      <Typography sx={{ ml: 2 }}>Loading Body Composition Analyzer...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/BodyCompositionAnalyzer')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Understanding Health Calculations
                </Typography>
                <Typography variant="body2" paragraph>
                  Our health calculators use evidence-based formulas derived from scientific research. Below are some of the key calculations used in our tools:
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
            
            {/* Fitness Tools Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h4" gutterBottom>
                Fitness Assessment Tools
              </Typography>
              <Typography variant="body1" paragraph>
                Evaluate your fitness levels, track progress, and receive personalized workout recommendations based on your goals and current fitness status.
              </Typography>
              
              {/* Include the FitnessAssessmentTool component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Fitness Assessment Tool...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/FitnessAssessmentTool')),
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
                      <Typography sx={{ ml: 2 }}>Loading Exercise Prescription Generator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/ExercisePrescriptionGenerator')),
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
                      <Typography sx={{ ml: 2 }}>Loading Mobility Assessment Tool...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/MobilityAssessmentTool')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Typography variant="h5" gutterBottom sx={{ mt: 6, mb: 3 }}>
                Fitness Tools Overview
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Cardiovascular Fitness Assessment
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Evaluate your cardiovascular fitness using validated protocols like VO2 max estimation, heart rate recovery, and submaximal exercise tests.
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
                          const fitnessSection = document.getElementById('fitness-assessment-tool');
                          if (fitnessSection) fitnessSection.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Launch Tool
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Exercise Prescription Generator
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Receive personalized exercise recommendations based on your fitness assessment results, health status, and personal goals.
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
                          const exerciseSection = document.getElementById('exercise-prescription-generator');
                          if (exerciseSection) exerciseSection.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Launch Tool
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Mobility Assessment Tool
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Evaluate joint mobility, flexibility, and movement patterns to identify potential areas for improvement and reduce injury risk.
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
                          const mobilitySection = document.getElementById('mobility-assessment-tool');
                          if (mobilitySection) mobilitySection.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Launch Tool
                      </Button>
                    </Box>
                  </Card>
                </Grid>
                
                <Grid item xs={12} md={6}>
                  <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" component="h3" gutterBottom>
                        Recovery Optimization Tool
                      </Typography>
                      <Typography variant="body2" paragraph>
                        Analyze your training load, sleep quality, and recovery metrics to optimize performance and prevent overtraining.
                      </Typography>
                      <Box 
                        sx={{ 
                          display: 'inline-block', 
                          bgcolor: 'rgba(128, 128, 128, 0.08)', 
                          px: 1.5, 
                          py: 0.5, 
                          borderRadius: 1,
                          mt: 'auto'
                        }}
                      >
                        <Typography variant="caption" fontWeight="medium" color="text.secondary">
                          Status: Coming Soon
                        </Typography>
                      </Box>
                    </CardContent>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <Button 
                        variant="outlined" 
                        fullWidth 
                        disabled
                      >
                        Coming Soon
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Health Quiz Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h4" gutterBottom>
                Health Knowledge Quiz
              </Typography>
              <Typography variant="body1" paragraph>
                Test your knowledge about health biomarkers, disease prevention, and wellness strategies with our interactive quiz. Choose from multiple difficulty levels ranging from beginner to expert.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Health Quiz...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/HealthQuiz')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
            </TabPanel>
            
            {/* Nutrition Tools Tab */}
            <TabPanel value={activeTab} index={4}>
              <Typography variant="h4" gutterBottom>
                Nutrition Analysis Tools
              </Typography>
              <Typography variant="body1" paragraph>
                Professional-grade tools for analyzing your diet, identifying nutritional gaps, and creating personalized nutrition plans based on your health goals.
              </Typography>
              
              <Box sx={{ mt: 2, mb: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4, height: 200 }}>
                      <CircularProgress size={40} />
                      <Typography sx={{ ml: 2 }}>Loading Nutrition Analyzer...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/health/NutritionAnalyzer')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h5" gutterBottom>
                Additional Nutrition Tools
              </Typography>
              
              <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <LocalHospitalIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Therapeutic Diet Planner
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Create specialized meal plans for specific health conditions including diabetes, cardiovascular disease, autoimmune conditions, and weight management.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                      Status: In Development • Expected Q2 2025
                    </Typography>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <MedicationIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Supplement Analyzer
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Evaluate dietary supplements for quality, evidence base, potential interactions with medications, and personalized recommendations based on your health status.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'success.main', fontWeight: 'bold' }}>
                      Status: Available Now
                    </Typography>
                    <Button 
                      variant="outlined" 
                      color="primary"
                      sx={{ mt: 1 }}
                      onClick={() => {
                        const supplementSection = document.getElementById('supplement-analyzer');
                        if (supplementSection) supplementSection.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Launch Tool
                    </Button>
                  </Paper>
                </Grid>
                
                <Grid item xs={12} md={4}>
                  <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <BiotechIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                      <Typography variant="h5" component="h3">
                        Nutrigenomics Interpreter
                      </Typography>
                    </Box>
                    <Typography variant="body2" paragraph>
                      Upload your genetic data and receive personalized nutrition recommendations based on your genetic profile, including optimal macronutrient ratios and potential nutrient sensitivities.
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ color: 'text.secondary' }}>
                      Status: Planning phase • Expected Q3 2025
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
                  <MonitorHeartIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Educational Purpose
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Our health resources are designed for educational purposes, providing individuals and health professionals with interactive tools to better understand health biomarkers and optimization strategies.
                </Typography>
                <Typography variant="body2">
                  All calculators and tools are based on scientific research and provide general guidance, but should not replace medical advice or professional healthcare services.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <BiotechIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Evidence-Based Approach
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Our health tools are developed using evidence-based methodologies and current scientific literature to provide the most accurate and reliable information possible.
                </Typography>
                <Typography variant="body2">
                  We regularly update our calculators and resources to reflect new research findings and clinical guidelines in the rapidly evolving field of health optimization.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default HealthPage;