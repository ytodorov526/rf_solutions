/**
 * Represents a record of a tax-loss harvesting event.
 */
export class TaxLossHarvestingEvent {
  constructor({ eventId, userId, timestamp, soldAsset, realizedLossAmount, replacementAsset, status }) {
    this.eventId = eventId;
    this.userId = userId;
    this.timestamp = timestamp || new Date();
    this.soldAsset = soldAsset;
    this.realizedLossAmount = realizedLossAmount;
    this.replacementAsset = replacementAsset;
    this.status = status || 'completed';
  }
}
