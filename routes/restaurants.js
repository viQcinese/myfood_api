// Requisitions
const path = require("path")
const express = require("express")

// Models
const Restaurant = require(path.join(__dirname, "..", "models", "Restaurant"))

// Controller Functions
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require(path.join(__dirname, "..", "controllers", "restaurants"))

// Middlewares
const advancedSearch = require(path.join(__dirname, "..", "middleware", "advanced-search"))

const router = express.Router()

router.route("/")
  .get(advancedSearch(Restaurant), getRestaurants)
  .post(createRestaurant)

router.route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant)

// Export Router
module.exports = router