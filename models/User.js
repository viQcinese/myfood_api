// Requisitions
const path = require("path")
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")
const geocoder = require(path.join(__dirname, "..", "utils", "geocoder"))



// Set User Schema
const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "You must enter a name"]
  },

  email: {
    type: String,
    required: [true, "You must enter an email"],
    unique: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "You must enter a valid email"]
  },

  role: {
    type: String,
    enum: ["user", "owner"],
    default: "user"
  },

  password: {
    type: String,
    required: [true, "You must enter a password"],
    minlength: 6,
    select: false,
  },

  resetPasswordToken: String,

  resetPasswordExpires: Date,

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

  createdAt: {
    type: Date,
    default: Date.now
  }

})



// Hash Password Middleware (bcrypt)
userSchema.pre('save', async function(next) {

  if(!this.isModified('password')) {
    return next()
  }
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  
})

// Check Input Password against Hashed Password (bcrypt)
userSchema.methods.checkPassword = async function(inputPassword) {

  return await bcrypt.compare(inputPassword, this.password)

}

// Get User JsonWebToken for Authentication (jwt)
userSchema.methods.getJwt = function() {

  return jwt.sign({id: this._id}, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRATION
  })

}

// Get Reset Password Token (crypto)
userSchema.methods.getResetPasswordToken = function() {

  const resetToken = crypto.randomBytes(20).toString('hex')
 
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.resetPasswordExpires = Date.now() + 1000 * 60 * 10

  return resetToken

}

// Geocode Before Save and remove Address Field
userSchema.pre('save', async function(){

  const geoLocations = await geocoder.geocode(this.address)
  const geoLocation = geoLocations[0]
  this.location = {
    type: "Point",
    coordinates : [geoLocation.longitude, geoLocation.latitude],
    formattedAddress: geoLocation.formattedAddress,
    street: geoLocation.streetName,
    city: geoLocation.city,
    state: geoLocation.stateCode,
    zipcode: geoLocation.zipcode,
    country: geoLocation.countryCode
  }
  this.address = undefined;

})



// Set User Model
const User = mongoose.model('User', userSchema)

// Export User Model
module.exports = User