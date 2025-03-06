import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions,
  Paper,
  Divider,
  Chip,
  Avatar
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import WifiTetheringIcon from '@mui/icons-material/WifiTethering';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';
import RadarIcon from '@mui/icons-material/Radar';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import EngineeringIcon from '@mui/icons-material/Engineering';
import WorkIcon from '@mui/icons-material/Work';
import GradeIcon from '@mui/icons-material/Grade';
import BuildIcon from '@mui/icons-material/Build';

// Import components
import ProjectRequestForm from '../components/ProjectRequestForm';
import RFNewsSection from '../components/RFNewsSection';
import RFCalculator from '../components/RFCalculator';
import LiveDataMonitor from '../components/LiveDataMonitor';

function HomePage() {
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  
  const handleOpenProjectForm = () => {
    setProjectFormOpen(true);
  };
  
  const handleCloseProjectForm = () => {
    setProjectFormOpen(false);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 10 },
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("https://source.unsplash.com/random/1600x900/?antenna,technology")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
            Advanced RF & Antenna Solutions
          </Typography>
          <Typography variant="h5" paragraph>
            Cutting-edge RF, antenna, and radar design for the next generation of wireless technology
          </Typography>
          <Box mt={4}>
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              onClick={handleOpenProjectForm}
              sx={{ mr: 2, mb: 2, px: 3, py: 1.2 }}
            >
              Start Your Project
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large" 
              component={RouterLink} 
              to="/services"
              sx={{ mb: 2, px: 3 }}
            >
              Our Services
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 5, justifyContent: { xs: 'center', md: 'flex-start' } }}>
            <Chip 
              label="5G Technology" 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }} 
            />
            <Chip 
              label="Phased Arrays" 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }} 
            />
            <Chip 
              label="MIMO Systems" 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }} 
            />
            <Chip 
              label="Radar Design" 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }} 
            />
            <Chip 
              label="IoT Connectivity" 
              sx={{ bgcolor: 'rgba(255, 255, 255, 0.15)', color: 'white', '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.25)' } }} 
            />
          </Box>
        </Container>
      </Box>
      
      {/* Project Request Form Dialog */}
      <ProjectRequestForm open={projectFormOpen} onClose={handleCloseProjectForm} />

      {/* Services Overview */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" align="center" gutterBottom>
          Our Expertise
        </Typography>
        <Typography variant="h6" align="center" color="textSecondary" paragraph>
          Comprehensive solutions for RF, antenna, and radar engineering challenges
        </Typography>
        
        <Grid container spacing={4} mt={4}>
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <WifiTetheringIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  RF Design
                </Typography>
                <Typography>
                  Specialized in RF circuit design, amplifiers, filters, and mixers for telecommunications, 
                  aerospace, and defense applications.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" component={RouterLink} to="/services">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <NetworkCheckIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Antenna Design
                </Typography>
                <Typography>
                  Expertise in antenna arrays, microstrip antennas, horn antennas, and custom 
                  antenna solutions for complex propagation environments.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" component={RouterLink} to="/services">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ p: 2, display: 'flex', justifyContent: 'center' }}>
                <RadarIcon color="primary" sx={{ fontSize: 60 }} />
              </Box>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                  Radar Systems
                </Typography>
                <Typography>
                  Design and optimization of radar systems for detection, tracking, and imaging applications
                  in various sectors including automotive, marine, and security.
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" component={RouterLink} to="/services">
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* Featured Projects */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Featured Projects
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph>
            Explore some of our recent engineering successes
          </Typography>

          <Grid container spacing={4} mt={4}>
            {[1, 2, 3].map((item) => (
              <Grid item key={item} xs={12} md={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={`https://source.unsplash.com/random/400x200/?antenna,radar,electronics,${item}`}
                    alt={`Project ${item}`}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      Project {item}
                    </Typography>
                    <Typography>
                      {item === 1 && "5G Antenna Array for Urban Deployment"}
                      {item === 2 && "Automotive Radar System for Collision Avoidance"}
                      {item === 3 && "Satellite Communication System with Beam Forming"}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" color="primary" component={RouterLink} to="/projects">
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Why Choose Us Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Why Choose Us
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
            Partner with a team of RF engineers who deliver excellence at every stage
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <EngineeringIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Expert Engineering Team</Typography>
                <Typography>
                  Our team comprises Ph.D. level engineers with decades of combined experience in RF, antenna, and radar design.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <BuildIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Cutting-Edge Equipment</Typography>
                <Typography>
                  Access to state-of-the-art test equipment, simulation tools, and prototyping facilities.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <GradeIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Proven Track Record</Typography>
                <Typography>
                  Successfully delivered over 150 projects across telecommunications, aerospace, automotive, and defense industries.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <WorkIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6" gutterBottom>End-to-End Solutions</Typography>
                <Typography>
                  From concept and design to prototyping, testing, and production support, we handle all aspects of your RF project.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <SchoolIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Research Partnerships</Typography>
                <Typography>
                  Collaborations with leading universities and research institutions keeps us at the forefront of RF technology.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper elevation={2} sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <AssignmentIcon color="primary" sx={{ fontSize: 50, mb: 2 }} />
                <Typography variant="h6" gutterBottom>Custom Approach</Typography>
                <Typography>
                  Tailored solutions that precisely match your requirements rather than one-size-fits-all approaches.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Client Testimonials Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Client Testimonials
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
            What our clients say about working with us
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>TC</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Tom Chen
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      CTO, NextGen Communications
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph>
                  "RF Solutions helped us develop a custom antenna array for our 5G infrastructure that outperformed all competitive solutions. Their expertise saved us months of development time."
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>SD</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Sarah Davis
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Project Manager, Aerospace Systems Inc.
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph>
                  "The radar system designed by RF Solutions exceeded our specifications and performed flawlessly in field tests. Their attention to detail and commitment to excellence is unmatched."
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <Paper elevation={3} sx={{ p: 4, height: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>MJ</Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Michael Johnson
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Lead Engineer, AutoTech Innovations
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body1" paragraph>
                  "Working with RF Solutions on our automotive radar module was a seamless experience. Their team's expertise in RF design and signal processing was evident throughout the project."
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* Interactive Tools Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.100' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" component="h2" align="center" gutterBottom>
            Interactive RF Tools
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary" paragraph sx={{ mb: 6 }}>
            Try our engineering tools for RF system design and analysis
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={12}>
              <LiveDataMonitor />
            </Grid>
            
            <Grid item xs={12} md={12} sx={{ mt: 4 }}>
              <RFCalculator />
            </Grid>
          </Grid>
        </Container>
      </Box>
      
      {/* News & Resources Section */}
      <Box sx={{ py: 8, bgcolor: 'grey.50' }}>
        <Container maxWidth="lg">
          <RFNewsSection />
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="md">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 600 }}>
            Ready to Start Your RF Project?
          </Typography>
          <Typography variant="h6" align="center" paragraph sx={{ mb: 4 }}>
            Our team of experienced engineers is ready to help you design and implement your next RF solution.
          </Typography>
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
            <Button 
              variant="contained" 
              color="secondary" 
              size="large" 
              onClick={handleOpenProjectForm}
              sx={{ px: 4, py: 1.5 }}
            >
              Submit Project Request
            </Button>
            <Button 
              variant="outlined" 
              color="inherit" 
              size="large" 
              component={RouterLink} 
              to="/contact"
              sx={{ px: 4, py: 1.5 }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default HomePage;