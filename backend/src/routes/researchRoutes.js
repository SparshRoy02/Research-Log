const express = require('express');
const router = express.Router();
const { runResearch, getHistory, getResearchDetails } = require('../controllers/researchController');

router.post('/', runResearch);
router.get('/', getHistory);
router.get('/:id', getResearchDetails);

module.exports = router;
