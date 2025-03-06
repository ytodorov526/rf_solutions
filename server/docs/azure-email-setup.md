# Azure Email Communication Service Setup

RF Solutions uses Azure Email Communication Service to send emails from the application. This document outlines how the service is configured and how to test it.

## Configuration

### Prerequisites

1. An Azure account with an active subscription
2. An Azure Email Communication Service resource
3. A registered and verified domain in the Email Communication Service

### Environment Variables

The following environment variables need to be set:

- `AZURE_EMAIL_CONNECTION_STRING`: The connection string to your Azure Email Communication Service resource
- `AZURE_EMAIL_SENDER`: The sender email address associated with your verified domain in Azure (e.g., `rf-solutions@azurecomm.net`)

### Setting Up in Azure Portal

1. **Create an Email Communication Service resource**:
   - Navigate to Azure Portal
   - Search for "Communication Services"
   - Click "Create"
   - Fill in the required details and create the resource

2. **Add an Email Communication Service domain**:
   - Navigate to your Communication Services resource
   - Select "Email Services" under Features
   - Click "Provision a domain"
   - Follow the wizard to set up a custom domain or use a subdomain of azurecomm.net

3. **Generate a connection string**:
   - In your Communication Services resource, go to "Keys"
   - Copy the connection string (primary or secondary)
   - Add this to your .env file as `AZURE_EMAIL_CONNECTION_STRING`

4. **Set up the sender email**:
   - Once your domain is verified, you can use it as the sender email
   - Add this to your .env file as `AZURE_EMAIL_SENDER`

## Usage in Application

The application uses the Azure Email Communication Service in two main ways:

1. **Contact Form Confirmations**:
   - When a user submits a contact form, they receive a confirmation email
   - The email is sent using the `sendContactConfirmation` function in `emailService.js`

2. **Admin Notifications**:
   - When a user submits a contact form, an admin notification is sent to `ytodorov526@gmail.com`
   - The email is sent using the `sendAdminNotification` function in `emailService.js`

## Testing

You can test the Azure Email Communication Service setup by running:

```bash
node test-azure-email.js
```

This script will:
1. Load environment variables
2. Create an Email client
3. Send a test email to `ytodorov526@gmail.com`
4. Log the result

If successful, you should see a confirmation message in the console and receive the test email.

## Troubleshooting

If you encounter issues:

1. **Check Environment Variables**:
   - Ensure `AZURE_EMAIL_CONNECTION_STRING` and `AZURE_EMAIL_SENDER` are correctly set

2. **Verify Azure Configuration**:
   - Confirm that your Email Communication Service domain is verified
   - Check that your sender email is valid and allowed

3. **Check Logs**:
   - The application logs errors when sending emails fails
   - Look for error messages that may indicate the issue

4. **Rate Limits**:
   - Azure Email Communication Service has rate limits
   - If sending a high volume of emails, you might hit these limits

5. **Spam Filtering**:
   - Test emails may be marked as spam
   - Check your spam folder if test emails are not appearing in the inbox