const jwt = require('jsonwebtoken'),
  moment = require('moment')

module.exports = {
  friendlyName: 'Verify',

  description: 'Verify jwt.',

  inputs: {
    token: { type: 'string', description: 'token verify', required: true },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  sync: true,
  fn: function (inputs, exits) {
    let { token } = inputs
    try {
      const secret = CConfig.get('TOKEN_CONFIG').subConfigs.JWT_SECRET.value
      let decoded = jwt.verify(token, secret)
      if (moment().isBefore(moment(decoded.expiredAt).toDate())) {
        return exits.success(decoded.user)
      } else {
        throw new Error(CError.TOKEN_EXPIRED)
      }
    } catch (err) {
      throw new Error(CError.TOKEN_EXPIRED)
    }
  },
}
