import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Slider,
  Divider,
  Alert,
  Card,
  CardContent,
  useTheme,
} from '@mui/material';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';

const mobilityTests = [
  {
    name: 'Overhead Squat Assessment',
    description: 'This test assesses your ankle mobility, hip mobility, thoracic spine mobility, and shoulder mobility all at once.',
    instructions: 'Stand with feet shoulder-width apart, arms extended overhead. Squat down as low as possible while keeping heels on the ground and arms overhead.',
    scoringCriteria: [
      'Can perform with perfect form (5)',
      'Minor compensation in upper body (4)',
      'Heels slightly rise or arms come forward (3)',
      'Significant compensation needed (2)',
      'Unable to complete the movement properly (1)',
    ],
  },
  {
    name: 'Shoulder Mobility Test',
    description: 'This test assesses the mobility of your shoulder joints and scapular movement.',
    instructions: 'Reach one arm behind your head and down your back, and the other arm behind your lower back and up. Try to touch fingers of both hands.',
    scoringCriteria: [
      'Fingers overlap by >1 inch (5)',
      'Fingers touch (4)',
      'Fingers are within 2 inches (3)',
      'Fingers are within 4 inches (2)',
      'Fingers are >4 inches apart (1)',
    ],
  },
  {
    name: 'Hip Hinge Assessment',
    description: 'This test evaluates your ability to hinge at the hips while maintaining a neutral spine.',
    instructions: 'Stand with feet hip-width apart. Bend forward from the hips while keeping your back straight and knees slightly bent.',
    scoringCriteria: [
      'Can hinge with perfect form to 90° (5)',
      'Can hinge to 75-90° with good form (4)',
      'Can hinge to 60-75° with minor rounding (3)',
      'Significant rounding of the back (2)',
      'Cannot perform proper hip hinge (1)',
    ],
  },
  {
    name: 'Ankle Mobility Test',
    description: 'This test evaluates dorsiflexion range of motion in your ankles.',
    instructions: 'Place foot 5 inches from wall. Keeping heel on ground, bend knee to touch wall. If successful, move foot back and repeat.',
    scoringCriteria: [
      'Can touch wall from >5 inches away (5)',
      'Can touch wall from 4-5 inches away (4)',
      'Can touch wall from 3-4 inches away (3)',
      'Can touch wall from 2-3 inches away (2)',
      'Cannot touch wall or heel rises (1)',
    ],
  },
  {
    name: 'Thoracic Rotation Test',
    description: 'This test assesses your mid-back rotation mobility.',
    instructions: 'Sit on a chair with knees together. Place a stick across your shoulders. Keeping hips stable, rotate your upper body to each side.',
    scoringCriteria: [
      'Can rotate >70° each side (5)',
      'Can rotate 55-70° each side (4)',
      'Can rotate 40-55° each side (3)',
      'Can rotate 30-40° each side (2)',
      'Can rotate <30° each side (1)',
    ],
  }
];

const mobilityScoreInterpretation = [
  {
    range: [21, 25],
    level: 'Excellent',
    description: 'You have exceptional mobility across all joints. Focus on maintaining this optimal level through regular mobility work and balanced training.',
    recommendations: [
      'Continue your current mobility practice',
      'Consider more advanced movement patterns',
      'Focus on skill-specific mobility for your sport or activity',
      'Implement a maintenance program 2-3 times per week'
    ]
  },
  {
    range: [16, 20],
    level: 'Good',
    description: 'You have good overall mobility with minor limitations. Address specific areas showing restrictions to prevent potential compensations.',
    recommendations: [
      'Focus on areas scoring 3 or lower',
      'Implement daily mobility drills for problem areas',
      'Consider addressing soft tissue restrictions with foam rolling',
      'Reassess every 4-6 weeks to track improvement'
    ]
  },
  {
    range: [11, 15],
    level: 'Average',
    description: 'You have moderate restrictions that may impact movement quality and performance. A structured mobility program is recommended.',
    recommendations: [
      'Implement a daily 15-minute mobility routine',
      'Address soft tissue quality with self-myofascial release techniques',
      'Consider working with a movement specialist',
      'Modify exercise selection to accommodate current limitations'
    ]
  },
  {
    range: [6, 10],
    level: 'Fair',
    description: 'You have significant movement restrictions that may increase injury risk and limit performance. Focused intervention is necessary.',
    recommendations: [
      'Prioritize mobility work before strength training',
      'Implement twice-daily mobility sessions (morning and evening)',
      'Consider bodywork from a professional (massage, physical therapy)',
      'Temporarily modify activities that stress restricted areas'
    ]
  },
  {
    range: [0, 5],
    level: 'Poor',
    description: 'You have severe mobility restrictions across multiple joints. Consult with a healthcare provider before beginning an intensive exercise program.',
    recommendations: [
      'Consult with a physical therapist or qualified movement specialist',
      'Focus on gentle, progressive mobility work',
      'Address basic daily movement patterns first',
      'Implement breathing exercises to improve movement quality'
    ]
  }
];

