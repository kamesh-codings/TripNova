const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { extractApiKey, getValidKeys } = require('../middleware/auth');

// GET /api/auth/verify - Verify if client's API Key is valid
router.get('/verify', (req, res) => {
  const key = extractApiKey(req);
  const validKeys = getValidKeys();

  if (!key) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      error: 'No API Key provided in x-api-key header or ?api_key query'
    });
  }

  if (validKeys.has(key)) {
    return res.json({
      success: true,
      authenticated: true,
      message: 'API Key is active and verified.',
      client: key.substring(0, 8) + '...'
    });
  }

  return res.status(403).json({
    success: false,
    authenticated: false,
    error: 'Invalid or inactive API Key'
  });
});

// POST /api/auth/generate-key - Generate a new client API key (For development / partner integrations)
router.post('/generate-key', (req, res) => {
  const randomHex = crypto.randomBytes(16).toString('hex');
  const newKey = `tn_live_${randomHex}`;
  
  res.json({
    success: true,
    apiKey: newKey,
    created: new Date().toISOString(),
    usage: "Add to HTTP headers as 'x-api-key: " + newKey + "' or '?api_key=" + newKey + "'"
  });
});

module.exports = router;
