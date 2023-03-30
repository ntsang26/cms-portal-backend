const jwt = require('jsonwebtoken'),
  moment = require('moment')

module.exports = {
  friendlyName: 'Sign',

  description: 'Sign jwt.',

  inputs: {
    user: { type: 'ref', description: 'user information', required: true },
    time: { type: 'number', description: 'Time', defaultsTo: 4320 },
    unit: {
      type: 'string',
      description: 'hour, minutes, second',
      defaultsTo: 'hour',
    },
  },

  exits: {
    success: {
      description: 'All done.',
    },
  },

  sync: true,

  fn: function (inputs, exits) {
    try {
      let { user, time, unit } = inputs
      let input = {
        user,
        createdAt: moment().toDate(),
        expiredAt: moment().add(time, unit).toDate(),
      }
      let token = jwt.sign(input, CConfig.get('TOKEN_CONFIG').subConfigs.JWT_SECRET.value)
      exits.success(token)
    } catch (err) {
      console.log(err)
    }
  },
}
