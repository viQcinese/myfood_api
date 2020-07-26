const mongoose = require("mongoose")

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
    enum: ["client", "owner"],
    default: "client"
  },

  password: {
    type: String,
    required: [true, "You must enter a password"],
    minlength: 6,
    select: false
  },

  createdAt: {
    type: Date,
    default: Date.now
  }

})