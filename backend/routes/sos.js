/**
 * =============================================================================
 * TripNova - SOS Emergency Email API Routes
 * =============================================================================
 * Handles emergency dispatch requests, email broadcasting to trusted contacts,
 * and SOS audit logging.
 */

const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { broadcastSosEmails, sendSingleSosEmail } = require('../services/emailService');

/**
 * POST /api/sos/send
 * Main SOS Distress Broadcast Endpoint
 */
router.post('/send', async (req, res) => {
  try {
    const {
      user_id = 'usr_guest_01',
      traveler = {},
      location = {},
      contacts = [],
      customMessage = '',
      metadata = {}
    } = req.body;

    // 1. Build Traveler Profile from request or fallback
    const resolvedTraveler = {
      id: user_id || traveler.id || 'usr_guest_01',
      name: traveler.name || 'Registered Tourist',
      phone: traveler.phone || '',
      email: traveler.email || '',
      bloodGroup: traveler.bloodGroup || 'Unknown',
      allergies: traveler.allergies || '',
      medicalConditions: traveler.medicalConditions || ''
    };

    // 2. Build Location Object
    const resolvedLocation = {
      latitude: location.latitude ? Number(location.latitude) : null,
      longitude: location.longitude ? Number(location.longitude) : null,
      address: location.address || location.currentLocation || (location.latitude && location.longitude ? `${location.latitude.toFixed(4)}° N, ${location.longitude.toFixed(4)}° E` : 'Location unavailable')
    };

    // 3. Resolve Trusted Contacts (Max 5)
    let recipients = Array.isArray(contacts) ? contacts : [];
    
    // If no contacts passed in body, try to fetch from database or use default fallback
    if (recipients.length === 0) {
      try {
        const dbContacts = await db.query(
          'SELECT name, email, phone FROM safety_contacts LIMIT 3'
        );
        if (dbContacts && dbContacts.length > 0) {
          recipients = dbContacts.map(c => ({
            name: c.name,
            email: c.email || 'sos-alert-inbox@tripnova.local',
            phone: c.phone
          }));
        }
      } catch (dbErr) {
        // ignore
      }
    }

    // Limit to 5 contacts as per SIH specification
    recipients = recipients.slice(0, 5);

    // 4. Dispatch Email Alerts through Email Service
    const broadcastResult = await broadcastSosEmails({
      recipients,
      traveler: resolvedTraveler,
      location: resolvedLocation,
      customMessage
    });

    const sosId = `sos_${Date.now()}`;

    // 5. Log SOS Distress Event in database
    try {
      // Ensure fallback user exists
      const userExists = await db.query('SELECT id FROM users WHERE id = ?', [resolvedTraveler.id]);
      if (!userExists || userExists.length === 0) {
        await db.query(`
          INSERT INTO users (id, email, full_name)
          VALUES (?, ?, ?)
        `, [resolvedTraveler.id, resolvedTraveler.email || `${resolvedTraveler.id}@tripnova.local`, resolvedTraveler.name]);
      }

      await db.query(`
        INSERT INTO user_history (id, user_id, location_id, action_type, metadata)
        VALUES (?, ?, ?, 'sos_dispatch', ?)
      `, [
        sosId,
        resolvedTraveler.id,
        null,
        JSON.stringify({
          location: resolvedLocation,
          customMessage,
          broadcastResult,
          clientMetadata: metadata
        })
      ]);
    } catch (logErr) {
      console.warn('⚠️ Could not log SOS event to database:', logErr.message);
    }

    // 6. Return Honest Delivery Status
    const statusCode = broadcastResult.success ? 200 : 400;
    return res.status(statusCode).json({
      success: broadcastResult.success,
      isCompleteSuccess: broadcastResult.isCompleteSuccess,
      isPartialSuccess: broadcastResult.isPartialSuccess,
      message: broadcastResult.message,
      sosId,
      totalContacts: broadcastResult.totalContacts,
      successfulSends: broadcastResult.successfulSends,
      failedSends: broadcastResult.failedSends,
      timestamp: broadcastResult.timestamp,
      results: broadcastResult.results
    });
  } catch (err) {
    console.error('💥 Error processing SOS broadcast request:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal server error while transmitting emergency alert.',
      error: err.message
    });
  }
});

/**
 * GET /api/sos/health
 * Checks email service status & active SMTP configuration
 */
router.get('/health', async (req, res) => {
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST || 'Ethereal / Demo Mailer';
  const user = process.env.SMTP_USER || process.env.EMAIL_USER || 'Demo Mailbox';
  const from = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'sos-alerts@tripnova.app';

  res.json({
    service: 'TripNova SOS Email Automation Service',
    status: 'ONLINE',
    configuredProvider: process.env.SMTP_HOST ? 'Custom SMTP' : 'Ethereal Demo / Local Transport',
    host,
    user,
    senderEmail: from,
    maxContactsPerAlert: 5
  });
});

/**
 * POST /api/sos/test
 * Quick Test Endpoint to send a sample alert to any target email
 */
router.post('/test', async (req, res) => {
  try {
    const { targetEmail = 'test@example.com', targetName = 'Test User' } = req.body;
    
    const sampleResult = await sendSingleSosEmail({
      to: targetEmail,
      recipientName: targetName,
      traveler: {
        name: 'Demo Traveler',
        phone: '+91 98765 43210',
        email: 'traveler@tripnova.demo',
        bloodGroup: 'O+',
        allergies: 'None',
        medicalConditions: 'None'
      },
      location: {
        latitude: 13.0827,
        longitude: 80.2707,
        address: 'Chennai Central Tourist Safety Zone, Tamil Nadu'
      },
      timestamp: new Date().toLocaleString(),
      customMessage: 'This is a test emergency broadcast verification from TripNova.'
    });

    res.json({
      success: true,
      message: `Test alert sent to ${targetEmail}`,
      result: sampleResult
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;
