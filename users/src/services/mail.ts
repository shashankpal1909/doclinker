import nodemailer from "nodemailer";
import { API_BASE_URL } from "../constants";

export class Mail {
  private static transporter = nodemailer.createTransport({
    // Set the host and port for the SMTP server
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),

    // Set the security protocol to false (for non-SSL connections)
    secure: false,

    // Set the authentication credentials for the email sender
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  private static async sendEmail(
    to: string,
    subject: string,
    html: string
  ): Promise<void> {
    // Send the email using the transporter object
    await Mail.transporter.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject,
      html,
    });
  }

  static async sendEmailVerificationLink(
    to: string,
    token: string
  ): Promise<void> {
    const link: string = `${process.env.BASE_URL}${API_BASE_URL}/verify-email/${token}`;

    // Create the HTML content for the email
    const html = `
      <p>Please click on the following link to verify your email address:</p>
      <a href="${link}">${link}</a>
    `;

    // Send the email using the sendEmail function
    await Mail.sendEmail(to, "Email Verification", html);
  }

  static async sendPasswordResetLink(to: string, token: string): Promise<void> {
    const link: string = `${process.env.BASE_URL}${API_BASE_URL}/reset-password/${token}`;

    // Create the HTML content for the email
    const html = `
      <p>Please click on the following link to reset your password:</p>
      <a href="${link}">${link}</a>
    `;

    // Send the email using the sendEmail function
    await Mail.sendEmail(to, "Email Verification", html);
  }
}
