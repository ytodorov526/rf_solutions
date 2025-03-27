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
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Card,
  CardContent,
  CircularProgress,
  useTheme,
  FormHelperText,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Rating,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import TimerIcon from '@mui/icons-material/Timer';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

// Fitness assessment test definitions
const fitnessTests = [
  {
    id: 'cardio',
    name: 'Cardiovascular Fitness',
    description: 'Assess your cardiovascular endurance using the step test or your known VO2 max.',
    icon: <MonitorHeartIcon fontSize="large" />,
    fields: [
      {
        name: 'cardioTestType',
        label: 'Assessment Method',
        type: 'select',
        options: [
          { value: 'step', label: '3-Minute Step Test' },
          { value: 'known', label: 'Known VO2 Max' }
        ],
        default: 'step'
      },
      {
        name: 'restingHeartRate',
        label: 'Resting Heart Rate (bpm)',
        type: 'number',
        required: true,
        min: 30,
        max: 120,
        default: '',
        hint: 'Your heart rate when completely at rest'
      },
      {
        name: 'recoveryHeartRate',
        label: 'Recovery Heart Rate (bpm)',
        type: 'number',
        required: (values) => values.cardioTestType === 'step',
        min: 40,
        max: 200,
        default: '',
        hint: 'Heart rate measured immediately after the step test'
      },
      {
        name: 'vo2Max',
        label: 'VO2 Max (ml/kg/min)',
        type: 'number',
        required: (values) => values.cardioTestType === 'known',
        min: 10,
        max: 80,
        default: '',
        hint: 'If you know your VO2 max from a previous test'
      },
    ]
  },
  {
    id: 'strength',
    name: 'Muscular Strength & Endurance',
    description: 'Assess your muscular strength and endurance with simple bodyweight exercises.',
    icon: <FitnessCenterIcon fontSize="large" />,
    fields: [
      {
        name: 'pushUps',
        label: 'Push-Ups (max number)',
        type: 'number',
        required: true,
        min: 0,
        max: 100,
        default: '',
        hint: 'Maximum number of push-ups you can perform with proper form'
      },
      {
        name: 'sitUps',
        label: 'Sit-Ups in 1 minute',
        type: 'number',
        required: true,
        min: 0,
        max: 100,
        default: '',
        hint: 'Number of sit-ups completed in 60 seconds'
      },
      {
        name: 'plankTime',
        label: 'Plank Hold Time (seconds)',
        type: 'number',
        required: true,
        min: 0,
        max: 300,
        default: '',
        hint: 'Maximum time you can hold a proper plank position'
      },
      {
        name: 'squats',
        label: 'Bodyweight Squats in 1 minute',
        type: 'number',
        required: false,
        min: 0,
        max: 100,
        default: '',
        hint: 'Number of bodyweight squats completed in 60 seconds (optional)'
      }
    ]
  },
  {
    id: 'flexibility',
    name: 'Flexibility Assessment',
    description: 'Assess your flexibility and joint range of motion.',
    icon: <DirectionsRunIcon fontSize="large" />,
    fields: [
      {
        name: 'sitAndReach',
        label: 'Sit and Reach (cm)',
        type: 'number',
        required: true,
        min: -30,
        max: 40,
        default: '',
        hint: 'Distance reached in cm (negative if you cannot reach your toes)'
      },
      {
        name: 'shoulderFlexibility',
        label: 'Shoulder Flexibility',
        type: 'rating',
        required: true,
        min: 1,
        max: 5,
        default: 3,
        hint: 'Rate your ability to perform shoulder mobility movements (1=Poor, 5=Excellent)'
      },
      {
        name: 'ankleFlexibility',
        label: 'Ankle Flexibility',
        type: 'rating',
        required: true,
        min: 1,
        max: 5,
        default: 3,
        hint: 'Rate your ankle dorsiflexion range (1=Poor, 5=Excellent)'
      },
      {
        name: 'hipFlexibility',
        label: 'Hip Flexibility',
        type: 'rating',
        required: true,
        min: 1,
        max: 5,
        default: 3,
        hint: 'Rate your hip mobility (1=Poor, 5=Excellent)'
      }
    ]
  },
  {
    id: 'body',
    name: 'Body Composition',
    description: 'Enter your body measurements for composition analysis.',
    icon: <MonitorHeartIcon fontSize="large" />,
    fields: [
      {
        name: 'weight',
        label: 'Weight (kg)',
        type: 'number',
        required: true,
        min: 30,
        max: 300,
        default: '',
        hint: 'Your current weight in kilograms'
      },
      {
        name: 'height',
        label: 'Height (cm)',
        type: 'number',
        required: true,
        min: 120,
        max: 250,
        default: '',
        hint: 'Your height in centimeters'
      },
      {
        name: 'bodyFat',
        label: 'Body Fat % (if known)',
        type: 'number',
        required: false,
        min: 3,
        max: 50,
        default: '',
        hint: 'Your body fat percentage if known (optional)'
      },
      {
        name: 'waistCircumference',
        label: 'Waist Circumference (cm)',
        type: 'number',
        required: false,
        min: 50,
        max: 200,
        default: '',
        hint: 'Measured at the narrowest point of your waist (optional)'
      }
    ]
  },
  {
    id: 'activity',
    name: 'Activity & Recovery Assessment',
    description: 'Evaluate your current activity levels and recovery quality.',
    icon: <AccessTimeIcon fontSize="large" />,
    fields: [
      {
        name: 'activityLevel',
        label: 'Weekly Activity Level',
        type: 'select',
        required: true,
        options: [
          { value: 'sedentary', label: 'Sedentary (little to no exercise)' },
          { value: 'light', label: 'Light (1-3 days/week)' },
          { value: 'moderate', label: 'Moderate (3-5 days/week)' },
          { value: 'active', label: 'Active (6-7 days/week)' },
          { value: 'veryActive', label: 'Very Active (twice daily training)' }
        ],
        default: 'moderate'
      },
      {
        name: 'sleepQuality',
        label: 'Sleep Quality',
        type: 'rating',
        required: true,
        min: 1,
        max: 5,
        default: 3,
        hint: 'Rate your typical sleep quality (1=Poor, 5=Excellent)'
      },
      {
        name: 'sleepDuration',
        label: 'Average Sleep Duration (hours)',
        type: 'number',
        required: true,
        min: 3,
        max: 12,
        default: '',
        hint: 'Your average nightly sleep in hours'
      },
      {
        name: 'stressLevel',
        label: 'Stress Level',
        type: 'rating',
        required: true,
        min: 1,
        max: 5,
        default: 3,
        hint: 'Rate your typical stress level (1=Very High, 5=Very Low)'
      }
    ]
  }
];

