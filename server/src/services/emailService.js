const { EmailClient } = require('@azure/communication-email');

// Azure Email Communication Service configuration
const connectionString = process.env.AZURE_EMAIL_CONNECTION_STRING;
const emailClient = new EmailClient(connectionString);

/**
 * Send a confirmation email to the contact
 * @param {Object} contact - Contact information
 * @returns {Promise} - Email sending result
 */
const sendContactConfirmation = async (contact) => {
  const { name, email, inquiryType } = contact;
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0047AB; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">RF Solutions</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <p>Dear ${name},</p>
        <p>Thank you for contacting RF Solutions. We have received your inquiry about ${inquiryType}.</p>
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
      subject: `Thank you for contacting RF Solutions: ${inquiryType}`,
      html: emailContent
    },
    recipients: {
      to: [
        {
          address: email,
          displayName: name
        }
      ]
    }
  };

  try {
    const poller = await emailClient.beginSend(emailMessage);
    const result = await poller.pollUntilDone();
    return result;
  } catch (error) {
    console.error("Error sending confirmation email:", error);
    throw error;
  }
};

/**
 * Send a notification email to the admin about a new contact
 * @param {Object} contact - Contact information
 * @returns {Promise} - Email sending result
 */
const sendAdminNotification = async (contact) => {
  const { name, email, phone, company, inquiryType, message } = contact;
  
  const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #0047AB; padding: 20px; text-align: center;">
        <h1 style="color: white; margin: 0;">New Contact Form Submission</h1>
      </div>
      <div style="padding: 20px; border: 1px solid #ddd; border-top: none;">
        <h2>Contact Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || 'Not provided'}</li>
          <li><strong>Company:</strong> ${company || 'Not provided'}</li>
          <li><strong>Inquiry Type:</strong> ${inquiryType}</li>
        </ul>
        <h2>Message:</h2>
        <p>${message}</p>
        <p>You can log in to the admin dashboard to view and manage this inquiry.</p>
      </div>
    </div>
  `;

  const emailMessage = {
    senderAddress: process.env.AZURE_EMAIL_SENDER,
    content: {
      subject: `New Contact Form Submission: ${inquiryType}`,
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
    return result;
  } catch (error) {
    console.error("Error sending admin notification email:", error);
    throw error;
  }
};

module.exports = {
  sendContactConfirmation,
  sendAdminNotification
};