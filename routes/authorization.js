// Requisitions
const path = require("path")
const express = require("express")

// Controller Functions
const {
  register,
  login
} = require(path.join(__dirname, "..", "controllers", "authorization"))

// Routes
const router = express.Router()

router.route('/register')
  .post(register)

router.route('/login')
  .post(login)

// Export Router
module.exports = router