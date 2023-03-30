/**
 * DUser.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
  STATUS: {
    PENDING: 'pending',
    ACTIVE: 'active',
    LOCKED: 'locked',
  },
  attributes: {
    sid: { type: 'string', required: true },
    name: { type: 'string', required: true },
    email: { type: 'string', required: true },
    client: { type: 'string', isIn: ["employee","admin"], defaultsTo: "employee" },
    role: { type: 'string' },
    status: { type: 'string', isIn: ['pending', 'active', 'locked'], defaultsTo: 'active' },
    createdBy: { type: 'json' },
    updatedBy: { type: 'json' },
    avatar: {type: 'string'}
  },
}
