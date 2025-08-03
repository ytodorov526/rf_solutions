import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, LinearProgress, List, ListItem, ListItemText,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';

const GoalTracking = () => {
  const [goals, setGoals] = useState([
    { id: 1, name: 'Down Payment for House', target: 50000, saved: 15000 },
    { id: 2, name: 'New Car', target: 25000, saved: 8000 },
    { id: 3, name: 'Vacation Fund', target: 5000, saved: 3500 },
  ]);

  const [isAddGoalDialogOpen, setIsAddGoalDialogOpen] = useState(false);
  const [isEditGoalDialogOpen, setIsEditGoalDialogOpen] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);

  const [newGoalName, setNewGoalName] = useState('');
  const [newGoalTarget, setNewGoalTarget] = useState('');
  const [newGoalSaved, setNewGoalSaved] = useState('');

  const handleOpenAddGoalDialog = () => {
    setNewGoalName('');
    setNewGoalTarget('');
    setNewGoalSaved('');
    setIsAddGoalDialogOpen(true);
  };

  const handleCloseAddGoalDialog = () => {
    setIsAddGoalDialogOpen(false);
  };

  const handleOpenEditGoalDialog = (goal) => {
    setCurrentGoal(goal);
    setNewGoalName(goal.name);
    setNewGoalTarget(goal.target.toString());
    setNewGoalSaved(goal.saved.toString());
    setIsEditGoalDialogOpen(true);
  };

  const handleCloseEditGoalDialog = () => {
    setIsEditGoalDialogOpen(false);
    setCurrentGoal(null);
  };

  const handleAddGoal = () => {
    if (newGoalName && newGoalTarget && newGoalSaved) {
      const newGoal = {
        id: goals.length + 1,
        name: newGoalName,
        target: parseFloat(newGoalTarget),
        saved: parseFloat(newGoalSaved),
      };
      setGoals([...goals, newGoal]);
      handleCloseAddGoalDialog();
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleEditGoal = () => {
    if (currentGoal && newGoalName && newGoalTarget && newGoalSaved) {
      setGoals(goals.map(goal =>
        goal.id === currentGoal.id
          ? { ...goal, name: newGoalName, target: parseFloat(newGoalTarget), saved: parseFloat(newGoalSaved) }
          : goal
      ));
      handleCloseEditGoalDialog();
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleDeleteGoal = (goalId) => {
    setGoals(goals.filter(goal => goal.id !== goalId));
  };

  const calculateProgress = (saved, target) => {
    if (target === 0) return 0;
    return (saved / target) * 100;
  };

  return (
    <Card elevation={3} sx={{ p: 3, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Financial Goals
          </Typography>
          <Button variant="contained" startIcon={<Add />} size="small" onClick={handleOpenAddGoalDialog}>
            Add New Goal
          </Button>
        </Box>
        <List>
          {goals.map((goal) => (
            <ListItem key={goal.id} divider sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
              <Box sx={{ width: '100%', mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">{goal.name}</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Typography variant="body1" sx={{ mr: 1 }}>${goal.saved.toLocaleString()} / ${goal.target.toLocaleString()}</Typography>
                    <IconButton size="small" onClick={() => handleOpenEditGoalDialog(goal)} sx={{ ml: 1 }}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" onClick={() => handleDeleteGoal(goal.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
                <LinearProgress variant="determinate" value={calculateProgress(goal.saved, goal.target)} sx={{ height: 10, borderRadius: 5 }} />
              </Box>
              <Typography variant="caption" color="text.secondary">
                {calculateProgress(goal.saved, goal.target).toFixed(1)}% funded
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>

      {/* Add Goal Dialog */}
      <Dialog open={isAddGoalDialogOpen} onClose={handleCloseAddGoalDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Financial Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Name"
            fullWidth
            variant="outlined"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Target Amount"
            fullWidth
            variant="outlined"
            type="number"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
          <TextField
            margin="dense"
            label="Currently Saved"
            fullWidth
            variant="outlined"
            type="number"
            value={newGoalSaved}
            onChange={(e) => setNewGoalSaved(e.target.value)}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddGoalDialog}>Cancel</Button>
          <Button onClick={handleAddGoal} variant="contained">Add Goal</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Goal Dialog */}
      <Dialog open={isEditGoalDialogOpen} onClose={handleCloseEditGoalDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Financial Goal</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Goal Name"
            fullWidth
            variant="outlined"
            value={newGoalName}
            onChange={(e) => setNewGoalName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Target Amount"
            fullWidth
            variant="outlined"
            type="number"
            value={newGoalTarget}
            onChange={(e) => setNewGoalTarget(e.target.value)}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
          <TextField
            margin="dense"
            label="Currently Saved"
            fullWidth
            variant="outlined"
            type="number"
            value={newGoalSaved}
            onChange={(e) => setNewGoalSaved(e.target.value)}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditGoalDialog}>Cancel</Button>
          <Button onClick={handleEditGoal} variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default GoalTracking;