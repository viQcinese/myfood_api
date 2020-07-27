// NPM Packages
const express = require("express");
const dotenv = require("dotenv");
const path = require("path")
const colors = require("colors");

// Initialize Enviromental Variables
dotenv.config({ path: path.join(__dirname, "config", "config.env")})

// Load Database
const database = require(path.join(__dirname, "config", "database"))

// Initialize database
database()

// Load Routes
const restaurants = require(path.join(__dirname, "routes", "restaurants"))
const authorization = require(path.join(__dirname, "routes", "authorization"))

// Initialize Express
const app = express()

// Set Static Folder
app.use(express.static(path.join(__dirname, "public")))

// Set BodyParser
app.use(express.json())

// Mount routers
app.use("/api/v1/restaurants", restaurants)
app.use("/api/v1/authorization", authorization)

// Load ErrorHandler
const errorHandler = require(path.join(__dirname, "middleware", "error"))

// Set ErrorHandler
app.use(errorHandler)

// Run server
const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} on port ${PORT}...`.yellow.bold))