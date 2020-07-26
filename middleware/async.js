const asyncHandler = originalFunction => (req, res, next) =>
  Promise
    .resolve(originalFunction(req, res, next))
    .catch(next)
  
module.exports = asyncHandler