import React, { useState, useEffect } from 'react';
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
  Slider,
  Divider,
  CircularProgress,
  Alert,
  FormHelperText,
  RadioGroup,
  Radio,
  FormControlLabel,
  Tooltip,
  IconButton
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import SpaIcon from '@mui/icons-material/Spa';

const BiologicalAgeCalculator = () => {
  const [formValues, setFormValues] = useState({
    chronologicalAge: '',
    gender: 'male',
    height: '',
    weight: '',
    waistCircumference: '',
    systolicBP: '',
    diastolicBP: '',
    fastingGlucose: '',
    hba1c: '',
    totalCholesterol: '',
    hdlCholesterol: '',
    ldlCholesterol: '',
    triglycerides: '',
    crp: '',
    albumin: '',
    creatinine: '',
    alt: '',
    ggt: '',
    wbc: '',
    vitaminD: '',
    homocysteine: '',
    igf1: '',
    sleepHours: '',
    exerciseMinutesPerWeek: '',
    smoker: 'no',
  });

  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [activeSection, setActiveSection] = useState(0);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null
      });
    }
  };

  const sections = [
    { 
      title: "Basic Information", 
      icon: <FitnessCenterIcon color="primary" />, 
      fields: ["chronologicalAge", "gender", "height", "weight", "waistCircumference", "sleepHours", "exerciseMinutesPerWeek", "smoker"]
    },
    { 
      title: "Basic Biomarkers", 
      icon: <MonitorHeartIcon color="primary" />, 
      fields: ["systolicBP", "diastolicBP", "fastingGlucose", "hba1c"]
    },
    { 
      title: "Lipid Profile", 
      icon: <LocalHospitalIcon color="primary" />, 
      fields: ["totalCholesterol", "hdlCholesterol", "ldlCholesterol", "triglycerides"]
    },
    { 
      title: "Advanced Biomarkers", 
      icon: <SpaIcon color="primary" />, 
      fields: ["crp", "albumin", "creatinine", "alt", "ggt", "wbc", "vitaminD", "homocysteine", "igf1"]
    }
  ];

  const validateFields = (fields) => {
    const newErrors = {};
    let isValid = true;
    
    fields.forEach(field => {
      const value = formValues[field];
      if (field === 'chronologicalAge') {
        if (!value || isNaN(value) || value < 18 || value > 100) {
          newErrors[field] = 'Please enter a valid age between 18 and 100';
          isValid = false;
        }
      } else if (['height', 'weight', 'waistCircumference'].includes(field)) {
        if (value && (isNaN(value) || value <= 0)) {
          newErrors[field] = 'Please enter a valid positive number';
          isValid = false;
        }
      } else if (['systolicBP', 'diastolicBP', 'fastingGlucose', 'hba1c', 'totalCholesterol', 
        'hdlCholesterol', 'ldlCholesterol', 'triglycerides', 'crp', 'albumin', 'creatinine', 
        'alt', 'ggt', 'wbc', 'vitaminD', 'homocysteine', 'igf1'].includes(field)) {
        if (value && (isNaN(value) || value <= 0)) {
          newErrors[field] = 'Please enter a valid positive number';
          isValid = false;
        }
      } else if (field === 'sleepHours') {
        if (value && (isNaN(value) || value < 0 || value > 24)) {
          newErrors[field] = 'Please enter a valid number between 0 and 24';
          isValid = false;
        }
      } else if (field === 'exerciseMinutesPerWeek') {
        if (value && (isNaN(value) || value < 0 || value > 1440)) {
          newErrors[field] = 'Please enter a valid number between 0 and 1440';
          isValid = false;
        }
      }
    });
    
    setErrors(prev => ({ ...prev, ...newErrors }));
    return isValid;
  };

  const handleNext = () => {
    const currentFields = sections[activeSection].fields;
    if (validateFields(currentFields)) {
      setActiveSection(activeSection + 1);
    }
  };

  const handleBack = () => {
    setActiveSection(activeSection - 1);
  };

  const calculateBiologicalAge = () => {
    // Validate all fields
    const allFields = sections.flatMap(section => section.fields);
    if (!validateFields(allFields)) {
      return;
    }

    setLoading(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      // Calculate biological age based on various factors
      const {
        chronologicalAge, gender, height, weight, waistCircumference,
        systolicBP, diastolicBP, fastingGlucose, hba1c,
        totalCholesterol, hdlCholesterol, ldlCholesterol, triglycerides,
        crp, albumin, creatinine, alt, ggt, wbc,
        vitaminD, homocysteine, igf1,
        sleepHours, exerciseMinutesPerWeek, smoker
      } = formValues;
      
      // Convert string values to numbers
      const age = Number(chronologicalAge);
      const bmi = weight && height ? Number(weight) / ((Number(height) / 100) ** 2) : null;
      
      // Simple biological age calculation (for demonstration)
      // In a real application, this would use a validated algorithm based on research
      
      let bioAge = age;
      
      // BMI factor (simplified)
      if (bmi) {
        if (bmi < 18.5) bioAge += 1; // Underweight
        else if (bmi >= 25 && bmi < 30) bioAge += 1; // Overweight
        else if (bmi >= 30) bioAge += 3; // Obese
      }
      
      // Blood pressure factor
      if (systolicBP && diastolicBP) {
        const sysBP = Number(systolicBP);
        const diaBP = Number(diastolicBP);
        
        if (sysBP >= 140 || diaBP >= 90) bioAge += 2; // Hypertension
        else if (sysBP >= 120 || diaBP >= 80) bioAge += 1; // Elevated
      }
      
      // Blood glucose factor
      if (fastingGlucose) {
        const glucose = Number(fastingGlucose);
        if (glucose >= 126) bioAge += 3; // Diabetes range
        else if (glucose >= 100) bioAge += 1.5; // Prediabetes range
      }
      
      // HbA1c factor
      if (hba1c) {
        const a1c = Number(hba1c);
        if (a1c >= 6.5) bioAge += 3; // Diabetes range
        else if (a1c >= 5.7) bioAge += 1.5; // Prediabetes range
      }
      
      // Cholesterol factors
      if (totalCholesterol && hdlCholesterol && ldlCholesterol) {
        const tc = Number(totalCholesterol);
        const hdl = Number(hdlCholesterol);
        const ldl = Number(ldlCholesterol);
        
        if (tc > 240) bioAge += 1.5;
        if (hdl < 40) bioAge += 1.5;
        if (ldl > 160) bioAge += 1.5;
      }
      
      // Triglycerides factor
      if (triglycerides) {
        const tg = Number(triglycerides);
        if (tg > 200) bioAge += 1;
      }
      
      // Inflammation marker - CRP
      if (crp) {
        const crpValue = Number(crp);
        if (crpValue > 3) bioAge += 2;
        else if (crpValue > 1) bioAge += 0.5;
      }
      
      // Smoking factor
      if (smoker === 'yes') bioAge += 4;
      
      // Exercise factor
      if (exerciseMinutesPerWeek) {
        const exercise = Number(exerciseMinutesPerWeek);
        if (exercise >= 150) bioAge -= 2;
        else if (exercise >= 75) bioAge -= 1;
      }
      
      // Sleep factor
      if (sleepHours) {
        const sleep = Number(sleepHours);
        if (sleep < 6 || sleep > 9) bioAge += 1;
      }
      
      // Advanced biomarkers (if available)
      if (vitaminD) {
        const vd = Number(vitaminD);
        if (vd < 20) bioAge += 1;
      }
      
      // Calculate relative biological age
      const ageDifference = bioAge - age;
      
      // Create results object
      const results = {
        chronologicalAge: age,
        biologicalAge: Math.round(bioAge * 10) / 10,
        ageDifference: Math.round(ageDifference * 10) / 10,
        bmi: bmi ? Math.round(bmi * 10) / 10 : null,
        riskFactors: [],
        positiveFactors: []
      };
      
      // Identify risk factors
      if (bmi && bmi >= 30) results.riskFactors.push('Obesity (BMI ≥ 30)');
      if (systolicBP && diastolicBP && (Number(systolicBP) >= 140 || Number(diastolicBP) >= 90)) 
        results.riskFactors.push('Hypertension');
      if (fastingGlucose && Number(fastingGlucose) >= 126) results.riskFactors.push('Elevated fasting glucose');
      if (hba1c && Number(hba1c) >= 6.5) results.riskFactors.push('Elevated HbA1c');
      if (ldlCholesterol && Number(ldlCholesterol) > 160) results.riskFactors.push('High LDL cholesterol');
      if (hdlCholesterol && Number(hdlCholesterol) < 40) results.riskFactors.push('Low HDL cholesterol');
      if (triglycerides && Number(triglycerides) > 200) results.riskFactors.push('High triglycerides');
      if (crp && Number(crp) > 3) results.riskFactors.push('Elevated inflammation (CRP)');
      if (smoker === 'yes') results.riskFactors.push('Smoking');
      if (sleepHours && (Number(sleepHours) < 6)) results.riskFactors.push('Insufficient sleep');
      
      // Identify positive factors
      if (bmi && bmi >= 18.5 && bmi < 25) results.positiveFactors.push('Healthy weight');
      if (systolicBP && diastolicBP && Number(systolicBP) < 120 && Number(diastolicBP) < 80) 
        results.positiveFactors.push('Optimal blood pressure');
      if (fastingGlucose && Number(fastingGlucose) < 100) results.positiveFactors.push('Healthy fasting glucose');
      if (hdlCholesterol && Number(hdlCholesterol) >= 60) results.positiveFactors.push('Optimal HDL cholesterol');
      if (exerciseMinutesPerWeek && Number(exerciseMinutesPerWeek) >= 150) 
        results.positiveFactors.push('Regular physical activity');
      if (sleepHours && Number(sleepHours) >= 7 && Number(sleepHours) <= 8) 
        results.positiveFactors.push('Optimal sleep duration');
      if (vitaminD && Number(vitaminD) > 30) results.positiveFactors.push('Optimal vitamin D levels');
      
      setResults(results);
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setFormValues({
      chronologicalAge: '',
      gender: 'male',
      height: '',
      weight: '',
      waistCircumference: '',
      systolicBP: '',
      diastolicBP: '',
      fastingGlucose: '',
      hba1c: '',
      totalCholesterol: '',
      hdlCholesterol: '',
      ldlCholesterol: '',
      triglycerides: '',
      crp: '',
      albumin: '',
      creatinine: '',
      alt: '',
      ggt: '',
      wbc: '',
      vitaminD: '',
      homocysteine: '',
      igf1: '',
      sleepHours: '',
      exerciseMinutesPerWeek: '',
      smoker: 'no',
    });
    setResults(null);
    setErrors({});
    setActiveSection(0);
  };

  // Tooltips for biomarker information
  const biomarkerInfo = {
    fastingGlucose: "Blood glucose measured after fasting for at least 8 hours. Normal range: 70-99 mg/dL.",
    hba1c: "Glycated hemoglobin, reflects average blood glucose over past 2-3 months. Normal range: Below 5.7%.",
    totalCholesterol: "Sum of all cholesterol in the blood. Optimal: Below 200 mg/dL.",
    hdlCholesterol: "'Good' cholesterol that helps remove other forms of cholesterol. Optimal: Above 60 mg/dL.",
    ldlCholesterol: "'Bad' cholesterol that can build up in arteries. Optimal: Below 100 mg/dL.",
    triglycerides: "A type of fat in the blood. Optimal: Below 150 mg/dL.",
    crp: "C-reactive protein, a marker of inflammation. Normal: Below 1.0 mg/L, High: Above 3.0 mg/L.",
    albumin: "Protein made by the liver, reflects nutritional status. Normal range: 3.5-5.0 g/dL.",
    creatinine: "Waste product filtered by kidneys, reflects kidney function. Normal: 0.7-1.3 mg/dL (men), 0.6-1.1 mg/dL (women).",
    alt: "Alanine aminotransferase, an enzyme that reflects liver health. Normal: 7-56 U/L (men), 7-45 U/L (women).",
    ggt: "Gamma-glutamyl transferase, an enzyme found in liver cells. Normal: 8-61 U/L (men), 5-36 U/L (women).",
    wbc: "White blood cell count, reflects immune system activity. Normal range: 4,500-11,000 cells/μL.",
    vitaminD: "25-hydroxy vitamin D, important for bone health and immune function. Optimal: Above 30 ng/mL.",
    homocysteine: "Amino acid, elevated levels linked to cardiovascular risk. Normal: Below 15 μmol/L.",
    igf1: "Insulin-like growth factor 1, reflects growth hormone levels. Age-dependent reference ranges.",
  };

  const renderTooltip = (fieldName) => {
    if (biomarkerInfo[fieldName]) {
      return (
        <Tooltip title={biomarkerInfo[fieldName]} arrow placement="top">
          <IconButton size="small" sx={{ ml: 1, p: 0 }}>
            <HelpOutlineIcon fontSize="small" color="primary" />
          </IconButton>
        </Tooltip>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }} id="biological-age-calculator">
      <Box display="flex" alignItems="center" mb={2}>
        <MonitorHeartIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h2">
          Biological Age Calculator
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Calculate your biological age based on various health biomarkers and lifestyle factors. Your biological age reflects how well your body functions compared to population averages and can differ from your chronological age.
      </Typography>
      
      {!results ? (
        <Box>
          <Divider sx={{ my: 2 }} />
          
          {/* Form Section Tabs */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            {sections.map((section, index) => (
              <Box 
                key={index}
                sx={{ 
                  textAlign: 'center', 
                  width: `${100/sections.length}%`,
                  cursor: index <= activeSection ? 'pointer' : 'default',
                  opacity: index <= activeSection ? 1 : 0.5
                }}
                onClick={() => {
                  if (index < activeSection) {
                    setActiveSection(index);
                  }
                }}
              >
                <Box 
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                    bgcolor: index <= activeSection ? 'primary.main' : 'action.disabledBackground',
                    color: index <= activeSection ? 'white' : 'text.disabled',
                    mb: 1
                  }}
                >
                  {index + 1}
                </Box>
                <Typography 
                  variant="body2" 
                  color={index <= activeSection ? 'primary' : 'text.disabled'}
                >
                  {section.title}
                </Typography>
              </Box>
            ))}
          </Box>
          
          {/* Current Form Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              {sections[activeSection].icon}
              <Typography variant="h5" component="h3" ml={1}>
                {sections[activeSection].title}
              </Typography>
            </Box>
            
            <Grid container spacing={3}>
              {sections[activeSection].fields.map((field) => {
                // Render different input types based on field
                if (field === 'gender') {
                  return (
                    <Grid item xs={12} sm={6} key={field}>
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
                  );
                } else if (field === 'smoker') {
                  return (
                    <Grid item xs={12} sm={6} key={field}>
                      <FormControl component="fieldset">
                        <Typography variant="subtitle1" gutterBottom>
                          Are you a smoker?
                        </Typography>
                        <RadioGroup
                          row
                          name="smoker"
                          value={formValues.smoker}
                          onChange={handleInputChange}
                        >
                          <FormControlLabel value="no" control={<Radio />} label="No" />
                          <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                        </RadioGroup>
                      </FormControl>
                    </Grid>
                  );
                } else {
                  // Determine label based on field name
                  let label = field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
                  let unit = '';
                  
                  // Add units to labels
                  if (field === 'height') unit = 'cm';
                  else if (field === 'weight') unit = 'kg';
                  else if (field === 'waistCircumference') unit = 'cm';
                  else if (field === 'systolicBP' || field === 'diastolicBP') unit = 'mmHg';
                  else if (field === 'fastingGlucose' || field === 'totalCholesterol' || 
                           field === 'hdlCholesterol' || field === 'ldlCholesterol' || 
                           field === 'triglycerides') unit = 'mg/dL';
                  else if (field === 'hba1c') {
                    label = 'HbA1c';
                    unit = '%';
                  }
                  else if (field === 'crp') {
                    label = 'C-Reactive Protein (CRP)';
                    unit = 'mg/L';
                  }
                  else if (field === 'albumin') unit = 'g/dL';
                  else if (field === 'creatinine') unit = 'mg/dL';
                  else if (field === 'alt') {
                    label = 'ALT (Liver Enzyme)';
                    unit = 'U/L';
                  }
                  else if (field === 'ggt') {
                    label = 'GGT (Liver Enzyme)';
                    unit = 'U/L';
                  }
                  else if (field === 'wbc') {
                    label = 'White Blood Cell Count';
                    unit = 'K/μL';
                  }
                  else if (field === 'vitaminD') {
                    label = 'Vitamin D';
                    unit = 'ng/mL';
                  }
                  else if (field === 'homocysteine') unit = 'μmol/L';
                  else if (field === 'igf1') {
                    label = 'IGF-1';
                    unit = 'ng/mL';
                  }
                  else if (field === 'sleepHours') unit = 'hours';
                  else if (field === 'exerciseMinutesPerWeek') unit = 'minutes';
                  else if (field === 'chronologicalAge') unit = 'years';
                  
                  return (
                    <Grid item xs={12} sm={6} key={field}>
                      <Box display="flex" alignItems="center">
                        <TextField
                          fullWidth
                          name={field}
                          label={`${label}${unit ? ` (${unit})` : ''}`}
                          value={formValues[field]}
                          onChange={handleInputChange}
                          type="number"
                          variant="outlined"
                          error={Boolean(errors[field])}
                          helperText={errors[field]}
                          InputProps={{
                            inputProps: {
                              min: 0,
                              step: field === 'chronologicalAge' ? 1 : field === 'hba1c' ? 0.1 : 'any'
                            }
                          }}
                        />
                        {renderTooltip(field)}
                      </Box>
                    </Grid>
                  );
                }
              })}
            </Grid>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleBack}
              disabled={activeSection === 0}
            >
              Back
            </Button>
            
            {activeSection < sections.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={calculateBiologicalAge}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Biological Age'}
              </Button>
            )}
          </Box>
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Note:</strong> This calculator is for educational purposes only and should not replace professional medical advice. The biological age calculation is an estimation based on known health biomarkers and may vary based on individual factors not captured in this tool.
              </Typography>
            </Alert>
          </Box>
        </Box>
      ) : (
        <Box>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h5" component="h3" gutterBottom color="primary">
            Your Results
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Age Analysis
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'space-between', my: 3 }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Chronological Age
                    </Typography>
                    <Typography variant="h4" color="text.primary" sx={{ mt: 1 }}>
                      {results.chronologicalAge}
                    </Typography>
                    <Typography variant="caption">Years</Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Biological Age
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mt: 1,
                        color: results.ageDifference > 0 
                          ? 'error.main' 
                          : results.ageDifference < 0 
                            ? 'success.main' 
                            : 'text.primary'
                      }}
                    >
                      {results.biologicalAge}
                    </Typography>
                    <Typography variant="caption">Years</Typography>
                  </Box>
                  
                  <Divider orientation="vertical" flexItem />
                  
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Age Difference
                    </Typography>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mt: 1,
                        color: results.ageDifference > 0 
                          ? 'error.main' 
                          : results.ageDifference < 0 
                            ? 'success.main' 
                            : 'text.primary'
                      }}
                    >
                      {results.ageDifference > 0 ? '+' : ''}{results.ageDifference}
                    </Typography>
                    <Typography variant="caption">Years</Typography>
                  </Box>
                </Box>
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body1" paragraph>
                    {results.ageDifference < -5 ? (
                      <strong>Excellent! Your biological age is significantly lower than your chronological age.</strong>
                    ) : results.ageDifference < 0 ? (
                      <strong>Great! Your biological age is lower than your chronological age.</strong>
                    ) : results.ageDifference === 0 ? (
                      "Your biological age matches your chronological age."
                    ) : results.ageDifference > 5 ? (
                      <strong>Attention needed: Your biological age is significantly higher than your chronological age.</strong>
                    ) : (
                      "Your biological age is slightly higher than your chronological age."
                    )}
                  </Typography>
                  
                  <Typography variant="body2">
                    {results.ageDifference > 0 ? (
                      "This suggests that your body may be aging faster than expected. Review the risk factors below and consider lifestyle modifications or consulting with a healthcare provider."
                    ) : results.ageDifference < 0 ? (
                      "This suggests that your body is physiologically younger than your chronological age. Keep up your healthy habits!"
                    ) : (
                      "This suggests your body is aging as expected for someone your age."
                    )}
                  </Typography>
                </Box>
                
                {results.bmi && (
                  <Box sx={{ mt: 3 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      BMI: {results.bmi} kg/m²
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {results.bmi < 18.5 ? (
                        "Underweight range"
                      ) : results.bmi < 25 ? (
                        "Healthy weight range"
                      ) : results.bmi < 30 ? (
                        "Overweight range"
                      ) : (
                        "Obese range"
                      )}
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Health Factors
                </Typography>
                
                {results.riskFactors.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" color="error.main" gutterBottom>
                      Risk Factors:
                    </Typography>
                    <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                      {results.riskFactors.map((factor, i) => (
                        <li key={i}>
                          <Typography variant="body2">{factor}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
                
                {results.positiveFactors.length > 0 && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" color="success.main" gutterBottom>
                      Positive Factors:
                    </Typography>
                    <ul style={{ marginTop: 0, paddingLeft: 20 }}>
                      {results.positiveFactors.map((factor, i) => (
                        <li key={i}>
                          <Typography variant="body2">{factor}</Typography>
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Recommendations:
                  </Typography>
                  <Typography variant="body2" paragraph>
                    {results.ageDifference > 0 ? (
                      "Consider focusing on these evidence-based strategies to improve your biological age:"
                    ) : (
                      "To maintain or further improve your biological age, consider these evidence-based strategies:"
                    )}
                  </Typography>
                  <ul style={{ paddingLeft: 20 }}>
                    {results.riskFactors.includes('Obesity (BMI ≥ 30)') || results.bmi > 25 ? (
                      <li>
                        <Typography variant="body2">
                          Work toward achieving a healthy weight through balanced nutrition and regular physical activity
                        </Typography>
                      </li>
                    ) : null}
                    
                    {results.riskFactors.includes('Hypertension') ? (
                      <li>
                        <Typography variant="body2">
                          Follow the DASH diet, reduce sodium intake, and consider consulting with a healthcare provider about blood pressure management
                        </Typography>
                      </li>
                    ) : null}
                    
                    {(results.riskFactors.includes('Elevated fasting glucose') || results.riskFactors.includes('Elevated HbA1c')) ? (
                      <li>
                        <Typography variant="body2">
                          Focus on reducing refined carbohydrates and added sugars, increase physical activity, and maintain a healthy weight
                        </Typography>
                      </li>
                    ) : null}
                    
                    {(results.riskFactors.includes('High LDL cholesterol') || results.riskFactors.includes('Low HDL cholesterol') || results.riskFactors.includes('High triglycerides')) ? (
                      <li>
                        <Typography variant="body2">
                          Increase consumption of omega-3 fatty acids, fiber, and consider the Mediterranean diet pattern
                        </Typography>
                      </li>
                    ) : null}
                    
                    {results.riskFactors.includes('Elevated inflammation (CRP)') ? (
                      <li>
                        <Typography variant="body2">
                          Focus on anti-inflammatory foods, manage stress, ensure adequate sleep, and consider omega-3 supplementation
                        </Typography>
                      </li>
                    ) : null}
                    
                    {results.riskFactors.includes('Smoking') ? (
                      <li>
                        <Typography variant="body2">
                          Quitting smoking is one of the most impactful changes you can make for your biological age and overall health
                        </Typography>
                      </li>
                    ) : null}
                    
                    {!results.positiveFactors.includes('Regular physical activity') ? (
                      <li>
                        <Typography variant="body2">
                          Aim for at least 150 minutes of moderate-intensity exercise per week
                        </Typography>
                      </li>
                    ) : null}
                    
                    {results.riskFactors.includes('Insufficient sleep') ? (
                      <li>
                        <Typography variant="body2">
                          Prioritize 7-8 hours of quality sleep each night
                        </Typography>
                      </li>
                    ) : null}
                    
                    <li>
                      <Typography variant="body2">
                        Practice stress management techniques like meditation, deep breathing, or yoga
                      </Typography>
                    </li>
                    
                    <li>
                      <Typography variant="body2">
                        Follow a primarily plant-based diet rich in vegetables, fruits, whole grains, and lean proteins
                      </Typography>
                    </li>
                  </ul>
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
                <strong>Disclaimer:</strong> This biological age calculation is an estimate based on available biomarkers and lifestyle factors. For a more accurate assessment, consult with a healthcare provider who can perform comprehensive testing and personalized analysis.
              </Typography>
            </Alert>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default BiologicalAgeCalculator;