import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Grid,
  Chip,
  Button,
  Skeleton,
  Tabs,
  Tab,
  Divider,
  Paper,
  IconButton,
  useTheme
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import ShareIcon from '@mui/icons-material/Share';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

// News data - in a real app, this would come from an API
const NEWS_DATA = [
  {
    id: 1,
    title: "New Advancements in 5G mmWave Antenna Technology",
    summary: "Researchers have developed a new compact phased array antenna design that offers improved performance for 5G mmWave applications.",
    date: "2025-02-15",
    image: "https://source.unsplash.com/random/800x600/?antenna,technology",
    category: "Technology",
    readingTime: "5 min read"
  },
  {
    id: 2,
    title: "The Future of Automotive Radar Systems",
    summary: "Next-generation automotive radar systems are incorporating AI and machine learning for improved object recognition and classification.",
    date: "2025-02-10",
    image: "https://source.unsplash.com/random/800x600/?radar,car",
    category: "Automotive",
    readingTime: "8 min read"
  },
  {
    id: 3,
    title: "RF Design Considerations for IoT Devices",
    summary: "Designing effective RF systems for IoT applications requires balancing power consumption, range, and performance.",
    date: "2025-02-05",
    image: "https://source.unsplash.com/random/800x600/?iot,wireless",
    category: "IoT",
    readingTime: "6 min read"
  },
  {
    id: 4,
    title: "Advancements in Satellite Communication Antennas",
    summary: "New developments in satellite communication antennas are enabling higher data rates and improved connectivity for remote locations.",
    date: "2025-01-28",
    image: "https://source.unsplash.com/random/800x600/?satellite,space",
    category: "Space",
    readingTime: "7 min read"
  },
  {
    id: 5,
    title: "RF Testing Challenges for Modern Wireless Devices",
    summary: "The increasing complexity of wireless devices creates new challenges for RF testing and validation.",
    date: "2025-01-20",
    image: "https://source.unsplash.com/random/800x600/?testing,electronics",
    category: "Testing",
    readingTime: "4 min read"
  }
];

// Technical resources data
const RESOURCES_DATA = [
  {
    id: 1,
    title: "RF Design Handbook",
    type: "Ebook",
    description: "Comprehensive guide to RF circuit design principles and practices for engineers.",
    downloadUrl: "#",
    image: "https://source.unsplash.com/random/800x600/?book,electronics"
  },
  {
    id: 2,
    title: "Antenna Design Calculator",
    type: "Tool",
    description: "Interactive tool for calculating antenna parameters and optimizing designs.",
    downloadUrl: "#",
    image: "https://source.unsplash.com/random/800x600/?calculator,engineering"
  },
  {
    id: 3,
    title: "Introduction to Radar Systems",
    type: "Webinar",
    description: "Recorded webinar covering the fundamentals of radar system design and operation.",
    downloadUrl: "#",
    image: "https://source.unsplash.com/random/800x600/?webinar,presentation"
  },
  {
    id: 4,
    title: "RF Measurement Best Practices",
    type: "Whitepaper",
    description: "Technical paper on best practices for accurate RF measurements and testing.",
    downloadUrl: "#",
    image: "https://source.unsplash.com/random/800x600/?document,measurement"
  }
];

// Events data
const EVENTS_DATA = [
  {
    id: 1,
    title: "International RF & Microwave Conference",
    date: "2025-04-15",
    location: "San Francisco, CA",
    description: "Annual conference featuring the latest research and developments in RF and microwave technology.",
    registrationUrl: "#"
  },
  {
    id: 2,
    title: "Advanced Antenna Design Workshop",
    date: "2025-05-10",
    location: "Virtual Event",
    description: "Hands-on workshop covering advanced antenna design techniques and optimization methods.",
    registrationUrl: "#"
  },
  {
    id: 3,
    title: "RF Testing & Compliance Symposium",
    date: "2025-06-22",
    location: "Boston, MA",
    description: "Industry symposium focused on RF testing methodologies and regulatory compliance.",
    registrationUrl: "#"
  }
];

