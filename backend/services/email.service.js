const Brevo = require('@getbrevo/brevo');
const axios = require('axios');

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

/**
 * Sends transactional email via Brevo TransactionalEmailsApi (HTTPS on port 443).
 * Operates reliably on cloud environments (like Render) with no SMTP port restrictions.
 */
const sendEmail = async (to, subject, text, html) => {
  const apiKey = (process.env.BREVO_API_KEY || '').trim();
  const senderEmail = (process.env.BREVO_SENDER_EMAIL || process.env.EMAIL_USER || 'nutrigeniehealth@gmail.com').trim();
  const senderName = (process.env.BREVO_SENDER_NAME || 'NutriGenie').trim();

  if (!apiKey) {
    const errorMsg = 'BREVO_API_KEY environment variable is not configured in Render.';
    console.error(`[EMAIL SERVICE - BREVO] Configuration error: ${errorMsg}`);
    return {
      success: false,
      code: 'MISSING_BREVO_KEY',
      error: errorMsg
    };
  }

  const emailPayload = {
    sender: {
      name: senderName,
      email: senderEmail
    },
    to: [
      {
        email: to,
        name: to.split('@')[0] || 'NutriGenie User'
      }
    ],
    subject,
    htmlContent: html,
    textContent: text
  };

  try {
    // 1. Send via Brevo SDK
    if (Brevo.BrevoClient) {
      const client = new Brevo.BrevoClient({ apiKey });
      const result = await client.transactionalEmails.sendTransacEmail(emailPayload);
      const messageId = result?.messageId || result?.messageIds?.[0] || 'sent';
      console.log(`[EMAIL SERVICE - BREVO] Email sent successfully via Brevo SDK to ${to} (Message ID: ${messageId})`);
      return {
        success: true,
        data: result,
        messageId
      };
    } else if (Brevo.TransactionalEmailsApi) {
      const apiInstance = new Brevo.TransactionalEmailsApi();
      apiInstance.setApiKey(Brevo.TransactionalEmailsApiApiKeys?.apiKey || 0, apiKey);
      const result = await apiInstance.sendTransacEmail(emailPayload);
      const messageId = result?.messageId || 'sent';
      console.log(`[EMAIL SERVICE - BREVO] Email sent successfully via Brevo SDK to ${to} (Message ID: ${messageId})`);
      return {
        success: true,
        data: result,
        messageId
      };
    }

    // 2. Direct Brevo REST API fallback via axios
    const response = await axios.post(BREVO_API_URL, emailPayload, {
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000
    });

    const messageId = response.data?.messageId || response.headers?.['message-id'];
    console.log(`[EMAIL SERVICE - BREVO] Email sent successfully via Brevo REST API to ${to} (Message ID: ${messageId})`);
    return {
      success: true,
      data: response.data,
      messageId
    };
  } catch (error) {
    const brevoData = error.response?.data || error.body;
    const statusCode = error.response?.status || error.statusCode;

    console.error('[EMAIL SERVICE - BREVO] Delivery error:', {
      status: statusCode,
      data: brevoData,
      message: error.message
    });

    let specificMessage = brevoData?.message || error.message || 'Failed to deliver email via Brevo API';
    let specificCode = brevoData?.code || (statusCode ? `HTTP_${statusCode}` : 'BREVO_ERROR');

    // Diagnose common Brevo API issues
    if (statusCode === 401 || specificCode === 'unauthorized' || (specificMessage && specificMessage.includes('Key not found'))) {
      specificCode = 'BREVO_UNAUTHORIZED';
      specificMessage = 'Invalid Brevo API key. Please verify BREVO_API_KEY in Render environment variables.';
    } else if (statusCode === 400 && specificMessage.toLowerCase().includes('sender')) {
      specificCode = 'BREVO_SENDER_UNVERIFIED';
      specificMessage = `Sender email "${senderEmail}" is not verified in Brevo. Log in to Brevo > Senders, Domains & IPs and verify ${senderEmail}.`;
    }

    return {
      success: false,
      code: specificCode,
      error: specificMessage,
      details: brevoData || error.message
    };
  }
};



