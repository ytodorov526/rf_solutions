const { Portfolio, Holding } = require('../models/Portfolio');
const UserInvestmentProfile = require('../models/UserInvestmentProfile');
const RebalancingEvent = require('../models/RebalancingEvent');
const TaxLossHarvestingEvent = require('../models/TaxLossHarvestingEvent');

// In-memory storage for demonstration purposes. In a real application, this would be a database.
const userProfiles = {}; // { userId: UserInvestmentProfile }
const portfolios = {}; // { userId: Portfolio }
const rebalancingEvents = [];
const taxLossHarvestingEvents = [];

// Mock market data - in a real app, this would come from an external API
const mockMarketData = {
  'SPY': { currentPrice: 448.50, sector: 'ETF' },
  'AAPL': { currentPrice: 183.10, sector: 'Technology' },
  'TSLA': { currentPrice: 234.50, sector: 'Automotive' },
  'MSFT': { currentPrice: 327.00, sector: 'Technology' },
  // Add more mock data as needed
  };
  
  /**
   * Generates investment recommendations based on user profile.
   * @param {string} userId
   * @returns {{targetAllocation: object}}
   */
  const getInvestmentRecommendations = (userId) => {
    const profile = getUserProfile(userId);
    let recommendedAllocation = {};
  
    // Simple allocation strategy based on risk tolerance
    switch (profile.riskTolerance) {
      case 'conservative':
        recommendedAllocation = { 'BND': 0.5, 'VTI': 0.3, 'Cash': 0.2 }; // Bonds, Stocks, Cash
        break;
      case 'moderate':
        recommendedAllocation = { 'BND': 0.3, 'VTI': 0.5, 'Cash': 0.2 };
        break;
      case 'aggressive':
        recommendedAllocation = { 'BND': 0.1, 'VTI': 0.8, 'Cash': 0.1 };
        break;
      default: // Default to moderate if riskTolerance is not set or unknown
        recommendedAllocation = { 'BND': 0.3, 'VTI': 0.5, 'Cash': 0.2 };
    }
  
    // In a more advanced scenario, financial goals (e.g., time horizon) would also influence allocation.
    // For example, longer time horizons might support more aggressive allocations.
  
    return { targetAllocation: recommendedAllocation };
  };

/**
 * Fetches or creates a user's investment profile.
 * @param {string} userId
 * @returns {UserInvestmentProfile}
 */
const getUserProfile = (userId) => {
  if (!userProfiles[userId]) {
    // Create a default profile if it doesn't exist
    userProfiles[userId] = new UserInvestmentProfile({
      userId,
      targetAllocation: { 'SPY': 0.4, 'AAPL': 0.3, 'MSFT': 0.3 }, // Example default allocation
      rebalancingThreshold: 0.05,
      rebalancingFrequency: 'quarterly',
      taxLossHarvestingOptIn: false,
    });
  }
  return userProfiles[userId];
};

/**
 * Updates a user's investment profile.
 * @param {string} userId
 * @param {object} profileUpdates - Object containing updates for the profile.
 * @returns {UserInvestmentProfile} The updated profile.
 */
const updateUserProfile = (userId, profileUpdates) => {
  const profile = getUserProfile(userId);
  if (profileUpdates.targetAllocation) profile.updateTargetAllocation(profileUpdates.targetAllocation);
  if (profileUpdates.rebalancingThreshold !== undefined) profile.updateRebalancingThreshold(profileUpdates.rebalancingThreshold);
  if (profileUpdates.rebalancingFrequency) profile.updateRebalancingFrequency(profileUpdates.rebalancingFrequency);
  if (profileUpdates.taxLossHarvestingOptIn !== undefined) profile.toggleTaxLossHarvesting(); // Assuming toggle for simplicity, could be set directly
  if (profileUpdates.riskTolerance) profile.riskTolerance = profileUpdates.riskTolerance; // Directly update riskTolerance
  if (profileUpdates.financialGoals) profile.financialGoals = profileUpdates.financialGoals; // Directly update financialGoals

  // Persist changes (in a real app, save to DB)
  userProfiles[userId] = profile;
  return profile;
};

