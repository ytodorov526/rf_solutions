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
  FormLabel,
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

// Quiz data
const quizData = {
  beginner: [
    {
      question: "What is the main purpose of a crude oil distillation unit?",
      options: [
        "To break long hydrocarbon chains into shorter ones",
        "To separate crude oil into fractions based on boiling points",
        "To remove sulfur from petroleum products",
        "To increase the octane number of gasoline"
      ],
      correctAnswer: 1,
      explanation: "Crude oil distillation units separate the incoming crude oil into fractions based on their different boiling point ranges. This physical separation process is the first step in refining."
    },
    {
      question: "Which petroleum fraction has the lowest boiling point range?",
      options: [
        "Diesel fuel",
        "Kerosene",
        "Gasoline",
        "LPG (Liquefied Petroleum Gas)"
      ],
      correctAnswer: 3,
      explanation: "LPG components like propane and butane have the lowest boiling points among common petroleum fractions, boiling below 0°C at atmospheric pressure."
    },
    {
      question: "What does the term 'cracking' refer to in petroleum refining?",
      options: [
        "Breaking larger hydrocarbon molecules into smaller ones",
        "Combining small hydrocarbon molecules into larger ones",
        "Removing impurities from petroleum products",
        "Fracturing the distillation column due to excessive pressure"
      ],
      correctAnswer: 0,
      explanation: "Cracking is a process that breaks down complex hydrocarbon molecules into simpler, lighter molecules. It's used to convert heavy fractions into more valuable lighter products."
    },
    {
      question: "Which of these is NOT typically a product of a petroleum refinery?",
      options: [
        "Jet fuel",
        "Asphalt",
        "Polyethylene plastic",
        "Kerosene"
      ],
      correctAnswer: 2,
      explanation: "Polyethylene plastic is a petrochemical product made from ethylene, which is produced from refinery products. However, the actual plastic production occurs in petrochemical plants, not directly in refineries."
    },
    {
      question: "What is the function of a catalytic reformer in a refinery?",
      options: [
        "To remove sulfur compounds",
        "To convert straight-chain hydrocarbons to branched and cyclic compounds",
        "To increase the viscosity of lubricating oils",
        "To reduce emissions from the refinery"
      ],
      correctAnswer: 1,
      explanation: "Catalytic reformers convert low-octane straight-chain hydrocarbons (paraffins) into higher-octane branched-chain and cyclic hydrocarbons (aromatics and isoparaffins), which are valuable for gasoline blending."
    }
  ],
  intermediate: [
    {
      question: "What is the typical temperature range of a crude oil atmospheric distillation tower?",
      options: [
        "20-100°C",
        "100-200°C",
        "40-370°C",
        "400-600°C"
      ],
      correctAnswer: 2,
      explanation: "An atmospheric distillation tower typically operates with a temperature gradient from about 40°C at the top to around 370°C at the bottom, allowing different fractions to be separated based on their boiling points."
    },
    {
      question: "Which refinery process produces the most hydrogen?",
      options: [
        "Catalytic cracking",
        "Catalytic reforming",
        "Hydrocracking",
        "Visbreaking"
      ],
      correctAnswer: 1,
      explanation: "Catalytic reforming produces significant amounts of hydrogen as a byproduct when converting naphtha into higher-octane reformate for gasoline blending."
    },
    {
      question: "What is the purpose of a vacuum distillation unit?",
      options: [
        "To prevent oxygen from entering the distillation process",
        "To distill heat-sensitive materials",
        "To further separate atmospheric residue into useful fractions",
        "To remove trace metals from feedstocks"
      ],
      correctAnswer: 2,
      explanation: "Vacuum distillation operates under reduced pressure to lower the boiling points of components in the atmospheric residue, allowing them to be separated without thermal cracking that would occur at their normal atmospheric boiling points."
    },
    {
      question: "Which process would be used to convert C3 and C4 olefins into high-octane gasoline blending components?",
      options: [
        "Alkylation",
        "Isomerization",
        "Polymerization",
        "Etherification"
      ],
      correctAnswer: 0,
      explanation: "Alkylation combines light olefins (typically propylene and butylenes) with isobutane to produce highly branched, high-octane alkylate for gasoline blending."
    },
    {
      question: "What happens to the Reid Vapor Pressure (RVP) of gasoline when ethanol is blended in?",
      options: [
        "It decreases linearly with ethanol percentage",
        "It increases",
        "It remains unchanged",
        "It initially increases then decreases with higher percentages"
      ],
      correctAnswer: 1,
      explanation: "Adding ethanol to gasoline increases the Reid Vapor Pressure (RVP) due to non-ideal mixing behavior, making the mixture more volatile than expected based on the RVP of the individual components."
    }
  ],
  advanced: [
    {
      question: "What catalyst poison is most problematic for platinum catalysts in reforming units?",
      options: [
        "Oxygen",
        "Sulfur",
        "Water",
        "Nitrogen compounds"
      ],
      correctAnswer: 1,
      explanation: "Sulfur is a significant poison for platinum-based reforming catalysts, leading to deactivation by blocking active sites. Reformer feed is typically hydrotreated to remove sulfur compounds before entering the reforming unit."
    },
    {
      question: "What is the primary function of MTBE or ethanol in gasoline blending?",
      options: [
        "To reduce particulate emissions",
        "To increase octane rating",
        "To prevent freezing in cold weather",
        "To reduce fuel cost"
      ],
      correctAnswer: 1,
      explanation: "MTBE (methyl tert-butyl ether) and ethanol are primarily used as octane boosters in gasoline. They also serve as oxygenates that help reduce carbon monoxide emissions, but their main purpose in blending is to increase octane rating."
    },
    {
      question: "In a crude distillation unit, what is the primary purpose of using pump-around loops?",
      options: [
        "To maintain pressure in the column",
        "To provide additional reflux",
        "To remove heat from the column",
        "To increase separation efficiency without adding more trays"
      ],
      correctAnswer: 2,
      explanation: "Pump-around loops in distillation columns remove heat from intermediate points in the tower and return cooled liquid to a higher point. This helps manage the heat load in the column and reduces the condenser duty at the top."
    },
    {
      question: "What causes FCCU catalyst deactivation over time?",
      options: [
        "Carbon deposition (coking)",
        "Hydrothermal damage to zeolite structure",
        "Metal contamination (especially nickel and vanadium)",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Fluid Catalytic Cracking Unit (FCCU) catalyst deactivation occurs due to multiple mechanisms: coking (carbon deposition), structural damage from high-temperature steam exposure, and metals (especially nickel and vanadium) from the feed that deposit on the catalyst and promote undesirable reactions."
    },
    {
      question: "What property makes heavy crude oils more challenging and less valuable to refine?",
      options: [
        "Higher sulfur content",
        "Lower API gravity",
        "Higher metal content",
        "All of the above"
      ],
      correctAnswer: 3,
      explanation: "Heavy crude oils are challenging to refine because they typically have higher sulfur content (requiring more hydrotreating), lower API gravity (requiring more energy to process), and higher metal content (causing catalyst poisoning). These characteristics require more complex and expensive refining processes."
    }
  ]
};

function PetrochemicalQuiz() {
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
        message: "Excellent! You have a strong understanding of petrochemical concepts.",
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
          Petrochemical Engineering Quiz
        </Typography>
        <Typography variant="body1" align="center" color="textSecondary" paragraph sx={{ mb: 4 }}>
          Test your knowledge of refinery operations, petrochemical processes, and more.
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <Box sx={{ maxWidth: 700, width: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Select Difficulty Level:
            </Typography>
            
            <Grid container spacing={3}>
              <DifficultyCard 
                title="Beginner"
                description="Basic concepts of refining, distillation, and petroleum products"
                onSelect={() => handleSelectDifficulty('beginner')}
                color="#4caf50"
              />
              
              <DifficultyCard 
                title="Intermediate"
                description="Refinery processes, operations, and product specifications"
                onSelect={() => handleSelectDifficulty('intermediate')}
                color="#2196f3"
              />
              
              <DifficultyCard 
                title="Advanced"
                description="Complex refining chemistry, catalysts, and engineering challenges"
                onSelect={() => handleSelectDifficulty('advanced')}
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
    <Box sx={{ width: '33.33%', px: 1, mb: 2 }}>
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

export default PetrochemicalQuiz;