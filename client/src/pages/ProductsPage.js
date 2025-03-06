import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  CardActions, 
  Button, 
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Tabs,
  Tab
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import TechSpecsViewer from '../components/TechSpecsViewer';

// Sample product data with detailed technical specifications
const products = [
  {
    id: 1,
    name: 'RF Signal Analyzer Pro',
    image: 'https://source.unsplash.com/random/400x300/?electronics,analyzer',
    description: 'High-performance RF signal analyzer with frequency range from 9kHz to 44GHz. Features real-time spectrum analysis, advanced triggering, and intuitive touchscreen interface.',
    features: ['9kHz-44GHz range', 'Real-time analysis', 'Advanced triggering', 'Touchscreen interface'],
    category: 'Test Equipment',
    specifications: [
      { name: 'Frequency Range', value: '9 kHz to 44 GHz' },
      { name: 'Frequency Resolution', value: '0.01 Hz' },
      { name: 'Phase Noise', value: '-110 dBc/Hz at 10 kHz offset' },
      { name: 'Maximum Input Level', value: '+30 dBm (1 W)' },
      { name: 'DANL (Displayed Average Noise Level)', value: '-170 dBm/Hz' },
      { name: 'Analysis Bandwidth', value: 'Up to 800 MHz' },
      { name: 'Real-time Bandwidth', value: '400 MHz' },
      { name: 'Dynamic Range', value: '> 110 dB' },
      { name: 'Measurement Speed', value: '1 million points/second' },
      { name: 'Display', value: '12.1" Multi-touch capacitive display, 1920 x 1080 resolution' },
      { name: 'Connectivity', value: 'USB 3.0, LAN 1 GbE, GPIB, DisplayPort' },
      { name: 'Operating Temperature', value: '0°C to 50°C' },
      { name: 'Dimensions (W×H×D)', value: '435 mm × 192 mm × 460 mm' },
      { name: 'Weight', value: '15 kg' },
      { name: 'Power Consumption', value: '400 W maximum' }
    ]
  },
  {
    id: 2,
    name: 'Wideband Antenna Array',
    image: 'https://source.unsplash.com/random/400x300/?antenna,array',
    description: 'Configurable antenna array system for beamforming applications. Supports multiple frequency bands and can be customized for various deployment scenarios.',
    features: ['Configurable elements', 'Multiple frequency bands', 'Beamforming capability', 'Weatherproof design'],
    category: 'Antennas',
    specifications: [
      { name: 'Frequency Range', value: '700 MHz - 6 GHz' },
      { name: 'Number of Elements', value: '16, 32, or 64 elements (configurable)' },
      { name: 'Element Type', value: 'Dual-polarized patch antennas' },
      { name: 'Antenna Gain', value: '18 dBi (16-element), 21 dBi (32-element), 24 dBi (64-element)' },
      { name: 'Beamwidth', value: '30° to 120° (electronically adjustable)' },
      { name: 'Beam Steering Range', value: '±60° in azimuth and elevation' },
      { name: 'Polarization', value: 'Dual-linear, switchable circular' },
      { name: 'Input Impedance', value: '50 Ohms' },
      { name: 'VSWR', value: '< 1.5:1 typical' },
      { name: 'Control Interface', value: 'Ethernet, RS-485' },
      { name: 'Maximum Input Power', value: '100W per element' },
      { name: 'IP Rating', value: 'IP66' },
      { name: 'Operating Temperature', value: '-40°C to +65°C' },
      { name: 'Dimensions', value: 'Varies based on configuration' },
      { name: 'Weight', value: '12kg (16-element), 22kg (32-element), 38kg (64-element)' }
    ]
  },
  {
    id: 3,
    name: 'Compact Radar Module',
    image: 'https://source.unsplash.com/random/400x300/?radar,module',
    description: 'Compact FMCW radar module for short to medium range detection applications. Ideal for automotive, security, and industrial sensing systems.',
    features: ['24GHz FMCW radar', 'Range up to 100m', 'Low power consumption', 'Compact form factor'],
    category: 'Radar Systems',
    specifications: [
      { name: 'Radar Type', value: 'FMCW (Frequency Modulated Continuous Wave)' },
      { name: 'Operating Frequency', value: '24.05 - 24.25 GHz (ISM band)' },
      { name: 'Bandwidth', value: '200 MHz' },
      { name: 'Range', value: '0.5m to 100m' },
      { name: 'Range Resolution', value: '75 cm' },
      { name: 'Range Accuracy', value: '±10 cm' },
      { name: 'Field of View', value: '80° azimuth, 20° elevation' },
      { name: 'Angular Resolution', value: '12°' },
      { name: 'Update Rate', value: 'Up to 20 Hz' },
      { name: 'TX Power', value: '10 dBm EIRP' },
      { name: 'Sensitivity', value: '-90 dBm' },
      { name: 'Supply Voltage', value: '5V DC' },
      { name: 'Power Consumption', value: '2W (active), 100mW (idle)' },
      { name: 'Data Interface', value: 'SPI, I2C, UART, CAN (optional)' },
      { name: 'Dimensions', value: '60mm × 40mm × 10mm' },
      { name: 'Weight', value: '40g' },
      { name: 'Operating Temperature', value: '-20°C to +85°C' }
    ]
  },
  {
    id: 4,
    name: 'RF Development Kit',
    image: 'https://source.unsplash.com/random/400x300/?development,kit',
    description: 'Complete development kit for RF engineers including software-defined radio, antennas, and comprehensive documentation for rapid prototyping.',
    features: ['Software-defined radio', 'Multiple antenna options', 'Comprehensive documentation', 'Example projects'],
    category: 'Development Tools',
    specifications: [
      { name: 'SDR Frequency Range', value: '70 MHz to 6 GHz' },
      { name: 'Tuning Resolution', value: '1 Hz' },
      { name: 'RF Bandwidth', value: 'Up to 56 MHz' },
      { name: 'ADC Resolution', value: '12-bit' },
      { name: 'Sample Rate', value: 'Up to 61.44 MSPS' },
      { name: 'RF Frontend', value: 'Direct conversion' },
      { name: 'TX/RX Channels', value: '2x2 MIMO' },
      { name: 'TX Power', value: 'Up to 10 dBm (adjustable)' },
      { name: 'RX Sensitivity', value: '-110 dBm' },
      { name: 'Host Interface', value: 'USB 3.0, Gigabit Ethernet' },
      { name: 'RF Connectors', value: 'SMA female (50 Ohm)' },
      { name: 'FPGA', value: 'Xilinx Artix-7 XC7A100T' },
      { name: 'Onboard Memory', value: '2 GB DDR3' },
      { name: 'Included Antennas', value: 'Wideband omnidirectional (2), directional patch (2), dipole kit' },
      { name: 'Software Support', value: 'GNU Radio, MATLAB, Python API, Custom GUI' },
      { name: 'Example Projects', value: '15+ including spectrum analyzer, FM receiver, ADS-B decoder' },
      { name: 'Documentation', value: '500+ page user manual, API reference, application notes' },
      { name: 'Power Supply', value: '12V DC, 3A (adapter included)' },
      { name: 'Dimensions', value: '160mm × 100mm × 30mm (main unit)' },
      { name: 'Kit Contents', value: 'SDR board, enclosure, antennas, cables, adapters, SD card, carrying case' }
    ]
  },
  {
    id: 5,
    name: 'High-Power RF Amplifier',
    image: 'https://source.unsplash.com/random/400x300/?amplifier,electronics',
    description: 'High-efficiency RF power amplifier with excellent linearity. Suitable for communications infrastructure, broadcasting, and research applications.',
    features: ['High efficiency', 'Excellent linearity', 'Thermal management', 'Remote monitoring'],
    category: 'RF Components',
    specifications: [
      { name: 'Frequency Range', value: '700 MHz to 3 GHz' },
      { name: 'Output Power', value: '200W CW, 400W pulsed' },
      { name: 'Gain', value: '55 dB ±1 dB' },
      { name: 'Gain Flatness', value: '±0.5 dB across full bandwidth' },
      { name: 'Input VSWR', value: '1.5:1 maximum' },
      { name: 'Output VSWR', value: '2.0:1 maximum' },
      { name: 'Noise Figure', value: '5 dB typical' },
      { name: 'Harmonics', value: '-30 dBc typical at rated power' },
      { name: 'Non-harmonics', value: '-60 dBc typical' },
      { name: 'Intermodulation', value: '-30 dBc at rated output (two-tone)' },
      { name: 'Efficiency', value: '> 65% at rated power' },
      { name: 'Input/Output Impedance', value: '50 Ohms' },
      { name: 'RF Connectors', value: 'N-type female' },
      { name: 'Power Supply', value: '100-240V AC, 50/60 Hz' },
      { name: 'Cooling', value: 'Forced air, temperature-controlled fans' },
      { name: 'Control Interface', value: 'Ethernet, USB, RS-232' },
      { name: 'Remote Monitoring', value: 'Web interface, SNMP' },
      { name: 'Dimensions (W×H×D)', value: '483mm × 133mm × 550mm (3U rack mount)' },
      { name: 'Weight', value: '25 kg' },
      { name: 'Operating Temperature', value: '0°C to 50°C' }
    ]
  },
  {
    id: 6,
    name: 'Microwave Filter Bank',
    image: 'https://source.unsplash.com/random/400x300/?filter,microwave',
    description: 'Customizable filter bank for microwave frequency applications. Features low insertion loss and high selectivity for demanding RF environments.',
    features: ['Low insertion loss', 'High selectivity', 'Customizable passband', 'Compact design'],
    category: 'RF Components',
    specifications: [
      { name: 'Filter Type', value: 'Cavity, Interdigital, Combline (selectable)' },
      { name: 'Frequency Range', value: '800 MHz to 18 GHz (modular design)' },
      { name: 'Number of Channels', value: '8 individual filter channels' },
      { name: 'Channel Bandwidth', value: 'Custom, 0.1% to 20% of center frequency' },
      { name: 'Insertion Loss', value: '1.5 dB typical in passband' },
      { name: 'Return Loss', value: '20 dB minimum' },
      { name: 'Rejection', value: '80 dB at ±10% from center frequency' },
      { name: 'Switching Speed', value: '15 ms typical' },
      { name: 'Power Handling', value: '10W CW per channel, 50W peak' },
      { name: 'Intermodulation', value: '-70 dBc (two-tone test)' },
      { name: 'Temperature Stability', value: '±0.001%/°C' },
      { name: 'Input/Output Impedance', value: '50 Ohms' },
      { name: 'RF Connectors', value: 'SMA female' },
      { name: 'Control Interface', value: 'Ethernet, USB, TTL' },
      { name: 'Switching Elements', value: 'Solid-state PIN diode' },
      { name: 'Supply Voltage', value: '12V DC' },
      { name: 'Power Consumption', value: '5W typical' },
      { name: 'Dimensions (W×H×D)', value: '250mm × 60mm × 150mm' },
      { name: 'Weight', value: '1.8 kg' },
      { name: 'Operating Temperature', value: '-10°C to +70°C' }
    ]
  }
];