async function sendverificationEmail(userEmail, userName, verificationCode) {
    const subject = 'Verify Your Email for NutriGenie! 📨';

    const text = `Hello ${userName},

Thank you for registering with NutriGenie!

Please verify your email address using the verification code below:

${verificationCode}

This code will expire shortly. If you did not create a NutriGenie account, you can safely ignore this email.

Best regards,
The NutriGenie Team`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your Email - NutriGenie</title>
</head>

<body style="
    margin:0;
    padding:0;
    background-color:#f4f6f8;
    font-family:'Segoe UI', Arial, sans-serif;
">

    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="padding:40px 15px;">
        <tr>
            <td align="center">

                <!-- Main Container -->
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="
                    max-width:600px;
                    width:100%;
                    background:#ffffff;
                    border-radius:12px;
                    overflow:hidden;
                    box-shadow:0 8px 24px rgba(79,70,229,0.12);
                ">

                    <!-- Header -->
                    <tr>
                        <td style="
                            background:linear-gradient(135deg,#4f46e5,#7c3aed);
                            padding:44px 40px;
                            text-align:center;
                        ">

                            <div style="
                                width:64px;
                                height:64px;
                                background:rgba(255,255,255,0.15);
                                border-radius:50%;
                                margin:0 auto 16px;
                                line-height:64px;
                                font-size:30px;
                            ">
                                📨
                            </div>

                            <h1 style="
                                margin:0;
                                color:#ffffff;
                                font-size:28px;
                                font-weight:700;
                            ">
                                Verify Your Email
                            </h1>

                            <p style="
                                margin:10px 0 0;
                                color:rgba(255,255,255,0.9);
                                font-size:15px;
                            ">
                                Welcome to NutriGenie!
                            </p>

                        </td>
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding:40px;">

                            <h2 style="
                                margin:0 0 16px;
                                color:#1f2937;
                                font-size:22px;
                                font-weight:600;
                            ">
                                Hello ${userName} 👋
                            </h2>

                            <p style="
                                margin:0 0 16px;
                                color:#4b5563;
                                font-size:16px;
                                line-height:1.7;
                            ">
                                Thank you for registering with
                                <strong style="color:#4f46e5;">NutriGenie</strong>.
                            </p>

                            <p style="
                                margin:0 0 28px;
                                color:#4b5563;
                                font-size:16px;
                                line-height:1.7;
                            ">
                                Please use the verification code below to verify
                                your email address:
                            </p>

                            <!-- Verification Code -->
                            <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                <tr>
                                    <td align="center" style="
                                        background:#f5f3ff;
                                        border:2px dashed #c4b5fd;
                                        border-radius:10px;
                                        padding:24px;
                                    ">

                                        <p style="
                                            margin:0 0 10px;
                                            color:#6b7280;
                                            font-size:13px;
                                            text-transform:uppercase;
                                            letter-spacing:1.5px;
                                            font-weight:600;
                                        ">
                                            Verification Code
                                        </p>

                                        <div style="
                                            font-size:36px;
                                            font-weight:700;
                                            letter-spacing:10px;
                                            color:#4f46e5;
                                        ">
                                            ${verificationCode}
                                        </div>

                                    </td>
                                </tr>
                            </table>

                            <!-- Expiry Notice -->
                            <p style="
                                margin:28px 0 0;
                                padding:14px 16px;
                                background:#fff7ed;
                                border-radius:8px;
                                color:#9a3412;
                                font-size:14px;
                                line-height:1.5;
                            ">
                                ⏰ <strong>This verification code will expire shortly.</strong>
                                Please complete the verification process as soon as possible.
                            </p>

                            <p style="
                                margin:28px 0 0;
                                color:#6b7280;
                                font-size:14px;
                                line-height:1.6;
                            ">
                                If you did not create a NutriGenie account, you can
                                safely ignore this email.
                            </p>

                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="
                            background:#f9fafb;
                            border-top:1px solid #e5e7eb;
                            padding:24px 40px;
                            text-align:center;
                        ">

                            <p style="
                                margin:0 0 8px;
                                color:#374151;
                                font-size:14px;
                                font-weight:600;
                            ">
                                The NutriGenie Team 💜
                            </p>

                            <p style="
                                margin:0;
                                color:#9ca3af;
                                font-size:12px;
                                line-height:1.5;
                            ">
                                This is an automated email. Please do not reply to this message.
                            </p>

                        </td>
                    </tr>

                </table>

            </td>
        </tr>
    </table>

</body>
</html>
`;

    // Always log verification code to server console so developers/admins can retrieve it immediately from Render/terminal logs
    console.log(`🔑 [VERIFICATION CODE] Code for ${userEmail}: ${verificationCode}`);

    return await sendEmail(userEmail, subject, text, html);
}


async function sendRegisterationEmail(userEmail, userName) {
    const subject = 'Welcome to NutriGenie! 🎉';

    const text = `Hello ${userName},\n\nThank you for registering with NutriGenie! We're excited to have you on board.\n\nBest regards,\nThe NutriGenie Team`;

    const html = `
    <div style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(79,70,229,0.12);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:44px 40px; text-align:center;">
                  <div style="width:64px; height:64px; background:rgba(255,255,255,0.15); border-radius:50%; margin:0 auto 16px; line-height:64px; font-size:30px;">
                    🎉
                  </div>
                  <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">
                    Welcome to NutriGenie!
                  </h1>
                  <p style="color:#e0e0ff; margin:8px 0 0; font-size:14px;">
                    Your journey starts here
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="font-size:16px; color:#333333; line-height:1.6; margin:0 0 16px;">
                    Hello <strong>${userName}</strong>,
                  </p>
                  <p style="font-size:15px; color:#555555; line-height:1.6; margin:0 0 28px;">
                    Thank you for registering with <strong>NutriGenie</strong>! We're thrilled to have you join our community.
                    Your account has been successfully created, and you're all set to get started.
                  </p>

                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto 20px;">
                    <tr>
                      <td style="border-radius:8px; background:linear-gradient(135deg,#4f46e5,#7c3aed);">
                        <a href="https://nutrigenie.vercel.app/"
                           style="display:inline-block; padding:14px 36px; font-size:15px; color:#ffffff; text-decoration:none; font-weight:600; border-radius:8px;">
                          Go to Dashboard →
                        </a>
                      </td>
                    </tr>
                  </table>

                  <!-- Info note -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6ff; border-left:4px solid #7c3aed; border-radius:6px; margin:0 0 24px;">
                    <tr>
                      <td style="padding:14px 18px;">
                        <p style="font-size:13px; color:#555577; margin:0; line-height:1.5;">
                          Click the button above to head to your dashboard, where you can explore all the features and start using our services right away.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; color:#888888; line-height:1.6; margin:0;">
                    If you have any questions, feel free to reply to this email — we're always happy to help.
                  </p>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f4f6f8; padding:24px 40px; text-align:center;">
                  <p style="font-size:12px; color:#999999; margin:0;">
                    Best regards,<br><strong>The NutriGenie Team</strong>
                  </p>
                  <p style="font-size:11px; color:#bbbbbb; margin:10px 0 0;">
                    © ${new Date().getFullYear()} NutriGenie. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
    `;

    return await sendEmail(userEmail, subject, text, html);
}


async function sendLoginEmail(userEmail, userName, loginDetails = {}) {
    const {
        device = 'Unknown Device',
        location = 'Unknown Location',
        ipAddress = 'N/A',
        time = new Date().toLocaleString()
    } = loginDetails;

    const subject = 'New Login to Your NutriGenie Account 🔐';

    const text = `Hello ${userName},\n\nWe noticed a new login to your NutriGenie account.\n\nTime: ${time}\nDevice: ${device}\nLocation: ${location}\nIP Address: ${ipAddress}\n\nIf this was you, no action is needed. If you don't recognize this activity, please secure your account immediately.\n\nBest regards,\nThe NutriGenie Team`;

    const html = `
    <div style="margin:0; padding:0; background-color:#f4f6f8; font-family:'Segoe UI', Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 8px 24px rgba(79,70,229,0.12);">

              <!-- Header -->
              <tr>
                <td style="background:linear-gradient(135deg,#4f46e5,#7c3aed); padding:44px 40px; text-align:center;">
                  <div style="width:64px; height:64px; background:rgba(255,255,255,0.15); border-radius:50%; margin:0 auto 16px; line-height:64px; font-size:30px;">
                    🔐
                  </div>
                  <h1 style="color:#ffffff; margin:0; font-size:26px; font-weight:700;">
                    New Login Detected
                  </h1>
                  <p style="color:#e0e0ff; margin:8px 0 0; font-size:14px;">
                    Your account security matters to us
                  </p>
                </td>
              </tr>

              <!-- Body -->
              <tr>
                <td style="padding:40px;">
                  <p style="font-size:16px; color:#333333; line-height:1.6; margin:0 0 16px;">
                    Hello <strong>${userName}</strong>,
                  </p>
                  <p style="font-size:15px; color:#555555; line-height:1.6; margin:0 0 24px;">
                    We noticed a new login to your <strong>NutriGenie</strong> account. Here are the details:
                  </p>

                  <!-- Login Details Card -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb; border-radius:8px; margin:0 0 28px;">
                    <tr>
                      <td style="padding:20px 24px;">
                        <table width="100%" cellpadding="0" cellspacing="0">
                          <tr>
                            <td style="padding:6px 0; font-size:13px; color:#888888; width:120px;">🕒 Time</td>
                            <td style="padding:6px 0; font-size:14px; color:#333333; font-weight:600;">${time}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0; font-size:13px; color:#888888;">💻 Device</td>
                            <td style="padding:6px 0; font-size:14px; color:#333333; font-weight:600;">${device}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0; font-size:13px; color:#888888;">📍 Location</td>
                            <td style="padding:6px 0; font-size:14px; color:#333333; font-weight:600;">${location}</td>
                          </tr>
                          <tr>
                            <td style="padding:6px 0; font-size:13px; color:#888888;">🌐 IP Address</td>
                            <td style="padding:6px 0; font-size:14px; color:#333333; font-weight:600;">${ipAddress}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>

                  <p style="font-size:14px; color:#555555; line-height:1.6; margin:0 0 24px;">
                    If this was you, no action is needed — you're all set.
                  </p>

                  <!-- Warning box -->
                  <table width="100%" cellpadding="0" cellspacing="0" style="background:#fff5f5; border-left:4px solid #ef4444; border-radius:6px; margin:0 0 28px;">
                    <tr>
                      <td style="padding:14px 18px;">
                        <p style="font-size:13px; color:#7f1d1d; margin:0; line-height:1.5;">
                          <strong>Didn't recognize this activity?</strong> Secure your account immediately by resetting your password below.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <!-- CTA Button -->
                  <table cellpadding="0" cellspacing="0" style="margin:0 auto;">
                    <tr>
                      <td style="border-radius:8px; background:linear-gradient(135deg,#ef4444,#dc2626);">
                        <a href="https://netflixgpt-khaki.vercel.app/reset-password"
                           style="display:inline-block; padding:14px 36px; font-size:15px; color:#ffffff; text-decoration:none; font-weight:600; border-radius:8px;">
                          Secure My Account →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer -->
              <tr>
                <td style="background:#f4f6f8; padding:24px 40px; text-align:center;">
                  <p style="font-size:12px; color:#999999; margin:0;">
                    Best regards,<br><strong>The NutriGenie Team</strong>
                  </p>
                  <p style="font-size:11px; color:#bbbbbb; margin:10px 0 0;">
                    © ${new Date().getFullYear()} NutriGenie. All rights reserved.
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </div>
    `;

    return await sendEmail(userEmail, subject, text, html);
}

// Alias sendOTPEmail to sendverificationEmail
async function sendOTPEmail(userEmail, userName, otp) {
    return await sendverificationEmail(userEmail, userName, otp);
}

module.exports = { sendRegisterationEmail, sendLoginEmail, sendverificationEmail, sendOTPEmail, sendEmail };