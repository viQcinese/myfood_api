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

  sendTokenResponse(user, 201, res)

})

// @desc        Login user
// @route       GET /api/v1/auth/loginn
// @access      Public
exports.login = asyncHandler(async (req, res, next) => {

  const { password, email } = req.body

  if(!password || !email) {
    return next(new CustomError('You have to enter an email and a password', 400))
  }

  const user = await User.findOne({ email }).select('+password')

  if(!user) {
    return next(new CustomError('Incorrect email or password', 401))
  }

  const isMatch = await user.checkPassword(password)
  
  if(!isMatch) {
    return next(new CustomError('Incorrect email or password', 401))
  }

  sendTokenResponse(user, 200, res)

})

// @desc        Get Current User
// @route       GET /api/v1/auth/getme
// @access      Private
exports.getCurrentUser = asyncHandler(async (req, res, next) => {
  
  const user = await User.find(req.user)

  if (!user) {
    return next(new CustomError(`User not found`, 401))
  }

  res.status(200).json({
    success: true,
    data: user
  })

})

// Send Token Response and set Token Cookie
const sendTokenResponse = (user, status, res) => {

  const token = user.getJwt()

  const cookieOptions = {
    expires: new Date(Date.now + process.env.JWT_COOKIE_EXPIRATION * 1000 * 60 * 60 * 24),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true
  }

  res.status(status)
    .cookie('token', token, cookieOptions)
    .json({
      success: true,
      token: token
    })

}

