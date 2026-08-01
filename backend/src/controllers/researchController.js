const Research = require('../models/Research');
const searchService = require('../services/searchService');
const ollamaService = require('../services/ollamaService');

/**
 * Run the full agent research pipeline
 */
const runResearch = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ message: 'Topic is required' });
  }

  // 1. Initialize record
  let research = new Research({ topic, status: 'pending' });
  try {
    await research.save();
  } catch (err) {
    console.error('Failed to create database entry:', err.message);
    // Continue in-memory if DB is completely offline
    research = { topic, status: 'pending', save: async () => {} };
  }

  try {
    // 2. Generate search queries
    console.log(`[Research Agent] Starting research for topic: "${topic}"`);
    const queries = await ollamaService.generateSearchQueries(topic);
    console.log(`[Research Agent] Generated search queries:`, queries);
    
    research.queries = queries;
    research.status = 'searching';
    await research.save();

    // 3. Perform web searches
    const allSources = [];
    const seenUrls = new Set();

    for (const query of queries) {
      console.log(`[Research Agent] Searching web for: "${query}"`);
      const results = await searchService.searchWeb(query, 3);
      for (const res of results) {
        if (!seenUrls.has(res.url)) {
          seenUrls.add(res.url);
          allSources.push(res);
        }
      }
    }

    research.sources = allSources;
    research.status = 'synthesizing';
    await research.save();

    // 4. Synthesize research report
    console.log(`[Research Agent] Synthesizing final report with ${allSources.length} sources...`);
    const report = await ollamaService.generateResearchReport(topic, allSources);
    
    research.report = report;
    research.status = 'completed';
    await research.save();

    console.log(`[Research Agent] Research completed successfully!`);
    res.status(200).json(research);

  } catch (error) {
    console.error(`[Research Agent] Pipeline failed:`, error.message);
    research.status = 'failed';
    research.error = error.message;
    await research.save();
    res.status(500).json({
      message: 'Research pipeline failed',
      error: error.message,
      research
    });
  }
};

/**
 * Get all past research records
 */
const getHistory = async (req, res) => {
  try {
    const history = await Research.find().sort({ createdAt: -1 });
    res.status(200).json(history);
  } catch (error) {
    console.error('Failed to retrieve history:', error.message);
    res.status(200).json([]); // return empty list if DB is down/empty
  }
};

/**
 * Get details of a single research session
 */
const getResearchDetails = async (req, res) => {
  try {
    const record = await Research.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Research record not found' });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving research record', error: error.message });
  }
};

module.exports = {
  runResearch,
  getHistory,
  getResearchDetails
};
