/**
 * =============================================================================
 * TripNova Service Providers API Routes
 * =============================================================================
 * Handles fetching, updating, and querying service providers from MySQL.
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET /api/providers - List all verified service providers (with optional category filter)
router.get('/', async (req, res) => {
  try {
    const { category, city } = req.query;
    let sql = 'SELECT * FROM service_providers WHERE is_verified = 1';
    const params = [];

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (city) {
      sql += ' AND LOWER(operating_city) LIKE ?';
      params.push(`%${city.toLowerCase()}%`);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await db.query(sql, params);

    // Format JSON fields
    const formatted = rows.map(p => {
      try { if (typeof p.transport_details === 'string') p.transportDetails = JSON.parse(p.transport_details); } catch(e){}
      try { if (typeof p.tour_guide_details === 'string') p.tourGuideDetails = JSON.parse(p.tour_guide_details); } catch(e){}
      try { if (typeof p.homestay_details === 'string') p.homestayDetails = JSON.parse(p.homestay_details); } catch(e){}
      try { if (typeof p.emergency_medical_details === 'string') p.emergencyMedicalDetails = JSON.parse(p.emergency_medical_details); } catch(e){}
      try { if (typeof p.rental_agency_details === 'string') p.rentalAgencyDetails = JSON.parse(p.rental_agency_details); } catch(e){}

      return {
        id: p.id,
        username: p.username,
        email: p.email,
        phone: p.phone,
        providerName: p.provider_name,
        businessName: p.business_name,
        category: p.category,
        operatingCity: p.operating_city,
        operatingState: p.operating_state,
        nativeCurrency: p.native_currency || 'INR',
        isVerified: Boolean(p.is_verified),
        transportDetails: p.transportDetails,
        tourGuideDetails: p.tourGuideDetails,
        homestayDetails: p.homestayDetails,
        emergencyMedicalDetails: p.emergencyMedicalDetails,
        rentalAgencyDetails: p.rentalAgencyDetails,
        registeredAt: p.registered_at
      };
    });

    res.json({
      success: true,
      count: formatted.length,
      data: formatted
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/providers/:id - Get single provider profile
router.get('/:id', async (req, res) => {
  try {
    const rows = await db.query('SELECT * FROM service_providers WHERE id = ?', [req.params.id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Service Provider not found' });
    }

    const p = rows[0];
    try { if (typeof p.transport_details === 'string') p.transportDetails = JSON.parse(p.transport_details); } catch(e){}
    try { if (typeof p.tour_guide_details === 'string') p.tourGuideDetails = JSON.parse(p.tour_guide_details); } catch(e){}
    try { if (typeof p.homestay_details === 'string') p.homestayDetails = JSON.parse(p.homestay_details); } catch(e){}
    try { if (typeof p.emergency_medical_details === 'string') p.emergencyMedicalDetails = JSON.parse(p.emergency_medical_details); } catch(e){}
    try { if (typeof p.rental_agency_details === 'string') p.rentalAgencyDetails = JSON.parse(p.rental_agency_details); } catch(e){}

    res.json({
      success: true,
      data: {
        id: p.id,
        username: p.username,
        email: p.email,
        phone: p.phone,
        providerName: p.provider_name,
        businessName: p.business_name,
        category: p.category,
        operatingCity: p.operating_city,
        operatingState: p.operating_state,
        nativeCurrency: p.native_currency || 'INR',
        isVerified: Boolean(p.is_verified),
        transportDetails: p.transportDetails,
        tourGuideDetails: p.tourGuideDetails,
        homestayDetails: p.homestayDetails,
        emergencyMedicalDetails: p.emergencyMedicalDetails,
        rentalAgencyDetails: p.rentalAgencyDetails,
        registeredAt: p.registered_at
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/providers/:id - Delete provider profile
router.delete('/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM service_providers WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Service Provider profile deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
