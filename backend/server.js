/**
 * =============================================================================
 * TripNova Backend API Server
 * =============================================================================
 * Tourism Platform & Safety Hub for Smart India Hackathon
 * Powered by Node.js, Express, and SQLite / MySQL Engine
 * Protected by API Key Authentication
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');
const { optionalApiKey, requireApiKey } = require('./middleware/auth');

// Route modules
const authRoutes = require('./routes/auth');
const locationsRoutes = require('./routes/locations');
const placesRoutes = require('./routes/places');
const usersRoutes = require('./routes/users');
const providersRoutes = require('./routes/providers');
const tripsRoutes = require('./routes/trips');
const safetyRoutes = require('./routes/safety');
const aiRoutes = require('./routes/ai');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. CORS Configuration (Allows frontend on localhost:5173, etc.)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-api-key', 'apiKey']
}));

// 2. Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request Logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${res.statusCode} (${duration}ms)`);
  });
  next();
});

// 4. Public Endpoints
app.get('/', (req, res) => {
  res.json({
    service: 'TripNova Tourism Platform API',
    status: 'ONLINE',
    version: '1.0.0',
    documentation: {
      auth: '/api/auth/verify',
      locations: '/api/locations',
      places: '/api/places',
      users: '/api/users/:id',
      providers: '/api/providers',
      trips: '/api/trips',
      safety: '/api/safety/contacts',
      ai: '/api/ai/chat',
      health: '/api/health'
    },
    authentication: {
      header: 'x-api-key: tripnova_live_api_key_2026',
      bearer: 'Authorization: Bearer tripnova_live_api_key_2026',
      queryParam: '?api_key=tripnova_live_api_key_2026'
    }
  });
});

app.get('/api/health', async (req, res) => {
  try {
    const locationCount = await db.query('SELECT COUNT(*) as count FROM locations');
    res.json({
      status: 'HEALTHY',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      database: {
        connected: true,
        locationsLoaded: locationCount[0]?.count || 0
      }
    });
  } catch (err) {
    res.status(500).json({
      status: 'DEGRADED',
      databaseError: err.message
    });
  }
});

// 5. Auth Routes
app.use('/api/auth', authRoutes);

// 6. Application Routes (Protected via optional or required API keys)
app.use('/api/locations', optionalApiKey, locationsRoutes);
app.use('/api/places', optionalApiKey, placesRoutes);
app.use('/api/users', optionalApiKey, usersRoutes);
app.use('/api/providers', optionalApiKey, providersRoutes);
app.use('/api/trips', optionalApiKey, tripsRoutes);
app.use('/api/safety', optionalApiKey, safetyRoutes);
app.use('/api/ai', optionalApiKey, aiRoutes);

// 7. 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestedUrl: req.originalUrl
  });
});

// 8. Global Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Unhandled Server Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// 9. Initialize Database & Start Server
async function startServer() {
  try {
    await db.init();
    app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 TripNova Backend API Server running on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`🔑 Master API Key: ${process.env.API_KEY || 'tripnova_live_api_key_2026'}`);
      console.log(`🔑 Client API Key: ${process.env.CLIENT_API_KEY || 'tripnova_client_key_9921'}`);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('❌ Failed to start TripNova server:', err);
    process.exit(1);
  }
}

startServer();
