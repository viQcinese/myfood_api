// Requisitions
const path = require("path")
const Item = require(path.join(__dirname, "..", "models", "Item"))
const Restaurant = require(path.join(__dirname, "..", "models", "Restaurant"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))

// @desc        Get Items From Restaurant
// @route       GET /api/v1/restaurants/:restaurant_id/items
// @access      Public
exports.getItems = asyncHandler(async (req, res, next) => {
  
  const items = await Item.find({ restaurant: req.params.restaurant_id })

  res.status(200).json({
    success: true,
    count: items.length,
    data: items
  })

})

// @desc        Get Item From Restaurant
// @route       GET /api/v1/restaurants/:restaurant_id/items/:id
// @access      Public
exports.getItem = asyncHandler(async (req, res, next) => {
  
  const item = await Item.findOne({ restaurant: req.params.restaurant_id, _id: req.params.id })

  if (!item) {
    return next(new CustomError(`No item found with the ID ${req.params.restaurant_id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: item
  })

})

// @desc        Create Item
// @route       POST /api/v1/restaurants/:restaurant_id/items
// @access      Private { owner }
exports.createItem = asyncHandler(async (req, res, next) => {

  const restaurant = await Restaurant.findById(req.params.restaurant_id)

  if (!restaurant) {
    return next(new CustomError(`No Restaurant found with the ID ${req.params.restaurant_id}`, 404))
  }

  if (req.user.id !== restaurant.user.toString() && req.user.role !== "admin") {
    return next(new CustomError(`User is not authorized to create items for this restaurant`, 403))
  }
  
  req.body.restaurant = req.params.restaurant_id
  req.body.user = req.user.id

  const item = await Item.create(req.body)

  res.status(200).json({
    success: true,
    data: item
  })

})

// @desc        Update Item
// @route       DELETE /api/v1/items/:id
// @access      Private { owner }
exports.updateItem = asyncHandler(async (req, res, next) => {

  const item = await Item.findById(req.params.id)

  if (!item) {
    return next(new CustomError(`No item found with the ID ${req.params.id}`, 404))
  }

  if (req.user.id !== item.user.toString() && req.user.role !== "admin") {
    return next(new CustomError(`User is not authorized to update items from this restaurant`, 403))
  }

  item = await Item.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: item
  })

})

// @desc        Delete Item
// @route       DELETE /api/v1/items/:id
// @access      Private { owner }
exports.deleteItem = asyncHandler(async (req, res, next) => {

  const item = await Item.findById(req.params.id)
  
  if (!item) {
    return next(new CustomError(`No item found with the ID ${req.params.id}`, 404))
  }

  if (req.user.id !== item.user.toString() && req.user.role !== "admin") {
    return next(new CustomError(`User is not authorized to delete items from this restaurant`, 403))
  }

  item.remove()

  res.status(200).json({
    success: true,
    data: {}
  })

})