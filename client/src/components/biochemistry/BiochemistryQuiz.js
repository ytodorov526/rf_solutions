import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Alert,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  MenuItem,
  Select,
  InputLabel
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ScienceIcon from '@mui/icons-material/Science';

// Quiz questions database categorized by topic (including 80 additional questions)
const quizQuestions = {
  basics: [
    {
      id: 1,
      category: "Biochemistry Basics",
      question: "Which of the following is NOT one of the four major classes of biomolecules?",
      options: [
        "Carbohydrates",
        "Lipids",
        "Minerals",
        "Proteins"
      ],
      correctAnswer: 2,
      explanation: "The four major classes of biomolecules are carbohydrates, lipids, proteins, and nucleic acids. Minerals, while essential for life, are not considered one of the main classes of biomolecules."
    },
    {
      id: 2,
      category: "Biochemistry Basics",
      question: "What is the process by which cells break down glucose to produce ATP?",
      options: [
        "Photosynthesis",
        "Glycolysis",
        "Krebs cycle",
        "Oxidative phosphorylation"
      ],
      correctAnswer: 1,
      explanation: "Glycolysis is the metabolic pathway that converts glucose into pyruvate, producing a small amount of ATP. It's the first step in cellular respiration and occurs in the cytoplasm of all cells."
    },
    {
      id: 3,
      category: "Biochemistry Basics",
      question: "Which of the following statements about enzymes is FALSE?",
      options: [
        "Enzymes lower the activation energy of reactions",
        "Enzymes are consumed during reactions",
        "Enzymes are typically proteins",
        "Enzymes can be regulated by inhibitors"
      ],
      correctAnswer: 1,
      explanation: "Enzymes are not consumed during reactions; they are biological catalysts that speed up reactions without being permanently altered. They can be reused many times."
    },
    {
      id: 4,
      category: "Biochemistry Basics",
      question: "What is the primary role of coenzymes in biochemical reactions?",
      options: [
        "To provide energy for the reaction",
        "To transfer chemical groups between molecules",
        "To denature proteins",
        "To inhibit enzyme activity"
      ],
      correctAnswer: 1,
      explanation: "Coenzymes primarily function to transfer chemical groups (such as electrons, hydrogen atoms, or functional groups) between molecules during enzyme-catalyzed reactions. Examples include NAD+, NADP+, and coenzyme A."
    },
    {
      id: 5,
      category: "Biochemistry Basics",
      question: "Which bond type is responsible for the primary structure of proteins?",
      options: [
        "Hydrogen bonds",
        "Disulfide bridges",
        "Peptide bonds",
        "Ionic bonds"
      ],
      correctAnswer: 2,
      explanation: "The primary structure of proteins is determined by the sequence of amino acids connected by peptide bonds. These covalent bonds form between the carboxyl group of one amino acid and the amino group of another."
    }
  ],
  proteins: [
    {
      id: 6,
      category: "Proteins",
      question: "What is the basic building block of proteins?",
      options: [
        "Fatty acids",
        "Nucleotides",
        "Monosaccharides",
        "Amino acids"
      ],
      correctAnswer: 3,
      explanation: "Amino acids are the basic building blocks of proteins. There are 20 standard amino acids that can be combined in different sequences to form the vast array of proteins found in nature."
    },
    {
      id: 7,
      category: "Proteins",
      question: "Which level of protein structure refers to the three-dimensional arrangement of the entire protein molecule?",
      options: [
        "Primary structure",
        "Secondary structure",
        "Tertiary structure",
        "Quaternary structure"
      ],
      correctAnswer: 2,
      explanation: "Tertiary structure refers to the overall three-dimensional arrangement of a single protein molecule. It's stabilized by various interactions including hydrogen bonds, ionic bonds, hydrophobic interactions, and disulfide bridges."
    },
    {
      id: 8,
      category: "Proteins",
      question: "What type of secondary structure is characterized by a right-handed spiral arrangement of amino acids?",
      options: [
        "Beta sheet",
        "Alpha helix",
        "Beta turn",
        "Random coil"
      ],
      correctAnswer: 1,
      explanation: "The alpha helix is a common secondary structure characterized by a right-handed spiral arrangement of amino acids. It's stabilized by hydrogen bonds between the C=O group of one amino acid and the N-H group of another amino acid located four residues later in the sequence."
    },
    {
      id: 9,
      category: "Proteins",
      question: "Which amino acid is often found at beta turns in protein structures?",
      options: [
        "Proline",
        "Alanine",
        "Leucine",
        "Phenylalanine"
      ],
      correctAnswer: 0,
      explanation: "Proline is often found at beta turns in protein structures. Its unique cyclic structure creates a fixed angle in the peptide backbone, which disrupts regular secondary structures like alpha helices and facilitates the chain's ability to change direction."
    },
    {
      id: 10,
      category: "Proteins",
      question: "What process describes the loss of a protein's native structure due to external stresses?",
      options: [
        "Hydrolysis",
        "Denaturation",
        "Phosphorylation",
        "Glycosylation"
      ],
      correctAnswer: 1,
      explanation: "Denaturation is the process where proteins lose their native structure due to external stresses such as heat, strong acids/bases, organic solvents, or heavy metals. This typically results in loss of biological function."
    }
  ],
  metabolism: [
    {
      id: 11,
      category: "Metabolism",
      question: "In which cellular compartment does the citric acid cycle (Krebs cycle) take place?",
      options: [
        "Cytoplasm",
        "Mitochondrial matrix",
        "Endoplasmic reticulum",
        "Nucleus"
      ],
      correctAnswer: 1,
      explanation: "The citric acid cycle (Krebs cycle) takes place in the mitochondrial matrix. This cycle is a key metabolic pathway that connects carbohydrate, fat, and protein metabolism."
    },
    {
      id: 12,
      category: "Metabolism",
      question: "Which of the following is NOT a high-energy compound in metabolism?",
      options: [
        "ATP",
        "Phosphoenolpyruvate (PEP)",
        "Creatine phosphate",
        "Glucose"
      ],
      correctAnswer: 3,
      explanation: "Glucose is not a high-energy compound in metabolism. ATP, phosphoenolpyruvate (PEP), and creatine phosphate all contain high-energy phosphate bonds that, when hydrolyzed, release significant amounts of energy that can power cellular processes."
    },
    {
      id: 13,
      category: "Metabolism",
      question: "What is the rate-limiting enzyme in cholesterol biosynthesis?",
      options: [
        "HMG-CoA reductase",
        "Citrate synthase",
        "Pyruvate kinase",
        "Phosphofructokinase"
      ],
      correctAnswer: 0,
      explanation: "HMG-CoA reductase (3-hydroxy-3-methylglutaryl-CoA reductase) is the rate-limiting enzyme in cholesterol biosynthesis. It catalyzes the conversion of HMG-CoA to mevalonate. Many cholesterol-lowering drugs (statins) work by inhibiting this enzyme."
    },
    {
      id: 14,
      category: "Metabolism",
      question: "Which of the following pathways is primarily responsible for fatty acid synthesis?",
      options: [
        "Glycolysis",
        "Gluconeogenesis",
        "Beta-oxidation",
        "Lipogenesis"
      ],
      correctAnswer: 3,
      explanation: "Lipogenesis is the metabolic pathway responsible for fatty acid synthesis. It occurs primarily in the liver and adipose tissue and is activated when there's an excess of energy substrates, particularly carbohydrates."
    },
    {
      id: 15,
      category: "Metabolism",
      question: "What is the end product of glycolysis under anaerobic conditions?",
      options: [
        "Pyruvate",
        "Acetyl-CoA",
        "Lactate",
        "Carbon dioxide"
      ],
      correctAnswer: 2,
      explanation: "Under anaerobic conditions (when oxygen is limited), the end product of glycolysis is lactate (lactic acid). This occurs because NAD+ needs to be regenerated for glycolysis to continue, and in the absence of oxygen, pyruvate is converted to lactate by lactate dehydrogenase."
    }
  ],
  nucleicAcids: [
    {
      id: 16,
      category: "Nucleic Acids",
      question: "Which nucleotide base is found in RNA but not in DNA?",
      options: [
        "Adenine",
        "Guanine",
        "Thymine",
        "Uracil"
      ],
      correctAnswer: 3,
      explanation: "Uracil is found in RNA but not in DNA. In DNA, thymine (T) pairs with adenine (A), while in RNA, uracil (U) replaces thymine and pairs with adenine."
    },
    {
      id: 17,
      category: "Nucleic Acids",
      question: "What is the primary role of transfer RNA (tRNA) in protein synthesis?",
      options: [
        "Carrying genetic information from DNA",
        "Bringing amino acids to ribosomes",
        "Forming the structure of ribosomes",
        "Catalyzing peptide bond formation"
      ],
      correctAnswer: 1,
      explanation: "The primary role of transfer RNA (tRNA) is to bring amino acids to the ribosomes during protein synthesis. Each tRNA molecule has a specific anticodon that recognizes and binds to the corresponding codon on messenger RNA (mRNA)."
    },
    {
      id: 18,
      category: "Nucleic Acids",
      question: "What enzyme is responsible for synthesizing RNA from a DNA template?",
      options: [
        "DNA polymerase",
        "RNA polymerase",
        "Reverse transcriptase",
        "Helicase"
      ],
      correctAnswer: 1,
      explanation: "RNA polymerase is the enzyme responsible for synthesizing RNA from a DNA template in a process called transcription. It reads the DNA template strand and synthesizes an RNA molecule with complementary nucleotides."
    },
    {
      id: 19,
      category: "Nucleic Acids",
      question: "During DNA replication, what is the function of DNA ligase?",
      options: [
        "To unwind the DNA double helix",
        "To synthesize new DNA strands",
        "To join DNA fragments together",
        "To remove RNA primers"
      ],
      correctAnswer: 2,
      explanation: "DNA ligase is responsible for joining DNA fragments together during DNA replication. Specifically, it seals the gaps between Okazaki fragments on the lagging strand by catalyzing the formation of phosphodiester bonds."
    },
    {
      id: 20,
      category: "Nucleic Acids",
      question: "What type of chemical bond links adjacent nucleotides in a DNA strand?",
      options: [
        "Phosphodiester bond",
        "Hydrogen bond",
        "Glycosidic bond",
        "Peptide bond"
      ],
      correctAnswer: 0,
      explanation: "Adjacent nucleotides in a DNA strand are linked by phosphodiester bonds. These covalent bonds form between the 3' hydroxyl group of one nucleotide and the 5' phosphate group of the next nucleotide, creating the sugar-phosphate backbone of DNA."
    }
  ],
  lipids: [
    {
      id: 21,
      category: "Lipids",
      question: "Which of the following is NOT a major function of lipids in biological systems?",
      options: [
        "Energy storage",
        "Cell membrane structure",
        "Enzymatic catalysis",
        "Hormonal signaling"
      ],
      correctAnswer: 2,
      explanation: "Enzymatic catalysis is not a major function of lipids. This role is primarily fulfilled by proteins. Lipids mainly function in energy storage (triglycerides), cell membrane structure (phospholipids), hormonal signaling (steroids), and insulation/protection."
    },
    {
      id: 22,
      category: "Lipids",
      question: "What is the primary component of cell membranes?",
      options: [
        "Triglycerides",
        "Phospholipids",
        "Waxes",
        "Steroids"
      ],
      correctAnswer: 1,
      explanation: "Phospholipids are the primary component of cell membranes. Their amphipathic nature (having both hydrophilic and hydrophobic regions) allows them to form bilayers, which serve as the structural foundation for cellular membranes."
    },
    {
      id: 23,
      category: "Lipids",
      question: "Which of the following is a characteristic of saturated fatty acids?",
      options: [
        "They contain one or more double bonds",
        "They have lower melting points than unsaturated fatty acids",
        "They are typically solid at room temperature",
        "They have a bent or kinked structure"
      ],
      correctAnswer: 2,
      explanation: "Saturated fatty acids are typically solid at room temperature. They contain no double bonds between carbon atoms, allowing them to pack tightly together, resulting in higher melting points compared to unsaturated fatty acids."
    },
    {
      id: 24,
      category: "Lipids",
      question: "Which of the following is NOT a steroid hormone?",
      options: [
        "Estrogen",
        "Testosterone",
        "Cortisol",
        "Insulin"
      ],
      correctAnswer: 3,
      explanation: "Insulin is not a steroid hormone; it is a peptide hormone produced by the beta cells of the pancreas. Estrogen, testosterone, and cortisol are all steroid hormones derived from cholesterol."
    },
    {
      id: 25,
      category: "Lipids",
      question: "What is the primary function of cholesterol in cell membranes?",
      options: [
        "Energy storage",
        "Regulating membrane fluidity",
        "Facilitating active transport",
        "Cellular recognition"
      ],
      correctAnswer: 1,
      explanation: "The primary function of cholesterol in cell membranes is regulating membrane fluidity. It inserts itself between phospholipid molecules, preventing them from packing too tightly at low temperatures, but also limiting excessive movement at higher temperatures."
    }
  ],
  carbohydrates: [
    {
      id: 26,
      category: "Carbohydrates",
      question: "Which of the following is NOT a monosaccharide?",
      options: [
        "Glucose",
        "Fructose",
        "Sucrose",
        "Galactose"
      ],
      correctAnswer: 2,
      explanation: "Sucrose is not a monosaccharide; it is a disaccharide composed of glucose and fructose. Glucose, fructose, and galactose are all monosaccharides, which are the simplest form of carbohydrates."
    },
    {
      id: 27,
      category: "Carbohydrates",
      question: "What type of bond connects monosaccharides in glycogen?",
      options: [
        "Peptide bond",
        "Hydrogen bond",
        "Glycosidic bond",
        "Ionic bond"
      ],
      correctAnswer: 2,
      explanation: "Monosaccharides in glycogen are connected by glycosidic bonds. Specifically, glycogen consists of glucose units linked by α-1,4-glycosidic bonds with α-1,6-glycosidic bonds at branch points."
    },
    {
      id: 28,
      category: "Carbohydrates",
      question: "Which polysaccharide serves as the primary energy storage molecule in animals?",
      options: [
        "Cellulose",
        "Starch",
        "Glycogen",
        "Chitin"
      ],
      correctAnswer: 2,
      explanation: "Glycogen serves as the primary energy storage molecule in animals. It is stored mainly in the liver and muscles and can be quickly broken down to release glucose when energy is needed."
    },
    {
      id: 29,
      category: "Carbohydrates",
      question: "What is the difference between α-glucose and β-glucose?",
      options: [
        "The position of the hydroxyl group on carbon 1",
        "The number of carbon atoms",
        "The presence of a phosphate group",
        "The molecular weight"
      ],
      correctAnswer: 0,
      explanation: "The difference between α-glucose and β-glucose is the position of the hydroxyl group on carbon 1 (the anomeric carbon). In α-glucose, this hydroxyl group is on the opposite side of the ring from the CH2OH group at carbon 6, while in β-glucose, it's on the same side."
    },
    {
      id: 30,
      category: "Carbohydrates",
      question: "Which of the following statements about cellulose is FALSE?",
      options: [
        "It is the most abundant organic compound on Earth",
        "It is composed of β-glucose units",
        "It can be digested by humans",
        "It provides structural support in plant cell walls"
      ],
      correctAnswer: 2,
      explanation: "The statement that cellulose can be digested by humans is false. Humans lack the enzyme cellulase, which is necessary to break the β-1,4-glycosidic bonds in cellulose. Therefore, cellulose passes through the human digestive system largely unchanged, functioning as dietary fiber."
    }
  ],
  enzymes: [
    {
      id: 31,
      category: "Enzymes",
      question: "What is the relationship between an enzyme's active site and its substrate?",
      options: [
        "The active site repels the substrate",
        "The active site has a shape complementary to the substrate",
        "The active site permanently binds to the substrate",
        "The active site always has the same shape regardless of the substrate"
      ],
      correctAnswer: 1,
      explanation: "The active site of an enzyme has a shape complementary to its substrate, often described by the 'lock and key' or the more flexible 'induced fit' model. This complementary structure allows specific binding of the substrate to the enzyme."
    },
    {
      id: 32,
      category: "Enzymes",
      question: "Which of the following is a characteristic of competitive enzyme inhibition?",
      options: [
        "The inhibitor binds to the enzyme-substrate complex",
        "The inhibitor changes the shape of the active site",
        "The inhibitor binds to a site other than the active site",
        "The inhibitor competes with the substrate for the active site"
      ],
      correctAnswer: 3,
      explanation: "In competitive enzyme inhibition, the inhibitor competes with the substrate for the active site of the enzyme. This competition can be overcome by increasing the substrate concentration, which makes it more likely for the substrate to bind to the enzyme than the inhibitor."
    },
    {
      id: 33,
      category: "Enzymes",
      question: "What does the Michaelis-Menten constant (Km) represent?",
      options: [
        "The maximum reaction velocity",
        "The substrate concentration at half-maximum reaction velocity",
        "The enzyme concentration needed for maximum reaction velocity",
        "The inhibitor concentration needed to halve the reaction velocity"
      ],
      correctAnswer: 1,
      explanation: "The Michaelis-Menten constant (Km) represents the substrate concentration at which the reaction velocity is half of the maximum velocity (Vmax). It is a measure of the affinity of the enzyme for its substrate—a lower Km indicates higher affinity."
    },
    {
      id: 34,
      category: "Enzymes",
      question: "Which factor generally does NOT affect enzyme activity?",
      options: [
        "Temperature",
        "pH",
        "Nuclear radiation",
        "Substrate concentration"
      ],
      correctAnswer: 2,
      explanation: "Nuclear radiation generally does not directly affect enzyme activity in the way that temperature, pH, or substrate concentration do. While high levels of radiation can damage proteins through ionization, this is not a normal physiological factor affecting enzyme kinetics."
    },
    {
      id: 35,
      category: "Enzymes",
      question: "What is the role of allosteric regulation in enzyme activity?",
      options: [
        "It permanently inactivates enzymes",
        "It changes enzyme activity by binding regulators to sites other than the active site",
        "It modifies the enzyme's chemical composition",
        "It breaks down enzymes when they are no longer needed"
      ],
      correctAnswer: 1,
      explanation: "Allosteric regulation changes enzyme activity by binding regulatory molecules to sites other than the active site (allosteric sites). These regulators can either activate or inhibit the enzyme by inducing conformational changes that affect the active site."
    }
  ],
  advanced: [
    {
      id: 36,
      category: "Advanced Biochemistry",
      question: "What is the role of ubiquitin in cellular processes?",
      options: [
        "DNA repair",
        "Protein degradation targeting",
        "Lipid transport",
        "Carbohydrate metabolism"
      ],
      correctAnswer: 1,
      explanation: "Ubiquitin is a small protein that marks other proteins for degradation by the proteasome. Through a process called ubiquitination, ubiquitin molecules are attached to proteins that need to be degraded, serving as a targeting signal in the ubiquitin-proteasome pathway."
    },
    {
      id: 37,
      category: "Advanced Biochemistry",
      question: "Which of the following best describes epigenetic modifications?",
      options: [
        "Changes in DNA sequence",
        "Modifications that alter gene expression without changing the DNA sequence",
        "Insertions of foreign DNA into the genome",
        "Deletions of portions of chromosomes"
      ],
      correctAnswer: 1,
      explanation: "Epigenetic modifications are changes that alter gene expression without changing the underlying DNA sequence. Examples include DNA methylation, histone modifications, and chromatin remodeling, which can affect how genes are expressed."
    },
    {
      id: 38,
      category: "Advanced Biochemistry",
      question: "What is the function of chaperone proteins in cells?",
      options: [
        "To transport lipids across cell membranes",
        "To assist in protein folding and prevent misfolding",
        "To degrade damaged proteins",
        "To synthesize new proteins"
      ],
      correctAnswer: 1,
      explanation: "Chaperone proteins assist in protein folding and prevent misfolding and aggregation. They do not form part of the final protein structure but help other proteins achieve their correct three-dimensional conformation. Examples include heat shock proteins (HSPs)."
    },
    {
      id: 39,
      category: "Advanced Biochemistry",
      question: "Which of the following is NOT a type of RNA involved in protein synthesis?",
      options: [
        "mRNA",
        "tRNA",
        "rRNA",
        "siRNA"
      ],
      correctAnswer: 3,
      explanation: "siRNA (small interfering RNA) is not directly involved in protein synthesis. It plays a role in RNA interference (RNAi), a process that regulates gene expression by silencing specific genes. mRNA, tRNA, and rRNA (messenger, transfer, and ribosomal RNA) are all involved in protein synthesis."
    },
    {
      id: 40,
      category: "Advanced Biochemistry",
      question: "What is the primary function of the pentose phosphate pathway?",
      options: [
        "Energy production through ATP synthesis",
        "Generation of NADPH and ribose-5-phosphate",
        "Breakdown of fatty acids",
        "Synthesis of amino acids"
      ],
      correctAnswer: 1,
      explanation: "The primary function of the pentose phosphate pathway is the generation of NADPH (used in reductive biosynthesis and antioxidant defense) and ribose-5-phosphate (used in nucleotide synthesis). It's an alternative pathway to glycolysis for glucose metabolism."
    },
    {
      id: 41,
      category: "Advanced Biochemistry",
      question: "What is the main function of proteomics in biochemical research?",
      options: [
        "Study of the complete set of proteins expressed by a genome",
        "Analysis of protein-protein interactions only",
        "Sequencing of DNA in a genome",
        "Study of RNA transcription"
      ],
      correctAnswer: 0,
      explanation: "Proteomics is the large-scale study of the proteome—the complete set of proteins expressed by a genome, cell, tissue, or organism. It includes identification, quantification, and analysis of protein structure, function, modifications, and interactions."
    },
    {
      id: 42,
      category: "Advanced Biochemistry",
      question: "What are sirtuins primarily known for in cellular biochemistry?",
      options: [
        "DNA replication enzymes",
        "NAD+-dependent deacetylases involved in aging and metabolism",
        "Membrane transport proteins",
        "Structural components of the cytoskeleton"
      ],
      correctAnswer: 1,
      explanation: "Sirtuins are NAD+-dependent deacetylases that play important roles in aging, metabolism, and stress response. They remove acetyl groups from proteins (including histones) and require NAD+ as a cofactor, linking their activity to cellular energy status."
    },
    {
      id: 43,
      category: "Advanced Biochemistry",
      question: "What is the significance of the 'central dogma' of molecular biology?",
      options: [
        "It describes the unidirectional flow of genetic information from DNA to RNA to protein",
        "It states that all enzymes are proteins",
        "It explains how ATP provides energy for cellular processes",
        "It defines how cell membranes regulate molecular transport"
      ],
      correctAnswer: 0,
      explanation: "The central dogma of molecular biology describes the unidirectional flow of genetic information from DNA to RNA to protein. It states that DNA is transcribed to RNA, which is then translated into proteins. While there are some exceptions (like reverse transcription in retroviruses), this principle underlies most genetic processes."
    },
    {
      id: 44,
      category: "Advanced Biochemistry",
      question: "What is the role of CRISPR-Cas9 in bacterial cells?",
      options: [
        "DNA repair mechanism",
        "Protein synthesis regulation",
        "Adaptive immune system against viral DNA",
        "Carbohydrate metabolism"
      ],
      correctAnswer: 2,
      explanation: "CRISPR-Cas9 naturally functions as an adaptive immune system in bacteria, protecting them against viral infections. It stores fragments of viral DNA (spacers) between CRISPR repeats and uses Cas proteins to recognize and cleave matching viral DNA sequences during subsequent infections."
    },
    {
      id: 45,
      category: "Advanced Biochemistry",
      question: "What does mass spectrometry primarily measure in biochemical analysis?",
      options: [
        "Mass-to-charge ratio of molecules",
        "Optical density of solutions",
        "Reaction rates of enzymes",
        "DNA sequence information"
      ],
      correctAnswer: 0,
      explanation: "Mass spectrometry measures the mass-to-charge ratio (m/z) of ions. In biochemistry, it's used to determine the molecular weight, structure, and composition of biomolecules after they've been ionized. This technique is crucial for proteomics, metabolomics, and many other areas of biochemical research."
    }
  ],
  bioenergetics: [
    {
      id: 46,
      category: "Bioenergetics",
      question: "Which statement about ATP is correct?",
      options: [
        "ATP stores energy in its carbon-carbon bonds",
        "ATP releases energy when phosphate groups are added",
        "ATP stores energy in phosphoanhydride bonds",
        "ATP is primarily used for long-term energy storage"
      ],
      correctAnswer: 2,
      explanation: "ATP stores energy in its phosphoanhydride bonds (between phosphate groups). When these bonds are hydrolyzed, energy is released that can be used for cellular processes. The terminal phosphate bond is particularly energy-rich."
    },
    {
      id: 47,
      category: "Bioenergetics",
      question: "What is the primary role of electron carriers like NAD+ in metabolism?",
      options: [
        "Direct synthesis of ATP",
        "Transport of electrons and hydrogen atoms in oxidation-reduction reactions",
        "Breaking down glucose molecules",
        "Regulation of enzyme activity"
      ],
      correctAnswer: 1,
      explanation: "Electron carriers like NAD+ (nicotinamide adenine dinucleotide) primarily function to transport electrons and hydrogen atoms in oxidation-reduction reactions. NAD+ accepts electrons and a hydrogen ion to become NADH during catabolic reactions, and NADH donates these electrons during processes like oxidative phosphorylation."
    },
    {
      id: 48,
      category: "Bioenergetics",
      question: "Which of the following processes yields the most ATP per glucose molecule?",
      options: [
        "Glycolysis alone",
        "Krebs cycle alone",
        "Fermentation",
        "Complete aerobic respiration"
      ],
      correctAnswer: 3,
      explanation: "Complete aerobic respiration yields the most ATP per glucose molecule (approximately 30-32 ATP). This includes glycolysis (2 ATP), the Krebs cycle (2 ATP via substrate-level phosphorylation), and oxidative phosphorylation (~26-28 ATP from the electron transport chain)."
    },
    {
      id: 49,
      category: "Bioenergetics",
      question: "What is the primary function of the electron transport chain?",
      options: [
        "Direct synthesis of glucose",
        "Generation of a proton gradient for ATP synthesis",
        "Breakdown of fatty acids",
        "Production of carbon dioxide"
      ],
      correctAnswer: 1,
      explanation: "The primary function of the electron transport chain is to generate a proton gradient across the inner mitochondrial membrane. Electrons from NADH and FADH2 are passed through a series of protein complexes, and the energy released is used to pump protons into the intermembrane space, creating a gradient that drives ATP synthesis via ATP synthase."
    },
    {
      id: 50,
      category: "Bioenergetics",
      question: "What is the relationship between ΔG (Gibbs free energy change) and spontaneity of a biochemical reaction?",
      options: [
        "Positive ΔG means a reaction is spontaneous",
        "ΔG has no relationship to spontaneity",
        "Negative ΔG means a reaction is spontaneous",
        "ΔG only relates to reaction rate, not spontaneity"
      ],
      correctAnswer: 2,
      explanation: "A negative ΔG (Gibbs free energy change) indicates that a reaction is spontaneous, meaning it can proceed without energy input. The more negative the ΔG, the more energetically favorable the reaction. A positive ΔG means the reaction is non-spontaneous and requires energy input to proceed."
    },
    {
      id: 51,
      category: "Bioenergetics",
      question: "Which enzyme complex of the electron transport chain directly uses the proton gradient to synthesize ATP?",
      options: [
        "Complex I (NADH dehydrogenase)",
        "Complex IV (cytochrome c oxidase)",
        "ATP synthase (Complex V)",
        "Complex III (cytochrome bc1 complex)"
      ],
      correctAnswer: 2,
      explanation: "ATP synthase (Complex V) directly uses the proton gradient to synthesize ATP. As protons flow back into the mitochondrial matrix through ATP synthase, the energy of this flow drives the rotation of parts of the enzyme, catalyzing the addition of a phosphate group to ADP to form ATP."
    },
    {
      id: 52,
      category: "Bioenergetics",
      question: "What happens in substrate-level phosphorylation?",
      options: [
        "Electrons are transferred directly to oxygen",
        "A phosphate group is transferred directly from a substrate to ADP",
        "Protons are pumped across a membrane",
        "Glucose is converted to pyruvate"
      ],
      correctAnswer: 1,
      explanation: "In substrate-level phosphorylation, a phosphate group is transferred directly from a high-energy substrate to ADP to form ATP. This occurs without the involvement of the electron transport chain or proton gradient. Examples include steps in glycolysis and the Krebs cycle."
    },
    {
      id: 53,
      category: "Bioenergetics",
      question: "Which of the following is considered a high-energy compound in biochemistry?",
      options: [
        "Glucose",
        "Phosphoenolpyruvate (PEP)",
        "Carbon dioxide",
        "Calcium ions"
      ],
      correctAnswer: 1,
      explanation: "Phosphoenolpyruvate (PEP) is considered a high-energy compound in biochemistry. It contains a high-energy phosphate bond that, when hydrolyzed, releases more energy than ATP. PEP is an intermediate in glycolysis and transfers its phosphate group to ADP to form ATP in a reaction catalyzed by pyruvate kinase."
    },
    {
      id: 54,
      category: "Bioenergetics",
      question: "What is the role of oxygen in aerobic respiration?",
      options: [
        "Oxygen is the initial electron donor",
        "Oxygen is the final electron acceptor",
        "Oxygen directly provides energy for ATP synthesis",
        "Oxygen is converted to carbon dioxide"
      ],
      correctAnswer: 1,
      explanation: "Oxygen serves as the final electron acceptor in aerobic respiration. At the end of the electron transport chain, oxygen accepts electrons and protons to form water (H2O). This allows the electron transport chain to continue functioning, maintaining the proton gradient necessary for ATP synthesis."
    },
    {
      id: 55,
      category: "Bioenergetics",
      question: "What is the primary energy source for most cellular activities?",
      options: [
        "Glucose",
        "Adenosine triphosphate (ATP)",
        "Nicotinamide adenine dinucleotide (NAD+)",
        "Amino acids"
      ],
      correctAnswer: 1,
      explanation: "Adenosine triphosphate (ATP) is the primary energy source for most cellular activities. It serves as the main energy currency of cells, providing energy for processes such as active transport, muscle contraction, and biosynthesis through the hydrolysis of its phosphate bonds."
    }
  ],
  molecularBiology: [
    {
      id: 56,
      category: "Molecular Biology",
      question: "Which of the following is NOT part of a nucleotide?",
      options: [
        "Phosphate group",
        "Pentose sugar",
        "Nitrogenous base",
        "Amino acid"
      ],
      correctAnswer: 3,
      explanation: "An amino acid is not part of a nucleotide. Nucleotides, the building blocks of nucleic acids, consist of a phosphate group, a pentose sugar (deoxyribose in DNA, ribose in RNA), and a nitrogenous base (adenine, guanine, cytosine, thymine in DNA, or uracil in RNA)."
    },
    {
      id: 57,
      category: "Molecular Biology",
      question: "What is the process by which information from a gene is used to synthesize a functional gene product?",
      options: [
        "Translation",
        "Transcription",
        "Replication",
        "Gene expression"
      ],
      correctAnswer: 3,
      explanation: "Gene expression is the process by which information from a gene is used to synthesize a functional gene product. This typically includes both transcription (DNA to RNA) and translation (RNA to protein), although for some genes, the final product is a functional RNA molecule."
    },
    {
      id: 58,
      category: "Molecular Biology",
      question: "What is the function of DNA polymerase in DNA replication?",
      options: [
        "To unwind the DNA double helix",
        "To synthesize new DNA strands complementary to the template strands",
        "To join Okazaki fragments",
        "To add RNA primers"
      ],
      correctAnswer: 1,
      explanation: "DNA polymerase synthesizes new DNA strands complementary to the template strands during DNA replication. It adds nucleotides to the growing DNA chain in the 5' to 3' direction, but can only add nucleotides to an existing 3'-OH group, which is why RNA primers are needed to start synthesis."
    },
    {
      id: 59,
      category: "Molecular Biology",
      question: "What is the significance of the genetic code being 'degenerate'?",
      options: [
        "It means the code is prone to errors",
        "It means some codons don't code for any amino acid",
        "It means multiple codons can specify the same amino acid",
        "It means the code can change over time"
      ],
      correctAnswer: 2,
      explanation: "The genetic code being 'degenerate' means that multiple codons can specify the same amino acid. For example, the amino acid leucine can be coded for by six different codons (UUA, UUG, CUU, CUC, CUA, CUG). This redundancy provides some protection against the effects of mutations."
    },
    {
      id: 60,
      category: "Molecular Biology",
      question: "Which process converts the information in mRNA into a protein?",
      options: [
        "Transcription",
        "Translation",
        "Replication",
        "Post-translational modification"
      ],
      correctAnswer: 1,
      explanation: "Translation is the process that converts the information in mRNA into a protein. During translation, the mRNA sequence is read by ribosomes, and tRNAs bring the corresponding amino acids to build the protein according to the genetic code."
    },
    {
      id: 61,
      category: "Molecular Biology",
      question: "What is the function of a promoter in gene expression?",
      options: [
        "It terminates transcription",
        "It initiates translation",
        "It provides a binding site for RNA polymerase to initiate transcription",
        "It regulates post-translational modifications"
      ],
      correctAnswer: 2,
      explanation: "A promoter provides a binding site for RNA polymerase to initiate transcription. It is a specific DNA sequence located upstream of a gene that signals where transcription should begin and helps regulate gene expression."
    },
    {
      id: 62,
      category: "Molecular Biology",
      question: "What is the function of restriction enzymes in molecular biology?",
      options: [
        "They join DNA fragments together",
        "They cut DNA at specific recognition sites",
        "They synthesize new DNA strands",
        "They translate mRNA into proteins"
      ],
      correctAnswer: 1,
      explanation: "Restriction enzymes cut DNA at specific recognition sites, creating fragments with defined ends. These bacterial enzymes naturally function in defense against viral DNA, but in molecular biology, they are crucial tools for genetic engineering, DNA mapping, and cloning."
    },
    {
      id: 63,
      category: "Molecular Biology",
      question: "What modification often occurs to eukaryotic mRNA before it leaves the nucleus?",
      options: [
        "Addition of a 5' cap and 3' poly-A tail",
        "Removal of introns and splicing of exons",
        "Methylation of specific bases",
        "Both A and B"
      ],
      correctAnswer: 3,
      explanation: "Both the addition of a 5' cap and 3' poly-A tail AND the removal of introns (splicing) occur as post-transcriptional modifications to eukaryotic mRNA before it leaves the nucleus. These modifications protect the mRNA and ensure proper translation in the cytoplasm."
    },
    {
      id: 64,
      category: "Molecular Biology",
      question: "What does the term 'open reading frame' (ORF) refer to in molecular biology?",
      options: [
        "A section of DNA that has been unwound for replication",
        "A sequence of DNA or RNA that can be translated into a protein",
        "A region of a gene that doesn't code for amino acids",
        "The three-dimensional structure of DNA"
      ],
      correctAnswer: 1,
      explanation: "An open reading frame (ORF) is a sequence of DNA or RNA that can be translated into a protein. It starts with a start codon (usually AUG), contains a series of codons that specify amino acids, and ends with a stop codon. ORFs are used to identify potential protein-coding regions in genomes."
    },
    {
      id: 65,
      category: "Molecular Biology",
      question: "What is the primary function of a ribosome?",
      options: [
        "DNA replication",
        "RNA transcription",
        "Protein synthesis",
        "Lipid metabolism"
      ],
      correctAnswer: 2,
      explanation: "The primary function of a ribosome is protein synthesis (translation). Ribosomes read the sequence of mRNA and assemble amino acids in the correct order to form polypeptides and proteins. They consist of rRNA and proteins, and are found in all living cells."
    }
  ],
  structuralBiochemistry: [
    {
      id: 66,
      category: "Structural Biochemistry",
      question: "Which forces contribute to the tertiary structure of proteins?",
      options: [
        "Only covalent bonds",
        "Only hydrogen bonds",
        "Multiple forces including hydrophobic interactions, hydrogen bonds, ionic bonds, and disulfide bridges",
        "Only peptide bonds"
      ],
      correctAnswer: 2,
      explanation: "Multiple forces contribute to the tertiary structure of proteins, including hydrophobic interactions (which often drive folding by burying nonpolar residues in the core), hydrogen bonds, ionic bonds (salt bridges), and covalent disulfide bridges between cysteine residues."
    },
    {
      id: 67,
      category: "Structural Biochemistry",
      question: "What structural feature is common to all amino acids (except proline)?",
      options: [
        "A carboxyl group, an amino group, and a side chain all attached to a central carbon atom",
        "A ring structure",
        "A sulfur atom",
        "A phosphate group"
      ],
      correctAnswer: 0,
      explanation: "All amino acids (except proline, which has a secondary amine) share a common structure: a central carbon atom (alpha carbon) bonded to a carboxyl group (–COOH), an amino group (–NH2), a hydrogen atom, and a variable side chain (R group) that gives each amino acid its unique properties."
    },
    {
      id: 68,
      category: "Structural Biochemistry",
      question: "Which of these techniques is NOT typically used for determining protein structure?",
      options: [
        "X-ray crystallography",
        "Nuclear magnetic resonance (NMR) spectroscopy",
        "Polymerase chain reaction (PCR)",
        "Cryo-electron microscopy"
      ],
      correctAnswer: 2,
      explanation: "Polymerase chain reaction (PCR) is not used for determining protein structure. PCR is a technique used to amplify DNA sequences. X-ray crystallography, NMR spectroscopy, and cryo-electron microscopy are all methods used to determine the three-dimensional structure of proteins."
    },
    {
      id: 69,
      category: "Structural Biochemistry",
      question: "What structural feature characterizes an alpha helix in proteins?",
      options: [
        "A flat sheet structure with adjacent polypeptide chains",
        "A right-handed spiral with hydrogen bonds parallel to the helix axis",
        "A random, unordered structure",
        "A loop connecting two secondary structures"
      ],
      correctAnswer: 1,
      explanation: "An alpha helix is characterized by a right-handed spiral structure where the polypeptide backbone forms the inner part of the spiral and the side chains extend outward. It is stabilized by hydrogen bonds between the C=O group of one residue and the N-H group of the residue four positions later in the sequence, parallel to the helix axis."
    },
    {
      id: 70,
      category: "Structural Biochemistry",
      question: "Which type of RNA has a cloverleaf secondary structure?",
      options: [
        "Messenger RNA (mRNA)",
        "Transfer RNA (tRNA)",
        "Ribosomal RNA (rRNA)",
        "Small nuclear RNA (snRNA)"
      ],
      correctAnswer: 1,
      explanation: "Transfer RNA (tRNA) has a characteristic cloverleaf secondary structure formed by base-pairing within the molecule. This structure includes three stem-loops (the D-loop, anticodon loop, and TΨC loop) and a variable loop, with the amino acid attachment site at the 3' end."
    },
    {
      id: 71,
      category: "Structural Biochemistry",
      question: "What is the major structural component of bacterial cell walls?",
      options: [
        "Phospholipid bilayer",
        "Peptidoglycan",
        "Cellulose",
        "Chitin"
      ],
      correctAnswer: 1,
      explanation: "Peptidoglycan is the major structural component of bacterial cell walls. It is a mesh-like polymer consisting of sugars (N-acetylglucosamine and N-acetylmuramic acid) cross-linked by peptide bridges. It provides structural strength and protection against osmotic pressure."
    },
    {
      id: 72,
      category: "Structural Biochemistry",
      question: "What is the structural difference between starch and cellulose?",
      options: [
        "Starch contains glucose, while cellulose contains fructose",
        "Starch has α-1,4-glycosidic bonds, while cellulose has β-1,4-glycosidic bonds",
        "Starch is a protein, while cellulose is a carbohydrate",
        "Starch is branched, while cellulose is always linear"
      ],
      correctAnswer: 1,
      explanation: "The key structural difference between starch and cellulose is the type of glycosidic bond: starch has α-1,4-glycosidic bonds (and α-1,6 at branch points in amylopectin), while cellulose has β-1,4-glycosidic bonds. This difference affects their three-dimensional structure and digestibility."
    },
    {
      id: 73,
      category: "Structural Biochemistry",
      question: "What is the structure of a phospholipid bilayer?",
      options: [
        "A single layer of phospholipids with hydrophilic heads facing outward",
        "A double layer with hydrophobic tails facing inward and hydrophilic heads facing outward",
        "A double layer with hydrophilic heads facing inward and hydrophobic tails facing outward",
        "A random arrangement of phospholipids"
      ],
      correctAnswer: 1,
      explanation: "A phospholipid bilayer consists of two layers of phospholipids arranged so that their hydrophobic tails face inward (toward each other) and their hydrophilic (phosphate) heads face outward, exposed to the aqueous environment on either side. This structure forms the foundation of all cellular membranes."
    },
    {
      id: 74,
      category: "Structural Biochemistry",
      question: "What is the quaternary structure of hemoglobin?",
      options: [
        "A monomer",
        "A dimer of identical subunits",
        "A tetramer with two alpha and two beta subunits",
        "A polymer of many identical subunits"
      ],
      correctAnswer: 2,
      explanation: "Hemoglobin has a quaternary structure consisting of a tetramer with two alpha and two beta subunits (α₂β₂). Each subunit contains a heme group that can bind oxygen, allowing hemoglobin to transport oxygen in the bloodstream."
    },
    {
      id: 75,
      category: "Structural Biochemistry",
      question: "What are domains in protein structure?",
      options: [
        "The linear sequence of amino acids",
        "Compact, semi-independent folding units within a protein",
        "The complete three-dimensional structure of a protein",
        "Regions where proteins interact with DNA"
      ],
      correctAnswer: 1,
      explanation: "Domains are compact, semi-independent folding units within a protein that often have specific functions. They typically fold independently and can sometimes function even when separated from the rest of the protein. Multi-domain proteins are common, especially in eukaryotes."
    }
  ],
  clinicalBiochemistry: [
    {
      id: 76,
      category: "Clinical Biochemistry",
      question: "Which enzyme is commonly measured to assess liver function?",
      options: [
        "Amylase",
        "Alanine aminotransferase (ALT)",
        "Creatine kinase (CK)",
        "Alkaline phosphatase (ALP)"
      ],
      correctAnswer: 1,
      explanation: "Alanine aminotransferase (ALT) is commonly measured to assess liver function. It is primarily found in liver cells, and elevated levels in the blood typically indicate liver damage or disease. Other liver enzymes include aspartate aminotransferase (AST) and gamma-glutamyl transferase (GGT)."
    },
    {
      id: 77,
      category: "Clinical Biochemistry",
      question: "What does an elevated level of hemoglobin A1c (HbA1c) indicate?",
      options: [
        "Recent alcohol consumption",
        "Average blood glucose levels over the past 2-3 months",
        "Acute liver damage",
        "Kidney dysfunction"
      ],
      correctAnswer: 1,
      explanation: "Elevated hemoglobin A1c (HbA1c) indicates higher average blood glucose levels over the past 2-3 months. HbA1c forms when glucose in the bloodstream attaches to hemoglobin in red blood cells. Since red blood cells live for about 3 months, HbA1c provides insight into long-term glucose control and is used to diagnose and monitor diabetes."
    },
    {
      id: 78,
      category: "Clinical Biochemistry",
      question: "Which of the following is NOT a plasma lipoprotein?",
      options: [
        "High-density lipoprotein (HDL)",
        "Low-density lipoprotein (LDL)",
        "Very low-density lipoprotein (VLDL)",
        "C-reactive protein (CRP)"
      ],
      correctAnswer: 3,
      explanation: "C-reactive protein (CRP) is not a plasma lipoprotein; it is an acute-phase protein produced by the liver in response to inflammation. HDL, LDL, and VLDL are all plasma lipoproteins that transport lipids (including cholesterol and triglycerides) through the bloodstream."
    },
    {
      id: 79,
      category: "Clinical Biochemistry",
      question: "What is the primary function of troponin tests in clinical settings?",
      options: [
        "Detecting liver disease",
        "Diagnosing myocardial infarction (heart attack)",
        "Assessing kidney function",
        "Monitoring glucose levels"
      ],
      correctAnswer: 1,
      explanation: "Troponin tests are primarily used to diagnose myocardial infarction (heart attack). Troponins (I and T) are proteins found in cardiac muscle cells that are released into the bloodstream when the heart is damaged. Elevated troponin levels can indicate heart muscle injury, most commonly from a heart attack."
    },
    {
      id: 80,
      category: "Clinical Biochemistry",
      question: "What biochemical marker is typically elevated in acute pancreatitis?",
      options: [
        "Amylase",
        "Creatine kinase",
        "Prostate-specific antigen (PSA)",
        "Thyroid-stimulating hormone (TSH)"
      ],
      correctAnswer: 0,
      explanation: "Amylase is typically elevated in acute pancreatitis. This enzyme is produced by the pancreas to help digest carbohydrates, and its levels rise in the bloodstream when the pancreas is inflamed or damaged. Lipase, another pancreatic enzyme, is also commonly measured and may be more specific for pancreatic injury."
    },
    {
      id: 81,
      category: "Clinical Biochemistry",
      question: "Which biochemical test is used to assess kidney function?",
      options: [
        "Alanine aminotransferase (ALT)",
        "Serum creatinine",
        "Amylase",
        "Creatine kinase (CK)"
      ],
      correctAnswer: 1,
      explanation: "Serum creatinine is used to assess kidney function. Creatinine is a waste product from muscle metabolism that is filtered by the kidneys. When kidney function declines, creatinine accumulates in the blood. Measuring serum creatinine, along with calculating estimated glomerular filtration rate (eGFR), helps evaluate kidney health."
    },
    {
      id: 82,
      category: "Clinical Biochemistry",
      question: "What does an elevated level of bilirubin in the blood indicate?",
      options: [
        "Muscle damage",
        "Pancreatic inflammation",
        "Liver dysfunction or bile duct obstruction",
        "Thyroid disorders"
      ],
      correctAnswer: 2,
      explanation: "Elevated bilirubin in the blood (hyperbilirubinemia) indicates liver dysfunction or bile duct obstruction. Bilirubin is a yellow compound produced during the breakdown of hemoglobin. The liver is responsible for processing bilirubin and excreting it in bile. Elevated levels can cause jaundice (yellowing of the skin and eyes)."
    },
    {
      id: 83,
      category: "Clinical Biochemistry",
      question: "What does a high level of low-density lipoprotein (LDL) in the blood indicate?",
      options: [
        "Increased risk of cardiovascular disease",
        "Liver damage",
        "Kidney dysfunction",
        "Pancreatic inflammation"
      ],
      correctAnswer: 0,
      explanation: "A high level of low-density lipoprotein (LDL) in the blood indicates an increased risk of cardiovascular disease. LDL is often called 'bad cholesterol' because it can build up in artery walls, forming plaques that narrow the arteries and increase the risk of heart attacks and strokes."
    },
    {
      id: 84,
      category: "Clinical Biochemistry",
      question: "Which of the following electrolytes is most important for neuromuscular function?",
      options: [
        "Chloride",
        "Bicarbonate",
        "Potassium",
        "Phosphate"
      ],
      correctAnswer: 2,
      explanation: "Potassium is crucial for neuromuscular function. It plays a vital role in generating action potentials in neurons and muscle cells, allowing for nerve signal transmission and muscle contraction. Both high (hyperkalemia) and low (hypokalemia) potassium levels can cause serious neuromuscular problems, including cardiac arrhythmias."
    },
    {
      id: 85,
      category: "Clinical Biochemistry",
      question: "What is the primary form of iron storage in the body?",
      options: [
        "Hemoglobin",
        "Transferrin",
        "Ferritin",
        "Myoglobin"
      ],
      correctAnswer: 2,
      explanation: "Ferritin is the primary form of iron storage in the body. It is a protein complex that stores iron in a soluble, non-toxic form, primarily in the liver, spleen, and bone marrow. Serum ferritin levels are used clinically to assess iron status, with low levels indicating iron deficiency and high levels potentially indicating iron overload or inflammation."
    }
  ],
  biotechnology: [
    {
      id: 86,
      category: "Biotechnology",
      question: "What is the purpose of PCR (Polymerase Chain Reaction) in molecular biology?",
      options: [
        "To separate proteins by size",
        "To amplify specific DNA sequences",
        "To determine protein structure",
        "To synthesize proteins from mRNA"
      ],
      correctAnswer: 1,
      explanation: "The purpose of PCR (Polymerase Chain Reaction) is to amplify specific DNA sequences. It creates millions of copies of a target DNA segment through repeated cycles of denaturation, primer annealing, and extension. PCR has numerous applications in research, forensics, clinical diagnostics, and genetic testing."
    },
    {
      id: 87,
      category: "Biotechnology",
      question: "Which technique is used to separate DNA fragments by size?",
      options: [
        "Western blotting",
        "Gel electrophoresis",
        "Mass spectrometry",
        "Flow cytometry"
      ],
      correctAnswer: 1,
      explanation: "Gel electrophoresis is used to separate DNA fragments by size. In this technique, DNA samples are loaded into wells of an agarose or polyacrylamide gel, and an electric field is applied. Since DNA is negatively charged, fragments migrate toward the positive electrode, with smaller fragments moving faster than larger ones."
    },
    {
      id: 88,
      category: "Biotechnology",
      question: "What is the main application of CRISPR-Cas9 technology?",
      options: [
        "Protein purification",
        "Gene sequencing",
        "Gene editing",
        "Protein structure determination"
      ],
      correctAnswer: 2,
      explanation: "The main application of CRISPR-Cas9 technology is gene editing. This revolutionary tool allows scientists to make precise, targeted changes to the genome of living cells. It consists of a guide RNA that directs the Cas9 enzyme to a specific DNA sequence, where Cas9 creates a double-strand break that can be repaired by adding, deleting, or changing nucleotides."
    },
    {
      id: 89,
      category: "Biotechnology",
      question: "Which technique is used to determine the sequence of nucleotides in a DNA sample?",
      options: [
        "Southern blotting",
        "DNA sequencing",
        "PCR",
        "Gel electrophoresis"
      ],
      correctAnswer: 1,
      explanation: "DNA sequencing is used to determine the sequence of nucleotides in a DNA sample. Modern methods include Sanger sequencing and next-generation sequencing (NGS) technologies. DNA sequencing has revolutionized biology and medicine, enabling genome mapping, identification of disease-causing mutations, and evolutionary studies."
    },
    {
      id: 90,
      category: "Biotechnology",
      question: "What is the purpose of a DNA library in molecular biology?",
      options: [
        "To store DNA samples at optimal temperatures",
        "To catalog published DNA sequences",
        "To collect a set of cloned DNA fragments representing a genome or specific DNA source",
        "To repair damaged DNA"
      ],
      correctAnswer: 2,
      explanation: "A DNA library is a collection of cloned DNA fragments that represent a genome or specific DNA source. There are two main types: genomic libraries (containing fragments of the entire genome) and cDNA libraries (containing DNA copies of mRNA, representing expressed genes). Libraries are used to isolate and study specific genes or regulatory sequences."
    },
    {
      id: 91,
      category: "Biotechnology",
      question: "What is the primary purpose of a Western blot?",
      options: [
        "To detect specific RNA sequences",
        "To detect specific proteins",
        "To amplify DNA",
        "To sequence DNA"
      ],
      correctAnswer: 1,
      explanation: "The primary purpose of a Western blot is to detect specific proteins in a sample. The technique involves separating proteins by gel electrophoresis, transferring them to a membrane, and then using labeled antibodies to identify and visualize specific target proteins. Western blotting is widely used in research and clinical settings."
    },
    {
      id: 92,
      category: "Biotechnology",
      question: "Which technique is used to introduce foreign DNA into bacterial cells?",
      options: [
        "Transfection",
        "Transformation",
        "Transduction",
        "Translation"
      ],
      correctAnswer: 1,
      explanation: "Transformation is used to introduce foreign DNA into bacterial cells. In this process, bacteria take up exogenous DNA from their environment through their cell membrane. In laboratory settings, bacteria can be made 'competent' (more receptive to DNA uptake) through chemical treatments or electroporation, enabling genetic engineering."
    },
    {
      id: 93,
      category: "Biotechnology",
      question: "What is the purpose of site-directed mutagenesis?",
      options: [
        "To introduce random mutations throughout a genome",
        "To create targeted, specific changes in a DNA sequence",
        "To isolate naturally occurring mutations",
        "To remove all mutations from a DNA sequence"
      ],
      correctAnswer: 1,
      explanation: "Site-directed mutagenesis is used to create targeted, specific changes in a DNA sequence. This technique allows researchers to introduce precise mutations at defined sites in a DNA molecule, enabling studies of gene function, protein structure-function relationships, and the effects of disease-causing mutations."
    },
    {
      id: 94,
      category: "Biotechnology",
      question: "What is metagenomics?",
      options: [
        "The study of how genes influence behavior",
        "The analysis of genetic material recovered directly from environmental samples",
        "The transfer of genes between organisms",
        "The study of how genes change during aging"
      ],
      correctAnswer: 1,
      explanation: "Metagenomics is the analysis of genetic material recovered directly from environmental samples. Unlike traditional genomics that focuses on DNA from cultured organisms, metagenomics examines the collective genomes of microorganisms in their natural environments, revealing microbial diversity and function in ecosystems like soil, oceans, or the human gut."
    },
    {
      id: 95,
      category: "Biotechnology",
      question: "What is recombinant DNA technology?",
      options: [
        "The natural process of genetic recombination during meiosis",
        "A technique to join DNA from different species to create novel genetic combinations",
        "A method to repair damaged DNA",
        "The process of DNA replication in the laboratory"
      ],
      correctAnswer: 1,
      explanation: "Recombinant DNA technology involves joining DNA from different species to create novel genetic combinations. It typically includes isolating DNA segments, cutting them with restriction enzymes, joining them with DNA ligase, and introducing the recombinant DNA into a host organism. This technology forms the foundation of genetic engineering and biotechnology."
    }
  ],
  metabolomics: [
    {
      id: 96,
      category: "Metabolomics",
      question: "What is metabolomics?",
      options: [
        "The study of gene expression patterns",
        "The comprehensive analysis of all metabolites in a biological sample",
        "The study of protein structures",
        "The analysis of enzyme kinetics"
      ],
      correctAnswer: 1,
      explanation: "Metabolomics is the comprehensive analysis of all metabolites (small molecules) in a biological sample. It provides a snapshot of the physiological state of a cell, tissue, or organism by examining the complete set of metabolites, which are the end products of cellular processes and direct signatures of biochemical activity."
    },
    {
      id: 97,
      category: "Metabolomics",
      question: "Which analytical technique is commonly used in metabolomics studies?",
      options: [
        "Polymerase Chain Reaction (PCR)",
        "Western blotting",
        "Mass spectrometry",
        "Gel electrophoresis"
      ],
      correctAnswer: 2,
      explanation: "Mass spectrometry is commonly used in metabolomics studies. It allows for the identification and quantification of metabolites based on their mass-to-charge ratio. Other important techniques in metabolomics include nuclear magnetic resonance (NMR) spectroscopy and chromatography methods like HPLC and GC, often coupled with mass spectrometry."
    },
    {
      id: 98,
      category: "Metabolomics",
      question: "What are metabolic fingerprints?",
      options: [
        "Genetic markers that determine metabolic rate",
        "Physical characteristics related to metabolism",
        "Unique patterns of metabolites that characterize specific biological states",
        "Enzymatic pathways specific to individual organisms"
      ],
      correctAnswer: 2,
      explanation: "Metabolic fingerprints are unique patterns of metabolites that characterize specific biological states, conditions, or organisms. These patterns can be used to identify biomarkers of disease, drug responses, environmental exposures, or other physiological changes. Metabolic fingerprinting is often used in diagnostics and personalized medicine."
    },
    {
      id: 99,
      category: "Metabolomics",
      question: "What is a metabolite?",
      options: [
        "A type of enzyme",
        "A small molecule intermediate or product of metabolism",
        "A type of hormone",
        "A protein involved in metabolic regulation"
      ],
      correctAnswer: 1,
      explanation: "A metabolite is a small molecule intermediate or product of metabolism. Metabolites include a wide variety of compounds such as amino acids, nucleotides, carbohydrates, lipids, and organic acids. They can be endogenous (produced by the organism) or exogenous (derived from external sources like diet or environment)."
    },
    {
      id: 100,
      category: "Metabolomics",
      question: "What is metabolic flux analysis?",
      options: [
        "The study of how genes regulate metabolism",
        "The measurement of metabolite concentrations in a sample",
        "The determination of rates of metabolic reactions within a biological system",
        "The identification of new metabolic pathways"
      ],
      correctAnswer: 2,
      explanation: "Metabolic flux analysis is the determination of rates (fluxes) of metabolic reactions within a biological system. It quantifies how material flows through different biochemical pathways in living cells. Techniques like isotope labeling are often used to track the movement of atoms through metabolic networks."
    },
    {
      id: 101,
      category: "Metabolomics",
      question: "What is the difference between targeted and untargeted metabolomics?",
      options: [
        "Targeted analyzes only pathogenic metabolites, while untargeted examines all metabolites",
        "Targeted focuses on predefined specific metabolites, while untargeted aims to detect as many metabolites as possible",
        "Targeted is used for plants, while untargeted is used for animals",
        "Targeted uses mass spectrometry, while untargeted uses NMR spectroscopy"
      ],
      correctAnswer: 1,
      explanation: "Targeted metabolomics focuses on measuring specific, predefined metabolites of interest, often with optimized methods for accurate quantification. Untargeted metabolomics aims to detect and relatively quantify as many metabolites as possible in a sample without prior selection, allowing for discovery of unexpected metabolic changes or novel compounds."
    },
    {
      id: 102,
      category: "Metabolomics",
      question: "How can metabolomics contribute to personalized medicine?",
      options: [
        "By identifying genetic variations that affect drug metabolism",
        "By providing individualized exercise plans",
        "By revealing metabolic signatures that can predict disease risk or drug response",
        "By designing personalized diets based on caloric needs"
      ],
      correctAnswer: 2,
      explanation: "Metabolomics contributes to personalized medicine by revealing metabolic signatures that can predict disease risk or drug response. These individual metabolic profiles can help identify biomarkers for early disease detection, determine optimal treatments based on a patient's unique metabolism, and monitor treatment effectiveness in real-time."
    },
    {
      id: 103,
      category: "Metabolomics",
      question: "What is metabonomics?",
      options: [
        "The study of small molecule metabolites in single cells",
        "The quantitative measurement of metabolic responses to genetic or environmental changes",
        "The identification of genes involved in metabolism",
        "The analysis of metabolite-protein interactions"
      ],
      correctAnswer: 1,
      explanation: "Metabonomics is the quantitative measurement of metabolic responses to genetic, environmental, or disease-induced changes. While sometimes used interchangeably with metabolomics, metabonomics traditionally focuses more on systemic, holistic changes in metabolites and their patterns in response to stimuli or perturbations, often in complex systems like whole organisms."
    },
    {
      id: 104,
      category: "Metabolomics",
      question: "What is fluxomics?",
      options: [
        "The study of all fluxes in all metabolic pathways in an organism",
        "The analysis of energy flow in ecosystems",
        "The measurement of cellular respiration rates",
        "The study of electron transport chain efficiency"
      ],
      correctAnswer: 0,
      explanation: "Fluxomics is the study of all fluxes (rates of turnover) in all metabolic pathways in an organism. It aims to quantify the dynamic flow of metabolites through biochemical pathways, providing information about pathway activity, regulation, and interactions that complement the static snapshots provided by metabolite concentration measurements."
    },
    {
      id: 105,
      category: "Metabolomics",
      question: "Which of the following is NOT a common application of metabolomics?",
      options: [
        "Biomarker discovery for disease diagnosis",
        "Drug safety assessment",
        "Gene editing",
        "Nutritional research"
      ],
      correctAnswer: 2,
      explanation: "Gene editing is not a common application of metabolomics. While metabolomics data might inform gene editing experiments by identifying metabolic targets, the actual process of editing genes involves molecular biology techniques like CRISPR-Cas9. Metabolomics is commonly used for biomarker discovery, drug safety assessment, and nutritional research."
    }
  ],
  signalTransduction: [
    {
      id: 106,
      category: "Signal Transduction",
      question: "What is a second messenger in cellular signaling?",
      options: [
        "A backup hormone that acts when the primary hormone fails",
        "A molecule that directly delivers signals between cells",
        "An intracellular molecule that relays signals from receptors to target molecules within the cell",
        "A protein that transports signals across the nuclear membrane"
      ],
      correctAnswer: 2,
      explanation: "A second messenger is an intracellular molecule that relays signals from receptors to target molecules within the cell. When a signaling molecule (first messenger) binds to a cell-surface receptor, it triggers the production or release of second messengers inside the cell, which then activate various cellular responses. Examples include cAMP, calcium ions, and inositol trisphosphate (IP3)."
    },
    {
      id: 107,
      category: "Signal Transduction",
      question: "Which of the following is NOT a common second messenger?",
      options: [
        "Cyclic AMP (cAMP)",
        "Calcium ions (Ca²⁺)",
        "Insulin",
        "Diacylglycerol (DAG)"
      ],
      correctAnswer: 2,
      explanation: "Insulin is not a second messenger; it is a peptide hormone (first messenger) that binds to cell surface receptors to initiate signaling. Cyclic AMP (cAMP), calcium ions (Ca²⁺), and diacylglycerol (DAG) are all common second messengers that function within cells to relay signals from the plasma membrane to various intracellular targets."
    },
    {
      id: 108,
      category: "Signal Transduction",
      question: "What enzyme catalyzes the production of cyclic AMP (cAMP) from ATP?",
      options: [
        "Phosphodiesterase",
        "Adenylyl cyclase",
        "Protein kinase A",
        "Phospholipase C"
      ],
      correctAnswer: 1,
      explanation: "Adenylyl cyclase catalyzes the production of cyclic AMP (cAMP) from ATP. This enzyme is typically activated when G-protein-coupled receptors stimulate G proteins (specifically Gs), which then activate adenylyl cyclase. The resulting increase in cAMP levels triggers various cellular responses, often through activation of protein kinase A (PKA)."
    },
    {
      id: 109,
      category: "Signal Transduction",
      question: "Which type of receptor has intrinsic enzyme activity in its cytoplasmic domain?",
      options: [
        "G-protein-coupled receptors",
        "Ligand-gated ion channels",
        "Receptor tyrosine kinases",
        "Nuclear receptors"
      ],
      correctAnswer: 2,
      explanation: "Receptor tyrosine kinases (RTKs) have intrinsic enzyme activity in their cytoplasmic domain. When activated by ligand binding, RTKs dimerize and their intracellular domains cross-phosphorylate each other (autophosphorylation), creating binding sites for signaling proteins that initiate various downstream pathways."
    },
    {
      id: 110,
      category: "Signal Transduction",
      question: "What is the role of GTP in G-protein signaling?",
      options: [
        "It activates G proteins when bound, and inactivates them when hydrolyzed to GDP",
        "It directly activates second messengers",
        "It phosphorylates target proteins",
        "It opens ion channels in the plasma membrane"
      ],
      correctAnswer: 0,
      explanation: "In G-protein signaling, GTP activates G proteins when bound, and inactivates them when hydrolyzed to GDP. When a ligand binds to a G-protein-coupled receptor, it causes the G protein to exchange GDP for GTP, activating the G protein. The G protein then dissociates into α and βγ subunits that can regulate various effector proteins. The intrinsic GTPase activity of the α subunit eventually hydrolyzes GTP to GDP, inactivating the signaling."
    },
    {
      id: 111,
      category: "Signal Transduction",
      question: "What is a key feature of receptor-mediated endocytosis?",
      options: [
        "Direct transport of molecules through membrane channels",
        "Selective internalization of receptor-ligand complexes via membrane vesicles",
        "Release of cellular contents to the extracellular environment",
        "Fusion of vesicles from different cells"
      ],
      correctAnswer: 1,
      explanation: "A key feature of receptor-mediated endocytosis is the selective internalization of receptor-ligand complexes via membrane vesicles. This process allows cells to take up specific molecules (like LDL, transferrin, or growth factors) by first binding them to surface receptors, then forming clathrin-coated pits that pinch off to create intracellular vesicles containing the receptor-ligand complexes."
    },
    {
      id: 112,
      category: "Signal Transduction",
      question: "Which signaling pathway is directly activated by steroid hormones?",
      options: [
        "G-protein coupled receptor pathway",
        "Receptor tyrosine kinase pathway",
        "Nuclear receptor pathway",
        "Ion channel pathway"
      ],
      correctAnswer: 2,
      explanation: "Steroid hormones directly activate the nuclear receptor pathway. Being lipophilic, steroid hormones can pass through the plasma membrane and bind to nuclear receptors (a type of transcription factor) in the cytoplasm or nucleus. The hormone-receptor complex then binds to specific DNA sequences to regulate gene expression, producing the cellular response."
    },
    {
      id: 113,
      category: "Signal Transduction",
      question: "What is the function of protein kinases in signal transduction?",
      options: [
        "To remove phosphate groups from proteins",
        "To add phosphate groups to specific amino acids in target proteins",
        "To degrade target proteins",
        "To synthesize new signaling proteins"
      ],
      correctAnswer: 1,
      explanation: "The function of protein kinases in signal transduction is to add phosphate groups to specific amino acids (typically serine, threonine, or tyrosine) in target proteins. This phosphorylation often changes the target protein's activity, location, or interaction with other molecules, propagating the signal through the cell. Kinases play crucial roles in nearly all signaling pathways."
    },
    {
      id: 114,
      category: "Signal Transduction",
      question: "What is signal amplification in biochemical pathways?",
      options: [
        "Increasing the concentration of the original signaling molecule",
        "The process where each step in a pathway activates multiple molecules at the next step",
        "Using electronic devices to detect weak cellular signals",
        "Repeated binding of a ligand to the same receptor"
      ],
      correctAnswer: 1,
      explanation: "Signal amplification is the process where each step in a pathway activates multiple molecules at the next step, creating a cascade effect. For example, one hormone molecule might activate multiple receptor molecules, each activating multiple G proteins, each stimulating multiple adenylyl cyclase molecules, producing many cAMP molecules, and so on. This allows small initial signals to produce large cellular responses."
    },
    {
      id: 115,
      category: "Signal Transduction",
      question: "What is the MAP kinase cascade?",
      options: [
        "A digestive enzyme pathway",
        "A series of sequentially activated protein kinases involved in transmitting signals from receptors to the nucleus",
        "A carbohydrate metabolism pathway",
        "A membrane transport system"
      ],
      correctAnswer: 1,
      explanation: "The MAP (Mitogen-Activated Protein) kinase cascade is a series of sequentially activated protein kinases involved in transmitting signals from receptors to the nucleus. It typically involves three kinases (MAPKKK → MAPKK → MAPK) that sequentially phosphorylate and activate each other. This conserved pathway is involved in processes such as cell proliferation, differentiation, and stress responses."
    }
  ],
  immunobiochemistry: [
    {
      id: 116,
      category: "Immunobiochemistry",
      question: "What is the basic structural unit of antibodies?",
      options: [
        "Alpha helix",
        "Immunoglobulin domain",
        "Beta pleated sheet",
        "Coiled coil"
      ],
      correctAnswer: 1,
      explanation: "The immunoglobulin domain is the basic structural unit of antibodies. These compact protein domains have a characteristic sandwich structure composed of two beta sheets held together by a disulfide bond. Antibodies are composed of multiple immunoglobulin domains arranged in a Y-shaped structure."
    },
    {
      id: 117,
      category: "Immunobiochemistry",
      question: "Which protein complex is responsible for presenting antigens to T cells?",
      options: [
        "Immunoglobulin",
        "Complement",
        "Major Histocompatibility Complex (MHC)",
        "T-cell receptor"
      ],
      correctAnswer: 2,
      explanation: "The Major Histocompatibility Complex (MHC) is responsible for presenting antigens to T cells. MHC class I molecules present intracellular antigens to CD8+ T cells, while MHC class II molecules present extracellular antigens to CD4+ T cells. This presentation is crucial for T cell recognition of infected or abnormal cells."
    },
    {
      id: 118,
      category: "Immunobiochemistry",
      question: "What is the biochemical basis of complement activation?",
      options: [
        "Transcription of inflammatory genes",
        "Sequential proteolytic cleavage of complement proteins",
        "Phosphorylation of signaling proteins",
        "Glycosylation of cell surface receptors"
      ],
      correctAnswer: 1,
      explanation: "The biochemical basis of complement activation is sequential proteolytic cleavage of complement proteins. This proteolytic cascade can be initiated through three pathways (classical, alternative, or lectin), all of which converge on the formation of C3 convertase, leading to the formation of the membrane attack complex and other immune responses."
    },
    {
      id: 119,
      category: "Immunobiochemistry",
      question: "What mechanism generates antibody diversity?",
      options: [
        "RNA splicing variations",
        "Post-translational modifications",
        "Somatic recombination of gene segments and somatic hypermutation",
        "Differential gene expression"
      ],
      correctAnswer: 2,
      explanation: "Antibody diversity is generated through somatic recombination of gene segments (V, D, and J segments) and somatic hypermutation. Somatic recombination creates unique combinations of gene segments during B cell development, while somatic hypermutation introduces additional mutations in activated B cells during an immune response, allowing for the selection of higher-affinity antibodies."
    },
    {
      id: 120,
      category: "Immunobiochemistry",
      question: "What are cytokines?",
      options: [
        "Enzymes that break down foreign substances",
        "Proteins that mediate and regulate immune responses and cell communication",
        "Antibodies that target specific pathogens",
        "Receptors on the surface of immune cells"
      ],
      correctAnswer: 1,
      explanation: "Cytokines are proteins that mediate and regulate immune responses and cell communication. They are secreted by various cells (especially immune cells) and can act on the secreting cell itself (autocrine), nearby cells (paracrine), or distant cells (endocrine). Examples include interleukins, interferons, and tumor necrosis factors."
    }
  ]
};

const BiochemistryQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [quizStarted, setQuizStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [questionCount, setQuestionCount] = useState(10);
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Prepare questions based on selected category and count
  useEffect(() => {
    let selectedQuestions = [];
    
    if (selectedCategory === 'random') {
      // Combine all categories and shuffle
      const allQuestions = [
        ...quizQuestions.basics,
        ...quizQuestions.proteins,
        ...quizQuestions.metabolism,
        ...quizQuestions.nucleicAcids,
        ...quizQuestions.lipids,
        ...quizQuestions.carbohydrates,
        ...quizQuestions.enzymes,
        ...quizQuestions.advanced
      ];
      selectedQuestions = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, questionCount);
    } else if (selectedCategory === 'comprehensive') {
      // Take a balanced selection from each category
      const questionsPerCategory = Math.floor(questionCount / 8);
      const remainder = questionCount % 8;
      
      let categoriesWithExtra = [];
      if (remainder > 0) {
        categoriesWithExtra = Object.keys(quizQuestions).sort(() => 0.5 - Math.random()).slice(0, remainder);
      }
      
      Object.keys(quizQuestions).forEach(category => {
        const categoryCount = categoriesWithExtra.includes(category) 
          ? questionsPerCategory + 1 
          : questionsPerCategory;
          
        const shuffledCategory = [...quizQuestions[category]].sort(() => 0.5 - Math.random()).slice(0, categoryCount);
        selectedQuestions = [...selectedQuestions, ...shuffledCategory];
      });
      
      // Shuffle the combined questions
      selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
    } else {
      // Select from a specific category
      selectedQuestions = [...quizQuestions[selectedCategory]].sort(() => 0.5 - Math.random()).slice(0, questionCount);
    }
    
    setShuffledQuestions(selectedQuestions);
  }, [selectedCategory, questionCount]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setScore(0);
    setCurrentQuestionIndex(0);
    setAnsweredQuestions(new Set());
    setQuizCompleted(false);
    setSelectedAnswer(null);
  };

  const handleAnswerSelection = (event) => {
    setSelectedAnswer(Number(event.target.value));
  };

  const handleNextQuestion = () => {
    // Update score if answer is correct
    if (selectedAnswer === shuffledQuestions[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
    
    // Mark question as answered
    setAnsweredQuestions(new Set(answeredQuestions).add(currentQuestionIndex));
    
    // Move to next question or complete quiz
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
      setShowScoreDialog(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      
      // Restore previous answer if available
      // This is for UI display only, score is not recalculated
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };

  const restartQuiz = () => {
    // Reshuffle questions based on current category selection
    let selectedQuestions = [];
    
    if (selectedCategory === 'random') {
      const allQuestions = [
        ...quizQuestions.basics,
        ...quizQuestions.proteins,
        ...quizQuestions.metabolism,
        ...quizQuestions.nucleicAcids,
        ...quizQuestions.lipids,
        ...quizQuestions.carbohydrates,
        ...quizQuestions.enzymes,
        ...quizQuestions.advanced
      ];
      selectedQuestions = [...allQuestions].sort(() => 0.5 - Math.random()).slice(0, questionCount);
    } else if (selectedCategory === 'comprehensive') {
      const questionsPerCategory = Math.floor(questionCount / 8);
      const remainder = questionCount % 8;
      
      let categoriesWithExtra = [];
      if (remainder > 0) {
        categoriesWithExtra = Object.keys(quizQuestions).sort(() => 0.5 - Math.random()).slice(0, remainder);
      }
      
      Object.keys(quizQuestions).forEach(category => {
        const categoryCount = categoriesWithExtra.includes(category) 
          ? questionsPerCategory + 1 
          : questionsPerCategory;
          
        const shuffledCategory = [...quizQuestions[category]].sort(() => 0.5 - Math.random()).slice(0, categoryCount);
        selectedQuestions = [...selectedQuestions, ...shuffledCategory];
      });
      
      selectedQuestions = selectedQuestions.sort(() => 0.5 - Math.random());
    } else {
      selectedQuestions = [...quizQuestions[selectedCategory]].sort(() => 0.5 - Math.random()).slice(0, questionCount);
    }
    
    setShuffledQuestions(selectedQuestions);
    setScore(0);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setQuizCompleted(false);
    setAnsweredQuestions(new Set());
    setShowExplanation(false);
    setShowScoreDialog(false);
  };

  const getScoreMessage = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    
    if (percentage >= 90) return "Excellent! You have an outstanding knowledge of biochemistry!";
    if (percentage >= 80) return "Great job! You have a very good understanding of biochemical principles!";
    if (percentage >= 70) return "Good work! You have a solid understanding of biochemistry concepts!";
    if (percentage >= 60) return "Not bad! You have a basic grasp of biochemistry, but there's room to expand your knowledge.";
    return "You might benefit from learning more about biochemistry fundamentals. Keep exploring!";
  };

  const getScoreColor = () => {
    const percentage = (score / shuffledQuestions.length) * 100;
    
    if (percentage >= 80) return 'success.main';
    if (percentage >= 60) return 'primary.main';
    if (percentage >= 40) return 'warning.main';
    return 'error.main';
  };

  // If quiz has not been started, show intro screen
  if (!quizStarted) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <ScienceIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h2">
            Biochemistry Knowledge Quiz
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Test your knowledge of biochemistry concepts, metabolic pathways, and molecular structures with this interactive quiz.
        </Typography>
        
        <Box sx={{ my: 4, p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Quiz Options:
          </Typography>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="category-select-label">Quiz Category</InputLabel>
            <Select
              labelId="category-select-label"
              id="category-select"
              value={selectedCategory}
              label="Quiz Category"
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <MenuItem value="random">Random Mix (All Topics)</MenuItem>
              <MenuItem value="comprehensive">Comprehensive (Balanced Selection)</MenuItem>
              <MenuItem value="basics">Biochemistry Basics</MenuItem>
              <MenuItem value="proteins">Proteins</MenuItem>
              <MenuItem value="metabolism">Metabolism</MenuItem>
              <MenuItem value="nucleicAcids">Nucleic Acids</MenuItem>
              <MenuItem value="lipids">Lipids</MenuItem>
              <MenuItem value="carbohydrates">Carbohydrates</MenuItem>
              <MenuItem value="enzymes">Enzymes</MenuItem>
              <MenuItem value="advanced">Advanced Topics</MenuItem>
            </Select>
          </FormControl>
          
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel id="question-count-label">Number of Questions</InputLabel>
            <Select
              labelId="question-count-label"
              id="question-count"
              value={questionCount}
              label="Number of Questions"
              onChange={(e) => setQuestionCount(Number(e.target.value))}
            >
              <MenuItem value={5}>5 Questions (Quick Quiz)</MenuItem>
              <MenuItem value={10}>10 Questions (Standard)</MenuItem>
              <MenuItem value={15}>15 Questions (Extended)</MenuItem>
              <MenuItem value={20}>20 Questions (Comprehensive)</MenuItem>
              {selectedCategory !== 'random' && selectedCategory !== 'comprehensive' && (
                <MenuItem value={5}>All Questions in Category</MenuItem>
              )}
            </Select>
          </FormControl>
          
          <Typography variant="body2" sx={{ mt: 2 }}>
            Categories include biochemistry basics, proteins, metabolism, nucleic acids, lipids, carbohydrates, enzymes, and advanced topics.
          </Typography>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartQuiz}
            sx={{ px: 4, py: 1.5 }}
          >
            Start Quiz
          </Button>
        </Box>
      </Paper>
    );
  }

  // If quiz has been completed and dialog is closed, show summary screen
  if (quizCompleted && !showScoreDialog) {
    return (
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <EmojiEventsIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h2">
            Quiz Completed
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Thank you for completing the biochemistry knowledge quiz!
        </Typography>
        
        <Box sx={{ 
          my: 4, 
          p: 3, 
          bgcolor: 'background.paper', 
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          textAlign: 'center'
        }}>
          <Typography variant="h5" gutterBottom>
            Your Score:
          </Typography>
          <Typography 
            variant="h2" 
            color={getScoreColor()} 
            sx={{ fontWeight: 'bold', my: 2 }}
          >
            {score} / {shuffledQuestions.length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            ({Math.round((score / shuffledQuestions.length) * 100)}%)
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {getScoreMessage()}
          </Typography>
        </Box>
        
        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowScoreDialog(true)}
            sx={{ mr: 2 }}
          >
            Review Answers
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={restartQuiz}
            startIcon={<RestartAltIcon />}
          >
            Take Another Quiz
          </Button>
        </Box>
      </Paper>
    );
  }

  // Regular quiz interface
  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
      {/* Progress bar */}
      <Box sx={{ width: '100%', mb: 2 }}>
        <LinearProgress 
          variant="determinate" 
          value={(answeredQuestions.size / shuffledQuestions.length) * 100} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>
      
      {/* Question header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Chip 
          label={`Question ${currentQuestionIndex + 1} of ${shuffledQuestions.length}`} 
          color="primary" 
          variant="outlined"
        />
        <Chip 
          label={shuffledQuestions[currentQuestionIndex]?.category} 
          color="secondary" 
        />
      </Box>
      
      {/* Question */}
      <Typography variant="h5" component="h2" sx={{ fontWeight: 500, mb: 3 }}>
        {shuffledQuestions[currentQuestionIndex]?.question}
      </Typography>
      
      {/* Answer options */}
      <FormControl component="fieldset" sx={{ width: '100%' }}>
        <RadioGroup
          name="quiz-options"
          value={selectedAnswer}
          onChange={handleAnswerSelection}
        >
          {shuffledQuestions[currentQuestionIndex]?.options.map((option, index) => (
            <Card 
              key={index} 
              sx={{ 
                mb: 2, 
                border: selectedAnswer === index 
                  ? `2px solid ${theme.palette.primary.main}` 
                  : '1px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  boxShadow: 2,
                  transform: selectedAnswer === null ? 'translateY(-2px)' : 'none'
                },
              }}
            >
              <FormControlLabel
                value={index}
                control={<Radio />}
                label={
                  <Typography variant="body1">
                    {option}
                  </Typography>
                }
                sx={{ 
                  mx: 0, 
                  width: '100%', 
                  py: 1.5, 
                  px: 2,
                  '& .MuiFormControlLabel-label': {
                    width: '100%'
                  }
                }}
                disabled={selectedAnswer !== null}
              />
            </Card>
          ))}
        </RadioGroup>
      </FormControl>
      
      {/* Answer feedback */}
      {selectedAnswer !== null && (
        <Box sx={{ mt: 2, mb: 3 }}>
          {selectedAnswer === shuffledQuestions[currentQuestionIndex]?.correctAnswer ? (
            <Alert 
              icon={<CheckCircleOutlineIcon />} 
              severity="success"
              action={
                <Button color="inherit" size="small" onClick={toggleExplanation}>
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </Button>
              }
            >
              Correct!
            </Alert>
          ) : (
            <Alert 
              icon={<HighlightOffIcon />} 
              severity="error"
              action={
                <Button color="inherit" size="small" onClick={toggleExplanation}>
                  {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
                </Button>
              }
            >
              Incorrect. The correct answer is: {shuffledQuestions[currentQuestionIndex]?.options[shuffledQuestions[currentQuestionIndex]?.correctAnswer]}
            </Alert>
          )}
          
          {showExplanation && (
            <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                Explanation:
              </Typography>
              <Typography variant="body2">
                {shuffledQuestions[currentQuestionIndex]?.explanation}
              </Typography>
            </Box>
          )}
        </Box>
      )}
      
      {/* Navigation buttons */}
      <Box display="flex" justifyContent="space-between" mt={3}>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIosNewIcon />}
          onClick={handlePreviousQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </Button>
        
        <Button
          variant="contained"
          endIcon={<ArrowForwardIosIcon />}
          onClick={handleNextQuestion}
          disabled={selectedAnswer === null}
        >
          {currentQuestionIndex === shuffledQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </Button>
      </Box>
      
      {/* Score dialog */}
      <Dialog
        fullScreen={fullScreen}
        open={showScoreDialog}
        onClose={() => setShowScoreDialog(false)}
        aria-labelledby="score-dialog-title"
        maxWidth="md"
      >
        <DialogTitle id="score-dialog-title">
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Quiz Results</Typography>
            <IconButton 
              edge="end" 
              color="inherit" 
              onClick={() => setShowScoreDialog(false)} 
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h4" color={getScoreColor()} sx={{ fontWeight: 'bold' }}>
              {score} / {shuffledQuestions.length} ({Math.round((score / shuffledQuestions.length) * 100)}%)
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {getScoreMessage()}
            </Typography>
          </Box>
          
          <Typography variant="h6" gutterBottom>
            Question Summary:
          </Typography>
          
          {shuffledQuestions.map((question, index) => (
            <Box key={index} sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <Box 
                  sx={{ 
                    mr: 2, 
                    mt: 0.5,
                    minWidth: 28,
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: answeredQuestions.has(index) && 
                      (selectedAnswer === question.correctAnswer)
                      ? 'success.main' 
                      : 'error.main',
                    color: 'white'
                  }}
                >
                  {answeredQuestions.has(index) && 
                   (selectedAnswer === question.correctAnswer)
                    ? <CheckCircleOutlineIcon fontSize="small" />
                    : <HighlightOffIcon fontSize="small" />
                  }
                </Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {index + 1}. {question.question}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    Correct answer: {question.options[question.correctAnswer]}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    {question.explanation}
                  </Typography>
                </Box>
              </Box>
              {index < shuffledQuestions.length - 1 && <Divider sx={{ my: 2 }} />}
            </Box>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={restartQuiz} startIcon={<RestartAltIcon />}>
            Take Another Quiz
          </Button>
          <Button onClick={() => setShowScoreDialog(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default BiochemistryQuiz;
