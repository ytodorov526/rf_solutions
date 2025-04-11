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
  Card,
  CardContent,
  Divider,
  LinearProgress,
  Alert,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Grid
} from '@mui/material';
import {
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  Help as HelpIcon,
  Home as HomeIcon
} from '@mui/icons-material';

// Default quiz questions if not provided as props
const defaultQuestions = [
  // DNA Structure and Function
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
    question: "What is the primary role of DNA ligase in molecular cloning?",
    options: ["To cut DNA at specific sites", "To join DNA fragments by forming phosphodiester bonds", "To amplify DNA segments", "To remove primers after DNA synthesis"],
    answer: 1,
    explanation: "DNA ligase catalyzes the formation of phosphodiester bonds between adjacent nucleotides, joining DNA fragments during molecular cloning and DNA repair processes."
  },
  {
    question: "Which of the following is a characteristic of plasmid vectors?",
    options: ["They are typically larger than 100 kb", "They cannot replicate independently", "They contain an origin of replication", "They can only carry small genes"],
    answer: 2,
    explanation: "Plasmid vectors contain an origin of replication that allows them to replicate independently of the host chromosome, making them useful for cloning and expressing foreign genes."
  },
  {
    question: "What is a selectable marker in a cloning vector?",
    options: ["A sequence that allows for blue-white screening", "A gene that confers resistance to an antibiotic", "A promoter sequence for gene expression", "A restriction site for inserting foreign DNA"],
    answer: 1,
    explanation: "A selectable marker, often an antibiotic resistance gene, allows for the selection of cells that have successfully taken up the vector, as only these cells can grow in the presence of the antibiotic."
  },
  {
    question: "Which technique would be most appropriate for determining the complete amino acid sequence of a purified protein?",
    options: ["Western blotting", "Edman degradation and mass spectrometry", "Gel electrophoresis", "ELISA"],
    answer: 1,
    explanation: "Edman degradation and mass spectrometry are techniques used to determine the amino acid sequence of proteins. Mass spectrometry has largely replaced Edman degradation for complete protein sequencing."
  },
  {
    question: "What is the purpose of a poly-A tail on eukaryotic mRNA?",
    options: ["To initiate translation", "To protect mRNA from degradation", "To mark introns for splicing", "To attach ribosomes"],
    answer: 1,
    explanation: "The poly-A tail (multiple adenine nucleotides) at the 3' end of eukaryotic mRNA protects it from degradation by exonucleases and assists in export from the nucleus and translation efficiency."
  },
  
  // PCR and Amplification
  {
    question: "Which component is NOT required for a standard PCR reaction?",
    options: ["DNA template", "DNA polymerase", "Reverse transcriptase", "Deoxynucleotide triphosphates (dNTPs)"],
    answer: 2,
    explanation: "Reverse transcriptase is not required for standard PCR. It is used in RT-PCR to convert RNA to cDNA before PCR amplification. Standard PCR requires DNA template, primers, DNA polymerase, dNTPs, and buffer."
  },
  {
    question: "What is the primary advantage of quantitative real-time PCR (qPCR) over conventional PCR?",
    options: ["It can amplify longer DNA fragments", "It allows for quantification of the starting template", "It requires fewer reagents", "It can amplify damaged DNA"],
    answer: 1,
    explanation: "Quantitative real-time PCR (qPCR) allows researchers to monitor the amplification process in real-time and quantify the initial amount of template DNA or RNA, which is not possible with conventional PCR."
  },
  {
    question: "Which DNA polymerase is most commonly used in PCR?",
    options: ["Taq polymerase", "DNA polymerase I", "DNA polymerase α", "T7 DNA polymerase"],
    answer: 0,
    explanation: "Taq polymerase, isolated from the thermophilic bacterium Thermus aquaticus, is heat-stable and most commonly used in PCR because it can withstand the high temperatures of the denaturation step."
  },
  {
    question: "What is the purpose of the annealing step in PCR?",
    options: ["To separate the DNA strands", "To allow primers to bind to template DNA", "To synthesize new DNA strands", "To activate the DNA polymerase"],
    answer: 1,
    explanation: "During the annealing step, the temperature is lowered to allow primers to bind (hybridize) to their complementary sequences on the single-stranded template DNA."
  },
  {
    question: "Which of the following would NOT affect the specificity of a PCR reaction?",
    options: ["Annealing temperature", "Primer design", "DNA polymerase concentration", "Magnesium concentration"],
    answer: 2,
    explanation: "While DNA polymerase concentration can affect the yield of PCR product, it generally doesn't significantly impact specificity. Annealing temperature, primer design, and magnesium concentration all directly influence binding specificity."
  },
  {
    question: "What is nested PCR?",
    options: ["A PCR method using multiple sets of primers in a single reaction", "A PCR technique where the product of one PCR is used as a template for a second PCR", "A method to amplify very long DNA segments", "A PCR variation that uses RNA as a template"],
    answer: 1,
    explanation: "Nested PCR involves two rounds of amplification with different primer sets. The product of the first PCR becomes the template for the second PCR with primers that bind within the first PCR product, increasing specificity."
  },
  {
    question: "Which of the following is a key feature of digital PCR (dPCR)?",
    options: ["It requires specialized fluorescent probes", "It partitions the sample into many separate reactions", "It uses RNA instead of DNA", "It requires thermal cycling for 50-100 cycles"],
    answer: 1,
    explanation: "Digital PCR (dPCR) partitions the reaction mixture into thousands of separate compartments, each containing 0 or 1 template molecule. After amplification, counting positive partitions allows absolute quantification without standards."
  },
  {
    question: "What is the role of high-fidelity DNA polymerases in PCR applications?",
    options: ["They work at lower temperatures", "They have higher processivity", "They have proofreading capability to reduce errors", "They amplify longer fragments"],
    answer: 2,
    explanation: "High-fidelity DNA polymerases have 3' to 5' exonuclease (proofreading) activity that corrects nucleotide misincorporation during DNA synthesis, reducing the error rate compared to standard Taq polymerase."
  },
  {
    question: "What is multiplexing in PCR?",
    options: ["Running multiple thermal cycles simultaneously", "Amplifying multiple target sequences in one reaction", "Using multiple DNA polymerases at once", "Analyzing PCR products at multiple timepoints"],
    answer: 1,
    explanation: "Multiplexing in PCR refers to the simultaneous amplification of multiple DNA targets in a single reaction using multiple primer pairs, each specific to a different target sequence."
  },
  {
    question: "What is the purpose of touchdown PCR?",
    options: ["To increase yield of PCR products", "To reduce nonspecific amplification", "To amplify very long templates", "To eliminate the need for optimization"],
    answer: 1,
    explanation: "Touchdown PCR employs a gradually decreasing annealing temperature strategy. It starts with a higher annealing temperature for specificity, then gradually decreases to ensure efficient amplification while minimizing nonspecific products."
  },
  
  // Gene Expression and Regulation
  {
    question: "Which of the following is a crucial step in creating a recombinant protein expression system?",
    options: ["Removing all introns from the gene", "Adding a strong viral promoter", "Introducing random mutations", "Methylating the entire gene"],
    answer: 1,
    explanation: "Adding a strong promoter (often viral in origin, like the T7 promoter) is essential for high-level expression of recombinant proteins in expression systems."
  },
  {
    question: "Which expression system would be most appropriate for producing a human protein with complex post-translational modifications?",
    options: ["Escherichia coli (bacterial)", "Saccharomyces cerevisiae (yeast)", "Mammalian cell culture", "Cell-free expression system"],
    answer: 2,
    explanation: "Mammalian cell culture systems provide the most authentic environment for producing human proteins with complex post-translational modifications, such as glycosylation patterns similar to native human proteins."
  },
  {
    question: "What is the primary advantage of a yeast expression system over a bacterial system?",
    options: ["Higher protein yield", "Ability to perform some post-translational modifications", "Lower cost", "Faster growth rate"],
    answer: 1,
    explanation: "Yeast expression systems can perform some eukaryotic post-translational modifications, such as glycosylation and disulfide bond formation, which bacterial systems generally cannot perform."
  },
  {
    question: "What is the purpose of an inducible promoter in a protein expression system?",
    options: ["To make the protein fluorescent", "To control when gene expression occurs", "To increase the size of the protein", "To help with protein purification"],
    answer: 1,
    explanation: "Inducible promoters allow researchers to control when gene expression begins by adding a specific inducer molecule, enabling them to optimize cell growth before protein production starts."
  },
  {
    question: "What is the primary challenge in expressing membrane proteins in recombinant systems?",
    options: ["They are too small to purify", "They require high levels of phosphorylation", "They tend to form insoluble aggregates", "They are toxic to all host cells"],
    answer: 2,
    explanation: "Membrane proteins often form insoluble aggregates (inclusion bodies) when overexpressed because they require specific lipid environments and folding mechanisms that may be absent in heterologous expression systems."
  },
  {
    question: "Which tag is primarily used for affinity purification of recombinant proteins using metal chelate chromatography?",
    options: ["FLAG tag", "Histidine tag (His-tag)", "Maltose-binding protein (MBP)", "Glutathione S-transferase (GST)"],
    answer: 1,
    explanation: "Histidine tags (His-tags), typically consisting of 6-10 histidine residues, bind strongly to immobilized metal ions (like Ni²⁺), enabling efficient purification of tagged proteins using metal chelate chromatography."
  },
  {
    question: "What is a common strategy to improve the solubility of recombinant proteins in E. coli?",
    options: ["Expression at higher temperatures", "Addition of detergents to the growth medium", "Fusion with solubility-enhancing tags like MBP", "Increasing the inducer concentration"],
    answer: 2,
    explanation: "Fusion with solubility-enhancing tags such as maltose-binding protein (MBP), thioredoxin, or SUMO can improve protein solubility by promoting proper folding and preventing aggregation."
  },
  {
    question: "Why is codon optimization often necessary when expressing eukaryotic genes in prokaryotic hosts?",
    options: ["To remove introns", "To match codon usage preferences of the host", "To increase the gene's GC content", "To eliminate translation stop codons"],
    answer: 1,
    explanation: "Different organisms have different codon usage preferences. Codon optimization adjusts the gene sequence to use the preferred codons of the host organism without changing the amino acid sequence, improving translation efficiency."
  },
  {
    question: "Which of the following is NOT a common method for inducing protein expression in E. coli?",
    options: ["Addition of IPTG to induce the lac promoter", "Temperature shift to inactivate a repressor", "Addition of arabinose to induce the araBAD promoter", "Addition of glucose to induce the trp promoter"],
    answer: 3,
    explanation: "Glucose does not induce the trp promoter; in fact, it often represses expression through catabolite repression. Common induction methods include IPTG for lac-based promoters, arabinose for araBAD, and temperature shifts for certain systems."
  },
  {
    question: "What is the purpose of chaperone co-expression in recombinant protein production?",
    options: ["To increase growth rate of host cells", "To assist in proper protein folding", "To enhance the activity of the promoter", "To prevent proteolytic degradation"],
    answer: 1,
    explanation: "Molecular chaperones are proteins that assist in the proper folding of other proteins. Co-expressing chaperones (like GroEL/ES or DnaK/J) can improve the folding and solubility of difficult-to-express recombinant proteins."
  },
  
  // DNA Cloning and Vectors
  {
    question: "The term 'Golden Gate Assembly' refers to:",
    options: ["A specific research facility for biotechnology", "A method for DNA assembly using Type IIS restriction enzymes", "The entrance to a high-security biotechnology lab", "A database of genomic sequences"],
    answer: 1,
    explanation: "Golden Gate Assembly is a cloning method that uses Type IIS restriction enzymes to create unique overhangs, allowing multiple DNA fragments to be assembled in a specific order in a single reaction."
  },
  {
    question: "What is the main advantage of Gibson Assembly over traditional restriction enzyme cloning?",
    options: ["It requires fewer enzymes", "It allows for seamless assembly of multiple DNA fragments", "It works better with small fragments", "It does not require a thermal cycler"],
    answer: 1,
    explanation: "Gibson Assembly allows for the seamless assembly of multiple DNA fragments with overlapping ends in a single isothermal reaction, without leaving restriction site scars at the junctions."
  },
  {
    question: "Which of the following is NOT a characteristic of bacterial artificial chromosomes (BACs)?",
    options: ["They can carry DNA inserts of up to 300 kb", "They are based on the F-factor plasmid", "They have a high copy number in E. coli", "They are used for creating genomic libraries"],
    answer: 2,
    explanation: "BACs are maintained at low copy number (1-2 copies per cell) in E. coli, not high copy number. This characteristic helps maintain stability of large insert sizes and reduces the risk of recombination."
  },
  {
    question: "What is the primary purpose of a shuttle vector?",
    options: ["To transfer DNA between different bacterial species", "To rapidly deliver genes into mammalian cells", "To propagate in both prokaryotic and eukaryotic hosts", "To shuttle between the nucleus and cytoplasm"],
    answer: 2,
    explanation: "Shuttle vectors contain elements allowing them to replicate in multiple host types, typically both prokaryotic (e.g., E. coli) and eukaryotic (e.g., yeast or mammalian) cells, facilitating genetic manipulation in different systems."
  },
  {
    question: "Which cloning method relies on the complementary pairing of single-stranded DNA overhangs?",
    options: ["Blunt-end cloning", "Sticky-end cloning", "TA cloning", "Ligation-independent cloning"],
    answer: 1,
    explanation: "Sticky-end cloning relies on the complementary pairing of single-stranded DNA overhangs (often created by restriction enzymes) to align fragments before ligation, increasing efficiency compared to blunt-end cloning."
  },
  {
    question: "What is a key feature of Gateway® cloning technology?",
    options: ["It uses homologous recombination in yeast", "It employs site-specific recombination based on bacteriophage lambda", "It requires PCR to amplify the target gene", "It relies on Type IIS restriction enzymes"],
    answer: 1,
    explanation: "Gateway® cloning technology uses site-specific recombination based on the bacteriophage lambda integration system, allowing efficient transfer of DNA segments between different vectors without traditional restriction enzyme cloning."
  },
  {
    question: "What is the purpose of blue-white screening in bacterial cloning?",
    options: ["To identify colonies with antibiotic resistance", "To distinguish between plasmids with and without inserts", "To determine the size of the inserted DNA", "To check for mutations in the cloned gene"],
    answer: 1,
    explanation: "Blue-white screening uses the α-complementation of β-galactosidase to distinguish between colonies containing plasmids with inserts (white) and those without inserts (blue) when grown on media containing X-gal."
  },
  {
    question: "Which of the following vectors is designed specifically for protein expression in E. coli?",
    options: ["pUC19", "pBR322", "pET", "pGEM-T"],
    answer: 2,
    explanation: "pET vectors are specifically designed for high-level protein expression in E. coli, featuring a strong T7 promoter controlled by the lac operator and typically including tags for purification."
  },
  {
    question: "What is the purpose of a cosmid vector?",
    options: ["To clone very small DNA fragments", "To express proteins in mammalian cells", "To clone DNA fragments up to 45 kb", "To create cDNA libraries"],
    answer: 2,
    explanation: "Cosmid vectors combine features of plasmids and bacteriophage lambda, allowing them to package and clone relatively large DNA fragments (up to 45 kb) using lambda packaging systems."
  },
  {
    question: "What is the primary advantage of using fosmid vectors for genomic library construction?",
    options: ["They can accept very small inserts", "They maintain inserts with high stability", "They have a very high copy number", "They can be directly expressed in mammalian cells"],
    answer: 1,
    explanation: "Fosmids are F-plasmid-based vectors that, like BACs, are maintained at low copy number, providing high stability for consistent-sized DNA inserts (approximately 40 kb), making them ideal for stable genomic libraries."
  },
  
  // Genomics and Sequencing
  {
    question: "Which sequencing technology is characterized by the generation of very long reads (>10kb)?",
    options: ["Illumina sequencing", "Ion Torrent sequencing", "Pacific Biosciences SMRT sequencing", "Pyrosequencing"],
    answer: 2,
    explanation: "Pacific Biosciences Single Molecule Real-Time (SMRT) sequencing is known for producing very long reads, often exceeding 10-15 kb and sometimes reaching over 100 kb, which helps resolve complex genomic regions."
  },
  {
    question: "What is the primary advantage of next-generation sequencing over Sanger sequencing?",
    options: ["Higher accuracy", "Longer read lengths", "Massively parallel processing of multiple DNA fragments", "Simpler workflow"],
    answer: 2,
    explanation: "Next-generation sequencing technologies enable massively parallel sequencing of millions of DNA fragments simultaneously, dramatically increasing throughput and reducing cost compared to Sanger sequencing."
  },
  {
    question: "In RNA-seq analysis, what does FPKM stand for?",
    options: ["Fragments Per Kilobase of transcript per Million mapped reads", "Full Protein Kinase Map", "Frequency of Positive Kinetic Measurements", "Final Protein Kinetic Model"],
    answer: 0,
    explanation: "FPKM (Fragments Per Kilobase of transcript per Million mapped reads) normalizes RNA-seq read counts by both the length of the transcript and the total number of mapped reads, allowing comparison of expression levels across genes and samples."
  },
  {
    question: "What is the primary purpose of genome-wide association studies (GWAS)?",
    options: ["To sequence entire genomes of diverse species", "To identify genetic variants associated with specific traits or diseases", "To determine the function of every gene in a genome", "To construct physical maps of chromosomes"],
    answer: 1,
    explanation: "Genome-wide association studies (GWAS) examine genetic variants across the genomes of many individuals to identify variants statistically associated with specific traits or diseases, helping identify genetic risk factors."
  },
  {
    question: "What is ChIP-seq used for?",
    options: ["Sequencing of chloroplast DNA", "Identifying protein-DNA interactions across the genome", "Analyzing chromosomal translocations", "Detecting single nucleotide polymorphisms"],
    answer: 1,
    explanation: "ChIP-seq (Chromatin Immunoprecipitation followed by sequencing) identifies genome-wide DNA binding sites for proteins of interest, such as transcription factors or histones with specific modifications, revealing protein-DNA interactions."
  },
  {
    question: "What is the primary goal of de novo genome assembly?",
    options: ["To compare a genome to a reference sequence", "To reconstruct a genome without a reference sequence", "To identify all genes in a genome", "To determine the methylation status of a genome"],
    answer: 1,
    explanation: "De novo genome assembly aims to reconstruct the complete sequence of a genome without using a pre-existing reference sequence, typically by assembling overlapping sequence reads into contigs and scaffolds."
  },
  {
    question: "Which of the following technologies provides information about the three-dimensional organization of the genome?",
    options: ["RNA-seq", "Hi-C", "ATAC-seq", "Bisulfite sequencing"],
    answer: 1,
    explanation: "Hi-C is a chromosome conformation capture technique that provides information about the three-dimensional organization of the genome by identifying regions of DNA that are in close physical proximity to each other in the nucleus."
  },
  {
    question: "What distinguishes single-cell RNA-seq from traditional RNA-seq?",
    options: ["It uses different sequencing technology", "It analyzes RNA from individual cells rather than bulk tissue", "It sequences only non-coding RNAs", "It requires less starting material"],
    answer: 1,
    explanation: "Single-cell RNA-seq analyzes transcriptomes from individual cells rather than bulk tissue samples, revealing cell-to-cell variation in gene expression that would be masked in standard RNA-seq of heterogeneous tissue samples."
  },
  {
    question: "What is the primary application of metagenomics?",
    options: ["Sequencing multiple human genomes simultaneously", "Studying genetic material from environmental samples", "Analyzing all the proteins in a cell", "Determining the function of unknown genes"],
    answer: 1,
    explanation: "Metagenomics involves studying genetic material recovered directly from environmental samples, allowing analysis of microbial communities without the need to isolate and culture individual species in the laboratory."
  },
  {
    question: "Which of the following is a key feature of Oxford Nanopore sequencing technology?",
    options: ["Sequencing by synthesis", "Bridge amplification", "Direct detection of DNA bases as they pass through protein nanopores", "Pyrophosphate detection"],
    answer: 2,
    explanation: "Oxford Nanopore technology directly detects DNA or RNA bases as they pass through protein nanopores by measuring changes in ionic current, enabling real-time, long-read sequencing without the need for DNA synthesis or optical detection."
  },
  
  // CRISPR and Gene Editing
  {
    question: "In the CRISPR-Cas9 system, what is the function of the guide RNA (gRNA)?",
    options: ["It activates the Cas9 nuclease", "It directs Cas9 to a specific DNA target sequence", "It repairs the DNA after cutting", "It synthesizes new DNA sequences"],
    answer: 1,
    explanation: "The guide RNA (gRNA) in CRISPR-Cas9 contains a sequence that is complementary to the target DNA sequence, directing the Cas9 nuclease to the specific location in the genome where the DNA should be cut."
  },
  {
    question: "What is the PAM sequence in CRISPR-Cas9 systems?",
    options: ["A sequence in the guide RNA", "A short DNA sequence required for Cas9 binding and cleavage", "The site where DNA repair occurs", "The region between two guide RNA binding sites"],
    answer: 1,
    explanation: "The Protospacer Adjacent Motif (PAM) is a short DNA sequence (often NGG for Cas9) that must be present adjacent to the target sequence for Cas9 to bind and cleave the DNA, serving as a recognition site for the nuclease."
  },
  {
    question: "Which DNA repair mechanism is primarily exploited for gene knockout using CRISPR-Cas9?",
    options: ["Homology directed repair (HDR)", "Non-homologous end joining (NHEJ)", "Base excision repair", "Nucleotide excision repair"],
    answer: 1,
    explanation: "Non-homologous end joining (NHEJ) repairs DNA double-strand breaks by directly ligating the broken ends, often introducing small insertions or deletions (indels) that can disrupt gene function, making it useful for gene knockouts."
  },
  {
    question: "What is a primary advantage of CRISPR-Cas9 over earlier gene editing technologies like ZFNs and TALENs?",
    options: ["It has higher editing efficiency", "It is easier to design and implement", "It causes fewer off-target effects", "It can edit multiple genes simultaneously"],
    answer: 1,
    explanation: "While CRISPR-Cas9 offers several advantages, its primary benefit is the ease of design and implementation. Unlike ZFNs and TALENs, which require complex protein engineering, CRISPR-Cas9 targeting is guided by RNA sequences that are simple to design and synthesize."
  },
  {
    question: "What is the original biological function of CRISPR-Cas systems in bacteria?",
    options: ["DNA repair", "Gene regulation", "Adaptive immunity against viruses", "Horizontal gene transfer"],
    answer: 2,
    explanation: "CRISPR-Cas systems function as an adaptive immune system in bacteria and archaea, allowing them to recognize and destroy viral DNA from previous infections by storing viral DNA fragments that guide Cas nucleases to cleave matching sequences."
  },
  {
    question: "What is the main difference between the Cas9 and Cas12a (Cpf1) CRISPR systems?",
    options: ["Cas9 requires two RNA components while Cas12a needs only one", "Cas9 creates blunt DNA ends while Cas12a creates staggered ends", "Cas9 targets DNA while Cas12a targets RNA", "Cas9 is from bacteria while Cas12a is from archaea"],
    answer: 1,
    explanation: "A key difference is that Cas9 typically creates blunt-ended DNA breaks, while Cas12a (Cpf1) creates staggered cuts with 5' overhangs. Additionally, Cas12a requires only a single CRISPR RNA (no tracrRNA), recognizes a T-rich PAM, and cleaves DNA distal to the PAM site."
  },
  {
    question: "What is 'base editing' in the context of CRISPR technology?",
    options: ["Replacing entire genes with synthetic sequences", "Converting one DNA base to another without double-strand breaks", "Targeting the 3' UTR of genes to regulate expression", "Editing DNA bases in mitochondria"],
    answer: 1,
    explanation: "Base editing combines a catalytically impaired Cas9 (that nicks rather than cuts) with a deaminase enzyme to convert one DNA base to another (e.g., C to T or A to G) without creating double-strand breaks, enabling precise single-nucleotide changes."
  },
  {
    question: "What is CRISPRi used for?",
    options: ["Inserting new genes into the genome", "Knocking out genes permanently", "Temporarily repressing gene expression", "Creating point mutations"],
    answer: 2,
    explanation: "CRISPRi (CRISPR interference) uses a catalytically inactive Cas9 (dCas9) fused to transcriptional repressors to temporarily inhibit gene expression by blocking transcription initiation or elongation, without altering the DNA sequence."
  },
  {
    question: "What is prime editing in CRISPR technology?",
    options: ["A method for editing multiple genes simultaneously", "A technique for inserting very large DNA fragments", "A precise editing approach using a Cas9-reverse transcriptase fusion", "The first generation of CRISPR editing tools"],
    answer: 2,
    explanation: "Prime editing uses a Cas9 nickase fused to a reverse transcriptase, along with a prime editing guide RNA (pegRNA) that both targets the DNA and provides a template for the desired edit, allowing precise insertions, deletions, and all possible base-to-base conversions without double-strand breaks."
  },
  {
    question: "What is a significant challenge in using CRISPR-Cas9 for therapeutic applications?",
    options: ["The protein is too large to be delivered effectively", "It cannot edit non-dividing cells", "Potential off-target effects", "It only works in bacterial cells"],
    answer: 2,
    explanation: "Off-target effects are a significant challenge in therapeutic CRISPR applications. Cas9 can sometimes cut at unintended genomic sites with sequences similar to the target, potentially causing mutations that could lead to cellular dysfunction or oncogenesis."
  },
  
  // Proteomics and Protein Analysis
  {
    question: "Which technique is commonly used to separate proteins based on their isoelectric point and molecular weight?",
    options: ["Western blotting", "Two-dimensional gel electrophoresis", "Affinity chromatography", "Mass spectrometry"],
    answer: 1,
    explanation: "Two-dimensional gel electrophoresis separates proteins in two dimensions: first by isoelectric point (isoelectric focusing) and then by molecular weight (SDS-PAGE), creating a 2D map where each spot typically represents a single protein."
  },
  {
    question: "What is the primary function of matrix-assisted laser desorption/ionization (MALDI) in proteomics?",
    options: ["To visualize proteins in living cells", "To ionize proteins for mass spectrometry analysis", "To separate proteins based on size", "To amplify protein signals"],
    answer: 1,
    explanation: "MALDI is an ionization technique that uses a laser to convert proteins or peptides embedded in a matrix into gas-phase ions, enabling their analysis by mass spectrometry without excessive fragmentation."
  },
  {
    question: "What does tandem mass spectrometry (MS/MS) provide that single-stage MS does not?",
    options: ["Higher sensitivity", "Information about protein modifications", "Sequence information from peptide fragmentation", "Faster analysis time"],
    answer: 2,
    explanation: "Tandem mass spectrometry (MS/MS) involves multiple rounds of mass selection and fragmentation, providing detailed structural information including amino acid sequences from the fragmentation patterns of selected peptides, which isn't possible with single-stage MS."
  },
  {
    question: "Which of the following techniques is used to study protein-protein interactions in living cells?",
    options: ["Circular dichroism", "Förster resonance energy transfer (FRET)", "X-ray crystallography", "Differential scanning calorimetry"],
    answer: 1,
    explanation: "FRET is used to study protein-protein interactions in living cells by measuring energy transfer between fluorescent donor and acceptor molecules when they are in close proximity (typically <10 nm), indicating interaction between the proteins they're attached to."
  },
  {
    question: "What information is provided by hydrogen-deuterium exchange mass spectrometry (HDX-MS)?",
    options: ["Protein molecular weight", "Protein-protein binding sites", "Protein folding dynamics and solvent accessibility", "Complete protein sequence"],
    answer: 2,
    explanation: "HDX-MS provides information about protein dynamics, conformation, and solvent accessibility by measuring the rate at which hydrogen atoms in the protein backbone exchange with deuterium from the solvent, which depends on their structural environment."
  },
  {
    question: "Which technique is most suitable for determining the three-dimensional structure of proteins at atomic resolution?",
    options: ["Circular dichroism", "Electron microscopy", "X-ray crystallography", "SDS-PAGE"],
    answer: 2,
    explanation: "X-ray crystallography can determine protein structures at atomic resolution (often below 2 Å) by analyzing the diffraction pattern produced when X-rays interact with crystallized protein, revealing the precise arrangement of atoms in three dimensions."
  },
  {
    question: "What is a key advantage of cryo-electron microscopy (cryo-EM) over X-ray crystallography for protein structure determination?",
    options: ["It provides higher resolution", "It doesn't require protein crystals", "It's faster to perform", "It's less expensive"],
    answer: 1,
    explanation: "A key advantage of cryo-EM is that it doesn't require protein crystallization, which can be challenging for many proteins, particularly membrane proteins, large complexes, and proteins with flexible regions that resist crystallization."
  },
  {
    question: "Which protein labeling technique uses stable isotopes to compare protein abundance between samples in mass spectrometry-based proteomics?",
    options: ["Western blotting", "SILAC (Stable Isotope Labeling with Amino acids in Cell culture)", "Immunoprecipitation", "FRET"],
    answer: 1,
    explanation: "SILAC incorporates different isotopes of amino acids (typically lysine and arginine) into proteins during cell culture, allowing precise quantitative comparison of protein abundance between different experimental conditions using mass spectrometry."
  },
  {
    question: "What is the primary purpose of a protein microarray?",
    options: ["To separate proteins by size", "To visualize protein localization in tissues", "To detect and measure protein-protein interactions or binding activities", "To amplify protein signals"],
    answer: 2,
    explanation: "Protein microarrays contain immobilized proteins in an array format, allowing parallel analysis of protein-protein interactions, protein-DNA interactions, enzyme-substrate relationships, or antibody specificity across thousands of targets simultaneously."
  },
  {
    question: "Which technique is used to identify proteins that interact with a specific DNA sequence?",
    options: ["Yeast two-hybrid", "Chromatin immunoprecipitation (ChIP)", "Surface plasmon resonance", "Protein microarray"],
    answer: 1,
    explanation: "Chromatin immunoprecipitation (ChIP) is used to identify proteins (often transcription factors) that bind to specific DNA sequences in vivo by cross-linking proteins to DNA, fragmenting the chromatin, and immunoprecipitating with antibodies against the protein of interest."
  },
  
  // Synthetic Biology
  {
    question: "What is a genetic circuit in synthetic biology?",
    options: ["A closed loop of DNA", "A network of regulatory elements that process signals to produce specific outputs", "A device for measuring gene expression", "A graphical representation of gene sequences"],
    answer: 1,
    explanation: "In synthetic biology, genetic circuits are engineered networks of regulatory elements (promoters, genes, etc.) that function like electronic circuits, processing biological inputs to produce specific outputs through gene expression regulation."
  },
  {
    question: "What is the primary goal of the BioBrick standard in synthetic biology?",
    options: ["To create a universal DNA assembly method", "To standardize protein expression levels", "To modify bacteria for environmental cleanup", "To develop new antibiotics"],
    answer: 0,
    explanation: "The BioBrick standard aims to create a universal system for DNA assembly by defining standardized genetic parts with consistent restriction sites and assembly rules, allowing researchers to easily combine and exchange genetic modules."
  },
  {
    question: "Which of the following is a synthetic biology approach to create biosensors?",
    options: ["Using electronic circuits with biological materials", "Engineering cells to produce fluorescent proteins in response to specific stimuli", "Miniaturizing traditional chemical sensors", "Growing cells in microfluidic devices"],
    answer: 1,
    explanation: "A common synthetic biology approach for biosensors involves engineering cells to detect specific stimuli (chemicals, light, etc.) through sensory proteins or RNA and produce detectable outputs like fluorescent proteins or enzymes in response."
  },
  {
    question: "What is a key principle of modular design in synthetic biology?",
    options: ["Using only natural genetic elements", "Creating genetic parts that can function independently and be combined predictably", "Maximizing the complexity of genetic circuits", "Focusing on single-organism systems"],
    answer: 1,
    explanation: "Modular design in synthetic biology involves creating genetic parts (promoters, RBSs, coding sequences, terminators) that have well-defined functions, can operate independently, and can be combined with predictable outcomes to build complex biological systems."
  },
  {
    question: "What is metabolic engineering in the context of synthetic biology?",
    options: ["Measuring the rate of cellular metabolism", "Engineering cells to produce specific metabolites or natural products", "Studying how metabolites affect gene expression", "Developing drugs that target metabolic pathways"],
    answer: 1,
    explanation: "Metabolic engineering involves modifying metabolic pathways by adding, removing, or altering genes to optimize the production of valuable compounds like biofuels, pharmaceuticals, or chemicals, often in microorganisms like yeast or bacteria."
  },
  {
    question: "What is orthogonality in synthetic biology?",
    options: ["The spatial arrangement of genetic parts", "The ability of genetic parts to function independently of the host's native systems", "The angle between DNA strands", "The relationship between gene size and expression level"],
    answer: 1,
    explanation: "Orthogonality refers to the ability of introduced genetic parts to function independently without interfering with or being affected by the host's native cellular systems, reducing unexpected interactions and increasing predictability."
  },
  {
    question: "Which of the following is a key application of cell-free synthetic biology?",
    options: ["Growing artificial organs", "Producing proteins without using living cells", "Creating synthetic organisms", "Developing new plant varieties"],
    answer: 1,
    explanation: "Cell-free synthetic biology uses cellular extracts containing transcription and translation machinery to produce proteins without living cells, offering advantages like reduced complexity, absence of cell walls, and freedom from cell growth constraints."
  },
  {
    question: "What is a genetic toggle switch?",
    options: ["A device that randomly activates different genes", "A bistable genetic circuit that can exist in one of two stable states", "A method to rapidly switch between different bacterial strains", "A technique to turn genes on and off using light"],
    answer: 1,
    explanation: "A genetic toggle switch is a bistable synthetic gene circuit that can exist in one of two stable states and switch between them in response to specific signals, similar to electronic flip-flops, allowing for cellular memory and decision-making."
  },
  {
    question: "Which technology allows for the design and construction of synthetic chromosomes?",
    options: ["CRISPR-Cas9", "Gibson Assembly", "Whole-genome synthesis", "RNA interference"],
    answer: 2,
    explanation: "Whole-genome synthesis technologies, exemplified by projects like Synthetic Yeast 2.0, involve designing and constructing entire chromosomes or genomes by synthesizing DNA fragments and assembling them hierarchically into larger and larger pieces."
  },
  {
    question: "What is directed evolution in the context of protein engineering?",
    options: ["Predicting protein evolution through computational models", "A technique that mimics natural selection to evolve proteins with desired properties", "The natural evolution of proteins in different species", "Engineering proteins to direct cell differentiation"],
    answer: 1,
    explanation: "Directed evolution mimics natural selection in the laboratory by generating diversity through random mutagenesis or recombination, then selecting variants with desired properties through screening or selection, iteratively improving protein function."
  },
  
  // Biotechnology Applications
  {
    question: "What is a key advantage of using monoclonal antibodies in therapeutic applications?",
    options: ["They are inexpensive to produce", "They specifically target their antigens with high specificity", "They can be administered orally", "They are effective against all infectious agents"],
    answer: 1,
    explanation: "Monoclonal antibodies offer high specificity for their target antigens, allowing them to precisely bind to specific molecules (e.g., cell surface receptors, cytokines) while minimizing off-target effects, making them valuable for targeted therapies."
  },
  {
    question: "Which of the following is NOT a common application of biotechnology in agriculture?",
    options: ["Developing pest-resistant crops", "Creating vaccines for livestock", "Improving nutritional content of foods", "Synthesizing artificial meat alternatives"],
    answer: 3,
    explanation: "While biotechnology is used for pest-resistant crops, livestock vaccines, and improving nutrition, synthesizing artificial meat alternatives typically involves food science and cellular agriculture techniques rather than traditional agricultural biotechnology."
  },
  {
    question: "What is gene therapy?",
    options: ["Treatment of genetic disorders using drugs", "The use of genes as biomarkers for disease diagnosis", "The introduction of genetic material to treat or prevent disease", "A method to silence gene expression"],
    answer: 2,
    explanation: "Gene therapy involves introducing genetic material (DNA or RNA) into cells to treat or prevent disease, either by replacing a mutated gene, inactivating a malfunctioning gene, or introducing a new gene to help fight disease."
  },
  {
    question: "Which of the following is a key application of PCR in forensic science?",
    options: ["Determining time of death", "Analyzing DNA from crime scene samples", "Testing for drug use", "Identifying bullet trajectories"],
    answer: 1,
    explanation: "PCR is essential in forensic science for amplifying small amounts of DNA from crime scene samples (blood, hair, etc.), enabling analysis through DNA profiling even when the original sample is limited or degraded."
  },
  {
    question: "What is bioremediation?",
    options: ["Using biological agents to treat environmental pollution", "Developing biofuels from renewable resources", "Creating biodegradable plastics", "Restoring damaged ecosystems through reforestation"],
    answer: 0,
    explanation: "Bioremediation uses biological agents (microorganisms, plants) to neutralize or remove environmental pollutants from contaminated sites, breaking down or transforming hazardous substances into less harmful forms."
  },
  {
    question: "Which technology is used to produce human insulin for diabetic patients?",
    options: ["Extraction from pig pancreas", "Chemical synthesis", "Recombinant DNA technology", "Tissue culture"],
    answer: 2,
    explanation: "Human insulin is produced using recombinant DNA technology, where the human insulin gene is inserted into bacteria or yeast, which then produce human insulin through fermentation, providing a reliable and safe supply of the hormone."
  },
  {
    question: "What is the primary purpose of a DNA vaccine?",
    options: ["To prevent DNA damage", "To induce immune response against specific antigens", "To repair genetic mutations", "To block viral DNA replication"],
    answer: 1,
    explanation: "DNA vaccines contain genes encoding specific antigens that, when delivered to host cells, produce the antigen and induce an immune response against it, training the immune system to recognize and fight the actual pathogen if later encountered."
  },
  {
    question: "Which biotechnology technique is used to analyze the complete set of proteins in a biological sample?",
    options: ["Genomics", "Transcriptomics", "Proteomics", "Metabolomics"],
    answer: 2,
    explanation: "Proteomics involves the large-scale study of proteins in a biological sample, including their structure, function, abundance, modifications, and interactions, typically using techniques like mass spectrometry and protein arrays."
  },
  {
    question: "What is the primary goal of pharmacogenomics?",
    options: ["Developing new pharmaceutical drugs", "Studying the genetic basis of drug responses", "Creating personalized drug delivery systems", "Measuring drug concentrations in blood"],
    answer: 1,
    explanation: "Pharmacogenomics studies how genetic variations affect individual responses to drugs, aiming to optimize drug selection and dosing based on a patient's genetic profile to maximize efficacy and minimize adverse effects."
  },
  {
    question: "Which of the following is a key application of CRISPR-Cas9 in agriculture?",
    options: ["Creating herbicide-resistant weeds", "Developing crops with improved traits like disease resistance", "Engineering animals that grow larger than normal", "Reducing the cost of fertilizers"],
    answer: 1,
    explanation: "CRISPR-Cas9 is used in agriculture to develop crops with improved traits such as disease resistance, drought tolerance, increased yield, enhanced nutritional content, and extended shelf life through precise genetic modifications."
  },
  
  // Molecular Biotechnology Ethics
  {
    question: "What is a key ethical concern related to human germline gene editing?",
    options: ["High cost of the technology", "Changes would be passed to future generations", "Difficulty in obtaining patient consent", "Lack of effective delivery methods"],
    answer: 1,
    explanation: "A key ethical concern with human germline gene editing is that genetic changes made to embryos, eggs, or sperm would be inherited by all future generations, potentially having unpredictable long-term effects on human evolution."
  },
  {
    question: "Which of the following best describes the concept of dual-use research in biotechnology?",
    options: ["Research that can be applied in both academia and industry", "Research that benefits two or more species", "Research with potential beneficial applications but also potential for misuse", "Research conducted simultaneously in two different laboratories"],
    answer: 2,
    explanation: "Dual-use research refers to life sciences research that, while intended for beneficial purposes, could be misused for harmful purposes such as bioterrorism or bioweapons development, raising ethical questions about research oversight and publication."
  },
  {
    question: "What is a key consideration in the ethical debate surrounding genetically modified organisms (GMOs) in agriculture?",
    options: ["Whether GMOs can be patented", "Whether GMOs can cross-breed with wild relatives", "The corporate ownership of seeds", "All of the above"],
    answer: 3,
    explanation: "The ethical debate surrounding GMOs encompasses multiple considerations, including intellectual property rights and patenting of living organisms, potential ecological impacts of gene flow to wild relatives, and corporate control of the food supply through seed ownership."
  },
  {
    question: "Which of the following is a primary ethical concern related to genetic testing?",
    options: ["Privacy and potential genetic discrimination", "The high cost of testing equipment", "The need for specialized laboratory facilities", "The long time required to get results"],
    answer: 0,
    explanation: "Privacy and potential genetic discrimination are major ethical concerns with genetic testing, as genetic information could potentially be used by employers or insurers to discriminate against individuals with genetic predispositions to certain conditions."
  },
  {
    question: "What is the concept of biosafety in molecular biotechnology?",
    options: ["Protecting research data from cyber attacks", "Preventing the escape of genetically modified organisms into the environment", "Ensuring fair access to biotechnology benefits", "Verifying that biotechnology products meet quality standards"],
    answer: 1,
    explanation: "Biosafety involves practices, procedures, and containment measures designed to prevent unintentional exposure to biological agents or their accidental release into the environment, particularly concerning genetically modified organisms or pathogens."
  },
  {
    question: "What is informed consent in the context of genetic research?",
    options: ["Permission from research institutions to conduct studies", "A participant's voluntary agreement to take part in research after understanding its purposes and implications", "Agreement between researchers to share data", "Approval from ethics committees for research protocols"],
    answer: 1,
    explanation: "Informed consent in genetic research refers to a process where participants voluntarily agree to participate after being fully informed about the nature of the research, its purposes, potential risks and benefits, and how their genetic information will be used and protected."
  },
  {
    question: "Which of the following best describes the precautionary principle as applied to biotechnology?",
    options: ["Taking action to protect against harm even without scientific certainty", "Requiring exhaustive testing before any new technology is approved", "Pursuing technological advancement regardless of potential risks", "Following traditional research methods over novel approaches"],
    answer: 0,
    explanation: "The precautionary principle states that when an activity raises threats of harm to human health or the environment, precautionary measures should be taken even if some cause-and-effect relationships are not fully established scientifically."
  },
  {
    question: "What is a key ethical consideration in human genome sequencing projects?",
    options: ["The technical difficulty of sequencing entire genomes", "Ownership and control of genetic information", "The time required to complete sequencing", "The number of researchers needed"],
    answer: 1,
    explanation: "Ownership and control of genetic information raise significant ethical questions in human genome sequencing, including who owns the data, how it can be used in research, whether it should be shared with participants, and how privacy is protected."
  },
  {
    question: "Which statement best reflects the concept of distributive justice in biotechnology?",
    options: ["All biotechnology patents should be in the public domain", "Benefits and burdens of biotechnology should be fairly distributed", "Biotechnology should prioritize the most profitable applications", "Researchers should distribute their findings through open-access publications"],
    answer: 1,
    explanation: "Distributive justice in biotechnology concerns the fair distribution of benefits, risks, and costs, addressing questions like who gains access to expensive biotechnologies, whether low-income populations benefit, and how to ensure equitable global access."
  },
  {
    question: "What is a key ethical concern regarding DNA databases used in law enforcement?",
    options: ["Technical reliability of the databases", "Potential for racial and ethnic biases", "High cost of maintaining the databases", "Limited utility in solving crimes"],
    answer: 1,
    explanation: "A key ethical concern regarding forensic DNA databases is the potential for racial and ethnic biases, as overrepresentation of certain groups in criminal justice systems can lead to disproportionate inclusion in databases and reinforcement of systemic inequalities."
  }
];

