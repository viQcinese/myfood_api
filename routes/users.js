// Requisitions
const path = require("path")
const express = require("express")

// Models
const User = require(path.join(__dirname, "..", "models", "User"))

// Controller Functions
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser
} = require(path.join(__dirname, "..", "controllers", "users"))

// Auth Middleware
const {
  authenticate,
  authorize
} = require(path.join(__dirname, "..", "middleware", "auth"))

// Advanced Search Middleware
const advancedSearch = require(path.join(__dirname, "..", "middleware", "advanced-search"))

// Initialize Router
const router = express.Router()

// Authenticate and Authorize in every Route
router.use(authenticate)
router.use(authorize('admin'))

// Routes
router.route('/')
  .get(advancedSearch(User), getUsers)
  .post(createUser)

router.route('/:id')
  .get(getUser)
  .put(updateUser)
  .delete(deleteUser)

// Export Router
module.exports = router