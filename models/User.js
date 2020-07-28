// Requisitions
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

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

  createdAt: {
    type: Date,
    default: Date.now
  }

})

// Hash Password Middleware (bcrypt)
userSchema.pre('save', async function() {
  console.log(this)
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  console.log(this)
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

// Set User Model
const User = mongoose.model('User', userSchema)

// Export User Model
module.exports = User