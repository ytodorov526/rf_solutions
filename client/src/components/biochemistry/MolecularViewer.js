import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Card,
  CardContent,
  CircularProgress,
  Tabs,
  Tab,
  Tooltip,
  IconButton,
  Stack
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ScienceIcon from '@mui/icons-material/Science';

// This is a mock component that would normally use a 3D visualization library 
// like 3Dmol.js, NGL, or Mol*. For implementation, you'd need to include the
// appropriate library and use actual molecular data.

const molecules = {
  proteins: [
    { 
      id: 'insulin', 
      name: 'Insulin', 
      description: 'Insulin is a peptide hormone produced by beta cells of the pancreatic islets. It regulates the metabolism of carbohydrates, fats and protein by promoting the absorption of glucose from the blood into liver, fat and skeletal muscle cells.',
      size: '51 amino acids',
      function: 'Blood glucose regulation',
      pdbId: '4INS'
    },
    { 
      id: 'hemoglobin', 
      name: 'Hemoglobin', 
      description: 'Hemoglobin is the iron-containing oxygen-transport metalloprotein in the red blood cells of all vertebrates as well as the tissues of some invertebrates.',
      size: '574 amino acids (full tetramer)',
      function: 'Oxygen transport',
      pdbId: '1HHO'
    },
    { 
      id: 'lysozyme', 
      name: 'Lysozyme', 
      description: 'Lysozyme is an enzyme that damages bacterial cell walls by catalyzing hydrolysis of 1,4-beta-linkages between N-acetylmuramic acid and N-acetyl-D-glucosamine residues in peptidoglycan.',
      size: '129 amino acids',
      function: 'Antibacterial defense',
      pdbId: '1LYZ'
    },
  ],
  nucleicAcids: [
    { 
      id: 'dna', 
      name: 'DNA Double Helix', 
      description: 'The DNA double helix is the molecular structure of DNA in which two strands of nucleotides wind around each other in a right-handed spiral. The structure is maintained by hydrogen bonds between complementary base pairs.',
      size: 'Variable (typical human chromosome: ~150 million base pairs)',
      function: 'Genetic information storage',
      pdbId: '1BNA'
    },
    { 
      id: 'trna', 
      name: 'Transfer RNA (tRNA)', 
      description: 'Transfer RNA (tRNA) is a type of RNA molecule that serves as the physical link between the nucleotide sequence of nucleic acids (mRNA) and the amino acid sequence of proteins.',
      size: '~75-90 nucleotides',
      function: 'Translation of genetic code',
      pdbId: '1EHZ'
    },
    { 
      id: 'ribosome', 
      name: 'Ribosome', 
      description: 'Ribosomes are macromolecular machines, composed of RNA and proteins, that are responsible for translating genetic code from mRNA into proteins.',
      size: 'Large complex (prokaryotic: 50S+30S, eukaryotic: 60S+40S)',
      function: 'Protein synthesis',
      pdbId: '4V5D'
    },
  ],
  enzymes: [
    { 
      id: 'catalase', 
      name: 'Catalase', 
      description: 'Catalase is a common enzyme found in nearly all living organisms exposed to oxygen. It catalyzes the decomposition of hydrogen peroxide to water and oxygen.',
      size: '~500 amino acids (forming a tetramer)',
      function: 'Protection from oxidative damage',
      pdbId: '1DGF'
    },
    { 
      id: 'atp_synthase', 
      name: 'ATP Synthase', 
      description: 'ATP synthase is an enzyme that creates the energy storage molecule ATP, which powers most cellular processes. The enzyme is powered by a proton gradient across a membrane.',
      size: 'Large complex (F1 and Fo subunits)',
      function: 'ATP synthesis',
      pdbId: '5FIL'
    },
    { 
      id: 'dna_polymerase', 
      name: 'DNA Polymerase', 
      description: 'DNA polymerase is an enzyme that synthesizes DNA molecules from nucleoside triphosphates, the building blocks of DNA.',
      size: 'Variable (~800-1000 amino acids)',
      function: 'DNA replication',
      pdbId: '1BPY'
    },
  ],
  metabolites: [
    { 
      id: 'atp', 
      name: 'ATP (Adenosine Triphosphate)', 
      description: 'ATP is a complex organic chemical that serves as a source of energy for many metabolic processes. ATP is found in all forms of life and is often called the "molecular unit of currency" of intracellular energy transfer.',
      size: 'Small molecule',
      function: 'Energy storage and transfer',
      formula: 'C10H16N5O13P3'
    },
    { 
      id: 'glucose', 
      name: 'Glucose', 
      description: 'Glucose is a simple sugar (monosaccharide) and is one of the most important carbohydrates in biology. It serves as a primary source of energy for living organisms.',
      size: 'Small molecule',
      function: 'Energy source',
      formula: 'C6H12O6'
    },
    { 
      id: 'cholesterol', 
      name: 'Cholesterol', 
      description: 'Cholesterol is a waxy substance found in cells. It\'s vital for normal body function, as it\'s needed to build cell membranes, make hormones, and produce vitamin D.',
      size: 'Small molecule (steroid)',
      function: 'Membrane structure, hormone precursor',
      formula: 'C27H46O'
    },
  ]
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} id={`molecule-tabpanel-${index}`} {...other}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

