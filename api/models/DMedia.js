module.exports = {
  attributes: {
    sid: { type: 'string', required: true, unique: true },
    url: { type: 'string', required: true, unique: true },
  },
}
