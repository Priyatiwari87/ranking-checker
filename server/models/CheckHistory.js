const mongoose = require('mongoose');

const CheckHistorySchema = new mongoose.Schema(
  {
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    websiteUrl: {
      type: String,
      required: true,
      trim: true
    },
    domain: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    searchQuery: {
      type: String,
      required: true,
      trim: true
    },
    location: {
      type: String,
      default: '',
      trim: true
    },
    depth: {
      type: Number,
      default: 50
    },
    ranking: {
      type: Number,
      default: null
    },
    found: {
      type: Boolean,
      required: true,
      default: false
    },
    totalChecked: {
      type: Number,
      default: 0
    },
    previousRanking: {
      type: Number,
      default: null
    },
    rankingChange: {
      type: Number, // Positive means improved (e.g. +3), negative means dropped (-3), 0 means no change
      default: null
    },
    provider: {
      type: String,
      default: 'Demo Provider'
    },
    isDemo: {
      type: Boolean,
      default: true
    },
    results: [
      {
        position: Number,
        title: String,
        url: String,
        snippet: String,
        matched: Boolean
      }
    ]
  },
  {
    timestamps: { createdAt: 'checkedAt', updatedAt: 'updatedAt' }
  }
);

CheckHistorySchema.index({ domain: 1, searchQuery: 1, checkedAt: -1 });

module.exports = mongoose.model('CheckHistory', CheckHistorySchema);
