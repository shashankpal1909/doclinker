import nodemailer from "nodemailer";

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
    try {
      // Send the email using the transporter object
      await Mail.transporter.sendMail({
        from: process.env.SMTP_FROM,
        to,
        subject,
        html,
      });
    } catch (error) {
      console.error(error);
    }
  }

  static async sendWelcomeMessage(to: string): Promise<void> {
    const html = `
      <h1>Welcome to Doclinker</h1>
    `;

    // TODO: uncomment this

    // await Mail.sendEmail(to, "Welcome to Doclinker!", html);
    console.log("email sent: " + html);
  }

  static async sendEmailVerificationLink(
    to: string,
    token: string
  ): Promise<void> {
    const link: string = `${process.env.BASE_URL}/verify-email/${token}`;

    // Create the HTML content for the email
    const html = `
      <p>Please click on the following link to verify your email address:</p>
      <a href="${link}">${link}</a>
    `;

    // TODO: uncomment this
    // Send the email using the sendEmail function
    // await Mail.sendEmail(to, "Email Verification", html);
    console.log("email sent: " + html);
  }

  static async sendPasswordResetLink(to: string, token: string): Promise<void> {
    const link: string = `${process.env.BASE_URL}/reset-password/${token}`;

    // Create the HTML content for the email
    const html = `
      <p>Please click on the following link to reset your password:</p>
      <a href="${link}">${link}</a>
    `;

    // TODO: uncomment this
    // Send the email using the sendEmail function
    // await Mail.sendEmail(to, "Reset Password", html);
    console.log("email sent: " + html);
  }
}
