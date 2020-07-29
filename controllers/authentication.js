// Requisitions
const path = require("path")
const User = require(path.join(__dirname, "..", "models", "User"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))
const sendEmail = require(path.join(__dirname, "..", "utils", "sendEmail"))
const crypto = require('crypto')

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

  const user = await User.findById(req.user._id)

  if (!user) {
    return next(new CustomError(`User not found`, 401))
  }

  res.status(200).json({
    success: true,
    data: user
  })

})

// @desc        Logout
// @route       GET /api/v1/auth/logout
// @access      Private
exports.logout = asyncHandler(async (req, res, next) => {

  res.cookie('token', undefined)

  res.status(200).json({
    success: true,
    data: {}
  })

})

// @desc        Update Details
// @route       PUT /api/v1/auth/updatedetails
// @access      Private
exports.updateDetails = asyncHandler(async (req, res, next) => {

  const toUpdate = {
    name: req.body.name,
    email: req.body.email
  }

  const user = await User.findByIdAndUpdate(req.user.id, toUpdate, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: user
  })

})

// @desc        Update Password
// @route       PUT /api/v1/auth/updatepassword
// @access      Private
exports.updatePassword = asyncHandler(async (req, res, next) => {

  const user = await User.findById(req.user.id).select("+password")

  const isMatch = await user.checkPassword(req.body.current)

  if(!isMatch) {
    return next(new CustomError(`Password is incorrect`, 401))
  }

  user.password = req.body.new
  await user.save()

  res.status(200).json({
    success: true
  })

})

// @desc        Forgot Password
// @route       POST /api/v1/auth/forgotpassword
// @access      Public
exports.forgotPassword = asyncHandler( async (req, res, next) => {

  const user = await User.findOne({ email: req.body.email })

  if (!user) {
    return next(new CustomError(`User not found`, 401))
  }

  const resetToken = user.getResetPasswordToken()

  await user.save()

  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'MyFood Password Reset',
      message: message
    })
    return res.status(200).json({
      success: true,
      data: 'Email sent'
    })
  } catch (err) {
    console.log(err)
    user.resetPasswordToken = undefined
    user.resetPasswordExpires = undefined

    await user.save({ validateBeforeSave: false })

    return next(new CustomError('Email could not be sent', 500))
  }

})

// @desc        Reset Password
// @route       PUT /api/v1/auth/resetpassword/:resettoken
// @access      Public
exports.resetPassword = asyncHandler( async (req, res, next) => {

  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  const user = await User.findOne({
    resetPasswordToken: resetPasswordToken,
    resetPasswordExpires: { $gt: Date.now() }
  })

  if (!user) {
    return next(new CustomError('Invalid Token', 400))
  }

  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpires = undefined
  await user.save()

  sendTokenResponse(user, 200, res)

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