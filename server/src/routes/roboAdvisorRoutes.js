const express = require('express');
const router = express.Router();
const roboAdvisorService = require('../services/roboAdvisorService');

// GET user's investment profile
router.get('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) { // Add this check for a valid userId
    return res.status(400).json({ message: 'User ID is required.' });
  }
  try {
    const profile = roboAdvisorService.getUserProfile(userId);
    // Ensure the profile object is properly serialized to JSON
    // res.json(JSON.parse(JSON.stringify(profile))); // Previous attempt

    // Manually construct a plain object for serialization
    const profileData = {
      userId: profile.userId,
      riskTolerance: profile.riskTolerance,
      financialGoals: profile.financialGoals.map(goal => ({ // Explicitly map each goal
        name: goal.name,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
      })),
      targetAllocation: profile.targetAllocation,
      rebalancingThreshold: profile.rebalancingThreshold,
      rebalancingFrequency: profile.rebalancingFrequency,
      taxLossHarvestingOptIn: profile.taxLossHarvestingOptIn,
    };
    console.log('Profile object before manual serialization:', profile); // Log the instance
    console.log('Profile object after manual serialization:', JSON.parse(JSON.stringify(profileData))); // Log the plain object
    res.json(profileData);
  } catch (error) {
    console.error('Error in GET /profile/:userId route:', error); // Log the error
    res.status(500).json({ message: 'Error fetching user profile', error: error.message });
  }
});

// PUT update user's investment profile
router.put('/profile/:userId', (req, res) => {
  const { userId } = req.params;
  const profileUpdates = req.body; // Expecting { targetAllocation, rebalancingThreshold, rebalancingFrequency, taxLossHarvestingOptIn }
  try {
    const updatedProfile = roboAdvisorService.updateUserProfile(userId, profileUpdates);
    res.json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Error updating user profile', error: error.message });
  }
});

// GET user's portfolio
router.get('/portfolio/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) { // Add this check for a valid userId
    return res.status(400).json({ message: 'User ID is required.' });
  }
  try {
    const portfolio = roboAdvisorService.getUserPortfolio(userId);
    // Manually construct a plain object for serialization
    const portfolioData = portfolio.toJSON ? portfolio.toJSON() : portfolio; // Use toJSON if available, otherwise use the object directly
    console.log('Portfolio object before manual serialization:', portfolio); // Log the instance
    console.log('Portfolio object after manual serialization:', portfolioData); // Log the plain object
    res.json(portfolioData);
  } catch (error) {
    console.error('Error in GET /portfolio/:userId route:', error); // Log the error
    res.status(500).json({ message: 'Error fetching user portfolio', error: error.message });
  }
});

// POST simulate buying an asset
router.post('/buy', async (req, res) => {
  const { userId, symbol, shares, price } = req.body;
  try {
    const result = await roboAdvisorService.buyAsset(userId, symbol, shares, price);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing buy order', error: error.message });
  }
});

// POST simulate selling an asset
router.post('/sell', async (req, res) => {
  const { userId, symbol, shares, price } = req.body;
  try {
    const result = await roboAdvisorService.sellAsset(userId, symbol, shares, price);
    if (result.success) {
      res.status(200).json(result);
    } else {
      res.status(400).json(result);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error processing sell order', error: error.message });
  }
});

// GET rebalancing status
router.get('/rebalancing-status/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const status = roboAdvisorService.checkRebalancingStatus(userId);
    res.json(status);
  } catch (error) {
    res.status(500).json({ message: 'Error checking rebalancing status', error: error.message });
  }
});

// GET tax-loss harvesting opportunities
router.get('/tax-loss-harvesting-opportunities/:userId', (req, res) => {
  const { userId } = req.params;
  try {
    const opportunities = roboAdvisorService.getTaxLossHarvestingOpportunities(userId);
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tax-loss harvesting opportunities', error: error.message });
  }
});

// POST get investment recommendations
router.post('/recommendations/:userId', (req, res) => {
  const { userId } = req.params;
  if (!userId) { // Add this check for a valid userId
    return res.status(400).json({ message: 'User ID is required.' });
  }
  try {
    const recommendations = roboAdvisorService.getInvestmentRecommendations(userId);
    // Manually construct a plain object for serialization, though it should already be plain
    const recommendationsData = recommendations; // It's already a plain object
    console.log('Recommendations object:', recommendationsData); // Log the data
    res.json(recommendationsData);
  } catch (error) {
    console.error('Error in POST /recommendations/:userId route:', error); // Log the error
    res.status(500).json({ message: 'Error fetching investment recommendations', error: error.message });
  }
});

module.exports = router;