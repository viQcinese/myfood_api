// Requisitions
const path = require("path")
const jwt = require("jsonwebtoken")
const User = require(path.join(__dirname, "..", "models", "User"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))

// Check User Middleware
const checkUser = async (req, res, next) => {

  let token
  let decoded

  // Check for Token in the Headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]  }

  // Check for Token in the Cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  // If there is not token
  if (!token) {
    req.user = undefined;
    return next()
  }

  // Try to Decode
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
  // If Token is Invalid
  } catch (err) {
    req.user = undefined
    return next()
  }
  
  // Search for User
  const user = await User.findById({ _id: decoded.id })

  // Set User parameter
  if (!user) {
    req.user = undefined
  } else {
    req.user = user
  }

  // Call next
  next()
}

module.exports = checkUser