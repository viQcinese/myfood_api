// Requisitions
const path = require("path")
const User = require(path.join(__dirname, "..", "models", "User"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))

// @desc        Register user
// @route       GET /api/v1/auth/register
// @access      Public
exports.register = asyncHandler(async (req, res, next) => {
  
  const user = await User.create(req.body)

  res.status(201).json({
    success: true,
    data: user
  })

})

// @desc        Login user
// @route       GET /api/v1/auth/loginn
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {

})
