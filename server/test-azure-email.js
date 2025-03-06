require('dotenv').config();
const { EmailClient } = require('@azure/communication-email');

// This script tests Azure Email Communication Service

async function main() {
  console.log('Testing Azure Email Communication Service...');

  try {
    // Check if environment variables are set
    if (!process.env.AZURE_EMAIL_CONNECTION_STRING) {
      console.error('\n❌ AZURE_EMAIL_CONNECTION_STRING environment variable is not set');
      console.log('\nPlease set this variable in your .env file:');
      console.log('AZURE_EMAIL_CONNECTION_STRING=your_connection_string_here');
      console.log('\nYou can get this value from the Azure Portal:');
      console.log('1. Go to your Communication Services resource');
      console.log('2. Navigate to "Keys" in the left sidebar');
      console.log('3. Copy the Connection String (primary or secondary)');
      return;
    }
    
    if (!process.env.AZURE_EMAIL_SENDER) {
      console.error('\n❌ AZURE_EMAIL_SENDER environment variable is not set');
      console.log('\nPlease set this variable in your .env file:');
      console.log('AZURE_EMAIL_SENDER=your_verified_email_address@domain.com');
      console.log('\nThis should be your verified sender address from Azure Communication Services.');
      console.log('You can set this up in the Azure Portal:');
      console.log('1. Go to your Communication Services resource');
      console.log('2. Navigate to "Email Services" > "Domains and Senders"');
      console.log('3. Add and verify a domain or use a subdomain of azurecomm.net');
      return;
    }

    // Create email client
    try {
      const emailClient = new EmailClient(process.env.AZURE_EMAIL_CONNECTION_STRING);
      console.log('✅ Email client created successfully');

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

      console.log('Sending test email to ytodorov526@gmail.com...');
      // Send email
      const poller = await emailClient.beginSend(testEmail);
      const result = await poller.pollUntilDone();
      
      console.log('✅ Test email sent successfully!');
      console.log('Result:', result);
      console.log('\nEmail service is properly configured and working.');
    } catch (clientError) {
      console.error('❌ Error creating email client or sending email:', clientError.message);
      console.log('\nPossible issues:');
      console.log('- The connection string might be invalid');
      console.log('- The sender email address might not be verified');
      console.log('- There might be network connectivity issues');
      console.log('- The Azure Communication Service might be down or unavailable');
      
      if (clientError.message.includes('authentication')) {
        console.log('\nThis appears to be an authentication issue. Please check your connection string.');
      }
      
      if (clientError.message.includes('sender')) {
        console.log('\nThis appears to be an issue with the sender email. Make sure it\'s verified in Azure.');
      }
    }
  } catch (error) {
    console.error('❌ Unexpected error testing Azure Email Service:', error.message);
  }
}

// Run the test
main().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});