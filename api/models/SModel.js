module.exports = {
  attributes: {
    sid: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true, unique: true, maxLength: 255 },
    collection: { type: 'string', required: true, unique: true },
    attributes: { type: 'json' },
  },
}
