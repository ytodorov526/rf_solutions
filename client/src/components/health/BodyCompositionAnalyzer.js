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
  useTheme,
  Slider,
  Tooltip,
  FormHelperText,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import MonitorWeightIcon from '@mui/icons-material/MonitorWeight';
import InfoIcon from '@mui/icons-material/Info';

function BodyCompositionAnalyzer() {
  const theme = useTheme();
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [bodyFatMethod, setBodyFatMethod] = useState('navy');
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  
  const validateInputs = () => {
    const newErrors = {};
    
    if (!age || age < 18 || age > 100) {
      newErrors.age = 'Please enter a valid age between 18-100';
    }
    
    if (!weight || weight < 30 || weight > 300) {
      newErrors.weight = 'Please enter a valid weight between 30-300 kg';
    }
    
    if (!height || height < 120 || height > 250) {
      newErrors.height = 'Please enter a valid height between 120-250 cm';
    }
    
    if (bodyFatMethod === 'navy') {
      if (!waist || waist < 50 || waist > 200) {
        newErrors.waist = 'Please enter a valid waist circumference between 50-200 cm';
      }
      
      if (!neck || neck < 20 || neck > 60) {
        newErrors.neck = 'Please enter a valid neck circumference between 20-60 cm';
      }
      
      if (gender === 'female' && (!hip || hip < 70 || hip > 200)) {
        newErrors.hip = 'Please enter a valid hip circumference between 70-200 cm';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const calculateBMI = () => {
    const heightInMeters = height / 100;
    return weight / (heightInMeters * heightInMeters);
  };
  
  const calculateNavyBodyFat = () => {
    const heightInCm = parseFloat(height);
    const waistInCm = parseFloat(waist);
    const neckInCm = parseFloat(neck);
    
    if (gender === 'male') {
      return 495 / (1.0324 - 0.19077 * Math.log10(waistInCm - neckInCm) + 0.15456 * Math.log10(heightInCm)) - 450;
    } else {
      const hipInCm = parseFloat(hip);
      return 495 / (1.29579 - 0.35004 * Math.log10(waistInCm + hipInCm - neckInCm) + 0.22100 * Math.log10(heightInCm)) - 450;
    }
  };
  
  const calculateJacksonPollock = () => {
    // This would typically use skinfold measurements
    // For this demo, we'll use a simplified estimation based on BMI, age, and gender
    const bmi = calculateBMI();
    const ageValue = parseFloat(age);
    
    let bodyFat;
    if (gender === 'male') {
      bodyFat = (1.20 * bmi) + (0.23 * ageValue) - 16.2;
    } else {
      bodyFat = (1.20 * bmi) + (0.23 * ageValue) - 5.4;
    }
    
    return Math.max(3, Math.min(bodyFat, 45)); // Clamp between 3-45%
  };
  
  const calculateBodyFat = () => {
    if (bodyFatMethod === 'navy') {
      return calculateNavyBodyFat();
    } else if (bodyFatMethod === 'jackson') {
      return calculateJacksonPollock();
    }
    
    return 0;
  };
  
  const calculateLeanMass = (bodyFatPercentage) => {
    return weight * (1 - bodyFatPercentage / 100);
  };
  
  const calculateFatMass = (bodyFatPercentage) => {
    return weight * (bodyFatPercentage / 100);
  };
  
  const getBMICategory = (bmi) => {
    if (bmi < 18.5) return { category: 'Underweight', color: theme.palette.warning.main };
    if (bmi < 25) return { category: 'Normal weight', color: theme.palette.success.main };
    if (bmi < 30) return { category: 'Overweight', color: theme.palette.warning.main };
    if (bmi < 35) return { category: 'Obesity Class I', color: theme.palette.error.light };
    if (bmi < 40) return { category: 'Obesity Class II', color: theme.palette.error.main };
    return { category: 'Obesity Class III', color: theme.palette.error.dark };
  };
  
  const getBodyFatCategory = (bodyFat) => {
    if (gender === 'male') {
      if (bodyFat < 6) return { category: 'Essential Fat', color: theme.palette.warning.light };
      if (bodyFat < 14) return { category: 'Athletic', color: theme.palette.success.light };
      if (bodyFat < 18) return { category: 'Fitness', color: theme.palette.success.main };
      if (bodyFat < 25) return { category: 'Average', color: theme.palette.info.main };
      return { category: 'Obese', color: theme.palette.error.main };
    } else {
      if (bodyFat < 14) return { category: 'Essential Fat', color: theme.palette.warning.light };
      if (bodyFat < 21) return { category: 'Athletic', color: theme.palette.success.light };
      if (bodyFat < 25) return { category: 'Fitness', color: theme.palette.success.main };
      if (bodyFat < 32) return { category: 'Average', color: theme.palette.info.main };
      return { category: 'Obese', color: theme.palette.error.main };
    }
  };
  
  const calculateIdealWeightRange = () => {
    const heightInMeters = height / 100;
    const lowerBMI = 18.5;
    const upperBMI = 24.9;
    
    const lowerWeight = lowerBMI * heightInMeters * heightInMeters;
    const upperWeight = upperBMI * heightInMeters * heightInMeters;
    
    return { lower: lowerWeight, upper: upperWeight };
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateInputs()) {
      return;
    }
    
    const bmi = calculateBMI();
    const bodyFatPercentage = calculateBodyFat();
    const leanMass = calculateLeanMass(bodyFatPercentage);
    const fatMass = calculateFatMass(bodyFatPercentage);
    const bmiCategory = getBMICategory(bmi);
    const bodyFatCategory = getBodyFatCategory(bodyFatPercentage);
    const idealWeightRange = calculateIdealWeightRange();
    
    setResults({
      bmi,
      bmiCategory,
      bodyFatPercentage,
      bodyFatCategory,
      leanMass,
      fatMass,
      idealWeightRange,
    });
  };
  
  const resetForm = () => {
    setAge('');
    setGender('male');
    setWeight('');
    setHeight('');
    setWaist('');
    setNeck('');
    setHip('');
    setBodyFatMethod('navy');
    setResults(null);
    setErrors({});
  };
  
  return (
    <Box sx={{ width: '100%' }}>
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
          <MonitorWeightIcon color="primary" sx={{ mr: 1, fontSize: 28 }} />
          <Typography variant="h4" component="h2">
            Body Composition Analyzer
          </Typography>
        </Box>
        
        <Typography variant="body1" paragraph>
          Analyze your body composition including body mass index (BMI), body fat percentage, and lean mass. 
          This tool provides insights into your current body composition and helps track changes over time.
        </Typography>
        
        {!results ? (
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Alert severity="info" sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" gutterBottom fontWeight="bold">
                    Body Composition Analysis Methods
                  </Typography>
                  <Typography variant="body2">
                    The Navy method uses circumference measurements, while the Jackson-Pollock estimation uses BMI, age, and gender. For more accurate results, consider professional methods like DEXA scans or hydrostatic weighing.
                  </Typography>
                </Alert>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  variant="outlined"
                  error={!!errors.age}
                  helperText={errors.age}
                  InputProps={{ inputProps: { min: 18, max: 100 } }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  variant="outlined"
                  error={!!errors.weight}
                  helperText={errors.weight}
                  InputProps={{ inputProps: { min: 30, max: 300, step: 0.1 } }}
                  required
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  variant="outlined"
                  error={!!errors.height}
                  helperText={errors.height}
                  InputProps={{ inputProps: { min: 120, max: 250, step: 0.5 } }}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Body Fat Estimation Method</InputLabel>
                  <Select
                    value={bodyFatMethod}
                    onChange={(e) => setBodyFatMethod(e.target.value)}
                    label="Body Fat Estimation Method"
                  >
                    <MenuItem value="navy">Navy Method (Circumference)</MenuItem>
                    <MenuItem value="jackson">Jackson-Pollock Estimation</MenuItem>
                  </Select>
                  <FormHelperText>
                    Select the method you want to use for body fat calculation
                  </FormHelperText>
                </FormControl>
              </Grid>
              
              {bodyFatMethod === 'navy' && (
                <>
                  <Grid item xs={12}>
                    <Divider>
                      <Typography variant="body2" color="text.secondary">
                        Circumference Measurements (cm)
                      </Typography>
                    </Divider>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Waist Circumference (cm)"
                      type="number"
                      value={waist}
                      onChange={(e) => setWaist(e.target.value)}
                      variant="outlined"
                      error={!!errors.waist}
                      helperText={errors.waist || "Measure at navel level"}
                      InputProps={{ inputProps: { min: 50, max: 200, step: 0.5 } }}
                      required
                    />
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <TextField
                      fullWidth
                      label="Neck Circumference (cm)"
                      type="number"
                      value={neck}
                      onChange={(e) => setNeck(e.target.value)}
                      variant="outlined"
                      error={!!errors.neck}
                      helperText={errors.neck || "Measure below Adam's apple"}
                      InputProps={{ inputProps: { min: 20, max: 60, step: 0.5 } }}
                      required
                    />
                  </Grid>
                  
                  {gender === 'female' && (
                    <Grid item xs={12} sm={6} md={4}>
                      <TextField
                        fullWidth
                        label="Hip Circumference (cm)"
                        type="number"
                        value={hip}
                        onChange={(e) => setHip(e.target.value)}
                        variant="outlined"
                        error={!!errors.hip}
                        helperText={errors.hip || "Measure at widest point"}
                        InputProps={{ inputProps: { min: 70, max: 200, step: 0.5 } }}
                        required
                      />
                    </Grid>
                  )}
                </>
              )}
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                >
                  Calculate Body Composition
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              Body Composition Analysis Results
            </Typography>
            
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card raised sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Body Mass Index (BMI)
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                      <Typography variant="h3" component="span" color="primary">
                        {results.bmi.toFixed(1)}
                      </Typography>
                      <Typography variant="body1" component="span" sx={{ mb: 0.5, ml: 1 }}>
                        kg/m²
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'rgba(0,0,0,0.04)', 
                        display: 'inline-block',
                        mb: 2
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        sx={{ color: results.bmiCategory.color }}
                      >
                        Category: {results.bmiCategory.category}
                      </Typography>
                    </Box>
                    
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body2" gutterBottom>
                        BMI Scale:
                      </Typography>
                      <Box sx={{ width: '100%', mt: 1, mb: 2 }}>
                        <Slider
                          value={results.bmi}
                          min={15}
                          max={40}
                          step={0.1}
                          disabled
                          marks={[
                            { value: 18.5, label: '18.5' },
                            { value: 25, label: '25' },
                            { value: 30, label: '30' },
                            { value: 35, label: '35' },
                          ]}
                          sx={{
                            '& .MuiSlider-track': {
                              background: 'linear-gradient(to right, #4caf50, #ff9800, #f44336)'
                            },
                            '& .MuiSlider-thumb': {
                              backgroundColor: results.bmiCategory.color,
                            }
                          }}
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 0.5 }}>
                          <Typography variant="caption">Underweight</Typography>
                          <Typography variant="caption">Normal</Typography>
                          <Typography variant="caption">Overweight</Typography>
                          <Typography variant="caption">Obese</Typography>
                        </Box>
                      </Box>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Typography variant="subtitle2" gutterBottom>
                      Ideal Weight Range (Based on BMI 18.5-24.9)
                    </Typography>
                    <Typography variant="h6" color="text.secondary">
                      {results.idealWeightRange.lower.toFixed(1)} - {results.idealWeightRange.upper.toFixed(1)} kg
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Card raised sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Body Fat Percentage
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                      <Typography variant="h3" component="span" color="primary">
                        {results.bodyFatPercentage.toFixed(1)}
                      </Typography>
                      <Typography variant="body1" component="span" sx={{ mb: 0.5, ml: 1 }}>
                        %
                      </Typography>
                    </Box>
                    
                    <Box 
                      sx={{ 
                        p: 1, 
                        borderRadius: 1, 
                        bgcolor: 'rgba(0,0,0,0.04)', 
                        display: 'inline-block',
                        mb: 2
                      }}
                    >
                      <Typography 
                        variant="subtitle1" 
                        sx={{ color: results.bodyFatCategory.color }}
                      >
                        Category: {results.bodyFatCategory.category}
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Lean Body Mass
                        </Typography>
                        <Typography variant="h6" color="success.main">
                          {results.leanMass.toFixed(1)} kg
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({((results.leanMass / weight) * 100).toFixed(1)}% of total)
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={6}>
                        <Typography variant="subtitle2" gutterBottom>
                          Fat Mass
                        </Typography>
                        <Typography variant="h6" color="warning.main">
                          {results.fatMass.toFixed(1)} kg
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ({((results.fatMass / weight) * 100).toFixed(1)}% of total)
                        </Typography>
                      </Grid>
                    </Grid>
                    
                    <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', mb: 1 }}>
                      <InfoIcon fontSize="small" color="primary" sx={{ mr: 1 }} />
                      <Typography variant="caption" color="text.secondary">
                        {bodyFatMethod === 'navy' ? 
                          'Calculated using the U.S. Navy circumference method' : 
                          'Estimated using the Jackson-Pollock formula'
                        }
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Interpretation & Recommendations
              </Typography>
              <Paper sx={{ p: 3 }} elevation={1}>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      What Your Results Mean
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      Your BMI of {results.bmi.toFixed(1)} places you in the {results.bmiCategory.category} category, while your body fat percentage of {results.bodyFatPercentage.toFixed(1)}% is considered {results.bodyFatCategory.category} for your gender.
                    </Typography>
                    
                    <Typography variant="body2" paragraph>
                      {results.bmi > 25 ? 
                        `Your BMI suggests you may benefit from weight reduction. Based on your height, an ideal weight range would be ${results.idealWeightRange.lower.toFixed(1)} to ${results.idealWeightRange.upper.toFixed(1)} kg.` : 
                        `Your BMI is within a healthy range. Maintaining your current weight is recommended.`
                      }
                    </Typography>
                    
                    <Typography variant="body2">
                      {results.bodyFatPercentage > (gender === 'male' ? 25 : 32) ? 
                        "Your body fat percentage is higher than recommended ranges, which may increase health risks. Consider focusing on body composition improvement through diet and exercise." : 
                        "Your body fat percentage is within or below average ranges. Focus on maintaining healthy habits."
                      }
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" gutterBottom color="primary">
                      Next Steps
                    </Typography>
                    
                    <Typography component="div" variant="body2">
                      <ul>
                        <li>Track your measurements over time to monitor progress</li>
                        <li>Consider periodic professional body composition assessments</li>
                        <li>Remember that healthy body composition varies by individual</li>
                        <li>Focus on overall health metrics beyond just weight or BMI</li>
                        <li>Consult with healthcare professionals for personalized advice</li>
                      </ul>
                    </Typography>
                    
                    <Alert severity="info" sx={{ mt: 2 }}>
                      <Typography variant="body2">
                        Body composition analysis methods vary in accuracy. For clinical purposes, consult with healthcare professionals who can provide more precise measurements.
                      </Typography>
                    </Alert>
                  </Grid>
                </Grid>
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={resetForm}
                    startIcon={<MonitorWeightIcon />}
                  >
                    Analyze New Measurements
                  </Button>
                  <Button 
                    sx={{ ml: 2 }}
                    variant="outlined"
                    disabled
                  >
                    Save Results (Coming Soon)
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

export default BodyCompositionAnalyzer;