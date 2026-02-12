/**
 * Represents a user's investment profile and preferences for the Robo-Advisor.
 */
export class UserInvestmentProfile {
  constructor({ userId, riskTolerance, financialGoals, targetAllocation, rebalancingThreshold, rebalancingFrequency, taxLossHarvestingOptIn }) {
    this.userId = userId;
    this.riskTolerance = riskTolerance || 'moderate';
    this.financialGoals = financialGoals || [];
    this.targetAllocation = targetAllocation || {};
    this.rebalancingThreshold = rebalancingThreshold || 0.05;
    this.rebalancingFrequency = rebalancingFrequency || 'quarterly';
    this.taxLossHarvestingOptIn = taxLossHarvestingOptIn || false;
  }

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
      financialGoals: this.financialGoals.map(goal => ({
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
