/**
 * DUserController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const moment = require('moment')
const bcrypt = require('bcryptjs');

module.exports = {
  login: async (req, res) => {
    try {
      let { username, password } = req.body
      if (!username || !password) return res.invalidParams(CError.USERNAME_PASSWORD_INVALID)
      let auth = await DAuth.findOne({ username: username })
      if (!auth) return res.invalidParams(CError.USERNAME_PASSWORD_INVALID)
      let userInfo = await DUser.findOne({ where: { sid: auth.user } })
      if (!userInfo) return res.invalidParams(CError.USERNAME_PASSWORD_INVALID)
      if (
        !sails.helpers.common.checkHash.with({
          text: password,
          hash: auth.password,
        })
      )
        return res.invalidParams(CError.USERNAME_PASSWORD_INVALID)
      // check version portal

      //create token
      delete auth.password
      const { TOKEN_EXPIRE, TOKEN_EXPIRE_UNIT } = CConfig.get('TOKEN_CONFIG').subConfigs
      let token = sails.helpers.jwt.sign.with({
        user: userInfo,
        time: TOKEN_EXPIRE.value,
        unit: TOKEN_EXPIRE_UNIT.value,
      })

      return res.success({
        errorCode: 0,
        message: sails.__('Login successfully'),
        data: {
          userInfo: userInfo,
          token,
          expiredAt: moment()
            .add(CConfig.TOKEN_CONFIG.TOKEN_EXPIRE, CConfig.TOKEN_CONFIG.EXPIRE_UNIT)
            .valueOf(),
        },
      })
    } catch (error) {
      console.log(error)
      return res.serverError()
    }
  },
  getUser: async (req, res) => {
    try {
      let { sid } = req.body
      let user = await DUser.findOne({ sid })
      return res.success({ data: user })
    } catch (error) {
      console.log(error)
      return res.serverError()
    }
  },
  createUser: async (req, res) => {
    try {
      let { context = {} } = req.body
      let pageSid = req.param('pageSid')
      const model = await SPage.find({})
      const { attributes } = model
      // context.sid = sails.services.modelhelper.generateDigitCode(16)
      // context.createdBy = req.user.sid
      // let username = String(context.name).toLowerCase().replace(/\s/g, "")
      // let password = await bcrypt.hashSync('123456', 10)
      // await DAuth.create({
      //   sid: sails.services.modelhelper.generateDigitCode(16),
      //   user: context.sid,
      //   username,
      //   password,
      // })
      // let user = await DUser.create(context)
      // return res.success({ data: user })
    } catch (error) {
      console.log(error)
      return res.serverError()
    }
  },
  updateUser: async (req, res) => {
    try {
      let { context = {} } = req.body
      let { sid, name, email, currentPassword, newPassword, confirmPassword } = context
      if (currentPassword && newPassword && confirmPassword) {
        let auth = await DAuth.findOne({ user: sid })
        let compare = bcrypt.compareSync(currentPassword, auth.password)
        if (compare) {
          let hashNew = bcrypt.hashSync(newPassword, 10)
          await DAuth.update({ user: sid }).set({ password: hashNew })
        } else {
          return res.json({
            errorCode: 1,
            errorMsg: "Current password is incorrect!"
          })
        }
      }
      if (!name || !email || !sid) return res.invalidParams()
      let user = await DUser.update({ sid }).set({
        name,
        email,
        updatedBy: req.user.sid,
        updatedAt: new Date(),
      })
      return res.success({ data: user })
    } catch (error) {
      console.log(error)
      return res.serverError()
    }
  }
}
