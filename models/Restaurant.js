const mongoose = require("mongoose")
const slugify = require("slugify")

const restaurantSchema = new mongoose.Schema({
  
  name : {
    type: String,
    required: [true, "You have to enter a name"],
    unique: true,
    trim: true,
    maxlength: [50, "Name cannot be more than 50 chars"]
  },

  slug: {
    type: String,
  },

  description: {
    type: String,
    required: [true, "You have to enter a name"],
    unique: false,
    maxlength: [500, "Description cannot be more than 500 chars"]
  },

  website: {
    type: String,
    match: [/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/, "You must enter a valid URL including HTTP or HTTPS"]
  },

  phone: {
    type: String,
    match: [/[0-9 ]{7,20}/, "Phone must be only numbers and blank spaces, from 7 to 20 chars"],
  },

  email: {
    type: String,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "You must enter a valid email"]
  },

  address: {
    type: String,
    required: [true, "You must add an address"]
  },

  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: false
    },
    coordinates: {
      type: [Number],
      required: false
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String
  },

  cuisine: {
    type: String,
    required: true,
    enum: [
      "Pizza",
      "Arabic",
      "Italian",
      "French",
      "Healthy",
      "Barbecue",
      "Hamburger",
      "Brazilian",
      "Chinese",
      "Indian",
      "Japanese",
      "Korean",
      "Fast Food"
    ]
  },

  averageRating: {
    type: Number,
    min: [1, "Rating must be at least 1"],
    max: [10, "Rating must be no more than 10"]
  },

  averageCost: {
    type: Number,
    min: [1, "Cost must be at least 1"],
    max: [10, "Cost must be no more than 10"],
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  }

})

restaurantSchema.pre('save', function() {
  this.slug = slugify(this.name, { lower: true})
})

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

module.exports = Restaurant