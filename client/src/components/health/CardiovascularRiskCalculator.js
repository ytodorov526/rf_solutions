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
  FormControlLabel,
  Checkbox,
  Divider,
  CircularProgress,
  Alert,
  Tooltip,
  IconButton,
  Slider
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import FavoriteIcon from '@mui/icons-material/Favorite';

const CardiovascularRiskCalculator = () => {
  const [formValues, setFormValues] = useState({
    age: '',
    gender: 'male',
    race: 'white',
    totalCholesterol: '',
    hdlCholesterol: '',
    systolicBP: '',
    treatedBP: false,
    smoker: false,
    diabetes: false,
    familyHistory: false,
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
    
    if (!formValues.age || isNaN(formValues.age) || formValues.age < 20 || formValues.age > 79) {
      newErrors.age = 'Age must be between 20 and 79';
      isValid = false;
    }
    
    if (!formValues.totalCholesterol || isNaN(formValues.totalCholesterol) || formValues.totalCholesterol < 100 || formValues.totalCholesterol > 400) {
      newErrors.totalCholesterol = 'Total cholesterol must be between 100 and 400 mg/dL';
      isValid = false;
    }
    
    if (!formValues.hdlCholesterol || isNaN(formValues.hdlCholesterol) || formValues.hdlCholesterol < 20 || formValues.hdlCholesterol > 100) {
      newErrors.hdlCholesterol = 'HDL cholesterol must be between 20 and 100 mg/dL';
      isValid = false;
    }
    
    if (!formValues.systolicBP || isNaN(formValues.systolicBP) || formValues.systolicBP < 90 || formValues.systolicBP > 200) {
      newErrors.systolicBP = 'Systolic blood pressure must be between 90 and 200 mmHg';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const calculateRisk = () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      // Implementation of Framingham Risk Score (simplified for demonstration)
      // In a real application, use a validated algorithm
      
      const {
        age, gender, race, totalCholesterol, hdlCholesterol,
        systolicBP, treatedBP, smoker, diabetes, familyHistory
      } = formValues;
      
      let riskPoints = 0;
      
      // Age points
      const ageVal = Number(age);
      if (gender === 'male') {
        if (ageVal >= 20 && ageVal <= 34) riskPoints += 0;
        else if (ageVal >= 35 && ageVal <= 39) riskPoints += 2;
        else if (ageVal >= 40 && ageVal <= 44) riskPoints += 5;
        else if (ageVal >= 45 && ageVal <= 49) riskPoints += 6;
        else if (ageVal >= 50 && ageVal <= 54) riskPoints += 8;
        else if (ageVal >= 55 && ageVal <= 59) riskPoints += 10;
        else if (ageVal >= 60 && ageVal <= 64) riskPoints += 11;
        else if (ageVal >= 65 && ageVal <= 69) riskPoints += 12;
        else if (ageVal >= 70 && ageVal <= 74) riskPoints += 14;
        else if (ageVal >= 75 && ageVal <= 79) riskPoints += 15;
      } else {
        if (ageVal >= 20 && ageVal <= 34) riskPoints += 0;
        else if (ageVal >= 35 && ageVal <= 39) riskPoints += 2;
        else if (ageVal >= 40 && ageVal <= 44) riskPoints += 4;
        else if (ageVal >= 45 && ageVal <= 49) riskPoints += 5;
        else if (ageVal >= 50 && ageVal <= 54) riskPoints += 7;
        else if (ageVal >= 55 && ageVal <= 59) riskPoints += 8;
        else if (ageVal >= 60 && ageVal <= 64) riskPoints += 9;
        else if (ageVal >= 65 && ageVal <= 69) riskPoints += 10;
        else if (ageVal >= 70 && ageVal <= 74) riskPoints += 11;
        else if (ageVal >= 75 && ageVal <= 79) riskPoints += 12;
      }
      
      // Total Cholesterol points
      const tcVal = Number(totalCholesterol);
      if (gender === 'male') {
        if (tcVal < 160) riskPoints += 0;
        else if (tcVal >= 160 && tcVal <= 199) riskPoints += 1;
        else if (tcVal >= 200 && tcVal <= 239) riskPoints += 2;
        else if (tcVal >= 240 && tcVal <= 279) riskPoints += 3;
        else if (tcVal >= 280) riskPoints += 4;
      } else {
        if (tcVal < 160) riskPoints += 0;
        else if (tcVal >= 160 && tcVal <= 199) riskPoints += 1;
        else if (tcVal >= 200 && tcVal <= 239) riskPoints += 3;
        else if (tcVal >= 240 && tcVal <= 279) riskPoints += 4;
        else if (tcVal >= 280) riskPoints += 5;
      }
      
      // HDL Cholesterol points
      const hdlVal = Number(hdlCholesterol);
      if (hdlVal >= 60) riskPoints -= 1;
      else if (hdlVal >= 50 && hdlVal <= 59) riskPoints += 0;
      else if (hdlVal >= 40 && hdlVal <= 49) riskPoints += 1;
      else if (hdlVal < 40) riskPoints += 2;
      
      // Systolic BP points
      const sbpVal = Number(systolicBP);
      if (!treatedBP) {
        if (sbpVal < 120) riskPoints += 0;
        else if (sbpVal >= 120 && sbpVal <= 129) riskPoints += 1;
        else if (sbpVal >= 130 && sbpVal <= 139) riskPoints += 2;
        else if (sbpVal >= 140 && sbpVal <= 159) riskPoints += 3;
        else if (sbpVal >= 160) riskPoints += 4;
      } else {
        if (sbpVal < 120) riskPoints += 0;
        else if (sbpVal >= 120 && sbpVal <= 129) riskPoints += 3;
        else if (sbpVal >= 130 && sbpVal <= 139) riskPoints += 4;
        else if (sbpVal >= 140 && sbpVal <= 159) riskPoints += 5;
        else if (sbpVal >= 160) riskPoints += 6;
      }
      
      // Smoker points
      if (smoker) {
        if (gender === 'male') riskPoints += 4;
        else riskPoints += 3;
      }
      
      // Diabetes points
      if (diabetes) {
        if (gender === 'male') riskPoints += 3;
        else riskPoints += 4;
      }
      
      // Family history points (simplified)
      if (familyHistory) riskPoints += 2;
      
      // Calculate 10-year risk
      let tenYearRisk = 0;
      if (gender === 'male') {
        if (riskPoints <= 4) tenYearRisk = 1;
        else if (riskPoints === 5) tenYearRisk = 2;
        else if (riskPoints === 6) tenYearRisk = 2;
        else if (riskPoints === 7) tenYearRisk = 3;
        else if (riskPoints === 8) tenYearRisk = 4;
        else if (riskPoints === 9) tenYearRisk = 5;
        else if (riskPoints === 10) tenYearRisk = 6;
        else if (riskPoints === 11) tenYearRisk = 8;
        else if (riskPoints === 12) tenYearRisk = 10;
        else if (riskPoints === 13) tenYearRisk = 12;
        else if (riskPoints === 14) tenYearRisk = 16;
        else if (riskPoints === 15) tenYearRisk = 20;
        else if (riskPoints === 16) tenYearRisk = 25;
        else if (riskPoints >= 17) tenYearRisk = 30;
      } else {
        if (riskPoints <= 11) tenYearRisk = 1;
        else if (riskPoints === 12) tenYearRisk = 1;
        else if (riskPoints === 13) tenYearRisk = 2;
        else if (riskPoints === 14) tenYearRisk = 2;
        else if (riskPoints === 15) tenYearRisk = 3;
        else if (riskPoints === 16) tenYearRisk = 4;
        else if (riskPoints === 17) tenYearRisk = 5;
        else if (riskPoints === 18) tenYearRisk = 6;
        else if (riskPoints === 19) tenYearRisk = 8;
        else if (riskPoints === 20) tenYearRisk = 11;
        else if (riskPoints === 21) tenYearRisk = 14;
        else if (riskPoints === 22) tenYearRisk = 17;
        else if (riskPoints === 23) tenYearRisk = 22;
        else if (riskPoints === 24) tenYearRisk = 27;
        else if (riskPoints >= 25) tenYearRisk = 30;
      }
      
      // Race adjustment (simplified)
      if (race === 'african_american') {
        tenYearRisk = Math.min(30, tenYearRisk * 1.3);
      } else if (race === 'hispanic') {
        tenYearRisk = Math.min(30, tenYearRisk * 0.9);
      } else if (race === 'asian') {
        tenYearRisk = Math.min(30, tenYearRisk * 0.8);
      }
      
      // Calculate lifetime risk
      let lifetimeRisk = 0;
      const optimalFactors = (
        !smoker && 
        !diabetes && 
        Number(totalCholesterol) < 180 && 
        Number(systolicBP) < 120 && 
        !treatedBP
      );
      
      const nonOptimalFactors = (
        !smoker && 
        !diabetes && 
        (Number(totalCholesterol) >= 180 || Number(systolicBP) >= 120 || treatedBP)
      );
      
      const elevatedFactors = (
        (smoker || diabetes) || 
        (Number(totalCholesterol) >= 240 || Number(systolicBP) >= 160 || treatedBP)
      );
      
      if (gender === 'male') {
        if (optimalFactors) lifetimeRisk = 5;
        else if (nonOptimalFactors) lifetimeRisk = 30;
        else if (elevatedFactors) lifetimeRisk = 50;
        else lifetimeRisk = 70;
      } else {
        if (optimalFactors) lifetimeRisk = 8;
        else if (nonOptimalFactors) lifetimeRisk = 30;
        else if (elevatedFactors) lifetimeRisk = 40;
        else lifetimeRisk = 50;
      }
      
      // Determine risk category
      let riskCategory = '';
      if (tenYearRisk < 5) riskCategory = 'Low';
      else if (tenYearRisk >= 5 && tenYearRisk < 10) riskCategory = 'Borderline';
      else if (tenYearRisk >= 10 && tenYearRisk < 20) riskCategory = 'Intermediate';
      else riskCategory = 'High';
      
      // Generate recommendations based on risk factors
      const recommendations = [];
      
      if (smoker) {
        recommendations.push('Quit smoking. This is one of the most important steps you can take to reduce your cardiovascular risk.');
      }
      
      if (Number(systolicBP) >= 130 || treatedBP) {
        recommendations.push('Work with your healthcare provider to optimize your blood pressure. Aim for a target below 130/80 mmHg.');
      }
      
      if (Number(totalCholesterol) >= 200) {
        recommendations.push('Consider dietary changes to improve your cholesterol levels, such as reducing saturated fats and increasing fiber intake.');
      }
      
      if (Number(hdlCholesterol) < 40) {
        recommendations.push('Focus on increasing your HDL ("good") cholesterol through regular physical activity and dietary changes.');
      }
      
      if (diabetes) {
        recommendations.push('Maintain tight control of your blood glucose levels and follow your diabetes management plan.');
      }
      
      // Always add general recommendations
      recommendations.push('Engage in at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous-intensity aerobic activity per week.');
      recommendations.push('Follow a heart-healthy dietary pattern such as the Mediterranean or DASH diet.');
      recommendations.push('Maintain a healthy weight or work toward weight loss if overweight or obese.');
      recommendations.push('Manage stress through techniques such as mindfulness, meditation, or other relaxation practices.');
      
      // Create results object
      const results = {
        tenYearRisk: Math.round(tenYearRisk * 10) / 10,
        lifetimeRisk: Math.round(lifetimeRisk),
        riskCategory,
        riskPoints,
        recommendations
      };
      
      setResults(results);
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setFormValues({
      age: '',
      gender: 'male',
      race: 'white',
      totalCholesterol: '',
      hdlCholesterol: '',
      systolicBP: '',
      treatedBP: false,
      smoker: false,
      diabetes: false,
      familyHistory: false,
    });
    setResults(null);
    setErrors({});
  };

  const getRiskCategoryColor = (category) => {
    switch (category) {
      case 'Low':
        return 'success.main';
      case 'Borderline':
        return 'warning.light';
      case 'Intermediate':
        return 'warning.main';
      case 'High':
        return 'error.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }} id="cardiovascular-risk-calculator">
      <Box display="flex" alignItems="center" mb={2}>
        <FavoriteIcon fontSize="large" color="error" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h2">
          Cardiovascular Risk Calculator
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Estimate your 10-year and lifetime risk of cardiovascular disease based on established risk factors. This calculator uses a model based on the Framingham Risk Score and ACC/AHA guidelines.
      </Typography>
      
      {!results ? (
        <Box>
          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={4}>
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
                  inputProps: { min: 20, max: 79 }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
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
            
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel id="race-label">Race/Ethnicity</InputLabel>
                <Select
                  labelId="race-label"
                  name="race"
                  value={formValues.race}
                  onChange={handleInputChange}
                  label="Race/Ethnicity"
                >
                  <MenuItem value="white">White</MenuItem>
                  <MenuItem value="african_american">African American</MenuItem>
                  <MenuItem value="hispanic">Hispanic/Latino</MenuItem>
                  <MenuItem value="asian">Asian</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Cholesterol Levels
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Total Cholesterol (mg/dL)"
                  name="totalCholesterol"
                  type="number"
                  value={formValues.totalCholesterol}
                  onChange={handleInputChange}
                  error={Boolean(errors.totalCholesterol)}
                  helperText={errors.totalCholesterol}
                  InputProps={{
                    inputProps: { min: 100, max: 400 }
                  }}
                />
                <Tooltip title="Total cholesterol is the sum of all types of cholesterol in your blood. Optimal levels are below 200 mg/dL." arrow placement="top">
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
                  error={Boolean(errors.hdlCholesterol)}
                  helperText={errors.hdlCholesterol}
                  InputProps={{
                    inputProps: { min: 20, max: 100 }
                  }}
                />
                <Tooltip title="HDL (High-Density Lipoprotein) is often called 'good' cholesterol. Higher levels are protective. Optimal levels are above 60 mg/dL." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Blood Pressure
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center">
                <TextField
                  fullWidth
                  label="Systolic Blood Pressure (mmHg)"
                  name="systolicBP"
                  type="number"
                  value={formValues.systolicBP}
                  onChange={handleInputChange}
                  error={Boolean(errors.systolicBP)}
                  helperText={errors.systolicBP}
                  InputProps={{
                    inputProps: { min: 90, max: 200 }
                  }}
                />
                <Tooltip title="Systolic blood pressure is the top number in a blood pressure reading, measuring the pressure in your arteries when your heart beats. Normal is less than 120 mmHg." arrow placement="top">
                  <IconButton size="small" sx={{ ml: 1 }}>
                    <HelpOutlineIcon fontSize="small" color="primary" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.treatedBP}
                    onChange={handleInputChange}
                    name="treatedBP"
                    color="primary"
                  />
                }
                label="Treated for high blood pressure"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Other Risk Factors
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.smoker}
                    onChange={handleInputChange}
                    name="smoker"
                    color="primary"
                  />
                }
                label="Current Smoker"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.diabetes}
                    onChange={handleInputChange}
                    name="diabetes"
                    color="primary"
                  />
                }
                label="Diabetes"
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.familyHistory}
                    onChange={handleInputChange}
                    name="familyHistory"
                    color="primary"
                  />
                }
                label="Family History of CVD"
                title="Premature CVD in a first-degree relative (father or brother before age 55, mother or sister before age 65)"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={calculateRisk}
              disabled={loading}
              sx={{ minWidth: 200 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : 'Calculate Risk'}
            </Button>
          </Box>
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Note:</strong> This calculator is for educational purposes only and should not replace professional medical advice. The risk estimates are based on population averages and may not account for all individual factors that could affect your cardiovascular risk.
              </Typography>
            </Alert>
          </Box>
        </Box>
      ) : (
        <Box>
          <Divider sx={{ my: 2 }} />
          
          <Typography variant="h5" component="h3" gutterBottom color="primary">
            Your Cardiovascular Risk Assessment
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  10-Year Risk
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
                      value={results.tenYearRisk > 30 ? 100 : (results.tenYearRisk / 30) * 100}
                      size={120}
                      thickness={5}
                      sx={{
                        color: getRiskCategoryColor(results.riskCategory),
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
                        {results.tenYearRisk}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" align="center" sx={{ color: getRiskCategoryColor(results.riskCategory) }}>
                    {results.riskCategory} Risk
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  Your estimated 10-year risk of atherosclerotic cardiovascular disease (heart attack or stroke) is <strong>{results.tenYearRisk}%</strong>, which is considered a <strong style={{ color: getRiskCategoryColor(results.riskCategory) }}>{results.riskCategory.toLowerCase()}</strong> risk level.
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  This means that in a group of 100 people with your risk profile, approximately {results.tenYearRisk} would be expected to experience a cardiovascular event within the next 10 years.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Lifetime Risk
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
                      value={results.lifetimeRisk}
                      size={120}
                      thickness={5}
                      sx={{
                        color: results.lifetimeRisk < 20 ? 'success.main' : 
                              results.lifetimeRisk < 40 ? 'warning.light' : 
                              results.lifetimeRisk < 60 ? 'warning.main' : 'error.main',
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
                        {results.lifetimeRisk}%
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Typography variant="h6" align="center">
                    Lifetime Risk
                  </Typography>
                </Box>
                
                <Typography variant="body1" paragraph>
                  Your estimated lifetime risk of cardiovascular disease is <strong>{results.lifetimeRisk}%</strong>.
                </Typography>
                
                <Typography variant="body2" color="text.secondary">
                  This represents your chance of developing cardiovascular disease at some point during your remaining lifespan, based on your current risk factor profile.
                </Typography>
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Note:</strong> Lifetime risk estimates are most valuable for younger adults who may have a low 10-year risk but could benefit from early preventive measures.
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recommendations
                </Typography>
                
                <Typography variant="body1" paragraph>
                  Based on your risk profile, consider these evidence-based recommendations:
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
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Always consult with your healthcare provider</strong> before making significant changes to your health regimen, especially if you have existing medical conditions or take medications.
                </Typography>
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
                <strong>Disclaimer:</strong> This risk assessment is based on established risk factors but does not consider all possible factors that might influence your individual cardiovascular risk. For a comprehensive evaluation, consult with a healthcare provider.
              </Typography>
            </Alert>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default CardiovascularRiskCalculator;