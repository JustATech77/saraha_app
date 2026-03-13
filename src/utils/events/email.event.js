import { EventEmitter } from "node:events";
import { sendEmail } from "../email/send.email.js";
import { verfiyEmailTemplet } from "../email/templates/verfiy.email.js";

export const emailEvent = new EventEmitter();

emailEvent.on("confirmEmail", async (data) => {
  try {
    await sendEmail({
      to: data.to,
      subject: data.subject,
      html: verfiyEmailTemplet({ otp: data.otp, title: data.subject }),
    });
  } catch (error) {
    console.log("Fail To Send Email", error.message);
  }
});

emailEvent.on("reset password", async (data) => {
  try {
    await sendEmail({
      to: data.to,
      subject: data.subject,
      html: verfiyEmailTemplet({ otp: data.otp, title: data.subject }),
    });
  } catch (error) {
    console.log("Fail To Send Email", error.message);
  }
});