function RFNewsSection() {
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);
  const [savedArticles, setSavedArticles] = useState([]);
  const theme = useTheme();
  
  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const toggleSaveArticle = (articleId) => {
    if (savedArticles.includes(articleId)) {
      setSavedArticles(savedArticles.filter(id => id !== articleId));
    } else {
      setSavedArticles([...savedArticles, articleId]);
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <Paper elevation={0} sx={{ py: 4 }}>
      <Typography variant="h4" component="h2" align="center" gutterBottom>
        News & Resources
      </Typography>
      <Typography variant="subtitle1" align="center" color="textSecondary" paragraph sx={{ mb: 4 }}>
        Stay updated on the latest RF engineering trends, technology, and events
      </Typography>
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          centered
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab label="Latest News" />
          <Tab label="Technical Resources" />
          <Tab label="Upcoming Events" />
        </Tabs>
      </Box>
      
      {/* Latest News Tab */}
      <Box role="tabpanel" hidden={tabValue !== 0} id="tabpanel-news">
        {tabValue === 0 && (
          <Grid container spacing={3}>
            {/* Featured Article */}
            <Grid item xs={12}>
              {loading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : (
                <Card sx={{ display: { xs: 'block', md: 'flex' }, height: { md: 300 } }}>
                  <CardMedia
                    component="img"
                    sx={{ width: { xs: '100%', md: '40%' }, height: { xs: 200, md: '100%' } }}
                    image={NEWS_DATA[0].image}
                    alt={NEWS_DATA[0].title}
                  />
                  <CardContent sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Chip label={NEWS_DATA[0].category} color="primary" size="small" />
                      <Box>
                        <IconButton 
                          size="small" 
                          onClick={() => toggleSaveArticle(NEWS_DATA[0].id)}
                          color={savedArticles.includes(NEWS_DATA[0].id) ? 'primary' : 'default'}
                        >
                          {savedArticles.includes(NEWS_DATA[0].id) ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                        </IconButton>
                        <IconButton size="small">
                          <ShareIcon />
                        </IconButton>
                      </Box>
                    </Box>
                    
                    <Typography variant="h5" component="h3" gutterBottom sx={{ mt: 1 }}>
                      {NEWS_DATA[0].title}
                    </Typography>
                    
                    <Typography variant="body1" paragraph sx={{ flex: 1 }}>
                      {NEWS_DATA[0].summary}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CalendarTodayIcon fontSize="small" sx={{ mr: 1 }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(NEWS_DATA[0].date)} • {NEWS_DATA[0].readingTime}
                        </Typography>
                      </Box>
                      
                      <Button 
                        endIcon={<ArrowForwardIcon />} 
                        color="primary"
                        onClick={() => {
                          // In a real application, this would link to the article page
                          alert(`You would be redirected to read the full article: ${NEWS_DATA[0].title}`);
                        }}
                      >
                        Read More
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Grid>
            
            {/* Other Articles */}
            {NEWS_DATA.slice(1).map((article) => (
              <Grid item xs={12} sm={6} md={3} key={article.id}>
                {loading ? (
                  <Box>
                    <Skeleton variant="rectangular" height={140} />
                    <Skeleton variant="text" height={40} sx={{ mt: 1 }} />
                    <Skeleton variant="text" height={60} />
                    <Skeleton variant="text" width="60%" />
                  </Box>
                ) : (
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardMedia
                      component="img"
                      height={140}
                      image={article.image}
                      alt={article.title}
                    />
                    <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                        <Chip label={article.category} color="primary" size="small" />
                        <IconButton 
                          size="small" 
                          onClick={() => toggleSaveArticle(article.id)}
                          color={savedArticles.includes(article.id) ? 'primary' : 'default'}
                        >
                          {savedArticles.includes(article.id) ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
                        </IconButton>
                      </Box>
                      
                      <Typography variant="subtitle1" component="h3" gutterBottom>
                        {article.title}
                      </Typography>
                      
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1, flex: 1 }}>
                        {article.summary.length > 100 ? article.summary.slice(0, 100) + '...' : article.summary}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                        <Typography variant="caption" color="text.secondary">
                          {formatDate(article.date)}
                        </Typography>
                        <Button 
                          size="small" 
                          color="primary"
                          onClick={() => {
                            // In a real application, this would link to the article page
                            alert(`You would be redirected to read the article: ${article.title}`);
                          }}
                        >
                          Read
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            ))}
            
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                endIcon={<ArrowForwardIcon />}
                onClick={() => {
                  // In a real application, this would link to the articles page
                  alert('You would be redirected to the complete articles archive page');
                }}
              >
                View All Articles
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Technical Resources Tab */}
      <Box role="tabpanel" hidden={tabValue !== 1} id="tabpanel-resources">
        {tabValue === 1 && (
          <Grid container spacing={3}>
            {RESOURCES_DATA.map((resource) => (
              <Grid item xs={12} sm={6} key={resource.id}>
                {loading ? (
                  <Skeleton variant="rectangular" height={200} />
                ) : (
                  <Card sx={{ display: 'flex', height: '100%' }}>
                    <CardMedia
                      component="img"
                      sx={{ width: 150 }}
                      image={resource.image}
                      alt={resource.title}
                    />
                    <CardContent sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Chip 
                          label={resource.type} 
                          color={
                            resource.type === 'Ebook' ? 'primary' : 
                            resource.type === 'Tool' ? 'secondary' :
                            resource.type === 'Webinar' ? 'success' : 'info'
                          } 
                          size="small" 
                        />
                      </Box>
                      
                      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 1 }}>
                        {resource.title}
                      </Typography>
                      
                      <Typography variant="body2" paragraph sx={{ flex: 1 }}>
                        {resource.description}
                      </Typography>
                      
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="small"
                        sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                        onClick={() => {
                          // In a real application, this would download the resource or open the tool
                          alert(`You would ${resource.type === 'Tool' ? 'access' : 'download'} the ${resource.type}: ${resource.title}`);
                        }}
                      >
                        {resource.type === 'Tool' ? 'Access Tool' : 'Download'}
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            ))}
            
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                endIcon={<ArrowForwardIcon />}
              >
                View Resource Library
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
      
      {/* Upcoming Events Tab */}
      <Box role="tabpanel" hidden={tabValue !== 2} id="tabpanel-events">
        {tabValue === 2 && (
          <Grid container spacing={3}>
            {EVENTS_DATA.map((event) => (
              <Grid item xs={12} key={event.id}>
                {loading ? (
                  <Skeleton variant="rectangular" height={120} />
                ) : (
                  <Card sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' } }}>
                    <Box
                      sx={{
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: { xs: '100%', sm: 150 },
                        textAlign: 'center'
                      }}
                    >
                      <Typography variant="subtitle1">
                        {formatDate(event.date).split(' ')[0]}
                      </Typography>
                      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        {formatDate(event.date).split(' ')[1].replace(',', '')}
                      </Typography>
                      <Typography variant="subtitle1">
                        {formatDate(event.date).split(' ')[2]}
                      </Typography>
                    </Box>
                    
                    <CardContent sx={{ flex: '1 1 auto', display: 'flex', flexDirection: 'column' }}>
                      <Typography variant="h6" component="h3" gutterBottom>
                        {event.title}
                      </Typography>
                      
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        {event.location}
                      </Typography>
                      
                      <Typography variant="body2" paragraph>
                        {event.description}
                      </Typography>
                      
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small"
                        sx={{ alignSelf: 'flex-start', mt: 'auto' }}
                        onClick={() => {
                          // In a real application, this would open the registration page
                          alert(`You would be redirected to register for: ${event.title} on ${formatDate(event.date)}`);
                        }}
                      >
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </Grid>
            ))}
            
            <Grid item xs={12} sx={{ textAlign: 'center', mt: 2 }}>
              <Button 
                variant="outlined" 
                color="primary"
                endIcon={<ArrowForwardIcon />}
              >
                View All Events
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Paper>
  );
}

export default RFNewsSection;