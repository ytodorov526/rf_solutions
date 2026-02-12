/**
 * Represents a record of a portfolio rebalancing event.
 */
export class RebalancingEvent {
  constructor({ eventId, userId, timestamp, actionType, asset, quantity, price, transactionCost, status }) {
    this.eventId = eventId;
    this.userId = userId;
    this.timestamp = timestamp || new Date();
    this.actionType = actionType;
    this.asset = asset;
    this.quantity = quantity;
    this.price = price;
    this.transactionCost = transactionCost || 0;
    this.status = status || 'completed';
  }
}
