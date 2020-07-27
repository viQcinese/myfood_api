// Requisitions
const path = require("path")
const express = require("express")

// Controller Functions
const {
  register
} = require(path.join(__dirname, "..", "controllers", "authorization"))

// Routes
const router = express.Router()

router.route('/register')
  .post(register)

// Export Router
module.exports = router