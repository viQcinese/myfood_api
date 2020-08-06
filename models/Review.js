// Requisitions
const path = require("path")
const mongoose = require("mongoose")

// Review Schema
const reviewSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "You have to enter a name"],
    trim: true,
    maxlength: [50, "Name cannot be more than 50 chars"]
  },

  text: {
    type: String,
    required: [true, "You have to write something"],
    maxlength: [500, "Name cannot be more than 50 chars"]
  },

  rating: {
    type: Number,
    max: [10, "Rating must be from 1 to 10"],
    min: [1, "Rating must be from 1 to 10"]
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: true,
  }

})

// Static Method to calculate average rating of a restaurant
reviewSchema.statics.getAverageRating = async function(restaurant_id) {

  const aggregation = await this.aggregate([
    {
      $match: { restaurant: restaurant_id }
    },
    {
      $group: {
        _id: "$restaurant",
        averageRating: { $avg: "$rating" }
      }
    }
  ])

  await this.model("Restaurant").findByIdAndUpdate(restaurant_id, { averageRating: aggregation[0].averageRating})

}

// Calculate Average Rating After Save
reviewSchema.post("save", function() {
  this.constructor.getAverageRating(this.restaurant)
})

// Calculate Average Rating Before Remove
reviewSchema.pre("remove", function() {
  this.constructor.getAverageRating(this.restaurant)
})

// Set Review Model
const Review = new mongoose.model("Review", reviewSchema)

// Export Review Model
module.exports = Review