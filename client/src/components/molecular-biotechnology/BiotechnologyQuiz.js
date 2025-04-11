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
    question: "What is the primary function of DNA helicases in DNA replication?",
    options: ["To join DNA fragments together", "To unwind the DNA double helix", "To proofread newly synthesized DNA", "To add primers to the template strand"],
    answer: 1,
    explanation: "DNA helicases are enzymes that unwind the DNA double helix by breaking the hydrogen bonds between base pairs, creating single-stranded templates that can be used for DNA synthesis during replication."
  },
  {
    question: "Which of the following best describes the function of topoisomerases in DNA replication?",
    options: ["They add nucleotides to growing DNA strands", "They remove RNA primers", "They relieve torsional stress in DNA", "They mark the origin of replication"],
    answer: 2,
    explanation: "Topoisomerases relieve torsional stress that accumulates ahead of the replication fork during DNA unwinding by creating temporary breaks in the DNA backbone, allowing the strands to rotate and relieving the tension."
  },
  {
    question: "What is the role of DNA polymerase I in bacterial DNA replication?",
    options: ["Initial synthesis of the leading strand", "Continuous synthesis of the lagging strand", "Removal of RNA primers and gap filling", "Unwinding the DNA double helix"],
    answer: 2,
    explanation: "DNA polymerase I has 5′→3′ polymerase activity and 5′→3′ exonuclease activity, which allows it to remove RNA primers and fill the gaps between Okazaki fragments during lagging strand synthesis."
  },
  {
    question: "What type of bond is primarily responsible for holding the DNA double helix together?",
    options: ["Phosphodiester bonds", "Hydrogen bonds", "Covalent bonds", "Ionic bonds"],
    answer: 1,
    explanation: "Hydrogen bonds between complementary base pairs (A-T and G-C) are primarily responsible for holding the two strands of the DNA double helix together. These are weaker than covalent bonds, allowing the strands to separate during replication and transcription."
  },
  {
    question: "In eukaryotic DNA, what proteins are responsible for packaging DNA into a more compact structure?",
    options: ["Topoisomerases", "Histones", "Polymerases", "Helicases"],
    answer: 1,
    explanation: "Histones are positively charged proteins that interact with the negatively charged DNA to form nucleosomes, the basic unit of DNA packaging in eukaryotes, which allows the long DNA molecules to fit within the cell nucleus."
  },
  {
    question: "What is the function of primase in DNA replication?",
    options: ["To synthesize RNA primers", "To remove RNA primers", "To join Okazaki fragments", "To proofread newly synthesized DNA"],
    answer: 0,
    explanation: "Primase is an RNA polymerase that synthesizes short RNA sequences (primers) that provide a 3'-OH group for DNA polymerase to begin DNA synthesis, as DNA polymerase cannot initiate DNA synthesis de novo."
  },
  {
    question: "What is the primary difference between the leading and lagging strands during DNA replication?",
    options: ["The leading strand uses RNA primers while the lagging strand does not", "The leading strand is synthesized continuously, while the lagging strand is synthesized discontinuously", "The leading strand is synthesized by DNA polymerase I, while the lagging strand is synthesized by DNA polymerase III", "The leading strand is synthesized in the 3' to 5' direction, while the lagging strand is synthesized in the 5' to 3' direction"],
    answer: 1,
    explanation: "The leading strand is synthesized continuously in the 5' to 3' direction as the replication fork advances, while the lagging strand is synthesized discontinuously in short fragments (Okazaki fragments) in the opposite direction of fork movement."
  },
  {
    question: "What is the role of DNA ligase in DNA replication?",
    options: ["To unwind the DNA double helix", "To add nucleotides to the growing DNA strand", "To join Okazaki fragments together", "To remove RNA primers"],
    answer: 2,
    explanation: "DNA ligase catalyzes the formation of phosphodiester bonds between the 3'-OH end of one DNA fragment and the 5'-phosphate end of another, sealing the nicks between adjacent Okazaki fragments on the lagging strand."
  },
  {
    question: "Which of the following is NOT true about telomeres?",
    options: ["They protect the ends of chromosomes", "They contain repetitive DNA sequences", "They are extended by telomerase", "They encode essential proteins"],
    answer: 3,
    explanation: "Telomeres do not encode essential proteins; they consist of repetitive DNA sequences (TTAGGG in humans) that protect chromosome ends from degradation and fusion but do not contain protein-coding genes."
  },
  {
    question: "What is the semi-conservative model of DNA replication?",
    options: ["Each daughter DNA molecule contains one strand from the parent molecule and one newly synthesized strand", "Each daughter DNA molecule contains two newly synthesized strands", "Each daughter DNA molecule contains both original parental strands", "The parental DNA remains intact, and an entirely new DNA molecule is synthesized"],
    answer: 0,
    explanation: "In semi-conservative replication, each parental DNA strand serves as a template for the synthesis of a new complementary strand, resulting in daughter molecules that each contain one original parental strand and one newly synthesized strand."
  },
  {
    question: "What enzyme is responsible for removing RNA primers during DNA replication?",
    options: ["DNA polymerase I", "Primase", "DNA ligase", "Helicase"],
    answer: 0,
    explanation: "DNA polymerase I has 5'→3' exonuclease activity that allows it to remove RNA primers from the 5' end of Okazaki fragments during DNA replication, and then fill the gaps with DNA nucleotides."
  },
  {
    question: "What is the function of the single-stranded binding proteins (SSBs) during DNA replication?",
    options: ["To initiate DNA synthesis", "To stabilize single-stranded DNA and prevent secondary structure formation", "To join Okazaki fragments", "To synthesize RNA primers"],
    answer: 1,
    explanation: "Single-stranded binding proteins (SSBs) bind to single-stranded DNA exposed during replication, preventing the formation of secondary structures and protecting the DNA from nuclease degradation until it can be used as a template for synthesis."
  },
  {
    question: "What is the main role of origin recognition complex (ORC) in eukaryotic DNA replication?",
    options: ["To synthesize the leading strand", "To bind to the origin of replication and initiate assembly of the pre-replication complex", "To remove RNA primers from Okazaki fragments", "To prevent DNA damage during replication"],
    answer: 1,
    explanation: "The origin recognition complex (ORC) binds to specific DNA sequences at origins of replication and serves as a platform for the assembly of the pre-replication complex, which is necessary for the initiation of DNA replication in eukaryotes."
  },
  {
    question: "What is the main function of DNA methylation in eukaryotic cells?",
    options: ["To increase the rate of DNA replication", "To prevent DNA damage", "To regulate gene expression", "To repair mismatched base pairs"],
    answer: 2,
    explanation: "DNA methylation, particularly at CpG sites, is a key epigenetic modification that typically represses gene transcription by affecting chromatin structure and preventing the binding of transcription factors, thus playing a crucial role in gene regulation."
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
    question: "What is the purpose of a hot-start PCR?",
    options: ["To increase the reaction temperature for better denaturation", "To prevent non-specific amplification before the initial denaturation step", "To minimize the degradation of DNA polymerase", "To amplify particularly GC-rich templates"],
    answer: 1,
    explanation: "Hot-start PCR prevents premature amplification and non-specific binding of primers at lower temperatures by keeping the polymerase inactive until the initial high-temperature denaturation step, typically using antibody-blocked or chemically modified polymerases."
  },
  {
    question: "What is the primary purpose of gradient PCR?",
    options: ["To gradually increase DNA polymerase concentration", "To optimize annealing temperature for a specific primer pair", "To create a gradient of template DNA concentrations", "To gradually decrease the denaturation temperature"],
    answer: 1,
    explanation: "Gradient PCR allows simultaneous testing of multiple annealing temperatures in a single run by creating a temperature gradient across the thermal block, facilitating efficient optimization of PCR conditions for specific primer sets."
  },
  {
    question: "Which of the following would NOT be a valid approach to increase PCR specificity?",
    options: ["Increasing annealing temperature", "Using hot-start polymerase", "Reducing the annealing time", "Adding more template DNA"],
    answer: 3,
    explanation: "Adding more template DNA typically wouldn't increase specificity and might actually decrease it by increasing the chances of non-specific binding. The other approaches (higher annealing temperature, hot-start polymerase, and shorter annealing time) can all help increase specificity."
  },
  {
    question: "What is the purpose of adding DMSO to some PCR reactions?",
    options: ["To increase polymerase activity", "To facilitate amplification of GC-rich templates", "To prevent sample evaporation", "To reduce primer degradation"],
    answer: 1,
    explanation: "Dimethyl sulfoxide (DMSO) is added as a PCR additive to facilitate the amplification of GC-rich templates by disrupting base pairing, thereby reducing secondary structure formation and lowering the melting temperature of the DNA."
  },
  {
    question: "What is the main difference between standard PCR and quantitative PCR (qPCR)?",
    options: ["qPCR uses different polymerases", "qPCR measures the amount of product in real-time", "qPCR amplifies longer DNA fragments", "qPCR doesn't require thermal cycling"],
    answer: 1,
    explanation: "Quantitative PCR (qPCR) measures the amplification product in real-time using fluorescent reporters, allowing accurate quantification of the starting template amount, whereas standard PCR only provides end-point analysis."
  },
  {
    question: "Which of the following detection methods is commonly used in quantitative PCR (qPCR)?",
    options: ["Ethidium bromide staining", "SYBR Green fluorescence", "Silver staining", "Autoradiography"],
    answer: 1,
    explanation: "SYBR Green is a fluorescent dye that binds to double-stranded DNA and is commonly used in qPCR to monitor the accumulation of PCR products in real-time, with the fluorescence intensity being proportional to the amount of double-stranded DNA present."
  },
  {
    question: "What is the purpose of the uracil-DNA glycosylase (UDG) system in PCR?",
    options: ["To improve amplification efficiency", "To prevent contamination from previous PCR products", "To enable the use of RNA templates", "To increase the fidelity of DNA polymerase"],
    answer: 1,
    explanation: "The UDG system prevents carryover contamination from previous PCR reactions by incorporating dUTP instead of dTTP during amplification and treating subsequent reactions with UDG enzyme, which degrades uracil-containing DNA (previous PCR products) but not thymine-containing DNA (original template)."
  },
  {
    question: "What is asymmetric PCR used for?",
    options: ["Generating single-stranded DNA products", "Amplifying two different templates simultaneously", "Creating unequal amplification of the two DNA strands", "Analyzing DNA polymorphisms"],
    answer: 0,
    explanation: "Asymmetric PCR generates single-stranded DNA products by using unequal primer concentrations, typically with one primer in excess, resulting in preferential amplification of one strand over the other after the limiting primer is depleted."
  },
  {
    question: "What is the primary limitation of the polymerase chain reaction (PCR)?",
    options: ["It can only amplify small DNA fragments", "It requires knowing the sequence of the target region", "It cannot be used with degraded DNA samples", "It is too expensive for routine use"],
    answer: 1,
    explanation: "A primary limitation of PCR is the requirement for prior knowledge of the target DNA sequence to design specific primers. Without this sequence information, conventional PCR cannot be performed effectively."
  },
  {
    question: "What is multiplex PCR?",
    options: ["PCR that uses multiple thermal cyclers simultaneously", "PCR that amplifies multiple target sequences in a single reaction", "PCR with multiple denaturation steps per cycle", "PCR that produces multiple copies of the same target"],
    answer: 1,
    explanation: "Multiplex PCR involves the simultaneous amplification of multiple DNA targets in a single reaction tube, using multiple primer pairs specific for different sequences, which saves time, reagents, and sample material."
  },
  {
    question: "Which of the following is NOT a common application of PCR?",
    options: ["DNA sequencing preparation", "Genetic fingerprinting", "Direct protein synthesis", "Pathogen detection"],
    answer: 2,
    explanation: "PCR cannot directly synthesize proteins; it amplifies DNA. Protein synthesis requires translation machinery (ribosomes, tRNAs, etc.). PCR is commonly used for DNA sequencing preparation, genetic fingerprinting, and pathogen detection."
  },
  {
    question: "What is the function of primers in PCR?",
    options: ["To activate the DNA polymerase", "To provide nucleotides for DNA synthesis", "To provide a starting point for DNA synthesis", "To separate the DNA strands"],
    answer: 2,
    explanation: "Primers are short synthetic oligonucleotides that bind to complementary sequences on the template DNA, providing a free 3'-OH group that DNA polymerase requires as a starting point for DNA synthesis during PCR."
  },
  {
    question: "What is reverse transcription PCR (RT-PCR) used for?",
    options: ["Amplifying DNA in the reverse direction", "Converting RNA to DNA before PCR amplification", "Reversing point mutations in DNA", "Detecting PCR products in real-time"],
    answer: 1,
    explanation: "Reverse transcription PCR (RT-PCR) first uses reverse transcriptase to convert RNA to complementary DNA (cDNA), which is then amplified by standard PCR, allowing the analysis of RNA expression or the detection of RNA viruses."
  },
  {
    question: "Which of the following factors does NOT typically affect PCR efficiency?",
    options: ["Primer design", "Buffer pH", "The color of the PCR tubes", "Template DNA quality"],
    answer: 2,
    explanation: "The color of PCR tubes does not affect PCR efficiency, as long as the tubes are made of appropriate materials for thermal cycling. Primer design, buffer pH, and template DNA quality all significantly impact PCR efficiency."
  },
  {
    question: "What is the purpose of a touchdown PCR protocol?",
    options: ["To gradually decrease the annealing temperature through successive cycles", "To reduce the overall reaction time", "To increase DNA polymerase stability", "To eliminate the need for primer optimization"],
    answer: 0,
    explanation: "Touchdown PCR uses an initial annealing temperature above the expected primer melting temperature, which is then gradually decreased in subsequent cycles. This enhances specificity in early cycles and increases yield in later cycles, reducing non-specific amplification."
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
    question: "What is the primary advantage of using a tetracycline-inducible promoter system?",
    options: ["It provides the highest level of protein expression", "It allows precise control of gene expression through addition or removal of tetracycline", "It works in both prokaryotic and eukaryotic systems without modification", "It prevents the formation of inclusion bodies"],
    answer: 1,
    explanation: "Tetracycline-inducible promoter systems (like Tet-On or Tet-Off) allow precise temporal control of gene expression by adding or removing tetracycline or its derivatives, enabling researchers to turn gene expression on or off at specific times during an experiment."
  },
  {
    question: "What is the role of chaperone proteins in recombinant protein expression?",
    options: ["They transport the recombinant protein to the correct cellular compartment", "They assist in proper protein folding", "They protect the recombinant protein from degradation", "They enhance translation efficiency"],
    answer: 1,
    explanation: "Chaperone proteins assist in proper protein folding by preventing inappropriate interactions between partially folded proteins and guiding them to their native conformation, which is particularly important for the production of soluble and functional recombinant proteins."
  },
  {
    question: "What is meant by 'leaky expression' in inducible expression systems?",
    options: ["Expression of the protein outside of the cell", "Low-level expression in the absence of an inducer", "Expression that decreases over time", "Expression that varies between individual cells"],
    answer: 1,
    explanation: "Leaky expression refers to the undesired background expression of the target gene in the absence of an inducer, which can be problematic when tight regulation of toxic proteins is required or when studying the effects of gene expression timing."
  },
  {
    question: "What is the primary advantage of using baculovirus expression systems for recombinant protein production?",
    options: ["They are the simplest system to use", "They provide the highest protein yields", "They perform complex eukaryotic post-translational modifications", "They are the least expensive expression system"],
    answer: 2,
    explanation: "Baculovirus expression systems use insect cells to produce recombinant proteins and can perform many complex eukaryotic post-translational modifications (like glycosylation and phosphorylation) that bacterial systems cannot, making them suitable for the production of functional mammalian proteins."
  },
  {
    question: "What is the function of a Shine-Dalgarno sequence in a bacterial expression vector?",
    options: ["It serves as a transcription start site", "It acts as a ribosome binding site", "It marks the end of transcription", "It enhances mRNA stability"],
    answer: 1,
    explanation: "The Shine-Dalgarno sequence serves as a ribosome binding site (RBS) in prokaryotes, allowing the ribosome to recognize and bind to the mRNA at the correct position to initiate translation of the protein-coding sequence that follows."
  },
  {
    question: "What is the role of fusion tags in recombinant protein expression?",
    options: ["To increase the molecular weight of the protein", "To aid in protein purification or solubility", "To add fluorescence to the protein", "To protect the protein from host cell proteases"],
    answer: 1,
    explanation: "Fusion tags are additional amino acid sequences added to recombinant proteins to facilitate their purification (e.g., His-tag, GST), improve solubility (e.g., MBP, SUMO), enhance detection (e.g., FLAG, GFP), or address other challenges in protein production and analysis."
  },
  {
    question: "What is the purpose of the lac operator in the T7 expression system?",
    options: ["To synthesize lactose for cell growth", "To regulate the expression of the T7 RNA polymerase", "To control the activity of the lac repressor", "To enhance translation efficiency"],
    answer: 1,
    explanation: "In the T7 expression system, the lac operator regulates the expression of T7 RNA polymerase, which is specific for the T7 promoter. The lac repressor binds to the lac operator, preventing T7 RNA polymerase expression until an inducer (like IPTG) is added, providing control over recombinant protein expression."
  },
  {
    question: "What is a potential disadvantage of constitutive promoters in recombinant protein expression?",
    options: ["They require expensive inducers", "They may lead to toxicity if the expressed protein is harmful to the host cell", "They are specific to certain host organisms", "They result in lower overall protein yields"],
    answer: 1,
    explanation: "Constitutive promoters drive continuous gene expression, which can lead to toxicity if the recombinant protein is harmful to the host cell, potentially resulting in growth inhibition, cell death, or selection for mutants with reduced expression, especially during the early growth phase."
  },
  {
    question: "What is the primary purpose of using a periplasmic signal sequence in bacterial protein expression?",
    options: ["To increase expression levels", "To direct the protein to the periplasmic space for proper folding or secretion", "To enhance protein solubility", "To prevent protein degradation"],
    answer: 1,
    explanation: "Periplasmic signal sequences direct proteins to the periplasmic space between the inner and outer membranes of gram-negative bacteria, which provides a more oxidizing environment suitable for disulfide bond formation and can facilitate proper folding or secretion of certain proteins."
  },
  {
    question: "What is the purpose of including an internal ribosome entry site (IRES) in a eukaryotic expression vector?",
    options: ["To enhance the rate of translation", "To allow cap-independent translation initiation", "To improve mRNA stability", "To facilitate co-translational protein folding"],
    answer: 1,
    explanation: "An internal ribosome entry site (IRES) allows for cap-independent translation initiation, enabling the expression of multiple proteins from a single mRNA transcript (polycistronic expression) in eukaryotic cells, which typically require a 5' cap for translation initiation."
  },
  {
    question: "What does codon optimization involve in recombinant protein expression?",
    options: ["Changing the amino acid sequence to improve protein stability", "Adjusting the codons used to match the tRNA abundance in the host organism", "Optimizing the growth conditions for maximum expression", "Reducing the number of rare amino acids in the protein"],
    answer: 1,
    explanation: "Codon optimization involves adjusting the codons used in the gene sequence to match the tRNA abundance in the host organism without changing the amino acid sequence, which can significantly improve translation efficiency and protein yield, especially when expressing genes across distant species."
  },
  {
    question: "What is the purpose of a Kozak consensus sequence in a eukaryotic expression vector?",
    options: ["To mark the end of transcription", "To enhance transcription initiation", "To optimize translation initiation", "To stabilize the mRNA structure"],
    answer: 2,
    explanation: "The Kozak consensus sequence (GCCACCAUGG, where AUG is the start codon) is a sequence context that surrounds the start codon in eukaryotic mRNAs and enhances the efficiency of translation initiation by promoting recognition of the start codon by the ribosome."
  },
  {
    question: "What is the significance of a poly(A) tail in eukaryotic expression systems?",
    options: ["It enhances translation initiation", "It provides protection against nuclease degradation and facilitates nuclear export", "It marks the protein for secretion", "It regulates the timing of gene expression"],
    answer: 1,
    explanation: "The poly(A) tail added to the 3' end of eukaryotic mRNAs provides protection against nuclease degradation (increasing mRNA stability), facilitates nuclear export, and enhances translation efficiency through interactions with poly(A)-binding proteins and the translation machinery."
  },
  {
    question: "Which component is essential for protein secretion using the Sec pathway in bacteria?",
    options: ["A periplasmic signal sequence", "A SUMO tag", "A T7 promoter", "A glycosylation site"],
    answer: 0,
    explanation: "A periplasmic signal sequence (also called a secretion signal or leader peptide) is essential for protein secretion via the Sec pathway in bacteria, as it directs the nascent polypeptide to the secretion machinery and is typically cleaved off during translocation across the cytoplasmic membrane."
  },
  {
    question: "What is the primary challenge in expressing membrane proteins in heterologous systems?",
    options: ["Their large size", "Their complex post-translational modifications", "Their toxicity to host cells", "Their hydrophobic nature and tendency to form aggregates"],
    answer: 3,
    explanation: "The primary challenge in expressing membrane proteins in heterologous systems is their hydrophobic nature and tendency to form aggregates or inclusion bodies when overexpressed, as they require specific membrane insertion machinery and a lipid environment for proper folding and function."
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
    question: "What is the key feature of Type IIS restriction enzymes used in Golden Gate Assembly?",
    options: ["They create blunt ends", "They cut DNA at sequences within their recognition sites", "They cut DNA outside their recognition sites", "They require methylated DNA"],
    answer: 2,
    explanation: "Type IIS restriction enzymes cut DNA outside their recognition sites, allowing the creation of custom overhangs independent of the recognition sequence. This property enables the precise assembly of multiple DNA fragments in a predetermined order without leaving restriction site scars at junction points."
  },
  {
    question: "What is the maximum typical insert size that can be cloned into a standard plasmid vector?",
    options: ["Up to 5 kb", "Up to 10-15 kb", "Up to 50 kb", "Up to 300 kb"],
    answer: 1,
    explanation: "Standard plasmid vectors typically accommodate inserts of up to 10-15 kb. Larger inserts can cause instability, reduced transformation efficiency, and difficulties in manipulation, requiring specialized vectors like BACs, YACs, or cosmids for larger fragments."
  },
  {
    question: "What is the primary purpose of a multiple cloning site (MCS) in a cloning vector?",
    options: ["To allow the vector to replicate in multiple host organisms", "To provide multiple origins of replication", "To provide a region with multiple restriction enzyme recognition sites", "To enable the expression of multiple genes simultaneously"],
    answer: 2,
    explanation: "A multiple cloning site (MCS), also called a polylinker, is a region in a cloning vector that contains multiple unique restriction enzyme recognition sites clustered together, providing various options for inserting DNA fragments using different restriction enzymes."
  },
  {
    question: "In cloning, what is meant by the term 'backbone'?",
    options: ["The central structure of the DNA double helix", "The protein support structure in bacterial cells", "The DNA sequence of a vector excluding the inserted fragment", "The structural element that gives rigidity to the plasmid"],
    answer: 2,
    explanation: "In molecular cloning, the backbone refers to the DNA sequence of a vector excluding the inserted fragment, containing essential elements for vector function such as origin of replication, selectable marker, and regulatory sequences."
  },
  {
    question: "What is homologous recombination-based cloning?",
    options: ["A cloning method using restriction enzymes that create homologous ends", "A technique that relies on sequence homology between vector and insert for assembly", "A cloning approach that occurs naturally in homologous organisms", "A method to create recombinant proteins with homologous domains"],
    answer: 1,
    explanation: "Homologous recombination-based cloning relies on sequence homology between the vector and insert ends, rather than restriction enzymes, to assemble DNA molecules. Systems like Gibson Assembly, In-Fusion, and recombineering exploit this principle for seamless cloning without restriction site requirements."
  },
  {
    question: "What is a key advantage of Gateway cloning over traditional restriction enzyme cloning?",
    options: ["It is less expensive", "It allows rapid transfer of DNA segments between multiple vector systems", "It can clone larger fragments", "It does not require specialized enzymes"],
    answer: 1,
    explanation: "A key advantage of Gateway cloning is the ability to rapidly transfer DNA segments between multiple vector systems using site-specific recombination, without the need for traditional restriction enzyme digestion and ligation, facilitating high-throughput applications with various expression systems."
  },
  {
    question: "What is the role of alkaline phosphatase in molecular cloning?",
    options: ["To ligate DNA fragments together", "To remove the 5' phosphate groups from linearized vectors", "To prepare competent cells for transformation", "To break hydrogen bonds between DNA strands"],
    answer: 1,
    explanation: "Alkaline phosphatase removes the 5' phosphate groups from linearized vectors, preventing self-ligation of the vector by making it impossible to form a phosphodiester bond between the vector ends without the 5' phosphates provided by the insert DNA."
  },
  {
    question: "Which of the following is NOT typically part of a minimal plasmid vector?",
    options: ["Origin of replication", "Multiple cloning site", "Selectable marker", "Eukaryotic nuclear localization signal"],
    answer: 3,
    explanation: "A eukaryotic nuclear localization signal is not typically part of a minimal plasmid vector, as many plasmids are designed for prokaryotic systems. Essential components include an origin of replication (for propagation), selectable marker (for identification of transformed cells), and multiple cloning site (for insert integration)."
  },
  {
    question: "What is the purpose of a reporter gene in a cloning vector?",
    options: ["To report the location of the vector within the cell", "To provide a visual or selectable phenotype to identify successful transformants", "To report any mutations that occur during cloning", "To indicate when the vector has reached a certain copy number"],
    answer: 1,
    explanation: "Reporter genes in cloning vectors provide a visual or selectable phenotype to identify successful transformants or gene expression, examples include β-galactosidase (for blue-white screening), green fluorescent protein (for visualization), or luciferase (for luminescence detection)."
  },
  {
    question: "What is the difference between cohesive ends and blunt ends in DNA cloning?",
    options: ["Cohesive ends have hydrogen bonds while blunt ends have covalent bonds", "Cohesive ends have single-stranded overhangs while blunt ends have no overhangs", "Cohesive ends can only be created by restriction enzymes while blunt ends can occur naturally", "Cohesive ends are only found in bacterial DNA while blunt ends are found in eukaryotic DNA"],
    answer: 1,
    explanation: "Cohesive (sticky) ends have single-stranded overhangs that can base-pair with complementary overhangs, while blunt ends have no overhangs. Cohesive ends typically provide more efficient ligation due to the stabilization provided by base-pairing between complementary overhangs."
  },
  {
    question: "What is a yeast artificial chromosome (YAC)?",
    options: ["A natural chromosome found in yeast cells", "A vector capable of cloning very large DNA fragments in yeast", "A yeast-derived protein that organizes chromosomal structure", "A technique to visualize yeast chromosomes"],
    answer: 1,
    explanation: "A yeast artificial chromosome (YAC) is a cloning vector capable of carrying very large DNA fragments (up to several hundred kilobases) in yeast cells. YACs contain the essential elements of a yeast chromosome: a centromere, telomeres, an origin of replication, and selectable markers."
  },
  {
    question: "In TOPO cloning, what is the function of topoisomerase I?",
    options: ["To unwind the DNA double helix", "To create single-strand breaks in the DNA", "To both cleave and ligate DNA without requiring DNA ligase", "To relieve supercoiling in the vector"],
    answer: 2,
    explanation: "In TOPO cloning, topoisomerase I both cleaves and ligates DNA in a single step without requiring DNA ligase. The enzyme cleaves at specific sites and remains covalently bound to the DNA, storing energy that is later used to ligate the insert DNA, making it a rapid and efficient cloning method."
  },
  {
    question: "What is the purpose of an epitope tag in a cloning vector?",
    options: ["To mark the site where restriction enzymes should cut", "To facilitate protein purification or detection", "To enhance the stability of the vector in the host cell", "To prevent unwanted recombination events"],
    answer: 1,
    explanation: "Epitope tags are short peptide sequences added to recombinant proteins through the cloning vector, designed to facilitate protein purification (via affinity chromatography) or detection (via tag-specific antibodies) without significantly affecting the protein's function."
  },
  {
    question: "What is the main advantage of site-directed mutagenesis over random mutagenesis?",
    options: ["It is less expensive to perform", "It can introduce many mutations simultaneously", "It allows for precise, predetermined changes at specific sites", "It works in any organism without modification"],
    answer: 2,
    explanation: "The main advantage of site-directed mutagenesis is that it allows for precise, predetermined changes (substitutions, insertions, or deletions) at specific sites in the DNA sequence, enabling researchers to investigate the effects of specific mutations on protein structure and function."
  },
  {
    question: "What unique feature allows bacterial artificial chromosomes (BACs) to maintain stability of large inserts?",
    options: ["Their circular structure", "Their low copy number in the host cell", "Their ability to replicate in multiple host organisms", "Their resistance to multiple antibiotics"],
    answer: 1,
    explanation: "Bacterial artificial chromosomes (BACs) maintain stability of large inserts (up to 300 kb) due to their low copy number (typically 1-2 copies per cell) in the host, which minimizes the opportunity for recombination between repeated sequences that could lead to deletions or rearrangements."
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
    question: "What is the significance of paired-end sequencing in next-generation sequencing technologies?",
    options: ["It is twice as fast as single-end sequencing", "It improves base-calling accuracy", "It facilitates better genome assembly and detection of structural variants", "It reduces the cost of sequencing by half"],
    answer: 2,
    explanation: "Paired-end sequencing involves sequencing both ends of DNA fragments, providing information about the distance between reads and their relative orientation. This facilitates better genome assembly, detection of structural variants, and resolution of repetitive regions."
  },
  {
    question: "What is the key difference between whole-genome sequencing (WGS) and whole-exome sequencing (WES)?",
    options: ["WGS covers the entire genome while WES focuses only on protein-coding regions", "WGS is more accurate than WES", "WGS can only be performed on human samples", "WES provides longer read lengths than WGS"],
    answer: 0,
    explanation: "Whole-genome sequencing (WGS) covers the entire genomic DNA, including coding and non-coding regions, while whole-exome sequencing (WES) selectively targets only the protein-coding regions (exons), which constitute about 1-2% of the human genome."
  },
  {
    question: "What type of information is provided by RNA-seq that cannot be obtained from DNA sequencing alone?",
    options: ["Gene mutations", "Gene expression levels", "DNA methylation patterns", "Telomere length"],
    answer: 1,
    explanation: "RNA-seq (RNA sequencing) provides information about gene expression levels by sequencing RNA molecules present in cells at a specific time, revealing which genes are actively transcribed and at what levels, information that cannot be determined from DNA sequencing alone."
  },
  {
    question: "What is the 'read depth' or 'coverage' in genome sequencing?",
    options: ["The length of the DNA fragments being sequenced", "The number of times each nucleotide is represented in sequencing reads", "The percentage of the genome that is successfully sequenced", "The quality score of base calling"],
    answer: 1,
    explanation: "Read depth or coverage refers to the average number of times each nucleotide in the genome is represented in the sequencing reads. Higher coverage generally increases confidence in base calling and variant detection by providing multiple independent observations of each position."
  },
  {
    question: "What is the significance of quality scores (Q scores) in DNA sequencing?",
    options: ["They indicate the physical quality of the DNA sample", "They represent the probability of an incorrect base call", "They measure the length of the DNA fragments", "They indicate the cost-effectiveness of the sequencing run"],
    answer: 1,
    explanation: "Quality scores (Q scores) represent the probability that a given base is called incorrectly by the sequencer. Each base in a sequencing read is assigned a Q score, which is logarithmically related to the error probability, helping researchers assess the reliability of sequencing data."
  },
  {
    question: "What is a key advantage of nanopore sequencing over other sequencing technologies?",
    options: ["It produces the most accurate sequences", "It can directly sequence native DNA without amplification", "It is the least expensive method", "It produces the shortest read lengths"],
    answer: 1,
    explanation: "A key advantage of nanopore sequencing is its ability to directly sequence native DNA or RNA molecules without requiring prior amplification, enabling the detection of base modifications (like methylation) and providing ultra-long reads from single molecules."
  },
  {
    question: "In genome sequencing, what is meant by the term 'scaffold'?",
    options: ["A physical structure used to hold DNA during sequencing", "A known genome used as a reference for alignment", "An ordered arrangement of contigs with estimated gaps between them", "A software tool for sequence assembly"],
    answer: 2,
    explanation: "In genome assembly, a scaffold is an ordered and oriented arrangement of contigs (contiguous assembled sequences) with estimated gaps between them. Scaffolds are created by using paired-end or mate-pair information to determine the relative positions and orientations of contigs."
  },
  {
    question: "What does 'N50' represent in genome assembly statistics?",
    options: ["The number of scaffolds containing 50% of the assembled genome", "A measure of sequence quality where 50% of bases have quality scores above a threshold", "The length where 50% of the assembled genome is contained in scaffolds of this length or longer", "The average length of 50% of the sequencing reads"],
    answer: 2,
    explanation: "N50 is a statistic used to describe the contiguity of a genome assembly. It represents the minimum contig or scaffold length needed to cover 50% of the genome when contigs are ordered from longest to shortest, with higher N50 values generally indicating better assembly quality."
  },
  {
    question: "What is the primary purpose of genome annotation?",
    options: ["To determine the sequence of nucleotides in a genome", "To identify and label functional elements in a genome sequence", "To compare genomes from different species", "To determine the evolutionary history of a genome"],
    answer: 1,
    explanation: "Genome annotation is the process of identifying and labeling functional elements within a genome sequence, including protein-coding genes, non-coding RNAs, regulatory regions, repetitive elements, and other features, typically through a combination of computational prediction and experimental evidence."
  },
  {
    question: "What information is provided by a genome-wide association study (GWAS)?",
    options: ["Complete genome sequences of individuals", "The function of all genes in the genome", "Associations between genetic variants and specific traits or diseases", "The evolutionary relationships between species"],
    answer: 2,
    explanation: "Genome-wide association studies (GWAS) examine genetic variants across the genomes of many individuals to identify statistical associations between specific genetic variants (typically SNPs) and particular traits or diseases, helping to identify genetic risk factors."
  },
  {
    question: "What is the primary challenge of de novo genome assembly compared to reference-based assembly?",
    options: ["De novo assembly requires more expensive sequencing technology", "De novo assembly must reconstruct the genome without a reference sequence to guide it", "De novo assembly can only be performed on bacterial genomes", "De novo assembly requires RNA samples in addition to DNA"],
    answer: 1,
    explanation: "The primary challenge of de novo genome assembly is reconstructing the complete genome sequence without using a pre-existing reference genome as a guide, requiring sufficient sequencing depth and computational resources to resolve repetitive regions and determine the correct order of sequence fragments."
  },
  {
    question: "What is 'linkage disequilibrium' in genomic analysis?",
    options: ["The physical distance between genes on a chromosome", "The non-random association of alleles at different loci", "The rate at which DNA mutations occur", "The imbalance between maternal and paternal chromosomes"],
    answer: 1,
    explanation: "Linkage disequilibrium (LD) refers to the non-random association of alleles at different loci in a population. Alleles in LD are found together more or less frequently than would be expected by chance, often due to physical proximity on a chromosome or selection pressures."
  },
  {
    question: "What is 'structural variation' in genomics?",
    options: ["Variations in gene expression levels", "Differences in chromosome number between species", "Genomic alterations involving segments of DNA >50 base pairs", "Variations in the three-dimensional structure of chromosomes"],
    answer: 2,
    explanation: "Structural variations are genomic alterations that affect relatively large segments of DNA (typically >50 base pairs), including deletions, duplications, insertions, inversions, and translocations, which can significantly impact gene function and phenotype."
  },
  {
    question: "What is the primary purpose of transcriptome sequencing (RNA-seq)?",
    options: ["To identify genomic variants", "To characterize and quantify all RNA species present in a sample", "To determine protein structures", "To identify sites of protein-DNA interaction"],
    answer: 1,
    explanation: "Transcriptome sequencing (RNA-seq) aims to characterize and quantify all RNA species present in a biological sample at a specific time, providing information about gene expression levels, alternative splicing events, novel transcripts, and RNA modifications."
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
    question: "How does CRISPR-Cas9 differ from TALENs and zinc finger nucleases (ZFNs) for genome editing?",
    options: ["CRISPR-Cas9 can target multiple sites simultaneously", "CRISPR-Cas9 uses RNA-guided DNA targeting instead of protein-guided targeting", "CRISPR-Cas9 does not create double-strand breaks", "CRISPR-Cas9 can only be used in bacterial systems"],
    answer: 1,
    explanation: "While TALENs and ZFNs use protein domains to recognize DNA sequences, CRISPR-Cas9 uses RNA-guided DNA targeting, where the guide RNA determines specificity through complementary base pairing, making it simpler to design and more versatile than protein-based targeting systems."
  },
  {
    question: "What type of DNA repair mechanism is exploited for gene knock-in using CRISPR-Cas9?",
    options: ["Non-homologous end joining (NHEJ)", "Base excision repair", "Homology-directed repair (HDR)", "Mismatch repair"],
    answer: 2,
    explanation: "Gene knock-in using CRISPR-Cas9 exploits homology-directed repair (HDR), which uses a template DNA (provided exogenously) with homology to the sequences flanking the cut site to precisely insert new genetic material at the targeted location."
  },
  {
    question: "What is 'prime editing' in CRISPR technology?",
    options: ["A method to perform multiple gene edits simultaneously", "A technique that combines Cas9 with a reverse transcriptase to make precise edits without double-strand breaks", "A preliminary phase of genome editing", "The first step in creating guide RNAs"],
    answer: 1,
    explanation: "Prime editing is a CRISPR technology that combines a Cas9 nickase with a reverse transcriptase enzyme and a specialized prime editing guide RNA (pegRNA), which both targets the site and provides a template for the edit, enabling precise changes without requiring double-strand breaks or donor DNA templates."
  },
  {
    question: "What is 'CRISPR interference' (CRISPRi)?",
    options: ["A method to disrupt CRISPR editing in competing organisms", "The use of multiple CRISPR systems that interfere with each other", "A technique that uses catalytically inactive Cas9 to repress gene expression", "The natural process by which bacteria protect themselves against phages"],
    answer: 2,
    explanation: "CRISPR interference (CRISPRi) uses a catalytically inactive Cas9 (dCas9) fused to transcriptional repressor domains to block transcription of target genes without cutting the DNA, allowing for reversible gene repression rather than permanent genetic modification."
  },
  {
    question: "What is a key advantage of CRISPR-Cas13 compared to CRISPR-Cas9?",
    options: ["It has higher editing efficiency", "It targets RNA instead of DNA", "It is smaller and easier to deliver to cells", "It creates blunt-end cuts instead of sticky ends"],
    answer: 1,
    explanation: "A key advantage of CRISPR-Cas13 is that it targets RNA instead of DNA, allowing for manipulation of gene expression without permanent genetic changes, detection of RNA viruses, and temporary knockdown of gene function without altering the genome."
  },
  {
    question: "Which component of the CRISPR-Cas9 system determines the specific DNA sequence to be targeted?",
    options: ["The PAM sequence", "The tracrRNA", "The spacer region of the guide RNA", "The Cas9 binding domain"],
    answer: 2,
    explanation: "The spacer region (approximately 20 nucleotides) of the guide RNA determines the specific DNA sequence to be targeted through complementary base pairing. This region corresponds to the protospacer in the target DNA and guides Cas9 to the correct cutting site."
  },
  {
    question: "What is a 'multiplex' CRISPR-Cas9 system?",
    options: ["A system using multiple Cas9 proteins with different properties", "A method to increase the size of the genomic region that can be edited", "A technique for simultaneously targeting and editing multiple genomic sites", "A strategy to amplify the editing efficiency at a single target site"],
    answer: 2,
    explanation: "Multiplex CRISPR-Cas9 systems enable the simultaneous targeting and editing of multiple genomic sites by using several guide RNAs in parallel, allowing for more complex genomic engineering applications such as deleting large genomic regions or modifying multiple genes in a pathway."
  },
  {
    question: "What is the main limitation of using CRISPR-Cas9 for therapeutic applications in humans?",
    options: ["Inefficient delivery of CRISPR components to target cells", "Potential off-target effects", "High cost of producing guide RNAs", "All of the above"],
    answer: 3,
    explanation: "CRISPR-Cas9 therapeutic applications face multiple challenges, including efficient delivery of components to target cells in vivo, minimizing off-target effects that could cause unintended mutations, and the high cost of development and production for clinical applications."
  },
  {
    question: "What is 'base editing' in the context of CRISPR technology?",
    options: ["Changing the chemical composition of DNA bases", "Converting one nucleotide to another without double-strand breaks", "Altering the genome of bacteria that serve as the basis for CRISPR", "Modifying the foundation of a gene without affecting its expression"],
    answer: 1,
    explanation: "Base editing uses a catalytically impaired Cas9 fused to a deaminase enzyme to convert one nucleotide to another (e.g., C to T or A to G) without creating double-strand breaks in the DNA, allowing for precise single-nucleotide changes with reduced risk of indels."
  },
  {
    question: "What is 'CRISPR activation' (CRISPRa)?",
    options: ["The process of activating the Cas9 nuclease", "A technique using catalytically inactive Cas9 fused to transcriptional activators to increase gene expression", "The activation of the CRISPR system in bacteria in response to viral infection", "The method of enhancing CRISPR editing efficiency"],
    answer: 1,
    explanation: "CRISPR activation (CRISPRa) uses a catalytically inactive Cas9 (dCas9) fused to transcriptional activator domains to increase expression of target genes without altering their sequence, enabling the upregulation of endogenous genes for research or therapeutic purposes."
  },
  {
    question: "What role does the tracrRNA play in the CRISPR-Cas9 system?",
    options: ["It guides Cas9 to the target DNA sequence", "It helps process pre-crRNA into mature crRNA", "It forms part of the guide RNA structure necessary for Cas9 function", "It activates the nuclease activity of Cas9"],
    answer: 2,
    explanation: "The trans-activating CRISPR RNA (tracrRNA) forms an essential part of the guide RNA structure by base-pairing with the crRNA, creating the secondary structure necessary for Cas9 binding and function. In engineered CRISPR systems, tracrRNA and crRNA are often combined into a single guide RNA (sgRNA)."
  },
  {
    question: "What is the primary function of the Cas9 protein in the CRISPR-Cas9 system?",
    options: ["To synthesize guide RNAs", "To recognize PAM sequences in bacterial DNA", "To cleave target DNA at specific sites", "To repair DNA damage after viral infection"],
    answer: 2,
    explanation: "The primary function of Cas9 protein is to act as a nuclease that cleaves double-stranded DNA at specific sites determined by the guide RNA sequence, typically creating a double-strand break approximately 3 base pairs upstream of the PAM sequence."
  },
  {
    question: "What is 'homology-directed repair' (HDR) in the context of CRISPR gene editing?",
    options: ["A mechanism to direct Cas9 to homologous sequences in the genome", "A DNA repair pathway that uses a template to precisely fix double-strand breaks", "The process of identifying homologous genes across different species", "A technique to create identical copies of a gene within a genome"],
    answer: 1,
    explanation: "Homology-directed repair (HDR) is a cellular DNA repair pathway that uses a homologous template (either the sister chromatid or an artificially provided DNA template) to repair double-strand breaks with high fidelity, enabling precise gene editing with CRISPR-Cas9."
  },
  {
    question: "What is the 'seed region' in CRISPR guide RNAs?",
    options: ["The part of the guide RNA that binds to the Cas9 protein", "The initial region where guide RNA begins pairing with target DNA", "The sequence that determines how many guides can be produced", "The section that initiates RNA transcription"],
    answer: 1,
    explanation: "The seed region refers to the 8-12 nucleotides at the 3' end of the guide RNA's targeting sequence (adjacent to the PAM) that are particularly critical for initial binding to the target DNA. Mismatches in this region significantly reduce or prevent Cas9 binding and cutting."
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
    question: "What is the primary purpose of a western blot?",
    options: ["To determine the complete amino acid sequence of a protein", "To detect and quantify specific proteins in a complex mixture", "To purify proteins from a cell lysate", "To identify protein post-translational modifications"],
    answer: 1,
    explanation: "Western blotting (or immunoblotting) is used to detect and quantify specific proteins in a complex mixture by using antibodies that specifically bind to the target protein, typically after separation by gel electrophoresis and transfer to a membrane."
  },
  {
    question: "In mass spectrometry, what does the term 'ionization' refer to?",
    options: ["The addition of ions to protein samples for calibration", "The conversion of proteins or peptides into charged particles", "The generation of ionic bonds within protein structures", "The separation of ionic from non-ionic proteins"],
    answer: 1,
    explanation: "Ionization in mass spectrometry refers to the process of converting proteins or peptides into charged particles (ions) in the gas phase, which is necessary for their manipulation and detection by the mass analyzer based on their mass-to-charge ratio."
  },
  {
    question: "What is the role of trypsin in proteomic sample preparation for mass spectrometry?",
    options: ["To denature proteins for better solubility", "To cleave proteins specifically after lysine and arginine residues", "To remove detergents from the sample", "To label proteins with fluorescent tags"],
    answer: 1,
    explanation: "Trypsin is a protease commonly used in proteomics to cleave proteins specifically after lysine and arginine residues (except when followed by proline), generating predictable peptide fragments of suitable size for mass spectrometry analysis."
  },
  {
    question: "What is 'label-free quantification' in proteomics?",
    options: ["A method that doesn't require labeling of equipment", "A technique that uses the inherent properties of peptides for quantification without chemical labeling", "The quantification of unlabeled sample containers", "A procedure that avoids using labeled antibodies in western blots"],
    answer: 1,
    explanation: "Label-free quantification in proteomics refers to techniques that measure protein abundance without incorporating stable isotope labels, instead using the inherent properties of peptides such as MS signal intensity or spectral counting to estimate relative protein quantities across samples."
  },
  {
    question: "What is the main application of cross-linking mass spectrometry (XL-MS)?",
    options: ["To improve protein stability during mass spectrometry", "To determine protein-protein interactions and proximity relationships", "To cross-check results between different mass spectrometry instruments", "To increase the signal strength of low-abundance proteins"],
    answer: 1,
    explanation: "Cross-linking mass spectrometry (XL-MS) is used to determine protein-protein interactions and proximity relationships within protein complexes by chemically cross-linking nearby amino acid residues, followed by digestion and mass spectrometric identification of the cross-linked peptides."
  },
  {
    question: "What does MALDI TOF stand for in the context of mass spectrometry?",
    options: ["Multiple Analysis of Labeled Derivatives In Total Organic Fractions", "Matrix-Assisted Laser Desorption/Ionization Time-Of-Flight", "Mass Analysis of Large Derivatives In Timed Organic Fields", "Molecular Arrangement of Linear Derivatives In Time-Ordered Format"],
    answer: 1,
    explanation: "MALDI TOF stands for Matrix-Assisted Laser Desorption/Ionization Time-Of-Flight, a type of mass spectrometry where analytes are co-crystallized with a matrix material, ionized by laser pulses, and then separated based on the time they take to travel through a flight tube to the detector."
  },
  {
    question: "What is the principle behind affinity chromatography for protein purification?",
    options: ["Separation based on protein size", "Separation based on the binding of the target protein to a specific ligand", "Separation based on protein charge", "Separation based on protein solubility in different solvents"],
    answer: 1,
    explanation: "Affinity chromatography separates proteins based on their specific binding to a ligand that is immobilized on a solid support. The target protein binds to the ligand while other proteins wash through, allowing highly selective purification based on biological recognition."
  },
  {
    question: "What is the key difference between bottom-up and top-down proteomics?",
    options: ["Bottom-up analyzes proteins from simpler organisms while top-down focuses on complex organisms", "Bottom-up analyzes proteins after enzymatic digestion while top-down analyzes intact proteins", "Bottom-up uses gel-based methods while top-down is exclusively mass spectrometry-based", "Bottom-up focuses on cytoplasmic proteins while top-down targets nuclear proteins"],
    answer: 1,
    explanation: "In bottom-up proteomics, proteins are enzymatically digested into peptides before mass spectrometry analysis, while top-down proteomics analyzes intact proteins without digestion, preserving information about protein isoforms, post-translational modifications, and their combinations."
  },
  {
    question: "What is a limitation of using antibodies for protein detection?",
    options: ["They can only detect proteins in solution, not on membranes", "They are too large to enter cells", "They may show cross-reactivity with unintended targets", "They are prohibitively expensive to produce"],
    answer: 2,
    explanation: "A significant limitation of antibodies is their potential cross-reactivity with unintended targets, especially proteins with similar epitopes, which can lead to false-positive signals in techniques like western blots, immunoprecipitation, or immunohistochemistry."
  },
  {
    question: "What is the advantage of using tandem mass spectrometry (MS/MS) for protein identification?",
    options: ["It is much faster than single MS", "It provides sequence information from peptide fragmentation", "It requires less sample preparation", "It is more sensitive to post-translational modifications"],
    answer: 1,
    explanation: "Tandem mass spectrometry (MS/MS) provides sequence information by fragmenting peptides and analyzing the fragment masses, which can be used to deduce the amino acid sequence and unambiguously identify proteins with higher confidence than single MS measurements of peptide masses alone."
  },
  {
    question: "What is protein footprinting used for in structural biology?",
    options: ["To identify the site where a protein was synthesized", "To track the movement of proteins in living cells", "To map protein-ligand interaction sites or solvent-accessible regions", "To determine the evolutionary history of a protein"],
    answer: 2,
    explanation: "Protein footprinting techniques (such as hydrogen-deuterium exchange or chemical labeling) map protein-ligand interaction sites or solvent-accessible regions by identifying areas that are protected from or exposed to modification, providing insights into protein structure and binding interfaces."
  },
  {
    question: "What is the purpose of native PAGE in protein analysis?",
    options: ["To determine a protein's amino acid sequence", "To separate proteins under non-denaturing conditions to preserve their folded structure and complex formations", "To identify post-translational modifications", "To remove detergents from protein samples"],
    answer: 1,
    explanation: "Native PAGE (polyacrylamide gel electrophoresis) separates proteins under non-denaturing conditions, preserving their native folded structure, charge properties, and complex formations, allowing the study of protein oligomerization, protein-protein interactions, and functional protein complexes."
  },
  {
    question: "What is the typical first step in preparing a protein sample for mass spectrometry analysis?",
    options: ["Fragmentation of the proteins", "Chromatographic separation", "Reduction and alkylation of disulfide bonds", "Labeling with stable isotopes"],
    answer: 2,
    explanation: "A typical first step in preparing protein samples for mass spectrometry is the reduction of disulfide bonds followed by alkylation of the free cysteine residues, which prevents disulfide bond reformation and ensures complete denaturation and accessibility to proteases for efficient digestion."
  },
  {
    question: "What is the main purpose of Selected Reaction Monitoring (SRM) in protein mass spectrometry?",
    options: ["To identify as many proteins as possible in a sample", "To quantify specific target proteins with high sensitivity and selectivity", "To determine the three-dimensional structure of proteins", "To separate complex protein mixtures before analysis"],
    answer: 1,
    explanation: "Selected Reaction Monitoring (SRM) is a targeted mass spectrometry approach designed to quantify specific proteins of interest with high sensitivity and selectivity by monitoring predefined peptides and their fragment ions, making it valuable for validation studies and quantification of low-abundance proteins."
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
    question: "What is meant by 'orthogonality' in the context of synthetic biology?",
    options: ["The physical arrangement of genetic parts at right angles", "The ability of genetic parts to function independently without interference from host systems", "The mathematical modeling of gene interactions", "The use of parts derived from organisms in different domains of life"],
    answer: 1,
    explanation: "Orthogonality in synthetic biology refers to the ability of introduced genetic parts to function independently without interfering with or being affected by the host's native cellular systems, reducing unwanted cross-talk and increasing the predictability of engineered systems."
  },
  {
    question: "What is a 'repressilator' in synthetic biology?",
    options: ["A device that represses all gene expression", "An oscillatory genetic circuit composed of three repressors", "A tool to measure repression efficiency", "A synthetic repressor with adjustable strength"],
    answer: 1,
    explanation: "A repressilator is an oscillatory genetic circuit composed of three repressor proteins arranged in a negative feedback loop where each repressor inhibits the next, resulting in periodic oscillations in gene expression that can serve as a biological clock."
  },
  {
    question: "What is the primary goal of minimal genome research in synthetic biology?",
    options: ["To identify genes that cause disease", "To determine the smallest set of genes required for life", "To minimize the cost of genome sequencing", "To reduce the size of plasmid vectors"],
    answer: 1,
    explanation: "Minimal genome research aims to determine the smallest set of genes required for a self-replicating organism, removing non-essential genes to create a simplified platform for synthetic biology applications with reduced complexity and increased predictability."
  },
  {
    question: "What are 'standard biological parts' in the context of synthetic biology?",
    options: ["Naturally occurring genetic elements found in all organisms", "Genetically encoded components with defined functions that can be assembled into larger systems", "Parts of the genome that cannot be modified without causing death", "Laboratory equipment standardized for biological research"],
    answer: 1,
    explanation: "Standard biological parts are genetically encoded components (like promoters, ribosome binding sites, coding sequences, and terminators) with well-defined functions that can be characterized, shared, and assembled in a modular fashion to create larger genetic systems with predictable behaviors."
  },
  {
    question: "What is 'metabolic engineering' in the context of synthetic biology?",
    options: ["The study of how metabolites affect gene expression", "Engineering cells to regulate their energy usage", "Manipulation of metabolic pathways to produce desired compounds", "Creating artificial metabolites for drug development"],
    answer: 2,
    explanation: "Metabolic engineering involves manipulating metabolic pathways in cells by adding, removing, or modifying genes that encode enzymes, redirecting cellular resources toward the production of specific desired compounds such as biofuels, pharmaceuticals, or chemicals."
  },
  {
    question: "What is a key difference between synthetic biology and traditional genetic engineering?",
    options: ["Synthetic biology only works with artificial organisms", "Synthetic biology applies engineering principles like standardization and modularity", "Synthetic biology does not use recombinant DNA technology", "Synthetic biology is limited to prokaryotic systems"],
    answer: 1,
    explanation: "A key difference is that synthetic biology applies engineering principles such as standardization, modularity, and abstraction to biology, focusing on designing and constructing new biological systems using well-characterized parts, while traditional genetic engineering typically involves transferring individual genes without this systematic engineering approach."
  },
  {
    question: "What is 'directed evolution' as applied in synthetic biology?",
    options: ["A computational method to predict evolutionary paths", "A process of forcing organisms to evolve in a specific direction", "A laboratory technique to evolve molecules or organisms with desired properties through iterative cycles of mutation and selection", "The natural evolution of synthetic organisms over time"],
    answer: 2,
    explanation: "Directed evolution is a laboratory technique that mimics natural selection to evolve molecules (typically proteins or nucleic acids) or organisms with desired properties through iterative cycles of mutation (creating diversity) and selection (identifying variants with improved function)."
  },
  {
    question: "What is a 'genetic toggle switch' in synthetic biology?",
    options: ["A switch that turns genes on and off randomly", "A bistable genetic circuit that can exist in one of two stable states", "A mechanism to physically invert genetic material", "A device that alternates between expressing two different genes"],
    answer: 1,
    explanation: "A genetic toggle switch is a bistable genetic circuit that can exist in one of two stable states and maintain that state without continuous input, similar to an electronic flip-flop, allowing cellular memory and binary decision-making in response to transient signals."
  },
  {
    question: "What is 'xenobiology' in the context of synthetic biology?",
    options: ["The study of alien life forms", "Engineering organisms to survive in extreme environments", "Creating biological systems with components not found in nature, such as expanded genetic codes", "The study of interactions between different species"],
    answer: 2,
    explanation: "Xenobiology involves creating biological systems with components not found in nature, such as alternative genetic alphabets (expanded base pairs), alternative genetic polymers (instead of DNA/RNA), or novel amino acids, aiming to expand the chemical repertoire of life or create genetic firewalls."
  },
  {
    question: "What is the role of computational design in modern synthetic biology?",
    options: ["It is only used to analyze results after experiments", "It predicts the behavior of synthetic systems and designs sequences before implementation", "It automates laboratory procedures", "It is primarily used for data storage"],
    answer: 1,
    explanation: "Computational design plays a critical role in predicting the behavior of synthetic biological systems before implementation, designing DNA sequences with desired properties, modeling complex interactions, and optimizing designs to reduce costly trial-and-error experimentation."
  },
  {
    question: "What are 'biological parts' in the Registry of Standard Biological Parts?",
    options: ["Naturally occurring genetic elements cataloged from various organisms", "Physical DNA samples stored in a repository", "Standardized DNA sequences with defined functions that conform to assembly standards", "Computer models of biological systems"],
    answer: 2,
    explanation: "The Registry of Standard Biological Parts contains standardized DNA sequences (BioBricks) with defined functions (like promoters, RBSs, coding sequences) that conform to assembly standards, allowing researchers to share, combine, and build upon these parts to create new biological systems."
  },
  {
    question: "What is 'quorum sensing' and how is it applied in synthetic biology?",
    options: ["A technique to count the number of cells in a culture", "A bacterial communication system that synthetic biologists repurpose for engineered cell-cell communication", "A method to sense the quality of synthetic DNA", "The minimum number of genes required for a synthetic organism"],
    answer: 1,
    explanation: "Quorum sensing is a natural bacterial communication system where cells produce and detect signaling molecules to coordinate behaviors based on population density. Synthetic biologists repurpose these systems to engineer cell-cell communication, enabling population-level behaviors and distributed computing in microbial communities."
  },
  {
    question: "What is 'cell-free synthetic biology'?",
    options: ["Synthetic biology performed without living cells", "A method that does not require cell culture", "Engineering cells that can survive without external nutrients", "Creation of synthetic cells without DNA"],
    answer: 0,
    explanation: "Cell-free synthetic biology involves performing biological reactions outside of living cells using extracted cellular machinery (like transcription and translation systems). This approach eliminates cell wall barriers, bypasses cell growth requirements, and allows direct access to and control of the reaction environment."
  },
  {
    question: "What is the concept of a 'genetic firewall' in synthetic biology?",
    options: ["A computational tool to prevent errors in DNA synthesis", "A physical barrier to prevent contamination of synthetic organisms", "A genetic isolation mechanism to prevent gene transfer between synthetic and natural organisms", "A system to protect proprietary genetic designs from theft"],
    answer: 2,
    explanation: "A genetic firewall is a biological containment strategy that creates genetic isolation between synthetic and natural organisms, often by using alternative genetic alphabets, non-standard amino acids, or semantic containment, preventing horizontal gene transfer and unintended environmental spread of synthetic genetic material."
  },
  {
    question: "What does the engineering principle of 'abstraction' mean in synthetic biology?",
    options: ["Making DNA sequences more complex", "Hiding the underlying details of biological parts to focus on their function", "Creating abstract models of biological systems", "Extracting biological components from cells"],
    answer: 1,
    explanation: "Abstraction in synthetic biology involves hiding the underlying complexity of biological parts and focusing on their function rather than their implementation details, allowing engineers to design at different levels (DNA, parts, devices, systems) without needing to understand all molecular details."
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
    question: "What is CAR-T cell therapy?",
    options: ["A type of gene therapy that modifies a patient's own T cells to target cancer cells", "A treatment that uses antibodies to block cancer growth factors", "A screening method to detect early-stage cancers", "A method to repair damaged heart tissue"],
    answer: 0,
    explanation: "Chimeric Antigen Receptor T-cell (CAR-T) therapy is a form of immunotherapy where a patient's T cells are genetically modified to express artificial receptors (CARs) that recognize specific antigens on cancer cells, enabling the T cells to target and destroy those cancer cells."
  },
  {
    question: "Which biotechnology approach is used in the production of Bt crops?",
    options: ["RNA interference", "Transgenic insertion of bacterial genes", "Protoplast fusion", "Polyploidy induction"],
    answer: 1,
    explanation: "Bt crops are genetically modified to express insecticidal proteins from the bacterium Bacillus thuringiensis (Bt). Genes encoding these proteins are inserted into the plant genome, enabling the plant to produce its own insecticide against specific pests."
  },
  {
    question: "What is the main purpose of DNA barcoding?",
    options: ["To track genetically modified organisms", "To identify species based on standardized genetic markers", "To detect pathogens in environmental samples", "To label DNA samples in laboratory settings"],
    answer: 1,
    explanation: "DNA barcoding uses standardized short genetic markers in an organism's DNA to identify it as belonging to a particular species. It's widely used in biodiversity studies, conservation efforts, and monitoring food authenticity and illegal wildlife trade."
  },
  {
    question: "What is pharmacogenomics?",
    options: ["The study of how pharmaceuticals interact with the environment", "The development of drugs using genomic techniques", "The study of how genetic variation affects individual responses to medications", "The use of drugs to modify gene expression"],
    answer: 2,
    explanation: "Pharmacogenomics studies how an individual's genetic makeup affects their response to drugs, including efficacy, optimal dosage, and potential adverse effects. This field aims to develop personalized medicine approaches based on a patient's genetic profile."
  },
  {
    question: "What is the primary purpose of inducing pluripotent stem cells (iPSCs)?",
    options: ["To create perfect genetic copies of organisms", "To reprogram adult cells into an embryonic-like pluripotent state", "To enhance the immune response against pathogens", "To create hybrid cells with desired properties"],
    answer: 1,
    explanation: "Induced pluripotent stem cells (iPSCs) are created by reprogramming adult somatic cells back to an embryonic-like pluripotent state, capable of differentiating into almost any cell type. iPSCs have applications in disease modeling, drug development, and potentially regenerative medicine."
  },
  {
    question: "Which of the following is an example of a biopharmaceutical?",
    options: ["Aspirin", "Insulin produced by recombinant DNA technology", "Ibuprofen", "Morphine"],
    answer: 1,
    explanation: "Biopharmaceuticals are medical drugs produced using biotechnology, particularly recombinant DNA technology. Human insulin produced in bacteria or yeast cells using genetic engineering is a classic example of a biopharmaceutical."
  },
  {
    question: "What is biofortification in agriculture?",
    options: ["Adding fertilizers to soil to increase crop yield", "Enhancing the nutritional content of crops through breeding or genetic modification", "Protecting crops from pests using biological control agents", "Extending the shelf life of harvested crops"],
    answer: 1,
    explanation: "Biofortification involves enhancing the nutritional value of crops through conventional breeding or genetic engineering. Examples include Golden Rice with enhanced vitamin A content and crops with increased iron, zinc, or protein levels to address nutritional deficiencies."
  },
  {
    question: "Which of the following technologies is used for engineering microorganisms to produce biofuels?",
    options: ["Southern blotting", "Metabolic engineering", "Flow cytometry", "Gel electrophoresis"],
    answer: 1,
    explanation: "Metabolic engineering involves modifying metabolic pathways in microorganisms to optimize the production of desired compounds. In biofuel production, yeast or bacteria are engineered to efficiently convert biomass into fuels like ethanol, butanol, or biodiesel."
  },
  {
    question: "What is shotgun proteomics?",
    options: ["A technique to rapidly sequence entire genomes", "A method to analyze all proteins in a complex mixture", "A strategy to identify protein-protein interactions", "A process to purify specific proteins from cell lysates"],
    answer: 1,
    explanation: "Shotgun proteomics is a method where complex protein mixtures are digested into peptides, separated by liquid chromatography, and then analyzed by mass spectrometry. This approach allows for the identification and quantification of thousands of proteins in a single analysis."
  },
  {
    question: "What is the main purpose of transgenic animals in biotechnology?",
    options: ["To study human diseases", "To produce pharmaceuticals or other valuable proteins", "To improve livestock characteristics", "All of the above"],
    answer: 3,
    explanation: "Transgenic animals have various applications in biotechnology, including serving as disease models (e.g., Alzheimer's in mice), producing therapeutic proteins in their milk (biopharming), and improving livestock traits like growth rate or disease resistance."
  },
  {
    question: "What is xenotransplantation?",
    options: ["Transplanting organs between different species", "Transplanting synthetic organs into humans", "Transferring genes between unrelated bacterial species", "Implanting medical devices made from animal tissues"],
    answer: 0,
    explanation: "Xenotransplantation involves transplanting living cells, tissues, or organs from one species to another, typically from animals (often pigs) to humans. Genetic engineering of source animals helps address immune rejection and other compatibility issues."
  },
  {
    question: "Which technology is used to identify all metabolites present in a biological sample?",
    options: ["Genomics", "Transcriptomics", "Proteomics", "Metabolomics"],
    answer: 3,
    explanation: "Metabolomics is the comprehensive study of all metabolites (small molecules) present in a biological sample. It provides a functional readout of cellular biochemistry and physiological state, offering insights into disease mechanisms and biomarker discovery."
  },
  {
    question: "What is the purpose of directed evolution in protein engineering?",
    options: ["To predict the natural evolution of proteins", "To mimic natural selection to develop proteins with desired properties", "To understand how proteins evolved historically", "To identify which proteins are essential for survival"],
    answer: 1,
    explanation: "Directed evolution mimics natural selection in a laboratory setting to evolve proteins with enhanced or novel functions. The process involves generating genetic diversity, selecting variants with desired properties, and repeating these steps to further improve the protein."
  },
  {
    question: "What is the primary application of metagenomics?",
    options: ["Analyzing the genetic material of cultivated microorganisms", "Studying genetic material recovered directly from environmental samples", "Determining the complete genome sequence of a single organism", "Comparing genetic variations among human populations"],
    answer: 1,
    explanation: "Metagenomics involves the direct analysis of genetic material from environmental samples, bypassing the need to culture individual microorganisms. This approach reveals the diversity and function of microbial communities in environments ranging from soil to the human gut."
  },
  {
    question: "What is synthetic biology?",
    options: ["The production of synthetic chemicals using biological systems", "The design and construction of biological components that don't exist in nature", "The synthesis of artificial DNA in the laboratory", "The creation of synthetic cells with minimal genomes"],
    answer: 1,
    explanation: "Synthetic biology combines principles from biology and engineering to design and construct new biological parts, devices, and systems that don't exist in nature, or to redesign existing natural biological systems for useful purposes."
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
    question: "What is the concept of 'genetic exceptionalism'?",
    options: ["The belief that genetic information deserves special protection compared to other medical information", "The idea that genetic research should be exempt from ethical oversight", "The practice of excluding genetic factors from medical diagnoses", "The principle that genetic enhancements should be available to everyone"],
    answer: 0,
    explanation: "Genetic exceptionalism is the view that genetic information is fundamentally different from other medical information and deserves special privacy protections due to its predictive nature, stability over time, and implications for family members."
  },
  {
    question: "What is a key ethical consideration in biobanking human biological samples?",
    options: ["The cost of storing samples", "Informed consent and privacy concerns", "The physical size of the biobank facility", "The compatibility of different storage systems"],
    answer: 1,
    explanation: "Key ethical considerations in biobanking include obtaining proper informed consent from donors, protecting privacy and confidentiality of genetic data, determining ownership of samples, and establishing policies for future uses of the stored materials."
  },
  {
    question: "Which principle refers to the fair distribution of benefits and burdens of biotechnology advances?",
    options: ["Autonomy", "Beneficence", "Non-maleficence", "Distributive justice"],
    answer: 3,
    explanation: "Distributive justice concerns the fair allocation of resources, benefits, and burdens. In biotechnology, it raises questions about equitable access to new technologies, especially when they're expensive or limited in availability."
  },
  {
    question: "What ethical concern is associated with direct-to-consumer genetic testing?",
    options: ["Inadequate regulatory oversight", "Misinterpretation of results without medical guidance", "Privacy and security of genetic data", "All of the above"],
    answer: 3,
    explanation: "Direct-to-consumer genetic testing raises multiple ethical concerns, including limited regulation, potential misunderstanding of complex results without professional guidance, and questions about how companies protect, use, and share customers' genetic data."
  },
  {
    question: "Which of the following best describes the concept of 'biocolonialism'?",
    options: ["Using biotechnology to colonize other planets", "Exploitation of indigenous biological resources and knowledge without fair compensation", "The dominance of certain species in an ecosystem", "Establishing colonies of genetically identical organisms"],
    answer: 1,
    explanation: "Biocolonialism refers to the exploitation of indigenous biological resources and traditional knowledge by typically more powerful entities (often corporations from developed countries) without appropriate consent, acknowledgment, or compensation to the communities of origin."
  },
  {
    question: "What is 'genetic determinism'?",
    options: ["The belief that genes determine all aspects of an organism's traits and behaviors", "The process of determining an organism's genetic makeup", "The policy of allowing parents to select genetic traits of their children", "The principle that genetic research should determine policy decisions"],
    answer: 0,
    explanation: "Genetic determinism is the reductionist belief that human traits and behaviors are determined exclusively by genetic factors, minimizing the role of environment, personal choice, and other influences—a perspective criticized for oversimplifying complex biological and social phenomena."
  },
  {
    question: "What is 'neuroethics' in the context of biotechnology?",
    options: ["The study of how neurons develop ethical decision-making capabilities", "The field examining ethical issues related to brain science and neural technology", "The ethics of using neurotransmitters as pharmaceuticals", "The moral principles guiding neurological research"],
    answer: 1,
    explanation: "Neuroethics examines the ethical, legal, and social implications of neuroscience research and the development of neurotechnology, including brain imaging, neural implants, and interventions that can monitor or modify brain function."
  },
  {
    question: "What is a key ethical issue in synthetic biology?",
    options: ["Creating entirely new life forms", "Potential environmental impacts of releasing synthetic organisms", "Defining the moral status of synthetic organisms", "All of the above"],
    answer: 3,
    explanation: "Synthetic biology raises multiple ethical issues, including questions about creating novel life forms, potential ecological disruption if synthetic organisms escape into the environment, biosecurity concerns, and philosophical questions about the moral status of engineered life."
  },
  {
    question: "Which of the following best describes the ethical principle of 'non-maleficence' in biotechnology?",
    options: ["Maximizing benefits to society", "Respecting individual autonomy", "Avoiding harm to individuals or populations", "Ensuring fair distribution of benefits"],
    answer: 2,
    explanation: "Non-maleficence is the ethical principle of avoiding harm ('first, do no harm'). In biotechnology, this includes preventing harm to research participants, patients, populations, and the environment when developing and applying biotechnological innovations."
  },
  {
    question: "What is the primary ethical concern with 'gene drives' technology?",
    options: ["The high cost of implementation", "Potential for uncontrolled spread and ecological disruption", "Limited effectiveness in target species", "Difficulty in obtaining patents"],
    answer: 1,
    explanation: "Gene drives are genetic elements that increase the probability of their inheritance, potentially spreading engineered traits through entire wild populations. The primary ethical concern is their potential to rapidly and perhaps irreversibly alter or eliminate wild populations, with unpredictable ecological consequences."
  },
  {
    question: "What ethical framework emphasizes considering the consequences of actions when making biotechnology policy decisions?",
    options: ["Deontological ethics", "Virtue ethics", "Consequentialism", "Natural law theory"],
    answer: 2,
    explanation: "Consequentialism judges the rightness of actions based on their outcomes or consequences. In biotechnology policy, a consequentialist approach weighs potential benefits (like improved health) against possible harms (such as environmental risks) when deciding whether to pursue or regulate a technology."
  },
  {
    question: "What is 'biological essentialism' in the context of genetic research?",
    options: ["The view that the essence of biology is in its molecular components", "The belief that biological categories like race or sex have fixed, inherent properties determined by genes", "The principle that essential biological processes should not be modified", "The practice of identifying essential genes required for an organism's survival"],
    answer: 1,
    explanation: "Biological essentialism is the belief that certain biological categories (like race or sex) reflect natural, fixed essences determined by genetics, rather than socially constructed or fluid categories. This perspective can lead to oversimplification and misuse of genetic information to reinforce stereotypes."
  },
  {
    question: "What is the 'therapeutic gap' in genetic medicine?",
    options: ["The difference between diagnosable genetic conditions and treatable ones", "The lag time between genetic testing and receiving results", "The disparity in access to genetic treatments between rich and poor countries", "The difference between somatic and germline therapies"],
    answer: 0,
    explanation: "The therapeutic gap refers to the growing disparity between our ability to diagnose genetic conditions (which has advanced rapidly) and our ability to treat them (which has progressed more slowly), creating situations where patients may receive diagnoses for which no effective interventions exist."
  },
  {
    question: "What is the ethical principle of 'procedural justice' in biotechnology regulation?",
    options: ["Ensuring everyone has equal access to biotechnology", "Making sure regulatory procedures are followed correctly", "Ensuring fair and transparent processes for decision-making about biotechnology", "Punishing those who violate biotechnology regulations"],
    answer: 2,
    explanation: "Procedural justice focuses on the fairness and transparency of decision-making processes rather than just outcomes. In biotechnology regulation, this means ensuring diverse stakeholders can participate meaningfully in policy development and that regulatory decisions are made through open, accountable processes."
  },
  {
    question: "What is 'biohacking' and what ethical concerns does it raise?",
    options: ["Unauthorized access to biological databases, raising privacy concerns", "DIY biology and self-experimentation, raising safety and oversight concerns", "Using biological methods to hack computer systems, raising security concerns", "Creating biological weapons through genetic engineering, raising security concerns"],
    answer: 1,
    explanation: "Biohacking refers to DIY biology activities conducted outside traditional institutional settings, including self-experimentation and genetic engineering in home labs. Ethical concerns include safety risks, limited oversight, potential environmental impacts, and questions about democratizing biotechnology while maintaining appropriate safeguards."
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

// Extended quiz questions continue with more specialized topics in molecular biotechnology

export default BiotechnologyQuiz;