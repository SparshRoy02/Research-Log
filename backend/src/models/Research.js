const mongoose = require('mongoose');

const ResearchSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true,
  },
  queries: {
    type: [String],
    default: [],
  },
  sources: [
    {
      title: String,
      url: String,
      snippet: String,
    }
  ],
  report: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['pending', 'searching', 'synthesizing', 'completed', 'failed'],
    default: 'pending',
  },
  error: {
    type: String,
    default: null,
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Research', ResearchSchema);
