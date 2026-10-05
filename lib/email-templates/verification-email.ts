/**
 * Modern Email Verification Template for Lazee.dev
 *
 * Replaces the legacy neobrutalist email template with a refined,
 * modern developer-centric SaaS aesthetic matching the Lazee.dev platform.
 *
 * Compatible with all major email clients (Gmail, Apple Mail, Outlook, Superhuman),
 * including mobile responsive rendering and native Dark Mode support.
 */

export interface VerificationEmailOptions {
  identifier: string;
  url: string;
  host?: string;
}

export function generateVerificationEmailHtml({
  identifier,
  url,
  host = "lazee.dev",
}: VerificationEmailOptions): string {
  const currentYear = new Date().getFullYear();
  const escapedHost = host.replace(/[^\w.-]/g, "");
  const escapedIdentifier = identifier.replace(/[^\w.@+-]/g, "");

  return `<!DOCTYPE html>
<html lang="en" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>Sign in to ${escapedHost}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    /* Google Fonts with robust fallback */
    @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@600;700&family=Inter:wght@400;500;600&display=swap');

    :root {
      color-scheme: light dark;
      supported-color-schemes: light dark;
    }

    body {
      margin: 0 !important;
      padding: 0 !important;
      -webkit-text-size-adjust: 100% !important;
      -ms-text-size-adjust: 100% !important;
    }

    table {
      border-collapse: collapse !important;
      mso-table-lspace: 0pt !important;
      mso-table-rspace: 0pt !important;
    }

    img {
      border: 0 !important;
      outline: none !important;
      text-decoration: none !important;
      -ms-interpolation-mode: bicubic !important;
    }

    a[x-apple-data-detectors] {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }

    /* Mobile Responsive */
    @media only screen and (max-width: 600px) {
      .email-canvas {
        padding: 24px 12px !important;
      }
      .email-card {
        padding: 30px 20px !important;
        border-radius: 16px !important;
      }
      .heading-title {
        font-size: 23px !important;
        line-height: 1.25 !important;
      }
      .cta-button {
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: center !important;
        padding: 14px 20px !important;
      }
      .button-wrapper {
        width: 100% !important;
      }
    }

    /* Dark Mode Theme */
    @media (prefers-color-scheme: dark) {
      body, .email-canvas {
        background-color: #09090b !important;
      }
      .email-card {
        background-color: #18181b !important;
        border-color: #27272a !important;
        box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6) !important;
      }
      .brand-title {
        color: #fafafa !important;
      }
      .heading-title {
        color: #fafafa !important;
      }
      .body-paragraph {
        color: #a1a1aa !important;
      }
      .identifier-highlight {
        color: #fafafa !important;
      }
      .badge-container {
        background-color: #271a12 !important;
        border-color: #54270b !important;
      }
      .badge-label {
        color: #fb923c !important;
      }
      .security-box {
        background-color: #1c1917 !important;
        border-color: #292524 !important;
      }
      .security-title {
        color: #fafafa !important;
      }
      .security-item {
        color: #a1a1aa !important;
      }
      .divider-line {
        border-top-color: #27272a !important;
      }
      .fallback-box {
        background-color: #141416 !important;
        border-color: #27272a !important;
      }
      .fallback-label {
        color: #71717a !important;
      }
      .fallback-url {
        color: #fb923c !important;
      }
      .footer-text {
        color: #71717a !important;
      }
      .footer-link {
        color: #a1a1aa !important;
      }
    }
  </style>
</head>
<body class="email-canvas" style="background-color: #f8f7f5; margin: 0; padding: 48px 20px; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader Text (Hidden from email body, shows in inbox snippet) -->
  <div style="display: none; max-height: 0px; overflow: hidden; font-size: 1px; line-height: 1px; max-width: 0px; opacity: 0;">
    Verify your email to sign in to Lazee.dev. Click to instantly access your dashboard and browser extension.
    &#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;&#847;&zwnj;&nbsp;
  </div>

  <!-- Email Wrapper -->
  <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="max-width: 560px; margin: 0 auto;">
    <!-- Brand Header -->
    <tr>
      <td align="center" style="padding-bottom: 28px; text-align: center;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto;">
          <tr>
            <td align="center" style="vertical-align: middle;">
              <a href="https://${escapedHost}" target="_blank" style="text-decoration: none; display: inline-flex; align-items: center;">
                <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                  <tr>
                    <td style="vertical-align: middle; padding-right: 10px;">
                      <img
                        src="https://pub-889628534b094cf89bcd7cd93528323d.r2.dev/assets/logo.png"
                        width="30"
                        height="30"
                        alt="Lazee.dev"
                        style="display: block; width: 30px; height: 30px; border-radius: 8px;"
                      />
                    </td>
                    <td style="vertical-align: middle;">
                      <span class="brand-title" style="font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 21px; font-weight: 700; letter-spacing: -0.02em; color: #09090b;">
                        lazee<span style="color: #ea580c;">.dev</span>
                      </span>
                    </td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-top: 6px;">
              <span style="font-size: 11px; font-weight: 500; letter-spacing: 0.05em; text-transform: uppercase; color: #71717a; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;">
                Stop Typing &bull; Start Applying
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Main Content Card -->
    <tr>
      <td>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" class="email-card" style="background-color: #ffffff; border: 1px solid #e4e4e7; border-radius: 20px; box-shadow: 0 20px 40px -15px rgba(249, 115, 22, 0.08), 0 2px 8px -2px rgba(0, 0, 0, 0.03); overflow: hidden;">
          <!-- Card Top Ambient Gradient Accent Line -->
          <tr>
            <td style="background: linear-gradient(90deg, #ea580c 0%, #fb923c 50%, #ea580c 100%); height: 3px; font-size: 1px; line-height: 1px;">
              &nbsp;
            </td>
          </tr>

          <!-- Inner Content Padding -->
          <tr>
            <td style="padding: 40px 36px 36px 36px;">
              <!-- Pill Badge -->
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-bottom: 20px;">
                <tr>
                  <td class="badge-container" bgcolor="#fff7ed" style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 9999px; padding: 5px 13px;">
                    <span class="badge-label" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; color: #ea580c; display: inline-block;">
                      &bull; Passwordless Sign-In
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Main Heading -->
              <h1 class="heading-title" style="margin: 0 0 12px 0; font-family: 'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 26px; font-weight: 700; line-height: 1.25; color: #09090b; letter-spacing: -0.025em;">
                Verify your email address
              </h1>

              <!-- Intro Paragraph -->
              <p class="body-paragraph" style="margin: 0 0 28px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; line-height: 1.6; color: #52525b;">
                We received a request to log in to Lazee.dev for <strong class="identifier-highlight" style="color: #18181b; font-weight: 600;">${escapedIdentifier}</strong>. Click below to authenticate instantly and access your profile, custom answers, and browser extension.
              </p>

              <!-- CTA Button (Bulletproof: VML for Outlook + CSS for Modern Clients) -->
              <table border="0" cellpadding="0" cellspacing="0" role="presentation" class="button-wrapper" style="margin: 0 0 32px 0;">
                <tr>
                  <td align="left">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${url}" style="height:48px;v-text-anchor:middle;width:240px;" arcsize="25%" stroke="f" fillcolor="#ea580c">
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:'Segoe UI',sans-serif;font-size:15px;font-weight:600;">
                        Sign In to Lazee.dev &rarr;
                      </center>
                    </v:roundrect>
                    <![endif]-->
                    <!--[if !mso]><!-->
                    <a
                      href="${url}"
                      target="_blank"
                      class="cta-button"
                      style="display: inline-block; background-color: #ea580c; background-image: linear-gradient(135deg, #ea580c 0%, #f97316 100%); color: #ffffff; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 15px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 12px; letter-spacing: -0.01em; box-shadow: 0 4px 14px -2px rgba(234, 88, 12, 0.4); text-align: center;"
                    >
                      Sign In to Lazee.dev &rarr;
                    </a>
                    <!--<![endif]-->
                  </td>
                </tr>
              </table>

              <!-- Security & Validity Info Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" class="security-box" style="background-color: #fafafa; border: 1px solid #f4f4f5; border-radius: 14px; margin-bottom: 28px;">
                <tr>
                  <td style="padding: 16px 18px;">
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                      <tr>
                        <td style="padding-bottom: 8px;">
                          <span class="security-title" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; font-weight: 600; color: #27272a; text-transform: uppercase; letter-spacing: 0.05em;">
                            Security &amp; Session Details
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td class="security-item" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 13px; line-height: 1.6; color: #52525b;">
                          &bull; <strong>Single-use link:</strong> Automatically invalidates once used.<br>
                          &bull; <strong>Valid for 24 hours:</strong> Please authenticate before expiration.<br>
                          &bull; <strong>Device sync:</strong> Syncs your profile and browser extension immediately.
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom: 24px;">
                <tr>
                  <td class="divider-line" style="border-top: 1px solid #f4f4f5; font-size: 1px; line-height: 1px;">
                    &nbsp;
                  </td>
                </tr>
              </table>

              <!-- Fallback Direct URL Box -->
              <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
                <tr>
                  <td>
                    <p class="fallback-label" style="margin: 0 0 8px 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 1.5; color: #71717a;">
                      Having trouble with the button? Copy and paste this URL directly into your browser:
                    </p>
                    <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" class="fallback-box" style="background-color: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 10px;">
                      <tr>
                        <td style="padding: 10px 14px; word-break: break-all;">
                          <a
                            href="${url}"
                            target="_blank"
                            class="fallback-url"
                            style="font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 12px; line-height: 1.5; color: #ea580c; text-decoration: underline; word-break: break-all;"
                          >
                            ${url}
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- Footer -->
    <tr>
      <td align="center" style="padding-top: 28px; text-align: center;">
        <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin: 0 auto; max-width: 480px;">
          <tr>
            <td align="center" class="footer-text" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 1.6; color: #71717a; text-align: center; padding-bottom: 12px;">
              If you did not request this email, you can safely ignore it. Your account is protected and no changes have been made.
            </td>
          </tr>
          <tr>
            <td align="center" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 12px; line-height: 1.5; text-align: center; padding-bottom: 8px;">
              <a href="https://${escapedHost}" class="footer-link" style="color: #71717a; text-decoration: underline; margin: 0 6px;">Lazee.dev</a>
              &bull;
              <a href="https://${escapedHost}/privacy" class="footer-link" style="color: #71717a; text-decoration: underline; margin: 0 6px;">Privacy Policy</a>
              &bull;
              <a href="https://${escapedHost}/terms" class="footer-link" style="color: #71717a; text-decoration: underline; margin: 0 6px;">Terms of Service</a>
            </td>
          </tr>
          <tr>
            <td align="center" class="footer-text" style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; font-size: 11px; line-height: 1.4; color: #a1a1aa; text-align: center;">
              &copy; ${currentYear} Lazee.dev. All rights reserved.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

export function generateVerificationEmailText({
  identifier,
  url,
  host = "lazee.dev",
}: VerificationEmailOptions): string {
  return `Sign in to ${host}

Hello,

We received a request to log in to Lazee.dev for ${identifier}.

Click the link below or copy and paste it into your browser to sign in:
${url}

Security Notice:
- This link is single-use and valid for 24 hours.
- If you did not request this email, you can safely ignore it.

--
Lazee.dev — Stop typing. Start applying.
https://${host}
`;
}
