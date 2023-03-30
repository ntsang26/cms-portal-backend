const bcrypt = require('bcryptjs');

module.exports = {


  friendlyName: 'Check hash',


  description: '',


  inputs: {
    text: { type: 'string', description: 'String to checking', required: true },
    hash: { type: 'string', description: 'String to compare', required: true }
  },


  exits: {

    success: {
      description: 'All done.',
    },

  },

  sync: true,
  fn: function (inputs) {
    return bcrypt.compareSync(inputs.text, inputs.hash);
  }
};