/**
 * Fetches or creates a user's portfolio.
 * This is a simplified mock. In a real app, this would fetch data from a brokerage API or database.
 * @param {string} userId
 * @returns {Portfolio}
 */
const getUserPortfolio = (userId) => {
  if (!portfolios[userId]) {
    // Mock initial portfolio data
    const initialHoldings = [
      new Holding({ symbol: 'SPY', name: 'S&P 500 ETF', shares: 25, avgPrice: 420.50, currentPrice: mockMarketData['SPY'].currentPrice, sector: mockMarketData['SPY'].sector }),
      new Holding({ symbol: 'AAPL', name: 'Apple Inc.', shares: 10, avgPrice: 175.20, currentPrice: mockMarketData['AAPL'].currentPrice, sector: mockMarketData['AAPL'].sector }),
      new Holding({ symbol: 'TSLA', name: 'Tesla Inc.', shares: 5, avgPrice: 240.00, currentPrice: mockMarketData['TSLA'].currentPrice, sector: mockMarketData['TSLA'].sector }),
      new Holding({ symbol: 'MSFT', name: 'Microsoft Corp.', shares: 8, avgPrice: 310.50, currentPrice: mockMarketData['MSFT'].currentPrice, sector: mockMarketData['MSFT'].sector }),
    ];
    portfolios[userId] = new Portfolio({ userId, holdings: initialHoldings });
  } else {
    // Update current prices from mock market data if portfolio exists
    portfolios[userId].holdings.forEach(holding => {
      if (mockMarketData[holding.symbol]) {
        holding.currentPrice = mockMarketData[holding.symbol].currentPrice;
        holding.sector = mockMarketData[holding.symbol].sector;
      }
    });
  }
  return portfolios[userId];
};

/**
 * Simulates buying shares of an asset.
 * @param {string} userId
 * @param {string} symbol
 * @param {number} sharesToBuy
 * @param {number} pricePerShare
 * @returns {Promise<{success: boolean, message: string, event?: RebalancingEvent}>}
 */
const buyAsset = async (userId, symbol, sharesToBuy, pricePerShare) => {
  const portfolio = getUserPortfolio(userId);
  const currentProfile = getUserProfile(userId);

  // Basic validation
  if (!mockMarketData[symbol]) {
    return { success: false, message: `Market data not available for ${symbol}.` };
  }
  if (sharesToBuy <= 0) {
    return { success: false, message: 'Number of shares must be positive.' };
  }

  const transactionCost = 5; // Example transaction fee
  const totalCost = (sharesToBuy * pricePerShare) + transactionCost;

  // In a real scenario, check for sufficient funds, etc.

  const existingHoldingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
  let newAvgPrice;
  let newShares;

  if (existingHoldingIndex !== -1) {
    const existingHolding = portfolio.holdings[existingHoldingIndex];
    const totalCostOfExisting = existingHolding.shares * existingHolding.avgPrice;
    newShares = existingHolding.shares + sharesToBuy;
    newAvgPrice = (totalCostOfExisting + (sharesToBuy * pricePerShare)) / newShares;
    
    portfolio.holdings[existingHoldingIndex] = new Holding({
      ...existingHolding,
      shares: newShares,
      avgPrice: newAvgPrice,
      currentPrice: mockMarketData[symbol].currentPrice, // Update current price
      sector: mockMarketData[symbol].sector
    });
  } else {
    newShares = sharesToBuy;
    newAvgPrice = pricePerShare;
    portfolio.holdings.push(new Holding({
      symbol,
      name: symbol, // Placeholder, ideally fetch name from market data
      shares: newShares,
      avgPrice: newAvgPrice,
      currentPrice: mockMarketData[symbol].currentPrice,
      sector: mockMarketData[symbol].sector
    }));
  }

  // Log the rebalancing event if this buy was part of rebalancing
  const rebalancingEvent = new RebalancingEvent({
    eventId: `REB-${Date.now()}`,
    userId,
    actionType: 'buy',
    asset: { symbol, name: symbol }, // Placeholder name
    quantity: sharesToBuy,
    price: pricePerShare,
    transactionCost,
    status: 'completed'
  });
  rebalancingEvents.push(rebalancingEvent);

  // Update portfolio in storage
  portfolios[userId] = portfolio;

  return { success: true, message: `Successfully bought ${sharesToBuy} shares of ${symbol}.`, event: rebalancingEvent };
};

