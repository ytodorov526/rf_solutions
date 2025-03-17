import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  AlertTitle,
  Grid,
  Tab,
  Tabs,
  CircularProgress,
  Chip
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import TimerIcon from '@mui/icons-material/Timer';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`quiz-tabpanel-${index}`}
      aria-labelledby={`quiz-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index) {
  return {
    id: `quiz-tab-${index}`,
    'aria-controls': `quiz-tabpanel-${index}`,
  };
}

// Quiz questions by category
const quizQuestions = {
  basic: [
    {
      question: "What is Ohm's Law?",
      options: ["V = I/R", "V = IR", "R = I/V", "I = V/R²"],
      answer: 1,
      explanation: "Ohm's Law states that the voltage (V) across a conductor is directly proportional to the current (I) flowing through it, with the constant of proportionality being the resistance (R). The formula is V = IR."
    },
    {
      question: "Which component stores energy in an electric field?",
      options: ["Resistor", "Capacitor", "Inductor", "Transformer"],
      answer: 1,
      explanation: "A capacitor stores energy in an electric field between its plates. Inductors store energy in a magnetic field, resistors dissipate energy as heat, and transformers transfer energy between circuits."
    },
    {
      question: "What is the unit of electrical resistance?",
      options: ["Volt", "Ampere", "Ohm", "Watt"],
      answer: 2,
      explanation: "The ohm (Ω) is the unit of electrical resistance. Volt (V) is the unit of voltage, ampere (A) is the unit of current, and watt (W) is the unit of power."
    },
    {
      question: "What color code represents a resistance of 470 Ω ±5%?",
      options: ["Yellow-Violet-Brown-Gold", "Red-Violet-Brown-Gold", "Yellow-Purple-Black-Gold", "Red-Purple-Black-Silver"],
      answer: 0,
      explanation: "For a 470 Ω resistor with ±5% tolerance, the color code is Yellow (4), Violet (7), Brown (×10), Gold (±5%). This gives 4-7-×10 = 470 Ω with 5% tolerance."
    },
    {
      question: "Which component opposes changes in current?",
      options: ["Resistor", "Capacitor", "Inductor", "Diode"],
      answer: 2,
      explanation: "An inductor opposes changes in current by generating a back EMF according to Lenz's Law. It stores energy in a magnetic field when current flows through it."
    },
    {
      question: "What is the total resistance of two 100 Ω resistors connected in parallel?",
      options: ["200 Ω", "100 Ω", "50 Ω", "0 Ω"],
      answer: 2,
      explanation: "For resistors in parallel, the formula is 1/Rt = 1/R1 + 1/R2. For two equal resistors, Rt = R/2, so two 100 Ω resistors in parallel give 50 Ω."
    },
    {
      question: "What does LED stand for?",
      options: ["Light Emitting Device", "Low Energy Diode", "Light Emitting Diode", "Linear Electronic Device"],
      answer: 2,
      explanation: "LED stands for Light Emitting Diode. It's a semiconductor device that emits light when current flows through it in the forward direction."
    },
    {
      question: "Which of the following is a semiconductor material?",
      options: ["Copper", "Silicon", "Gold", "Aluminum"],
      answer: 1,
      explanation: "Silicon is a semiconductor material. Copper, gold, and aluminum are all metals which are good conductors of electricity."
    }
  ],
  circuit: [
    {
      question: "What happens to current in a series circuit?",
      options: ["It varies at different points in the circuit", "It divides among the branches", "It is the same at all points", "It drops to zero after the first component"],
      answer: 2,
      explanation: "In a series circuit, the current is the same at all points. This is because there is only one path for the current to flow, and charge must be conserved."
    },
    {
      question: "In an RC circuit, what happens when the time constant increases?",
      options: ["The circuit charges faster", "The circuit charges slower", "The maximum voltage increases", "The resistance decreases"],
      answer: 1,
      explanation: "The time constant of an RC circuit is τ = RC. A larger time constant means the circuit charges and discharges more slowly. It takes approximately 5 time constants to fully charge or discharge."
    },
    {
      question: "What is the resonant frequency of an LC circuit with L = 10 mH and C = 100 μF?",
      options: ["159.15 Hz", "1.59 kHz", "15.92 Hz", "159.15 kHz"],
      answer: 0,
      explanation: "The resonant frequency is f = 1/(2π√(LC)). With L = 10 mH and C = 100 μF, f = 1/(2π√(0.01 × 0.0001)) = 159.15 Hz."
    },
    {
      question: "What is the function of a low-pass filter?",
      options: ["Blocks high-frequency signals", "Blocks low-frequency signals", "Amplifies all signals", "Blocks all signals"],
      answer: 0,
      explanation: "A low-pass filter allows low-frequency signals to pass through while attenuating (blocking) high-frequency signals above its cutoff frequency."
    },
    {
      question: "Which of the following is not a passive component?",
      options: ["Resistor", "Capacitor", "Transistor", "Inductor"],
      answer: 2,
      explanation: "A transistor is an active component that can amplify signals. Resistors, capacitors, and inductors are passive components that can only attenuate or store energy."
    },
    {
      question: "What is the phase difference between voltage and current in a purely capacitive circuit?",
      options: ["0°", "90°", "-90°", "180°"],
      answer: 2,
      explanation: "In a purely capacitive circuit, the current leads the voltage by 90°, which means the voltage lags the current by 90° (or -90° phase difference)."
    },
    {
      question: "What is Kirchhoff's Current Law (KCL)?",
      options: ["The sum of voltages around a loop is zero", "The sum of currents entering a node equals the sum of currents leaving the node", "Current is proportional to voltage", "Voltage is proportional to current"],
      answer: 1,
      explanation: "Kirchhoff's Current Law (KCL) states that the algebraic sum of currents entering and leaving a node is zero, or equivalently, the sum of currents entering a node equals the sum of currents leaving the node."
    },
    {
      question: "What is the equivalent capacitance of two 10 μF capacitors connected in series?",
      options: ["20 μF", "10 μF", "5 μF", "0 μF"],
      answer: 2,
      explanation: "For capacitors in series, the formula is 1/Ceq = 1/C1 + 1/C2. For two equal capacitors, Ceq = C/2, so two 10 μF capacitors in series give 5 μF."
    }
  ],
  power: [
    {
      question: "What is the difference between AC and DC power?",
      options: ["AC is safer than DC", "AC flows in one direction while DC periodically reverses", "DC flows in one direction while AC periodically reverses", "There is no difference"],
      answer: 2,
      explanation: "DC (Direct Current) flows consistently in one direction, while AC (Alternating Current) periodically reverses direction, typically in a sinusoidal waveform."
    },
    {
      question: "What is the power consumed by a device with a resistance of 100 Ω when 2 A flows through it?",
      options: ["200 W", "400 W", "50 W", "100 W"],
      answer: 1,
      explanation: "Power can be calculated using P = I²R. With I = 2 A and R = 100 Ω, P = 2² × 100 = 400 W."
    },
    {
      question: "What does RMS stand for in AC power?",
      options: ["Regular Maximum Signal", "Root Mean Square", "Reactive Modulation System", "Reverse Measure Standard"],
      answer: 1,
      explanation: "RMS stands for Root Mean Square. It's a way to measure the effective value of AC voltage or current that would deliver the same power as a DC equivalent."
    },
    {
      question: "What is power factor in AC circuits?",
      options: ["The ratio of real power to apparent power", "The ratio of reactive power to real power", "The ratio of voltage to current", "The product of voltage and current"],
      answer: 0,
      explanation: "Power factor is the ratio of real power (measured in watts) to apparent power (measured in volt-amperes). It's a measure of how efficiently electrical power is being used."
    },
    {
      question: "Which component is used to improve power factor in industrial settings?",
      options: ["Resistor", "Inductor", "Capacitor", "Transformer"],
      answer: 2,
      explanation: "Capacitors are commonly used to improve power factor in industrial settings. They counteract the lagging power factor caused by inductive loads like motors."
    },
    {
      question: "What is the purpose of a circuit breaker?",
      options: ["To measure current", "To increase voltage", "To protect against overcurrent", "To convert AC to DC"],
      answer: 2,
      explanation: "A circuit breaker is a safety device that automatically interrupts electrical flow when it detects excess current, protecting against overloading and short circuits."
    },
    {
      question: "What is the voltage of a standard residential outlet in the United States?",
      options: ["110-120V", "220-240V", "50V", "380V"],
      answer: 0,
      explanation: "Standard residential outlets in the United States provide 110-120V AC power. Some specialized applications like electric dryers use 220-240V circuits."
    },
    {
      question: "What does three-phase power mean?",
      options: ["Power delivered in three separate steps", "Power that uses three different voltages", "A system with three conductors carrying AC voltages with a 120° phase difference", "Power that can only be used by three devices simultaneously"],
      answer: 2,
      explanation: "Three-phase power is a method of electrical power transmission that uses three conductors each carrying an alternating current of the same frequency but offset by 120° phases. It's commonly used in industrial applications and large buildings."
    }
  ],
  semiconductor: [
    {
      question: "What semiconductor device is used as a voltage regulator?",
      options: ["Diode", "Transistor", "Zener diode", "MOSFET"],
      answer: 2,
      explanation: "A Zener diode is specifically designed to operate in the reverse breakdown region at a specific voltage, making it ideal for voltage regulation applications."
    },
    {
      question: "Which semiconductor material is most commonly used in electronic devices?",
      options: ["Germanium", "Silicon", "Gallium Arsenide", "Diamond"],
      answer: 1,
      explanation: "Silicon is the most commonly used semiconductor material due to its abundance, cost-effectiveness, suitable band gap, and compatibility with manufacturing processes."
    },
    {
      question: "What is the function of a transistor in a circuit?",
      options: ["To store charge", "To block current in both directions", "To amplify and switch electronic signals", "To maintain constant voltage"],
      answer: 2,
      explanation: "Transistors are semiconductor devices used to amplify or switch electronic signals. They are fundamental building blocks for modern electronic devices and serve as the basis for integrated circuits."
    },
    {
      question: "What makes semiconductors different from conductors and insulators?",
      options: ["They have negative resistance", "Their conductivity falls between conductors and insulators", "They only conduct at high temperatures", "They conduct electricity in one direction only"],
      answer: 1,
      explanation: "Semiconductors have electrical conductivity values between conductors (like metals) and insulators (like glass). Their conductivity can be controlled by introducing impurities (doping) or by applying electric fields."
    },
    {
      question: "What is doping in semiconductor technology?",
      options: ["Cooling semiconductors to increase conductivity", "Adding impurities to change conductivity", "Coating semiconductors with metal", "Exposing semiconductors to light"],
      answer: 1,
      explanation: "Doping is the intentional introduction of impurities into a semiconductor to modify its electrical properties. N-type doping adds electron donors, while p-type doping adds electron acceptors."
    },
    {
      question: "What is the main difference between a PNP and an NPN transistor?",
      options: ["Size", "Power handling capability", "Direction of current flow", "Operating temperature"],
      answer: 2,
      explanation: "The main difference between PNP and NPN transistors is the direction of current flow. In a PNP transistor, current flows from the emitter to the collector, while in an NPN, it flows from the collector to the emitter."
    },
    {
      question: "What does MOSFET stand for?",
      options: ["Metal Oxide Semiconductor Field-Effect Transistor", "Multiple Output Signal Frequency Electronic Terminal", "Micro Oriented Silicon Fabrication Enhancement Technology", "Modulated Oscillation System For Electronic Transmission"],
      answer: 0,
      explanation: "MOSFET stands for Metal Oxide Semiconductor Field-Effect Transistor. It's a type of field-effect transistor with an insulated gate, widely used in digital and analog circuits."
    },
    {
      question: "What is the function of a diode in a circuit?",
      options: ["To amplify signals", "To allow current to flow in one direction only", "To regulate voltage", "To store energy"],
      answer: 1,
      explanation: "A diode allows current to flow in one direction (forward bias) while blocking it in the opposite direction (reverse bias). This property makes diodes useful for rectification, signal demodulation, and protection circuits."
    }
  ]
};

function ElectricalEngineeringQuiz() {
  const [activeTab, setActiveTab] = useState(0);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState(null);
  const [quizCategory, setQuizCategory] = useState('basic');
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  // Reset quiz when category changes
  useEffect(() => {
    resetQuiz();
  }, [quizCategory]);

  // Handle timer
  useEffect(() => {
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [intervalId]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleCategoryChange = (category) => {
    setQuizCategory(category);
  };

  const startQuiz = () => {
    setLoadingQuiz(true);
    setTimeout(() => {
      setQuizStarted(true);
      setQuizCompleted(false);
      setCurrentQuestionIndex(0);
      setSelectedOption(null);
      setAnswerSubmitted(false);
      setScore(0);
      setTimer(0);
      setShowExplanation(false);
      
      // Start timer
      const id = setInterval(() => {
        setTimer(prevTimer => prevTimer + 1);
      }, 1000);
      setIntervalId(id);
      setLoadingQuiz(false);
    }, 1000);
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setQuizCompleted(false);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswerSubmitted(false);
    setScore(0);
    setTimer(0);
    setShowExplanation(false);
    
    // Clear timer
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(null);
    }
  };

  const handleOptionSelect = (event) => {
    setSelectedOption(parseInt(event.target.value));
  };

  const handleSubmitAnswer = () => {
    if (selectedOption === null) return;
    
    const currentQuestion = quizQuestions[quizCategory][currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.answer;
    
    if (isCorrect) {
      setScore(prevScore => prevScore + 1);
    }
    
    setAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions[quizCategory].length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
      setSelectedOption(null);
      setAnswerSubmitted(false);
      setShowExplanation(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(null);
      }
    }
  };

  const toggleExplanation = () => {
    setShowExplanation(prev => !prev);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const calculatePercentage = () => {
    return (score / quizQuestions[quizCategory].length) * 100;
  };

  const getPerformanceMessage = () => {
    const percentage = calculatePercentage();
    if (percentage >= 90) return "Excellent! You have advanced knowledge of electrical engineering concepts.";
    if (percentage >= 75) return "Great job! You have a solid understanding of electrical engineering.";
    if (percentage >= 60) return "Good work! You have a basic grasp of electrical engineering concepts.";
    if (percentage >= 40) return "Not bad, but there's room for improvement.";
    return "Keep studying! Review the core electrical engineering concepts.";
  };

  const renderCategorySelection = () => {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Select Quiz Category
        </Typography>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                bgcolor: quizCategory === 'basic' ? 'primary.light' : 'background.paper',
                color: quizCategory === 'basic' ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.3s'
              }}
              onClick={() => handleCategoryChange('basic')}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Basic Concepts
                </Typography>
                <Typography variant="body2" align="center">
                  Fundamentals of electrical engineering including Ohm's law, components, and units.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Chip label="8 questions" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                bgcolor: quizCategory === 'circuit' ? 'primary.light' : 'background.paper',
                color: quizCategory === 'circuit' ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.3s'
              }}
              onClick={() => handleCategoryChange('circuit')}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Circuit Analysis
                </Typography>
                <Typography variant="body2" align="center">
                  Series/parallel circuits, RC/RL/RLC circuits, filters, and network theorems.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Chip label="8 questions" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                bgcolor: quizCategory === 'power' ? 'primary.light' : 'background.paper',
                color: quizCategory === 'power' ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.3s'
              }}
              onClick={() => handleCategoryChange('power')}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Power Systems
                </Typography>
                <Typography variant="body2" align="center">
                  AC/DC power, transformers, three-phase systems, and power distribution.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Chip label="8 questions" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card 
              sx={{ 
                height: '100%', 
                cursor: 'pointer',
                bgcolor: quizCategory === 'semiconductor' ? 'primary.light' : 'background.paper',
                color: quizCategory === 'semiconductor' ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.3s'
              }}
              onClick={() => handleCategoryChange('semiconductor')}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom align="center">
                  Semiconductor Devices
                </Typography>
                <Typography variant="body2" align="center">
                  Diodes, transistors, integrated circuits, and electronic components.
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Chip label="8 questions" size="small" />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button 
            variant="contained" 
            size="large" 
            onClick={startQuiz}
            disabled={loadingQuiz}
            sx={{ minWidth: 200 }}
          >
            {loadingQuiz ? <CircularProgress size={24} /> : 'Start Quiz'}
          </Button>
        </Box>
      </Box>
    );
  };

  const renderQuiz = () => {
    const currentQuestion = quizQuestions[quizCategory][currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / quizQuestions[quizCategory].length) * 100;
    
    return (
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1">
            Question {currentQuestionIndex + 1} of {quizQuestions[quizCategory].length}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TimerIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography variant="subtitle1">{formatTime(timer)}</Typography>
          </Box>
        </Box>
        
        <LinearProgress 
          variant="determinate" 
          value={progress} 
          sx={{ mb: 3, height: 10, borderRadius: 5 }}
        />
        
        <Typography variant="h6" gutterBottom>
          {currentQuestion.question}
        </Typography>
        
        <FormControl component="fieldset" sx={{ width: '100%', my: 2 }}>
          <RadioGroup value={selectedOption} onChange={handleOptionSelect}>
            {currentQuestion.options.map((option, index) => (
              <FormControlLabel
                key={index}
                value={index}
                control={<Radio />}
                label={option}
                disabled={answerSubmitted}
                sx={{
                  p: 1,
                  m: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: answerSubmitted && index === currentQuestion.answer ? 'success.light' : 
                           answerSubmitted && index === selectedOption && index !== currentQuestion.answer ? 'error.light' : 
                           'background.paper',
                }}
              />
            ))}
          </RadioGroup>
        </FormControl>
        
        {answerSubmitted && (
          <Box sx={{ mb: 3 }}>
            <Alert 
              severity={selectedOption === currentQuestion.answer ? "success" : "error"}
              icon={selectedOption === currentQuestion.answer ? <CheckCircleOutlineIcon /> : <HighlightOffIcon />}
            >
              <AlertTitle>
                {selectedOption === currentQuestion.answer ? "Correct!" : "Incorrect!"}
              </AlertTitle>
              <Button
                variant="text"
                color="inherit"
                onClick={toggleExplanation}
                size="small"
              >
                {showExplanation ? "Hide Explanation" : "Show Explanation"}
              </Button>
              {showExplanation && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {currentQuestion.explanation}
                </Typography>
              )}
            </Alert>
          </Box>
        )}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={resetQuiz}
          >
            Quit Quiz
          </Button>
          
          {!answerSubmitted ? (
            <Button 
              variant="contained" 
              onClick={handleSubmitAnswer}
              disabled={selectedOption === null}
            >
              Submit Answer
            </Button>
          ) : (
            <Button 
              variant="contained" 
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < quizQuestions[quizCategory].length - 1 ? 'Next Question' : 'See Results'}
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  const renderResults = () => {
    const percentage = calculatePercentage();
    
    return (
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Quiz Results
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 4 }}>
          <Box
            sx={{
              position: 'relative',
              display: 'inline-flex',
              mx: 2,
            }}
          >
            <CircularProgress
              variant="determinate"
              value={percentage}
              size={120}
              thickness={5}
              sx={{ 
                color: percentage >= 75 ? 'success.main' : 
                       percentage >= 50 ? 'warning.main' : 
                       'error.main' 
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography variant="h4" component="div" color="text.secondary">
                {`${Math.round(percentage)}%`}
              </Typography>
            </Box>
          </Box>
          
          <Box sx={{ textAlign: 'left', ml: 3 }}>
            <Typography variant="h6">
              Score: {score} / {quizQuestions[quizCategory].length}
            </Typography>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Time: {formatTime(timer)}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              Category: {quizCategory.charAt(0).toUpperCase() + quizCategory.slice(1)}
            </Typography>
          </Box>
        </Box>
        
        <Alert 
          severity={
            percentage >= 75 ? "success" : 
            percentage >= 50 ? "warning" : 
            "info"
          }
          sx={{ mb: 4 }}
        >
          <AlertTitle>Performance Assessment</AlertTitle>
          {getPerformanceMessage()}
        </Alert>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          <Button 
            variant="outlined" 
            onClick={() => {
              setQuizStarted(false);
              setQuizCompleted(false);
            }}
          >
            Change Category
          </Button>
          <Button 
            variant="contained" 
            onClick={startQuiz}
            startIcon={<EmojiEventsIcon />}
          >
            Try Again
          </Button>
        </Box>
      </Box>
    );
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Electrical Engineering Quiz Challenge
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Test your knowledge of electrical engineering concepts, circuit analysis, and electronic systems. 
        Select a category and challenge yourself with questions ranging from basic principles to advanced applications.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          aria-label="quiz tabs"
        >
          <Tab label="Quiz" {...a11yProps(0)} />
          <Tab label="Learning Resources" {...a11yProps(1)} />
        </Tabs>
      </Box>
      
      <TabPanel value={activeTab} index={0}>
        {!quizStarted && !quizCompleted && renderCategorySelection()}
        {quizStarted && !quizCompleted && renderQuiz()}
        {quizCompleted && renderResults()}
      </TabPanel>
      
      <TabPanel value={activeTab} index={1}>
        <Typography variant="h5" gutterBottom>
          Electrical Engineering Learning Resources
        </Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Basic Electrical Concepts
                </Typography>
                <Typography variant="body2" paragraph>
                  Resources to help you understand the fundamental principles of electrical engineering:
                </Typography>
                <ul>
                  <li>Ohm's Law and basic circuit analysis</li>
                  <li>Component characteristics (resistors, capacitors, inductors)</li>
                  <li>DC and AC circuit principles</li>
                  <li>Measurement units and conversions</li>
                </ul>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  View Resources
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Circuit Analysis Techniques
                </Typography>
                <Typography variant="body2" paragraph>
                  Learn methods for analyzing complex electrical circuits:
                </Typography>
                <ul>
                  <li>Kirchhoff's laws and node/mesh analysis</li>
                  <li>Thévenin and Norton equivalents</li>
                  <li>Superposition principle</li>
                  <li>Transfer functions and frequency response</li>
                </ul>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  View Resources
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Power Systems
                </Typography>
                <Typography variant="body2" paragraph>
                  Resources covering electrical power generation, transmission, and distribution:
                </Typography>
                <ul>
                  <li>Single-phase and three-phase systems</li>
                  <li>Transformers and power factor correction</li>
                  <li>Power quality and efficiency</li>
                  <li>Protection systems and safety</li>
                </ul>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  View Resources
                </Button>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Electronic Devices
                </Typography>
                <Typography variant="body2" paragraph>
                  Learn about semiconductor devices and their applications:
                </Typography>
                <ul>
                  <li>Diodes, transistors, and operational amplifiers</li>
                  <li>Digital logic circuits and microcontrollers</li>
                  <li>Power electronics and motor drives</li>
                  <li>Integrated circuits and VLSI design</li>
                </ul>
                <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                  View Resources
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        
        <Box sx={{ mt: 4, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            Video Tutorials and Interactive Simulations
          </Typography>
          <Typography variant="body2">
            Enhance your learning with our curated collection of video tutorials and interactive circuit
            simulations that demonstrate key electrical engineering concepts in action.
          </Typography>
          <Button variant="contained" sx={{ mt: 2 }}>
            Browse Learning Materials
          </Button>
        </Box>
      </TabPanel>
    </Paper>
  );
}

export default ElectricalEngineeringQuiz;