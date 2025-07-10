const SMTPClient = require("../config/smtp");
const { StatusCodes } = require("http-status-codes");
const logger = require("../config/logger");

class EmailService {
  constructor() {
    this.smtpClient = SMTPClient;
  }

  async sendBasicEmail({ to, cc, subject, text, html }) {
    if (!this.smtpClient.transporter) {
      throw new Error(
        "Email service is not available due to missing SMTP configuration"
      );
    }

    const { SMTP_FROM_NAME, SMTP_FROM_EMAIL } = process.env;
    const from = `"${SMTP_FROM_NAME}" <${SMTP_FROM_EMAIL}>`;

    const mailOptions = {
      from,
      to: Array.isArray(to) ? to : [to], // support single or multiple recipients
      cc: Array.isArray(cc) ? cc : [cc], // support single or multiple recipients
      subject,
      text,
      html: html || text,
      date: new Date(),
    };

    try {
      const result = await this.smtpClient.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
        status: StatusCodes.OK,
      };
    } catch (error) {
      logger.error(`Failed to send email to ${to}: ${error.message}`);
      throw {
        success: false,
        error: error.message,
        status: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async sendHTMLEmail({ to, cc, subject, html }) {
    return this.sendBasicEmail({ to, subject, html });
  }

  async sendTextEmail({ to, cc, subject, text }) {
    return this.sendBasicEmail({ to, subject, text });
  }
}

module.exports = new EmailService();
