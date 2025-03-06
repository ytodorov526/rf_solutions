const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com', // Office 365 SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  }
});

/**
 * Send a confirmation email to the contact
 * @param {Object} contact - Contact information
 * @returns {Promise} - Email sending result
 */
const sendContactConfirmation = async (contact) => {
  const { name, email, inquiryType } = contact;
  
  const mailOptions = {
    from: `"RF Solutions" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `Thank you for contacting RF Solutions: ${inquiryType}`,
    html: `
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
    `
  };

  return transporter.sendMail(mailOptions);
};

/**
 * Send a notification email to the admin about a new contact
 * @param {Object} contact - Contact information
 * @returns {Promise} - Email sending result
 */
const sendAdminNotification = async (contact) => {
  const { name, email, phone, company, inquiryType, message } = contact;
  
  const mailOptions = {
    from: `"RF Solutions System" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
    subject: `New Contact Form Submission: ${inquiryType}`,
    html: `
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
    `
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendContactConfirmation,
  sendAdminNotification
};