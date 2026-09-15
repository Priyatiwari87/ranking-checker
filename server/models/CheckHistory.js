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
      type: Number, 
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

CheckHistorySchema.index({ createdAt: -1 });
CheckHistorySchema.index({ businessName: 'text' }); 

module.exports = mongoose.model('CheckHistory', CheckHistorySchema);
