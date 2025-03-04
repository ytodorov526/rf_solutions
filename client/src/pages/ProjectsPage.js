import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Divider,
  Tab,
  Tabs,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

// Sample project data
const projects = [
  {
    id: 1,
    title: '5G Antenna Array for Urban Deployment',
    image: 'https://source.unsplash.com/random/800x600/?antenna,5g',
    summary: 'Advanced 5G antenna array design for high-density urban environments',
    description: 'This project involved the design and implementation of a compact MIMO antenna array for 5G infrastructure deployment in dense urban environments. The solution achieved excellent coverage while minimizing visual impact and power consumption.',
    technologies: ['5G', 'MIMO', 'Antenna Array', 'Urban RF Propagation'],
    category: 'Telecommunications',
    results: 'The deployed antenna arrays increased network capacity by 300% while reducing energy consumption by 25% compared to traditional solutions.'
  },
  {
    id: 2,
    title: 'Automotive Radar System for ADAS',
    image: 'https://source.unsplash.com/random/800x600/?radar,automotive',
    summary: 'High-resolution radar system for advanced driver assistance systems',
    description: 'Developed a 77 GHz FMCW radar system for automotive applications with enhanced resolution and range capabilities. The system was designed to detect and classify multiple objects in complex traffic scenarios for advanced driver assistance systems.',
    technologies: ['77 GHz FMCW Radar', 'Signal Processing', 'ADAS', 'Object Classification'],
    category: 'Automotive',
    results: 'The radar system achieved 0.5° angular resolution and 15cm range resolution, significantly improving obstacle detection in poor visibility conditions.'
  },
  {
    id: 3,
    title: 'Satellite Communication Ground Terminal',
    image: 'https://source.unsplash.com/random/800x600/?satellite,communication',
    summary: 'High-throughput ground terminal for satellite communications',
    description: 'Designed a high-throughput ground terminal with advanced tracking capabilities for LEO satellite constellations. The system featured adaptive beamforming and automated tracking to maintain optimal connectivity with satellites.',
    technologies: ['Satellite Communications', 'Beam Steering', 'Ka-band', 'Signal Processing'],
    category: 'Space',
    results: 'The ground terminal achieved data rates of up to 1.2 Gbps with 99.9% link reliability, even during atmospheric disturbances.'
  },
  {
    id: 4,
    title: 'IoT Mesh Network RF Architecture',
    image: 'https://source.unsplash.com/random/800x600/?iot,network',
    summary: 'Scalable RF architecture for industrial IoT mesh networks',
    description: 'Developed a robust RF architecture for industrial IoT mesh networks operating in challenging environments. The solution incorporated spectrum sensing and dynamic channel selection to mitigate interference.',
    technologies: ['IoT', 'Mesh Networks', 'Sub-GHz RF', 'Spectrum Sensing'],
    category: 'Industrial',
    results: 'The mesh network successfully connected over 500 nodes across a 2 km² industrial facility with 99.7% message delivery rate and 5+ years battery life for end devices.'
  },
  {
    id: 5,
    title: 'Phased Array Weather Radar',
    image: 'https://source.unsplash.com/random/800x600/?weather,radar',
    summary: 'Advanced phased array radar for meteorological applications',
    description: 'Designed and implemented a phased array radar system for high-resolution weather monitoring. The system utilized digital beamforming to rapidly scan atmospheric conditions and detect severe weather phenomena.',
    technologies: ['Phased Array', 'Digital Beamforming', 'Doppler Processing', 'Meteorology'],
    category: 'Environmental',
    results: 'The radar system reduced scan time by 75% while improving precipitation measurement accuracy by 40% compared to traditional weather radars.'
  },
  {
    id: 6,
    title: 'Wideband Software-Defined Radio Platform',
    image: 'https://source.unsplash.com/random/800x600/?radio,electronics',
    summary: 'Flexible software-defined radio platform for research applications',
    description: 'Created a wideband software-defined radio platform for advanced research applications. The system featured direct RF sampling, FPGA-based processing, and a flexible software architecture for rapid prototyping of novel communication techniques.',
    technologies: ['SDR', 'FPGA', 'Direct RF Sampling', 'GNU Radio'],
    category: 'Research',
    results: 'The platform has been adopted by multiple research institutions for testing next-generation wireless protocols, cognitive radio techniques, and spectrum sensing algorithms.'
  },
  {
    id: 7,
    title: 'Medical Imaging RF Subsystem',
    image: 'https://source.unsplash.com/random/800x600/?medical,imaging',
    summary: 'High-performance RF subsystem for medical imaging equipment',
    description: 'Designed the RF subsystem for an advanced medical imaging device. The solution required extremely low noise performance and precise signal control to achieve the required image quality.',
    technologies: ['Medical RF', 'Low-Noise Design', 'Signal Integrity', 'MRI Technology'],
    category: 'Medical',
    results: 'The RF subsystem enabled a 30% improvement in image resolution while reducing scan times by 25%, improving patient comfort and diagnostic capabilities.'
  },
  {
    id: 8,
    title: 'Drone-Based Synthetic Aperture Radar',
    image: 'https://source.unsplash.com/random/800x600/?drone,radar',
    summary: 'Lightweight SAR system for UAV deployment',
    description: 'Developed a compact synthetic aperture radar system for deployment on medium-sized UAVs. The system was designed for terrain mapping, search and rescue, and environmental monitoring applications.',
    technologies: ['SAR', 'UAV', 'Image Processing', 'Compact RF Design'],
    category: 'Aerospace',
    results: 'The drone-based SAR system achieved 0.5m resolution imagery from an altitude of 400m, enabling rapid mapping of 10 km² per hour regardless of lighting or weather conditions.'
  }
];

function ProjectsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const [openProject, setOpenProject] = useState(null);
  
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };
  
  const handleOpenProject = (project) => {
    setOpenProject(project);
  };
  
  const handleCloseProject = () => {
    setOpenProject(null);
  };
  
  // Get unique categories for tabs
  const categories = ['all', ...new Set(projects.map(project => project.category))];
  
  // Filter projects based on selected tab
  const filteredProjects = selectedTab === 'all'
    ? projects
    : projects.filter(project => project.category === selectedTab);

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Our Engineering Projects
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Explore our portfolio of successful RF, antenna, and radar projects
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        {/* Category Tabs */}
        <Box sx={{ width: '100%', mb: 4 }}>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            {categories.map(category => (
              <Tab 
                key={category} 
                value={category} 
                label={category === 'all' ? 'All Projects' : category} 
                sx={{ textTransform: 'capitalize' }}
              />
            ))}
          </Tabs>
        </Box>
        
        {/* Projects Grid */}
        <Grid container spacing={4}>
          {filteredProjects.map((project) => (
            <Grid item key={project.id} xs={12} sm={6} md={4}>
              <Card 
                sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 8,
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleOpenProject(project)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={project.image}
                  alt={project.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ mb: 2 }}>
                    <Chip 
                      label={project.category} 
                      size="small" 
                      color="primary" 
                      sx={{ mb: 1 }}
                    />
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {project.summary}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mt: 2 }}>
                    {project.technologies.slice(0, 3).map((tech, index) => (
                      <Chip key={index} label={tech} size="small" variant="outlined" />
                    ))}
                    {project.technologies.length > 3 && (
                      <Chip label={`+${project.technologies.length - 3}`} size="small" variant="outlined" />
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Project Details Dialog */}
        {openProject && (
          <Dialog
            open={Boolean(openProject)}
            onClose={handleCloseProject}
            maxWidth="md"
            fullWidth
          >
            <DialogTitle sx={{ m: 0, p: 2 }}>
              {openProject.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseProject}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <img 
                    src={openProject.image} 
                    alt={openProject.title} 
                    style={{ width: '100%', height: 'auto', borderRadius: '4px' }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Category
                  </Typography>
                  <Chip label={openProject.category} color="primary" sx={{ mb: 2 }} />
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Technologies Used
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {openProject.technologies.map((tech, index) => (
                      <Chip key={index} label={tech} size="small" />
                    ))}
                  </Box>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Project Description
                  </Typography>
                  <Typography paragraph>
                    {openProject.description}
                  </Typography>
                  
                  <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Results & Achievements
                  </Typography>
                  <Typography paragraph>
                    {openProject.results}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseProject}>Close</Button>
              <Button variant="contained" color="primary">Request Similar Solution</Button>
            </DialogActions>
          </Dialog>
        )}
        
        {/* CTA Section */}
        <Box sx={{ mt: 8, p: 4, bgcolor: 'primary.main', color: 'white', borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Have a Challenging RF or Antenna Project?
          </Typography>
          <Typography paragraph>
            Our engineering team has the expertise to develop custom solutions for your unique requirements.
          </Typography>
          <Button variant="contained" color="secondary" size="large">
            Discuss Your Project
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ProjectsPage;