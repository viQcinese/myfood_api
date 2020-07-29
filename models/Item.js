// Requisitions
const mongoose = require("mongoose")
const path = require("path")
const User = require(path.join(__dirname, "User"))

// Item Schema
const itemSchema = mongoose.Schema({

  name : {
    type: String,
    required: [true, "You have to enter a name"],
    maxlength: [50, "Name cannot be more than 50 chars"],
    trim: true,
  },

  description: {
    type: String,
    unique: false,
    maxlength: [500, "Description cannot be more than 500 chars"]
  },

  price: {
    type: Number,
    required: [true, "You have to enter a price"],
  },

  category: {
    type: String,
  },

  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: "Restaurant",
    required: true
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true
  },

})

// Export Model
const Item = new mongoose.model("Item", itemSchema)

module.exports = Item

