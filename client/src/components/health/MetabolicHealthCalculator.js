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
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  FormControlLabel,
  Checkbox,
  Slider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

const MetabolicHealthCalculator = () => {
  const [formValues, setFormValues] = useState({
    gender: 'male',
    age: '',
    weight: '',
    height: '',
    waistCircumference: '',
    fastingGlucose: '',
    postprandialGlucose: '',
    hba1c: '',
    triglycerides: '',
    hdlCholesterol: '',
    systolicBP: '',
    diastolicBP: '',
    insulinLevel: '',
    exerciseMinutesPerWeek: '',
    highIntensityExercise: false,
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormValues({
      ...formValues,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    
    // Validate required fields
    if (!formValues.age || isNaN(formValues.age) || formValues.age < 18 || formValues.age > 100) {
      newErrors.age = 'Age must be between 18 and 100';
      isValid = false;
    }
    
    if (!formValues.weight || isNaN(formValues.weight) || formValues.weight <= 0) {
      newErrors.weight = 'Please enter a valid weight';
      isValid = false;
    }
    
    if (!formValues.height || isNaN(formValues.height) || formValues.height <= 0) {
      newErrors.height = 'Please enter a valid height';
      isValid = false;
    }
    
    // At least one metabolic marker is required
    if ((!formValues.fastingGlucose || formValues.fastingGlucose === '') &&
        (!formValues.hba1c || formValues.hba1c === '') &&
        (!formValues.triglycerides || formValues.triglycerides === '') &&
        (!formValues.hdlCholesterol || formValues.hdlCholesterol === '')) {
      newErrors.fastingGlucose = 'At least one metabolic marker is required';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateMetabolicHealth = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      // Calculate BMI
      const heightInMeters = Number(formValues.height) / 100;
      const bmi = Number(formValues.weight) / (heightInMeters * heightInMeters);
      
      // Determine metabolic syndrome criteria met
      const criteria = [];
      const riskFactors = [];
      let metabolicSyndromeCount = 0;
      
      // Elevated waist circumference
      if (formValues.waistCircumference && !isNaN(formValues.waistCircumference)) {
        const waist = Number(formValues.waistCircumference);
        const waistThreshold = formValues.gender === 'male' ? 102 : 88; // cm
        
        if (waist >= waistThreshold) {
          criteria.push('Elevated waist circumference');
          metabolicSyndromeCount++;
        }
      } else if (bmi >= 30) {
        // If waist not provided, use BMI as a proxy
        criteria.push('Elevated BMI (≥30)');
        metabolicSyndromeCount++;
      }
      
      // Elevated triglycerides
      if (formValues.triglycerides && !isNaN(formValues.triglycerides)) {
        const tg = Number(formValues.triglycerides);
        if (tg >= 150) {
          criteria.push('Elevated triglycerides (≥150 mg/dL)');
          metabolicSyndromeCount++;
        }
      }
      
      // Reduced HDL cholesterol
      if (formValues.hdlCholesterol && !isNaN(formValues.hdlCholesterol)) {
        const hdl = Number(formValues.hdlCholesterol);
        const hdlThreshold = formValues.gender === 'male' ? 40 : 50; // mg/dL
        
        if (hdl < hdlThreshold) {
          criteria.push(`Reduced HDL cholesterol (<${hdlThreshold} mg/dL)`);
          metabolicSyndromeCount++;
        }
      }
      
      // Elevated blood pressure
      if ((formValues.systolicBP && !isNaN(formValues.systolicBP)) || 
          (formValues.diastolicBP && !isNaN(formValues.diastolicBP))) {
        
        const systolic = Number(formValues.systolicBP);
        const diastolic = Number(formValues.diastolicBP);
        
        if (systolic >= 130 || diastolic >= 85) {
          criteria.push('Elevated blood pressure (≥130/85 mmHg)');
          metabolicSyndromeCount++;
        }
      }
      
      // Elevated fasting glucose
      if (formValues.fastingGlucose && !isNaN(formValues.fastingGlucose)) {
        const glucose = Number(formValues.fastingGlucose);
        if (glucose >= 100) {
          criteria.push('Elevated fasting glucose (≥100 mg/dL)');
          metabolicSyndromeCount++;
        }
      }
      
      // Determine if metabolic syndrome is present (3 or more criteria)
      const hasMetabolicSyndrome = metabolicSyndromeCount >= 3;
      
      // Calculate insulin resistance estimate (if insulin level provided)
      let homaIR = null;
      if (formValues.insulinLevel && formValues.fastingGlucose &&
          !isNaN(formValues.insulinLevel) && !isNaN(formValues.fastingGlucose)) {
        
        const insulin = Number(formValues.insulinLevel); // μIU/mL
        const glucose = Number(formValues.fastingGlucose); // mg/dL
        
        // HOMA-IR calculation: (glucose * insulin) / 405
        homaIR = (glucose * insulin) / 405;
        
        if (homaIR > 2.5) {
          riskFactors.push('Elevated HOMA-IR (>2.5), suggesting insulin resistance');
        }
      }
      
      // Assess HbA1c if provided
      if (formValues.hba1c && !isNaN(formValues.hba1c)) {
        const hba1c = Number(formValues.hba1c);
        
        if (hba1c >= 6.5) {
          riskFactors.push('HbA1c ≥6.5%, consistent with diabetes');
        } else if (hba1c >= 5.7) {
          riskFactors.push('HbA1c 5.7-6.4%, suggesting prediabetes');
        }
      }
      
      // Assess postprandial glucose if provided
      if (formValues.postprandialGlucose && !isNaN(formValues.postprandialGlucose)) {
        const ppGlucose = Number(formValues.postprandialGlucose);
        
        if (ppGlucose >= 200) {
          riskFactors.push('Postprandial glucose ≥200 mg/dL, consistent with diabetes');
        } else if (ppGlucose >= 140) {
          riskFactors.push('Postprandial glucose 140-199 mg/dL, suggesting impaired glucose tolerance');
        }
      }
      
      // Calculate metabolic health score (0-100)
      let metabolicHealthScore = 100;
      
      // Reduce score based on metabolic syndrome criteria
      metabolicHealthScore -= (metabolicSyndromeCount * 10);
      
      // Adjust for insulin resistance
      if (homaIR !== null) {
        if (homaIR > 4) metabolicHealthScore -= 15;
        else if (homaIR > 2.5) metabolicHealthScore -= 10;
      }
      
      // Adjust for exercise
      if (formValues.exerciseMinutesPerWeek && !isNaN(formValues.exerciseMinutesPerWeek)) {
        const exercise = Number(formValues.exerciseMinutesPerWeek);
        
        if (exercise >= 150) metabolicHealthScore += 10;
        else if (exercise >= 75) metabolicHealthScore += 5;
        
        if (formValues.highIntensityExercise) metabolicHealthScore += 5;
      } else {
        metabolicHealthScore -= 5; // Penalty for no exercise data
      }
      
      // Adjust for extreme BMI
      if (bmi >= 35) metabolicHealthScore -= 10;
      else if (bmi >= 30) metabolicHealthScore -= 5;
      
      // Ensure score stays within 0-100 range
      metabolicHealthScore = Math.max(0, Math.min(100, metabolicHealthScore));
      
      // Create metabolic health category
      let metabolicHealthCategory = '';
      let recommendations = [];
      
      if (metabolicHealthScore >= 85) {
        metabolicHealthCategory = 'Excellent';
        recommendations.push('Maintain your current healthy lifestyle habits.');
        recommendations.push('Continue with regular exercise and balanced nutrition.');
        recommendations.push('Monitor your metabolic health markers annually.');
      } else if (metabolicHealthScore >= 70) {
        metabolicHealthCategory = 'Good';
        recommendations.push('Your metabolic health is good, but there\'s room for improvement.');
        recommendations.push('Focus on optimizing any borderline markers through lifestyle modifications.');
        recommendations.push('Aim for at least 150 minutes of moderate-intensity exercise per week.');
      } else if (metabolicHealthScore >= 50) {
        metabolicHealthCategory = 'Fair';
        recommendations.push('Your metabolic health shows several areas for improvement.');
        recommendations.push('Consider consulting with a healthcare provider for personalized guidance.');
        recommendations.push('Prioritize both nutrition and physical activity modifications.');
      } else {
        metabolicHealthCategory = 'Poor';
        recommendations.push('Your metabolic health requires significant attention.');
        recommendations.push('We strongly recommend consulting with a healthcare provider for comprehensive evaluation and treatment.');
        recommendations.push('Focus on gradual, sustainable lifestyle changes rather than extreme measures.');
      }
      
      // Add specific recommendations based on risk factors
      if (criteria.includes('Elevated waist circumference') || criteria.includes('Elevated BMI (≥30)')) {
        recommendations.push('Focus on gradual weight loss through a combination of dietary changes and increased physical activity.');
      }
      
      if (criteria.includes('Elevated triglycerides (≥150 mg/dL)')) {
        recommendations.push('Reduce refined carbohydrates and sugars in your diet, increase omega-3 fatty acids, and limit alcohol consumption.');
      }
      
      if (criteria.includes('Reduced HDL cholesterol')) {
        recommendations.push('Increase physical activity, consider including more monounsaturated fats in your diet, and limit refined carbohydrates.');
      }
      
      if (criteria.includes('Elevated blood pressure (≥130/85 mmHg)')) {
        recommendations.push('Reduce sodium intake, increase potassium-rich foods, maintain a healthy weight, and practice stress management.');
      }
      
      if (criteria.includes('Elevated fasting glucose (≥100 mg/dL)') || 
          riskFactors.some(r => r.includes('HbA1c')) || 
          riskFactors.some(r => r.includes('Postprandial glucose'))) {
        recommendations.push('Limit added sugars and refined carbohydrates, focus on high-fiber foods, and ensure regular physical activity.');
      }
      
      // Create results object
      const results = {
        bmi: Math.round(bmi * 10) / 10,
        metabolicSyndromeCount,
        hasMetabolicSyndrome,
        criteria,
        riskFactors,
        homaIR: homaIR !== null ? Math.round(homaIR * 100) / 100 : null,
        metabolicHealthScore: Math.round(metabolicHealthScore),
        metabolicHealthCategory,
        recommendations
      };
      
      setResults(results);
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setFormValues({
      gender: 'male',
      age: '',
      weight: '',
      height: '',
      waistCircumference: '',
      fastingGlucose: '',
      postprandialGlucose: '',
      hba1c: '',
      triglycerides: '',
      hdlCholesterol: '',
      systolicBP: '',
      diastolicBP: '',
      insulinLevel: '',
      exerciseMinutesPerWeek: '',
      highIntensityExercise: false,
    });
    setResults(null);
    setErrors({});
  };

  const getHealthScoreColor = (score) => {
    if (score >= 85) return 'success.main';
    if (score >= 70) return 'success.light';
    if (score >= 50) return 'warning.main';
    return 'error.main';
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }} id="metabolic-health-calculator">
      <Box display="flex" alignItems="center" mb={2}>
        <SettingsApplicationsIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h2">
          Metabolic Health Calculator
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Evaluate your metabolic health based on key biomarkers and lifestyle factors. This tool assesses metabolic syndrome risk, insulin sensitivity, and overall metabolic function.
      </Typography>
      
      {!results ? (
        <Box>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h6" gutterBottom>
            Basic Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <FormControl fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  name="gender"
                  value={formValues.gender}
                  onChange={handleInputChange}
                  label="Gender"
                >
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Age (years)"
                name="age"
                type="number"
                value={formValues.age}
                onChange={handleInputChange}
                error={Boolean(errors.age)}
                helperText={errors.age}
                InputProps={{
                  inputProps: { min: 18, max: 100 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                type="number"
                value={formValues.weight}
                onChange={handleInputChange}
                error={Boolean(errors.weight)}
                helperText={errors.weight}
                InputProps={{
                  inputProps: { min: 30, max: 300 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                name="height"
                type="number"
                value={formValues.height}
                onChange={handleInputChange}
                error={Boolean(errors.height)}
                helperText={errors.height}
                InputProps={{
                  inputProps: { min: 100, max: 250 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Waist Circumference (cm)"
                  name="waistCircumference"
                  type="number"
                  value={formValues.waistCircumference}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 50, max: 200 }
                  }}
                />
                <Tooltip title="Measure at the level of your navel while standing relaxed. Waist circumference is a key indicator of metabolic health." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Metabolic Biomarkers
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Fasting Glucose (mg/dL)"
                  name="fastingGlucose"
                  type="number"
                  value={formValues.fastingGlucose}
                  onChange={handleInputChange}
                  error={Boolean(errors.fastingGlucose)}
                  helperText={errors.fastingGlucose}
                  InputProps={{
                    inputProps: { min: 50, max: 300 }
                  }}
                />
                <Tooltip title="Blood glucose measured after fasting for at least 8 hours. Normal range: 70-99 mg/dL, Prediabetes: 100-125 mg/dL, Diabetes: ≥126 mg/dL." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Postprandial Glucose (mg/dL)"
                  name="postprandialGlucose"
                  type="number"
                  value={formValues.postprandialGlucose}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 70, max: 400 }
                  }}
                />
                <Tooltip title="Blood glucose measured 2 hours after eating. Normal: <140 mg/dL, Prediabetes: 140-199 mg/dL, Diabetes: ≥200 mg/dL." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="HbA1c (%)"
                  name="hba1c"
                  type="number"
                  value={formValues.hba1c}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 4, max: 15, step: 0.1 }
                  }}
                />
                <Tooltip title="Glycated hemoglobin, reflects average blood glucose over 2-3 months. Normal: <5.7%, Prediabetes: 5.7-6.4%, Diabetes: ≥6.5%." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Insulin Level (μIU/mL)"
                  name="insulinLevel"
                  type="number"
                  value={formValues.insulinLevel}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 0, max: 100, step: 0.1 }
                  }}
                />
                <Tooltip title="Fasting insulin level. Used together with fasting glucose to calculate insulin resistance. Normal range varies by lab but typically 2-25 μIU/mL." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Triglycerides (mg/dL)"
                  name="triglycerides"
                  type="number"
                  value={formValues.triglycerides}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 20, max: 1000 }
                  }}
                />
                <Tooltip title="A type of fat in the blood. Normal: <150 mg/dL, Borderline high: 150-199 mg/dL, High: ≥200 mg/dL." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="HDL Cholesterol (mg/dL)"
                  name="hdlCholesterol"
                  type="number"
                  value={formValues.hdlCholesterol}
                  onChange={handleInputChange}
                  InputProps={{
                    inputProps: { min: 10, max: 100 }
                  }}
                />
                <Tooltip title="'Good' cholesterol. For metabolic health, ideal levels are ≥40 mg/dL for men and ≥50 mg/dL for women." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Systolic Blood Pressure (mmHg)"
                name="systolicBP"
                type="number"
                value={formValues.systolicBP}
                onChange={handleInputChange}
                InputProps={{
                  inputProps: { min: 70, max: 220 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Diastolic Blood Pressure (mmHg)"
                name="diastolicBP"
                type="number"
                value={formValues.diastolicBP}
                onChange={handleInputChange}
                InputProps={{
                  inputProps: { min: 40, max: 140 }
                }}
              />
            </Grid>
          </Grid>
          
          <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
            Lifestyle Factors
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Physical Activity (minutes per week)"
                name="exerciseMinutesPerWeek"
                type="number"
                value={formValues.exerciseMinutesPerWeek}
                onChange={handleInputChange}
                InputProps={{
                  inputProps: { min: 0, max: 1440 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.highIntensityExercise}
                      onChange={handleInputChange}
                      name="highIntensityExercise"
                      color="primary"
                    />
                  }
                  label="Include high-intensity exercise"
                />
              </Box>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateMetabolicHealth}
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Metabolic Health'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Note:</strong> This calculator is for educational purposes only. The more biomarkers you provide, the more accurate the assessment will be. For comprehensive metabolic health evaluation, consult with a healthcare provider.
              </Typography>
            </Alert>
          </Box>
        </Box>
      ) : (
        <Box>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h5" component="h3" gutterBottom color="primary">
            Your Metabolic Health Results
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Metabolic Health Overview
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', my: 3 }}>
                  <Box
                    sx={{
                      position: 'relative',
                      display: 'inline-flex',
                      mb: 2
                    }}
                  >
                    <CircularProgress
                      variant="determinate"
                      value={results.metabolicHealthScore}
                      size={120}
                      thickness={5}
                      sx={{
                        color: getHealthScoreColor(results.metabolicHealthScore),
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
                      <Typography variant="h4" component="div" color="text.primary">
                        {results.metabolicHealthScore}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" align="center" sx={{ color: getHealthScoreColor(results.metabolicHealthScore) }}>
                    {results.metabolicHealthCategory} Metabolic Health
                  </Typography>
                </Box>
                
                <Box sx={{ my: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">BMI:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {results.bmi} kg/m²
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({results.bmi < 18.5 ? 'Underweight' : 
                           results.bmi < 25 ? 'Normal' : 
                           results.bmi < 30 ? 'Overweight' : 'Obese'})
                        </Typography>
                      </Typography>
                    </Grid>
                    
                    {results.homaIR !== null && (
                      <Grid item xs={6}>
                        <Typography variant="body2" color="text.secondary">HOMA-IR:</Typography>
                        <Typography variant="body1" fontWeight="medium">
                          {results.homaIR}
                          <Typography component="span" variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                            ({results.homaIR < 1.0 ? 'Optimal' : 
                             results.homaIR < 2.0 ? 'Good' : 
                             results.homaIR < 2.5 ? 'Borderline' : 'Insulin Resistant'})
                          </Typography>
                        </Typography>
                      </Grid>
                    )}
                    
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Metabolic Syndrome:</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {results.hasMetabolicSyndrome ? (
                          <span style={{ color: '#d32f2f' }}>Yes - {results.metabolicSyndromeCount} of 5 criteria present</span>
                        ) : (
                          <span>{results.metabolicSyndromeCount} of 5 criteria present</span>
                        )}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                
                {results.criteria.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Metabolic Syndrome Criteria Present:
                    </Typography>
                    <ul style={{ paddingLeft: 20, marginTop: 0 }}>
                      {results.criteria.map((criterion, index) => (
                        <li key={index}>
                          <Typography variant="body2" color="error.main">
                            {criterion}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
                
                {results.riskFactors.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Additional Risk Factors:
                    </Typography>
                    <ul style={{ paddingLeft: 20, marginTop: 0 }}>
                      {results.riskFactors.map((factor, index) => (
                        <li key={index}>
                          <Typography variant="body2" color="warning.dark">
                            {factor}
                          </Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Metabolic Health Reference Values
                </Typography>
                
                <TableContainer sx={{ mt: 2 }}>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Parameter</TableCell>
                        <TableCell>Optimal</TableCell>
                        <TableCell>Borderline</TableCell>
                        <TableCell>High Risk</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell>Waist Circumference</TableCell>
                        <TableCell>&lt;94cm (M)<br/>&lt;80cm (F)</TableCell>
                        <TableCell>94-101cm (M)<br/>80-87cm (F)</TableCell>
                        <TableCell>&gt;102cm (M)<br/>&gt;88cm (F)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Fasting Glucose</TableCell>
                        <TableCell>&lt;100 mg/dL</TableCell>
                        <TableCell>100-125 mg/dL</TableCell>
                        <TableCell>&gt;126 mg/dL</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>HbA1c</TableCell>
                        <TableCell>&lt;5.7%</TableCell>
                        <TableCell>5.7-6.4%</TableCell>
                        <TableCell>&gt;6.5%</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Blood Pressure</TableCell>
                        <TableCell>&lt;120/80 mmHg</TableCell>
                        <TableCell>120-129/80-84 mmHg</TableCell>
                        <TableCell>&gt;130/85 mmHg</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Triglycerides</TableCell>
                        <TableCell>&lt;100 mg/dL</TableCell>
                        <TableCell>100-149 mg/dL</TableCell>
                        <TableCell>&gt;150 mg/dL</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>HDL Cholesterol</TableCell>
                        <TableCell>&gt;60 mg/dL</TableCell>
                        <TableCell>41-59 mg/dL (M)<br/>51-59 mg/dL (F)</TableCell>
                        <TableCell>&lt;40 mg/dL (M)<br/>&lt;50 mg/dL (F)</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>HOMA-IR</TableCell>
                        <TableCell>&lt;1.0</TableCell>
                        <TableCell>1.0-2.5</TableCell>
                        <TableCell>&gt;2.5</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
                  (M) = Male, (F) = Female
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Personalized Recommendations
                </Typography>
                
                <Typography variant="body2" paragraph>
                  Based on your metabolic health profile, consider the following evidence-based recommendations:
                </Typography>
                
                <ul style={{ paddingLeft: 20 }}>
                  {results.recommendations.map((recommendation, index) => (
                    <li key={index}>
                      <Typography variant="body1" paragraph>
                        {recommendation}
                      </Typography>
                    </li>
                  ))}
                </ul>
                
                <Box sx={{ mt: 2 }}>
                  <Alert severity="info">
                    <Typography variant="body2">
                      <strong>Next Steps:</strong> Consider discussing these results with a healthcare provider, especially if you have multiple risk factors or meet criteria for metabolic syndrome. Regular monitoring of key biomarkers can help track your metabolic health over time.
                    </Typography>
                  </Alert>
                </Box>
              </Paper>
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={handleReset}
              sx={{ mt: 2 }}
            >
              Start Over
            </Button>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Disclaimer:</strong> This metabolic health assessment is based on available biomarkers and is intended for educational purposes only. For clinical decisions, always consult with a qualified healthcare provider.
              </Typography>
            </Alert>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default MetabolicHealthCalculator;