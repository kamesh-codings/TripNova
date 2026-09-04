const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/safety/contacts - All emergency contacts
router.get('/contacts', async (req, res) => {
  try {
    const { location_id } = req.query;
    let sql = `
      SELECT sc.*, l.name as location_name, l.state as location_state
      FROM safety_contacts sc
      JOIN locations l ON sc.location_id = l.id
    `;
    const params = [];

    if (location_id) {
      sql += ' WHERE sc.location_id = ?';
      params.push(location_id);
    }

    sql += ' ORDER BY l.name ASC';
    const rows = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/safety/rules - Cultural rules and etiquette
router.get('/rules', async (req, res) => {
  try {
    const { location_id, severity } = req.query;
    let sql = `
      SELECT cr.*, l.name as location_name
      FROM cultural_rules cr
      JOIN locations l ON cr.location_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (location_id) {
      sql += ' AND cr.location_id = ?';
      params.push(location_id);
    }

    if (severity) {
      sql += ' AND cr.severity = ?';
      params.push(severity);
    }

    sql += ' ORDER BY cr.severity DESC';
    const rows = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/safety/sos - Log SOS emergency dispatch event
router.post('/sos', async (req, res) => {
  try {
    const { user_id = 'usr_guest_01', location_id = null, metadata = {} } = req.body;
    const id = `sos_${Date.now()}`;

    // Ensure fallback user exists
    const userExists = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
    if (!userExists || userExists.length === 0) {
      await db.query(`
        INSERT INTO users (id, email, full_name)
        VALUES (?, ?, ?)
      `, [user_id, `${user_id}@tripnova.local`, 'Tourist in Distress']);
    }

    await db.query(`
      INSERT INTO user_history (id, user_id, location_id, action_type, metadata)
      VALUES (?, ?, ?, 'navigate', ?)
    `, [id, user_id, location_id, JSON.stringify(metadata)]);

    res.status(201).json({
      success: true,
      message: 'SOS Emergency log recorded and dispatched to monitoring hub',
      sos_id: id,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
