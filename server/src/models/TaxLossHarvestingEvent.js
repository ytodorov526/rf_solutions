/**
 * Represents a record of a tax-loss harvesting event.
 */
class TaxLossHarvestingEvent {
  constructor({ eventId, userId, timestamp, soldAsset, realizedLossAmount, replacementAsset, status }) {
    this.eventId = eventId; // Unique identifier for the TLH event
    this.userId = userId; // User associated with this event
    this.timestamp = timestamp || new Date(); // Timestamp of when the event occurred
    this.soldAsset = soldAsset; // Information about the asset sold to realize a loss (e.g., { symbol: 'TSLA', sharesSold: 5 })
    this.realizedLossAmount = realizedLossAmount; // The amount of capital loss realized from the sale
    this.replacementAsset = replacementAsset; // Information about the similar asset purchased to replace the sold asset (e.g., { symbol: 'TSLF', name: 'Tesla ETF' })
    this.status = status || 'completed'; // e.g., 'completed', 'pending', 'failed'
  }
}

module.exports = TaxLossHarvestingEvent;