// NPM Packages
const express = require("express");
const dotenv = require("dotenv");
const path = require("path")
const colors = require("colors");
const cookieParser = require("cookie-parser")
const helmet = require("helmet")
const xss = require("xss-clean")
const mongoSanitize = require("express-mongo-sanitize");
const expressMongoSanitize = require("express-mongo-sanitize")
const hpp = require("hpp")
const cors = require("cors")
const rateLimit = require("express-rate-limit")

// Initialize Enviromental Variables
dotenv.config({ path: path.join(__dirname, "config", "config.env")})

// Load Database
const database = require(path.join(__dirname, "config", "database"))

// Initialize database
database()

// Load Routes
const restaurants = require(path.join(__dirname, "routes", "restaurants"))
const authentication = require(path.join(__dirname, "routes", "authentication"))
const users = require(path.join(__dirname, "routes", "users"))
const items = require(path.join(__dirname, "routes", "items"))
const reviews = require(path.join(__dirname, "routes", "reviews"))

// Initialize Express
const app = express()

// Set Request Rate Limit
const limiter = rateLimit({
  windowMs: 1000 * 60 * 10, // 10 mins
  max: 100 // max requests
})

app.use(limiter)

// Set Cookie Parser
app.use(cookieParser())

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")))

// Set BodyParser
app.use(express.json())

// Set Mongoose Data Sanitizer
app.use(expressMongoSanitize())

// Set Security Headers
app.use(helmet())

// Set XSS Prevention
app.use(xss())

// Enable CORS
app.use(cors())

// Set HPP Prevention
app.use(hpp())

// Mount routers
app.use("/api/v1/restaurants", restaurants)
app.use("/api/v1/auth", authentication)
app.use("/api/v1/users", users)
app.use("/api/v1/items", items)
app.use("/api/v1/reviews", reviews)

// Load ErrorHandler
const errorHandler = require(path.join(__dirname, "middleware", "error"))

// Set ErrorHandler
app.use(errorHandler)

// Handle Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log(`${err.name}:`.red)
  console.log(`${err.message}`)
  console.log(err)
})

// Run server
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}...`.yellow.bold))