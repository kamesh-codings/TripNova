require('dotenv').config();
const { sendSingleSosEmail } = require('../services/emailService');

const targetEmail = process.argv[2] || process.env.SMTP_USER || 'test@example.com';

console.log('====================================================');
console.log('TripNova SOS Email Delivery Test Tool');
console.log(`Target Recipient: ${targetEmail}`);
console.log(`Configured SMTP User: ${process.env.SMTP_USER || '(None - Using Ethereal Preview)'}`);
console.log(`Configured SMTP Host: ${process.env.SMTP_HOST || 'Ethereal / Demo'}`);
console.log('====================================================');

async function runTest() {
  try {
    const result = await sendSingleSosEmail({
      to: targetEmail,
      recipientName: 'Test Recipient',
      traveler: {
        name: 'Kamesh (TripNova Admin)',
        phone: '+91 98765 43210',
        email: 'kamesh@tripnova.app',
        bloodGroup: 'O+',
        allergies: 'None',
        medicalConditions: 'None'
      },
      location: {
        latitude: 13.0827,
        longitude: 80.2707,
        address: 'Marina Beach Safety Zone, Chennai, Tamil Nadu'
      },
      timestamp: new Date().toLocaleString(),
      customMessage: 'TripNova SOS live email test broadcast.'
    });

    console.log('✅ Email Dispatch Succeeded:');
    console.log(JSON.stringify(result, null, 2));
    if (result.previewUrl) {
      console.log(`\n🔗 View Demo Email in Browser: ${result.previewUrl}`);
    } else {
      console.log(`\n📬 Check your real inbox at: ${targetEmail}`);
    }
  } catch (err) {
    console.error('❌ Email Dispatch Failed:', err.message);
  }
}

runTest();
