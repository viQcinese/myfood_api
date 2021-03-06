// Requisitions
const path = require("path")
const geocoder = require(path.join(__dirname, "..", "utils", "geocoder"))
const Restaurant = require(path.join(__dirname, "..", "models", "Restaurant"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))

// @desc        Get All Restaurants
// @route       GET /api/v1/restaurants
// @access      Public
exports.getRestaurants = asyncHandler(async (req, res, next) => {

    res.status(200).json(res.advancedResults)

})

// @desc        Get a single restaurant 
// @route       GET /api/v1/restaurants/:id
// @access      Public
exports.getRestaurant = asyncHandler(async (req, res, next) => {

  const restaurant = await Restaurant.findById(req.params.id)

  if (!restaurant) {
    return next(new CustomError(`No restaurant find with the ID ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true, 
    data: restaurant
  })

})

// @desc        Get restaurants in radius
// @route       GET /api/v1/restaurants/:zipcode/:distance
// @access      Public
exports.getRestaurantsInRadius = asyncHandler(async (req, res, next) => {

  const { zipcode, distance } = req.params

  // Get the point from URL zipcode 
  const geoLocation = await geocoder.geocode(zipcode)
  const lat = geoLocation[0].latitude
  const lon = geoLocation[0].longitude
  const radius = distance / 6378

  const restaurants = await Restaurant.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius ]}}
  })

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants
  })

})

// @desc        Get restaurants in radius from User
// @route       GET /api/v1/restaurants/me/:distance
// @access      Private { User }
exports.getRestaurantsInRadiusFromUser = asyncHandler(async (req, res, next) => {

  const distance = req.params.distance
  const lat = req.user.location.coordinates[1]
  const lon = req.user.location.coordinates[0]
  const radius = distance / 6378

  const restaurants = await Restaurant.find({
    location: { $geoWithin: { $centerSphere: [[lon, lat], radius ]}}
  })

  res.status(200).json({
    success: true,
    count: restaurants.length,
    data: restaurants
  })

})

// @desc        Create restaurant 
// @route       POST /api/v1/restaurants
// @access      Private { Owner / Admin }
exports.createRestaurant = asyncHandler(async (req, res, next) => {

  req.body.user = req.user.id

  const anotherRestaurant = await Restaurant.findOne({ user: req.user.id })

  if (anotherRestaurant && req.user.role !== "admin") {
    return next(new CustomError(`User already has a published a Restaurant`, 400))
  }

  const restaurant = await Restaurant.create(req.body)

  res.status(201).json({
    success: true, 
    data: restaurant})

})

// @desc        Update restaurant 
// @route       PUT /api/v1/restaurants/:id
// @access      Private { Owner / Admin }
exports.updateRestaurant = asyncHandler(async (req, res, next) => {

  let restaurant = await Restaurant.findById(req.params.id)

  if (!restaurant) {
    return next(new CustomError(`No restaurant find with the ID ${req.params.id}`, 404))
  }

  if (restaurant.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new CustomError(`User is not authorized to update this Restaurant`, 403))
  }

  restaurant = await Restaurant.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true, 
    data: restaurant})

})

// @desc        Delete restaurant 
// @route       DELETE /api/v1/restaurants/:id
// @access      Private { Owner / Admin }
exports.deleteRestaurant = asyncHandler(async (req, res, next) => {

  let restaurant = await Restaurant.findById(req.params.id)

  if (!restaurant) {
    return next(new CustomError(`No restaurant find with the ID ${req.params.id}`, 404))
  }

  if(restaurant.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new CustomError(`User is not authorized to delete this restaurant`, 403))
  }

  restaurant.remove()

  res.status(200).json({
    success: true, 
    data: {}})

})


