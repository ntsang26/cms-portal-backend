/**
 * SToken.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

const moment = require('moment')

module.exports = {
  STATUS: {
    TEMP: 'register',
    ACCESS: 'active',
    RESET_PWD: 'reset',
  },
  CHANNEL: {
    ADMIN: 'admin',
  },
  attributes: {
    token: { type: 'string', required: true },
    client: { type: 'string', required: true },
    user: { type: 'string', required: true },
    expiredAt: { type: 'ref', required: true, columnType: 'datetime' },
    status: { type: 'string', isIn: ['register', 'active', 'reset'], defaultsTo: 'access' }, // register,  access,  reset pasword
    stringData: { type: 'json' },
  },
  bootstrap: async () => {
    removeTokenExpired()
  },

  createNewToken: (opts) => {
    return new Promise((resolve, reject) => {
      let { user, client, deviceId, status, channel, expiredAt, ip } = opts
      channel = channel || constant.CHANNEL_APPLICATION.WEBSITE
      let token = sails.services.auth.createTokenString()
      let nameToken = channel
        ? `${client.toUpperCase()}_${channel.toUpperCase()}`
        : `${client.toUpperCase()}`
      let tokenExpired = CConfig.get('TOKEN_CONFIG')
        ? CConfig.get('TOKEN_CONFIG').subConfigs.TOKEN_EXPIRE.value
        : constant.TOKEN_EXPIRE
      let unit = CConfig.get('TOKEN_CONFIG')
        ? CConfig.get('TOKEN_CONFIG').subConfigs.TOKEN_EXPIRY_UNIT.value
        : constant.TOKEN_EXPIRY_UNIT
      expiredAt = expiredAt ? expiredAt : moment().add(tokenExpired, unit).toDate()
      let input = {
        token,
        expiredAt,
        ip,
        user,
        client,
        deviceId,
        channel: channel ? channel : constant.CHANNEL_APPLICATION.WEBSITE,
      }
      if (status == SToken.STATUS.TEMP || status == SToken.STATUS.RESET_PWD) {
        input.status = status
        input.expiredAt = moment()
          .add(
            CConfig.get('TOKEN_CONFIG').subConfigs.TOKEN_EXPIRE.value,
            CConfig.get('TOKEN_CONFIG').subConfigs.TOKEN_EXPIRY_UNIT.value
          )
          .toDate()
      }
      SToken.create(input).then(
        (token) => {
          resolve(token)
        },
        (err) => {
          reject(err)
        }
      )
    })
  },
  createNewTokenForgotPassword: (opts) => {
    let tokenExpired = CConfig.get('TOKEN_CONFIG')
      ? CConfig.get('TOKEN_CONFIG').subConfigs.TOKEN_EXPIRE_FORGOT_PASSWORD.value
      : constant.TOKEN_EXPIRE
    let unit = CConfig.get('TOKEN_CONFIG')
      ? CConfig.get('TOKEN_CONFIG').subConfigs.TOKEN_EXPIRY_UNIT.value
      : constant.TOKEN_EXPIRY_UNIT
    let expiredAt = moment().add(tokenExpired, unit).toDate()
    return SToken.createNewToken({ ...opts, expiredAt })
  },
}

function removeTokenExpired() {
  setInterval(() => {
    SToken.destroy({ expiredAt: { '<=': new Date() } }).then((rs) => {})
  }, 60000)
}