const calculateCardioFitness = (values) => {
  if (values.cardioTestType === 'known' && values.vo2Max) {
    return {
      score: parseFloat(values.vo2Max),
      unit: 'ml/kg/min',
      method: 'known'
    };
  } else if (values.restingHeartRate && values.recoveryHeartRate) {
    // Simple step test estimation using heart rate recovery
    // This is a simplified formula for demo purposes
    const hrDifference = values.recoveryHeartRate - values.restingHeartRate;
    let estimatedVO2 = 0;
    
    if (hrDifference < 20) {
      estimatedVO2 = 48.5 - (hrDifference * 0.25);
    } else if (hrDifference < 40) {
      estimatedVO2 = 44 - (hrDifference * 0.15);
    } else {
      estimatedVO2 = 38 - (hrDifference * 0.1);
    }
    
    // Adjust slightly based on resting heart rate
    if (values.restingHeartRate < 60) {
      estimatedVO2 += 2;
    } else if (values.restingHeartRate > 80) {
      estimatedVO2 -= 2;
    }
    
    return {
      score: Math.max(15, Math.min(60, estimatedVO2)), // Clamp between reasonable values
      unit: 'ml/kg/min (estimated)',
      method: 'step'
    };
  }
  
  return { score: 0, unit: '', method: '' };
};

