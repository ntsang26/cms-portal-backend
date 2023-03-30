module.exports = async (req, res, next) => {
  try {
    let nextApiKey = constant.nextApiKey;
    let secretApiKey = req.headers['authorization']
    secretApiKey = secretApiKey.split(" ")[1]

    if (secretApiKey) {
      if (secretApiKey !== nextApiKey) return res.forbidden()
      return next()
    }
    return res.forbidden()
  } catch (error) {
    log.logFile('Policy', 'publicPage', err.message)
    return res.serverError()
  }
}