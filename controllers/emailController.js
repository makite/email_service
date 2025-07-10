const emailService = require("../services/emailService");
const { StatusCodes } = require("http-status-codes");

class EmailController {
  async sendEmail(req, res, next) {
    try {
      const { to, cc, subject, text, html } = req.body;

      if (!to || !subject || (!text && !html)) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: "Missing required fields: to, subject, and text or html",
        });
      }

      const result = await emailService.sendBasicEmail({
        to,
        cc,
        subject,
        text,
        html,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          messageId: result.messageId,
          message: "Email sent successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async sendHTMLEmail(req, res, next) {
    try {
      const { to, cc, subject, html } = req.body;

      if (!to || !subject || !html) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: "Missing required fields: to, subject, and html",
        });
      }

      const result = await emailService.sendHTMLEmail({
        to,
        cc,
        subject,
        html,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          messageId: result.messageId,
          message: "HTML email sent successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }

  async sendTextEmail(req, res, next) {
    try {
      const { to, cc, subject, text } = req.body;

      if (!to || !subject || !text) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          error: "Missing required fields: to, subject, and text",
        });
      }

      const result = await emailService.sendTextEmail({
        to,
        cc,
        subject,
        text,
      });

      res.status(StatusCodes.OK).json({
        success: true,
        data: {
          messageId: result.messageId,
          message: "Text email sent successfully",
        },
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EmailController();
