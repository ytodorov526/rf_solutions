import { Hono } from 'hono';
import { getUserProfile, updateUserProfile } from '../db/roboAdvisorDb.js';
import { getPortfolio } from '../db/roboAdvisorDb.js';
import {
  getInvestmentRecommendations,
  buyAsset,
  sellAsset,
  checkRebalancingStatus,
  getTaxLossHarvestingOpportunities,
} from '../services/roboAdvisorService.js';

const app = new Hono();

// GET /api/profile/:userId — Get investment profile
app.get('/profile/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');
  if (!userId) return c.json({ message: 'User ID is required.' }, 400);
  try {
    const profile = await getUserProfile(db, userId);
    return c.json(profile);
  } catch (error) {
    return c.json({ message: 'Error fetching user profile', error: error.message }, 500);
  }
});

// PUT /api/profile/:userId — Update investment profile
app.put('/profile/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');
  const updates = await c.req.json();
  try {
    const updated = await updateUserProfile(db, userId, updates);
    return c.json(updated);
  } catch (error) {
    return c.json({ message: 'Error updating user profile', error: error.message }, 500);
  }
});

// GET /api/portfolio/:userId — Get user portfolio
app.get('/portfolio/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');
  if (!userId) return c.json({ message: 'User ID is required.' }, 400);
  try {
    const portfolio = await getPortfolio(db, userId);
    return c.json(portfolio);
  } catch (error) {
    return c.json({ message: 'Error fetching user portfolio', error: error.message }, 500);
  }
});

// POST /api/buy — Buy asset
app.post('/buy', async (c) => {
  const db = c.env.DB;
  const { userId, symbol, shares, price } = await c.req.json();
  try {
    const result = await buyAsset(db, userId, symbol, shares, price);
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    return c.json({ message: 'Error processing buy order', error: error.message }, 500);
  }
});

// POST /api/sell — Sell asset
app.post('/sell', async (c) => {
  const db = c.env.DB;
  const { userId, symbol, shares, price } = await c.req.json();
  try {
    const result = await sellAsset(db, userId, symbol, shares, price);
    return c.json(result, result.success ? 200 : 400);
  } catch (error) {
    return c.json({ message: 'Error processing sell order', error: error.message }, 500);
  }
});

// GET /api/rebalancing-status/:userId — Rebalancing status
app.get('/rebalancing-status/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');
  try {
    const status = await checkRebalancingStatus(db, userId);
    return c.json(status);
  } catch (error) {
    return c.json({ message: 'Error checking rebalancing status', error: error.message }, 500);
  }
});

// GET /api/tax-loss-harvesting-opportunities/:userId — TLH opportunities
app.get('/tax-loss-harvesting-opportunities/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');
  try {
    const opportunities = await getTaxLossHarvestingOpportunities(db, userId);
    return c.json(opportunities);
  } catch (error) {
    return c.json({ message: 'Error fetching tax-loss harvesting opportunities', error: error.message }, 500);
  }
});

// POST /api/recommendations/:userId — Investment recommendations
app.post('/recommendations/:userId', async (c) => {
  const db = c.env.DB;
  const userId = c.req.param('userId');
  if (!userId) return c.json({ message: 'User ID is required.' }, 400);
  try {
    const recommendations = await getInvestmentRecommendations(db, userId);
    return c.json(recommendations);
  } catch (error) {
    return c.json({ message: 'Error fetching investment recommendations', error: error.message }, 500);
  }
});

export default app;