const calculateStrengthScore = (values) => {
  // Basic scoring system for demonstration
  let totalScore = 0;
  let maxScore = 0;
  
  // Pushups scoring
  if (values.pushUps !== undefined && values.pushUps !== '') {
    totalScore += Math.min(10, Math.floor(values.pushUps / 5));
    maxScore += 10;
  }
  
  // Sit-ups scoring
  if (values.sitUps !== undefined && values.sitUps !== '') {
    totalScore += Math.min(10, Math.floor(values.sitUps / 5));
    maxScore += 10;
  }
  
  // Plank scoring (in seconds)
  if (values.plankTime !== undefined && values.plankTime !== '') {
    totalScore += Math.min(10, Math.floor(values.plankTime / 15));
    maxScore += 10;
  }
  
  // Squats scoring
  if (values.squats !== undefined && values.squats !== '') {
    totalScore += Math.min(10, Math.floor(values.squats / 5));
    maxScore += 10;
  }
  
  const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  return {
    score: normalizedScore,
    unit: '%',
    details: [
      { name: 'Push-ups', value: values.pushUps || 0 },
      { name: 'Sit-ups', value: values.sitUps || 0 },
      { name: 'Plank', value: `${values.plankTime || 0} sec` },
      { name: 'Squats', value: values.squats || 0 }
    ]
  };
};

const calculateFlexibilityScore = (values) => {
  let totalScore = 0;
  let maxScore = 0;
  
  // Sit and reach scoring (in cm)
  if (values.sitAndReach !== undefined && values.sitAndReach !== '') {
    // Convert to a 1-10 scale (from -30 to +30 cm range)
    const sitReachScore = Math.max(0, Math.min(10, Math.floor((values.sitAndReach + 30) / 6)));
    totalScore += sitReachScore;
    maxScore += 10;
  }
  
  // Shoulder flexibility (1-5 rating)
  if (values.shoulderFlexibility) {
    totalScore += values.shoulderFlexibility * 2; // Convert to a 10-point scale
    maxScore += 10;
  }
  
  // Ankle flexibility (1-5 rating)
  if (values.ankleFlexibility) {
    totalScore += values.ankleFlexibility * 2; // Convert to a 10-point scale
    maxScore += 10;
  }
  
  // Hip flexibility (1-5 rating)
  if (values.hipFlexibility) {
    totalScore += values.hipFlexibility * 2; // Convert to a 10-point scale
    maxScore += 10;
  }
  
  const normalizedScore = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
  
  return {
    score: normalizedScore,
    unit: '%',
    details: [
      { name: 'Sit and Reach', value: `${values.sitAndReach || 0} cm` },
      { name: 'Shoulder Mobility', value: values.shoulderFlexibility || 0, outOf: 5 },
      { name: 'Ankle Mobility', value: values.ankleFlexibility || 0, outOf: 5 },
      { name: 'Hip Mobility', value: values.hipFlexibility || 0, outOf: 5 }
    ]
  };
};

const calculateBodyComposition = (values) => {
  if (!values.weight || !values.height) {
    return {
      bmi: 0,
      category: 'Unknown',
      bodyFat: values.bodyFat || 'Unknown'
    };
  }
  
  // Calculate BMI
  const heightInMeters = values.height / 100;
  const bmi = values.weight / (heightInMeters * heightInMeters);
  
  // Determine BMI category
  let category = '';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  
  return {
    bmi: bmi,
    category: category,
    bodyFat: values.bodyFat || 'Not provided',
    waist: values.waistCircumference || 'Not provided'
  };
};

const calculateActivityScore = (values) => {
  let activityScore = 0;
  
  // Score based on activity level
  switch (values.activityLevel) {
    case 'sedentary': activityScore += 1; break;
    case 'light': activityScore += 3; break;
    case 'moderate': activityScore += 5; break;
    case 'active': activityScore += 8; break;
    case 'veryActive': activityScore += 10; break;
    default: activityScore += 0;
  }
  
  // Add sleep quality score (1-5 rating)
  activityScore += values.sleepQuality || 0;
  
  // Add sleep duration score (3-12 hours)
  const sleepScore = values.sleepDuration ? 
    Math.max(0, Math.min(5, ((values.sleepDuration - 4) * 5) / 4)) : 0;
  activityScore += sleepScore;
  
  // Add stress level score (1-5 rating, 5 is low stress)
  activityScore += values.stressLevel || 0;
  
  // Normalize to 0-100%
  const normalizedScore = Math.round((activityScore / 25) * 100);
  
  return {
    score: normalizedScore,
    unit: '%',
    details: {
      activity: values.activityLevel || 'Unknown',
      sleepQuality: values.sleepQuality || 0,
      sleepDuration: values.sleepDuration ? `${values.sleepDuration} hrs` : 'Unknown',
      stressLevel: values.stressLevel || 0
    }
  };
};

