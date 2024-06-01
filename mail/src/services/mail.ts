import nodemailer, { SentMessageInfo } from "nodemailer";

import { logger } from "../logger";

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
  ): Promise<SentMessageInfo> {
    try {
      // Send the email using the transporter object
      return await Mail.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      });
    } catch (error) {
      logger.error(error);
    }
  }

  static async sendWelcomeMessage(
    name: string,
    role: string,
    to: string
  ): Promise<void> {
    const html =
      role === "doctor"
        ? `
            <div style="padding: 20px;">
              <h2 style="color: #333333;">Welcome to DocLinker, ${name}!</h2>
              <p style="color: #666666;">We are thrilled to have you on board. With DocLinker, scheduling appointments with your preferred doctors is now easier than ever.</p>
              <p style="color: #666666;">Get started by exploring our platform and finding the right healthcare provider for you.</p>
              <a href="#" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px;">Get Started</a>
              <p style="color: #666666; margin-top: 20px;">If you have any questions, feel free to reach out to our support team at <a href="mailto:support@doclinker.com" style="color: #28a745;">support@doclinker.com</a>.</p>
            </div>
          `
        : `
            <div style="padding: 20px;">
              <h2 style="color: #333333;">Welcome to DocLinker, ${name}!</h2>
              <p style="color: #666666;">We are thrilled to have you on board. With DocLinker, scheduling appointments with your preferred doctors is now easier than ever.</p>
              <p style="color: #666666;">Get started by exploring our platform and finding the right healthcare provider for you.</p>
              <a href="#" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px;">Get Started</a>
              <p style="color: #666666; margin-top: 20px;">If you have any questions, feel free to reach out to our support team at <a href="mailto:support@doclinker.com" style="color: #28a745;">support@doclinker.com</a>.</p>
            </div>
        `;

    const info = await Mail.sendEmail(
      to,
      "Welcome to Doclinker!",
      generateEmailHTML(html)
    );
    logger.info("SentEmailInfo:", info);
  }

  static async sendEmailVerificationLink(
    name: string,
    to: string,
    token: string
  ): Promise<void> {
    const link: string = `${process.env.BASE_URL}/verify-email/${token}`;

    // Create the HTML content for the email
    const html = `
      <div style="padding: 20px;">
        <h2 style="color: #333333;">Verify Your Email Address</h2>
        <p style="color: #666666;">Hi ${name},</p>
        <p style="color: #666666;">Thank you for signing up for DocLinker. Please click the button below to verify your email address and complete your registration.</p>
        <a href="${link}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px;">Verify Email</a>
        <p style="color: #666666; margin-top: 20px;">If you did not create an account, no further action is required.</p>
      </div>
    `;

    // Send the email using the sendEmail function
    const info = await Mail.sendEmail(
      to,
      "Email Verification",
      generateEmailHTML(html)
    );
    logger.info("SentEmailInfo:", info);
  }

  static async sendPasswordResetLink(
    name: string,
    to: string,
    token: string
  ): Promise<void> {
    const link: string = `${process.env.BASE_URL}/reset-password/${token}`;

    // Create the HTML content for the email
    const html = `
      <div style="padding: 20px;">
        <h2 style="color: #333333;">Reset Your Password</h2>
        <p style="color: #666666;">Hi ${name},</p>
        <p style="color: #666666;">We received a request to reset your password for your DocLinker account. Click the button below to reset it.</p>
        <a href="${link}" style="display: inline-block; margin-top: 20px; padding: 10px 20px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 4px;">Reset Password</a>
        <p style="color: #666666; margin-top: 20px;">If you did not request a password reset, please ignore this email or contact our support team at <a href="mailto:support@doclinker.com" style="color: #28a745;">support@doclinker.com</a>.</p>
      </div>
    `;

    // Send the email using the sendEmail function
    const info = await Mail.sendEmail(
      to,
      "Reset Password",
      generateEmailHTML(html)
    );
    logger.info("SentEmailInfo:", info);
  }
}

const generateEmailHTML = (content: string) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
      <!-- Header -->
      <div style="background-color: #28a745; padding: 10px; text-align: center; color: #ffffff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
        <h1 style="margin: 0;">DocLinker</h1>
      </div>
      
      <!-- Content Section -->
      ${content}
      
      <!-- Footer -->
      <div style="background-color: #f4f4f4; padding: 20px; text-align: center; color: #999999; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
        <p style="margin: 0;">&copy; 2024 DocLinker. All rights reserved.</p>
        <p style="margin: 0;"><a href="mailto:support@doclinker.com" style="color: #28a745;">support@doclinker.com</a></p>
      </div>
    </div>
  </body>
  </html>
  `;
};
