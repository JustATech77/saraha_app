export const verfiyEmailTemplet = ({ otp, title = "Email Confirmation" }) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#f0f4f8;font-family:'Segoe UI',Tahoma,Geneva,Verdana,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="420" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%);padding:40px 30px;text-align:center;">
              <h1 style="margin:0;font-size:36px;font-weight:800;letter-spacing:6px;color:#e94560;">SRAHA</h1>
              <p style="margin:8px 0 0;font-size:13px;color:#a8b2d1;letter-spacing:2px;text-transform:uppercase;">Application</p>
            </td>
          </tr>

          <!-- Icon -->
          <tr>
            <td align="center" style="padding:30px 0 10px;">
              <div style="width:64px;height:64px;border-radius:50%;background-color:#e94560;display:inline-block;line-height:64px;text-align:center;">
                <span style="font-size:30px;color:#ffffff;">&#9993;</span>
              </div>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td style="padding:10px 40px 0;text-align:center;">
              <h2 style="margin:0;font-size:22px;color:#1a1a2e;">${title}</h2>
            </td>
          </tr>

          <!-- Message -->
          <tr>
            <td style="padding:14px 40px 0;text-align:center;">
              <p style="margin:0;font-size:14px;color:#6b7280;line-height:1.7;">
                Use the verification code below to complete your action. This code is valid for a limited time.
              </p>
            </td>
          </tr>

          <!-- OTP Code -->
          <tr>
            <td align="center" style="padding:28px 40px;">
              <div style="display:inline-block;background-color:#1a1a2e;border-radius:12px;padding:16px 40px;border:2px dashed #e94560;">
                <span style="font-size:32px;font-weight:700;letter-spacing:8px;color:#e94560;">${otp}</span>
              </div>
            </td>
          </tr>

          <!-- Warning -->
          <tr>
            <td style="padding:0 40px 30px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#9ca3af;">
                If you didn't request this, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <hr style="border:none;border-top:1px solid #e5e7eb;margin:0;" />
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px 30px;text-align:center;">
              <p style="margin:0 0 6px;font-size:16px;font-weight:700;color:#1a1a2e;letter-spacing:3px;">SRAHA</p>
              <p style="margin:0;font-size:11px;color:#9ca3af;">
                &copy; ${new Date().getFullYear()} Sraha App. All rights reserved.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
};
