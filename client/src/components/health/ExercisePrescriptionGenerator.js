import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Alert,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  FormHelperText,
  useTheme,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  IconButton,
  Tooltip,
} from '@mui/material';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import SpeedIcon from '@mui/icons-material/Speed';
import FavoriteIcon from '@mui/icons-material/Favorite';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import InfoIcon from '@mui/icons-material/Info';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';

// Exercise library organized by categories
const exerciseLibrary = {
  cardio: [
    {
      name: 'Walking',
      intensity: 'low',
      description: 'Simple walking at a moderate pace.',
      benefits: ['Improves cardiovascular health', 'Suitable for beginners', 'Low impact'],
      targetHRZone: '50-60% of max HR',
      equipment: 'None',
      variations: ['Incline walking', 'Speed walking']
    },
    {
      name: 'Jogging',
      intensity: 'moderate',
      description: 'Running at a comfortable pace where conversation is still possible.',
      benefits: ['Improves cardiovascular endurance', 'Burns calories efficiently', 'Strengthens legs'],
      targetHRZone: '60-70% of max HR',
      equipment: 'Proper running shoes',
      variations: ['Trail running', 'Interval jogging']
    },
    {
      name: 'Cycling',
      intensity: 'moderate',
      description: 'Biking on stationary bike or outdoors.',
      benefits: ['Low impact cardiovascular training', 'Strengthens lower body', 'Joint-friendly'],
      targetHRZone: '60-80% of max HR',
      equipment: 'Bicycle or stationary bike',
      variations: ['Hill climbing', 'Interval cycling']
    },
    {
      name: 'Swimming',
      intensity: 'moderate',
      description: 'Full-body workout in water with various strokes.',
      benefits: ['Full-body workout', 'Zero impact on joints', 'Improves lung capacity'],
      targetHRZone: '60-80% of max HR',
      equipment: 'Pool access, swimwear',
      variations: ['Different strokes', 'Interval swimming']
    },
    {
      name: 'HIIT (High-Intensity Interval Training)',
      intensity: 'high',
      description: 'Short bursts of intense exercise alternated with recovery periods.',
      benefits: ['Maximizes calorie burn', 'Improves VO2 max', 'Time-efficient'],
      targetHRZone: '80-95% of max HR during intervals',
      equipment: 'Varies based on exercises chosen',
      variations: ['Tabata', 'Sprint intervals']
    },
    {
      name: 'Rowing',
      intensity: 'moderate-high',
      description: 'Full-body workout using a rowing machine or boat.',
      benefits: ['Engages 86% of muscles', 'Low impact', 'Combines strength and cardio'],
      targetHRZone: '70-85% of max HR',
      equipment: 'Rowing machine or boat',
      variations: ['Interval rowing', 'Long-distance rowing']
    }
  ],
  strength: [
    {
      name: 'Bodyweight Squats',
      intensity: 'moderate',
      description: 'Lower body exercise targeting quadriceps, hamstrings, and glutes.',
      benefits: ['Strengthens lower body', 'Improves mobility', 'No equipment needed'],
      targetMuscles: 'Quadriceps, Hamstrings, Glutes',
      equipment: 'None',
      variations: ['Sumo squats', 'Single-leg squats', 'Jump squats']
    },
    {
      name: 'Push-ups',
      intensity: 'moderate',
      description: 'Upper body exercise targeting chest, shoulders, and triceps.',
      benefits: ['Strengthens upper body', 'Core stabilization', 'Highly adaptable'],
      targetMuscles: 'Chest, Shoulders, Triceps, Core',
      equipment: 'None',
      variations: ['Incline push-ups', 'Decline push-ups', 'Diamond push-ups']
    },
    {
      name: 'Dumbbell Rows',
      intensity: 'moderate',
      description: 'Upper body pulling exercise for back strength.',
      benefits: ['Strengthens back muscles', 'Improves posture', 'Unilateral movement'],
      targetMuscles: 'Latissimus Dorsi, Rhomboids, Biceps',
      equipment: 'Dumbbells',
      variations: ['Bent-over rows', 'Single-arm rows', 'Renegade rows']
    },
    {
      name: 'Lunges',
      intensity: 'moderate',
      description: 'Lower body exercise working one leg at a time.',
      benefits: ['Unilateral lower body strength', 'Improves balance', 'Versatile'],
      targetMuscles: 'Quadriceps, Hamstrings, Glutes',
      equipment: 'None (can add dumbbells)',
      variations: ['Walking lunges', 'Reverse lunges', 'Side lunges']
    },
    {
      name: 'Planks',
      intensity: 'moderate',
      description: 'Core stabilization exercise holding a push-up position.',
      benefits: ['Core strength', 'Improves posture', 'Minimal movement, maximum effect'],
      targetMuscles: 'Abdominals, Lower Back, Shoulders',
      equipment: 'None',
      variations: ['Side planks', 'Forearm planks', 'Dynamic planks']
    },
    {
      name: 'Deadlifts',
      intensity: 'high',
      description: 'Compound movement picking weight up from the floor.',
      benefits: ['Full posterior chain development', 'Functional strength', 'High calorie burn'],
      targetMuscles: 'Hamstrings, Glutes, Lower Back, Core',
      equipment: 'Barbell, Dumbbells, or Kettlebell',
      variations: ['Romanian deadlifts', 'Sumo deadlifts', 'Single-leg deadlifts']
    }
  ],
  flexibility: [
    {
      name: 'Static Hamstring Stretch',
      intensity: 'low',
      description: 'Seated forward fold targeting hamstring flexibility.',
      benefits: ['Improves hamstring flexibility', 'Releases lower back tension', 'Simple to perform'],
      targetMuscles: 'Hamstrings, Lower Back',
      equipment: 'None',
      variations: ['Standing hamstring stretch', 'Single-leg stretch']
    },
    {
      name: 'Hip Flexor Stretch',
      intensity: 'low',
      description: 'Kneeling lunge position to open hip flexors.',
      benefits: ['Relieves hip tightness', 'Improves posture', 'Counteracts sitting'],
      targetMuscles: 'Hip Flexors, Quadriceps',
      equipment: 'None',
      variations: ['Kneeling hip flexor stretch', 'Reclined pigeon pose']
    },
    {
      name: 'Shoulder Mobility Exercises',
      intensity: 'low',
      description: 'Dynamic movements to improve shoulder range of motion.',
      benefits: ['Improves shoulder mobility', 'Reduces injury risk', 'Enhances upper body function'],
      targetMuscles: 'Shoulder Complex',
      equipment: 'None',
      variations: ['Arm circles', 'Wall slides', 'Shoulder dislocates']
    },
    {
      name: 'Yoga Flow',
      intensity: 'low-moderate',
      description: 'Series of yoga poses flowing together.',
      benefits: ['Full-body mobility', 'Mindfulness practice', 'Combines strength and flexibility'],
      targetMuscles: 'Full Body',
      equipment: 'Yoga mat (optional)',
      variations: ['Sun salutations', 'Vinyasa flow', 'Gentle yoga']
    },
    {
      name: 'Dynamic Warm-up Routine',
      intensity: 'low-moderate',
      description: 'Series of movements preparing the body for exercise.',
      benefits: ['Increases core temperature', 'Prepares joints and muscles', 'Enhances performance'],
      targetMuscles: 'Full Body',
      equipment: 'None',
      variations: ['Joint rotations', 'Dynamic stretches', 'Mobility drills']
    },
    {
      name: 'Foam Rolling',
      intensity: 'low-moderate',
      description: 'Self-myofascial release technique using a foam roller.',
      benefits: ['Releases muscle tension', 'Improves circulation', 'Enhances recovery'],
      targetMuscles: 'Variable based on application',
      equipment: 'Foam roller',
      variations: ['IT band rolling', 'Back rolling', 'Calf rolling']
    }
  ],
  balance: [
    {
      name: 'Single-Leg Balance',
      intensity: 'low',
      description: 'Standing on one leg to develop stabilizing muscles.',
      benefits: ['Improves proprioception', 'Strengthens ankle stabilizers', 'Simple progression options'],
      targetMuscles: 'Ankle Stabilizers, Core',
      equipment: 'None',
      variations: ['Eyes closed', 'Unstable surface', 'Movement challenges']
    },
    {
      name: 'Bosu Ball Exercises',
      intensity: 'moderate',
      description: 'Various exercises performed on a Bosu ball.',
      benefits: ['Challenges balance', 'Engages core', 'Versatile tool'],
      targetMuscles: 'Core, Lower Body Stabilizers',
      equipment: 'Bosu Ball',
      variations: ['Squats on Bosu', 'Push-ups on Bosu', 'Standing balance']
    },
    {
      name: 'Stability Ball Exercises',
      intensity: 'moderate',
      description: 'Movements performed using a large stability ball.',
      benefits: ['Improves core stability', 'Enhances balance', 'Low impact options'],
      targetMuscles: 'Core, Full Body Stabilizers',
      equipment: 'Stability Ball',
      variations: ['Ball crunches', 'Wall squats with ball', 'Hamstring curls']
    }
  ]
};

