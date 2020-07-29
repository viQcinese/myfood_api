// Requisitions
const path = require("path")
const express = require("express")

// Models

// Controller Functions
const {
  getItems,
  getItem,
  createItem,
  updateItem,
  deleteItem,
} = require(path.join(__dirname, "..", "controllers", "items"))

// Auth Middleware
const {
  authenticate,
  authorize
} = require(path.join(__dirname, "..", "middleware", "auth"))

// Initialize Router
const router = express.Router({ mergeParams: true })

// Routes
router.route('/')
  .get(getItems)
  .post(authenticate, authorize("owner"), createItem)

router.route('/:id')
  .get(getItem)
  .put(authenticate, authorize("owner"), updateItem)
  .delete(authenticate, authorize("owner"), deleteItem)

// Export Router
module.exports = router