function paginationMiddleware(req, res, next) {
  let page = parseFloat(req.query.page);
  let pageSize = parseFloat(req.query.pageSize);
  let { orderBy, sortBy } = req.query;

  if (sortBy === undefined || orderBy === undefined) {
    req.query.sortBy = "id";
    req.query.orderBy = "asc";
  }
  page = (page - 1) * pageSize;

  req.query.page = page;
  req.query.pageSize = pageSize;
  next();
}

module.exports = paginationMiddleware;
