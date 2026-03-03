import nodemalir from "nodemailer";

export const sendEmail = async ({
  from = process.env.APP_EMAIL,
  to = "",
  cc = "",
  bcc = "",
  text = "",
  html = "",
  subject = "Sraha Application",
  attachments = [],
} = {}) => {
  const transporter = nodemalir.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `"Sraha App" <${from}>`,
    to,
    cc,
    bcc,
    text,
    html,
    subject,
    attachments,
  });
};