/**
 * Simulates selling shares of an asset.
 * @param {string} userId
 * @param {string} symbol
 * @param {number} sharesToSell
 * @param {number} pricePerShare
 * @returns {Promise<{success: boolean, message: string, event?: RebalancingEvent, tlhEvent?: TaxLossHarvestingEvent}>}
 */
const sellAsset = async (userId, symbol, sharesToSell, pricePerShare) => {
  const portfolio = getUserPortfolio(userId);
  const profile = getUserProfile(userId);
  const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);

  if (holdingIndex === -1) {
    return { success: false, message: `You do not own any shares of ${symbol}.` };
  }

  const holding = portfolio.holdings[holdingIndex];
  if (sharesToSell > holding.shares) {
    return { success: false, message: `You only have ${holding.shares} shares of ${symbol} to sell.` };
  }
  if (sharesToSell <= 0) {
    return { success: false, message: 'Number of shares must be positive.' };
  }

  const transactionCost = 5; // Example transaction fee
  const proceeds = (sharesToSell * pricePerShare) - transactionCost;
  const gainLossPerShare = pricePerShare - holding.avgPrice;
  const totalGainLoss = sharesToSell * gainLossPerShare;

  let updatedHoldings = [...portfolio.holdings];

  if (sharesToSell === holding.shares) {
    // Remove holding if all shares are sold
    updatedHoldings.splice(holdingIndex, 1);
  } else {
    // Update shares and potentially avgPrice if needed (though avgPrice calculation on partial sale can be complex)
    const remainingShares = holding.shares - sharesToSell;
    // For simplicity, we'll keep the original avgPrice for remaining shares, but a more accurate calculation might be needed.
    updatedHoldings[holdingIndex] = new Holding({
      ...holding,
      shares: remainingShares,
      // avgPrice: ((holding.shares * holding.avgPrice) - (sharesToSell * holding.avgPrice)) / remainingShares // More accurate avg price calculation
    });
  }

  portfolio.holdings = updatedHoldings;
  portfolios[userId] = portfolio; // Update storage

  let tlhEvent = null;
  if (profile.taxLossHarvestingOptIn && totalGainLoss < 0) {
    // Simulate finding a replacement asset (e.g., a similar ETF)
    // In a real system, this would involve complex logic to find suitable replacements
    const replacementSymbol = symbol === 'TSLA' ? 'TSLF' : symbol === 'AAPL' ? 'APLF' : null; // Example replacements
    if (replacementSymbol && mockMarketData[replacementSymbol]) {
      tlhEvent = new TaxLossHarvestingEvent({
        eventId: `TLH-${Date.now()}`,
        userId,
        soldAsset: { symbol, sharesSold: sharesToSell },
        realizedLossAmount: Math.abs(totalGainLoss),
        replacementAsset: { symbol: replacementSymbol, name: `${symbol} ETF` }, // Placeholder name
        status: 'completed'
      });
      taxLossHarvestingEvents.push(tlhEvent);
      // In a real system, you might automatically buy the replacement asset here or prompt the user.
    }
  }

  // Log the rebalancing event if this sell was part of rebalancing
  const rebalancingEvent = new RebalancingEvent({
    eventId: `REB-${Date.now()}`,
    userId,
    actionType: 'sell',
    asset: { symbol, name: symbol }, // Placeholder name
    quantity: sharesToSell,
    price: pricePerShare,
    transactionCost,
    status: 'completed'
  });
  rebalancingEvents.push(rebalancingEvent);

  return { success: true, message: `Successfully sold ${sharesToSell} shares of ${symbol}.`, event: rebalancingEvent, tlhEvent };
};

/**
 * Checks if rebalancing is needed based on user profile and current portfolio.
 * @param {string} userId
 * @returns {{needsRebalance: boolean, driftDetails: object}}
 */
