import nodemailer from "nodemailer";
import { env } from "../../config/env";
import { HttpError } from "../../utils/http-error";

function createTransporter() {
  if (!env.smtpHost || !env.smtpUser || !env.smtpPassword) {
    throw new HttpError(500, "Email service is not configured");
  }

  return nodemailer.createTransport({
    host: env.smtpHost,
    port: env.smtpPort,
    secure: env.smtpSecure,
    auth: {
      user: env.smtpUser,
      pass: env.smtpPassword,
    },
  });
}

export async function sendPasswordResetOtp(email: string, otp: string) {
  const transporter = createTransporter();

  await transporter.sendMail({
    from: env.mailFrom,
    to: email,
    subject: "GIOTO Bangladesh password reset OTP",
    text: `Your GIOTO Bangladesh password reset OTP is ${otp}. This code will expire in 10 minutes.`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#1a1a1a">
        <h2>Password reset OTP</h2>
        <p>Your GIOTO Bangladesh password reset OTP is:</p>
        <p style="font-size:28px;font-weight:700;letter-spacing:6px;color:#E8520A">${otp}</p>
        <p>This code will expire in 10 minutes. If you did not request this, you can ignore this email.</p>
      </div>
    `,
  });
}
