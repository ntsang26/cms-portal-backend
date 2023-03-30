module.exports = function (req, res, next) {

  let { originalUrl } = req
  if (!originalUrl.startsWith("/oapi")) {
    return res.basicAuthFail();
  }


  let { session } = req.body
  if (session !== "sessionCanNotHack") {
    return res.basicAuthFail({ errorMsg: "Session invalid" });
  }

  try {

    originalUrl = originalUrl.split("/")
    if (originalUrl[originalUrl.length - 1] === "nric") {
      req.body = { ...req.body, idModel: "62c2483c8e89ac3d8402c149" }
      next();
    }

    else res.basicAuthFail();
  } catch (error) {
    console.log(error)
    res.basicAuthFail();
  }
};
