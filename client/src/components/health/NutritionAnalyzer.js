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
  Chip,
  Autocomplete,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
  LinearProgress
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import InfoIcon from '@mui/icons-material/Info';

// Common food items database with nutrition data
// Values per 100g unless specified
const commonFoods = [
  { 
    name: "Chicken Breast", 
    category: "Protein",
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    fiber: 0,
    micronutrients: [
      { name: "Vitamin B6", amount: "0.6mg", percentDV: 35 },
      { name: "Phosphorus", amount: "200mg", percentDV: 20 },
      { name: "Selenium", amount: "24μg", percentDV: 43 }
    ]
  },
  { 
    name: "Salmon", 
    category: "Protein",
    calories: 208,
    protein: 20,
    carbs: 0,
    fat: 13,
    fiber: 0,
    micronutrients: [
      { name: "Vitamin D", amount: "15μg", percentDV: 75 },
      { name: "Vitamin B12", amount: "3.2μg", percentDV: 133 },
      { name: "Omega-3", amount: "2.3g", percentDV: 100 }
    ]
  },
  { 
    name: "Eggs", 
    category: "Protein",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
    fiber: 0,
    micronutrients: [
      { name: "Vitamin B12", amount: "1.1μg", percentDV: 46 },
      { name: "Vitamin D", amount: "2μg", percentDV: 10 },
      { name: "Choline", amount: "294mg", percentDV: 53 }
    ]
  },
  { 
    name: "Greek Yogurt", 
    category: "Dairy",
    calories: 59,
    protein: 10,
    carbs: 3.6,
    fat: 0.4,
    fiber: 0,
    micronutrients: [
      { name: "Calcium", amount: "110mg", percentDV: 11 },
      { name: "Vitamin B12", amount: "0.5μg", percentDV: 21 },
      { name: "Probiotics", amount: "Varies", percentDV: null }
    ]
  },
  { 
    name: "Spinach", 
    category: "Vegetables",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    fat: 0.4,
    fiber: 2.2,
    micronutrients: [
      { name: "Vitamin K", amount: "483μg", percentDV: 403 },
      { name: "Vitamin A", amount: "469μg", percentDV: 52 },
      { name: "Folate", amount: "194μg", percentDV: 49 }
    ]
  },
  { 
    name: "Sweet Potato", 
    category: "Vegetables",
    calories: 86,
    protein: 1.6,
    carbs: 20,
    fat: 0.1,
    fiber: 3,
    micronutrients: [
      { name: "Vitamin A", amount: "709μg", percentDV: 79 },
      { name: "Vitamin C", amount: "2.4mg", percentDV: 3 },
      { name: "Potassium", amount: "337mg", percentDV: 7 }
    ]
  },
  { 
    name: "Broccoli", 
    category: "Vegetables",
    calories: 34,
    protein: 2.8,
    carbs: 7,
    fat: 0.4,
    fiber: 2.6,
    micronutrients: [
      { name: "Vitamin C", amount: "89mg", percentDV: 99 },
      { name: "Vitamin K", amount: "102μg", percentDV: 85 },
      { name: "Folate", amount: "63μg", percentDV: 16 }
    ]
  },
  { 
    name: "Avocado", 
    category: "Fruits",
    calories: 160,
    protein: 2,
    carbs: 8.5,
    fat: 14.7,
    fiber: 6.7,
    micronutrients: [
      { name: "Vitamin K", amount: "21μg", percentDV: 18 },
      { name: "Folate", amount: "81μg", percentDV: 20 },
      { name: "Potassium", amount: "485mg", percentDV: 10 }
    ]
  },
  { 
    name: "Berries (Mixed)", 
    category: "Fruits",
    calories: 57,
    protein: 0.7,
    carbs: 14,
    fat: 0.3,
    fiber: 3.5,
    micronutrients: [
      { name: "Vitamin C", amount: "30mg", percentDV: 33 },
      { name: "Manganese", amount: "0.6mg", percentDV: 26 },
      { name: "Antioxidants", amount: "High", percentDV: null }
    ]
  },
  { 
    name: "Quinoa", 
    category: "Grains",
    calories: 120,
    protein: 4.4,
    carbs: 21.3,
    fat: 1.9,
    fiber: 2.8,
    micronutrients: [
      { name: "Magnesium", amount: "64mg", percentDV: 15 },
      { name: "Phosphorus", amount: "152mg", percentDV: 15 },
      { name: "Manganese", amount: "1.2mg", percentDV: 52 }
    ]
  },
  { 
    name: "Brown Rice", 
    category: "Grains",
    calories: 112,
    protein: 2.6,
    carbs: 23.5,
    fat: 0.9,
    fiber: 1.8,
    micronutrients: [
      { name: "Manganese", amount: "1.1mg", percentDV: 48 },
      { name: "Magnesium", amount: "44mg", percentDV: 10 },
      { name: "Selenium", amount: "11.7μg", percentDV: 21 }
    ]
  },
  { 
    name: "Oats", 
    category: "Grains",
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    fat: 6.9,
    fiber: 10.6,
    micronutrients: [
      { name: "Manganese", amount: "4.9mg", percentDV: 213 },
      { name: "Phosphorus", amount: "523mg", percentDV: 52 },
      { name: "Beta-glucan", amount: "~4g", percentDV: null }
    ]
  },
  { 
    name: "Almonds", 
    category: "Nuts & Seeds",
    calories: 579,
    protein: 21.2,
    carbs: 21.7,
    fat: 49.9,
    fiber: 12.5,
    micronutrients: [
      { name: "Vitamin E", amount: "25.6mg", percentDV: 171 },
      { name: "Magnesium", amount: "270mg", percentDV: 64 },
      { name: "Manganese", amount: "2.3mg", percentDV: 100 }
    ]
  },
  { 
    name: "Chia Seeds", 
    category: "Nuts & Seeds",
    calories: 486,
    protein: 16.5,
    carbs: 42.1,
    fat: 30.7,
    fiber: 34.4,
    micronutrients: [
      { name: "Calcium", amount: "631mg", percentDV: 63 },
      { name: "Manganese", amount: "2.7mg", percentDV: 117 },
      { name: "Omega-3", amount: "17.8g", percentDV: 1100 }
    ]
  },
  { 
    name: "Olive Oil", 
    category: "Oils",
    calories: 884,
    protein: 0,
    carbs: 0,
    fat: 100,
    fiber: 0,
    micronutrients: [
      { name: "Vitamin E", amount: "14.4mg", percentDV: 96 },
      { name: "Vitamin K", amount: "60.2μg", percentDV: 50 },
      { name: "Polyphenols", amount: "Varies", percentDV: null }
    ]
  },
  { 
    name: "Lentils", 
    category: "Legumes",
    calories: 116,
    protein: 9,
    carbs: 20,
    fat: 0.4,
    fiber: 8,
    micronutrients: [
      { name: "Folate", amount: "181μg", percentDV: 45 },
      { name: "Iron", amount: "3.3mg", percentDV: 18 },
      { name: "Manganese", amount: "0.5mg", percentDV: 22 }
    ]
  }
];

