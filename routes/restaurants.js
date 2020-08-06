// Requisitions
const path = require("path")
const express = require("express")

// Models
const Restaurant = require(path.join(__dirname, "..", "models", "Restaurant"))

// Controller Functions
const {
  getRestaurants,
  getRestaurant,
  getRestaurantsInRadius,
  getRestaurantsInRadiusFromUser,
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

// Routes for other Documents
const itemRouter = require(path.join(__dirname, "items"))
const reviewRouter = require(path.join(__dirname, "reviews"))

// Initialize Router
const router = express.Router()

// Re-route into other document routers
router.use('/:restaurant_id/items', itemRouter)
router.use('/:restaurant_id/reviews', reviewRouter)

// Restaurant Routes
router.route("/me/:distance")
  .get(authenticate, getRestaurantsInRadiusFromUser)

router.route("/:zipcode/:distance")
  .get(getRestaurantsInRadius)

router.route("/:id")
  .get(getRestaurant)
  .put(authenticate, authorize("owner", "admin"), updateRestaurant)
  .delete(authenticate, authorize("owner", "admin"), deleteRestaurant)

router.route("/")
  .get(advancedSearch(Restaurant, "user", "admin"), getRestaurants)
  .post(authenticate, authorize("owner", "admin"), createRestaurant)

// Export Router
module.exports = router