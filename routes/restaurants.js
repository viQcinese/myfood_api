// Requisitions
const path = require("path")
const express = require("express")

// Controller Functions
const {
  getRestaurants,
  getRestaurant,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require(path.join(__dirname, "..", "controllers", "restaurants"))

const router = express.Router()

router.route("/")
  .get(getRestaurants)
  .post(createRestaurant)

router.route("/:id")
  .get(getRestaurant)
  .put(updateRestaurant)
  .delete(deleteRestaurant)

// Export Router
module.exports = router