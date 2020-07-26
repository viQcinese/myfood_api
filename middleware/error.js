// Resquisitions
const path = require("path")
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))

// Error Handler
const errorHandler = (err, req, res, next) => {

  // Send Error Response
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error"
  })

}

// Export Error Handler
module.exports = errorHandler