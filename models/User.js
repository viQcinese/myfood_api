// Requisitions
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

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

// Hash Password Middleware
userSchema.pre('save', async function() {
  console.log(this)
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(this.password, salt)
  this.password = hashedPassword
  console.log(this)
})

// Set User Model
const User = mongoose.model('User', userSchema)

// Export User Model
module.exports = User