module.exports = function notFound(data) {
  var res = this.res

  res.status(404)

  return res.json({ ...CError.NOT_FOUND, ...data })
}
