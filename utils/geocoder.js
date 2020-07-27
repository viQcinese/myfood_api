const nodeGeocoder = require("node-geocoder")

const geocoder = nodeGeocoder({
  provider: process.env.GEOCODER_API_PROVIDER,
  apiKey: process.env.GEOCODER_API_KEY,
  httpAdapter: "https",
  formatter: null
})

module.exports = geocoder