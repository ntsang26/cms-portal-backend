module.exports = {
  attributes: {
    sid: { type: 'string', required: true, unique: true },
    name: { type: 'string', required: true, maxLength: 255 },
    desc: { type: 'string', maxLength: 255 },
    form: { type: 'json', columnType: 'array' },
    schema: { type: 'json', columnType: 'array' },
    buttons: { type: 'json', columnType: 'array' },
    read: { type: 'string', maxLength: 255 },
    apis: { type: 'json', columnType: 'array' },
    grid: { type: 'json', columnType: 'array' },
    client: { type: 'string' },
    company: { type: 'string' },
  },
}