const BiotechnologyQuiz = ({ quizQuestions = defaultQuestions }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [progress, setProgress] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [quizMode, setQuizMode] = useState('sequential'); // 'sequential' or 'random'
  const [showInstructionsDialog, setShowInstructionsDialog] = useState(false);
  
  // Initialize quiz with selected questions
  useEffect(() => {
    if (quizQuestions && quizQuestions.length > 0) {
      if (quizMode === 'random') {
        // Select a random subset of questions
        const randomQuestions = [...quizQuestions]
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.min(10, quizQuestions.length));
        setSelectedQuestions(randomQuestions);
      } else {
        // Use all questions in sequential order
        setSelectedQuestions(quizQuestions);
      }
    }
  }, [quizQuestions, quizMode]);
  
  // Update progress when current question changes
  useEffect(() => {
    if (selectedQuestions.length > 0) {
      setProgress(((currentQuestion + 1) / selectedQuestions.length) * 100);
    }
  }, [currentQuestion, selectedQuestions.length]);
  
  // Handle option selection
  const handleOptionSelect = (event) => {
    if (!answered) {
      setSelectedOption(parseInt(event.target.value));
    }
  };
  
  // Submit answer
  const handleSubmit = () => {
    if (selectedOption !== null && !answered) {
      const currentAnswer = selectedQuestions[currentQuestion].answer;
      const isCorrect = selectedOption === currentAnswer;
      
      if (isCorrect) {
        setScore(score + 1);
      }
      
      // Track this question as answered
      setAnsweredQuestions([
        ...answeredQuestions,
        {
          questionIndex: currentQuestion,
          selected: selectedOption,
          correct: isCorrect
        }
      ]);
      
      setAnswered(true);
    }
  };
  
  // Move to next question or complete quiz
  const handleNextQuestion = () => {
    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setAnswered(false);
      setShowExplanation(false);
    } else {
      setQuizComplete(true);
    }
  };
  
  // Move to previous question
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      
      // Find if this question was already answered
      const prevAnswer = answeredQuestions.find(q => q.questionIndex === currentQuestion - 1);
      if (prevAnswer) {
        setSelectedOption(prevAnswer.selected);
        setAnswered(true);
      } else {
        setSelectedOption(null);
        setAnswered(false);
      }
      
      setShowExplanation(false);
    }
  };
  
  // Toggle explanation visibility
  const toggleExplanation = () => {
    setShowExplanation(!showExplanation);
  };
  
  // Restart the quiz
  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setAnswered(false);
    setScore(0);
    setProgress(0);
    setQuizComplete(false);
    setShowExplanation(false);
    setAnsweredQuestions([]);
    
    // Re-select questions if in random mode
    if (quizMode === 'random') {
      const randomQuestions = [...quizQuestions]
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(10, quizQuestions.length));
      setSelectedQuestions(randomQuestions);
    }
  };
  
  // Start the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    restartQuiz();
  };
  
  // Change quiz mode
  const changeQuizMode = (mode) => {
    setQuizMode(mode);
  };
  
  // Calculate performance metrics
  const calculatePerformance = () => {
    const totalQuestions = selectedQuestions.length;
    const correctAnswers = score;
    const percentageScore = Math.round((correctAnswers / totalQuestions) * 100);
    
    let performance = '';
    if (percentageScore >= 90) {
      performance = 'Excellent';
    } else if (percentageScore >= 75) {
      performance = 'Good';
    } else if (percentageScore >= 60) {
      performance = 'Satisfactory';
    } else {
      performance = 'Needs Improvement';
    }
    
    return {
      totalQuestions,
      correctAnswers,
      percentageScore,
      performance
    };
  };
  
  // Show quiz instructions
  const handleShowInstructions = () => {
    setShowInstructionsDialog(true);
  };
  
  // Render quiz introduction screen
  if (!quizStarted) {
    return (
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Molecular Biotechnology Quiz
          </Typography>
          <Typography variant="body1" paragraph>
            Test your knowledge of molecular biotechnology concepts and techniques.
          </Typography>
          
          <Box sx={{ mb: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant={quizMode === 'sequential' ? 'contained' : 'outlined'} 
              onClick={() => changeQuizMode('sequential')}
            >
              Full Quiz
            </Button>
            <Button 
              variant={quizMode === 'random' ? 'contained' : 'outlined'} 
              onClick={() => changeQuizMode('random')}
            >
              Quick Quiz (10 Random Questions)
            </Button>
          </Box>
          
          <Alert severity="info" sx={{ mb: 4, textAlign: 'left' }}>
            <Typography variant="body2">
              This quiz covers key concepts from molecular biotechnology, including recombinant DNA techniques, 
              PCR, protein expression, genomics, and biotechnology applications.
            </Typography>
          </Alert>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" gutterBottom>Quiz Topics:</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" justifyContent="center" sx={{ gap: 1 }}>
              <Chip label="Recombinant DNA" color="primary" />
              <Chip label="PCR Techniques" color="primary" />
              <Chip label="Gene Expression" color="primary" />
              <Chip label="Protein Production" color="primary" />
              <Chip label="Genomics" color="primary" />
              <Chip label="CRISPR Technology" color="primary" />
              <Chip label="Biotechnology Applications" color="primary" />
            </Stack>
          </Box>
          
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <Button 
                variant="contained" 
                size="large" 
                startIcon={<HomeIcon />}
                onClick={startQuiz}
              >
                Start Quiz
              </Button>
            </Grid>
            <Grid item>
              <Button 
                variant="outlined" 
                size="large" 
                startIcon={<HelpIcon />}
                onClick={handleShowInstructions}
              >
                How to Play
              </Button>
            </Grid>
          </Grid>
        </Paper>
        
        {/* Instructions Dialog */}
        <Dialog 
          open={showInstructionsDialog} 
          onClose={() => setShowInstructionsDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>How to Play</DialogTitle>
          <DialogContent>
            <Typography variant="body2" paragraph>
              <strong>1.</strong> Read each question carefully and select the most appropriate answer from the options provided.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>2.</strong> Click "Submit Answer" to check if your answer is correct.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>3.</strong> After submitting, you can view an explanation for the correct answer.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>4.</strong> Use the "Next" and "Previous" buttons to navigate between questions.
            </Typography>
            <Typography variant="body2" paragraph>
              <strong>5.</strong> At the end of the quiz, you'll receive a summary of your performance.
            </Typography>
            <Typography variant="body2">
              <strong>6.</strong> You can restart the quiz at any time to try again.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setShowInstructionsDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  
  // Render quiz completion screen
  if (quizComplete) {
    const { totalQuestions, correctAnswers, percentageScore, performance } = calculatePerformance();
    
    return (
      <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center">
            Quiz Results
          </Typography>
          
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <Typography variant="h5" color="primary" gutterBottom>
              {performance}
            </Typography>
            <Typography variant="h6">
              Score: {correctAnswers} / {totalQuestions} ({percentageScore}%)
            </Typography>
          </Box>
          
          <Divider sx={{ mb: 3 }} />
          
          <Alert 
            severity={percentageScore >= 75 ? "success" : percentageScore >= 60 ? "info" : "warning"}
            sx={{ mb: 3 }}
          >
            {percentageScore >= 90 ? (
              <Typography variant="body2">
                Excellent work! You have a strong understanding of molecular biotechnology concepts.
              </Typography>
            ) : percentageScore >= 75 ? (
              <Typography variant="body2">
                Good job! You have a solid grasp of most molecular biotechnology principles.
              </Typography>
            ) : percentageScore >= 60 ? (
              <Typography variant="body2">
                You have a basic understanding of molecular biotechnology, but there's room for improvement.
              </Typography>
            ) : (
              <Typography variant="body2">
                You might benefit from reviewing the fundamental concepts of molecular biotechnology.
              </Typography>
            )}
          </Alert>
          
          <Typography variant="subtitle1" gutterBottom>
            Question Summary:
          </Typography>
          
          <Box sx={{ mb: 4 }}>
            {answeredQuestions.map((answered, index) => {
              const question = selectedQuestions[answered.questionIndex];
              return (
                <Box 
                  key={index}
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    mb: 1,
                    p: 1,
                    borderRadius: 1,
                    bgcolor: answered.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)'
                  }}
                >
                  {answered.correct ? (
                    <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                  ) : (
                    <CancelIcon color="error" sx={{ mr: 1 }} />
                  )}
                  <Typography variant="body2" sx={{ flexGrow: 1 }}>
                    {index + 1}. {question.question.length > 60 ? 
                      `${question.question.substring(0, 60)}...` : 
                      question.question}
                  </Typography>
                  {!answered.correct && (
                    <Typography variant="caption" color="error">
                      Correct: {question.options[question.answer]}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button 
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={restartQuiz}
            >
              Restart Quiz
            </Button>
            <Button 
              variant="outlined"
              onClick={() => setQuizStarted(false)}
            >
              Back to Home
            </Button>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  // Render the current question
  const currentQuestionData = selectedQuestions[currentQuestion];
  
  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto' }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2">
            Question {currentQuestion + 1} of {selectedQuestions.length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" color="primary" sx={{ mr: 1 }}>
              Score: {score}
            </Typography>
            <IconButton size="small" onClick={handleShowInstructions}>
              <HelpIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }} 
        />
        
        <Typography variant="h6" gutterBottom>
          {currentQuestionData.question}
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: '100%', my: 2 }}>
          <RadioGroup value={selectedOption} onChange={handleOptionSelect}>
            {currentQuestionData.options.map((option, index) => (
              <Card 
                key={index} 
                variant="outlined" 
                sx={{ 
                  mb: 1,
                  borderColor: answered && index === currentQuestionData.answer ? 'success.main' : 
                              answered && index === selectedOption && selectedOption !== currentQuestionData.answer ? 'error.main' : 
                              'divider'
                }}
              >
                <CardContent sx={{ py: 1 }}>
                  <FormControlLabel
                    value={index}
                    control={<Radio />}
                    label={option}
                    disabled={answered}
                    sx={{ 
                      width: '100%',
                      m: 0,
                      '.MuiFormControlLabel-label': { width: '100%' }
                    }}
                  />
                </CardContent>
              </Card>
            ))}
          </RadioGroup>
        </FormControl>
        
        {answered && (
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity={selectedOption === currentQuestionData.answer ? "success" : "error"}
              sx={{ mb: 2 }}
            >
              {selectedOption === currentQuestionData.answer ? (
                <Typography variant="body2">
                  Correct! {currentQuestionData.options[currentQuestionData.answer]} is the right answer.
                </Typography>
              ) : (
                <Typography variant="body2">
                  Incorrect. The correct answer is: {currentQuestionData.options[currentQuestionData.answer]}
                </Typography>
              )}
            </Alert>
            
            <Button 
              variant="text" 
              color="primary" 
              onClick={toggleExplanation}
              size="small"
            >
              {showExplanation ? "Hide Explanation" : "Show Explanation"}
            </Button>
            
            {showExplanation && (
              <Paper variant="outlined" sx={{ p: 2, mt: 1, bgcolor: '#f8f9fa' }}>
                <Typography variant="body2">
                  {currentQuestionData.explanation}
                </Typography>
              </Paper>
            )}
          </Box>
        )}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            startIcon={<ArrowBackIcon />}
          >
            Previous
          </Button>
          
          <Box>
            {!answered ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={selectedOption === null}
              >
                Submit Answer
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
                endIcon={<ArrowForwardIcon />}
              >
                {currentQuestion < selectedQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default BiotechnologyQuiz;