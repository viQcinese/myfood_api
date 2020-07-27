// Resquisitions
const path = require("path")
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))

// Error Handler
const errorHandler = (err, req, res, next) => {

  console.log(err)

  // Set error properties
  let error = { ...err }
  error.message = err.message

  // Cast Error: Resource not Found
  if (err.name === "CastError") {
    error = new CustomError(`No resource found with the ID ${err.value}`, 400)
  }

  // MongoError 11000: Duplicate Key Error
  if (err.code === 11000) {
    error = new CustomError(`You have entered a duplicate field value`)
  }

  // Send Error Response
  res.status(error.statusCode || 500 ).json({
    success: false,
    error: error.message
  })
}

// Export Error Handler
module.exports = errorHandler