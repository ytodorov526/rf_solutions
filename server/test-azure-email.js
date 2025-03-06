require('dotenv').config();
const { EmailClient } = require('@azure/communication-email');

// This script tests Azure Email Communication Service

async function main() {
  console.log('Testing Azure Email Communication Service...');

  try {
    // Check if environment variables are set
    if (!process.env.AZURE_EMAIL_CONNECTION_STRING) {
      throw new Error('AZURE_EMAIL_CONNECTION_STRING environment variable is not set');
    }
    if (!process.env.AZURE_EMAIL_SENDER) {
      throw new Error('AZURE_EMAIL_SENDER environment variable is not set');
    }

    // Create email client
    const emailClient = new EmailClient(process.env.AZURE_EMAIL_CONNECTION_STRING);
    console.log('Email client created successfully');

    // Prepare test email
    const testEmail = {
      senderAddress: process.env.AZURE_EMAIL_SENDER,
      content: {
        subject: 'Test Email from RF Solutions Azure Email Service',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background-color: #0047AB; padding: 20px; text-align: center;">
              <h1 style="color: white; margin: 0;">RF Solutions</h1>
            </div>
            <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
              <p>This is a test email from RF Solutions Azure Email Communication Service.</p>
              <p>If you're seeing this, the service is working correctly!</p>
              <p>Timestamp: ${new Date().toISOString()}</p>
            </div>
          </div>
        `
      },
      recipients: {
        to: [
          {
            address: 'ytodorov526@gmail.com',
            displayName: 'RF Solutions Admin'
          }
        ]
      }
    };

    console.log('Sending test email...');
    // Send email
    const poller = await emailClient.beginSend(testEmail);
    const result = await poller.pollUntilDone();
    
    console.log('Test email sent successfully!');
    console.log('Result:', result);
  } catch (error) {
    console.error('Error testing Azure Email Service:', error);
  }
}

// Run the test
main();