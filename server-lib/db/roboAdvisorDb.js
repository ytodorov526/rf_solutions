// Mock market data - in a real app, this would come from an external API
const mockMarketData = {
  'SPY': { currentPrice: 448.50, sector: 'ETF' },
  'AAPL': { currentPrice: 183.10, sector: 'Technology' },
  'TSLA': { currentPrice: 234.50, sector: 'Automotive' },
  'MSFT': { currentPrice: 327.00, sector: 'Technology' },
};

// --- User Investment Profiles ---

export async function getUserProfile(db, userId) {
  let row = await db.prepare('SELECT * FROM user_investment_profiles WHERE user_id = ?').bind(userId).first();
  if (!row) {
    // Create a default profile
    await db.prepare(
      `INSERT INTO user_investment_profiles (user_id, risk_tolerance, financial_goals, target_allocation, rebalancing_threshold, rebalancing_frequency, tax_loss_harvesting_opt_in)
       VALUES (?, 'moderate', '[]', ?, 0.05, 'quarterly', 0)`
    ).bind(userId, JSON.stringify({ 'SPY': 0.4, 'AAPL': 0.3, 'MSFT': 0.3 })).run();
    row = await db.prepare('SELECT * FROM user_investment_profiles WHERE user_id = ?').bind(userId).first();
  }
  return deserializeProfile(row);
}

export async function updateUserProfile(db, userId, updates) {
  // Ensure profile exists first
  await getUserProfile(db, userId);

  const fields = [];
  const values = [];
  if (updates.riskTolerance !== undefined) { fields.push('risk_tolerance = ?'); values.push(updates.riskTolerance); }
  if (updates.financialGoals !== undefined) { fields.push('financial_goals = ?'); values.push(JSON.stringify(updates.financialGoals)); }
  if (updates.targetAllocation !== undefined) { fields.push('target_allocation = ?'); values.push(JSON.stringify(updates.targetAllocation)); }
  if (updates.rebalancingThreshold !== undefined) { fields.push('rebalancing_threshold = ?'); values.push(updates.rebalancingThreshold); }
  if (updates.rebalancingFrequency !== undefined) { fields.push('rebalancing_frequency = ?'); values.push(updates.rebalancingFrequency); }
  if (updates.taxLossHarvestingOptIn !== undefined) { fields.push('tax_loss_harvesting_opt_in = ?'); values.push(updates.taxLossHarvestingOptIn ? 1 : 0); }
  if (fields.length === 0) return getUserProfile(db, userId);

  values.push(userId);
  await db.prepare(
    `UPDATE user_investment_profiles SET ${fields.join(', ')} WHERE user_id = ?`
  ).bind(...values).run();
  return getUserProfile(db, userId);
}

function deserializeProfile(row) {
  return {
    userId: row.user_id,
    riskTolerance: row.risk_tolerance,
    financialGoals: JSON.parse(row.financial_goals || '[]'),
    targetAllocation: JSON.parse(row.target_allocation || '{}'),
    rebalancingThreshold: row.rebalancing_threshold,
    rebalancingFrequency: row.rebalancing_frequency,
    taxLossHarvestingOptIn: !!row.tax_loss_harvesting_opt_in,
  };
}

// --- Portfolio Holdings ---

export async function getPortfolio(db, userId) {
  let { results } = await db.prepare(
    'SELECT * FROM portfolio_holdings WHERE user_id = ?'
  ).bind(userId).all();

  if (results.length === 0) {
    // Seed default holdings
    const defaults = [
      { symbol: 'SPY', name: 'S&P 500 ETF', shares: 25, avgPrice: 420.50 },
      { symbol: 'AAPL', name: 'Apple Inc.', shares: 10, avgPrice: 175.20 },
      { symbol: 'TSLA', name: 'Tesla Inc.', shares: 5, avgPrice: 240.00 },
      { symbol: 'MSFT', name: 'Microsoft Corp.', shares: 8, avgPrice: 310.50 },
    ];
    for (const h of defaults) {
      const md = mockMarketData[h.symbol] || { currentPrice: h.avgPrice, sector: 'Other' };
      await db.prepare(
        'INSERT INTO portfolio_holdings (user_id, symbol, name, shares, avg_price, current_price, sector) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(userId, h.symbol, h.name, h.shares, h.avgPrice, md.currentPrice, md.sector).run();
    }
    const refreshed = await db.prepare('SELECT * FROM portfolio_holdings WHERE user_id = ?').bind(userId).all();
    results = refreshed.results;
  } else {
    // Update current prices from mock market data
    for (const row of results) {
      if (mockMarketData[row.symbol]) {
        await db.prepare(
          'UPDATE portfolio_holdings SET current_price = ?, sector = ? WHERE id = ?'
        ).bind(mockMarketData[row.symbol].currentPrice, mockMarketData[row.symbol].sector, row.id).run();
        row.current_price = mockMarketData[row.symbol].currentPrice;
        row.sector = mockMarketData[row.symbol].sector;
      }
    }
  }

  return {
    userId,
    holdings: results.map(deserializeHolding),
  };
}

export async function upsertHolding(db, userId, holding) {
  const existing = await db.prepare(
    'SELECT * FROM portfolio_holdings WHERE user_id = ? AND symbol = ?'
  ).bind(userId, holding.symbol).first();

  if (existing) {
    await db.prepare(
      'UPDATE portfolio_holdings SET name = ?, shares = ?, avg_price = ?, current_price = ?, sector = ? WHERE user_id = ? AND symbol = ?'
    ).bind(holding.name, holding.shares, holding.avgPrice, holding.currentPrice, holding.sector || null, userId, holding.symbol).run();
  } else {
    await db.prepare(
      'INSERT INTO portfolio_holdings (user_id, symbol, name, shares, avg_price, current_price, sector) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, holding.symbol, holding.name, holding.shares, holding.avgPrice, holding.currentPrice, holding.sector || null).run();
  }
}

export async function removeHolding(db, userId, symbol) {
  await db.prepare('DELETE FROM portfolio_holdings WHERE user_id = ? AND symbol = ?').bind(userId, symbol).run();
}

function deserializeHolding(row) {
  return {
    symbol: row.symbol,
    name: row.name,
    shares: row.shares,
    avgPrice: row.avg_price,
    currentPrice: row.current_price,
    sector: row.sector,
  };
}

// --- Rebalancing Events ---

export async function createRebalancingEvent(db, event) {
  await db.prepare(
    `INSERT INTO rebalancing_events (event_id, user_id, action_type, asset_symbol, asset_name, quantity, price, transaction_cost, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    event.eventId, event.userId, event.actionType,
    event.assetSymbol, event.assetName || null,
    event.quantity, event.price, event.transactionCost || 5, event.status || 'completed'
  ).run();
}

// --- Tax-Loss Harvesting Events ---

export async function createTlhEvent(db, event) {
  await db.prepare(
    `INSERT INTO tax_loss_harvesting_events (event_id, user_id, sold_symbol, shares_sold, realized_loss_amount, replacement_symbol, replacement_name, status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    event.eventId, event.userId, event.soldSymbol,
    event.sharesSold, event.realizedLossAmount,
    event.replacementSymbol || null, event.replacementName || null, event.status || 'completed'
  ).run();
}

export { mockMarketData };
