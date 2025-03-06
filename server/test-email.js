require('dotenv').config();
const emailService = require('./src/services/emailService');

// Test contact data
const testContact = {
  name: 'Test User',
  email: process.env.TEST_EMAIL || process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
  phone: '555-123-4567',
  company: 'Test Company',
  inquiryType: 'Test Inquiry',
  message: 'This is a test message to verify email functionality.'
};

// Run the test
async function testEmailService() {
  console.log('Testing email service...');
  console.log('Using email configuration:');
  console.log(`- EMAIL_USER: ${process.env.EMAIL_USER}`);
  console.log(`- Sending test to: ${testContact.email}`);
  
  try {
    console.log('Sending confirmation email...');
    const confirmResult = await emailService.sendContactConfirmation(testContact);
    console.log('Confirmation email sent successfully!');
    console.log('MessageId:', confirmResult.messageId);
    
    console.log('\nSending admin notification...');
    const notifyResult = await emailService.sendAdminNotification(testContact);
    console.log('Admin notification sent successfully!');
    console.log('MessageId:', notifyResult.messageId);
    
    console.log('\nEmail test completed successfully!');
  } catch (error) {
    console.error('Error sending emails:', error);
    console.log('\nFull error details:');
    console.dir(error, { depth: null });
  }
}

// Run the test
testEmailService();