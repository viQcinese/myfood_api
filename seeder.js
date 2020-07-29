// NPM Packages
const path = require("path")
const fs = require("fs")
const colors = require("colors")
const mongoose = require("mongoose")
const dotenv = require("dotenv")

// Init Enviromental Variables
dotenv.config({ path: path.join(__dirname, "config", "config.env")})

// Load Models
const Restaurant = require(path.join(__dirname, "models", "Restaurant"))
const User = require(path.join(__dirname, "models", "User"))
const Item = require(path.join(__dirname, "models", "Item"))

// Connect to DataBase
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useCreateIndex: true,
  useUnifiedTopology: true
})

// Read Json Files
const restaurants = JSON.parse(fs.readFileSync(path.join(__dirname, "_data", "restaurants.json"), "utf-8"))
const users = JSON.parse(fs.readFileSync(path.join(__dirname, "_data", "users.json"), "utf-8"))
const items = JSON.parse(fs.readFileSync(path.join(__dirname, "_data", "items.json"), "utf-8"))

// Import Data
async function importData() {
  try {
    await Restaurant.create(restaurants)
    await User.create(users)
    await Item.create(items)
    console.log("Imported data".green.inverse)
    process.exit();
  } catch (err) {
    console.log(err)
  }
}

// Delete Data
async function deleteData() {
  try {
    await Restaurant.deleteMany()
    await User.deleteMany()
    await Item.deleteMany()
    console.log("Deleted data".red.inverse)
    process.exit();
  } catch (err) {
    console.log(err)
  }
}

if (process.argv[2] === "-i") {
  importData()
} 

else if (process.argv[2] === "-d") {
  deleteData()
}

else {
  process.exit()
}