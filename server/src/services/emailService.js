const { EmailClient } = require('@azure/communication-email');

// Flag to track if email service is available
let emailServiceAvailable = false;
let emailClient = null;

// Try to initialize Azure Email Communication Service
try {
  // Check if required environment variables are set
  const connectionString = process.env.AZURE_EMAIL_CONNECTION_STRING;
  const senderEmail = process.env.AZURE_EMAIL_SENDER;
  
  if (connectionString && senderEmail) {
    emailClient = new EmailClient(connectionString);
    emailServiceAvailable = true;
    console.log('Azure Email Communication Service initialized successfully');
  } else {
    console.warn('Azure Email Communication Service not configured. Email functionality will be disabled.');
    console.warn('Missing environment variables:', 
      !connectionString ? 'AZURE_EMAIL_CONNECTION_STRING' : '', 
      !senderEmail ? 'AZURE_EMAIL_SENDER' : '');
  }
} catch (error) {
  console.error('Failed to initialize Azure Email Communication Service:', error.message);
  // Email service will remain disabled
}

/**
 * Send a confirmation email to the contact
 * @param {Object} contact - Contact information
 * @returns {Promise} - Email sending result or null if email service is unavailable
 */
const sendContactConfirmation = async (contact) => {
  // If email service is not available, log and return gracefully
  if (!emailServiceAvailable) {
    console.log('Email service unavailable. Skipping confirmation email to contact:', contact.email);
    return null;
  }

  try {
    const { name, email, inquiryType } = contact;
    
    // Validate required input
    if (!email) {
      console.warn('Missing email address for contact confirmation, skipping');
      return null;
    }
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0047AB; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">RF Solutions</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <p>Dear ${name || 'Valued Customer'},</p>
          <p>Thank you for contacting RF Solutions. We have received your inquiry about ${inquiryType || 'our services'}.</p>
          <p>One of our specialists will review your message and get back to you shortly.</p>
          <p>Your inquiry has been recorded in our system and will be handled with priority.</p>
          <p>Best regards,</p>
          <p><strong>RF Solutions Team</strong></p>
          <p>Website: <a href="https://rf-solutions1.azurewebsites.net">rf-solutions1.azurewebsites.net</a></p>
        </div>
        <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
          <p>© ${new Date().getFullYear()} RF Solutions. All rights reserved.</p>
        </div>
      </div>
    `;

    const emailMessage = {
      senderAddress: process.env.AZURE_EMAIL_SENDER,
      content: {
        subject: `Thank you for contacting RF Solutions: ${inquiryType || 'Inquiry'}`,
        html: emailContent
      },
      recipients: {
        to: [
          {
            address: email,
            displayName: name || 'Valued Customer'
          }
        ]
      }
    };

    try {
      const poller = await emailClient.beginSend(emailMessage);
      const result = await poller.pollUntilDone();
      console.log('Confirmation email sent successfully to:', email);
      return result;
    } catch (error) {
      console.error("Error sending confirmation email:", error.message);
      // Return null instead of throwing to ensure the application continues
      return null;
    }
  } catch (error) {
    console.error("Unexpected error in sendContactConfirmation:", error.message);
    // Return null to prevent application from crashing
    return null;
  }
};

/**
 * Send a notification email to the admin about a new contact
 * @param {Object} contact - Contact information
 * @returns {Promise} - Email sending result or null if email service is unavailable
 */
const sendAdminNotification = async (contact) => {
  // If email service is not available, log and return gracefully
  if (!emailServiceAvailable) {
    console.log('Email service unavailable. Skipping admin notification for contact submission.');
    return null;
  }
  
  try {
    const { name, email, phone, company, inquiryType, message } = contact;
    
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #0047AB; padding: 20px; text-align: center;">
          <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
          <h2>Contact Details:</h2>
          <ul>
            <li><strong>Name:</strong> ${name || 'Not provided'}</li>
            <li><strong>Email:</strong> ${email || 'Not provided'}</li>
            <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
            <li><strong>Company:</strong> ${company || 'Not provided'}</li>
            <li><strong>Inquiry Type:</strong> ${inquiryType || 'Not specified'}</li>
          </ul>
          <h2>Message:</h2>
          <p>${message || 'No message content'}</p>
          <p>You can log in to the admin dashboard to view and manage this inquiry.</p>
        </div>
      </div>
    `;

    const emailMessage = {
      senderAddress: process.env.AZURE_EMAIL_SENDER,
      content: {
        subject: `New Contact Form Submission: ${inquiryType || 'Inquiry'}`,
        html: emailContent
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

    try {
      const poller = await emailClient.beginSend(emailMessage);
      const result = await poller.pollUntilDone();
      console.log('Admin notification email sent successfully');
      return result;
    } catch (error) {
      console.error("Error sending admin notification email:", error.message);
      // Return null instead of throwing to ensure the application continues
      return null;
    }
  } catch (error) {
    console.error("Unexpected error in sendAdminNotification:", error.message);
    // Return null to prevent application from crashing
    return null;
  }
};

module.exports = {
  sendContactConfirmation,
  sendAdminNotification
};