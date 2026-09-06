/**
 * =============================================================================
 * TripNova - SOS Emergency Email Automation Service
 * =============================================================================
 * Powered by Nodemailer with auto-detecting SMTP & Ethereal / Test Fallback
 */

const nodemailer = require('nodemailer');

let cachedTransporter = null;

/**
 * Initializes or retrieves the active Nodemailer Transporter.
 * Prioritizes SMTP credentials from environment variables (.env).
 * Falls back to an automatic Ethereal test inbox or simulation mode if no credentials are provided.
 */
async function getTransporter() {
  if (cachedTransporter) {
    return cachedTransporter;
  }

  const service = process.env.EMAIL_SERVICE || process.env.SMTP_SERVICE;
  const host = process.env.SMTP_HOST || process.env.EMAIL_HOST;
  const port = parseInt(process.env.SMTP_PORT || process.env.EMAIL_PORT || '587', 10);
  const user = (process.env.SMTP_USER || process.env.EMAIL_USER || '').trim();
  const pass = (process.env.SMTP_PASS || process.env.EMAIL_PASS || '').trim();
  const secure = process.env.SMTP_SECURE === 'true' || port === 465;

  // 1. Direct Gmail Service mode (if service is gmail or host is smtp.gmail.com)
  if ((service && service.toLowerCase() === 'gmail') || (host && host.includes('gmail.com'))) {
    if (user && pass) {
      console.log(`📧 Initializing Gmail SMTP Service (user: ${user})...`);
      cachedTransporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass }
      });
      return cachedTransporter;
    }
  }

  // 2. Custom SMTP Host configuration
  if (host && user && pass) {
    console.log(`📧 Initializing custom SMTP email service (${host}:${port}, user: ${user})...`);
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: { user, pass },
      tls: { rejectUnauthorized: false }
    });
    return cachedTransporter;
  }

  // 3. Automated Ethereal demo test account for local development
  try {
    console.log('📬 No custom SMTP credentials in backend/.env. Using Ethereal test mailer (generates web preview links)...');
    const testAccount = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass
      }
    });
    console.log(`✅ Ethereal demo mailer active: ${testAccount.user}`);
    return cachedTransporter;
  } catch (err) {
    console.warn('⚠️ Could not initialize Ethereal test account, using JSON transport fallback:', err.message);
    cachedTransporter = nodemailer.createTransport({
      jsonTransport: true
    });
    return cachedTransporter;
  }
}

/**
 * Builds a high-impact, mobile-responsive HTML emergency alert email.
 */
