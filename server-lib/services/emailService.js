/**
 * Send a confirmation email to the contact via Resend API.
 */
export const sendContactConfirmation = async (contact, env) => {
  if (!env.RESEND_API_KEY) return null;

  const { name, email, inquiryType } = contact;
  if (!email) return null;

  const html = `
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
      </div>
      <div style="background-color: #f5f5f5; padding: 10px; text-align: center; font-size: 12px; color: #666;">
        <p>&copy; ${new Date().getFullYear()} RF Solutions. All rights reserved.</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || 'RF Solutions <noreply@yourdomain.com>',
        to: [email],
        subject: `Thank you for contacting RF Solutions: ${inquiryType || 'Inquiry'}`,
        html,
      }),
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};

/**
 * Send a notification email to the admin about a new contact via Resend API.
 */
export const sendAdminNotification = async (contact, env) => {
  if (!env.RESEND_API_KEY || !env.ADMIN_EMAIL) return null;

  const { name, email, phone, company, inquiryType, message } = contact;

  const html = `
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
      </div>
    </div>
  `;

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: env.EMAIL_FROM || 'RF Solutions <noreply@yourdomain.com>',
        to: [env.ADMIN_EMAIL],
        subject: `New Contact Form Submission: ${inquiryType || 'Inquiry'}`,
        html,
      }),
    });
    return res.ok ? await res.json() : null;
  } catch {
    return null;
  }
};
