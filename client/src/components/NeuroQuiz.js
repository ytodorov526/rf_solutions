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
    correctAnswer: "Cerebellum",
    explanation: "The cerebellum is responsible for fine-tuning motor activity, balance, and coordination."
  },
  {
    question: "What is the main function of the occipital lobe?",
    options: [
      "Hearing",
      "Vision",
      "Memory",
      "Language"
    ],
    correctAnswer: "Vision",
    explanation: "The occipital lobe is primarily responsible for processing visual information."
  },
  {
    question: "Which structure connects the left and right hemispheres of the brain?",
    options: [
      "Corpus callosum",
      "Pituitary gland",
      "Medulla oblongata",
      "Pons"
    ],
    correctAnswer: "Corpus callosum",
    explanation: "The corpus callosum is a thick band of nerve fibers that connects the two cerebral hemispheres, allowing communication between them."
  },
  {
    question: "What is the primary function of the temporal lobe?",
    options: [
      "Visual processing",
      "Auditory processing and memory",
      "Motor control",
      "Sensory processing"
    ],
    correctAnswer: "Auditory processing and memory",
    explanation: "The temporal lobe is involved in auditory perception, language comprehension, and memory formation."
  },
  {
    question: "Which neurotransmitter is most closely associated with the reward system in the brain?",
    options: [
      "Dopamine",
      "Serotonin",
      "GABA",
      "Acetylcholine"
    ],
    correctAnswer: "Dopamine",
    explanation: "Dopamine is a key neurotransmitter in the brain's reward and pleasure pathways."
  },
  {
    question: "Which part of the neuron receives incoming signals?",
    options: [
      "Dendrites",
      "Axon",
      "Myelin sheath",
      "Node of Ranvier"
    ],
    correctAnswer: "Dendrites",
    explanation: "Dendrites are tree-like extensions at the beginning of a neuron that help receive signals from other neurons."
  },
  {
    question: "Which disease is characterized by the progressive loss of dopamine-producing neurons in the substantia nigra?",
    options: [
      "Alzheimer's disease",
      "Parkinson's disease",
      "Multiple sclerosis",
      "Epilepsy"
    ],
    correctAnswer: "Parkinson's disease",
    explanation: "Parkinson's disease is caused by the degeneration of dopamine-producing neurons in the substantia nigra, leading to motor symptoms."
  },
  {
    question: "What is the function of the blood-brain barrier?",
    options: [
      "To protect the brain from toxins and pathogens",
      "To transmit electrical signals",
      "To produce cerebrospinal fluid",
      "To regulate body temperature"
    ],
    correctAnswer: "To protect the brain from toxins and pathogens",
    explanation: "The blood-brain barrier is a selective barrier that prevents many substances from entering the brain, protecting it from toxins and pathogens."
  },
  {
    question: "Which lobe of the brain is primarily responsible for decision-making and problem-solving?",
    options: [
      "Frontal lobe",
      "Parietal lobe",
      "Temporal lobe",
      "Occipital lobe"
    ],
    correctAnswer: "Frontal lobe",
    explanation: "The frontal lobe is involved in executive functions such as decision-making, problem-solving, and planning."
  },
  {
    question: "Which glial cell type forms myelin in the central nervous system?",
    options: [
      "Oligodendrocytes",
      "Schwann cells",
      "Astrocytes",
      "Microglia"
    ],
    correctAnswer: "Oligodendrocytes",
    explanation: "Oligodendrocytes form the myelin sheath around axons in the central nervous system."
  },
  {
    question: "Which brain region is essential for forming new long-term memories?",
    options: [
      "Hippocampus",
      "Amygdala",
      "Cerebellum",
      "Hypothalamus"
    ],
    correctAnswer: "Hippocampus",
    explanation: "The hippocampus is crucial for the formation of new long-term memories."
  },
  {
    question: "What is the main inhibitory neurotransmitter in the adult brain?",
    options: [
      "GABA",
      "Glutamate",
      "Dopamine",
      "Serotonin"
    ],
    correctAnswer: "GABA",
    explanation: "GABA (gamma-aminobutyric acid) is the main inhibitory neurotransmitter in the adult brain."
  },
  {
    question: "Which disorder is characterized by recurrent seizures?",
    options: [
      "Epilepsy",
      "Parkinson's disease",
      "Huntington's disease",
      "ALS"
    ],
    correctAnswer: "Epilepsy",
    explanation: "Epilepsy is a neurological disorder marked by recurrent, unprovoked seizures."
  },
  {
    question: "Which part of the brain regulates basic life functions such as breathing and heart rate?",
    options: [
      "Medulla oblongata",
      "Cerebellum",
      "Thalamus",
      "Frontal lobe"
    ],
    correctAnswer: "Medulla oblongata",
    explanation: "The medulla oblongata controls vital autonomic functions such as breathing, heart rate, and blood pressure."
  },
  {
    question: "Which structure is known as the 'emotional center' of the brain?",
    options: [
      "Amygdala",
      "Hippocampus",
      "Cerebellum",
      "Pineal gland"
    ],
    correctAnswer: "Amygdala",
    explanation: "The amygdala is involved in processing emotions such as fear, anger, and pleasure."
  },
  {
    question: "Which ion is most important for the generation of action potentials in neurons?",
    options: [
      "Sodium (Na+)",
      "Calcium (Ca2+)",
      "Potassium (K+)",
      "Chloride (Cl-)"
    ],
    correctAnswer: "Sodium (Na+)",
    explanation: "The influx of sodium ions is crucial for the depolarization phase of the action potential."
  },
  {
    question: "Which disease is associated with plaques and tangles in the brain?",
    options: [
      "Alzheimer's disease",
      "Parkinson's disease",
      "Multiple sclerosis",
      "Epilepsy"
    ],
    correctAnswer: "Alzheimer's disease",
    explanation: "Alzheimer's disease is characterized by amyloid plaques and neurofibrillary tangles in the brain."
  },
  {
    question: "Which part of the brain is responsible for processing sensory information from the body?",
    options: [
      "Parietal lobe",
      "Frontal lobe",
      "Temporal lobe",
      "Occipital lobe"
    ],
    correctAnswer: "Parietal lobe",
    explanation: "The parietal lobe processes sensory information such as touch, temperature, and pain."
  },
  {
    question: "Which neurotransmitter is deficient in people with depression?",
    options: [
      "Serotonin",
      "Dopamine",
      "Acetylcholine",
      "Glutamate"
    ],
    correctAnswer: "Serotonin",
    explanation: "Low levels of serotonin are commonly associated with depression."
  },
  {
    question: "Which part of the nervous system controls the 'fight or flight' response?",
    options: [
      "Sympathetic nervous system",
      "Parasympathetic nervous system",
      "Somatic nervous system",
      "Central nervous system"
    ],
    correctAnswer: "Sympathetic nervous system",
    explanation: "The sympathetic nervous system prepares the body for stressful or emergency situations (fight or flight)."
  }
];

const NeuroQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (event) => {
    setSelectedAnswer(event.target.value);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    setShowExplanation(false);
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer('');
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = () => {
    setShowExplanation(true);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer('');
    setScore(0);
    setShowResults(false);
    setShowExplanation(false);
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
                  disabled={showExplanation}
                />
              ))}
            </RadioGroup>
          </FormControl>
          {showExplanation && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" color={selectedAnswer === questions[currentQuestion].correctAnswer ? 'success.main' : 'error.main'}>
                {selectedAnswer === questions[currentQuestion].correctAnswer ? 'Correct!' : 'Incorrect.'}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {questions[currentQuestion].explanation}
              </Typography>
            </Box>
          )}
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            {!showExplanation ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={!selectedAnswer}
              >
                Submit
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNextQuestion}
              >
                {currentQuestion + 1 === questions.length ? 'Finish' : 'Next'}
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default NeuroQuiz; 