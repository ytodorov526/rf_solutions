import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import ScienceIcon from '@mui/icons-material/Science';

// Quiz data
const quizData = {
  beginner: [
    {
      question: "What particle is responsible for carrying the electromagnetic force?",
      options: [
        "Neutron",
        "Proton",
        "Photon",
        "Neutrino"
      ],
      correctAnswer: 2,
      explanation: "The photon is the force carrier (gauge boson) of the electromagnetic force. It is a massless particle responsible for electromagnetic interactions between charged particles."
    },
    {
      question: "Which of the following is NOT a type of radiation produced by nuclear processes?",
      options: [
        "Alpha particles",
        "Beta particles",
        "X-rays",
        "Sound waves"
      ],
      correctAnswer: 3,
      explanation: "Sound waves are mechanical waves that require a medium to propagate, not a form of nuclear radiation. The three main types of nuclear radiation are alpha particles (helium nuclei), beta particles (electrons/positrons), and gamma rays (high-energy photons). X-rays are also electromagnetic radiation but typically originate from electron transitions rather than nuclear processes."
    },
    {
      question: "What is the primary fuel used in most commercial nuclear reactors today?",
      options: [
        "Natural uranium",
        "Enriched uranium",
        "Plutonium",
        "Thorium"
      ],
      correctAnswer: 1,
      explanation: "Enriched uranium (uranium with an increased concentration of U-235, typically 3-5%) is the primary fuel used in most commercial nuclear reactors today. Natural uranium contains only 0.7% U-235, which is insufficient for sustaining a chain reaction in light water reactors."
    },
    {
      question: "What is the purpose of a moderator in a nuclear reactor?",
      options: [
        "To absorb excess neutrons",
        "To slow down fast neutrons",
        "To prevent radiation leakage",
        "To control the temperature of the core"
      ],
      correctAnswer: 1,
      explanation: "A moderator slows down (or moderates) fast neutrons to thermal energies, which increases the probability of neutron capture and fission in U-235. Common moderators include water, heavy water (D₂O), and graphite."
    },
    {
      question: "What does the term 'half-life' refer to in nuclear physics?",
      options: [
        "The time it takes for a radioactive material to decay completely",
        "The time it takes for half of a radioactive material to decay",
        "The time a radioactive material remains dangerous",
        "Half the operational life of a nuclear reactor"
      ],
      correctAnswer: 1,
      explanation: "Half-life is the time required for exactly half of the radioactive atoms in a sample to decay. It is a characteristic property of each radioactive isotope and ranges from fractions of a second to billions of years, depending on the isotope."
    },
    {
      question: "Which component in a nuclear power plant directly generates electricity?",
      options: [
        "Reactor core",
        "Steam generator",
        "Turbine-generator",
        "Cooling tower"
      ],
      correctAnswer: 2,
      explanation: "The turbine-generator directly generates electricity in a nuclear power plant. The reactor core produces heat, which is used to generate steam (either directly or via steam generators), and this steam drives the turbine that is connected to an electrical generator."
    },
    {
      question: "Which of the following best describes nuclear fission?",
      options: [
        "Combining light nuclei to form a heavier nucleus",
        "Splitting a heavy nucleus into lighter nuclei",
        "The emission of radiation from an unstable nucleus",
        "The capture of a neutron by a stable nucleus"
      ],
      correctAnswer: 1,
      explanation: "Nuclear fission is the process of splitting a heavy nucleus (like uranium-235 or plutonium-239) into two or more lighter nuclei, accompanied by the release of neutrons, gamma rays, and a large amount of energy. This is the process that powers current nuclear reactors."
    },
    {
      question: "What is the primary cooling medium used in Pressurized Water Reactors (PWRs)?",
      options: [
        "Heavy water (D₂O)",
        "Ordinary water (H₂O)",
        "Liquid sodium",
        "Carbon dioxide gas"
      ],
      correctAnswer: 1,
      explanation: "Pressurized Water Reactors (PWRs) use ordinary water (H₂O) as both coolant and moderator. The water is kept under high pressure (about 155 bar) to prevent boiling while operating at high temperatures (around 315°C)."
    },
    {
      question: "Which of the following nuclear processes releases the most energy per unit mass?",
      options: [
        "Alpha decay",
        "Beta decay",
        "Nuclear fission",
        "Nuclear fusion"
      ],
      correctAnswer: 3,
      explanation: "Nuclear fusion releases the most energy per unit mass of any nuclear process. The fusion of light elements (such as hydrogen isotopes) into heavier elements (such as helium) can release nearly four times more energy per unit mass than nuclear fission."
    },
    {
      question: "What is the primary function of control rods in a nuclear reactor?",
      options: [
        "To generate additional neutrons",
        "To absorb neutrons and control the reaction rate",
        "To provide structural support for fuel assemblies",
        "To increase the efficiency of heat transfer"
      ],
      correctAnswer: 1,
      explanation: "Control rods absorb neutrons to control the rate of the nuclear chain reaction. By inserting or withdrawing control rods, operators can decrease or increase the reactor power. Control rods are typically made of neutron-absorbing materials such as boron, cadmium, or hafnium."
    }
  ],
  intermediate: [
    {
      question: "What is the delayed neutron fraction in a nuclear reactor?",
      options: [
        "The fraction of neutrons that arrive with a delay after fission",
        "The fraction of neutrons that leak from the reactor core",
        "The fraction of neutrons that cause additional fissions",
        "The fraction of neutrons absorbed by control rods"
      ],
      correctAnswer: 0,
      explanation: "The delayed neutron fraction (often denoted by β) is the fraction of neutrons that are not released immediately during fission but with a delay due to the decay of fission products. This fraction (about 0.65% for U-235) is crucial for reactor control, as it extends the neutron generation time and makes the reactor easier to control."
    },
    {
      question: "In a nuclear reactor, what does the term 'poisoning' refer to?",
      options: [
        "The release of toxic chemicals from nuclear fuel",
        "The accumulation of neutron-absorbing fission products",
        "Damage to fuel rods from excessive heat",
        "Radiation leakage outside the containment"
      ],
      correctAnswer: 1,
      explanation: "In reactor physics, 'poisoning' refers to the accumulation of neutron-absorbing fission products that reduce reactivity. The most significant example is xenon-135, which has a very high neutron absorption cross-section and can cause xenon poisoning that affects reactor operation after power changes."
    },
    {
      question: "What is the difference between prompt and delayed criticality?",
      options: [
        "Prompt criticality relies only on prompt neutrons, while delayed criticality includes delayed neutrons",
        "Prompt criticality occurs immediately, while delayed criticality takes hours to achieve",
        "Prompt criticality happens at higher power levels, delayed at lower levels",
        "Prompt criticality relates to research reactors, delayed to power reactors"
      ],
      correctAnswer: 0,
      explanation: "Prompt criticality means the reactor would be critical using only prompt neutrons (neutrons released immediately during fission). This is an unsafe condition leading to a rapid power excursion. Normal reactor operation relies on delayed criticality, where both prompt and delayed neutrons are needed for criticality, allowing for controllable operation."
    },
    {
      question: "What is the purpose of a Reactor Pressure Vessel (RPV)?",
      options: [
        "To create pressure needed for the nuclear reaction to occur",
        "To contain the reactor core and primary coolant under pressure",
        "To generate steam for the turbine",
        "To provide radiation shielding for workers"
      ],
      correctAnswer: 1,
      explanation: "The Reactor Pressure Vessel (RPV) contains the reactor core and primary coolant under high pressure. It's a critical safety barrier that prevents the release of radioactive materials and allows the coolant to operate at high temperatures without boiling in pressurized water reactors."
    },
    {
      question: "Which of the following is a characteristic of a fast neutron reactor?",
      options: [
        "It uses a moderator to slow down neutrons",
        "It has a lower power density than thermal reactors",
        "It can use natural uranium as fuel",
        "It can breed more fissile material than it consumes"
      ],
      correctAnswer: 3,
      explanation: "Fast neutron reactors can breed more fissile material than they consume by converting fertile materials (like U-238) into fissile isotopes (like Pu-239). Unlike thermal reactors, fast reactors operate without moderators, maintain higher neutron energies, and typically use higher-enriched fuels or plutonium."
    },
    {
      question: "What is the significance of the neutron multiplication factor (k) in reactor physics?",
      options: [
        "It measures how many neutrons are produced per fission event",
        "It indicates how many times the core must be refueled annually",
        "It determines whether a reactor's power is increasing, stable, or decreasing",
        "It calculates the efficiency of electricity generation"
      ],
      correctAnswer: 2,
      explanation: "The neutron multiplication factor (k) indicates whether a reactor is subcritical (k < 1), critical (k = 1), or supercritical (k > 1). It represents the ratio of neutrons in one generation to those in the previous generation, determining whether the chain reaction is dying out, maintaining steady-state, or growing."
    },
    {
      question: "What is the difference between contamination and irradiation in radiation protection?",
      options: [
        "Contamination refers to external radiation, irradiation to internal radiation",
        "Contamination involves radioactive material on or in a person, irradiation is exposure to radiation without material transfer",
        "Contamination affects objects, irradiation affects people",
        "Contamination is short-term exposure, irradiation is long-term exposure"
      ],
      correctAnswer: 1,
      explanation: "Contamination occurs when radioactive material is deposited on or incorporated into a person's body or objects. Irradiation is exposure to radiation (like gamma rays) without the transfer of radioactive material. A contaminated person is irradiated, but an irradiated person is not necessarily contaminated."
    },
    {
      question: "What is the significance of the void coefficient in reactor design?",
      options: [
        "It measures the change in reactivity as coolant forms voids or bubbles",
        "It calculates the required void space in containment structures",
        "It determines the maximum allowable empty space in fuel pellets",
        "It quantifies the effect of control rod voids on neutron absorption"
      ],
      correctAnswer: 0,
      explanation: "The void coefficient measures how reactor reactivity changes when voids (bubbles) form in the coolant. A positive void coefficient means reactivity increases with void formation (potentially destabilizing), while a negative void coefficient decreases reactivity (self-stabilizing). The Chernobyl reactor had a positive void coefficient, which contributed to its accident."
    },
    {
      question: "In nuclear reactor terminology, what is a 'scram'?",
      options: [
        "A scheduled maintenance shutdown",
        "An emergency shutdown by rapid insertion of control rods",
        "A controlled power reduction procedure",
        "A containment isolation event"
      ],
      correctAnswer: 1,
      explanation: "A 'scram' is an emergency reactor shutdown achieved by rapidly inserting control rods into the core to stop the nuclear chain reaction. It's a safety measure triggered automatically by abnormal conditions or manually by operators when necessary."
    },
    {
      question: "Which property of zirconium alloys makes them widely used as fuel cladding in water-cooled reactors?",
      options: [
        "High thermal conductivity",
        "Low neutron absorption cross-section",
        "Resistance to radiation damage",
        "Low cost and abundant supply"
      ],
      correctAnswer: 1,
      explanation: "Zirconium alloys are used as fuel cladding primarily because of their low neutron absorption cross-section, which means they don't significantly reduce neutron flux in the reactor. They also have good corrosion resistance in high-temperature water and adequate mechanical properties, though they're neither the best thermal conductors nor the cheapest materials available."
    }
  ],
  advanced: [
    {
      question: "What phenomenon caused the positive reactivity excursion in the Chernobyl accident?",
      options: [
        "Control rod ejection",
        "Steam explosion",
        "Positive void coefficient combined with positive graphite coefficient",
        "Loss of external power supply"
      ],
      correctAnswer: 2,
      explanation: "The Chernobyl accident was primarily caused by the RBMK reactor's positive void coefficient combined with a positive graphite coefficient. As coolant water vaporized, it increased reactivity rather than decreasing it. When control rods with graphite tips were inserted from fully withdrawn positions, they initially displaced water with graphite (a better moderator), temporarily increasing reactivity before the absorber sections entered the core - a design flaw called the 'positive scram effect'."
    },
    {
      question: "Which of the following best describes the concept of 'defense in depth' in nuclear safety?",
      options: [
        "Using multiple armed security personnel at nuclear facilities",
        "Constructing reactors underground for physical protection",
        "Implementing multiple independent safety systems and barriers",
        "Developing detailed emergency response procedures"
      ],
      correctAnswer: 2,
      explanation: "Defense in depth is a fundamental nuclear safety principle that involves implementing multiple independent and redundant layers of protection, so if one layer fails, others remain effective. These include physical barriers (fuel cladding, pressure vessel, containment) and diverse safety systems. The concept recognizes that no single safety feature should be relied upon exclusively."
    },
    {
      question: "What is the 'fuel burn-up' in a nuclear reactor?",
      options: [
        "The temperature at which nuclear fuel melts",
        "The point at which fuel rods catch fire",
        "The measure of energy extracted from nuclear fuel",
        "The rate at which fuel is consumed"
      ],
      correctAnswer: 2,
      explanation: "Fuel burn-up is a measure of the energy extracted from nuclear fuel, typically expressed in gigawatt-days per metric ton of uranium (GWd/tU). It represents how much of the original fissile material has been 'burned' through nuclear reactions. Higher burn-up means more efficient fuel utilization but also leads to greater fuel cladding stress and fission product inventory."
    },
    {
      question: "Which neutron energy range is most effective for causing fission in U-235?",
      options: [
        "Fast neutrons (>1 MeV)",
        "Epithermal neutrons (1 eV - 1 MeV)",
        "Thermal neutrons (<0.025 eV)",
        "The fission cross-section is the same for all energies"
      ],
      correctAnswer: 2,
      explanation: "Thermal neutrons (<0.025 eV, corresponding to room temperature) are most effective at causing fission in U-235. The fission cross-section for U-235 is much higher (about 500 barns) for thermal neutrons than for fast neutrons (about 1-2 barns). This is why most commercial reactors use moderators to thermalize neutrons."
    },
    {
      question: "What is the main purpose of the containment building in a nuclear power plant?",
      options: [
        "To shield operators from radiation during normal operation",
        "To house the turbine and electrical generation equipment",
        "To contain radioactive materials in case of an accident",
        "To provide structural support for the reactor vessel"
      ],
      correctAnswer: 2,
      explanation: "The primary purpose of the containment building is to prevent the release of radioactive materials to the environment in case of an accident. Modern containments are designed to withstand internal pressures from steam releases, contain radioactive materials, shield against radiation, and sometimes provide protection against external hazards like aircraft impacts."
    },
    {
      question: "What is the main difference between deterministic and probabilistic safety analyses in nuclear engineering?",
      options: [
        "Deterministic analyses consider worst-case scenarios, while probabilistic analyses assess the likelihood of different accident sequences",
        "Deterministic analyses are for research reactors, probabilistic for power reactors",
        "Deterministic analyses use computer models, probabilistic rely on operational experience",
        "Deterministic analyses are conducted before construction, probabilistic during operation"
      ],
      correctAnswer: 0,
      explanation: "Deterministic safety analyses examine specific accident scenarios (often worst-case) to ensure safety systems can prevent or mitigate consequences, regardless of probability. Probabilistic safety analyses (PSA) quantify the likelihood of different accident sequences and their consequences, identifying risk contributors. Modern safety approaches use both: deterministic to ensure adequate safety margins and probabilistic to optimize safety resources toward the most significant risks."
    },
    {
      question: "What is meant by 'breeding ratio' in breeder reactors?",
      options: [
        "The ratio of thermal to fast neutrons",
        "The ratio of new fissile material produced to fissile material consumed",
        "The ratio of energy output to energy input",
        "The ratio of fissions caused by delayed versus prompt neutrons"
      ],
      correctAnswer: 1,
      explanation: "The breeding ratio is the ratio of new fissile material produced (through conversion of fertile material like U-238 to Pu-239) to fissile material consumed in the reactor. A breeding ratio greater than 1 means the reactor produces more fissile material than it consumes, theoretically enabling a sustainable fuel cycle with improved uranium resource utilization."
    },
    {
      question: "Which of the following best explains the concept of 'negative temperature coefficient' in reactor design?",
      options: [
        "The reactor becomes less efficient as temperature increases",
        "The reactor produces less power as temperature increases",
        "Reactivity decreases as fuel and moderator temperature increase",
        "The control system reduces power when temperature rises too high"
      ],
      correctAnswer: 2,
      explanation: "A negative temperature coefficient means that as reactor temperature increases, reactivity decreases automatically. This provides inherent safety and stability, as any unintended temperature rise (from excess power) causes a reduction in reactivity that counteracts the original disturbance. It comes from physical effects like Doppler broadening in fuel and density reduction in moderators."
    },
    {
      question: "What is the primary reason for using heavy water (D₂O) instead of light water (H₂O) in some reactor designs?",
      options: [
        "To achieve higher power density",
        "To use natural uranium without enrichment",
        "To increase thermal efficiency",
        "To reduce radioactive waste production"
      ],
      correctAnswer: 1,
      explanation: "Heavy water is primarily used because it has a much lower neutron absorption cross-section than light water, allowing reactors to achieve criticality with natural uranium (0.7% U-235) without enrichment. Light water reactors require enriched uranium (3-5% U-235) because ordinary hydrogen absorbs too many neutrons. This design choice was particularly important for countries that lacked uranium enrichment technology."
    },
    {
      question: "In a nuclear power plant, what is the purpose of the pressurizer in a PWR system?",
      options: [
        "To increase the efficiency of heat transfer to the steam generators",
        "To pressurize the containment building during accidents",
        "To maintain primary coolant pressure and compensate for volume changes",
        "To increase the boiling point of the secondary coolant"
      ],
      correctAnswer: 2,
      explanation: "The pressurizer maintains primary coolant pressure and compensates for volume changes in a PWR. It contains both water and steam phases in equilibrium, with heaters and spray systems to raise or lower pressure as needed. This ensures the primary coolant remains liquid throughout the system despite temperature changes, preventing boiling in the core while allowing efficient heat transfer to the secondary system."
    }
  ],
  expert: [
    {
      question: "What is the significance of the 1/v law in neutron absorption cross-sections?",
      options: [
        "Cross-sections are proportional to neutron velocity",
        "Cross-sections are inversely proportional to neutron velocity",
        "Cross-sections are proportional to the square root of neutron energy",
        "Cross-sections oscillate with changing neutron velocity"
      ],
      correctAnswer: 1,
      explanation: "The 1/v law states that for many nuclides, neutron absorption cross-sections are inversely proportional to neutron velocity (or equivalently, inversely proportional to the square root of energy). This is why thermal neutrons (slower) have higher absorption probabilities than fast neutrons for many isotopes, including key absorbers like B-10, which follows this law closely over a wide energy range."
    },
    {
      question: "Which phenomenon explains why reactors can experience xenon-induced spatial power oscillations?",
      options: [
        "Differences in control rod insertion depths across the core",
        "Local power changes affecting xenon production and burnout rates differently across the core",
        "Uneven cooling due to flow distribution problems",
        "Manufacturing variations in fuel enrichment"
      ],
      correctAnswer: 1,
      explanation: "Xenon-induced spatial oscillations occur because local power changes affect xenon production and burnout rates differently. If power increases in one region, xenon initially builds up (from iodine decay), then burns out. Adjacent regions experience the opposite effect, creating out-of-phase xenon concentrations. In large cores, this can lead to power swinging from one region to another with a period of about 15-30 hours unless properly controlled."
    },
    {
      question: "What principle underlies the operation of a homogeneous reactor?",
      options: [
        "Fuel and moderator are uniformly mixed in a single phase",
        "All fuel rods are identical in enrichment and configuration",
        "The neutron flux is flattened across the core",
        "The reactor is designed with perfect radial symmetry"
      ],
      correctAnswer: 0,
      explanation: "In a homogeneous reactor, the fuel and moderator are uniformly mixed in a single phase, typically as a liquid solution or slurry. This contrasts with heterogeneous designs (like most power reactors) where fuel and moderator are physically separate. Homogeneous reactors offer advantages in simplified fuel processing and inherent safety features but present challenges in containing the radioactive fluid and managing corrosion."
    },
    {
      question: "What is the 'six-factor formula' used to calculate in reactor physics?",
      options: [
        "The six major components of reactor operating costs",
        "The six stages of the nuclear fuel cycle",
        "The six parameters that determine the effective multiplication factor",
        "The six key isotopes in spent fuel"
      ],
      correctAnswer: 2,
      explanation: "The six-factor formula calculates the effective neutron multiplication factor (k) by multiplying six independent factors: the reproduction factor (η), the fast fission factor (ε), the fast non-leakage probability (Pf), the resonance escape probability (p), the thermal non-leakage probability (Pt), and the thermal utilization factor (f). It separates the complex neutronics of a reactor into distinct physical processes for analysis."
    },
    {
      question: "What is the primary advantage of the Integral Fast Reactor (IFR) design?",
      options: [
        "Lower construction costs compared to LWRs",
        "Higher thermal efficiency",
        "Closed fuel cycle with pyroprocessing for waste reduction",
        "Simplified safety systems requiring less maintenance"
      ],
      correctAnswer: 2,
      explanation: "The primary advantage of the Integral Fast Reactor (IFR) design is its closed fuel cycle with on-site pyroprocessing. This allows recycling of actinides, significantly reducing long-lived waste while improving uranium utilization. The IFR also featured passive safety systems and used metal fuel with liquid sodium coolant, demonstrating inherent safety during tests at EBR-II where it survived loss of coolant flow and loss of heat sink without scram."
    },
    {
      question: "What is the main challenge in developing fusion reactors compared to fission reactors?",
      options: [
        "Achieving sufficiently high temperatures to overcome electrostatic repulsion between nuclei",
        "Finding appropriate neutron moderators",
        "Preventing nuclear criticality excursions",
        "Managing long-lived radioactive waste"
      ],
      correctAnswer: 0,
      explanation: "The main challenge in fusion reactor development is achieving and maintaining the extremely high temperatures (100+ million °C) needed to overcome the electrostatic repulsion between positively charged nuclei. This requires sophisticated confinement systems (magnetic or inertial) and has prevented sustained net-energy-producing fusion reactions despite decades of research. Additional challenges include plasma stability, materials that can withstand intense neutron flux, and tritium breeding."
    },
    {
      question: "Which phenomenon is described by the Nordheim-Fuchs model in reactor kinetics?",
      options: [
        "Steady-state neutron flux distribution",
        "Prompt criticality excursion and self-limitation",
        "Xenon poisoning after shutdown",
        "Control rod worth during insertion"
      ],
      correctAnswer: 1,
      explanation: "The Nordheim-Fuchs model describes the behavior of a prompt criticality excursion and its self-limitation. It models how a reactor with prompt supercriticality experiences a rapid power rise that's eventually terminated by negative reactivity feedback (typically from temperature increases). The model predicts the energy release, peak power, and temperature rise during such excursions, which has been important for safety analyses of research reactors and criticality accidents."
    },
    {
      question: "What distinguishes a pebble bed reactor from conventional reactor designs?",
      options: [
        "It uses spherical fuel elements that are continuously circulated through the core",
        "It uses pebble-shaped moderator elements surrounding conventional fuel rods",
        "It relies on small 'pebbles' of neutron reflector material to enhance efficiency",
        "It employs a bed of catalyst pebbles to remove impurities from the coolant"
      ],
      correctAnswer: 0,
      explanation: "Pebble bed reactors use spherical fuel elements ('pebbles') containing TRISO fuel particles within a graphite matrix. These pebbles are continuously circulated through the core during operation, allowing online refueling without shutdown. This design offers advantages in passive safety (high thermal capacity, negative temperature coefficient) and operational flexibility, but presents challenges in fuel handling complexity and potential dust generation."
    },
    {
      question: "What is the significance of the Doppler effect in nuclear reactor safety?",
      options: [
        "It changes the frequency of radiation emitted from the core",
        "It broadens resonance absorption peaks in fuel as temperature increases",
        "It affects the velocity of delayed neutron precursors",
        "It alters the energy spectrum of neutrons leaking from the reactor"
      ],
      correctAnswer: 1,
      explanation: "The Doppler effect in reactor physics refers to the broadening of resonance absorption peaks in fuel isotopes (particularly U-238) as temperature increases. This increases neutron capture at resonance energies, providing an immediate negative reactivity feedback mechanism that's crucial for reactor stability and safety. Unlike other feedback mechanisms, the Doppler effect occurs directly in the fuel and acts promptly, helping limit power excursions before they become dangerous."
    },
    {
      question: "What is the significance of the neutron window in accelerator-driven systems (ADS)?",
      options: [
        "A physical window that separates the accelerator from the subcritical core",
        "The energy range where neutrons are most effective for transmutation",
        "The timeframe when the accelerator beam is active during operation",
        "The viewing port that allows monitoring of neutron production"
      ],
      correctAnswer: 0,
      explanation: "In accelerator-driven systems, the neutron window is the physical barrier (typically made of a material like an alloy of lead-bismuth) that separates the vacuum environment of the accelerator from the subcritical core environment while allowing the high-energy particle beam to pass through. This component faces extreme engineering challenges including radiation damage, thermal stress, and corrosion, and is often considered one of the critical technological limitations for ADS implementation."
    }
  ]
};