function MobilityAssessmentTool() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [scores, setScores] = useState({});
  const [showResults, setShowResults] = useState(false);
  
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  
  const handleScoreChange = (event, value) => {
    setScores({ ...scores, [activeStep]: value });
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
  };
  
  const calculateTotalScore = () => {
    try {
      const values = Object.values(scores);
      if (!values || values.length === 0) {
        return 0;
      }
      return values.reduce((sum, curr) => {
        // Make sure we're only adding numbers
        const numValue = Number(curr);
        return sum + (isNaN(numValue) ? 0 : numValue);
      }, 0);
    } catch (err) {
      console.error("Error calculating total score:", err);
      return 0;
    }
  };
  
  const getInterpretation = (score) => {
    if (typeof score !== 'number' || isNaN(score)) {
      // Handle invalid score
      return mobilityScoreInterpretation[2]; // Return "Average" range as default
    }
    
    // Find matching interpretation or default to "Average" if none found
    return mobilityScoreInterpretation.find(
      (item) => score >= item.range[0] && score <= item.range[1]
    ) || mobilityScoreInterpretation[2];
  };
  
  const isStepComplete = (step) => {
    return completed[step];
  };
  
  const handleComplete = () => {
    setShowResults(true);
  };
  
  const resetAssessment = () => {
    setActiveStep(0);
    setCompleted({});
    setScores({});
    setShowResults(false);
  };
  
  return (
    <Box sx={{ width: '100%' }} id="mobility-assessment-tool">
      <Paper 
        elevation={3} 
        sx={{ 
          p: 3, 
          mb: 4, 
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2 
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <AccessibilityNewIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h4" component="h2">
            Mobility Assessment Tool
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          This assessment evaluates key movement patterns to identify restrictions in joint mobility and movement quality. 
          Complete each test to receive a comprehensive mobility profile with personalized recommendations.
        </Typography>
        
        {!showResults ? (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {mobilityTests.map((test, index) => (
                <Step key={test.name} completed={isStepComplete(index)}>
                  <StepLabel>{test.name}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mb: 4 }}>
              <Paper sx={{ p: 3, bgcolor: theme.palette.background.default }} elevation={1}>
                <Typography variant="h5" gutterBottom>
                  {mobilityTests[activeStep].name}
                </Typography>
                <Typography variant="body2" paragraph color="text.secondary">
                  {mobilityTests[activeStep].description}
                </Typography>
                
                <Alert severity="info" sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Instructions:
                  </Typography>
                  <Typography variant="body2">
                    {mobilityTests[activeStep].instructions}
                  </Typography>
                </Alert>
                
                <Box sx={{ mt: 3 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Rate your performance:</FormLabel>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Slider
                          value={scores[activeStep] || 3}
                          onChange={handleScoreChange}
                          step={1}
                          marks
                          min={1}
                          max={5}
                          valueLabelDisplay="on"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">Difficult</Typography>
                          <Typography variant="caption" color="text.secondary">Excellent</Typography>
                        </Box>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Paper elevation={0} sx={{ p: 1.5, bgcolor: 'rgba(0,0,0,0.02)', borderRadius: 1 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            Scoring Criteria:
                          </Typography>
                          <Box component="ul" sx={{ pl: 2, m: 0 }}>
                            {mobilityTests[activeStep].scoringCriteria.map((criteria, idx) => (
                              <Typography
                                component="li"
                                variant="body2"
                                key={idx}
                                sx={{
                                  fontSize: '0.85rem',
                                  color: scores[activeStep] === 5 - idx ? 'primary.main' : 'text.secondary',
                                  fontWeight: scores[activeStep] === 5 - idx ? 'medium' : 'normal',
                                }}
                              >
                                {criteria}
                              </Typography>
                            ))}
                          </Box>
                        </Paper>
                      </Grid>
                    </Grid>
                  </FormControl>
                </Box>
              </Paper>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                color="inherit"
                disabled={activeStep === 0}
                onClick={handleBack}
                sx={{ mr: 1 }}
              >
                Back
              </Button>
              <div>
                {activeStep === mobilityTests.length - 1 ? (
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleComplete}
                    disabled={Object.keys(completed).length < mobilityTests.length}
                  >
                    View Results
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                    disabled={!isStepComplete(activeStep)}
                  >
                    Next
                  </Button>
                )}
              </div>
            </Box>
          </>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              Mobility Assessment Results
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h3" align="center" color="primary" gutterBottom>
                      {calculateTotalScore()}/25
                    </Typography>
                    <Typography variant="h6" align="center" gutterBottom>
                      {getInterpretation(calculateTotalScore())?.level || 'Average'} Mobility
                    </Typography>
                    <Typography variant="body2" paragraph>
                      {getInterpretation(calculateTotalScore())?.description || 'You have moderate mobility that could be improved with a structured mobility program.'}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={8}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Individual Test Results
                    </Typography>
                    <Box sx={{ mb: 3 }}>
                      {mobilityTests.map((test, index) => (
                        <Box key={index} sx={{ mb: 1.5 }}>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1">{test.name}</Typography>
                            <Box 
                              sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                bgcolor: scores[index] > 3 ? 'success.light' : scores[index] < 3 ? 'error.light' : 'warning.light',
                                color: scores[index] > 3 ? 'success.contrastText' : scores[index] < 3 ? 'error.contrastText' : 'warning.contrastText',
                                borderRadius: '50%',
                                width: 32,
                                height: 32,
                                justifyContent: 'center'
                              }}
                            >
                              <Typography variant="body2" fontWeight="bold">
                                {scores[index]}
                              </Typography>
                            </Box>
                          </Box>
                          <Box 
                            sx={{ 
                              mt: 0.5, 
                              height: 6, 
                              borderRadius: 3, 
                              bgcolor: 'grey.200',
                              overflow: 'hidden'
                            }}
                          >
                            <Box 
                              sx={{ 
                                height: '100%', 
                                width: `${(scores[index] / 5) * 100}%`,
                                bgcolor: scores[index] > 3 ? 'success.main' : scores[index] < 3 ? 'error.main' : 'warning.main',
                              }}
                            />
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Recommended Mobility Program
              </Typography>
              <Paper sx={{ p: 3 }} elevation={1}>
                <Typography variant="subtitle1" paragraph>
                  Based on your score of {calculateTotalScore()}, we recommend the following:
                </Typography>
                
                <Box component="ul" sx={{ pl: 2 }}>
                  {getInterpretation(calculateTotalScore())?.recommendations?.map((rec, index) => (
                    <Typography component="li" variant="body1" key={index} paragraph>
                      {rec}
                    </Typography>
                  )) || (
                    <Typography component="li" variant="body1" paragraph>
                      Implement a daily 15-minute mobility routine focusing on problem areas.
                    </Typography>
                  )}
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Focus Areas for Improvement:
                </Typography>
                
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {mobilityTests.map((test, index) => {
                    if (scores[index] <= 3) {
                      return (
                        <Grid item xs={12} md={6} key={index}>
                          <Paper 
                            sx={{ 
                              p: 2, 
                              bgcolor: 'rgba(0,0,0,0.02)', 
                              border: '1px solid rgba(0,0,0,0.09)',
                              borderRadius: 1
                            }} 
                            elevation={0}
                          >
                            <Typography variant="subtitle2" color="primary" gutterBottom>
                              {test.name} (Score: {scores[index]})
                            </Typography>
                            <Typography variant="body2" paragraph>
                              Your score indicates limited mobility in this area. Focus on specific exercises that target this movement pattern.
                            </Typography>
                            <Button 
                              size="small" 
                              variant="outlined" 
                              sx={{ mt: 1 }}
                              disabled
                            >
                              View Targeted Exercises (Coming Soon)
                            </Button>
                          </Paper>
                        </Grid>
                      );
                    }
                    return null;
                  })}
                </Grid>
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={resetAssessment}
                    startIcon={<AccessibilityNewIcon />}
                  >
                    Retake Assessment
                  </Button>
                  <Button 
                    sx={{ ml: 2 }}
                    variant="outlined"
                    disabled
                  >
                    Download Detailed Report (Coming Soon)
                  </Button>
                </Box>
              </Paper>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default MobilityAssessmentTool;