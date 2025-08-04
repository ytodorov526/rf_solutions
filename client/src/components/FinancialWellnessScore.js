import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, LinearProgress, Grid, Avatar,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton
} from '@mui/material';
import { Star, TrendingUp, AccountBalance, CreditCard, Savings, Edit } from '@mui/icons-material';

const FinancialWellnessScore = () => {
  const [score, setScore] = useState(85); // Out of 100
  const [categories, setCategories] = useState([
    { id: 1, name: 'Savings Rate', value: 90, icon: <Savings color="success" /> },
    { id: 2, name: 'Debt-to-Income Ratio', value: 70, icon: <CreditCard color="warning" /> },
    { id: 3, name: 'Net Worth', value: 80, icon: <AccountBalance color="primary" /> },
    { id: 4, name: 'Credit Score', value: 780, icon: <TrendingUp color="info" /> },
  ]);

  const [isEditScoreDialogOpen, setIsEditScoreDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [editedScore, setEditedScore] = useState(score.toString());
  const [editedCategoryName, setEditedCategoryName] = useState('');
  const [editedCategoryValue, setEditedCategoryValue] = useState('');

  const handleOpenEditScoreDialog = () => {
    setEditedScore(score.toString());
    setIsEditScoreDialogOpen(true);
  };

  const handleCloseEditScoreDialog = () => {
    setIsEditScoreDialogOpen(false);
  };

  const handleSaveScore = () => {
    const newScore = parseInt(editedScore, 10);
    if (!isNaN(newScore) && newScore >= 0 && newScore <= 100) {
      setScore(newScore);
      setIsEditScoreDialogOpen(false);
    } else {
      alert('Please enter a valid score between 0 and 100.');
    }
  };

  const handleOpenEditCategoryDialog = (category) => {
    setEditingCategory(category);
    setEditedCategoryName(category.name);
    setEditedCategoryValue(category.value.toString());
    setIsEditCategoryDialogOpen(true);
  };

  const handleCloseEditCategoryDialog = () => {
    setIsEditCategoryDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSaveCategory = () => {
    if (editingCategory && editedCategoryName && editedCategoryValue) {
      const categoryValue = parseInt(editedCategoryValue, 10);
      if (!isNaN(categoryValue)) {
        setCategories(categories.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, name: editedCategoryName, value: categoryValue }
            : cat
        ));
        handleCloseEditCategoryDialog();
      } else {
        alert('Please enter a valid value for the category.');
      }
    } else {
      alert('Please fill in all fields.');
    }
  };

  const calculateProgress = (value) => {
    // For Credit Score, we don't use a progress bar, so return a placeholder or handle differently
    // For simplicity here, we'll assume all other categories are percentages
    return value;
  };

  return (
    <Card elevation={3} sx={{ p: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Financial Wellness Score
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mr: 2 }}>
              <Typography variant="h4" color="white">{score}</Typography>
            </Avatar>
            <IconButton onClick={handleOpenEditScoreDialog}>
              <Edit fontSize="small" />
            </IconButton>
          </Box>
        </Box>
        <LinearProgress variant="determinate" value={score} sx={{ height: 12, borderRadius: 6, mb: 3 }} />
        <Typography variant="body2" color="text.secondary" align="center" paragraph>
          Your score indicates excellent financial health. Keep up the great work!
        </Typography>

        <Typography variant="h6" gutterBottom>Key Metrics</Typography>
        <Grid container spacing={2}>
          {categories.map((category) => (
            <Grid item xs={12} sm={6} key={category.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ mr: 2 }}>{category.icon}</Box>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1">{category.name}</Typography>
                  {category.name === 'Credit Score' ? (
                    <Typography variant="h6">{category.value}</Typography>
                  ) : (
                    <LinearProgress variant="determinate" value={calculateProgress(category.value)} sx={{ height: 8, borderRadius: 4 }} />
                  )}
                </Box>
                {category.name !== 'Credit Score' && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>{category.value}%</Typography>
                    <IconButton size="small" onClick={() => handleOpenEditCategoryDialog(category)} sx={{ ml: 1 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </CardContent>

      {/* Edit Score Dialog */}
      <Dialog open={isEditScoreDialogOpen} onClose={handleCloseEditScoreDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Financial Wellness Score</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Score (0-100)"
            fullWidth
            variant="outlined"
            type="number"
            value={editedScore}
            onChange={(e) => setEditedScore(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditScoreDialog}>Cancel</Button>
          <Button onClick={handleSaveScore} variant="contained">Save Score</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditCategoryDialogOpen} onClose={handleCloseEditCategoryDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit {editingCategory?.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Category Name"
            fullWidth
            variant="outlined"
            value={editedCategoryName}
            onChange={(e) => setEditedCategoryName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label={editingCategory?.name === 'Credit Score' ? "Credit Score Value" : "Category Value (%)"}
            fullWidth
            variant="outlined"
            type="number"
            value={editedCategoryValue}
            onChange={(e) => setEditedCategoryValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditCategoryDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default FinancialWellnessScore;