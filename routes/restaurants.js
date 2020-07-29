// Requisitions
const path = require("path")
const express = require("express")

// Models
const Restaurant = require(path.join(__dirname, "..", "models", "Restaurant"))
const User = require(path.join(__dirname, "..", "models", "User"))

// Controller Functions
const {
  getRestaurants,
  getRestaurant,
  getRestaurantsInRadius,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require(path.join(__dirname, "..", "controllers", "restaurants"))

// Auth Middleware
const {
  authenticate,
  authorize
} = require(path.join(__dirname, "..", "middleware", "auth"))

// Advanced Search Middleware
const advancedSearch = require(path.join(__dirname, "..", "middleware", "advanced-search"))

// Require Routes for other Documents
const itemRouter = require(path.join(__dirname, "items"))

// Initialize Router
const router = express.Router()

// Re-route into other document routers
router.use('/:restaurant_id/items', itemRouter)

// Restaurant Routes
router.route("/:zipcode/:distance")
  .get(getRestaurantsInRadius)

router.route("/:id")
  .get(getRestaurant)
  .put(authenticate, authorize("owner"), updateRestaurant)
  .delete(authenticate, authorize("owner"), deleteRestaurant)

router.route("/")
  .get(advancedSearch(Restaurant, "user"), getRestaurants)
  .post(authenticate, authorize("owner"), createRestaurant)

// Export Router
module.exports = router