function buildEmergencyEmailHtml({
  traveler,
  location,
  timestamp,
  customMessage,
  recipientName
}) {
  const mapLink = location.address && location.address.trim()
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address.trim())}`
    : (location.latitude && location.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
        : null);

  const locString = location.address || (location.latitude && location.longitude 
    ? `${location.latitude.toFixed(5)}° N, ${location.longitude.toFixed(5)}° E`
    : 'Location unavailable');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TripNova Emergency SOS Alert</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 0;
      background-color: #0b0f19;
      color: #f1f5f9;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background: #0f172a;
      border: 2px solid #ef4444;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(239, 68, 68, 0.35);
    }
    .header {
      background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%);
      padding: 24px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0 0 8px 0;
      font-size: 22px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      font-weight: 900;
    }
    .header p {
      margin: 0;
      font-size: 13px;
      opacity: 0.95;
    }
    .content {
      padding: 24px;
    }
    .alert-box {
      background: rgba(239, 68, 68, 0.15);
      border-left: 4px solid #ef4444;
      padding: 14px 18px;
      border-radius: 8px;
      margin-bottom: 20px;
      font-size: 14px;
      line-height: 1.5;
      color: #fca5a5;
    }
    .card {
      background: #1e293b;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
    .card-title {
      font-size: 12px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #38bdf8;
      margin-bottom: 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      padding-bottom: 6px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 6px 0;
      font-size: 13px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .info-label {
      color: #94a3b8;
      font-weight: 600;
    }
    .info-val {
      color: #ffffff;
      font-weight: 700;
      text-align: right;
    }
    .map-btn {
      display: inline-block;
      width: 100%;
      box-sizing: border-box;
      background: linear-gradient(135deg, #0284c7 0%, #2563eb 100%);
      color: #ffffff !important;
      text-decoration: none;
      text-align: center;
      padding: 14px 20px;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 800;
      letter-spacing: 0.02em;
      margin-top: 10px;
      box-shadow: 0 4px 14px rgba(2, 132, 199, 0.4);
    }
    .helpline-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-top: 10px;
    }
    .helpline-pill {
      background: #090e17;
      border: 1px solid rgba(255, 255, 255, 0.1);
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      color: #cbd5e1;
      text-align: center;
    }
    .helpline-pill strong {
      color: #f87171;
    }
    .footer {
      background: #090e17;
      padding: 16px 24px;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 EMERGENCY SOS DISTRESS ALERT</h1>
      <p>Immediate Assistance Requested via TripNova Safety Platform</p>
    </div>

    <div class="content">
      <div class="alert-box">
        <strong>Hello ${recipientName || 'Trusted Contact'},</strong><br>
        This is an automated emergency broadcast from TripNova. Traveler <strong>${traveler.name || 'A registered user'}</strong> has triggered an SOS Distress Beacon and requires immediate assistance.
      </div>

      ${customMessage ? `
      <!-- Prominent Top Emergency Distress Note -->
      <div class="card" style="border: 2px solid #ef4444; background: rgba(239, 68, 68, 0.15);">
        <div class="card-title" style="color: #f87171; font-size: 14px;">🚨 Traveler Distress Message</div>
        <p style="margin: 4px 0 0 0; font-size: 15px; color: #ffffff; font-weight: 800; line-height: 1.4;">"${customMessage}"</p>
      </div>` : ''}

      <!-- Traveler Information Card -->
      <div class="card">
        <div class="card-title">👤 Traveler Identity & Medical Emergency Pass</div>
        <div class="info-row">
          <span class="info-label">Traveler Name</span>
          <span class="info-val">${traveler.name || 'Not provided'}</span>
        </div>
        ${traveler.phone ? `
        <div class="info-row">
          <span class="info-label">Contact Phone</span>
          <span class="info-val"><a href="tel:${traveler.phone}" style="color: #38bdf8; text-decoration: none;">${traveler.phone}</a></span>
        </div>` : ''}
        ${traveler.email ? `
        <div class="info-row">
          <span class="info-label">Email ID</span>
          <span class="info-val">${traveler.email}</span>
        </div>` : ''}
        <div class="info-row">
          <span class="info-label">Blood Group</span>
          <span class="info-val" style="color: #f87171;">${traveler.bloodGroup || 'Unknown'}</span>
        </div>
        ${traveler.allergies ? `
        <div class="info-row">
          <span class="info-label">Known Allergies</span>
          <span class="info-val">${traveler.allergies}</span>
        </div>` : ''}
        ${traveler.medicalConditions ? `
        <div class="info-row">
          <span class="info-label">Medical Conditions</span>
          <span class="info-val">${traveler.medicalConditions}</span>
        </div>` : ''}
        <div class="info-row">
          <span class="info-label">Alert Transmit Time</span>
          <span class="info-val">${timestamp}</span>
        </div>
      </div>

      <!-- Live Location Card -->
      <div class="card">
        <div class="card-title">📍 Live GPS Coordinates & Location</div>
        <div class="info-row">
          <span class="info-label">Current Zone / City</span>
          <span class="info-val">${locString}</span>
        </div>
        ${location.latitude && location.longitude ? `
        <div class="info-row">
          <span class="info-label">GPS Coordinates</span>
          <span class="info-val">${location.latitude.toFixed(5)}° N, ${location.longitude.toFixed(5)}° E</span>
        </div>` : ''}

        ${mapLink ? `
          <a href="${mapLink}" target="_blank" class="map-btn">
            🗺️ Open Live GPS Location in Google Maps
          </a>
        ` : ''}
      </div>

      <!-- Emergency Helpline Numbers -->
      <div class="card">
        <div class="card-title">📞 National Emergency Helplines (India)</div>
        <div class="helpline-grid">
          <div class="helpline-pill">National Emergency: <strong>112</strong></div>
          <div class="helpline-pill">Police Control: <strong>100</strong></div>
          <div class="helpline-pill">Medical Ambulance: <strong>108</strong></div>
          <div class="helpline-pill">Women Safety: <strong>1091</strong></div>
        </div>
      </div>
    </div>

    <div class="footer">
      This is an automated safety alert generated by TripNova Tourism Platform.<br>
      Please contact the traveler immediately or reach out to local emergency services.
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Builds plain-text fallback version of the emergency email.
 */
function buildEmergencyEmailText({
  traveler,
  location,
  timestamp,
  customMessage,
  recipientName
}) {
  const mapLink = location.address && location.address.trim()
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location.address.trim())}`
    : (location.latitude && location.longitude
        ? `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`
        : 'Location unavailable');

  const locString = location.address || (location.latitude && location.longitude 
    ? `${location.latitude.toFixed(5)}° N, ${location.longitude.toFixed(5)}° E`
    : 'Location unavailable');

  return `
🚨 TRIPNOVA EMERGENCY SOS DISTRESS ALERT 🚨
====================================================

${customMessage ? `🚨 EMERGENCY DISTRESS NOTE:
"${customMessage}"
====================================================

