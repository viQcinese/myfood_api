// Requisitions
const path = require("path")
const express = require("express")

// Controller Functions
const {
  register,
  login,
  getCurrentUser
} = require(path.join(__dirname, "..", "controllers", "authentication"))

// Routes
const router = express.Router()

router.route('/getme')
  .get(getCurrentUser)

router.route('/register')
  .post(register)

router.route('/login')
  .post(login)

// Export Router
module.exports = router