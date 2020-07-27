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
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require(path.join(__dirname, "..", "controllers", "restaurants"))

// Middlewares
const advancedSearch = require(path.join(__dirname, "..", "middleware", "advanced-search"))

const router = express.Router()

router.route("/:zipcode/:distance")
  .get(getRestaurantsInRadius)

router.route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant)

router.route("/")
  .get(advancedSearch(Restaurant), getRestaurants)
  .post(createRestaurant)

// Export Router
module.exports = router