` : ''}Hello ${recipientName || 'Trusted Contact'},

This is an automated emergency broadcast from TripNova.
Traveler ${traveler.name || 'A registered user'} has activated an emergency SOS alert.

TRAVELER DETAILS:
- Name: ${traveler.name || 'Not provided'}
- Phone: ${traveler.phone || 'Not provided'}
- Email: ${traveler.email || 'Not provided'}
- Blood Group: ${traveler.bloodGroup || 'Unknown'}
- Allergies: ${traveler.allergies || 'None'}
- Medical Conditions: ${traveler.medicalConditions || 'None'}
- Alert Timestamp: ${timestamp}

LOCATION DETAILS:
- Address / Zone: ${locString}
- Live Map Link: ${mapLink}

RECOMMENDED ACTION:
1. Please contact the traveler immediately.
2. If unreachable, notify local emergency services (National Emergency: 112, Police: 100, Ambulance: 108).

====================================================
TripNova Tourism Safety & Navigation Platform
  `.trim();
}

/**
 * Sends an SOS emergency email to a single recipient.
 */
async function sendSingleSosEmail({
  to,
  recipientName,
  traveler,
  location,
  timestamp,
  customMessage
}) {
  if (!to || !to.includes('@')) {
    throw new Error(`Invalid recipient email address: "${to}"`);
  }

  const transporter = await getTransporter();
  const senderEmail = process.env.EMAIL_FROM || process.env.SMTP_FROM || 'sos-alerts@tripnova.app';

  const html = buildEmergencyEmailHtml({
    traveler,
    location,
    timestamp,
    customMessage,
    recipientName
  });

  const text = buildEmergencyEmailText({
    traveler,
    location,
    timestamp,
    customMessage,
    recipientName
  });

  const mailOptions = {
    from: `"TripNova Emergency Safety Hub" <${senderEmail}>`,
    to,
    subject: `🚨 TripNova SOS Alert: Immediate Assistance Required for ${traveler.name || 'Traveler'}`,
    text,
    html,
    priority: 'high',
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'High'
    }
  };

  const info = await transporter.sendMail(mailOptions);
  
  const previewUrl = nodemailer.getTestMessageUrl(info) || null;
  if (previewUrl) {
    console.log(`📬 [Demo Test Mail Sent] Preview URL for ${to}: ${previewUrl}`);
  }

  return {
    messageId: info.messageId,
    previewUrl,
    accepted: info.accepted,
    rejected: info.rejected
  };
}

/**
 * Broadcasts emergency SOS email alerts to a list of trusted contacts.
 * Dispatches one email per contact independently so a single failure does not halt others.
 */
async function broadcastSosEmails({
  recipients = [],
  traveler = {},
  location = {},
  customMessage = ''
}) {
  const timestamp = new Date().toLocaleString('en-IN', {
    dateStyle: 'full',
    timeStyle: 'medium',
    timeZone: 'Asia/Kolkata'
  }) + ' (IST)';

  const validRecipients = recipients.filter(r => r && r.email && r.email.trim().includes('@'));

  if (validRecipients.length === 0) {
    return {
      success: false,
      message: 'No valid recipient email addresses found in trusted contacts list.',
      totalContacts: recipients.length,
      successfulSends: 0,
      failedSends: recipients.length,
      results: recipients.map(r => ({
        name: r.name || 'Contact',
        email: r.email || '',
        status: 'failed',
        error: 'Missing or invalid email address'
      }))
    };
  }

  const results = [];
  let successfulSends = 0;
  let failedSends = 0;

  for (const recipient of validRecipients) {
    try {
      const sendRes = await sendSingleSosEmail({
        to: recipient.email.trim(),
        recipientName: recipient.name || 'Trusted Contact',
        traveler,
        location,
        timestamp,
        customMessage
      });

      successfulSends++;
      results.push({
        name: recipient.name || 'Trusted Contact',
        email: recipient.email.trim(),
        phone: recipient.phone || '',
        status: 'sent',
        messageId: sendRes.messageId,
        previewUrl: sendRes.previewUrl
      });
    } catch (err) {
      failedSends++;
      console.error(`❌ Failed to deliver SOS email to ${recipient.email}:`, err.message);
      results.push({
        name: recipient.name || 'Trusted Contact',
        email: recipient.email ? recipient.email.trim() : '',
        phone: recipient.phone || '',
        status: 'failed',
        error: err.message
      });
    }
  }

  const isCompleteSuccess = successfulSends === validRecipients.length;
  const isPartialSuccess = successfulSends > 0 && failedSends > 0;

  let summaryMessage = `SOS alert successfully sent to ${successfulSends} of ${validRecipients.length} trusted contacts.`;
  if (!isCompleteSuccess && isPartialSuccess) {
    summaryMessage = `SOS alert sent to ${successfulSends} contacts, but failed for ${failedSends} contact(s).`;
  } else if (successfulSends === 0) {
    summaryMessage = `Failed to deliver SOS alert to all ${validRecipients.length} contacts.`;
  }

  return {
    success: successfulSends > 0,
    isCompleteSuccess,
    isPartialSuccess,
    message: summaryMessage,
    totalContacts: validRecipients.length,
    successfulSends,
    failedSends,
    timestamp,
    results
  };
}

module.exports = {
  getTransporter,
  sendSingleSosEmail,
  broadcastSosEmails
};
