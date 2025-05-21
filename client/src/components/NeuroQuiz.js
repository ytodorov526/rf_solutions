import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Container,
  Paper,
} from '@mui/material';

const questions = [
  {
    question: "Which part of the brain is responsible for motor control and coordination?",
    options: [
      "Cerebellum",
      "Hippocampus",
      "Amygdala",
      "Thalamus"
    ],
    correctAnswer: "Cerebellum"
  },
  {
    question: "What is the main function of the occipital lobe?",
    options: [
      "Hearing",
      "Vision",
      "Memory",
      "Language"
    ],
    correctAnswer: "Vision"
  },
  {
    question: "Which structure connects the left and right hemispheres of the brain?",
    options: [
      "Corpus callosum",
      "Pituitary gland",
      "Medulla oblongata",
      "Pons"
    ],
    correctAnswer: "Corpus callosum"
  },
  {
    question: "What is the primary function of the temporal lobe?",
    options: [
      "Visual processing",
      "Auditory processing and memory",
      "Motor control",
      "Sensory processing"
    ],
    correctAnswer: "Auditory processing and memory"
  }
];

const NeuroQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setShowResults(false);
  };

  if (showResults) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            Quiz Complete!
          </Typography>
          <Typography variant="h5" gutterBottom>
            Your Score: {score} out of {questions.length}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={handleRestart}
            sx={{ mt: 2 }}
          >
            Restart Quiz
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Question {currentQuestion + 1} of {questions.length}
          </Typography>
          <Typography variant="h6" gutterBottom>
            {questions[currentQuestion].question}
          </Typography>
          <FormControl component="fieldset">
            <FormLabel component="legend">Select your answer:</FormLabel>
            <RadioGroup
              value={selectedAnswer}
              onChange={handleAnswerSelect}
            >
              {questions[currentQuestion].options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextQuestion}
              disabled={!selectedAnswer}
            >
              {currentQuestion + 1 === questions.length ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NeuroQuiz; 