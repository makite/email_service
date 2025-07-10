const express = require("express");
const router = express.Router();
const emailController = require("../controllers/emailController");

// Email endpoints
router.post("/send", emailController.sendEmail);
router.post("/send/html", emailController.sendHTMLEmail);
router.post("/send/text", emailController.sendTextEmail);

module.exports = router;
