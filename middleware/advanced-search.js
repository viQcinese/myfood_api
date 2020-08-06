// Advanced Search Middleware
const advancedSearch = (model, populate) => async (req, res, next) => {
  
  // Duplicate Url Query
  let reqQuery = { ...req.query }

  // Remove Mongo reserved words from Url Query parameters
  const removeFields = ["sort", "select", "limit", "page"]
  removeFields.forEach( field => delete reqQuery[field])

  // Build Mongo Operators 
  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  // Initialize Mongoose to Find Document
  let query = model.find(JSON.parse(queryStr))

  // Select Fields in Mongoose Query
  if (req.query.select) {
    const select = req.query.select.split(",").join(" ")
    query = query.select(select)
  }

  // Sort Fields in Mongoose Query
  if (req.query.sort) {
    const sort = req.query.sort.split(",").join(" ")
    query = query.sort(sort)
  } else {
    query = query.sort("-createdAt")
  }

  // Paginate Mongoose Query
  const page = parseInt(req.query.page) || 1
  const limit = parseInt(req.query.limit) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Populate Mongoose Query
  if (populate) {
    query = query.populate(populate)
  }

  // Execute Mongoose Query
  const results = await query

  // Build Pagination Results
  const pagination = {}

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  // Send Advanced Results to the next function as a Response parameter 
  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next()

}

module.exports = advancedSearch