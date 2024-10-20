const express = require('express');
const { createRule, combineRules, evaluateRule } = require('../controllers/ruleController');
const router = express.Router();

router.post('/create', createRule);
router.post('/combine', combineRules);
router.post('/evaluate', evaluateRule);

module.exports = router;
