require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const logger = require("./config/logger");
const emailRoutes = require("./routes/emailRoute");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

// Security Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging
app.use(morgan("combined", { stream: logger.stream }));

// Routes
app.use("/api/email", emailRoutes);

// Health Check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Error Handling
// app.use(errorHandler);

const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
  logger.info(`Email Service running on port ${PORT}`);
});

module.exports = app;
