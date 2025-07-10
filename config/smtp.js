const nodemailer = require("nodemailer");
const logger = require("./logger");

class SMTPClient {
  constructor() {
    this.transporter = this.createTransporter();
    this.verifyConnection();
  }

  createTransporter() {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
      console.log("smpt error");

      logger.warn(
        "SMTP configuration is incomplete. Email service will be disabled."
      );
      return null;
    }

    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: SMTP_PORT === "465", // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      pool: true, // use pooled connections
      maxConnections: 5,
      maxMessages: 100,
    });
  }

  async verifyConnection() {
    if (!this.transporter) return;

    try {
      await this.transporter.verify();
      logger.info("SMTP connection verified successfully");
    } catch (error) {
      logger.error("SMTP connection verification failed:", error);
      this.transporter = null;
    }
  }

  async sendMail(mailOptions) {
    if (!this.transporter) {
      throw new Error("SMTP transporter is not configured");
    }

    try {
      const info = await this.transporter.sendMail(mailOptions);
      logger.info(
        `Email sent to ${mailOptions.to} with message ID: ${info.messageId}`
      );
      return info;
    } catch (error) {
      logger.error("Error sending email:", error);
      throw error;
    }
  }
}

module.exports = new SMTPClient();
