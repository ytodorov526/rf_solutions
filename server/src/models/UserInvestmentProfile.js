/**
 * Represents a user's investment profile and preferences for the Robo-Advisor.
 */
class UserInvestmentProfile {
  constructor({ userId, riskTolerance, financialGoals, targetAllocation, rebalancingThreshold, rebalancingFrequency, taxLossHarvestingOptIn }) {
    this.userId = userId; // Unique identifier for the user
    this.riskTolerance = riskTolerance || 'moderate'; // e.g., 'conservative', 'moderate', 'aggressive'
    this.financialGoals = financialGoals || []; // e.g., [{ name: 'Retirement', targetAmount: 1000000, targetDate: '2050-01-01' }]
    this.targetAllocation = targetAllocation || {}; // e.g., { 'stocks': 0.6, 'bonds': 0.3, 'cash': 0.1 }
    this.rebalancingThreshold = rebalancingThreshold || 0.05; // e.g., 0.05 for 5% drift
    this.rebalancingFrequency = rebalancingFrequency || 'quarterly'; // e.g., 'quarterly', 'annually', 'threshold'
    this.taxLossHarvestingOptIn = taxLossHarvestingOptIn || false; // Boolean to enable/disable TLH
  }

  // Methods to update profile settings can be added here
  updateTargetAllocation(newAllocation) {
    this.targetAllocation = newAllocation;
  }

  updateRebalancingThreshold(newThreshold) {
    this.rebalancingThreshold = newThreshold;
  }

  updateRebalancingFrequency(newFrequency) {
    this.rebalancingFrequency = newFrequency;
  }

  toggleTaxLossHarvesting() {
    this.taxLossHarvestingOptIn = !this.taxLossHarvestingOptIn;
  }

  toJSON() {
    return {
      userId: this.userId,
      riskTolerance: this.riskTolerance,
      financialGoals: this.financialGoals.map(goal => ({ // Explicitly map each goal
        name: goal.name,
        targetAmount: goal.targetAmount,
        targetDate: goal.targetDate,
      })),
      targetAllocation: this.targetAllocation,
      rebalancingThreshold: this.rebalancingThreshold,
      rebalancingFrequency: this.rebalancingFrequency,
      taxLossHarvestingOptIn: this.taxLossHarvestingOptIn,
    };
  }
}

module.exports = UserInvestmentProfile;