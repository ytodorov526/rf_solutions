/**
 * Represents a user's investment portfolio, containing a list of holdings.
 */
export class Portfolio {
  constructor({ userId, holdings = [] }) {
    this.userId = userId;
    this.holdings = holdings;
  }

  addHolding(holding) {
    this.holdings.push(holding);
  }

  updateHolding(updatedHolding) {
    const index = this.holdings.findIndex(h => h.symbol === updatedHolding.symbol);
    if (index !== -1) {
      this.holdings[index] = updatedHolding;
    } else {
      this.holdings.push(updatedHolding);
    }
  }

  removeHolding(symbol) {
    this.holdings = this.holdings.filter(h => h.symbol !== symbol);
  }

  getTotalValue() {
    return this.holdings.reduce((total, holding) => total + (holding.shares * holding.currentPrice), 0);
  }

  getTotalGainLoss() {
    return this.holdings.reduce((total, holding) => total + (holding.shares * (holding.currentPrice - holding.avgPrice)), 0);
  }

  getPortfolioReturnPercentage() {
    const totalValue = this.getTotalValue();
    const totalGainLoss = this.getTotalGainLoss();
    if (totalValue === 0) return 0;
    return (totalGainLoss / (totalValue - totalGainLoss)) * 100;
  }

  toJSON() {
    return {
      userId: this.userId,
      holdings: this.holdings.map(holding => holding.toJSON ? holding.toJSON() : holding),
    };
  }
}

/**
 * Represents a single holding within a portfolio.
 */
export class Holding {
  constructor({ symbol, name, shares, avgPrice, currentPrice, sector }) {
    this.symbol = symbol;
    this.name = name;
    this.shares = shares;
    this.avgPrice = avgPrice;
    this.currentPrice = currentPrice;
    this.sector = sector;
  }

  getCurrentValue() {
    return this.shares * this.currentPrice;
  }

  getGainLoss() {
    return this.shares * (this.currentPrice - this.avgPrice);
  }

  getReturnPercentage() {
    const gainLoss = this.getGainLoss();
    const initialInvestment = this.shares * this.avgPrice;
    if (initialInvestment === 0) return 0;
    return (gainLoss / initialInvestment) * 100;
  }

  toJSON() {
    return {
      symbol: this.symbol,
      name: this.name,
      shares: this.shares,
      avgPrice: this.avgPrice,
      currentPrice: this.currentPrice,
      sector: this.sector,
    };
  }
}
