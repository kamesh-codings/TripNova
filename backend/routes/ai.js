const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/ai/suggestions - Get personalized suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { user_id } = req.query;
    let sql = 'SELECT * FROM personalized_suggestions WHERE is_dismissed = 0';
    const params = [];

    if (user_id) {
      sql += ' AND user_id = ?';
      params.push(user_id);
    }

    sql += ' ORDER BY relevance_score DESC LIMIT 10';
    const rows = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/ai/chat - Nova AI Travel Assistant endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userProfile = {} } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, error: 'Message text is required' });
    }

    const lower = message.toLowerCase();
    let reply = "I'm on it! Let me help you optimize that travel plan.";
    let actionTab = null;
    let actionLabel = null;

    if (lower.includes('emergency') || lower.includes('help') || lower.includes('doctor') || lower.includes('hospital')) {
      reply = `🚨 In case of medical emergency, your Blood Group is registered as ${userProfile.bloodGroup || 'Unknown'}. You can open your Digital Emergency Card or view nearest verified hospitals immediately.`;
      actionTab = 'emergency-card';
      actionLabel = 'Open Emergency Card';
    } else if (lower.includes('scam') || lower.includes('auto') || lower.includes('fare') || lower.includes('cab') || lower.includes('price')) {
      reply = `💡 For city trips in Tamil Nadu, standard auto-rickshaw fare is ₹35 base (first 1.5km) + ₹18/km. Use our Fare Guard calculator to check if you're being overcharged!`;
      actionTab = 'anti-scam';
      actionLabel = 'Check Fair Fare';
    } else if (lower.includes('translate') || lower.includes('language') || lower.includes('speak') || lower.includes('tamil')) {
      reply = `🗣️ You can translate voice or text instantly into Tamil, Hindi, or French in the Travel Tools tab.`;
      actionTab = 'tools';
      actionLabel = 'Open Translator';
    } else if (lower.includes('plan') || lower.includes('ooty') || lower.includes('itinerary') || lower.includes('trip')) {
      reply = `🏔️ Morning hours (8 AM - 11 AM) are optimal for visiting tea gardens and mountain train rides in Ooty. Carry a light jacket!`;
      actionTab = 'planner';
      actionLabel = 'View Trip Planner';
    } else {
      reply = `Vanakkam! 🌟 I matched this with top destinations in Tamil Nadu & Kerala. Always verify tariffs and carry your emergency contacts.`;
    }

    res.json({
      success: true,
      data: {
        reply,
        actionTab,
        actionLabel,
        timestamp: new Date().toISOString()
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
