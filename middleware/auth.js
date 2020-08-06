// Requisitions
const path = require("path")
const jwt = require("jsonwebtoken")
const User = require(path.join(__dirname, "..", "models", "User"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))

// Authenticate User Middleware
const authenticate = async (req, res, next) => {

  let token
  let decoded

  // Check for Token in the Headers
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1]  }

  // Check for Token in the Cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token
  }

  // If there is no token
  if (!token) {
    return next(new CustomError(`You are not authorized to access this route  `, 401))
  }

  // Check Token to Authenticate
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded.id)
    next()
  
  } catch (err) {
    return next(new CustomError(`You are not authorized to access this route  `, 401))
  }
  
}

// Authorize User Middleware
const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new CustomError(`User role ${req.user.role} is not authorized to access this route`, 403))
  } else {
    return next()
  }
}

module.exports = { authenticate, authorize }