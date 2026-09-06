/**
 * =============================================================================
 * TripNova Authentication & Account Endpoints
 * =============================================================================
 * Handles Tourist & Service Provider Registration, Login, and Password Reset
 * directly with MySQL database.
 */

const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const db = require('../config/db');
const { extractApiKey, getValidKeys } = require('../middleware/auth');

// In-memory OTP cache for password resets (email -> { code, expiresAt })
const otpStore = new Map();

// GET /api/auth/verify - Verify if client's API Key is valid
router.get('/verify', (req, res) => {
  const key = extractApiKey(req);
  const validKeys = getValidKeys();

  if (!key) {
    return res.status(401).json({
      success: false,
      authenticated: false,
      error: 'No API Key provided in x-api-key header'
    });
  }

  if (validKeys.has(key)) {
    return res.json({
      success: true,
      authenticated: true,
      engine: db.getEngine(),
      message: `TripNova API Key is active (Database: ${db.getEngine().toUpperCase()})`
    });
  }

  return res.status(403).json({
    success: false,
    authenticated: false,
    error: 'Invalid API Key'
  });
});

// =============================================================================
// 1. TOURIST REGISTRATION & SYNC
// =============================================================================
// POST /api/auth/register-tourist
router.post('/register-tourist', async (req, res) => {
  try {
    const {
      id = `usr_${Date.now()}`,
      name,
      full_name = name || 'Tourist User',
      username = '',
      password = '',
      email = '',
      dob = null,
      age = 0,
      gender = 'Male',
      bloodGroup = 'O+',
      blood_group = bloodGroup,
      allergies = '',
      medicalConditions = '',
      medical_conditions = medicalConditions,
      disability = '',
      address = '',
      govtIdType = 'Aadhaar Card',
      govt_id_type = govtIdType,
      govtIdNumber = '',
      govt_id_number = govtIdNumber,
      govtIdState = 'Tamil Nadu (TN), India',
      govt_id_state = govtIdState,
      languagesKnown = ['English', 'Tamil'],
      languages_known = languagesKnown,
      preferredLanguage = 'English',
      preferred_language = preferredLanguage,
      nativeCurrency = 'INR',
      native_currency = nativeCurrency,
      currentLocation = '',
      current_location = currentLocation,
      locationCoordinates = null,
      trustedContacts = [],
      trusted_contacts = trustedContacts,
      interestedTopPicks = [],
      interested_top_picks = interestedTopPicks,
      avatarUrl = null
    } = req.body;

    const cleanUsername = username ? username.trim().toLowerCase() : null;
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    // Check if user with same id exists
    const existing = await db.query('SELECT id FROM users WHERE id = ? OR (email = ? AND email IS NOT NULL)', [id, cleanEmail]);

    const languagesJson = JSON.stringify(languages_known);
    const trustedContactsJson = JSON.stringify(trusted_contacts);
    const topPicksJson = JSON.stringify(interested_top_picks);
    const locCoordJson = locationCoordinates ? JSON.stringify(locationCoordinates) : null;

    if (existing && existing.length > 0) {
      const targetId = existing[0].id;
      await db.query(`
        UPDATE users SET
          username = COALESCE(?, username),
          password = CASE WHEN ? != '' THEN ? ELSE password END,
          email = ?,
          full_name = ?,
          dob = ?,
          age = ?,
          gender = ?,
          blood_group = ?,
          allergies = ?,
          medical_conditions = ?,
          disability = ?,
          address = ?,
          govt_id_type = ?,
          govt_id_number = ?,
          govt_id_state = ?,
          languages_known = ?,
          preferred_language = ?,
          native_currency = ?,
          current_location = ?,
          location_coordinates = ?,
          trusted_contacts = ?,
          interested_top_picks = ?,
          is_registered = 1
        WHERE id = ?
      `, [
        cleanUsername, password, password, cleanEmail, full_name, dob, age, gender, blood_group,
        allergies, medical_conditions, disability, address, govt_id_type, govt_id_number, govt_id_state,
        languagesJson, preferred_language, native_currency, current_location, locCoordJson, trustedContactsJson,
        topPicksJson, targetId
      ]);

      return res.json({
        success: true,
        message: 'Tourist profile updated successfully in MySQL database',
        data: { id: targetId, username: cleanUsername, email: cleanEmail, name: full_name }
      });
    } else {
      await db.query(`
        INSERT INTO users (
          id, username, password, email, full_name, dob, age, gender, blood_group,
          allergies, medical_conditions, disability, address, govt_id_type, govt_id_number, govt_id_state,
          languages_known, preferred_language, native_currency, current_location, location_coordinates,
          trusted_contacts, interested_top_picks, is_registered, avatar_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `, [
        id, cleanUsername, password, cleanEmail, full_name, dob, age, gender, blood_group,
        allergies, medical_conditions, disability, address, govt_id_type, govt_id_number, govt_id_state,
        languagesJson, preferred_language, native_currency, current_location, locCoordJson,
        trustedContactsJson, topPicksJson, avatarUrl
      ]);

      return res.status(201).json({
        success: true,
        message: 'Tourist profile registered successfully in MySQL database',
        data: { id, username: cleanUsername, email: cleanEmail, name: full_name }
      });
    }
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================================================
// 2. SERVICE PROVIDER REGISTRATION & SYNC
// =============================================================================
// POST /api/auth/register-provider
router.post('/register-provider', async (req, res) => {
  try {
    const {
      id = `PRV_${Date.now()}`,
      username = '',
      password = '',
      email = '',
      phone = '',
      providerName = '',
      provider_name = providerName || 'Verified Partner',
      businessName = '',
      business_name = businessName || provider_name,
      category = 'transport',
      operatingCity = '',
      operating_city = operatingCity,
      operatingState = '',
      operating_state = operatingState,
      nativeCurrency = 'INR',
      native_currency = nativeCurrency,
      isVerified = true,
      is_verified = isVerified,
      transportDetails = null,
      transport_details = transportDetails,
      tourGuideDetails = null,
      tour_guide_details = tourGuideDetails,
      homestayDetails = null,
      homestay_details = homestayDetails,
      emergencyMedicalDetails = null,
      emergency_medical_details = emergencyMedicalDetails,
      rentalAgencyDetails = null,
      rental_agency_details = rentalAgencyDetails,
      registeredAt = new Date().toISOString().split('T')[0],
      registered_at = registeredAt
    } = req.body;

    const cleanUsername = username ? username.trim().toLowerCase() : null;
    const cleanEmail = email ? email.trim().toLowerCase() : null;

    const existing = await db.query('SELECT id FROM service_providers WHERE id = ? OR (username = ? AND username IS NOT NULL)', [id, cleanUsername]);

    const transportJson = transport_details ? JSON.stringify(transport_details) : null;
    const guideJson = tour_guide_details ? JSON.stringify(tour_guide_details) : null;
    const homestayJson = homestay_details ? JSON.stringify(homestay_details) : null;
    const medicalJson = emergency_medical_details ? JSON.stringify(emergency_medical_details) : null;
    const rentalJson = rental_agency_details ? JSON.stringify(rental_agency_details) : null;

    if (existing && existing.length > 0) {
      const targetId = existing[0].id;
      await db.query(`
        UPDATE service_providers SET
          username = COALESCE(?, username),
          password = CASE WHEN ? != '' THEN ? ELSE password END,
          email = ?,
          phone = ?,
          provider_name = ?,
          business_name = ?,
          category = ?,
          operating_city = ?,
          operating_state = ?,
          native_currency = ?,
          is_verified = ?,
          transport_details = ?,
          tour_guide_details = ?,
          homestay_details = ?,
          emergency_medical_details = ?,
          rental_agency_details = ?
        WHERE id = ?
      `, [
        cleanUsername, password, password, cleanEmail, phone, provider_name, business_name, category,
        operating_city, operating_state, native_currency, is_verified ? 1 : 0,
        transportJson, guideJson, homestayJson, medicalJson, rentalJson, targetId
      ]);

      return res.json({
        success: true,
        message: 'Service Provider profile updated in MySQL database',
        data: { id: targetId, username: cleanUsername, businessName: business_name, category }
      });
    } else {
      await db.query(`
        INSERT INTO service_providers (
          id, username, password, email, phone, provider_name, business_name, category,
          operating_city, operating_state, native_currency, is_verified,
          transport_details, tour_guide_details, homestay_details, emergency_medical_details,
          rental_agency_details, registered_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        id, cleanUsername, password, cleanEmail, phone, provider_name, business_name, category,
        operating_city, operating_state, native_currency, is_verified ? 1 : 0,
        transportJson, guideJson, homestayJson, medicalJson, rentalJson, registered_at
      ]);

      return res.status(201).json({
        success: true,
        message: 'Service Provider registered in MySQL database',
        data: { id, username: cleanUsername, businessName: business_name, category }
      });
    }
  } catch (err) {
    console.error('Provider registration error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================================================
// 3. ACCOUNT LOGIN (Tourist OR Service Provider)
// =============================================================================
// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, error: 'Identifier (Username/Email) and Password are required' });
    }

    const cleanId = identifier.trim().toLowerCase();
    const cleanPass = password.trim();

    // 1. Check Tourist Users (Matches username OR email OR full_name)
    const userRows = await db.query(`
      SELECT * FROM users 
      WHERE LOWER(TRIM(username)) = ? OR LOWER(TRIM(email)) = ? OR LOWER(TRIM(full_name)) = ?
    `, [cleanId, cleanId, cleanId]);

    if (userRows && userRows.length > 0) {
      const user = userRows[0];
      // Compare password safely (trimmed or exact)
      if (!user.password || user.password === cleanPass || user.password === password) {
        // Parse JSON fields safely
        try { if (typeof user.languages_known === 'string') user.languagesKnown = JSON.parse(user.languages_known); } catch(e){}
        try { if (typeof user.trusted_contacts === 'string') user.trustedContacts = JSON.parse(user.trusted_contacts); } catch(e){}
        try { if (typeof user.interested_top_picks === 'string') user.interestedTopPicks = JSON.parse(user.interested_top_picks); } catch(e){}
        try { if (typeof user.location_coordinates === 'string') user.locationCoordinates = JSON.parse(user.location_coordinates); } catch(e){}

        user.name = user.full_name;
        user.isRegistered = true;

        return res.json({
          success: true,
          type: 'tourist',
          profile: user,
          message: `Logged in successfully as Tourist: ${user.full_name}`
        });
      }
    }

    // 2. Check Service Providers (Matches username OR email OR business_name OR provider_name)
    const providerRows = await db.query(`
      SELECT * FROM service_providers 
      WHERE LOWER(TRIM(username)) = ? OR LOWER(TRIM(email)) = ? OR LOWER(TRIM(business_name)) = ? OR LOWER(TRIM(provider_name)) = ?
    `, [cleanId, cleanId, cleanId, cleanId]);

    if (providerRows && providerRows.length > 0) {
      const provider = providerRows[0];
      if (!provider.password || provider.password === cleanPass || provider.password === password) {
        try { if (typeof provider.transport_details === 'string') provider.transportDetails = JSON.parse(provider.transport_details); } catch(e){}
        try { if (typeof provider.tour_guide_details === 'string') provider.tourGuideDetails = JSON.parse(provider.tour_guide_details); } catch(e){}
        try { if (typeof provider.homestay_details === 'string') provider.homestayDetails = JSON.parse(provider.homestay_details); } catch(e){}
        try { if (typeof provider.emergency_medical_details === 'string') provider.emergencyMedicalDetails = JSON.parse(provider.emergency_medical_details); } catch(e){}
        try { if (typeof provider.rental_agency_details === 'string') provider.rentalAgencyDetails = JSON.parse(provider.rental_agency_details); } catch(e){}

        provider.providerName = provider.provider_name;
        provider.businessName = provider.business_name;
        provider.operatingCity = provider.operating_city;
        provider.operatingState = provider.operating_state;
        provider.isVerified = Boolean(provider.is_verified);

        return res.json({
          success: true,
          type: 'provider',
          profile: provider,
          message: `Logged in successfully as Service Provider: ${provider.business_name}`
        });
      }
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid Email/Username or Password. Please verify your credentials or register.'
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// =============================================================================
// 4. FORGOT PASSWORD & RESET
// =============================================================================
// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, error: 'Registered Email is required' });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check if email exists in users or providers
    const [user] = await db.query('SELECT id, full_name as name FROM users WHERE LOWER(email) = ?', [cleanEmail]);
    const [provider] = await db.query('SELECT id, business_name as name FROM service_providers WHERE LOWER(email) = ?', [cleanEmail]);

    if (!user && !provider) {
      return res.status(404).json({
        success: false,
        error: `No account registered with email "${cleanEmail}"`
      });
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(cleanEmail, { code, expiresAt: Date.now() + 15 * 60 * 1000 });

    res.json({
      success: true,
      message: `Password reset verification code generated for ${cleanEmail}`,
      code: code // in production sent via nodemailer/SendGrid
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, code, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ success: false, error: 'Email and new password are required' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const stored = otpStore.get(cleanEmail);

    if (code && stored && stored.code !== code.trim()) {
      return res.status(400).json({ success: false, error: 'Invalid verification code' });
    }

    // Update in users table
    const userRes = await db.query('UPDATE users SET password = ? WHERE LOWER(email) = ?', [newPassword, cleanEmail]);
    // Update in service_providers table
    const provRes = await db.query('UPDATE service_providers SET password = ? WHERE LOWER(email) = ?', [newPassword, cleanEmail]);

    otpStore.delete(cleanEmail);

    res.json({
      success: true,
      message: 'Password updated successfully in database. You can now login.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