const MolecularViewer = () => {
  const [selectedType, setSelectedType] = useState('proteins');
  const [selectedMolecule, setSelectedMolecule] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visualizationType, setVisualizationType] = useState('cartoon');
  const [activeTab, setActiveTab] = useState(0);
  const viewerRef = useRef(null);

  useEffect(() => {
    if (molecules[selectedType]?.length > 0) {
      setSelectedMolecule(molecules[selectedType][0]);
    } else {
      setSelectedMolecule(null);
    }
  }, [selectedType]);

  useEffect(() => {
    if (selectedMolecule) {
      // This would normally load and render the molecule using a library like 3Dmol.js
      setLoading(true);
      const timer = setTimeout(() => {
        setLoading(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [selectedMolecule, visualizationType]);

  const handleTypeChange = (event) => {
    setSelectedType(event.target.value);
  };

  const handleMoleculeChange = (molecule) => {
    setLoading(true);
    setSelectedMolecule(molecule);
  };

  const handleVisualizationChange = (event) => {
    setVisualizationType(event.target.value);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Mock functions for viewer controls
  const handleRotate = () => {
    console.log('Rotating molecule');
    // In a real implementation, this would rotate the 3D model
  };
  
  const handleZoomIn = () => {
    console.log('Zooming in');
    // In a real implementation, this would zoom in on the 3D model
  };
  
  const handleZoomOut = () => {
    console.log('Zooming out');
    // In a real implementation, this would zoom out on the 3D model
  };
  
  const handleReset = () => {
    console.log('Resetting view');
    // In a real implementation, this would reset the 3D view
  };
  
  const handleFullscreen = () => {
    console.log('Fullscreen mode');
    // In a real implementation, this would toggle fullscreen mode
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" alignItems="center" mb={2}>
        <ScienceIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h2">
          Molecular Viewer
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Explore the 3D structures of important biomolecules in biochemistry. Select a molecule type and specific molecule to visualize its structure.
      </Typography>
      
      <Grid container spacing={3}>
        {/* Control Panel */}
        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Molecule Selection
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="molecule-type-label">Molecule Type</InputLabel>
                <Select
                  labelId="molecule-type-label"
                  id="molecule-type-select"
                  value={selectedType}
                  label="Molecule Type"
                  onChange={handleTypeChange}
                >
                  <MenuItem value="proteins">Proteins</MenuItem>
                  <MenuItem value="nucleicAcids">Nucleic Acids</MenuItem>
                  <MenuItem value="enzymes">Enzymes</MenuItem>
                  <MenuItem value="metabolites">Metabolites</MenuItem>
                </Select>
              </FormControl>
              
              <Typography variant="subtitle2" gutterBottom>
                Select Molecule:
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 1 }}>
                {molecules[selectedType]?.map((molecule) => (
                  <Button
                    key={molecule.id}
                    variant={selectedMolecule?.id === molecule.id ? "contained" : "outlined"}
                    color="primary"
                    size="small"
                    onClick={() => handleMoleculeChange(molecule)}
                    sx={{ textAlign: 'left', justifyContent: 'flex-start' }}
                  >
                    {molecule.name}
                  </Button>
                ))}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>
                Visualization Options
              </Typography>
              
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel id="visualization-type-label">Display Style</InputLabel>
                <Select
                  labelId="visualization-type-label"
                  id="visualization-type-select"
                  value={visualizationType}
                  label="Display Style"
                  onChange={handleVisualizationChange}
                >
                  <MenuItem value="cartoon">Cartoon</MenuItem>
                  <MenuItem value="ball-and-stick">Ball and Stick</MenuItem>
                  <MenuItem value="space-filling">Space Filling</MenuItem>
                  <MenuItem value="ribbon">Ribbon</MenuItem>
                  <MenuItem value="surface">Surface</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
          
          {selectedMolecule && (
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Typography variant="h6" gutterBottom>
                    {selectedMolecule.name}
                  </Typography>
                  <Tooltip title="View in external database">
                    <IconButton 
                      size="small" 
                      color="primary"
                      aria-label="view in database"
                      onClick={() => console.log(`Open ${selectedMolecule.id} in database`)}
                    >
                      <InfoIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
                
                <Typography variant="body2" paragraph>
                  {selectedMolecule.description}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom component="div">
                  Size: {selectedMolecule.size}
                </Typography>
                
                <Typography variant="subtitle2" gutterBottom component="div">
                  Function: {selectedMolecule.function}
                </Typography>
                
                {selectedMolecule.pdbId && (
                  <Typography variant="subtitle2" gutterBottom component="div">
                    PDB ID: {selectedMolecule.pdbId}
                  </Typography>
                )}
                
                {selectedMolecule.formula && (
                  <Typography variant="subtitle2" gutterBottom component="div">
                    Formula: {selectedMolecule.formula}
                  </Typography>
                )}
              </CardContent>
            </Card>
          )}
        </Grid>
        
        {/* Viewer Panel */}
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2, pt: 1 }}>
              <Tabs 
                value={activeTab} 
                onChange={handleTabChange} 
                aria-label="molecule viewer tabs"
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="3D Structure" id="tab-structure" />
                <Tab label="Chemical Properties" id="tab-properties" />
                <Tab label="Biological Context" id="tab-context" />
              </Tabs>
            </Box>
            
            <TabPanel value={activeTab} index={0}>
              <Box sx={{ position: 'relative', height: 400, bgcolor: '#f5f5f5', borderRadius: 1, mb: 1 }}>
                {loading ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                      Loading molecule...
                    </Typography>
                  </Box>
                ) : (
                  <Box 
                    ref={viewerRef} 
                    sx={{ 
                      width: '100%', 
                      height: '100%', 
                      display: 'flex', 
                      justifyContent: 'center',
                      alignItems: 'center',
                      typography: 'body1',
                      color: 'text.secondary'
                    }}
                  >
                    {/* This div would contain the actual 3D viewer */}
                    <Typography variant="body1" color="text.secondary" align="center">
                      {selectedMolecule ? (
                        <>
                          <Box component="img" 
                            src={`https://via.placeholder.com/400x350?text=${selectedMolecule.name.replace(/\s/g, '+')}`} 
                            alt={`3D model of ${selectedMolecule.name}`}
                            sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                          />
                          <Typography variant="caption" display="block" mt={1}>
                            3D Visualization would appear here using a molecular viewer library.
                          </Typography>
                        </>
                      ) : (
                        "Select a molecule to visualize"
                      )}
                    </Typography>
                  </Box>
                )}
              </Box>
              
              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                <Tooltip title="Rotate">
                  <Button 
                    onClick={handleRotate} 
                    variant="outlined" 
                    size="small"
                    startIcon={<RotateLeftIcon />}
                  >
                    Rotate
                  </Button>
                </Tooltip>
                <Tooltip title="Zoom In">
                  <IconButton onClick={handleZoomIn} size="small">
                    <ZoomInIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Zoom Out">
                  <IconButton onClick={handleZoomOut} size="small">
                    <ZoomOutIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Reset View">
                  <Button 
                    onClick={handleReset} 
                    variant="outlined" 
                    size="small"
                  >
                    Reset
                  </Button>
                </Tooltip>
                <Tooltip title="Fullscreen">
                  <IconButton onClick={handleFullscreen} size="small">
                    <FullscreenIcon />
                  </IconButton>
                </Tooltip>
              </Stack>
              
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedMolecule ? `Displaying ${selectedMolecule.name} with ${visualizationType} visualization` : "Please select a molecule to view its 3D structure"}
              </Typography>
              
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                Note: In a complete implementation, this viewer would use a molecular visualization library to render interactive 3D models.
              </Typography>
            </TabPanel>
            
            <TabPanel value={activeTab} index={1}>
              {selectedMolecule ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Chemical Properties of {selectedMolecule.name}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Physical Properties
                        </Typography>
                        <Typography variant="body2" paragraph>
                          • Size: {selectedMolecule.size}
                          {selectedMolecule.formula && (
                            <>
                              <br/>
                              • Molecular Formula: {selectedMolecule.formula}
                            </>
                          )}
                          <br/>
                          • Molecular Weight: {selectedMolecule.id === 'insulin' ? '5.8 kDa' : 
                                               selectedMolecule.id === 'hemoglobin' ? '64.5 kDa' : 
                                               selectedMolecule.id === 'glucose' ? '180.16 g/mol' : 'Varies'}
                          <br/>
                          • Solubility: {selectedMolecule.id === 'cholesterol' ? 'Not water soluble' : 'Water soluble'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Structural Features
                        </Typography>
                        <Typography variant="body2">
                          {selectedMolecule.id === 'insulin' ? '3 disulfide bonds, 2 chains' : 
                           selectedMolecule.id === 'hemoglobin' ? 'Tetrameric protein, contains heme groups' : 
                           selectedMolecule.id === 'dna' ? 'Double helix, complementary base pairing' :
                           selectedMolecule.id === 'atp' ? 'Adenine base, ribose, triple phosphate' :
                           selectedMolecule.id === 'glucose' ? 'Six-carbon ring (pyranose form)' :
                           'Complex three-dimensional structure'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Functional Groups and Chemical Behavior
                        </Typography>
                        <Typography variant="body2">
                          {selectedMolecule.id === 'insulin' ? 
                            'Contains numerous peptide bonds, amino and carboxyl groups, and several disulfide bridges critical for maintaining its tertiary structure.' : 
                           selectedMolecule.id === 'glucose' ? 
                            'Contains hydroxyl (-OH) groups which make it hydrophilic. The aldehyde group makes it a reducing sugar capable of being oxidized.' :
                           selectedMolecule.id === 'atp' ? 
                            'High-energy phosphoanhydride bonds between phosphate groups release energy when hydrolyzed, making ATP an excellent energy carrier.' :
                           selectedMolecule.id === 'cholesterol' ? 
                            'Contains a hydroxyl group, multiple carbon rings, and a hydrocarbon tail, creating amphipathic properties important for membrane function.' :
                           'Complex biochemical structure with multiple functional groups that determine its biological activity.'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  Select a molecule to view its chemical properties
                </Typography>
              )}
            </TabPanel>
            
            <TabPanel value={activeTab} index={2}>
              {selectedMolecule ? (
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Biological Role of {selectedMolecule.name}
                  </Typography>
                  
                  <Typography variant="body1" paragraph>
                    {selectedMolecule.description}
                  </Typography>
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Function
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {selectedMolecule.function}
                        </Typography>
                        <Typography variant="body2">
                          {selectedMolecule.id === 'insulin' ? 
                            'Controls blood glucose by facilitating cellular glucose uptake and regulating metabolism of carbohydrates, fats, and proteins.' : 
                           selectedMolecule.id === 'hemoglobin' ? 
                            'Transports oxygen from the lungs to tissues and assists in carbon dioxide transport back to the lungs.' :
                           selectedMolecule.id === 'atp' ? 
                            'Serves as the primary energy currency of cells, powering most cellular processes including muscle contraction, active transport, and biosynthesis.' :
                           selectedMolecule.id === 'dna' ? 
                            'Stores genetic information for the development, functioning, growth, and reproduction of all known organisms.' :
                           selectedMolecule.id === 'catalase' ? 
                            'Protects cells from oxidative damage by converting hydrogen peroxide to water and oxygen.' :
                           'Performs essential biological functions necessary for life processes.'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Biological Context
                        </Typography>
                        <Typography variant="body2">
                          {selectedMolecule.id === 'insulin' ? 
                            'Produced by beta cells in the pancreas. Its absence or dysfunction leads to diabetes mellitus.' : 
                           selectedMolecule.id === 'hemoglobin' ? 
                            'Found in red blood cells. Mutations can cause diseases like sickle cell anemia and thalassemia.' :
                           selectedMolecule.id === 'atp' ? 
                            'Produced mainly during cellular respiration in mitochondria and by photosynthesis in chloroplasts.' :
                           selectedMolecule.id === 'glucose' ? 
                            'Primary energy source for most organisms. Enters cellular respiration to produce ATP.' :
                           selectedMolecule.id === 'dna_polymerase' ? 
                            'Essential for DNA replication during cell division. Defects can lead to genetic instability and cancer.' :
                           'Plays a crucial role in maintaining cellular homeostasis and supporting life functions.'}
                        </Typography>
                      </Paper>
                    </Grid>
                    <Grid item xs={12}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle2" color="primary">
                          Related Biochemical Pathways
                        </Typography>
                        <Typography variant="body2">
                          {selectedMolecule.id === 'insulin' ? 
                            'Insulin signaling pathway, glucose metabolism, glycolysis, glycogen synthesis' : 
                           selectedMolecule.id === 'atp' ? 
                            'Cellular respiration, oxidative phosphorylation, glycolysis, Krebs cycle' :
                           selectedMolecule.id === 'glucose' ? 
                            'Glycolysis, pentose phosphate pathway, glycogen synthesis, gluconeogenesis' :
                           selectedMolecule.id === 'dna' ? 
                            'DNA replication, transcription, DNA repair mechanisms' :
                           selectedMolecule.id === 'catalase' ? 
                            'Reactive oxygen species (ROS) detoxification, oxidative stress response' :
                           'Involved in multiple interconnected biochemical pathways essential for cellular function.'}
                        </Typography>
                      </Paper>
                    </Grid>
                  </Grid>
                </Box>
              ) : (
                <Typography variant="body1" color="text.secondary" align="center">
                  Select a molecule to view its biological context
                </Typography>
              )}
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default MolecularViewer;
