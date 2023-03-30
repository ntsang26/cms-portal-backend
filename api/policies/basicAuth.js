module.exports = function (req, res, next) {
  var auth = req.headers.authorization || `Basic ${req.query.token}`;
  if (!auth || !auth.startsWith("Basic ")) {
    return res.basicAuthFail();
  }

  var token = auth.split(" ")[1];
  try {
    if (token === CConfig.BASIC_TOKEN) next();
    else res.basicAuthFail();
  } catch (error) {
    res.basicAuthFail();
  }
};
