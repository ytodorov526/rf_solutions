# Email Configuration for RF Solutions

This document explains how to set up and configure the email functionality for the RF Solutions website.

## Overview

The website uses nodemailer to send emails for:
1. Confirmation emails to users who submit contact forms
2. Notification emails to administrators about new submissions

## Configuration Steps

### 1. Environment Variables

Update the `.env` file in the server directory with your email credentials:

```
# Email configuration
EMAIL_USER=info@rf-solutions1.azurewebsites.net
EMAIL_PASSWORD=your_secure_password_here
ADMIN_EMAIL=admin@rf-solutions1.azurewebsites.net
```

### 2. Email Provider Configuration

The default configuration uses Office 365 SMTP server. If you're using a different email provider, update the transporter in `src/services/emailService.js`:

#### For Gmail:
```javascript
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

#### For AWS SES:
```javascript
const transporter = nodemailer.createTransport({
  SES: new AWS.SES({
    apiVersion: '2010-12-01',
    region: 'us-east-1', // Change to your AWS region
  }),
});
```

### 3. Testing Email Functionality

Run the test script to verify your email configuration:

```
node test-email.js
```

This will send test emails to the configured address and display the results.

## Production Deployment

When deploying to Azure, make sure to set the following application settings in the Azure Portal:

- EMAIL_USER
- EMAIL_PASSWORD
- ADMIN_EMAIL
- DEMO_MODE (set to 'false' for production)

## Troubleshooting

If emails are not being sent:

1. Check your SMTP server settings and credentials
2. Verify there are no firewall or network restrictions blocking outgoing SMTP traffic
3. For Office 365, ensure the account has permissions to send mail
4. Check the server logs for detailed error messages

## Security Notes

- Never commit email credentials to your git repository
- Consider using Azure Key Vault or similar services to store sensitive credentials
- Use environment variables to manage configuration