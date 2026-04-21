const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// SMTP Configuration
// Supports Gmail, Outlook, or any SMTP provider
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER, // Your email address
    pass: process.env.SMTP_PASS, // Your email app password
  },
});

// Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error('SMTP Connection Error:', error);
  } else {
    console.log('SMTP Server Ready to Send Emails');
  }
});

// Send OTP Email Endpoint
app.post('/api/send-otp', async (req, res) => {
  const { toEmail, otpCode, userName } = req.body;

  if (!toEmail || !otpCode) {
    return res.status(400).json({ error: 'Missing email or OTP code' });
  }

  try {
    const mailOptions = {
      from: `"SecureLife" <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: 'Your SecureLife Authentication Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">SecureLife Authentication</h2>
          <p>Hello ${userName || 'there'},</p>
          <p>To complete your login, please use the following One Time Password (OTP):</p>
          <div style="background: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
            <span style="font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #1f2937;">${otpCode}</span>
          </div>
          <p>This OTP will be valid for <strong>5 minutes</strong>.</p>
          <p style="color: #6b7280; font-size: 14px;">
            Do not share this OTP with anyone. If you didn't make this request, you can safely ignore this email.
          </p>
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
          <p style="color: #6b7280; font-size: 12px;">
            SecureLife will never contact you about this email or ask for any login codes or links. Beware of phishing scams.
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('OTP Email sent:', info.messageId);
    
    res.json({ 
      success: true, 
      messageId: info.messageId,
      message: 'OTP email sent successfully' 
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', smtpConfigured: !!process.env.SMTP_USER });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`SMTP Server running on port ${PORT}`);
});
