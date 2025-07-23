// next.config.js
const path = require("path");

module.exports = {
  webpack(config) {
    config.resolve.alias["@"] = path.resolve(__dirname);
    return config;
  },
  // Only expose non-sensitive variables
  env: {
    APP_NAME: process.env.APP_NAME, // Example safe variable
    // Omit SENDGRID_API_KEY here - use directly in API routes via process.env
  },
};
