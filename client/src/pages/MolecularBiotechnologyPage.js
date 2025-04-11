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
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SchoolIcon from '@mui/icons-material/School';
import QuizIcon from '@mui/icons-material/Quiz';
import BiotechIcon from '@mui/icons-material/Biotech';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import DnaIcon from '@mui/icons-material/Sanitizer';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import ExperimentIcon from '@mui/icons-material/Science';
import FactCheckIcon from '@mui/icons-material/FactCheck';

// Tab panel component for content organization
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`biotechnology-tabpanel-${index}`}
      aria-labelledby={`biotechnology-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `biotechnology-tab-${index}`,
    'aria-controls': `biotechnology-tabpanel-${index}`,
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

// Core biotechnology topics based on the textbook
const biotechnologyTopics = [
  {
    name: "Recombinant DNA Technology",
    description: "The foundation of molecular biotechnology, involving DNA manipulation techniques to create novel genetic combinations for various applications in research, medicine, and industry.",
    features: [
      "Restriction enzymes and DNA manipulation",
      "DNA cloning and vector systems",
      "PCR and DNA amplification methods",
      "Gene editing technologies (CRISPR-Cas9)",
      "Construction of genomic and cDNA libraries"
    ],
    image: "https://www.jax.org/-/media/jaxweb/images/news-and-insights/dna-recombinant-technology.jpg"
  },
  {
    name: "Genomics and Proteomics",
    description: "Large-scale study of genomes (DNA sequences) and proteomes (protein sets) to understand gene expression, regulation, and protein function in biological systems.",
    features: [
      "DNA sequencing technologies",
      "Genome annotation and comparative genomics",
      "Transcriptomics and RNA-Seq analysis",
      "Protein structure determination",
      "Mass spectrometry and proteome analysis"
    ],
    image: "https://www.news-medical.net/image.axd?picture=2019%2F8%2Fshutterstock_1178387793.jpg"
  },
  {
    name: "Protein Engineering and Production",
    description: "Development and production of recombinant proteins with enhanced properties or novel functions for therapeutic, industrial, and research applications.",
    features: [
      "Expression systems (bacterial, yeast, mammalian)",
      "Protein purification techniques",
      "Rational design and directed evolution",
      "Protein structure-function relationships",
      "Industrial-scale bioprocessing"
    ],
    image: "https://www.creative-biostructure.com/wp-content/uploads/2016/01/Protein-Engineering-Services.jpg"
  },
  {
    name: "Biotechnology Applications",
    description: "Practical applications of recombinant DNA technology in medicine, agriculture, industry, and environmental management.",
    features: [
      "Biopharmaceuticals and therapeutics",
      "Agricultural biotechnology and GMOs",
      "Forensic DNA analysis",
      "Industrial enzymes and biocatalysis",
      "Environmental biotech and bioremediation"
    ],
    image: "https://theconversation.com/sites/default/files/styles/images_sizes_article/public/91/files/2016-09/agricultural-biotechnology-1024x683.jpg"
  },
];

// Advanced molecular biotechnology topics
const advancedTopics = [
  {
    title: "Genetic Circuit Design",
    description: "Engineering of genetic components into functional circuits that can perform specific tasks within cells, from sensing environmental conditions to producing valuable compounds on demand.",
    content: "Genetic circuits are constructed from modular genetic parts including promoters, ribosome binding sites, coding sequences, and terminators. These components are arranged to create systems with predictable behaviors such as toggle switches, oscillators, logic gates, and feedback loops. Computational tools assist in modeling circuit behavior before implementation, while standardized assembly methods like Golden Gate and Gibson Assembly enable rapid construction. Applications include biosensors, controlled bioproduction, cell-based therapies, and synthetic cellular communication systems."
  },
  {
    title: "RNA Technologies",
    description: "Exploration of RNA-based approaches including RNA interference (RNAi), RNA vaccines, riboswitches, and CRISPR-based transcriptional regulation.",
    content: "RNA technologies have revolutionized molecular biology and therapeutics. RNA interference (RNAi) uses small interfering RNAs (siRNAs) or microRNAs (miRNAs) to regulate gene expression post-transcriptionally. RNA vaccines, as demonstrated by COVID-19 mRNA vaccines, deliver genetic instructions for antigen production rather than the antigen itself. Riboswitches are RNA-based sensors that change conformation upon ligand binding, controlling gene expression without protein factors. CRISPR-Cas systems with catalytically inactive Cas proteins can target RNA for visualization or modification. These technologies offer powerful tools for gene regulation, vaccine development, diagnostics, and RNA-targeting therapeutics."
  },
  {
    title: "Single-Cell Analysis",
    description: "Methods for studying individual cells to reveal heterogeneity within seemingly uniform populations, with applications in development, immunology, and cancer research.",
    content: "Single-cell analysis techniques examine individual cells rather than bulk tissue averages, revealing cellular heterogeneity in seemingly uniform populations. Single-cell RNA sequencing (scRNA-seq) profiles transcriptomes of thousands of individual cells simultaneously, while mass cytometry (CyTOF) measures dozens of proteins at once using metal-tagged antibodies. Spatial transcriptomics preserves spatial information while analyzing gene expression patterns within tissue. These approaches have transformed our understanding of developmental processes, immune cell diversity, tumor heterogeneity, and cellular response to treatments. Applications include cell type identification, developmental trajectory mapping, and precision medicine approaches that account for cellular diversity."
  },
  {
    title: "Synthetic Biology and Metabolic Engineering",
    description: "Design and construction of biological systems with novel functions, focused on optimizing cellular pathways for the production of valuable compounds.",
    content: "Synthetic biology applies engineering principles to biology, creating standardized biological parts that can be combined into novel systems. Metabolic engineering specifically focuses on optimizing cellular pathways for producing valuable compounds. Key approaches include pathway optimization through gene knockouts/overexpression, introduction of heterologous pathways from other organisms, and creation of artificial metabolic routes. Tools like genome-scale metabolic models and flux balance analysis help predict metabolic behaviors. Applications include production of biofuels, pharmaceuticals, specialty chemicals, and sustainable materials, while also contributing to carbon capture and waste valorization technologies."
  },
];

// Sample quiz questions on molecular biotechnology
const quizQuestions = [
  {
    question: "Which enzyme is primarily responsible for synthesizing DNA from an RNA template in reverse transcription?",
    options: ["DNA polymerase", "RNA polymerase", "Reverse transcriptase", "Helicase"],
    answer: 2,
    explanation: "Reverse transcriptase is a specialized enzyme that synthesizes DNA using an RNA template, a process essential for retroviruses and used in molecular techniques like cDNA synthesis."
  },
  {
    question: "What is the main function of restriction endonucleases in recombinant DNA technology?",
    options: ["To ligate DNA fragments", "To cut DNA at specific recognition sequences", "To amplify DNA segments", "To identify mutated DNA sequences"],
    answer: 1,
    explanation: "Restriction endonucleases (restriction enzymes) cut DNA at specific recognition sequences, creating fragments that can be joined with other DNA fragments in cloning experiments."
  },
  {
    question: "Which of the following is NOT a common vector used in gene cloning?",
    options: ["Plasmid", "Bacteriophage", "Cosmid", "Ribosome"],
    answer: 3,
    explanation: "Ribosomes are cellular structures involved in protein synthesis, not vectors for gene cloning. Plasmids, bacteriophages, and cosmids are all vectors used to carry foreign DNA."
  },
  {
    question: "The CRISPR-Cas9 system functions primarily as:",
    options: ["A DNA ligase", "A DNA polymerase", "A gene editing tool", "A transcription factor"],
    answer: 2,
    explanation: "CRISPR-Cas9 is a revolutionary gene editing tool that uses guide RNA to target specific DNA sequences, which are then cut by the Cas9 endonuclease protein."
  },
  {
    question: "In polymerase chain reaction (PCR), what is the purpose of the denaturation step?",
    options: ["To activate the DNA polymerase", "To separate the DNA strands", "To allow primers to anneal to template DNA", "To synthesize new DNA strands"],
    answer: 1,
    explanation: "The denaturation step in PCR involves heating the reaction to separate (denature) the double-stranded DNA into single strands, allowing primers to anneal in the subsequent step."
  },
  {
    question: "Which technique would be most appropriate for determining the complete amino acid sequence of a purified protein?",
    options: ["Western blotting", "Edman degradation and mass spectrometry", "Gel electrophoresis", "ELISA"],
    answer: 1,
    explanation: "Edman degradation and mass spectrometry are techniques used to determine the amino acid sequence of proteins. Mass spectrometry has largely replaced Edman degradation for complete protein sequencing."
  },
  {
    question: "Which of the following is a crucial step in creating a recombinant protein expression system?",
    options: ["Removing all introns from the gene", "Adding a strong viral promoter", "Introducing random mutations", "Methylating the entire gene"],
    answer: 1,
    explanation: "Adding a strong promoter (often viral in origin, like the T7 promoter) is essential for high-level expression of recombinant proteins in expression systems."
  },
  {
    question: "The term 'Golden Gate Assembly' refers to:",
    options: ["A specific research facility for biotechnology", "A method for DNA assembly using Type IIS restriction enzymes", "The entrance to a high-security biotechnology lab", "A database of genomic sequences"],
    answer: 1,
    explanation: "Golden Gate Assembly is a cloning method that uses Type IIS restriction enzymes to create unique overhangs, allowing multiple DNA fragments to be assembled in a specific order in a single reaction."
  }
];

// Laboratory techniques and protocols
const laboratoryTechniques = [
  {
    name: "DNA Extraction and Purification",
    description: "Methods for isolating DNA from various biological samples with sufficient purity for downstream applications.",
    protocols: [
      "Cell lysis and nucleic acid extraction",
      "Column-based DNA purification",
      "Phenol-chloroform extraction",
      "Density gradient centrifugation",
      "Evaluation of DNA quality and quantity"
    ]
  },
  {
    name: "PCR and DNA Amplification",
    description: "Techniques for enzymatically amplifying specific DNA sequences for analysis, cloning, or sequencing.",
    protocols: [
      "Standard PCR protocol optimization",
      "Quantitative real-time PCR (qPCR)",
      "Reverse transcription PCR (RT-PCR)",
      "High-fidelity amplification methods",
      "Digital PCR for absolute quantification"
    ]
  },
  {
    name: "Cloning and Vector Construction",
    description: "Methods for inserting DNA fragments into vectors for propagation, expression, or genetic modification.",
    protocols: [
      "Restriction enzyme digestion and ligation",
      "Gibson Assembly and other seamless cloning methods",
      "Gateway cloning and recombination-based approaches",
      "TOPO cloning for PCR products",
      "Vector preparation and transformation protocols"
    ]
  },
  {
    name: "Protein Expression and Purification",
    description: "Techniques for producing and isolating recombinant proteins from expression systems.",
    protocols: [
      "Bacterial expression system optimization",
      "Eukaryotic expression in yeast, insect, and mammalian cells",
      "Cell-free protein synthesis",
      "Affinity chromatography methods",
      "Size exclusion and ion exchange purification"
    ]
  },
  {
    name: "Gene Editing and Genome Engineering",
    description: "Methods for precise modification of genomes in various organisms.",
    protocols: [
      "CRISPR-Cas9 guide RNA design and delivery",
      "Homology-directed repair strategies",
      "TALEN and zinc-finger nuclease approaches",
      "Selection and screening of edited cells",
      "Off-target analysis and validation methods"
    ]
  }
];

// Biotechnology simulator components
const simulatorComponents = [
  {
    title: "DNA Cloning Simulator",
    description: "Interactive simulation of the cloning process, from restriction digestion to transformation and selection.",
    status: "Available Now"
  },
  {
    title: "PCR Simulator",
    description: "Virtual PCR experiment with adjustable parameters including primer design, annealing temperatures, and cycle numbers.",
    status: "Available Now"
  },
  {
    title: "Protein Expression Simulator",
    description: "Model recombinant protein production in different expression systems with adjustable factors affecting yield and solubility.",
    status: "Available Now"
  },
  {
    title: "CRISPR Gene Editing Designer",
    description: "Design guide RNAs, predict editing efficiency, and visualize potential genomic modifications.",
    status: "Coming Soon"
  },
  {
    title: "Metabolic Pathway Optimizer",
    description: "Engineer and optimize metabolic pathways for the production of valuable compounds through in silico modeling.",
    status: "In Development"
  }
];

function MolecularBiotechnologyPage() {
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
          Molecular Biotechnology
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Explore the principles and applications of recombinant DNA technology through interactive learning tools, simulations, and comprehensive educational materials
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
                aria-label="biotechnology tabs"
              >
                <Tab icon={<MenuBookIcon />} iconPosition="start" label="Core Concepts" {...a11yProps(0)} />
                <Tab icon={<DnaIcon />} iconPosition="start" label="DNA Cloning" {...a11yProps(1)} />
                <Tab icon={<ExperimentIcon />} iconPosition="start" label="PCR Simulator" {...a11yProps(2)} />
                <Tab icon={<BiotechIcon />} iconPosition="start" label="Protein Expression" {...a11yProps(3)} />
                <Tab icon={<QuizIcon />} iconPosition="start" label="Knowledge Quiz" {...a11yProps(4)} />
                <Tab icon={<FactCheckIcon />} iconPosition="start" label="Lab Techniques" {...a11yProps(5)} />
              </Tabs>
            </Box>
            
            {/* Core Concepts Tab */}
            <TabPanel value={activeTab} index={0}>
              <Typography variant="h4" gutterBottom>
                Molecular Biotechnology Fundamentals
              </Typography>
              <Typography variant="body1" paragraph sx={{ mb: 4 }}>
                Explore the foundational concepts of molecular biotechnology based on the principles and applications of recombinant DNA technology. This comprehensive educational resource covers everything from basic DNA manipulation techniques to advanced applications in medicine, agriculture, and industry.
              </Typography>
              
              <Grid container spacing={4}>
                {biotechnologyTopics.map((topic) => (
                  <Grid item xs={12} md={6} key={topic.name}>
                    <Card elevation={3}>
                      <CardMedia
                        component="img"
                        height="250"
                        image={topic.image}
                        alt={topic.name}
                        sx={{ objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h5" component="h3" gutterBottom>
                          {topic.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {topic.description}
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                          Key Concepts:
                        </Typography>
                        <List dense>
                          {topic.features.map((feature, index) => (
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
              
              <Typography variant="h5" sx={{ mt: 6, mb: 2 }}>
                Advanced Topics in Molecular Biotechnology
              </Typography>
              
              <Box sx={{ mt: 2 }}>
                {advancedTopics.map((topic, index) => (
                  <Accordion key={index} sx={{ mb: 2 }}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={`panel${index}-content`}
                      id={`panel${index}-header`}
                    >
                      <Typography variant="h6">{topic.title}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        {topic.description}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        {topic.content}
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Box>
              
              <Box sx={{ mt: 6, textAlign: 'center' }}>
                <Button variant="contained" color="primary" sx={{ mr: 2 }}>
                  Browse More Topics
                </Button>
                <Button variant="outlined">
                  Download Study Materials
                </Button>
              </Box>
            </TabPanel>
            
            {/* DNA Cloning Tab */}
            <TabPanel value={activeTab} index={1}>
              <Typography variant="h4" gutterBottom>
                DNA Cloning Simulator
              </Typography>
              <Typography variant="body1" paragraph>
                Learn the principles and techniques of DNA cloning through an interactive simulation. Design restriction digests, select vectors, perform ligations, and transform bacteria in this comprehensive virtual laboratory.
              </Typography>
              
              {/* Include the DNA Cloning Simulator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading DNA Cloning Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/molecular-biotechnology/DNACloningSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Understanding the Cloning Process
                </Typography>
                <Typography variant="body2" paragraph>
                  DNA cloning is a fundamental technique in molecular biotechnology that allows researchers to create copies of specific DNA fragments. The process typically involves cutting DNA with restriction enzymes, inserting it into a vector (such as a plasmid), and introducing the recombinant vector into a host organism where it can replicate.
                </Typography>
                <Typography variant="body2" paragraph>
                  This simulator guides you through each step of the cloning process, helping you understand the principles behind restriction enzyme selection, compatible end generation, ligation reactions, and transformation efficiency. You'll learn about selection markers, colony screening, and the challenges that can arise during the cloning process.
                </Typography>
              </Box>
            </TabPanel>
            
            {/* PCR Simulator Tab */}
            <TabPanel value={activeTab} index={2}>
              <Typography variant="h4" gutterBottom>
                PCR Simulator
              </Typography>
              <Typography variant="body1" paragraph>
                Explore the polymerase chain reaction (PCR) process through this interactive simulator. Design primers, optimize reaction conditions, and visualize the exponential amplification of DNA sequences.
              </Typography>
              
              {/* Import and include the PCR Simulator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading PCR Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/molecular-biotechnology/PCRSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  The Power of PCR Technology
                </Typography>
                <Typography variant="body2" paragraph>
                  Polymerase Chain Reaction (PCR) is a revolutionary technique that allows for the amplification of specific DNA sequences, generating millions of copies from even a single molecule of DNA. This powerful method has transformed molecular biology, forensics, diagnostics, and countless other fields.
                </Typography>
                <Typography variant="body2" paragraph>
                  Our PCR Simulator allows you to explore the key parameters that affect PCR success, including primer design, annealing temperatures, extension times, and cycle numbers. You'll visualize how these factors influence amplification efficiency and specificity, gaining a deeper understanding of this essential biotechnology technique.
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Protein Expression Tab */}
            <TabPanel value={activeTab} index={3}>
              <Typography variant="h4" gutterBottom>
                Protein Expression Simulator
              </Typography>
              <Typography variant="body1" paragraph>
                Discover the principles of recombinant protein production in this interactive simulator. Explore different expression systems, optimize conditions, and troubleshoot common issues in protein expression and purification.
              </Typography>
              
              {/* Include the Protein Expression Simulator component */}
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Protein Expression Simulator...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/molecular-biotechnology/ProteinExpressionSimulator')),
                      {}
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  The Art of Protein Production
                </Typography>
                <Typography variant="body2" paragraph>
                  Recombinant protein expression is both a science and an art, requiring careful consideration of host systems, vectors, culture conditions, and purification strategies. This technology has enabled the production of countless therapeutic proteins, industrial enzymes, and research reagents.
                </Typography>
                <Typography variant="body2" paragraph>
                  Our simulator allows you to experiment with different expression systems (bacterial, yeast, insect, and mammalian cells), explore the effects of culture conditions and induction parameters, and learn about common challenges in protein solubility, folding, and purification. By manipulating these variables, you'll gain insight into the complex factors that influence successful protein production.
                </Typography>
              </Box>
            </TabPanel>
            
            {/* Knowledge Quiz Tab */}
            <TabPanel value={activeTab} index={4}>
              <Typography variant="h4" gutterBottom>
                Molecular Biotechnology Quiz
              </Typography>
              <Typography variant="body1" paragraph>
                Test your understanding of molecular biotechnology concepts with our comprehensive quiz. Challenge yourself with questions on recombinant DNA technology, genomics, protein engineering, and biotechnology applications.
              </Typography>
              
              <Box sx={{ mt: 4 }}>
                <ErrorBoundary>
                  <Suspense fallback={
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 4 }}>
                      <CircularProgress size={24} />
                      <Typography sx={{ ml: 2 }}>Loading Biotechnology Quiz...</Typography>
                    </Box>
                  }>
                    {React.createElement(
                      React.lazy(() => import('../components/molecular-biotechnology/BiotechnologyQuiz')),
                      { quizQuestions }
                    )}
                  </Suspense>
                </ErrorBoundary>
              </Box>
              
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>
                  Quiz Preview
                </Typography>
                <Typography variant="body2" paragraph>
                  Below is a sample of the types of questions you'll encounter in our comprehensive biotechnology quiz:
                </Typography>
                
                <Grid container spacing={3}>
                  {quizQuestions.slice(0, 4).map((q, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <Paper sx={{ p: 3 }} elevation={2}>
                        <Typography variant="subtitle1" gutterBottom color="primary">
                          Question {index + 1}:
                        </Typography>
                        <Typography variant="body1" paragraph>
                          {q.question}
                        </Typography>
                        <List dense>
                          {q.options.map((option, i) => (
                            <ListItem key={i}>
                              <ListItemIcon sx={{ minWidth: 36 }}>
                                {String.fromCharCode(65 + i) + "."}
                              </ListItemIcon>
                              <ListItemText primary={option} />
                            </ListItem>
                          ))}
                        </List>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </TabPanel>
            
            {/* Lab Techniques Tab */}
            <TabPanel value={activeTab} index={5}>
              <Typography variant="h4" gutterBottom>
                Laboratory Techniques & Protocols
              </Typography>
              <Typography variant="body1" paragraph>
                Master essential laboratory methods used in molecular biotechnology research. Explore detailed protocols, troubleshooting guides, and practical tips for successful experiments.
              </Typography>
              
              <Grid container spacing={4} sx={{ mt: 2 }}>
                {laboratoryTechniques.map((technique, index) => (
                  <Grid item xs={12} md={6} key={index}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h5" gutterBottom color="primary">
                          {technique.name}
                        </Typography>
                        <Typography variant="body2" paragraph>
                          {technique.description}
                        </Typography>
                        <Typography variant="subtitle2" gutterBottom>
                          Protocol Categories:
                        </Typography>
                        <List dense>
                          {technique.protocols.map((protocol, i) => (
                            <ListItem key={i}>
                              <ListItemIcon>
                                <CheckCircleIcon color="primary" fontSize="small" />
                              </ListItemIcon>
                              <ListItemText primary={protocol} />
                            </ListItem>
                          ))}
                        </List>
                        <Button 
                          variant="outlined" 
                          color="primary" 
                          fullWidth 
                          sx={{ mt: 2 }}
                        >
                          View Detailed Protocols
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              
              <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>
                  Video Demonstrations
                </Typography>
                <Typography variant="body2" paragraph>
                  Access video tutorials demonstrating key laboratory techniques in molecular biotechnology.
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                      <Typography variant="h6" gutterBottom color="primary">
                        DNA Extraction & Purification
                      </Typography>
                      <Box 
                        sx={{ 
                          bgcolor: '#f5f5f5', 
                          height: 180, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: 2 
                        }}
                      >
                        <Typography>Video demo placeholder</Typography>
                      </Box>
                      <Typography variant="body2">
                        Step-by-step demonstration of DNA extraction methods from various sample types, including proper technique for maximum yield and purity.
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                      <Typography variant="h6" gutterBottom color="primary">
                        PCR Setup & Analysis
                      </Typography>
                      <Box 
                        sx={{ 
                          bgcolor: '#f5f5f5', 
                          height: 180, 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center',
                          mb: 2 
                        }}
                      >
                        <Typography>Video demo placeholder</Typography>
                      </Box>
                      <Typography variant="body2">
                        Detailed tutorial on PCR reaction setup, cycling conditions, and post-PCR analysis including gel electrophoresis and band interpretation.
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            </TabPanel>
          </Paper>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            Interactive Biotechnology Tools
          </Typography>
          <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
            Explore our collection of interactive simulators and tools for learning molecular biotechnology concepts
          </Typography>
          
          <Grid container spacing={3}>
            {simulatorComponents.map((simulator, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom color="primary">
                      {simulator.title}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 3 }}>
                      {simulator.description}
                    </Typography>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        mt: 'auto'
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        {simulator.status}
                      </Typography>
                      <Button 
                        variant="outlined" 
                        color="primary" 
                        size="small" 
                        disabled={simulator.status !== "Available Now"}
                      >
                        {simulator.status === "Available Now" ? "Launch" : "Coming Soon"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
        
        <Box sx={{ mt: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Educational Resources
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Our molecular biotechnology resources are based on the textbook "Molecular Biotechnology: Principles and Applications of Recombinant DNA" and provide a comprehensive educational platform for students, researchers, and biotechnology enthusiasts.
                </Typography>
                <Typography variant="body2">
                  These interactive tools and simulations complement traditional learning methods, allowing users to gain hands-on experience with key biotechnology concepts and techniques in a virtual environment.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <HealthAndSafetyIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5" component="h3" color="primary">
                    Biotechnology Applications
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  Molecular biotechnology has transformative applications across numerous fields including medicine, agriculture, environmental science, forensics, and industrial bioprocessing.
                </Typography>
                <Typography variant="body2">
                  Our educational platform highlights how recombinant DNA technology is applied to develop therapeutics, create genetically modified organisms, analyze DNA evidence, produce biofuels, and address environmental challenges through sustainable biological approaches.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}

export default MolecularBiotechnologyPage;