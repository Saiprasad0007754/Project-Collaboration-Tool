/**
 * Parses pagination query params and returns Mongoose-friendly
 * skip/limit values along with metadata for the response.
 * @param {object} query - req.query
 * @param {object} defaults
 */
const getPagination = (query, defaults = { page: 1, limit: 20, maxLimit: 100 }) => {
  let page = parseInt(query.page, 10) || defaults.page;
  let limit = parseInt(query.limit, 10) || defaults.limit;

  if (page < 1) page = 1;
  if (limit < 1) limit = defaults.limit;
  if (limit > defaults.maxLimit) limit = defaults.maxLimit;

  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

/**
 * Builds a standardized pagination metadata object for responses.
 */
const buildPaginationMeta = ({ page, limit, totalCount }) => ({
  page,
  limit,
  totalCount,
  totalPages: Math.ceil(totalCount / limit) || 1,
  hasNextPage: page * limit < totalCount,
  hasPrevPage: page > 1,
});

module.exports = { getPagination, buildPaginationMeta };