function NuclearEngineeringQuiz() {
  const [difficulty, setDifficulty] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  
  // Handle difficulty selection
  const handleSelectDifficulty = (level) => {
    setDifficulty(level);
    resetQuiz();
  };
  
  // Reset quiz state
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswered(false);
    setScore(0);
    setQuizCompleted(false);
    setShowExplanation(false);
  };
  
  // Handle answer selection
  const handleAnswerSelect = (event) => {
    if (!answered) {
      setSelectedAnswer(parseInt(event.target.value));
    }
  };
  
  // Submit answer
  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setAnswered(true);
    
    // Check if answer is correct
    const correctAnswerIndex = quizData[difficulty][currentQuestion].correctAnswer;
    if (selectedAnswer === correctAnswerIndex) {
      setScore(prev => prev + 1);
    }
    
    setShowExplanation(true);
  };
  
  // Go to next question
  const handleNextQuestion = () => {
    if (currentQuestion < quizData[difficulty].length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setAnswered(false);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };
  
  // Restart quiz
  const handleRestartQuiz = () => {
    resetQuiz();
  };
  
  // Change difficulty
  const handleChangeDifficulty = () => {
    setDifficulty(null);
    resetQuiz();
  };
  
  // Calculate performance based on score
  const calculatePerformance = () => {
    const percentage = (score / quizData[difficulty].length) * 100;
    
    if (percentage >= 80) {
      return {
        message: "Excellent! You have a strong understanding of nuclear engineering concepts.",
        color: "success"
      };
    } else if (percentage >= 60) {
      return {
        message: "Good job! You have a solid grasp of the basics.",
        color: "info"
      };
    } else {
      return {
        message: "Keep learning! Review the explanations to strengthen your knowledge.",
        color: "warning"
      };
    }
  };

  // Render difficulty selection screen
  if (!difficulty) {
    return (
      <Box>
        <Typography variant="h5" align="center" gutterBottom>
          Nuclear Engineering Knowledge Quiz
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ mb: 4 }}>
          Test your knowledge of nuclear physics, reactor technology, and radiation science.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ maxWidth: 700, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select Difficulty Level:
            </Typography>
            
            <Grid container spacing={3}>
              <DifficultyCard 
                title="Beginner"
                description="Basic concepts of nuclear physics, reactor components, and radiation"
                onSelect={() => handleSelectDifficulty('beginner')}
                color="#4caf50"
              />
              
              <DifficultyCard 
                title="Intermediate"
                description="Reactor physics, safety systems, and operational parameters"
                onSelect={() => handleSelectDifficulty('intermediate')}
                color="#2196f3"
              />
              
              <DifficultyCard 
                title="Advanced"
                description="Complex reactor behavior, safety analysis, and engineering design principles"
                onSelect={() => handleSelectDifficulty('advanced')}
                color="#ff9800"
              />
              
              <DifficultyCard 
                title="Expert"
                description="Specialized topics in reactor kinetics, fuel cycle technology, and advanced reactor concepts"
                onSelect={() => handleSelectDifficulty('expert')}
                color="#f44336"
              />
            </Grid>
          </Box>
        </Box>
      </Box>
    );
  }
  
  // Render quiz completion screen
  if (quizCompleted) {
    const performance = calculatePerformance();
    
    return (
      <Box>
        <Paper elevation={3} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 2 }}>
          <Box sx={{ textAlign: 'center', mb: 3 }}>
            <EmojiEventsIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Quiz Completed!
            </Typography>
            <Typography variant="h6" color="primary" gutterBottom>
              Your Score: {score}/{quizData[difficulty].length} ({Math.round((score / quizData[difficulty].length) * 100)}%)
            </Typography>
            
            <Alert severity={performance.color} sx={{ mt: 2, mb: 3 }}>
              {performance.message}
            </Alert>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
              <Button 
                variant="contained"
                color="primary"
                onClick={handleRestartQuiz}
              >
                Restart Quiz
              </Button>
              <Button 
                variant="outlined"
                onClick={handleChangeDifficulty}
              >
                Change Difficulty
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    );
  }
  
  // Get current question data
  const questionData = quizData[difficulty][currentQuestion];
  
  // Render quiz questions
  return (
    <Box>
      <Paper elevation={3} sx={{ maxWidth: 700, mx: 'auto', p: 4, borderRadius: 2 }}>
        {/* Progress indicator */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="body2" color="textSecondary">
              Question {currentQuestion + 1} of {quizData[difficulty].length}
            </Typography>
            <Chip 
              label={difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} 
              color={
                difficulty === 'beginner' ? 'success' : 
                difficulty === 'intermediate' ? 'primary' : 
                difficulty === 'advanced' ? 'warning' :
                'error'
              }
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={(currentQuestion / quizData[difficulty].length) * 100} 
            sx={{ height: 8, borderRadius: 4 }}
          />
        </Box>
        
        {/* Question */}
        <Typography variant="h6" gutterBottom>
          {questionData.question}
        </Typography>
        
        {/* Answer options */}
        <FormControl component="fieldset" sx={{ width: '100%', my: 2 }}>
          <RadioGroup
            value={selectedAnswer === null ? '' : selectedAnswer.toString()}
            onChange={handleAnswerSelect}
          >
            {questionData.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index.toString()}
                control={<Radio />}
                label={option}
                disabled={answered}
                sx={{
                  p: 1,
                  borderRadius: 1,
                  ...(answered && index === questionData.correctAnswer && {
                    bgcolor: 'success.light',
                  }),
                  ...(answered && selectedAnswer === index && selectedAnswer !== questionData.correctAnswer && {
                    bgcolor: 'error.light',
                  }),
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        
        {/* Explanation (shown after answering) */}
        {showExplanation && (
          <Alert 
            severity={selectedAnswer === questionData.correctAnswer ? "success" : "error"}
            icon={selectedAnswer === questionData.correctAnswer ? <CheckCircleIcon /> : <ErrorIcon />}
            sx={{ mt: 2, mb: 3 }}
          >
            <Typography variant="subtitle2" gutterBottom>
              {selectedAnswer === questionData.correctAnswer ? "Correct!" : "Incorrect"}
            </Typography>
            <Typography variant="body2">
              {questionData.explanation}
            </Typography>
          </Alert>
        )}
        
        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          {!answered ? (
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitAnswer}
              disabled={selectedAnswer === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
            >
              {currentQuestion < quizData[difficulty].length - 1 ? "Next Question" : "See Results"}
            </Button>
          )}
          
          <Button
            variant="text"
            color="inherit"
            onClick={handleChangeDifficulty}
          >
            Exit Quiz
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

// Helper component for difficulty cards
function DifficultyCard({ title, description, onSelect, color }) {
  return (
    <Box sx={{ width: { xs: '100%', sm: '50%', md: '25%' }, px: 1, mb: 2 }}>
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderTop: `4px solid ${color}`,
          cursor: 'pointer',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: 4
          }
        }}
        onClick={onSelect}
      >
        <CardContent>
          <Typography variant="h6" component="h3" gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

// Helper component for grid layout
function Grid({ container, item, children, spacing, xs, md, ...props }) {
  return (
    <Box
      sx={{
        ...(container && {
          display: 'flex',
          flexWrap: 'wrap',
          mx: spacing ? -spacing / 8 : 0
        }),
        ...(item && {
          ...(xs && { width: `${(xs / 12) * 100}%` }),
          ...(md && { 
            '@media (min-width: 900px)': {
              width: `${(md / 12) * 100}%`
            }
          })
        }),
        ...props.sx
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

export default NuclearEngineeringQuiz;