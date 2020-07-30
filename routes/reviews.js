// Requisitions
const path = require("path")
const express = require("express")

// Initialize Router
const router = express.Router({ mergeParams: true })

// Models
const Review = require(path.join(__dirname, "..", "models", "Review"))

// Controller Functions
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require(path.join(__dirname, "..", "controllers", "reviews"))

// Auth Middleware
const {
  authenticate,
  authorize
} = require(path.join(__dirname, "..", "middleware", "auth"))

// Search Middleware
const advancedSearch = require(path.join(__dirname, "..", "middleware", "advanced-search"))

// Routes
router.route('/')
  .get(advancedSearch(Review, {
    path: 'restaurant',
    select: 'name averageRating'
  }), getReviews)
  .post(authenticate, authorize("user", "admin"), createReview)

router.route('/:id')
  .get(getReview)
  .put(authenticate, authorize("user", "admin"), updateReview)
  .delete(authenticate, authorize("user", "admin"), deleteReview)

// Export Router
module.exports = router