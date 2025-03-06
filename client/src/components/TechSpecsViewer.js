import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Chip,
  Button,
  Divider,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  List,
  ListItem,
  ListItemText,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import GetAppIcon from '@mui/icons-material/GetApp';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import FeedbackIcon from '@mui/icons-material/Feedback';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`specs-tabpanel-${index}`}
      aria-labelledby={`specs-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function TechSpecsViewer({ product = null }) {
  const [tabValue, setTabValue] = useState(0);
  const [compareDialogOpen, setCompareDialogOpen] = useState(false);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  // Default product data if none provided
  const defaultProduct = {
    id: "rf-analyzer-pro",
    name: "RF Signal Analyzer Pro",
    category: "Test Equipment",
    specs: {
      general: [
        { name: "Model Number", value: "RSA-5500" },
        { name: "Dimensions (W×H×D)", value: "320 × 177 × 413 mm" },
        { name: "Weight", value: "12.5 kg" },
        { name: "Power Consumption", value: "250 W max" },
        { name: "Operating Temperature", value: "0 to 40°C" },
        { name: "Storage Temperature", value: "-20 to 70°C" },
        { name: "Humidity", value: "5% to 95%, non-condensing" },
        { name: "Display", value: "10.1-inch multi-touch display, 1920 × 1200 resolution" },
        { name: "Interface", value: "USB 3.0, LAN (1000Base-T), HDMI, GPIB (optional)" },
        { name: "Compliance", value: "CE, RoHS, FCC Class A" }
      ],
      rf: [
        { name: "Frequency Range", value: "9 kHz to 44 GHz" },
        { name: "Frequency Resolution", value: "0.01 Hz" },
        { name: "Phase Noise", value: "-110 dBc/Hz at 10 kHz offset" },
        { name: "Amplitude Range", value: "-170 to +30 dBm" },
        { name: "Amplitude Accuracy", value: "±0.5 dB" },
        { name: "DANL (Displayed Average Noise Level)", value: "-167 dBm/Hz" },
        { name: "RBW (Resolution Bandwidth)", value: "1 Hz to 8 MHz" },
        { name: "Real-time Bandwidth", value: "160 MHz" },
        { name: "Input VSWR", value: "1.5:1 nominal" }
      ],
      analysis: [
        { name: "Spectrum Analysis", value: "Standard" },
        { name: "Real-time Spectrum Analysis", value: "Standard" },
        { name: "Signal Demodulation", value: "AM, FM, PM, ASK, FSK, PSK, QAM" },
        { name: "Vector Signal Analysis", value: "Optional" },
        { name: "EMI Pre-compliance", value: "Optional" },
        { name: "Pulse Analysis", value: "Optional" },
        { name: "Noise Figure Measurement", value: "Optional" },
        { name: "Phase Noise Measurement", value: "Optional" }
      ],
      triggering: [
        { name: "Trigger Sources", value: "Free Run, Video, External, RF Burst, Frame" },
        { name: "Trigger Types", value: "Edge, Level, Slew Rate" },
        { name: "Frequency Mask Trigger", value: "Standard" },
        { name: "Time Gating", value: "Standard" }
      ]
    },
    comparisonProducts: [
      { id: "rsa-3500", name: "RF Signal Analyzer 3500", priceCategory: "Entry-level" },
      { id: "rsa-7500", name: "RF Signal Analyzer 7500", priceCategory: "High-end" }
    ],
    documents: [
      { type: "Datasheet", filename: "RF_Analyzer_Pro_Datasheet.pdf", size: "2.4 MB" },
      { type: "User Manual", filename: "RF_Analyzer_Pro_Manual.pdf", size: "8.7 MB" },
      { type: "Application Note", filename: "5G_Signal_Analysis.pdf", size: "1.5 MB" },
      { type: "Calibration Guide", filename: "Calibration_Procedure.pdf", size: "3.2 MB" }
    ]
  };

  const productData = product || defaultProduct;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleOpenCompareDialog = () => {
    setCompareDialogOpen(true);
  };

  const handleCloseCompareDialog = () => {
    setCompareDialogOpen(false);
  };

  const handleOpenFeedbackDialog = () => {
    setFeedbackDialogOpen(true);
  };

  const handleCloseFeedbackDialog = () => {
    setFeedbackDialogOpen(false);
    // Reset feedback form if closed without submitting
    if (!feedbackSubmitted) {
      setFeedbackRating(5);
      setFeedbackText('');
    }
  };

  const handleSubmitFeedback = () => {
    // In a real app, you would send this data to your backend
    console.log('Feedback submitted:', { rating: feedbackRating, text: feedbackText });
    setFeedbackSubmitted(true);
    // Close dialog after a short delay to show the success message
    setTimeout(() => {
      setFeedbackDialogOpen(false);
      // Reset for next time
      setFeedbackRating(5);
      setFeedbackText('');
      setFeedbackSubmitted(false);
    }, 1500);
  };

  // Common styling for specification tables
  const tableStyles = {
    "& .MuiTableCell-head": {
      backgroundColor: "primary.main",
      color: "white",
      fontWeight: "bold"
    },
    "& .MuiTableRow-root:nth-of-type(even)": {
      backgroundColor: "action.hover"
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', p: 2 }}>
        <Typography variant="h5" component="h3" align="center">
          Technical Specifications
        </Typography>
        <Typography variant="subtitle1" align="center">
          {productData.name}
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="specification tabs"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="General" />
          <Tab label="RF Specifications" />
          <Tab label="Analysis Features" />
          <Tab label="Triggering" />
          <Tab label="Documents" />
        </Tabs>
      </Box>

      {/* General Specifications */}
      <TabPanel value={tabValue} index={0}>
        <TableContainer>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Specification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData.specs.general.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* RF Specifications */}
      <TabPanel value={tabValue} index={1}>
        <TableContainer>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Specification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData.specs.rf.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Analysis Features */}
      <TabPanel value={tabValue} index={2}>
        <TableContainer>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Feature</TableCell>
                <TableCell>Availability</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData.specs.analysis.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell>
                    {row.value === 'Standard' ? (
                      <Chip color="success" size="small" label="Standard" />
                    ) : row.value === 'Optional' ? (
                      <Chip color="primary" size="small" label="Optional" />
                    ) : (
                      row.value
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Triggering */}
      <TabPanel value={tabValue} index={3}>
        <TableContainer>
          <Table sx={tableStyles}>
            <TableHead>
              <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Specification</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData.specs.triggering.map((row, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">{row.name}</TableCell>
                  <TableCell>{row.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      {/* Documents */}
      <TabPanel value={tabValue} index={4}>
        <List>
          {productData.documents.map((doc, index) => (
            <ListItem
              key={index}
              divider={index < productData.documents.length - 1}
              secondaryAction={
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<GetAppIcon />}
                  onClick={() => alert(`Download ${doc.filename} started!`)}
                >
                  Download
                </Button>
              }
            >
              <ListItemText
                primary={
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <PictureAsPdfIcon color="error" sx={{ mr: 1 }} />
                    <Typography variant="subtitle1">{doc.type}</Typography>
                  </Box>
                }
                secondary={`${doc.filename} (${doc.size})`}
              />
            </ListItem>
          ))}
        </List>
      </TabPanel>

      {/* Action buttons */}
      <Divider />
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, p: 2 }}>
        <Button
          variant="outlined"
          startIcon={<CompareArrowsIcon />}
          onClick={handleOpenCompareDialog}
        >
          Compare Models
        </Button>
        <Button
          variant="outlined"
          startIcon={<FeedbackIcon />}
          onClick={handleOpenFeedbackDialog}
        >
          Product Feedback
        </Button>
      </Box>

      {/* Product Comparison Dialog */}
      <Dialog
        open={compareDialogOpen}
        onClose={handleCloseCompareDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Product Comparison</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" gutterBottom>
            {productData.name} vs Other Models
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Feature</TableCell>
                  <TableCell sx={{ bgcolor: 'primary.light', color: 'white' }}>
                    {productData.name}
                  </TableCell>
                  {productData.comparisonProducts.map((product, index) => (
                    <TableCell key={index}>{product.name}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow>
                  <TableCell>Price Category</TableCell>
                  <TableCell>Professional</TableCell>
                  {productData.comparisonProducts.map((product, index) => (
                    <TableCell key={index}>{product.priceCategory}</TableCell>
                  ))}
                </TableRow>
                <TableRow>
                  <TableCell>Frequency Range</TableCell>
                  <TableCell>9 kHz to 44 GHz</TableCell>
                  <TableCell>9 kHz to 26.5 GHz</TableCell>
                  <TableCell>9 kHz to 50 GHz</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Real-time Bandwidth</TableCell>
                  <TableCell>160 MHz</TableCell>
                  <TableCell>85 MHz</TableCell>
                  <TableCell>320 MHz</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>DANL</TableCell>
                  <TableCell>-167 dBm/Hz</TableCell>
                  <TableCell>-155 dBm/Hz</TableCell>
                  <TableCell>-172 dBm/Hz</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Analysis Features</TableCell>
                  <TableCell>Comprehensive</TableCell>
                  <TableCell>Basic</TableCell>
                  <TableCell>Advanced</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Detailed Comparison
            </Typography>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Performance Features</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" paragraph>
                  The RF Signal Analyzer Pro offers a balance of performance and value, with specifications that meet most professional testing requirements. The RSA-3500 is our entry-level model with good basic functionality, while the RSA-7500 represents our flagship offering with the highest performance specifications.
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                  <Chip label="Phase Noise" size="small" color="primary" />
                  <Chip label="DANL" size="small" color="primary" />
                  <Chip label="Dynamic Range" size="small" color="primary" />
                </Stack>
                <Typography variant="body2">
                  All models feature low phase noise, excellent displayed average noise level (DANL), and wide dynamic range, with progressive improvements as you move up the product line.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Analysis Capabilities</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  The RF Signal Analyzer Pro includes all standard analysis features plus several advanced options. The RSA-7500 includes all available analysis packages as standard, while the RSA-3500 offers basic analysis with optional upgrades.
                </Typography>
              </AccordionDetails>
            </Accordion>
            
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Hardware Specifications</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2">
                  All models feature similar physical dimensions with the Pro model offering the best balance of performance and portability. The RSA-7500 is slightly larger and heavier due to additional hardware for enhanced performance.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompareDialog}>Close</Button>
          <Button 
            variant="contained" 
            onClick={() => {
              alert('Full comparison sheet download started!');
              handleCloseCompareDialog();
            }}
          >
            Download Full Comparison
          </Button>
        </DialogActions>
      </Dialog>

      {/* Feedback Dialog */}
      <Dialog
        open={feedbackDialogOpen}
        onClose={handleCloseFeedbackDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Product Feedback</DialogTitle>
        <DialogContent>
          {feedbackSubmitted ? (
            <Box sx={{ textAlign: 'center', py: 3 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60, mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Thank you for your feedback!
              </Typography>
              <Typography variant="body1">
                Your input helps us improve our products.
              </Typography>
            </Box>
          ) : (
            <>
              <Typography variant="body1" gutterBottom sx={{ mt: 1 }}>
                We value your opinion about the {productData.name}. Please share your feedback with us.
              </Typography>
              
              <Box sx={{ my: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>
                  How would you rate this product?
                </Typography>
                <Rating
                  value={feedbackRating}
                  onChange={(event, newValue) => {
                    setFeedbackRating(newValue);
                  }}
                  size="large"
                />
              </Box>
              
              <TextField
                label="Your feedback (optional)"
                multiline
                rows={4}
                fullWidth
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Please share your experience with this product..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </>
          )}
        </DialogContent>
        {!feedbackSubmitted && (
          <DialogActions>
            <Button onClick={handleCloseFeedbackDialog}>Cancel</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmitFeedback}
              disabled={!feedbackRating}
            >
              Submit Feedback
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Paper>
  );
}

export default TechSpecsViewer;