import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  FormGroup,
  Chip,
  IconButton,
  CircularProgress,
  Divider,
  Alert,
  AlertTitle,
  Slider,
  InputAdornment,
  Tooltip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const projectTypes = [
  'Antenna Design',
  'RF Circuit Design',
  'Radar System',
  'Signal Processing',
  'EMI/EMC Testing',
  'Wireless IoT',
  'Satellite Communications',
  'Custom RF Solution',
  'Other'
];

const frequencyBands = [
  'HF (3-30 MHz)',
  'VHF (30-300 MHz)',
  'UHF (300-1000 MHz)',
  'L Band (1-2 GHz)',
  'S Band (2-4 GHz)',
  'C Band (4-8 GHz)',
  'X Band (8-12 GHz)',
  'Ku Band (12-18 GHz)',
  'K Band (18-27 GHz)',
  'Ka Band (27-40 GHz)',
  'V Band (40-75 GHz)',
  'W Band (75-110 GHz)',
  'Custom Range'
];

const timelines = [
  'Urgent (1-2 weeks)',
  'Short Term (1-2 months)',
  'Medium Term (3-6 months)',
  'Long Term (6+ months)',
  'Flexible'
];

const budgetRanges = [
  'Less than $10,000',
  '$10,000 - $25,000',
  '$25,000 - $50,000',
  '$50,000 - $100,000',
  'Above $100,000',
  'To be determined'
];

const STEPS = ['Project Information', 'Technical Requirements', 'Contact Details', 'Review'];