const NutritionAnalyzer = () => {
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [currentFood, setCurrentFood] = useState(null);
  const [customFoodName, setCustomFoodName] = useState("");
  const [quantity, setQuantity] = useState(100);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFoodSelection = (event, newValue) => {
    setCurrentFood(newValue);
    if (newValue) {
      setErrors({...errors, food: null});
    }
  };

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
    if (event.target.value > 0) {
      setErrors({...errors, quantity: null});
    }
  };

  const handleAddFood = () => {
    // Validate inputs
    const newErrors = {};
    if (!currentFood && !customFoodName) {
      newErrors.food = "Please select a food item or enter a custom food name";
    }
    if (!quantity || quantity <= 0) {
      newErrors.quantity = "Please enter a valid quantity";
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    // Add food to the list
    const foodToAdd = {
      id: Date.now(), // Unique ID for each food item
      name: currentFood ? currentFood.name : customFoodName,
      quantity: Number(quantity),
      nutrients: currentFood ? {
        calories: currentFood.calories,
        protein: currentFood.protein,
        carbs: currentFood.carbs,
        fat: currentFood.fat,
        fiber: currentFood.fiber,
        micronutrients: currentFood.micronutrients
      } : null
    };
    
    setSelectedFoods([...selectedFoods, foodToAdd]);
    
    // Reset inputs
    setCurrentFood(null);
    setCustomFoodName("");
    setQuantity(100);
  };

  const handleRemoveFood = (id) => {
    setSelectedFoods(selectedFoods.filter(food => food.id !== id));
  };

  const handleAnalyze = () => {
    if (selectedFoods.length === 0) {
      setErrors({...errors, general: "Please add at least one food item to analyze"});
      return;
    }
    
    setLoading(true);
    
    // Simulate API call or complex calculation
    setTimeout(() => {
      // Calculate total nutrients
      const nutrientTotals = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        micronutrients: {}
      };
      
      selectedFoods.forEach(food => {
        if (food.nutrients) {
          const multiplier = food.quantity / 100; // Adjust for quantity
          
          nutrientTotals.calories += food.nutrients.calories * multiplier;
          nutrientTotals.protein += food.nutrients.protein * multiplier;
          nutrientTotals.carbs += food.nutrients.carbs * multiplier;
          nutrientTotals.fat += food.nutrients.fat * multiplier;
          nutrientTotals.fiber += food.nutrients.fiber * multiplier;
          
          // Process micronutrients
          if (food.nutrients.micronutrients) {
            food.nutrients.micronutrients.forEach(micro => {
              if (!nutrientTotals.micronutrients[micro.name]) {
                nutrientTotals.micronutrients[micro.name] = {
                  amount: 0,
                  percentDV: 0
                };
              }
              
              // Handle micronutrients with numeric values
              if (micro.percentDV !== null) {
                nutrientTotals.micronutrients[micro.name].percentDV += micro.percentDV * multiplier;
              }
            });
          }
        }
      });
      
      // Calculate macronutrient ratios
      const totalMacrosGrams = nutrientTotals.protein + nutrientTotals.carbs + nutrientTotals.fat;
      const macroRatios = {
        protein: (nutrientTotals.protein / totalMacrosGrams) * 100,
        carbs: (nutrientTotals.carbs / totalMacrosGrams) * 100,
        fat: (nutrientTotals.fat / totalMacrosGrams) * 100
      };
      
      // Generate recommendations
      const recommendations = [];
      
      // Check protein adequacy
      if (macroRatios.protein < 15) {
        recommendations.push("Consider increasing protein intake for better muscle maintenance and satiety. Good sources include lean meats, fish, eggs, dairy, legumes, and plant-based protein sources.");
      } else if (macroRatios.protein > 35) {
        recommendations.push("Your protein intake is quite high. While protein is important, balance with other macronutrients is key for overall health.");
      }
      
      // Check carbohydrate balance
      if (macroRatios.carbs < 30) {
        recommendations.push("Your carbohydrate intake is relatively low. Consider including more complex carbohydrates from whole grains, fruits, and vegetables for sustained energy and fiber.");
      } else if (macroRatios.carbs > 65) {
        recommendations.push("Your diet is very high in carbohydrates. Consider balancing with more protein and healthy fats for better satiety and metabolic health.");
      }
      
      // Check fat adequacy
      if (macroRatios.fat < 20) {
        recommendations.push("Consider including more healthy fats in your diet from sources like olive oil, avocados, nuts, and fatty fish for hormone production and nutrient absorption.");
      } else if (macroRatios.fat > 40) {
        recommendations.push("Your fat intake is relatively high. Focus on healthy fat sources and consider balancing with more protein and complex carbohydrates.");
      }
      
      // Check fiber adequacy
      if (nutrientTotals.fiber < 25) {
        recommendations.push("Consider increasing fiber intake by including more vegetables, fruits, legumes, and whole grains for digestive health and satiety.");
      }
      
      // Create results object
      const results = {
        totalNutrients: nutrientTotals,
        macroRatios: macroRatios,
        recommendations: recommendations
      };
      
      setResults(results);
      setShowResults(true);
      setLoading(false);
    }, 1500);
  };

  const handleReset = () => {
    setSelectedFoods([]);
    setCurrentFood(null);
    setCustomFoodName("");
    setQuantity(100);
    setShowResults(false);
    setResults(null);
    setErrors({});
  };

  return (
    <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }} id="nutrition-analyzer">
      <Box display="flex" alignItems="center" mb={2}>
        <RestaurantIcon fontSize="large" color="primary" sx={{ mr: 1 }} />
        <Typography variant="h4" component="h2">
          Nutrition Analyzer
        </Typography>
      </Box>
      
      <Typography variant="body1" paragraph>
        Analyze the nutritional composition of your meals by adding food items and their quantities. Get insights into macronutrient balance and personalized recommendations.
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      {!showResults ? (
        <Box>
          <Typography variant="h6" gutterBottom>
            Add Food Items
          </Typography>
          
          <Grid container spacing={2} alignItems="flex-end">
            <Grid item xs={12} sm={5}>
              <Autocomplete
                id="food-selector"
                options={commonFoods}
                getOptionLabel={(option) => option.name}
                groupBy={(option) => option.category}
                value={currentFood}
                onChange={handleFoodSelection}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Food Item"
                    error={Boolean(errors.food)}
                    helperText={errors.food}
                    fullWidth
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={3}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Or enter custom food:
              </Typography>
              <TextField
                fullWidth
                label="Custom Food Name"
                value={customFoodName}
                onChange={(e) => setCustomFoodName(e.target.value)}
                disabled={Boolean(currentFood)}
                error={Boolean(errors.food)}
              />
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                label="Quantity (g)"
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                InputProps={{
                  inputProps: { min: 1 }
                }}
                error={Boolean(errors.quantity)}
                helperText={errors.quantity}
              />
            </Grid>
            
            <Grid item xs={12} sm={2}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<AddCircleOutlineIcon />}
                onClick={handleAddFood}
              >
                Add
              </Button>
            </Grid>
          </Grid>
          
          {errors.general && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {errors.general}
            </Alert>
          )}
          
          {selectedFoods.length > 0 ? (
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Selected Foods
              </Typography>
              
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Food Item</TableCell>
                      <TableCell align="right">Quantity (g)</TableCell>
                      <TableCell align="right">Calories</TableCell>
                      <TableCell align="right">Protein (g)</TableCell>
                      <TableCell align="right">Carbs (g)</TableCell>
                      <TableCell align="right">Fat (g)</TableCell>
                      <TableCell align="right">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedFoods.map((food) => (
                      <TableRow key={food.id}>
                        <TableCell component="th" scope="row">
                          {food.name}
                          {!food.nutrients && (
                            <Chip 
                              size="small" 
                              label="custom" 
                              variant="outlined" 
                              sx={{ ml: 1, fontSize: '0.7rem' }} 
                            />
                          )}
                        </TableCell>
                        <TableCell align="right">{food.quantity}</TableCell>
                        <TableCell align="right">
                          {food.nutrients ? 
                            Math.round(food.nutrients.calories * food.quantity / 100) : 
                            '-'}
                        </TableCell>
                        <TableCell align="right">
                          {food.nutrients ? 
                            Math.round(food.nutrients.protein * food.quantity / 100 * 10) / 10 : 
                            '-'}
                        </TableCell>
                        <TableCell align="right">
                          {food.nutrients ? 
                            Math.round(food.nutrients.carbs * food.quantity / 100 * 10) / 10 : 
                            '-'}
                        </TableCell>
                        <TableCell align="right">
                          {food.nutrients ? 
                            Math.round(food.nutrients.fat * food.quantity / 100 * 10) / 10 : 
                            '-'}
                        </TableCell>
                        <TableCell align="right">
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveFood(food.id)}
                            aria-label="delete"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              
              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAnalyze}
                  disabled={loading}
                  sx={{ minWidth: 200 }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze Nutrition'}
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{ mt: 4, p: 3, bgcolor: '#f5f5f5', borderRadius: 2, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                No food items added yet. Select foods above to begin your nutrition analysis.
              </Typography>
            </Box>
          )}
          
          <Box sx={{ mt: 3, mb: 1 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Note:</strong> For custom food items, nutritional information won't be calculated. For the most accurate analysis, select foods from our database.
              </Typography>
            </Alert>
          </Box>
        </Box>
      ) : (
        <Box>
          <Typography variant="h5" component="h3" gutterBottom color="primary">
            Nutrition Analysis Results
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Macronutrient Summary
                </Typography>
                
                <Box sx={{ mb: 4 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Calories</Typography>
                    <Typography variant="body1" fontWeight="medium">
                      {Math.round(results.totalNutrients.calories)} kcal
                    </Typography>
                  </Box>
                  
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Protein</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {Math.round(results.totalNutrients.protein * 10) / 10}g ({Math.round(results.macroRatios.protein)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={results.macroRatios.protein} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', mb: 2, '.MuiLinearProgress-bar': { bgcolor: '#3f51b5' } }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Carbohydrates</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {Math.round(results.totalNutrients.carbs * 10) / 10}g ({Math.round(results.macroRatios.carbs)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={results.macroRatios.carbs} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', mb: 2, '.MuiLinearProgress-bar': { bgcolor: '#4caf50' } }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Fat</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {Math.round(results.totalNutrients.fat * 10) / 10}g ({Math.round(results.macroRatios.fat)}%)
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={results.macroRatios.fat} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', mb: 2, '.MuiLinearProgress-bar': { bgcolor: '#ff9800' } }}
                    />
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">Fiber</Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {Math.round(results.totalNutrients.fiber * 10) / 10}g
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(100, (results.totalNutrients.fiber / 25) * 100)} 
                      sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0', '.MuiLinearProgress-bar': { bgcolor: '#795548' } }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      {Math.round(results.totalNutrients.fiber)} of 25g daily recommendation ({Math.round((results.totalNutrients.fiber / 25) * 100)}%)
                    </Typography>
                  </Box>
                </Box>
                
                <Typography variant="subtitle1" gutterBottom>
                  Reference Guidelines:
                </Typography>
                <Typography variant="body2">
                  • Protein: 10-35% of total calories
                </Typography>
                <Typography variant="body2">
                  • Carbohydrates: 45-65% of total calories
                </Typography>
                <Typography variant="body2">
                  • Fat: 20-35% of total calories
                </Typography>
                <Typography variant="body2">
                  • Fiber: 25-30g per day for adults
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Micronutrient Analysis
                </Typography>
                
                {Object.keys(results.totalNutrients.micronutrients).length > 0 ? (
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Nutrient</TableCell>
                          <TableCell align="right">% Daily Value</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(results.totalNutrients.micronutrients)
                          .sort((a, b) => b[1].percentDV - a[1].percentDV)
                          .map(([name, data]) => (
                            <TableRow key={name}>
                              <TableCell component="th" scope="row">
                                {name}
                              </TableCell>
                              <TableCell align="right">
                                {data.percentDV !== null ? (
                                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <LinearProgress 
                                      variant="determinate" 
                                      value={Math.min(100, data.percentDV)} 
                                      sx={{ 
                                        width: '60%', 
                                        height: 8, 
                                        borderRadius: 4, 
                                        mr: 1,
                                        bgcolor: '#e0e0e0',
                                        '.MuiLinearProgress-bar': { 
                                          bgcolor: data.percentDV >= 100 ? '#4caf50' : 
                                                  data.percentDV >= 50 ? '#8bc34a' : 
                                                  data.percentDV >= 25 ? '#ffc107' : '#ff5722'
                                        }
                                      }}
                                    />
                                    <Typography variant="body2">
                                      {Math.round(data.percentDV)}%
                                    </Typography>
                                  </Box>
                                ) : (
                                  'N/A'
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Micronutrient information is only available for foods from our database.
                    </Typography>
                  </Box>
                )}
                
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    <InfoIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
                    Daily values are based on a 2000 calorie diet. Your requirements may vary.
                  </Typography>
                </Box>
              </Paper>
            </Grid>
            
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Personalized Recommendations
                </Typography>
                
                {results.recommendations.length > 0 ? (
                  <ul style={{ paddingLeft: 20 }}>
                    {results.recommendations.map((recommendation, index) => (
                      <li key={index}>
                        <Typography variant="body1" paragraph>
                          {recommendation}
                        </Typography>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Typography variant="body1" paragraph>
                    Your meal has a good balance of macronutrients. Continue to focus on including a variety of nutrient-dense foods for optimal health.
                  </Typography>
                )}
                
                <Typography variant="body2" sx={{ mt: 2 }}>
                  <strong>Key principles for balanced nutrition:</strong>
                </Typography>
                <ul style={{ paddingLeft: 20 }}>
                  <li>
                    <Typography variant="body2">
                      Emphasize whole, minimally processed foods
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Include a variety of colorful fruits and vegetables
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Balance macronutrients based on your activity level and health goals
                    </Typography>
                  </li>
                  <li>
                    <Typography variant="body2">
                      Stay hydrated and be mindful of portion sizes
                    </Typography>
                  </li>
                </ul>
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
              Analyze Another Meal
            </Button>
          </Box>
          
          <Box sx={{ mt: 3 }}>
            <Alert severity="info">
              <Typography variant="body2">
                <strong>Disclaimer:</strong> This nutrition analysis is an estimation and for educational purposes only. For personalized nutrition advice, consult with a registered dietitian or healthcare provider.
              </Typography>
            </Alert>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default NutritionAnalyzer;