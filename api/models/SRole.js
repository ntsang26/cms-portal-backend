module.exports = {
  attributes: {
    sid: { type: 'string', unique: true, required: true },
    name: { type: 'string', unique: true, required: true },
    permission: { type: 'json' },
  },
}
