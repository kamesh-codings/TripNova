const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/places - List all tourist places with search and filtering
router.get('/', async (req, res) => {
  try {
    const { location_id, category, search, limit = 500, offset = 0 } = req.query;
    let sql = `
      SELECT p.*, l.name as location_name, l.state as location_state
      FROM places p
      LEFT JOIN locations l ON p.location_id = l.id
      WHERE 1=1
    `;
    const params = [];

    if (location_id) {
      sql += ' AND p.location_id = ?';
      params.push(location_id);
    }

    if (category) {
      sql += ' AND p.category = ?';
      params.push(category);
    }

    if (search) {
      sql += ' AND (LOWER(p.name) LIKE LOWER(?) OR LOWER(p.category) LIKE LOWER(?))';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY p.avg_rating DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));

    const rows = await db.query(sql, params);
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/places/:id - Single place details with reviews
router.get('/:id', async (req, res) => {
  try {
    const rows = await db.query(`
      SELECT p.*, l.name as location_name, l.state as location_state
      FROM places p
      LEFT JOIN locations l ON p.location_id = l.id
      WHERE p.id = ?
    `, [req.params.id]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Place not found' });
    }

    const reviews = await db.query(`
      SELECT r.*, u.full_name as user_name, u.avatar_url as user_avatar
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
      WHERE r.place_id = ?
      ORDER BY r.created_at DESC
    `, [req.params.id]);

    res.json({
      success: true,
      data: {
        ...rows[0],
        reviews
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/places - Create place (Protected)
router.post('/', async (req, res) => {
  try {
    const { id, location_id, name, category, avg_rating = 0, review_count = 0, entry_fee = 0, opening_hours } = req.body;
    
    if (!id || !location_id || !name || !category) {
      return res.status(400).json({ success: false, error: 'Missing required fields (id, location_id, name, category)' });
    }

    const sql = `
      INSERT INTO places (id, location_id, name, category, avg_rating, review_count, entry_fee, opening_hours)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    await db.query(sql, [id, location_id, name, category, avg_rating, review_count, entry_fee, opening_hours]);

    res.status(201).json({
      success: true,
      message: 'Place created successfully',
      data: { id, location_id, name, category }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
