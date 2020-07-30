// Requisitions
const path = require("path")
const Review = require(path.join(__dirname, "..", "models", "Review"))
const Restaurant = require(path.join(__dirname, "..", "models", "Restaurant"))
const asyncHandler = require(path.join(__dirname, "..", "middleware", "async"))
const CustomError = require(path.join(__dirname, "..", "utils", "CustomError"))

// @desc      Get Reviews
// @path      GET /api/v1/reviews
// @path      GET /api/v1/restaurants/:restaurant_id/reviews
// @access    Public
exports.getReviews = asyncHandler( async (req, res, next) => {

  if(req.params.restaurant_id) {

    const reviews = await Review
    .find({ restaurant: req.params.restaurant_id })
    .sort('-createdAt')

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    })

  } else {

    res.status(200).json(res.advancedResults)

  }  

})

// @desc      Get Review
// @path      GET /api/v1/restaurants/:restaurant_id/reviews/:id
// @access    Public
exports.getReview = asyncHandler( async (req, res, next) => {

  const review = await Review.findById(req.params.id)

  if (!review) {
    return next(new CustomError(`No review found with the ID ${req.params.id}`, 404))
  }

  res.status(200).json({
    success: true,
    data: review
  })

})

// @desc      Create Review
// @path      POST /api/v1/restaurants/:restaurant_id/reviews/
// @access    Private { user }
exports.createReview = asyncHandler( async (req, res, next) => {

  const restaurant = await Restaurant.findById(req.params.restaurant_id)

  if (!restaurant) {
    return next(new CustomError(`No Restaurant found with the ID ${req.params.restaurant_id}`, 404))
  }

  req.body.restaurant = req.params.restaurant_id
  req.body.user = req.user.id

  const review = await Review.create(req.body)

  res.status(200).json({
    success: true,
    data: review
  })

})

// @desc      Update Review
// @path      PUT /api/v1/restaurants/:restaurant_id/reviews/:id
// @access    Private { user }
exports.updateReview = asyncHandler( async (req, res, next) => {

  let review = await Review.findById(req.params.id)

  if (!review) {
    return next(new CustomError(`No review found with the ID ${req.params.id}`, 404))
  }

  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(new CustomError(`User is not authorized to update this review`, 403))
  }

  review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })

  res.status(200).json({
    success: true,
    data: review
  })


})

// @desc      Delete Review
// @path      PUT /api/v1/restaurants/:restaurant_id/reviews/:id
// @access    Private { user }
exports.deleteReview = asyncHandler( async (req, res, next) => {

  const review = await Review.findById(req.params.id)
  
  if (!review) {
    return next(new CustomError(`No review found with the ID ${req.params.id}`, 404))
  }

  if (req.user.id !== review.user.toString() && req.user.role !== "admin") {
    return next(new CustomError(`User is not authorized to delete this review`, 403))
  }

  review.remove()

  res.status(200).json({
    success: true,
    data: {}
  })

})