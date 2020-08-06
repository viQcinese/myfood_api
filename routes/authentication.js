// Requisitions
const path = require("path")
const express = require("express")

// Controller Functions
const {
  register,
  login,
  logout,
  getCurrentUser,
  updateDetails,
  updatePassword,
  forgotPassword,
  resetPassword
} = require(path.join(__dirname, "..", "controllers", "authentication"))

// Auth Middleware
const {
  authenticate,
  authorize
} = require(path.join(__dirname, "..", "middleware", "auth"))

// Initialize Router
const router = express.Router()

// Routes
router.route('/getme')
  .get(authenticate, getCurrentUser)

router.route('/register')
  .post(register)

router.route('/login')
  .post(login)

router.route('/logout')
  .get(authenticate, logout)

router.route('/updatedetails')
  .put(authenticate, updateDetails) 

router.route('/updatepassword')
  .post(authenticate, updatePassword) 

router.route('/forgotpassword')
  .post(forgotPassword) 

router.route('/resetpassword/:resettoken')
  .put(resetPassword)

// Export Router
module.exports = router