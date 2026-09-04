const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/locations - List all destinations with optional state filter
router.get('/', async (req, res) => {
  try {
    const { state, search } = req.query;
    let sql = 'SELECT * FROM locations WHERE 1=1';
    const params = [];

    if (state) {
      sql += ' AND LOWER(state) = LOWER(?)';
      params.push(state);
    }

    if (search) {
      sql += ' AND (LOWER(name) LIKE LOWER(?) OR LOWER(description) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY state ASC, name ASC';
    const rows = await db.query(sql, params);

    res.json({
      success: true,
      count: rows.length,
      data: rows
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/locations/:id - Single location details
router.get('/:id', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM locations WHERE id = ?', [req.params.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Location not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/locations/:id/places - Places under this location
router.get('/:id/places', async (req, res) => {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM places WHERE location_id = ?';
    const params = [req.params.id];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY avg_rating DESC';
    const rows = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/locations/:id/rules - Cultural rules
router.get('/:id/rules', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM cultural_rules WHERE location_id = ?', [req.params.id]);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/locations/:id/safety - Safety contacts
router.get('/:id/safety', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM safety_contacts WHERE location_id = ?', [req.params.id]);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
