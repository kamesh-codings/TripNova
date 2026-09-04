const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/users/:id - Get user profile
router.get('/:id', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/users/sync - Upsert user profile (compatible with frontend UserProfile)
router.post('/sync', async (req, res) => {
  try {
    const {
      id = `usr_${Date.now()}`,
      name,
      email = `${id}@tripnova.local`,
      travel_style = 'solo',
      avatar_url = null,
      home_currency = 'INR'
    } = req.body;

    const full_name = name || req.body.full_name || 'Tourist';

    const existing = await db.query('SELECT id FROM users WHERE id = ?', [id]);

    if (existing && existing.length > 0) {
      await db.query(`
        UPDATE users 
        SET full_name = ?, home_currency = ?, travel_style = ?, avatar_url = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [full_name, home_currency, travel_style, avatar_url, id]);
    } else {
      await db.query(`
        INSERT INTO users (id, email, full_name, avatar_url, home_currency, travel_style)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [id, email, full_name, avatar_url, home_currency, travel_style]);
    }

    res.json({
      success: true,
      message: 'User profile synced successfully',
      data: { id, full_name, email, travel_style, home_currency }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/users/:id - Delete user profile
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'User profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