function ProjectRequestForm({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [formValues, setFormValues] = useState({
    projectName: '',
    projectType: '',
    projectDescription: '',
    frequencyBands: [],
    customFrequencyRange: '',
    powerRequirements: '',
    physicalConstraints: '',
    environmentalConditions: [],
    standardsCompliance: [],
    customStandards: '',
    timeline: '',
    budgetRange: '',
    attachments: [],
    additionalNotes: '',
    name: '',
    company: '',
    jobTitle: '',
    email: '',
    phone: '',
    preferredContactMethod: 'email',
    existingCustomer: false
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  // For slider
  const [temperatureRange, setTemperatureRange] = useState([-10, 40]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues({
      ...formValues,
      [name]: checked
    });
  };
  
  const handleMultiSelectChange = (field, value) => {
    let newValues;
    if (formValues[field].includes(value)) {
      newValues = formValues[field].filter(item => item !== value);
    } else {
      newValues = [...formValues[field], value];
    }
    setFormValues({
      ...formValues,
      [field]: newValues
    });
  };
  
  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFormValues({
        ...formValues,
        attachments: [...formValues.attachments, ...newFiles]
      });
    }
  };
  
  const handleRemoveFile = (index) => {
    const newFiles = [...formValues.attachments];
    newFiles.splice(index, 1);
    setFormValues({
      ...formValues,
      attachments: newFiles
    });
  };
  
  const handleTemperatureChange = (event, newValue) => {
    setTemperatureRange(newValue);
  };
  
  const validateStep = () => {
    const newErrors = {};
    let isValid = true;
    
    if (activeStep === 0) {
      if (!formValues.projectName.trim()) {
        newErrors.projectName = 'Project name is required';
        isValid = false;
      }
      if (!formValues.projectType) {
        newErrors.projectType = 'Project type is required';
        isValid = false;
      }
      if (!formValues.projectDescription.trim()) {
        newErrors.projectDescription = 'Project description is required';
        isValid = false;
      } else if (formValues.projectDescription.length < 50) {
        newErrors.projectDescription = 'Please provide more details (min 50 characters)';
        isValid = false;
      }
    } else if (activeStep === 1) {
      if (formValues.frequencyBands.length === 0) {
        newErrors.frequencyBands = 'Please select at least one frequency band';
        isValid = false;
      }
      if (formValues.frequencyBands.includes('Custom Range') && !formValues.customFrequencyRange) {
        newErrors.customFrequencyRange = 'Please specify your custom frequency range';
        isValid = false;
      }
    } else if (activeStep === 2) {
      if (!formValues.name.trim()) {
        newErrors.name = 'Name is required';
        isValid = false;
      }
      if (!formValues.email.trim()) {
        newErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
        newErrors.email = 'Please enter a valid email address';
        isValid = false;
      }
      if (!formValues.company.trim()) {
        newErrors.company = 'Company name is required';
        isValid = false;
      }
      if (formValues.preferredContactMethod === 'phone' && !formValues.phone) {
        newErrors.phone = 'Phone number is required when selected as preferred contact method';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prevActiveStep => prevActiveStep + 1);
    }
  };
  
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1);
  };
  
  const handleSubmit = async () => {
    setSubmitting(true);
    setSubmitError('');
    
    try {
      // In a real application, you would submit form data to your backend
      // For demo purposes, simulate an API call with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful submission
      setSubmitSuccess(true);
      
      // Reset form after submission (in a real app this would be after successful API response)
      setTimeout(() => {
        setActiveStep(0);
        setFormValues({
          projectName: '',
          projectType: '',
          projectDescription: '',
          frequencyBands: [],
          customFrequencyRange: '',
          powerRequirements: '',
          physicalConstraints: '',
          environmentalConditions: [],
          standardsCompliance: [],
          customStandards: '',
          timeline: '',
          budgetRange: '',
          attachments: [],
          additionalNotes: '',
          name: '',
          company: '',
          jobTitle: '',
          email: '',
          phone: '',
          preferredContactMethod: 'email',
          existingCustomer: false
        });
        setTemperatureRange([-10, 40]);
        setSubmitting(false);
        setSubmitSuccess(false);
        onClose();
      }, 2000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was an error submitting your project request. Please try again or contact us directly.');
      setSubmitting(false);
    }
  };
  
  const getStepContent = (step) => {
    switch (step) {
      case 0: // Project Information
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Project Name"
                name="projectName"
                value={formValues.projectName}
                onChange={handleChange}
                error={!!errors.projectName}
                helperText={errors.projectName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                select
                label="Project Type"
                name="projectType"
                value={formValues.projectType}
                onChange={handleChange}
                error={!!errors.projectType}
                helperText={errors.projectType}
              >
                {projectTypes.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={6}
                label="Project Description"
                name="projectDescription"
                value={formValues.projectDescription}
                onChange={handleChange}
                placeholder="Please describe your project needs, goals, and any specific requirements..."
                error={!!errors.projectDescription}
                helperText={errors.projectDescription}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Timeline"
                name="timeline"
                value={formValues.timeline}
                onChange={handleChange}
              >
                {timelines.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Budget Range"
                name="budgetRange"
                value={formValues.budgetRange}
                onChange={handleChange}
              >
                {budgetRanges.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        );
      
      case 1: // Technical Requirements
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth error={!!errors.frequencyBands}>
                <FormLabel component="legend">
                  Frequency Bands
                  <Tooltip title="Select all frequency bands relevant to your project">
                    <IconButton size="small">
                      <HelpOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </FormLabel>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {frequencyBands.map((band) => (
                    <Chip
                      key={band}
                      label={band}
                      onClick={() => handleMultiSelectChange('frequencyBands', band)}
                      color={formValues.frequencyBands.includes(band) ? 'primary' : 'default'}
                      variant={formValues.frequencyBands.includes(band) ? 'filled' : 'outlined'}
                    />
                  ))}
                </Box>
                {errors.frequencyBands && (
                  <Typography color="error" variant="caption">
                    {errors.frequencyBands}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            {formValues.frequencyBands.includes('Custom Range') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Custom Frequency Range"
                  name="customFrequencyRange"
                  value={formValues.customFrequencyRange}
                  onChange={handleChange}
                  placeholder="e.g., 2.4-2.5 GHz"
                  error={!!errors.customFrequencyRange}
                  helperText={errors.customFrequencyRange}
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Power Requirements"
                name="powerRequirements"
                value={formValues.powerRequirements}
                onChange={handleChange}
                placeholder="e.g., Power supply voltage, current consumption, battery life"
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Physical Constraints"
                name="physicalConstraints"
                value={formValues.physicalConstraints}
                onChange={handleChange}
                placeholder="e.g., Size, weight, mounting considerations"
              />
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Environmental Conditions</FormLabel>
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.environmentalConditions.includes('Indoor')}
                            onChange={() => handleMultiSelectChange('environmentalConditions', 'Indoor')}
                          />
                        }
                        label="Indoor"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.environmentalConditions.includes('Outdoor')}
                            onChange={() => handleMultiSelectChange('environmentalConditions', 'Outdoor')}
                          />
                        }
                        label="Outdoor"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.environmentalConditions.includes('Marine')}
                            onChange={() => handleMultiSelectChange('environmentalConditions', 'Marine')}
                          />
                        }
                        label="Marine"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.environmentalConditions.includes('High Humidity')}
                            onChange={() => handleMultiSelectChange('environmentalConditions', 'High Humidity')}
                          />
                        }
                        label="High Humidity"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.environmentalConditions.includes('Vibration')}
                            onChange={() => handleMultiSelectChange('environmentalConditions', 'Vibration')}
                          />
                        }
                        label="Vibration"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.environmentalConditions.includes('Dust/Particles')}
                            onChange={() => handleMultiSelectChange('environmentalConditions', 'Dust/Particles')}
                          />
                        }
                        label="Dust/Particles"
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <FormLabel component="legend">Temperature Range (°C)</FormLabel>
              <Box sx={{ px: 2, py: 1 }}>
                <Slider
                  value={temperatureRange}
                  onChange={handleTemperatureChange}
                  valueLabelDisplay="on"
                  min={-40}
                  max={85}
                  step={5}
                />
              </Box>
            </Grid>
            
            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Standards Compliance</FormLabel>
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.standardsCompliance.includes('FCC')}
                            onChange={() => handleMultiSelectChange('standardsCompliance', 'FCC')}
                          />
                        }
                        label="FCC"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.standardsCompliance.includes('CE')}
                            onChange={() => handleMultiSelectChange('standardsCompliance', 'CE')}
                          />
                        }
                        label="CE"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.standardsCompliance.includes('ETSI')}
                            onChange={() => handleMultiSelectChange('standardsCompliance', 'ETSI')}
                          />
                        }
                        label="ETSI"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.standardsCompliance.includes('ISO')}
                            onChange={() => handleMultiSelectChange('standardsCompliance', 'ISO')}
                          />
                        }
                        label="ISO"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.standardsCompliance.includes('MIL-STD')}
                            onChange={() => handleMultiSelectChange('standardsCompliance', 'MIL-STD')}
                          />
                        }
                        label="MIL-STD"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox 
                            checked={formValues.standardsCompliance.includes('Other')}
                            onChange={() => handleMultiSelectChange('standardsCompliance', 'Other')}
                          />
                        }
                        label="Other"
                      />
                    </Grid>
                  </Grid>
                </FormGroup>
              </FormControl>
            </Grid>
            
            {formValues.standardsCompliance.includes('Other') && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Other Standards"
                  name="customStandards"
                  value={formValues.customStandards}
                  onChange={handleChange}
                  placeholder="Please specify other standards requirements"
                />
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ mt: 1, mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Attachments (Specifications, diagrams, etc.)
                </Typography>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Files
                  <input
                    type="file"
                    multiple
                    hidden
                    onChange={handleFileChange}
                  />
                </Button>
              </Box>
              
              {formValues.attachments.length > 0 && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Uploaded Files:
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {formValues.attachments.map((file, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Typography variant="body2" noWrap sx={{ flex: 1 }}>
                          {file.name} ({(file.size / 1024).toFixed(1)} KB)
                        </Typography>
                        <IconButton size="small" onClick={() => handleRemoveFile(index)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
            </Grid>
          </Grid>
        );
      
      case 2: // Contact Details
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Your Name"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Company/Organization"
                name="company"
                value={formValues.company}
                onChange={handleChange}
                error={!!errors.company}
                helperText={errors.company}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Job Title"
                name="jobTitle"
                value={formValues.jobTitle}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formValues.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={formValues.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset">
                <FormLabel component="legend">Preferred Contact Method</FormLabel>
                <RadioGroup
                  name="preferredContactMethod"
                  value={formValues.preferredContactMethod}
                  onChange={handleChange}
                >
                  <FormControlLabel value="email" control={<Radio />} label="Email" />
                  <FormControlLabel value="phone" control={<Radio />} label="Phone" />
                </RadioGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={formValues.existingCustomer}
                    onChange={handleCheckboxChange}
                    name="existingCustomer"
                  />
                }
                label="I am an existing customer"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Additional Notes"
                name="additionalNotes"
                value={formValues.additionalNotes}
                onChange={handleChange}
                placeholder="Any other information you'd like to share..."
              />
            </Grid>
          </Grid>
        );
      
      case 3: // Review
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Alert severity="info" sx={{ mb: 3 }}>
                <AlertTitle>Please review your information</AlertTitle>
                Review the details below and click Submit when ready. You'll receive a confirmation email with a copy of your project request.
              </Alert>
              
              <Typography variant="h6" gutterBottom>Project Information</Typography>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Project Name:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.projectName}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Project Type:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.projectType}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Timeline:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.timeline || 'Not specified'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Budget Range:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.budgetRange || 'Not specified'}</Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Project Description:</Typography>
                    <Typography variant="body2" sx={{ mt: 1, pl: 2 }}>
                      {formValues.projectDescription}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Technical Requirements</Typography>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Frequency Bands:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {formValues.frequencyBands.length > 0 ? 
                        formValues.frequencyBands.map((band) => (
                          <Chip key={band} label={band} size="small" />
                        )) : 
                        <Typography>None selected</Typography>
                      }
                    </Box>
                  </Grid>
                  
                  {formValues.frequencyBands.includes('Custom Range') && (
                    <>
                      <Grid item xs={4}>
                        <Typography variant="subtitle2">Custom Frequency:</Typography>
                      </Grid>
                      <Grid item xs={8}>
                        <Typography>{formValues.customFrequencyRange}</Typography>
                      </Grid>
                    </>
                  )}
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Power Requirements:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.powerRequirements || 'Not specified'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Physical Constraints:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.physicalConstraints || 'Not specified'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Environment:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {formValues.environmentalConditions.length > 0 ? 
                        formValues.environmentalConditions.map((condition) => (
                          <Chip key={condition} label={condition} size="small" />
                        )) : 
                        <Typography>None selected</Typography>
                      }
                    </Box>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Temperature Range:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{temperatureRange[0]}°C to {temperatureRange[1]}°C</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Standards:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {formValues.standardsCompliance.length > 0 ? 
                        formValues.standardsCompliance.map((standard) => (
                          <Chip key={standard} label={standard} size="small" />
                        )) : 
                        <Typography>None selected</Typography>
                      }
                    </Box>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Attachments:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    {formValues.attachments.length > 0 ? (
                      <Box component="ul" sx={{ pl: 2, m: 0 }}>
                        {formValues.attachments.map((file, index) => (
                          <Typography component="li" key={index} variant="body2">
                            {file.name} ({(file.size / 1024).toFixed(1)} KB)
                          </Typography>
                        ))}
                      </Box>
                    ) : (
                      <Typography>No files attached</Typography>
                    )}
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="h6" gutterBottom>Contact Information</Typography>
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Name:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.name}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Company:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.company}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Job Title:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.jobTitle || 'Not specified'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Email:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.email}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Phone:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.phone || 'Not provided'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Preferred Contact:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.preferredContactMethod === 'email' ? 'Email' : 'Phone'}</Typography>
                  </Grid>
                  
                  <Grid item xs={4}>
                    <Typography variant="subtitle2">Customer Status:</Typography>
                  </Grid>
                  <Grid item xs={8}>
                    <Typography>{formValues.existingCustomer ? 'Existing customer' : 'New customer'}</Typography>
                  </Grid>
                  
                  {formValues.additionalNotes && (
                    <>
                      <Grid item xs={12}>
                        <Typography variant="subtitle2">Additional Notes:</Typography>
                        <Typography variant="body2" sx={{ mt: 1, pl: 2 }}>
                          {formValues.additionalNotes}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              </Box>
            </Grid>
          </Grid>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Dialog
      open={open}
      onClose={!submitting ? onClose : undefined}
      maxWidth="md"
      fullWidth
      scroll="paper"
      aria-labelledby="project-request-dialog-title"
    >
      <DialogTitle id="project-request-dialog-title" sx={{ pb: 1 }}>
        <Typography variant="h5">RF Engineering Project Request</Typography>
        {!submitting && !submitSuccess && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </DialogTitle>
      
      <Box sx={{ px: 3 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      
      <DialogContent dividers sx={{ py: 3, maxHeight: '70vh' }}>
        {submitSuccess ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography variant="h5" gutterBottom color="primary">
              Project Request Submitted Successfully!
            </Typography>
            <Typography paragraph>
              Thank you for submitting your RF engineering project request. We have received your information and a confirmation email has been sent to {formValues.email}.
            </Typography>
            <Typography paragraph>
              One of our engineers will review your request and contact you within 1-2 business days to discuss next steps.
            </Typography>
            <Typography variant="subtitle2" color="textSecondary">
              Reference ID: PRJ-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
            </Typography>
          </Box>
        ) : (
          <>
            {submitError && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {submitError}
              </Alert>
            )}
            
            {getStepContent(activeStep)}
          </>
        )}
      </DialogContent>
      
      {!submitSuccess && (
        <DialogActions sx={{ px: 3, py: 2, justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || submitting}
            onClick={handleBack}
          >
            Back
          </Button>
          <Box>
            {activeStep === STEPS.length - 1 ? (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={submitting}
                startIcon={submitting && <CircularProgress size={20} />}
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </Button>
            ) : (
              <Button 
                variant="contained" 
                onClick={handleNext}
                disabled={submitting}
              >
                Next
              </Button>
            )}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  );
}

export default ProjectRequestForm;