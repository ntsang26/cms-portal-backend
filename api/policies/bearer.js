const moment = require('moment')
const _ = require('lodash')

module.exports = async (req, res, next) => {
  let auth = req.headers.authorization || `Bearer ${req.query.token}`
  try {
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.bearerAuthFail()
    }
    let tokenTemp = auth.split(' ')[1]
    let user = sails.helpers.jwt.verify(tokenTemp)
    // let token = await SToken.findOne({ token: tokenTemp })
    // if (!token) return res.bearerAuthFail()
    // if (moment().diff(moment(token.expiredAt), 'seconds') >= 0) return res.bearerAuthFail()
    // let user = await sails.models[constant.CLIENT_MAPPING[token.client]].findOne({
    //   where: { id: token.user },
    // })
    if (!user) return res.bearerAuthFail()
    if (user.status !== DUser.STATUS.ACTIVE) return res.invalidParams(CError.ACCOUNT_LOCKED)

    // check subdomain
    // if (user.client === 'user' || user.client === '') {
    //   let baseUrl = CConfig.get('THIRD_PARTY_AUTH').subConfigs.HOST_FE_DEVELOP.value
    //   if ((process.env.NODE_ENV || 'local') === 'local') {
    //     baseUrl = CConfig.get('THIRD_PARTY_AUTH').subConfigs.HOST_FE_LOCAL.value
    //   }
    //   let urlArr = baseUrl.split('//')
    //   let companyCf = await DCompanyConfig.find({ company: user.company }).limit(1)
    //   if (companyCf && companyCf.length !== 1) return res.invalidParams(CError.COMPANY_CONFIG_ERROR)
    //   companyCf = companyCf[0]
    //   req.companyConfig = companyCf
    //   // const SubDomain = companyCf.organizationDomain.split(".")[0]
    //   const url = urlArr[0] + '//' + companyCf.organizationDomain.split('.')[0] + '.' + urlArr[1]
    //   if (url) {
    //     req.subDomain = url
    //   }
    //   if (req.headers.origin.toLowerCase() !== url.toLowerCase()) {
    //     return res.status(401).json(CError.COMPANY_NOT_MATCH)
    //   }
    // }
    // if (!req.info) req.info = {}

    req.user = user
    // req.deviceId = token.deviceId
    req.user.client = user.client

    next()
  } catch (err) {
    log.logFile('Policy', 'bearerOfficer', err.message)
    return res.serverError()
  }
}
