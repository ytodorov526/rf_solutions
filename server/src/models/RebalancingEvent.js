/**
 * Represents a record of a portfolio rebalancing event.
 */
class RebalancingEvent {
  constructor({ eventId, userId, timestamp, actionType, asset, quantity, price, transactionCost, status }) {
    this.eventId = eventId; // Unique identifier for the rebalancing event
    this.userId = userId; // User associated with this event
    this.timestamp = timestamp || new Date(); // Timestamp of when the event occurred
    this.actionType = actionType; // e.g., 'buy', 'sell'
    this.asset = asset; // Information about the asset involved (e.g., { symbol: 'AAPL', name: 'Apple Inc.' })
    this.quantity = quantity; // Number of shares bought or sold
    this.price = price; // Price per share at the time of transaction
    this.transactionCost = transactionCost || 0; // Any costs associated with the transaction
    this.status = status || 'completed'; // e.g., 'completed', 'pending', 'failed'
  }
}

module.exports = RebalancingEvent;