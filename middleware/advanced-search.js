const advancedSearch = (model, populate) => async (req, res, next) => {
  
  let reqQuery = { ...req.query }

  // Remove Mongo reserved words from Find parameters
  const removeFields = ["sort", "select", "limit", "page"]
  removeFields.forEach( field => delete reqQuery[field])

  // Build Mongo Operators 
  let queryStr = JSON.stringify(reqQuery)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)

  // Initialize Mongoose Query
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

  // Pagination
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

  // Pagination Results
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

  res.advancedResults = {
    success: true,
    count: results.length,
    pagination,
    data: results
  }

  next()

}

module.exports = advancedSearch