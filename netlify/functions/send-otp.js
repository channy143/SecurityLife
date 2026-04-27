const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const { toEmail, otpCode, userName } = JSON.parse(event.body);

    if (!toEmail || !otpCode) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing email or OTP code' }),
      };
    }

    // Check if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return {
        statusCode: 503,
        headers,
        body: JSON.stringify({ error: 'SMTP not configured' }),
      };
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send email
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

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId,
        message: 'OTP email sent successfully',
      }),
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        success: false,
        error: error.message,
      }),
    };
  }
};
