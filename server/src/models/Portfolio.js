/**
 * Represents a user's investment portfolio, containing a list of holdings.
 */
class Portfolio {
  constructor({ userId, holdings = [] }) {
    this.userId = userId; // Unique identifier for the user
    this.holdings = holdings; // Array of Holding objects
  }

  /**
   * Adds a holding to the portfolio.
   * @param {Holding} holding - The holding object to add.
   */
  addHolding(holding) {
    this.holdings.push(holding);
  }

  /**
   * Updates an existing holding or adds it if it doesn't exist.
   * @param {Holding} updatedHolding - The holding object with updated information.
   */
  updateHolding(updatedHolding) {
    const index = this.holdings.findIndex(h => h.symbol === updatedHolding.symbol);
    if (index !== -1) {
      this.holdings[index] = updatedHolding;
    } else {
      this.holdings.push(updatedHolding);
    }
  }

  /**
   * Removes a holding from the portfolio.
   * @param {string} symbol - The symbol of the holding to remove.
   */
  removeHolding(symbol) {
    this.holdings = this.holdings.filter(h => h.symbol !== symbol);
  }

  /**
   * Calculates the total current value of the portfolio.
   * @returns {number} The total portfolio value.
   */
  getTotalValue() {
    return this.holdings.reduce((total, holding) => total + (holding.shares * holding.currentPrice), 0);
  }

  /**
   * Calculates the total gain or loss across all holdings.
   * @returns {number} The total gain or loss.
   */
  getTotalGainLoss() {
    return this.holdings.reduce((total, holding) => total + (holding.shares * (holding.currentPrice - holding.avgPrice)), 0);
  }

  /**
   * Calculates the overall percentage return of the portfolio.
   * @returns {number} The percentage return.
   */
  getPortfolioReturnPercentage() {
    const totalValue = this.getTotalValue();
    const totalGainLoss = this.getTotalGainLoss();
    if (totalValue === 0) return 0; // Avoid division by zero
    return (totalGainLoss / (totalValue - totalGainLoss)) * 100; // Approximation based on initial investment value
  }

  toJSON() {
    return {
      userId: this.userId,
      holdings: this.holdings.map(holding => holding.toJSON ? holding.toJSON() : holding), // Ensure holdings are also serializable
    };
  }
}

/**
 * Represents a single holding within a portfolio.
 */
class Holding {
  constructor({ symbol, name, shares, avgPrice, currentPrice, sector }) {
    this.symbol = symbol; // e.g., 'AAPL'
    this.name = name;     // e.g., 'Apple Inc.'
    this.shares = shares; // Number of shares owned
    this.avgPrice = avgPrice; // Average purchase price per share
    this.currentPrice = currentPrice; // Current market price per share
    this.sector = sector; // e.g., 'Technology', 'ETF'
  }

  /**
   * Calculates the current value of this specific holding.
   * @returns {number} The current value of the holding.
   */
  getCurrentValue() {
    return this.shares * this.currentPrice;
  }

  /**
   * Calculates the gain or loss for this specific holding.
   * @returns {number} The gain or loss for the holding.
   */
  getGainLoss() {
    return this.shares * (this.currentPrice - this.avgPrice);
  }

  /**
   * Calculates the percentage return for this specific holding.
   * @returns {number} The percentage return for the holding.
   */
  getReturnPercentage() {
    const gainLoss = this.getGainLoss();
    const initialInvestment = this.shares * this.avgPrice;
    if (initialInvestment === 0) return 0; // Avoid division by zero
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

module.exports = { Portfolio, Holding };