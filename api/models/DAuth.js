/**
 * Auth.js
 *
 * @description :: A model definition represents a database table/collection.
 * @docs        :: https://sailsjs.com/docs/concepts/models-and-orm/models
 */

module.exports = {
    IDFORMAT: "0000000000",
    STATUS: {
        ACTIVE: "active",
    },
    attributes: {
        sid: { type: "string", required: true, unique: true },
        user: { type: "string", required: true, unique: true },
        password: { type: "string" },
        status: {
            type: "string",
            isIn: ["active", "logout", "pending", "inactive", "lockedOnDevice"],
            defaultsTo: "active",
        },
        username: { type: "string", unique: true },
        isDeleted: { type: "boolean", defaultsTo: false },
    }
};
createNewAuth = async (msg, data) => {
    try {
        let { user, password, username } = data;
        await DAuth.create({
            sid: modelHelper.generateDigitCode(10),
            user,
            username,
            password: password ? sails.helpers.common.hash(password) : "",
        });
    } catch (e) {
        console.log("error when create new auth => " + e.message);
    }
};
