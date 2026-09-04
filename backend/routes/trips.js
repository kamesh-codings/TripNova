const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/trips - List trips for a user
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;
    let sql = 'SELECT * FROM trips';
    const params = [];

    if (userId) {
      sql += ' WHERE user_id = ?';
      params.push(userId);
    }

    sql += ' ORDER BY created_at DESC';
    const rows = await db.query(sql, params);

    const parsed = rows.map(r => ({
      ...r,
      itinerary_data: typeof r.itinerary_data === 'string' ? JSON.parse(r.itinerary_data) : r.itinerary_data
    }));

    res.json({ success: true, count: parsed.length, data: parsed });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/trips - Save or create trip
router.post('/', async (req, res) => {
  try {
    const {
      id = `trip_${Date.now()}`,
      user_id = 'usr_guest_01',
      location_id = 'loc-chn',
      title,
      start_date = '2026-09-15',
      end_date = '2026-09-20',
      itinerary_data = []
    } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, error: 'Trip title is required' });
    }

    const itineraryJson = typeof itinerary_data === 'string' ? itinerary_data : JSON.stringify(itinerary_data);

    // Verify user exists first to satisfy foreign key or create fallback user
    const userExists = await db.query('SELECT id FROM users WHERE id = ?', [user_id]);
    if (!userExists || userExists.length === 0) {
      await db.query(`
        INSERT INTO users (id, email, full_name)
        VALUES (?, ?, ?)
      `, [user_id, `${user_id}@tripnova.local`, 'Traveler']);
    }

    // Insert or update trip
    const existingTrip = await db.query('SELECT id FROM trips WHERE id = ?', [id]);
    if (existingTrip && existingTrip.length > 0) {
      await db.query(`
        UPDATE trips 
        SET title = ?, start_date = ?, end_date = ?, itinerary_data = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [title, start_date, end_date, itineraryJson, id]);
    } else {
      await db.query(`
        INSERT INTO trips (id, user_id, location_id, title, start_date, end_date, itinerary_data)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [id, user_id, location_id, title, start_date, end_date, itineraryJson]);
    }

    res.status(201).json({
      success: true,
      message: 'Trip saved successfully',
      data: { id, title, start_date, end_date, location_id }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/trips/:id - Delete trip
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM trips WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