const getRecommendationsForCategory = (category, score) => {
  switch (category) {
    case 'cardio':
      if (score < 30) {
        return [
          'Begin with low-intensity aerobic activities like walking or swimming',
          'Aim for 20-30 minutes, 3-4 times per week',
          'Focus on consistency rather than intensity',
          'Consider heart rate monitoring to stay in the appropriate training zone'
        ];
      } else if (score < 40) {
        return [
          'Progress to moderate-intensity cardio activities 4-5 times per week',
          'Include interval training once per week',
          'Gradually increase duration to 30-45 minutes per session',
          'Monitor recovery between sessions'
        ];
      } else {
        return [
          'Incorporate varied intensity training including HIIT sessions',
          'Train 5-6 days per week with appropriate recovery days',
          'Include longer endurance sessions of 60+ minutes',
          'Consider periodization in your training program'
        ];
      }
      
    case 'strength':
      if (score < 40) {
        return [
          'Start with bodyweight exercises focusing on form',
          'Begin with 2-3 sessions per week of full-body training',
          'Focus on progressive overload by gradually increasing repetitions',
          'Ensure adequate protein intake to support muscle recovery'
        ];
      } else if (score < 70) {
        return [
          'Incorporate resistance training with weights or bands',
          'Consider a split routine targeting different muscle groups',
          'Include compound movements like squats, deadlifts, and presses',
          'Aim for 3-4 strength sessions per week'
        ];
      } else {
        return [
          'Implement periodized strength training program',
          'Consider more advanced training techniques like supersets',
          'Include both hypertrophy and strength-specific training phases',
          'Ensure adequate recovery between intense sessions'
        ];
      }
      
    case 'flexibility':
      if (score < 40) {
        return [
          'Incorporate daily basic stretching routine (10-15 minutes)',
          'Focus on major muscle groups with static stretches',
          'Consider starting yoga or guided stretching programs',
          'Be consistent and patient with flexibility improvements'
        ];
      } else if (score < 70) {
        return [
          'Add dynamic stretching before workouts',
          'Incorporate mobility drills targeting problem areas',
          'Try foam rolling and other self-myofascial release techniques',
          'Consider 2-3 dedicated flexibility sessions per week'
        ];
      } else {
        return [
          'Maintain current flexibility routine',
          'Consider more advanced mobility work',
          'Explore specialized techniques like PNF stretching',
          'Integrate flexibility work into daily activities'
        ];
      }
      
    case 'activity':
      if (score < 40) {
        return [
          'Focus on establishing consistent sleep schedule',
          'Implement stress management techniques like meditation',
          'Gradually increase daily activity levels',
          'Consider tracking your sleep and recovery metrics'
        ];
      } else if (score < 70) {
        return [
          'Optimize sleep environment for better quality rest',
          'Balance activity with proper recovery techniques',
          'Incorporate active recovery on rest days',
          'Monitor stress levels and adjust training accordingly'
        ];
      } else {
        return [
          'Maintain your excellent lifestyle balance',
          'Consider advanced recovery techniques like contrast therapy',
          'Periodize both training and recovery in your program',
          'Share your successful habits with others'
        ];
      }
      
    default:
      return ['Complete your assessment to receive personalized recommendations'];
  }
};

const getFitnessLevel = (overallScore) => {
  if (overallScore >= 85) return { level: 'Elite', description: 'You have exceptional fitness across multiple domains.' };
  if (overallScore >= 70) return { level: 'Advanced', description: 'You demonstrate strong fitness with minor areas for improvement.' };
  if (overallScore >= 55) return { level: 'Intermediate', description: 'You have good overall fitness with some specific areas to focus on.' };
  if (overallScore >= 40) return { level: 'Novice', description: 'You have a foundation of fitness with clear opportunities for growth.' };
  return { level: 'Beginner', description: 'You are starting your fitness journey with significant room for improvement.' };
};