function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [dialogTabValue, setDialogTabValue] = useState(0);

  const handleOpenSpecs = (product) => {
    setSelectedProduct(product);
    setDialogTabValue(0);
  };

  const handleCloseSpecs = () => {
    setSelectedProduct(null);
  };
  
  const handleDialogTabChange = (event, newValue) => {
    setDialogTabValue(newValue);
  };

  return (
    <Box sx={{ py: 6 }}>
      <Container maxWidth="lg">
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          RF Engineering Products
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Explore our range of professional RF, antenna, and radar solutions
        </Typography>
        
        <Divider sx={{ my: 4 }} />
        
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      {product.name}
                    </Typography>
                    <Chip 
                      label={product.category} 
                      size="small" 
                      color="primary" 
                      variant="outlined" 
                    />
                  </Box>
                  <Typography paragraph>
                    {product.description}
                  </Typography>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Key Features:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                    {product.features.map((feature, index) => (
                      <Chip key={index} label={feature} size="small" />
                    ))}
                  </Box>
                </CardContent>
                <CardActions>
                  <Button 
                    size="small" 
                    color="primary" 
                    onClick={() => handleOpenSpecs(product)}
                  >
                    Technical Specs
                  </Button>
                  <Button 
                    size="small" 
                    color="secondary" 
                    onClick={() => window.location.href = '/contact?product=' + product.name}
                  >
                    Request Quote
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Enhanced Technical Specifications Dialog */}
        <Dialog
          open={Boolean(selectedProduct)}
          onClose={handleCloseSpecs}
          maxWidth="lg"
          fullWidth
        >
          {selectedProduct && (
            <>
              <DialogTitle>
                {selectedProduct.name} - Technical Information
                <IconButton
                  aria-label="close"
                  onClick={handleCloseSpecs}
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
              
              <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                <Tabs
                  value={dialogTabValue}
                  onChange={handleDialogTabChange}
                  aria-label="product information tabs"
                >
                  <Tab label="Basic Specifications" />
                  <Tab label="Advanced Technical Details" />
                </Tabs>
              </Box>
              
              <DialogContent dividers>
                {dialogTabValue === 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table>
                      <TableBody>
                        {selectedProduct.specifications.map((spec, index) => (
                          <TableRow 
                            key={index}
                            sx={{ 
                              '&:nth-of-type(odd)': { 
                                backgroundColor: (theme) => theme.palette.action.hover 
                              } 
                            }}
                          >
                            <TableCell 
                              component="th" 
                              scope="row"
                              sx={{ 
                                fontWeight: 'bold',
                                width: '40%' 
                              }}
                            >
                              {spec.name}
                            </TableCell>
                            <TableCell>{spec.value}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <TechSpecsViewer 
                    product={{
                      id: selectedProduct.id.toString(),
                      name: selectedProduct.name,
                      category: selectedProduct.category,
                      // Organize specifications into categories expected by TechSpecsViewer
                      specs: {
                        general: selectedProduct.specifications.filter(s => 
                          ['Dimensions', 'Weight', 'Operating Temperature', 'Power', 'Display'].some(term => 
                            s.name.includes(term)
                          )),
                        rf: selectedProduct.specifications.filter(s => 
                          ['Frequency', 'Bandwidth', 'Gain', 'Phase', 'Noise', 'Range', 'Sensitivity', 'VSWR', 'Impedance'].some(term => 
                            s.name.includes(term)
                          )),
                        analysis: selectedProduct.specifications.filter(s => 
                          ['Analysis', 'Processing', 'Software', 'Interface', 'Protocol', 'Data'].some(term => 
                            s.name.includes(term)
                          )).map(s => ({
                            name: s.name,
                            value: s.name.includes('Support') ? 'Standard' : s.value
                          })),
                        triggering: selectedProduct.specifications.filter(s => 
                          ['Trigger', 'Timing', 'Control', 'Remote', 'Update'].some(term => 
                            s.name.includes(term)
                          ))
                      },
                      documents: [
                        { type: "Datasheet", filename: `${selectedProduct.name.replace(/\s+/g, '_')}_Datasheet.pdf`, size: "2.4 MB" },
                        { type: "User Manual", filename: `${selectedProduct.name.replace(/\s+/g, '_')}_Manual.pdf`, size: "8.7 MB" },
                        { type: "Application Note", filename: `${selectedProduct.category}_Application_Note.pdf`, size: "1.5 MB" }
                      ],
                      comparisonProducts: [
                        { id: "basic", name: `${selectedProduct.name} Basic`, priceCategory: "Entry-level" },
                        { id: "pro-plus", name: `${selectedProduct.name} Pro+`, priceCategory: "High-end" }
                      ]
                    }}
                  />
                )}
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseSpecs}>Close</Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => {
                    handleCloseSpecs();
                    window.location.href = '/contact?product=' + selectedProduct.name;
                  }}
                >
                  Request Quote
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
        
        <Box sx={{ mt: 6, bgcolor: 'grey.100', p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom>
            Custom Solutions
          </Typography>
          <Typography paragraph>
            Don't see exactly what you need? Our engineering team specializes in creating custom RF, antenna, and radar solutions tailored to your specific requirements. From concept to production, we can help bring your ideas to reality.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large" 
            onClick={() => window.location.href = '/contact'}
          >
            Discuss Your Custom Requirements
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default ProductsPage;