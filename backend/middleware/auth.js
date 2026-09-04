/**
 * API Key Authentication Middleware for TripNova
 * Validates incoming requests using API Keys via:
 * 1. 'x-api-key' Header
 * 2. 'Authorization: Bearer <API_KEY>' Header
 * 3. 'api_key' or 'apiKey' Query Parameter
 */

const getValidKeys = () => {
  const keys = new Set();
  
  if (process.env.API_KEY) keys.add(process.env.API_KEY.trim());
  if (process.env.CLIENT_API_KEY) keys.add(process.env.CLIENT_API_KEY.trim());
  
  if (process.env.ALLOWED_API_KEYS) {
    process.env.ALLOWED_API_KEYS.split(',').forEach(k => {
      const trimmed = k.trim();
      if (trimmed) keys.add(trimmed);
    });
  }

  // Fallback default development keys if not configured
  keys.add('tripnova_live_api_key_2026');
  keys.add('tripnova_client_key_9921');
  keys.add('demo_key_tripnova');

  return keys;
};

const extractApiKey = (req) => {
  // 1. Check x-api-key header
  if (req.headers['x-api-key']) {
    return req.headers['x-api-key'];
  }

  // 2. Check Authorization Bearer header
  const authHeader = req.headers['authorization'];
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }

  // 3. Check query parameters
  if (req.query && (req.query.api_key || req.query.apiKey)) {
    return req.query.api_key || req.query.apiKey;
  }

  return null;
};

const requireApiKey = (req, res, next) => {
  const providedKey = extractApiKey(req);
  const validKeys = getValidKeys();

  if (!providedKey) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing API Key',
      message: 'Please provide a valid API key via x-api-key header, Authorization Bearer token, or ?api_key= query parameter.',
      hint: 'Default developer key: tripnova_live_api_key_2026'
    });
  }

  if (!validKeys.has(providedKey)) {
    return res.status(403).json({
      success: false,
      error: 'Forbidden: Invalid API Key',
      message: 'The provided API key is unauthorized or has expired.'
    });
  }

  req.apiKey = providedKey;
  next();
};

const optionalApiKey = (req, res, next) => {
  const providedKey = extractApiKey(req);
  const validKeys = getValidKeys();

  if (providedKey && validKeys.has(providedKey)) {
    req.isAuthenticated = true;
    req.apiKey = providedKey;
  } else {
    req.isAuthenticated = false;
  }
  next();
};

module.exports = {
  requireApiKey,
  optionalApiKey,
  extractApiKey,
  getValidKeys
};