function FitnessAssessmentTool() {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState({});
  const [formData, setFormData] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [results, setResults] = useState(null);
  
  const handleNext = () => {
    const currentTest = fitnessTests[activeStep];
    const errors = validateFields(currentTest.fields, formData);
    
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }
    
    const newCompleted = { ...completed };
    newCompleted[activeStep] = true;
    setCompleted(newCompleted);
    setFieldErrors({});
    
    if (activeStep === fitnessTests.length - 1) {
      generateResults();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
    setFieldErrors({});
  };
  
  const validateFields = (fields, values) => {
    const errors = {};
    
    fields.forEach(field => {
      const isRequired = typeof field.required === 'function' 
        ? field.required(values) 
        : field.required;
      
      if (isRequired && (values[field.name] === undefined || values[field.name] === '')) {
        errors[field.name] = 'This field is required';
      } else if (values[field.name] !== undefined && values[field.name] !== '') {
        if (field.type === 'number' && (
          values[field.name] < field.min || values[field.name] > field.max
        )) {
          errors[field.name] = `Value must be between ${field.min} and ${field.max}`;
        }
      }
    });
    
    return errors;
  };
  
  const handleInputChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }));
    
    // Clear error for this field if it exists
    if (fieldErrors[fieldName]) {
      const newErrors = { ...fieldErrors };
      delete newErrors[fieldName];
      setFieldErrors(newErrors);
    }
  };
  
  const isStepComplete = (step) => {
    return completed[step];
  };
  
  const generateResults = () => {
    // Calculate results for each category
    const cardioResults = calculateCardioFitness(formData);
    const strengthResults = calculateStrengthScore(formData);
    const flexibilityResults = calculateFlexibilityScore(formData);
    const bodyComposition = calculateBodyComposition(formData);
    const activityResults = calculateActivityScore(formData);
    
    // Generate VO2 Max category
    let cardioCategory = '';
    const vo2Max = cardioResults.score;
    
    if (vo2Max >= 50) cardioCategory = 'Excellent';
    else if (vo2Max >= 40) cardioCategory = 'Good';
    else if (vo2Max >= 30) cardioCategory = 'Average';
    else if (vo2Max >= 20) cardioCategory = 'Below Average';
    else cardioCategory = 'Poor';
    
    // Calculate overall fitness score
    // Weighted average across categories
    const overallScore = Math.round(
      (
        (cardioResults.score / 60 * 100) * 0.3 + // Cardio (30% weight)
        strengthResults.score * 0.25 + // Strength (25% weight)
        flexibilityResults.score * 0.2 + // Flexibility (20% weight)
        activityResults.score * 0.25 // Activity/Recovery (25% weight)
      )
    );
    
    // Get fitness level and recommendations
    const fitnessLevel = getFitnessLevel(overallScore);
    
    const results = {
      overall: {
        score: overallScore,
        level: fitnessLevel.level,
        description: fitnessLevel.description
      },
      categories: {
        cardio: {
          score: cardioResults.score,
          unit: cardioResults.unit,
          category: cardioCategory,
          recommendations: getRecommendationsForCategory('cardio', cardioResults.score)
        },
        strength: {
          score: strengthResults.score,
          unit: strengthResults.unit,
          details: strengthResults.details,
          recommendations: getRecommendationsForCategory('strength', strengthResults.score)
        },
        flexibility: {
          score: flexibilityResults.score,
          unit: flexibilityResults.unit,
          details: flexibilityResults.details,
          recommendations: getRecommendationsForCategory('flexibility', flexibilityResults.score)
        },
        body: {
          bmi: bodyComposition.bmi.toFixed(1),
          category: bodyComposition.category,
          bodyFat: bodyComposition.bodyFat,
          waist: bodyComposition.waist
        },
        activity: {
          score: activityResults.score,
          details: activityResults.details,
          recommendations: getRecommendationsForCategory('activity', activityResults.score)
        }
      }
    };
    
    setResults(results);
  };
  
  const resetAssessment = () => {
    setActiveStep(0);
    setCompleted({});
    setFormData({});
    setFieldErrors({});
    setResults(null);
  };
  
  const renderField = (field) => {
    switch (field.type) {
      case 'select':
        return (
          <FormControl 
            fullWidth 
            variant="outlined" 
            error={!!fieldErrors[field.name]}
            key={field.name}
            sx={{ mb: 2 }}
          >
            <InputLabel id={`${field.name}-label`}>{field.label}</InputLabel>
            <Select
              labelId={`${field.name}-label`}
              value={formData[field.name] || field.default}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              label={field.label}
            >
              {field.options.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
            {fieldErrors[field.name] && (
              <FormHelperText>{fieldErrors[field.name]}</FormHelperText>
            )}
            {field.hint && !fieldErrors[field.name] && (
              <FormHelperText>{field.hint}</FormHelperText>
            )}
          </FormControl>
        );
        
      case 'rating':
        return (
          <Box sx={{ mb: 2 }} key={field.name}>
            <FormControl 
              component="fieldset" 
              error={!!fieldErrors[field.name]}
              fullWidth
            >
              <FormLabel component="legend">{field.label}</FormLabel>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <Rating
                  name={field.name}
                  value={formData[field.name] || field.default}
                  onChange={(event, newValue) => {
                    handleInputChange(field.name, newValue);
                  }}
                  max={field.max || 5}
                />
                <Typography variant="body2" sx={{ ml: 2, minWidth: 60 }}>
                  {formData[field.name] || field.default} / {field.max || 5}
                </Typography>
              </Box>
              {fieldErrors[field.name] && (
                <FormHelperText>{fieldErrors[field.name]}</FormHelperText>
              )}
              {field.hint && !fieldErrors[field.name] && (
                <FormHelperText>{field.hint}</FormHelperText>
              )}
            </FormControl>
          </Box>
        );
        
      default: // number, text, etc.
        return (
          <TextField
            key={field.name}
            fullWidth
            label={field.label}
            type={field.type}
            value={formData[field.name] || ''}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            variant="outlined"
            error={!!fieldErrors[field.name]}
            helperText={fieldErrors[field.name] || field.hint || ''}
            InputProps={field.type === 'number' ? {
              inputProps: { 
                min: field.min, 
                max: field.max,
                step: field.step || 1
              }
            } : {}}
            sx={{ mb: 2 }}
            required={typeof field.required === 'function' ? field.required(formData) : field.required}
          />
        );
    }
  };
  
  const renderResultsSection = () => {
    if (!results) return null;
    
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Fitness Assessment Results
        </Typography>
        
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ height: '100%' }} raised>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <FitnessCenterIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
                  <Typography variant="h5">
                    Overall Fitness Score
                  </Typography>
                </Box>
                
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative', my: 2 }}>
                  <CircularProgress 
                    variant="determinate" 
                    value={100} 
                    size={160} 
                    thickness={4} 
                    sx={{ color: theme.palette.grey[200] }} 
                  />
                  <CircularProgress 
                    variant="determinate" 
                    value={results.overall.score} 
                    size={160} 
                    thickness={4} 
                    sx={{ 
                      color: theme.palette.primary.main,
                      position: 'absolute',
                      left: 0
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
                    <Typography variant="h3" component="div" color="primary.main">
                      {results.overall.score}
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="h6" align="center" color="primary" gutterBottom>
                  {results.overall.level} Level
                </Typography>
                <Typography variant="body2" align="center" paragraph>
                  {results.overall.description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Category Scores:
                </Typography>
                
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center' }} elevation={0} variant="outlined">
                      <Typography variant="body2">Cardiovascular</Typography>
                      <Typography variant="h6" color="primary">
                        {results.categories.cardio.score.toFixed(1)} <Typography variant="caption">{results.categories.cardio.unit}</Typography>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center' }} elevation={0} variant="outlined">
                      <Typography variant="body2">Strength</Typography>
                      <Typography variant="h6" color="primary">
                        {results.categories.strength.score}<Typography variant="caption">%</Typography>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center' }} elevation={0} variant="outlined">
                      <Typography variant="body2">Flexibility</Typography>
                      <Typography variant="h6" color="primary">
                        {results.categories.flexibility.score}<Typography variant="caption">%</Typography>
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={6}>
                    <Paper sx={{ p: 1, textAlign: 'center' }} elevation={0} variant="outlined">
                      <Typography variant="body2">Activity/Recovery</Typography>
                      <Typography variant="h6" color="primary">
                        {results.categories.activity.score}<Typography variant="caption">%</Typography>
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} md={6} lg={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Detailed Results
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      <MonitorHeartIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Cardiovascular Fitness
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Your VO2 Max of <strong>{results.categories.cardio.score.toFixed(1)} {results.categories.cardio.unit}</strong> indicates <strong>{results.categories.cardio.category}</strong> cardiovascular fitness.
                    </Typography>
                    
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      <FitnessCenterIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Strength & Endurance
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Your muscular strength score is <strong>{results.categories.strength.score}%</strong>, based on your performance on strength tests including push-ups, sit-ups, and plank time.
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      <DirectionsRunIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Flexibility & Mobility
                    </Typography>
                    <Typography variant="body2" paragraph>
                      Your flexibility score is <strong>{results.categories.flexibility.score}%</strong>, with particular {results.categories.flexibility.score > 70 ? 'strength' : 'opportunity for improvement'} in shoulder and hip mobility.
                    </Typography>
                    
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      <AccessTimeIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'text-bottom' }} />
                      Activity & Recovery
                    </Typography>
                    <Typography variant="body2">
                      Your activity and recovery score is <strong>{results.categories.activity.score}%</strong>, reflecting your activity level, sleep quality ({results.categories.activity.details.sleepQuality}/5), and stress management ({results.categories.activity.details.stressLevel}/5).
                    </Typography>
                  </Grid>
                  
                  {results.categories.body.bmi !== 'NaN' && (
                    <Grid item xs={12}>
                      <Divider sx={{ my: 1 }} />
                      <Typography variant="subtitle1" color="primary" gutterBottom>
                        Body Composition
                      </Typography>
                      <Typography variant="body2">
                        Your BMI is <strong>{results.categories.body.bmi}</strong> ({results.categories.body.category}). 
                        {results.categories.body.bodyFat !== 'Not provided' && ` Your body fat percentage is approximately ${results.categories.body.bodyFat}%.`}
                        {results.categories.body.waist !== 'Not provided' && ` Your waist circumference is ${results.categories.body.waist} cm.`}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Personalized Recommendations
                </Typography>
                
                <Divider sx={{ mb: 2 }} />
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Cardiovascular Training
                    </Typography>
                    <List dense>
                      {results.categories.cardio.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
                      Strength Training
                    </Typography>
                    <List dense>
                      {results.categories.strength.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" color="primary" gutterBottom>
                      Flexibility & Mobility
                    </Typography>
                    <List dense>
                      {results.categories.flexibility.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                    
                    <Typography variant="subtitle1" color="primary" gutterBottom sx={{ mt: 2 }}>
                      Recovery & Lifestyle
                    </Typography>
                    <List dense>
                      {results.categories.activity.recommendations.map((rec, index) => (
                        <ListItem key={index}>
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            <CheckCircleIcon color="success" fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary={rec} />
                        </ListItem>
                      ))}
                    </List>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={resetAssessment}
                    startIcon={<FitnessCenterIcon />}
                  >
                    Retake Assessment
                  </Button>
                  <Button
                    variant="outlined"
                    sx={{ ml: 2 }}
                    disabled
                  >
                    Download Report (Coming Soon)
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };
  
  return (
    <Box sx={{ width: '100%' }} id="fitness-assessment-tool">
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
          <FitnessCenterIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h4" component="h2">
            Fitness Assessment Tool
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          This comprehensive assessment evaluates key components of fitness including cardiovascular endurance, muscular strength, 
          flexibility, body composition, and activity levels. Complete each section to receive a personalized fitness profile 
          with targeted recommendations.
        </Typography>
        
        {!results ? (
          <>
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
              {fitnessTests.map((test, index) => (
                <Step key={test.id} completed={isStepComplete(index)}>
                  <StepLabel>{test.name}</StepLabel>
                </Step>
              ))}
            </Stepper>
            
            <Box sx={{ mb: 4 }}>
              <Paper sx={{ p: 3, bgcolor: theme.palette.background.default }} elevation={1}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {fitnessTests[activeStep].icon}
                  <Typography variant="h5" sx={{ ml: 1 }}>
                    {fitnessTests[activeStep].name}
                  </Typography>
                </Box>
                
                <Typography variant="body2" paragraph color="text.secondary">
                  {fitnessTests[activeStep].description}
                </Typography>
                
                <Divider sx={{ my: 2 }} />
                
                <Grid container spacing={2}>
                  {fitnessTests[activeStep].fields.map(field => (
                    <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.name}>
                      {renderField(field)}
                    </Grid>
                  ))}
                </Grid>
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
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                {activeStep === fitnessTests.length - 1 ? 'Complete Assessment' : 'Next'}
              </Button>
            </Box>
          </>
        ) : (
          renderResultsSection()
        )}
      </Paper>
    </Box>
  );
}

export default FitnessAssessmentTool;