import {
  getUserProfile, updateUserProfile as dbUpdateProfile,
  getPortfolio, upsertHolding, removeHolding,
  createRebalancingEvent, createTlhEvent,
  mockMarketData,
} from '../db/roboAdvisorDb.js';

/**
 * Generate investment recommendations based on user profile.
 */
export async function getInvestmentRecommendations(db, userId) {
  const profile = await getUserProfile(db, userId);
  let recommendedAllocation;

  switch (profile.riskTolerance) {
    case 'conservative':
      recommendedAllocation = { 'BND': 0.5, 'VTI': 0.3, 'Cash': 0.2 };
      break;
    case 'aggressive':
      recommendedAllocation = { 'BND': 0.1, 'VTI': 0.8, 'Cash': 0.1 };
      break;
    default:
      recommendedAllocation = { 'BND': 0.3, 'VTI': 0.5, 'Cash': 0.2 };
  }

  return { targetAllocation: recommendedAllocation };
}

/**
 * Buy shares of an asset.
 */
export async function buyAsset(db, userId, symbol, sharesToBuy, pricePerShare) {
  const portfolio = await getPortfolio(db, userId);

  if (!mockMarketData[symbol]) {
    return { success: false, message: `Market data not available for ${symbol}.` };
  }
  if (sharesToBuy <= 0) {
    return { success: false, message: 'Number of shares must be positive.' };
  }

  const transactionCost = 5;
  const existing = portfolio.holdings.find(h => h.symbol === symbol);
  let newShares, newAvgPrice;

  if (existing) {
    const totalCostExisting = existing.shares * existing.avgPrice;
    newShares = existing.shares + sharesToBuy;
    newAvgPrice = (totalCostExisting + (sharesToBuy * pricePerShare)) / newShares;
  } else {
    newShares = sharesToBuy;
    newAvgPrice = pricePerShare;
  }

  await upsertHolding(db, userId, {
    symbol,
    name: existing ? existing.name : symbol,
    shares: newShares,
    avgPrice: newAvgPrice,
    currentPrice: mockMarketData[symbol].currentPrice,
    sector: mockMarketData[symbol].sector,
  });

  const eventId = `REB-${Date.now()}`;
  await createRebalancingEvent(db, {
    eventId, userId, actionType: 'buy',
    assetSymbol: symbol, assetName: symbol,
    quantity: sharesToBuy, price: pricePerShare,
    transactionCost, status: 'completed',
  });

  return { success: true, message: `Successfully bought ${sharesToBuy} shares of ${symbol}.`, event: { eventId } };
}

/**
 * Sell shares of an asset.
 */
export async function sellAsset(db, userId, symbol, sharesToSell, pricePerShare) {
  const portfolio = await getPortfolio(db, userId);
  const profile = await getUserProfile(db, userId);
  const holding = portfolio.holdings.find(h => h.symbol === symbol);

  if (!holding) {
    return { success: false, message: `You do not own any shares of ${symbol}.` };
  }
  if (sharesToSell > holding.shares) {
    return { success: false, message: `You only have ${holding.shares} shares of ${symbol} to sell.` };
  }
  if (sharesToSell <= 0) {
    return { success: false, message: 'Number of shares must be positive.' };
  }

  const transactionCost = 5;
  const gainLossPerShare = pricePerShare - holding.avgPrice;
  const totalGainLoss = sharesToSell * gainLossPerShare;

  if (sharesToSell === holding.shares) {
    await removeHolding(db, userId, symbol);
  } else {
    await upsertHolding(db, userId, {
      ...holding,
      shares: holding.shares - sharesToSell,
    });
  }

  const eventId = `REB-${Date.now()}`;
  await createRebalancingEvent(db, {
    eventId, userId, actionType: 'sell',
    assetSymbol: symbol, assetName: symbol,
    quantity: sharesToSell, price: pricePerShare,
    transactionCost, status: 'completed',
  });

  let tlhEvent = null;
  if (profile.taxLossHarvestingOptIn && totalGainLoss < 0) {
    const replacementSymbol = symbol === 'TSLA' ? 'TSLF' : symbol === 'AAPL' ? 'APLF' : null;
    if (replacementSymbol && mockMarketData[replacementSymbol]) {
      const tlhId = `TLH-${Date.now()}`;
      await createTlhEvent(db, {
        eventId: tlhId, userId,
        soldSymbol: symbol, sharesSold: sharesToSell,
        realizedLossAmount: Math.abs(totalGainLoss),
        replacementSymbol, replacementName: `${symbol} ETF`,
        status: 'completed',
      });
      tlhEvent = { eventId: tlhId };
    }
  }

  return { success: true, message: `Successfully sold ${sharesToSell} shares of ${symbol}.`, event: { eventId }, tlhEvent };
}

/**
 * Check rebalancing status.
 */
export async function checkRebalancingStatus(db, userId) {
  const portfolio = await getPortfolio(db, userId);
  const profile = await getUserProfile(db, userId);
  let needsRebalance = false;
  const driftDetails = {};

  const totalValue = portfolio.holdings.reduce((sum, h) => sum + (h.shares * h.currentPrice), 0);
  if (totalValue === 0) return { needsRebalance: false, driftDetails: {} };

  const currentAllocations = {};
  portfolio.holdings.forEach(h => {
    const alloc = (h.shares * h.currentPrice) / totalValue;
    currentAllocations[h.symbol] = alloc;
    const target = profile.targetAllocation[h.symbol] || 0;
    const drift = alloc - target;

    if (Math.abs(drift) > profile.rebalancingThreshold) {
      needsRebalance = true;
      driftDetails[h.symbol] = {
        current: alloc.toFixed(4),
        target: target.toFixed(4),
        drift: drift.toFixed(4),
        action: drift > 0 ? 'sell' : 'buy',
        amountToAdjust: Math.abs(drift) * totalValue,
      };
    }
  });

  for (const symbol in profile.targetAllocation) {
    if (!currentAllocations[symbol]) {
      needsRebalance = true;
      driftDetails[symbol] = {
        current: '0.0000',
        target: profile.targetAllocation[symbol].toFixed(4),
        drift: profile.targetAllocation[symbol].toFixed(4),
        action: 'buy',
        amountToAdjust: profile.targetAllocation[symbol] * totalValue,
      };
    }
  }

  return { needsRebalance, driftDetails };
}

/**
 * Get tax-loss harvesting opportunities.
 */
export async function getTaxLossHarvestingOpportunities(db, userId) {
  const portfolio = await getPortfolio(db, userId);
  const profile = await getUserProfile(db, userId);

  if (!profile.taxLossHarvestingOptIn) {
    return { opportunities: [], message: 'Tax-loss harvesting is not enabled.' };
  }

  const opportunities = [];
  portfolio.holdings.forEach(h => {
    const gainLoss = h.shares * (h.currentPrice - h.avgPrice);
    if (gainLoss < 0) {
      const replacementSymbol = h.symbol === 'TSLA' ? 'TSLF' : h.symbol === 'AAPL' ? 'APLF' : null;
      if (replacementSymbol && mockMarketData[replacementSymbol]) {
        opportunities.push({
          eventId: `TLH-OP-${Date.now()}`,
          userId,
          soldAsset: { symbol: h.symbol, sharesSold: h.shares },
          realizedLossAmount: Math.abs(gainLoss),
          replacementAsset: { symbol: replacementSymbol, name: `${h.symbol} ETF` },
          status: 'potential',
        });
      }
    }
  });

  return { opportunities };
}
