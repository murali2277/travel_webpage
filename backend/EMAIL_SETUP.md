# Email and WhatsApp Setup Guide

## Email Configuration

To enable email notifications, you need to configure the following settings in your Django settings or environment variables:

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate an App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password for "Mail"

3. **Configure Environment Variables**:
   ```bash
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USE_TLS=True
   EMAIL_HOST_USER=your-email@gmail.com
   EMAIL_HOST_PASSWORD=your-app-password
   ```

### Other Email Providers

You can use any SMTP provider. Common alternatives:
- **Outlook/Hotmail**: `smtp-mail.outlook.com:587`
- **Yahoo**: `smtp.mail.yahoo.com:587`
- **Custom SMTP**: Your provider's SMTP settings

## WhatsApp Configuration

### Option 1: WhatsApp Business API (Recommended for Production)

1. **Sign up for WhatsApp Business API**
2. **Configure the API credentials**
3. **Update the code to use the official API**

### Option 2: WhatsApp Web Links (Current Implementation)

The current implementation creates WhatsApp web links that open the WhatsApp app. To configure:

```bash
WHATSAPP_PHONE=+919876543210  # Your WhatsApp number
```

## Testing

1. **Start the Django server**:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. **Test booking functionality**:
   - Fill out the booking form
   - Submit the booking
   - Check your email for notifications

3. **Test contact form**:
   - Send a contact message
   - Check for email notifications

## Troubleshooting

### Email Issues
- **Authentication failed**: Check your app password
- **Connection refused**: Check firewall/network settings
- **TLS issues**: Try different port (465 for SSL, 587 for TLS)

### WhatsApp Issues
- **Links not working**: Ensure the phone number is in international format
- **API errors**: Check your WhatsApp Business API credentials

## Production Deployment

For production, consider:
1. **Using a dedicated email service** (SendGrid, Mailgun, etc.)
2. **Implementing WhatsApp Business API** for automated messaging
3. **Adding email templates** for better formatting
4. **Setting up email queues** for better performance 