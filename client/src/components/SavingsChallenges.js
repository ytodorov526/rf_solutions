import React, { useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, LinearProgress, List, ListItem, ListItemText,
  Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, IconButton
} from '@mui/material';
import { Add, Star, Edit, CheckCircle } from '@mui/icons-material';

const SavingsChallenges = () => {
  const [challenges, setChallenges] = useState([
    { id: 1, name: 'No-Spend Month', description: 'Challenge yourself to spend only on essentials for a month.', progress: 75, status: 'In Progress' },
    { id: 2, name: 'Round-Up Savings', description: 'Round up your purchases to the nearest dollar and save the difference.', progress: 90, status: 'In Progress' },
    { id: 3, name: '52-Week Savings', description: 'Save $1 in week 1, $2 in week 2, and so on.', progress: 30, status: 'In Progress' },
  ]);

  const [isAddChallengeDialogOpen, setIsAddChallengeDialogOpen] = useState(false);
  const [isUpdateProgressDialogOpen, setIsUpdateProgressDialogOpen] = useState(false);
  const [currentChallenge, setCurrentChallenge] = useState(null);

  const [newChallengeName, setNewChallengeName] = useState('');
  const [newChallengeDescription, setNewChallengeDescription] = useState('');
  const [updateProgressAmount, setUpdateProgressAmount] = useState('');

  const handleOpenAddChallengeDialog = () => {
    setNewChallengeName('');
    setNewChallengeDescription('');
    setIsAddChallengeDialogOpen(true);
  };

  const handleCloseAddChallengeDialog = () => {
    setIsAddChallengeDialogOpen(false);
  };

  const handleOpenUpdateProgressDialog = (challenge) => {
    setCurrentChallenge(challenge);
    setUpdateProgressAmount('');
    setIsUpdateProgressDialogOpen(true);
  };

  const handleCloseUpdateProgressDialog = () => {
    setIsUpdateProgressDialogOpen(false);
    setCurrentChallenge(null);
  };

  const handleAddChallenge = () => {
    if (newChallengeName && newChallengeDescription) {
      const newChallenge = {
        id: challenges.length + 1,
        name: newChallengeName,
        description: newChallengeDescription,
        progress: 0,
        status: 'In Progress',
      };
      setChallenges([...challenges, newChallenge]);
      handleCloseAddChallengeDialog();
    } else {
      alert('Please fill in all fields.');
    }
  };

  const handleUpdateProgress = () => {
    if (currentChallenge && updateProgressAmount) {
      const amount = parseFloat(updateProgressAmount);
      if (amount > 0) {
        setChallenges(challenges.map(challenge => {
          if (challenge.id === currentChallenge.id) {
            const newProgress = challenge.progress + amount;
            // Cap progress at 100%
            const cappedProgress = Math.min(newProgress, 100);
            return { ...challenge, progress: cappedProgress, status: cappedProgress === 100 ? 'Completed' : 'In Progress' };
          }
          return challenge;
        }));
        handleCloseUpdateProgressDialog();
      } else {
        alert('Please enter a valid amount.');
      }
    } else {
      alert('Please enter an amount to update progress.');
    }
  };

  const handleMarkComplete = (challengeId) => {
    setChallenges(challenges.map(challenge =>
      challenge.id === challengeId
        ? { ...challenge, progress: 100, status: 'Completed' }
        : challenge
    ));
  };

  const getChallengeStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'In Progress': return 'primary';
      default: return 'default';
    }
  };

  return (
    <Card elevation={3} sx={{ p: 3, mb: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Savings Challenges
          </Typography>
          <Button variant="contained" startIcon={<Add />} size="small" onClick={handleOpenAddChallengeDialog}>
            Join Challenge
          </Button>
        </Box>
        <List>
          {challenges.map((challenge) => (
            <ListItem key={challenge.id} divider sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 2 }}>
              <Box sx={{ width: '100%', mb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Star sx={{ color: 'warning.main', mr: 1 }} />
                    <Typography variant="h6">{challenge.name}</Typography>
                  </Box>
                  <Chip label={challenge.status} color={getChallengeStatusColor(challenge.status)} size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {challenge.description}
                </Typography>
                <LinearProgress variant="determinate" value={challenge.progress} sx={{ height: 10, borderRadius: 5 }} />
              </Box>
              <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="caption" color="text.secondary">
                  {challenge.progress.toFixed(1)}% complete
                </Typography>
                <Box>
                  {challenge.status !== 'Completed' && (
                    <>
                      <IconButton size="small" onClick={() => handleOpenUpdateProgressDialog(challenge)} sx={{ ml: 1 }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleMarkComplete(challenge.id)} sx={{ ml: 1 }}>
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    </>
                  )}
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      </CardContent>

      {/* Add Challenge Dialog */}
      <Dialog open={isAddChallengeDialogOpen} onClose={handleCloseAddChallengeDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Join a Savings Challenge</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Challenge Name"
            fullWidth
            variant="outlined"
            value={newChallengeName}
            onChange={(e) => setNewChallengeName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Challenge Description"
            fullWidth
            variant="outlined"
            multiline
            rows={3}
            value={newChallengeDescription}
            onChange={(e) => setNewChallengeDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddChallengeDialog}>Cancel</Button>
          <Button onClick={handleAddChallenge} variant="contained">Join Challenge</Button>
        </DialogActions>
      </Dialog>

      {/* Update Progress Dialog */}
      <Dialog open={isUpdateProgressDialogOpen} onClose={handleCloseUpdateProgressDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Update Progress for "{currentChallenge?.name}"</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Amount to Add to Progress"
            fullWidth
            variant="outlined"
            type="number"
            value={updateProgressAmount}
            onChange={(e) => setUpdateProgressAmount(e.target.value)}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>%</Typography>,
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateProgressDialog}>Cancel</Button>
          <Button onClick={handleUpdateProgress} variant="contained">Update Progress</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
};

export default SavingsChallenges;