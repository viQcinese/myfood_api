// Requisitions
const path = require("path")
const express = require("express")

// Controller Functions
const {
  getRestaurants
} = require(path.join(__dirname, "..", "controllers", "restaurants"))

const router = express.Router()

router.route("/")
  .get(getRestaurants)

// Export Router
module.exports = router