function ExercisePrescriptionGenerator() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    fitnessLevel: 'beginner',
    goals: [],
    healthConditions: [],
    timePerSession: 30,
    sessionsPerWeek: 3,
    prefers: []
  });
  
  const [customGoal, setCustomGoal] = useState('');
  const [customCondition, setCustomCondition] = useState('');
  const [customPreference, setCustomPreference] = useState('');
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [errors, setErrors] = useState({});
  
  const goalOptions = [
    'Weight loss',
    'Muscle gain',
    'Cardiovascular health',
    'Flexibility',
    'Overall fitness',
    'Strength',
    'Sports performance',
    'Rehabilitation',
    'Stress reduction'
  ];
  
  const conditionOptions = [
    'None',
    'Lower back pain',
    'Knee issues',
    'Hypertension',
    'Diabetes',
    'Shoulder pain',
    'Arthritis',
    'Limited mobility',
    'Pregnancy'
  ];
  
  const preferenceOptions = [
    'Cardio exercises',
    'Weight training',
    'Bodyweight exercises',
    'Outdoor activities',
    'Group classes',
    'Home workouts',
    'Gym workouts',
    'Mind-body exercises',
    'High intensity',
    'Low intensity'
  ];
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is updated
    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };
  
  const handleMultiSelectChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const addCustomItem = (field, value, setter) => {
    if (!value.trim()) return;
    
    setFormData({
      ...formData,
      [field]: [...formData[field], value.trim()]
    });
    setter('');
  };
  
  const removeItem = (field, index) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index)
    });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.age || formData.age < 15 || formData.age > 100) {
      newErrors.age = 'Please enter a valid age between 15-100';
    }
    
    if (formData.goals.length === 0) {
      newErrors.goals = 'Please select at least one fitness goal';
    }
    
    if (formData.timePerSession < 10 || formData.timePerSession > 120) {
      newErrors.timePerSession = 'Session duration should be between 10-120 minutes';
    }
    
    if (formData.sessionsPerWeek < 1 || formData.sessionsPerWeek > 7) {
      newErrors.sessionsPerWeek = 'Sessions per week should be between 1-7';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Calculate target heart rate zones based on age
  const calculateHeartRateZones = (age) => {
    const maxHR = 220 - age;
    return {
      zone1: { min: Math.round(maxHR * 0.5), max: Math.round(maxHR * 0.6), name: 'Recovery' },
      zone2: { min: Math.round(maxHR * 0.6), max: Math.round(maxHR * 0.7), name: 'Aerobic' },
      zone3: { min: Math.round(maxHR * 0.7), max: Math.round(maxHR * 0.8), name: 'Endurance' },
      zone4: { min: Math.round(maxHR * 0.8), max: Math.round(maxHR * 0.9), name: 'Threshold' },
      zone5: { min: Math.round(maxHR * 0.9), max: maxHR, name: 'Maximum' }
    };
  };
  
  // Generate a workout plan based on user inputs
  const generateWorkoutPlan = () => {
    if (!validateForm()) {
      return;
    }
    
    const { age, gender, fitnessLevel, goals, healthConditions, timePerSession, sessionsPerWeek, prefers } = formData;
    
    // Calculate heart rate zones
    const hrZones = calculateHeartRateZones(parseInt(age));
    
    // Determine workout split based on sessions per week
    let workoutSplit;
    if (sessionsPerWeek <= 2) {
      workoutSplit = ['Full Body', 'Rest/Active Recovery'];
    } else if (sessionsPerWeek <= 4) {
      workoutSplit = ['Upper Body', 'Lower Body', 'Full Body', 'Active Recovery'];
    } else {
      workoutSplit = ['Push', 'Pull', 'Legs', 'Cardio/Core', 'Active Recovery'];
    }
    
    // Adjust workout split to match sessions per week
    workoutSplit = workoutSplit.slice(0, sessionsPerWeek);
    
    // If user has less than 5 sessions but we need to fill more days,
    // repeat some workout types
    while (workoutSplit.length < sessionsPerWeek) {
      workoutSplit.push(workoutSplit[workoutSplit.length % workoutSplit.length]);
    }
    
    // Determine workout intensity based on fitness level
    const intensityByLevel = {
      beginner: { sets: '2-3', reps: '10-12', rest: '60-90 sec', cardioIntensity: 'low to moderate' },
      intermediate: { sets: '3-4', reps: '8-12', rest: '45-60 sec', cardioIntensity: 'moderate to high' },
      advanced: { sets: '4-5', reps: '6-12', rest: '30-60 sec', cardioIntensity: 'moderate to very high' }
    };
    
    const intensity = intensityByLevel[fitnessLevel];
    
    // Select appropriate exercises based on goals and preferences
    const selectedExercises = {};
    
    // Determine if we need cardio focus
    const needsCardio = goals.includes('Cardiovascular health') || 
                       goals.includes('Weight loss') || 
                       goals.includes('Overall fitness') ||
                       prefers.includes('Cardio exercises');
    
    // Determine if we need strength focus
    const needsStrength = goals.includes('Muscle gain') || 
                         goals.includes('Strength') || 
                         goals.includes('Sports performance') ||
                         prefers.includes('Weight training') ||
                         prefers.includes('Bodyweight exercises');
    
    // Determine if we need flexibility focus
    const needsFlexibility = goals.includes('Flexibility') || 
                           goals.includes('Rehabilitation') || 
                           goals.includes('Stress reduction') ||
                           prefers.includes('Mind-body exercises');
    
    // Adjust exercise selection based on health conditions
    const hasJointIssues = healthConditions.includes('Knee issues') || 
                         healthConditions.includes('Arthritis') || 
                         healthConditions.includes('Lower back pain');
    
    const hasCardiovascularIssues = healthConditions.includes('Hypertension') || 
                                  healthConditions.includes('Diabetes');
    
    // Select exercises from library based on needs and considerations
    selectedExercises.cardio = exerciseLibrary.cardio
      .filter(ex => {
        if (hasJointIssues && ex.intensity === 'high') return false;
        if (hasCardiovascularIssues && ex.intensity === 'high') return false;
        return true;
      })
      .slice(0, 3);
    
    selectedExercises.strength = exerciseLibrary.strength
      .filter(ex => {
        if (hasJointIssues && (ex.name.includes('Deadlift') || ex.name.includes('Squat'))) return false;
        return true;
      })
      .slice(0, 5);
    
    selectedExercises.flexibility = exerciseLibrary.flexibility.slice(0, 3);
    selectedExercises.balance = exerciseLibrary.balance.slice(0, 2);
    
    // Create weekly schedule
    const weeklySchedule = workoutSplit.map((type, index) => {
      let dailyExercises = [];
      let warmup = [];
      let cooldown = [];
      
      // Always include dynamic warm-up
      warmup.push({
        name: 'Dynamic Warm-up', 
        duration: '5-7 minutes', 
        description: 'Light cardio and dynamic stretches to prepare the body for exercise.'
      });
      
      // Always include cooldown
      cooldown.push({
        name: 'Cooldown', 
        duration: '5 minutes', 
        description: 'Light stretching and gradual reduction in intensity.'
      });
      
      // Structure the workout based on the type
      switch (type) {
        case 'Full Body':
          if (needsCardio) {
            dailyExercises.push({
              name: selectedExercises.cardio[0].name,
              sets: '1',
              reps: '5-10 minutes',
              intensity: 'Moderate',
              group: 'Cardio'
            });
          }
          
          // Add strength exercises
          selectedExercises.strength.slice(0, 3).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: intensity.sets,
              reps: intensity.reps,
              rest: intensity.rest,
              group: 'Strength'
            });
          });
          
          if (needsFlexibility) {
            dailyExercises.push({
              name: selectedExercises.flexibility[0].name,
              sets: '1-2',
              reps: '30-60 seconds each position',
              group: 'Flexibility'
            });
          }
          break;
          
        case 'Upper Body':
          // Filter for upper body strength exercises
          const upperExercises = selectedExercises.strength.filter(ex => 
            ex.targetMuscles.includes('Chest') || 
            ex.targetMuscles.includes('Back') || 
            ex.targetMuscles.includes('Shoulders')
          );
          
          upperExercises.slice(0, 3).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: intensity.sets,
              reps: intensity.reps,
              rest: intensity.rest,
              group: 'Strength'
            });
          });
          
          if (needsCardio) {
            dailyExercises.push({
              name: selectedExercises.cardio[0].name,
              sets: '1',
              reps: '10-15 minutes',
              intensity: 'Moderate',
              group: 'Cardio'
            });
          }
          break;
          
        case 'Lower Body':
          // Filter for lower body strength exercises
          const lowerExercises = selectedExercises.strength.filter(ex => 
            ex.targetMuscles.includes('Quadriceps') || 
            ex.targetMuscles.includes('Hamstrings') || 
            ex.targetMuscles.includes('Glutes')
          );
          
          lowerExercises.slice(0, 3).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: intensity.sets,
              reps: intensity.reps,
              rest: intensity.rest,
              group: 'Strength'
            });
          });
          
          if (needsCardio) {
            dailyExercises.push({
              name: selectedExercises.cardio[1].name,
              sets: '1',
              reps: '10-15 minutes',
              intensity: 'Moderate',
              group: 'Cardio'
            });
          }
          break;
          
        case 'Push':
          // Add push exercises (chest, shoulders, triceps)
          const pushExercises = selectedExercises.strength.filter(ex => 
            ex.targetMuscles.includes('Chest') || 
            ex.targetMuscles.includes('Shoulders') || 
            ex.targetMuscles.includes('Triceps')
          );
          
          pushExercises.slice(0, 3).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: intensity.sets,
              reps: intensity.reps,
              rest: intensity.rest,
              group: 'Strength'
            });
          });
          break;
          
        case 'Pull':
          // Add pull exercises (back, biceps)
          const pullExercises = selectedExercises.strength.filter(ex => 
            ex.targetMuscles.includes('Back') || 
            ex.targetMuscles.includes('Biceps')
          );
          
          pullExercises.slice(0, 3).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: intensity.sets,
              reps: intensity.reps,
              rest: intensity.rest,
              group: 'Strength'
            });
          });
          break;
          
        case 'Legs':
          // Add leg exercises
          const legExercises = selectedExercises.strength.filter(ex => 
            ex.targetMuscles.includes('Quadriceps') || 
            ex.targetMuscles.includes('Hamstrings') || 
            ex.targetMuscles.includes('Glutes')
          );
          
          legExercises.slice(0, 3).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: intensity.sets,
              reps: intensity.reps,
              rest: intensity.rest,
              group: 'Strength'
            });
          });
          break;
          
        case 'Cardio/Core':
          // Add cardio workout
          selectedExercises.cardio.slice(0, 2).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: '1',
              reps: '15-20 minutes',
              intensity: intensity.cardioIntensity,
              group: 'Cardio'
            });
          });
          
          // Add core exercises
          const coreExercises = selectedExercises.strength.filter(ex => 
            ex.targetMuscles.includes('Core') || 
            ex.targetMuscles.includes('Abdominals')
          );
          
          if (coreExercises.length > 0) {
            coreExercises.slice(0, 2).forEach(ex => {
              dailyExercises.push({
                name: ex.name,
                sets: intensity.sets,
                reps: intensity.reps,
                rest: intensity.rest,
                group: 'Core'
              });
            });
          }
          break;
          
        case 'Active Recovery':
          // Add flexibility and mobility work
          selectedExercises.flexibility.slice(0, 2).forEach(ex => {
            dailyExercises.push({
              name: ex.name,
              sets: '1-2',
              reps: '30-60 seconds each position',
              group: 'Flexibility'
            });
          });
          
          // Add light cardio
          dailyExercises.push({
            name: 'Light ' + selectedExercises.cardio[0].name,
            sets: '1',
            reps: '15-20 minutes',
            intensity: 'Low',
            group: 'Recovery'
          });
          
          // Add balance work
          dailyExercises.push({
            name: selectedExercises.balance[0].name,
            sets: '2-3',
            reps: '30-60 seconds',
            group: 'Balance'
          });
          break;
          
        default:
          break;
      }
      
      return {
        day: `Day ${index + 1}`,
        type: type,
        warmup: warmup,
        exercises: dailyExercises,
        cooldown: cooldown,
        totalTime: `${timePerSession} minutes`
      };
    });
    
    // Create overall plan
    const plan = {
      overview: {
        fitnessLevel: fitnessLevel,
        sessionsPerWeek: sessionsPerWeek,
        timePerSession: timePerSession,
        goals: goals,
        healthConsiderations: healthConditions.filter(c => c !== 'None'),
        preferences: prefers
      },
      heartRateZones: hrZones,
      weeklySchedule: weeklySchedule,
      progressionGuidelines: {
        beginner: 'Increase workout volume or intensity every 2-3 weeks',
        intermediate: 'Progress every 2 weeks by adding resistance or increasing repetitions',
        advanced: 'Use periodization techniques and vary training cycles every 4-6 weeks'
      }[fitnessLevel],
      nutritionTips: [
        'Stay hydrated before, during, and after workouts',
        'Consume protein within 30-60 minutes after strength training',
        'Ensure adequate carbohydrates for energy during workouts',
        'Consider nutrient timing around workouts for optimal performance'
      ]
    };
    
    setWorkoutPlan(plan);
  };
  
  return (
    <Box sx={{ width: '100%' }} id="exercise-prescription-generator">
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
            Exercise Prescription Generator
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Create a personalized exercise program based on your fitness level, goals, and personal preferences.
          This tool generates a structured workout plan designed to help you achieve your specific health and fitness objectives.
        </Typography>
        
        {!workoutPlan ? (
          <Box component="form" noValidate>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Complete the form below to generate your personalized exercise prescription
                  </Typography>
                  <Typography variant="body2">
                    The more detailed information you provide, the more tailored your workout plan will be to your specific needs.
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  required
                  fullWidth
                  label="Age"
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  error={!!errors.age}
                  helperText={errors.age}
                  InputProps={{ inputProps: { min: 15, max: 100 } }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth>
                  <InputLabel>Fitness Level</InputLabel>
                  <Select
                    name="fitnessLevel"
                    value={formData.fitnessLevel}
                    onChange={handleInputChange}
                    label="Fitness Level"
                  >
                    <MenuItem value="beginner">Beginner</MenuItem>
                    <MenuItem value="intermediate">Intermediate</MenuItem>
                    <MenuItem value="advanced">Advanced</MenuItem>
                  </Select>
                  <FormHelperText>
                    Beginner: New to exercise, Intermediate: 6+ months consistent training, Advanced: 2+ years of training
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <Divider>
                  <Typography variant="body2" color="text.secondary">
                    Goals & Preferences
                  </Typography>
                </Divider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth error={!!errors.goals}>
                  <InputLabel>Fitness Goals</InputLabel>
                  <Select
                    multiple
                    name="goals"
                    value={formData.goals}
                    onChange={handleMultiSelectChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    label="Fitness Goals"
                  >
                    {goalOptions.map((goal) => (
                      <MenuItem key={goal} value={goal}>
                        {goal}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.goals && (
                    <FormHelperText>{errors.goals}</FormHelperText>
                  )}
                  <FormHelperText>
                    Select all that apply (at least one)
                  </FormHelperText>
                </FormControl>
                
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <TextField
                    size="small"
                    label="Add custom goal"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => addCustomItem('goals', customGoal, setCustomGoal)}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ mt: 1 }}>
                  {formData.goals.filter(g => !goalOptions.includes(g)).map((g, i) => (
                    <Chip 
                      key={i} 
                      label={g} 
                      onDelete={() => removeItem('goals', formData.goals.indexOf(g))} 
                      size="small" 
                      sx={{ m: 0.5 }} 
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Health Considerations</InputLabel>
                  <Select
                    multiple
                    name="healthConditions"
                    value={formData.healthConditions}
                    onChange={handleMultiSelectChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    label="Health Considerations"
                  >
                    {conditionOptions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select all that apply
                  </FormHelperText>
                </FormControl>
                
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <TextField
                    size="small"
                    label="Add health consideration"
                    value={customCondition}
                    onChange={(e) => setCustomCondition(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => addCustomItem('healthConditions', customCondition, setCustomCondition)}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ mt: 1 }}>
                  {formData.healthConditions.filter(c => !conditionOptions.includes(c)).map((c, i) => (
                    <Chip 
                      key={i} 
                      label={c} 
                      onDelete={() => removeItem('healthConditions', formData.healthConditions.indexOf(c))} 
                      size="small" 
                      sx={{ m: 0.5 }} 
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Workout Preferences</InputLabel>
                  <Select
                    multiple
                    name="prefers"
                    value={formData.prefers}
                    onChange={handleMultiSelectChange}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={value} size="small" />
                        ))}
                      </Box>
                    )}
                    label="Workout Preferences"
                  >
                    {preferenceOptions.map((preference) => (
                      <MenuItem key={preference} value={preference}>
                        {preference}
                      </MenuItem>
                    ))}
                  </Select>
                  <FormHelperText>
                    Select what you enjoy or prefer for workouts
                  </FormHelperText>
                </FormControl>
                
                <Box sx={{ display: 'flex', mt: 1 }}>
                  <TextField
                    size="small"
                    label="Add preference"
                    value={customPreference}
                    onChange={(e) => setCustomPreference(e.target.value)}
                    sx={{ flexGrow: 1 }}
                  />
                  <Button 
                    variant="outlined" 
                    onClick={() => addCustomItem('prefers', customPreference, setCustomPreference)}
                    sx={{ ml: 1 }}
                  >
                    Add
                  </Button>
                </Box>
                
                <Box sx={{ mt: 1 }}>
                  {formData.prefers.filter(p => !preferenceOptions.includes(p)).map((p, i) => (
                    <Chip 
                      key={i} 
                      label={p} 
                      onDelete={() => removeItem('prefers', formData.prefers.indexOf(p))} 
                      size="small" 
                      sx={{ m: 0.5 }} 
                    />
                  ))}
                </Box>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" gutterBottom>
                  Time Availability
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography id="time-per-session-label" sx={{ width: '60%', mr: 2 }}>
                        Minutes per workout: {formData.timePerSession}
                      </Typography>
                      <Slider
                        value={formData.timePerSession}
                        onChange={(e, newValue) => handleInputChange({ target: { name: 'timePerSession', value: newValue } })}
                        aria-labelledby="time-per-session-label"
                        valueLabelDisplay="auto"
                        step={5}
                        marks
                        min={15}
                        max={90}
                        sx={{ width: '40%' }}
                      />
                    </Box>
                    {errors.timePerSession && (
                      <Typography color="error" variant="caption">
                        {errors.timePerSession}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography id="sessions-per-week-label" sx={{ width: '60%', mr: 2 }}>
                        Sessions per week: {formData.sessionsPerWeek}
                      </Typography>
                      <Slider
                        value={formData.sessionsPerWeek}
                        onChange={(e, newValue) => handleInputChange({ target: { name: 'sessionsPerWeek', value: newValue } })}
                        aria-labelledby="sessions-per-week-label"
                        valueLabelDisplay="auto"
                        step={1}
                        marks
                        min={1}
                        max={7}
                        sx={{ width: '40%' }}
                      />
                    </Box>
                    {errors.sessionsPerWeek && (
                      <Typography color="error" variant="caption">
                        {errors.sessionsPerWeek}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={generateWorkoutPlan}
                    size="large"
                    startIcon={<FitnessCenterIcon />}
                  >
                    Generate Workout Plan
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" gutterBottom>
                Your Personalized Exercise Prescription
              </Typography>
              <Box>
                <Tooltip title="Print Plan">
                  <IconButton color="primary" sx={{ mr: 1 }} disabled>
                    <PrintIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download PDF (Coming Soon)">
                  <IconButton color="primary" disabled>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
            
            {/* Plan Overview */}
            <Card sx={{ mb: 4 }}>
              <CardContent>
                <Typography variant="h6" color="primary" gutterBottom>
                  Plan Overview
                </Typography>
                
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Fitness Level</Typography>
                    <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                      {workoutPlan.overview.fitnessLevel}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Weekly Frequency</Typography>
                    <Typography variant="body2">
                      {workoutPlan.overview.sessionsPerWeek} sessions per week
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={4}>
                    <Typography variant="subtitle2">Session Duration</Typography>
                    <Typography variant="body2">
                      {workoutPlan.overview.timePerSession} minutes
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Goals</Typography>
                    <Typography variant="body2">
                      {workoutPlan.overview.goals.join(', ')}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Health Considerations</Typography>
                    <Typography variant="body2">
                      {workoutPlan.overview.healthConsiderations.length > 0 
                        ? workoutPlan.overview.healthConsiderations.join(', ') 
                        : 'None specified'}
                    </Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="subtitle1" gutterBottom>
                  Target Heart Rate Zones (based on your age)
                </Typography>
                
                <Grid container spacing={1}>
                  {Object.values(workoutPlan.heartRateZones).map((zone) => (
                    <Grid item xs={6} sm={4} md={2.4} key={zone.name}>
                      <Paper 
                        elevation={0} 
                        variant="outlined" 
                        sx={{ 
                          p: 1, 
                          textAlign: 'center', 
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center'
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 0.5 }}>
                          <FavoriteIcon color="error" fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="subtitle2">{zone.name}</Typography>
                        </Box>
                        <Typography variant="body2">
                          {zone.min} - {zone.max} bpm
                        </Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
            </Card>
            
            {/* Weekly Workout Schedule */}
            <Typography variant="h6" gutterBottom>
              Weekly Workout Schedule
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {workoutPlan.weeklySchedule.map((day, index) => (
                <Grid item xs={12} md={6} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="h6">
                          {day.day}: {day.type}
                        </Typography>
                        <Chip 
                          label={`${day.totalTime}`} 
                          size="small" 
                          color="primary" 
                          variant="outlined" 
                        />
                      </Box>
                      
                      <Divider sx={{ mb: 2 }} />
                      
                      {/* Warm-up */}
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Warm-up
                        </Typography>
                        {day.warmup.map((item, i) => (
                          <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            <DirectionsWalkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            {item.name} ({item.duration})
                          </Typography>
                        ))}
                      </Box>
                      
                      {/* Main Workout */}
                      <Typography variant="subtitle2" color="primary" gutterBottom>
                        Main Workout
                      </Typography>
                      
                      <List dense>
                        {day.exercises.map((exercise, i) => (
                          <ListItem key={i} sx={{ py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 36 }}>
                              {exercise.group === 'Cardio' ? (
                                <DirectionsRunIcon color="primary" fontSize="small" />
                              ) : exercise.group === 'Strength' ? (
                                <FitnessCenterIcon color="primary" fontSize="small" />
                              ) : exercise.group === 'Flexibility' ? (
                                <AccessibilityNewIcon color="primary" fontSize="small" />
                              ) : (
                                <SpeedIcon color="primary" fontSize="small" />
                              )}
                            </ListItemIcon>
                            <ListItemText 
                              primary={exercise.name} 
                              secondary={`${exercise.sets} sets × ${exercise.reps}${exercise.rest ? ` (Rest: ${exercise.rest})` : ''}`}
                            />
                          </ListItem>
                        ))}
                      </List>
                      
                      {/* Cool-down */}
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          Cool-down
                        </Typography>
                        {day.cooldown.map((item, i) => (
                          <Typography key={i} variant="body2" sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            <DirectionsWalkIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                            {item.name} ({item.duration})
                          </Typography>
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            {/* Additional Guidelines */}
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Progression Guidelines
                </Typography>
                <Typography variant="body2" paragraph>
                  {workoutPlan.progressionGuidelines}
                </Typography>
                
                <Alert severity="info" icon={<InfoIcon />}>
                  <Typography variant="subtitle2" gutterBottom>
                    Important Notes:
                  </Typography>
                  <Typography variant="body2">
                    • Always warm up properly before each workout and cool down afterward<br />
                    • Listen to your body and rest when needed<br />
                    • Proper form is more important than weight or repetitions<br />
                    • If you experience pain (not normal muscle fatigue), stop the exercise<br />
                    • Consult with a healthcare provider before starting any new exercise program
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
            
            {/* Nutrition Tips */}
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Nutrition Recommendations
                </Typography>
                <List dense>
                  {workoutPlan.nutritionTips.map((tip, i) => (
                    <ListItem key={i}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText primary={tip} />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setWorkoutPlan(null)}
                startIcon={<FitnessCenterIcon />}
              >
                Generate New Workout Plan
              </Button>
            </Box>
          </Box>
        )}
      </Paper>
    </Box>
  );
}

export default ExercisePrescriptionGenerator;