const checkRebalancingStatus = (userId) => {
  const portfolio = getUserPortfolio(userId);
  const profile = getUserProfile(userId);
  let needsRebalance = false;
  const driftDetails = {};

  const currentAllocations = {};
  const totalPortfolioValue = portfolio.getTotalValue();

  if (totalPortfolioValue === 0) {
    return { needsRebalance: false, driftDetails: {} };
  }

  // Calculate current allocations
  portfolio.holdings.forEach(holding => {
    const assetValue = holding.shares * holding.currentPrice;
    const allocation = assetValue / totalPortfolioValue;
    currentAllocations[holding.symbol] = allocation;

    const targetAllocation = profile.targetAllocation[holding.symbol] || 0;
    const drift = allocation - targetAllocation;

    if (Math.abs(drift) > profile.rebalancingThreshold) {
      needsRebalance = true;
      driftDetails[holding.symbol] = {
        current: allocation.toFixed(4),
        target: targetAllocation.toFixed(4),
        drift: drift.toFixed(4),
        action: drift > 0 ? 'sell' : 'buy',
        amountToAdjust: Math.abs(drift) * totalPortfolioValue // Approximate value to buy/sell
      };
    }
  });

  // Check for assets in target allocation but not in portfolio
  for (const symbol in profile.targetAllocation) {
    if (!currentAllocations[symbol]) {
      needsRebalance = true;
      driftDetails[symbol] = {
        current: '0.0000',
        target: profile.targetAllocation[symbol].toFixed(4),
        drift: profile.targetAllocation[symbol].toFixed(4),
        action: 'buy',
        amountToAdjust: profile.targetAllocation[symbol] * totalPortfolioValue
      };
    }
  }

  // Calendar-based check (simplified)
  // In a real system, this would involve checking the last rebalance date against the frequency.
  // For now, we'll assume threshold-based is the primary driver or that calendar checks are done elsewhere.

  return { needsRebalance, driftDetails };
};

/**
 * Gets available tax-loss harvesting opportunities.
 * @param {string} userId
 * @returns {{opportunities: TaxLossHarvestingEvent[], message?: string}}
 */
const getTaxLossHarvestingOpportunities = (userId) => {
  const portfolio = getUserPortfolio(userId);
  const profile = getUserProfile(userId);

  if (!profile.taxLossHarvestingOptIn) {
    return { opportunities: [], message: "Tax-loss harvesting is not enabled." };
  }

  const opportunities = [];
  portfolio.holdings.forEach(holding => {
    const gainLoss = holding.getGainLoss();
    // Check for unrealized losses
    if (gainLoss < 0) {
      // Simulate finding a replacement asset
      const replacementSymbol = holding.symbol === 'TSLA' ? 'TSLF' : holding.symbol === 'AAPL' ? 'APLF' : null;
      if (replacementSymbol && mockMarketData[replacementSymbol]) {
        opportunities.push(new TaxLossHarvestingEvent({
          eventId: `TLH-OP-${Date.now()}`,
          userId,
          soldAsset: { symbol: holding.symbol, sharesSold: holding.shares },
          realizedLossAmount: Math.abs(holding.shares * (holding.currentPrice - holding.avgPrice)), // This is the potential loss if sold now
          replacementAsset: { symbol: replacementSymbol, name: `${holding.symbol} ETF` },
          status: 'potential' // Indicate this is a potential opportunity, not yet executed
        }));
      }
    }
  });

  return { opportunities };
};

module.exports = {
  getUserProfile,
  updateUserProfile,
  getUserPortfolio,
  buyAsset,
  sellAsset,
  checkRebalancingStatus,
  getTaxLossHarvestingOpportunities,
  getInvestmentRecommendations, // Add the new function
  // Mock data access for testing/demonstration
  _mockMarketData: mockMarketData,
  _userProfiles: userProfiles,
  _portfolios: portfolios,
  _rebalancingEvents: rebalancingEvents,
  _taxLossHarvestingEvents: taxLossHarvestingEvents
};