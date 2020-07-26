// Requisitions
const express = require("express")
const path = require("path")
const Restaurant = require(path.join(__dirname, "..", "models", "Restaurant"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))

// @desc        Get all restaurants in database
// @route       /api/v1/restaurants
// @access      Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {

    const restaurants = await Restaurant.find()
    res .status(200).json({success: true, restaurants})

})