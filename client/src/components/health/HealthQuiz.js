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
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SchoolIcon from '@mui/icons-material/School';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

// Quiz questions
const quizQuestions = [
  {
    id: 1,
    category: "Biomarkers",
    question: "Which of the following blood tests is most closely associated with inflammation in the body?",
    options: [
      "Alanine aminotransferase (ALT)",
      "High-density lipoprotein (HDL)",
      "C-reactive protein (CRP)",
      "Hemoglobin A1c (HbA1c)"
    ],
    correctAnswer: 2,
    explanation: "C-reactive protein (CRP) is a protein made by the liver that increases in the blood in response to inflammation. It's used as a marker of inflammation and can be elevated in various conditions including infections, autoimmune disorders, and cardiovascular disease."
  },
  {
    id: 2,
    category: "Biomarkers",
    question: "What does Hemoglobin A1c (HbA1c) measure?",
    options: [
      "Iron levels in the blood",
      "Average blood glucose over the past ~3 months",
      "Oxygen-carrying capacity of blood",
      "Current blood glucose level"
    ],
    correctAnswer: 1,
    explanation: "Hemoglobin A1c (HbA1c) measures the average blood glucose levels over approximately the past 3 months. It reflects the percentage of hemoglobin proteins in your blood that are glycated (have glucose attached to them), which occurs in proportion to the amount of glucose in your bloodstream over time."
  },
  {
    id: 3,
    category: "Cardiovascular Health",
    question: "Which ratio is considered one of the best predictors of cardiovascular risk?",
    options: [
      "Total cholesterol to HDL ratio",
      "Systolic to diastolic blood pressure ratio",
      "LDL to triglycerides ratio",
      "BMI to waist circumference ratio"
    ],
    correctAnswer: 0,
    explanation: "The total cholesterol to HDL ratio is considered one of the best predictors of cardiovascular risk. A lower ratio indicates lower risk. Ideally, this ratio should be below 3.5:1, with optimal being closer to 2:1."
  },
  {
    id: 4,
    category: "Nutrition",
    question: "Which of the following nutrients has been most consistently associated with reduced inflammation?",
    options: [
      "Saturated fats",
      "Simple carbohydrates",
      "Omega-3 fatty acids",
      "Sodium"
    ],
    correctAnswer: 2,
    explanation: "Omega-3 fatty acids, found in fatty fish, flaxseeds, walnuts, and some algae, have been consistently associated with reduced inflammation. They help produce anti-inflammatory compounds and can help balance the pro-inflammatory effects of omega-6 fatty acids in the diet."
  },
  {
    id: 5,
    category: "Metabolism",
    question: "What is metabolic syndrome?",
    options: [
      "A rare genetic disorder affecting metabolism",
      "A cluster of conditions that increase risk of heart disease, stroke, and diabetes",
      "The process by which the body converts food into energy",
      "A condition characterized by extremely fast metabolism"
    ],
    correctAnswer: 1,
    explanation: "Metabolic syndrome is a cluster of conditions occurring together, including increased blood pressure, high blood sugar, excess body fat around the waist, and abnormal cholesterol or triglyceride levels. These conditions together increase the risk of heart disease, stroke, and type 2 diabetes."
  },
  {
    id: 6,
    category: "Biological Aging",
    question: "Which of the following factors is NOT typically associated with accelerated biological aging?",
    options: [
      "Chronic inflammation",
      "Regular moderate-intensity exercise",
      "Chronic psychological stress",
      "Poor sleep quality"
    ],
    correctAnswer: 1,
    explanation: "Regular moderate-intensity exercise is actually associated with slowed biological aging and is protective against age-related diseases. The other factors listed—chronic inflammation, chronic psychological stress, and poor sleep quality—are all associated with accelerated biological aging."
  },
  {
    id: 7,
    category: "Sleep Health",
    question: "Which hormone, critical for sleep regulation, is produced in the pineal gland in response to darkness?",
    options: [
      "Cortisol",
      "Insulin",
      "Melatonin",
      "Adrenaline"
    ],
    correctAnswer: 2,
    explanation: "Melatonin is produced by the pineal gland in response to darkness and is critical for sleep regulation. It helps control your sleep-wake cycles (circadian rhythms) and signals to your body that it's time to sleep when levels rise in the evening."
  },
  {
    id: 8,
    category: "Hormones",
    question: "Which of the following hormones is primarily responsible for the body's stress response?",
    options: [
      "Insulin",
      "Estrogen",
      "Melatonin",
      "Cortisol"
    ],
    correctAnswer: 3,
    explanation: "Cortisol is the primary hormone responsible for the body's stress response. It's produced by the adrenal glands and helps regulate metabolism, reduce inflammation, and control blood sugar levels. Chronically elevated cortisol can have negative health effects including weight gain, high blood pressure, and impaired immune function."
  },
  {
    id: 9,
    category: "Exercise Physiology",
    question: "What is VO2 max a measure of?",
    options: [
      "Lung capacity",
      "Maximum heart rate",
      "Maximum oxygen uptake during exercise",
      "Breathing efficiency"
    ],
    correctAnswer: 2,
    explanation: "VO2 max is a measure of the maximum amount of oxygen a person can utilize during intense exercise. It's a good indicator of cardiovascular fitness and aerobic endurance. A higher VO2 max generally indicates better fitness and is associated with lower risk of chronic diseases."
  },
  {
    id: 10,
    category: "Nutrition",
    question: "Which vitamin is primarily synthesized in the skin upon exposure to sunlight?",
    options: [
      "Vitamin A",
      "Vitamin C",
      "Vitamin D",
      "Vitamin E"
    ],
    correctAnswer: 2,
    explanation: "Vitamin D is primarily synthesized in the skin upon exposure to UVB rays from sunlight. When your skin is exposed to sunlight, it makes vitamin D from cholesterol. Adequate vitamin D is essential for bone health, immune function, and may play roles in mood regulation and reducing inflammation."
  },
  {
    id: 11,
    category: "Biomarkers",
    question: "Which of the following is NOT a commonly used biomarker for assessing liver function?",
    options: [
      "ALT (Alanine aminotransferase)",
      "AST (Aspartate aminotransferase)",
      "GGT (Gamma-glutamyl transferase)",
      "CRP (C-reactive protein)"
    ],
    correctAnswer: 3,
    explanation: "CRP (C-reactive protein) is not a liver function biomarker but rather an inflammatory marker. ALT, AST, and GGT are all enzymes found in liver cells that can be released into the bloodstream when the liver is damaged, making them useful indicators of liver function and health."
  },
  {
    id: 12,
    category: "Metabolism",
    question: "Which of the following best describes insulin resistance?",
    options: [
      "A condition where the body doesn't produce enough insulin",
      "A condition where cells don't respond properly to insulin signals",
      "A condition where the body produces too much insulin",
      "The normal state of insulin functioning in the body"
    ],
    correctAnswer: 1,
    explanation: "Insulin resistance is a condition where cells don't respond properly to insulin signals. This leads to the pancreas producing more insulin to overcome the resistance, resulting in high insulin levels. Over time, this can progress to prediabetes and type 2 diabetes as the pancreas becomes unable to keep up with demand."
  },
  {
    id: 13,
    category: "Cardiovascular Health",
    question: "Which of the following blood pressure readings would be classified as hypertensive according to current guidelines?",
    options: [
      "115/75 mmHg",
      "120/80 mmHg",
      "130/85 mmHg",
      "140/90 mmHg"
    ],
    correctAnswer: 3,
    explanation: "According to current guidelines, a blood pressure reading of 140/90 mmHg or higher is classified as hypertension (high blood pressure). Readings between 130-139/80-89 mmHg are considered stage 1 hypertension, while 120-129/<80 mmHg is considered elevated blood pressure. Normal blood pressure is below 120/80 mmHg."
  },
  {
    id: 14,
    category: "Biological Aging",
    question: "Which of the following is considered a biomarker of cellular aging?",
    options: [
      "Telomere length",
      "Red blood cell count",
      "Body mass index",
      "Creatinine clearance"
    ],
    correctAnswer: 0,
    explanation: "Telomere length is considered a biomarker of cellular aging. Telomeres are protective caps at the ends of chromosomes that shorten with each cell division. Shorter telomeres are associated with cellular aging and age-related diseases, while longer telomeres are associated with longevity and better health outcomes."
  },
  {
    id: 15,
    category: "Nutrition",
    question: "What is the primary function of dietary fiber?",
    options: [
      "Provide energy for the body",
      "Build and repair muscle tissue",
      "Support digestive health and regulate blood sugar and cholesterol",
      "Act as a primary source of essential vitamins"
    ],
    correctAnswer: 2,
    explanation: "The primary function of dietary fiber is to support digestive health and regulate blood sugar and cholesterol levels. Unlike other carbohydrates, fiber is not digested and absorbed, but passes through the digestive system, promoting regularity, feeding beneficial gut bacteria, and helping to control hunger, blood sugar, and cholesterol levels."
  }
];

const HealthQuiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [quizStarted, setQuizStarted] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [showScoreDialog, setShowScoreDialog] = useState(false);
  
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  // Shuffle questions and take the first 10
  useEffect(() => {
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    setShuffledQuestions(shuffled);
  }, []);

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
    // Reshuffle questions
    const shuffled = [...quizQuestions].sort(() => 0.5 - Math.random()).slice(0, 10);
    setShuffledQuestions(shuffled);
    
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
    
    if (percentage >= 90) return "Excellent! You have an outstanding knowledge of health biomarkers and wellness concepts!";
    if (percentage >= 80) return "Great job! You have a very good understanding of health and biomarkers!";
    if (percentage >= 70) return "Good work! You have a solid understanding of health concepts!";
    if (percentage >= 60) return "Not bad! You have a basic grasp of health biomarkers, but there's room to expand your knowledge.";
    return "You might benefit from learning more about health biomarkers and wellness concepts. Keep exploring!";
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
          <SchoolIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
          <Typography variant="h4" component="h2">
            Health Knowledge Quiz
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Test your knowledge about health biomarkers, biological aging, and wellness concepts with this interactive quiz.
        </Typography>
        
        <Box sx={{ my: 4, p: 3, bgcolor: 'primary.light', color: 'primary.contrastText', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Quiz Overview:
          </Typography>
          <ul>
            <li>
              <Typography variant="body1">10 questions on health biomarkers and wellness concepts</Typography>
            </li>
            <li>
              <Typography variant="body1">Categories include biomarkers, metabolism, nutrition, and more</Typography>
            </li>
            <li>
              <Typography variant="body1">Detailed explanations for each question</Typography>
            </li>
            <li>
              <Typography variant="body1">Score summary at the end</Typography>
            </li>
          </ul>
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
          Thank you for completing the health knowledge quiz!
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
                    bgcolor: answeredQuestions.has(index) && shuffledQuestions[index].correctAnswer === answeredQuestions[index] 
                      ? 'success.main' 
                      : 'error.main',
                    color: 'white'
                  }}
                >
                  {answeredQuestions.has(index) && shuffledQuestions[index].correctAnswer === answeredQuestions[index] 
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

export default HealthQuiz;