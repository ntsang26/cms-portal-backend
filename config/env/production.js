/**
 * Development environment settings
 *
 * This file can include shared settings for a development team,
 * such as API keys or remote database passwords.  If you're using
 * a version control solution for your Sails app, this file will
 * be committed to your repository unless you add it to your .gitignore
 * file.  If your repository will be publicly viewable, don't add
 * any private information to this file!
 *
 */

module.exports = {
    /***************************************************************************
     * Set the default database connection for models in the development       *
     * environment (see config/connections.js and config/models.js )           *
     ***************************************************************************/

    datastores: {
        CMS_PORTAL_BACKEND: {
            adapter: "sails-mongo",
            url: "mongodb://admin:K6x8l4zuO9oECV3I@cluster0-shard-00-00.xf9kp.mongodb.net:27017,cluster0-shard-00-02.xf9kp.mongodb.net:27017,cluster0-shard-00-01.xf9kp.mongodb.net:27017/jits-ai-portal?ssl=true&replicaSet=atlas-n7f728-shard-0&readPreference=primary&connectTimeoutMS=10000&authSource=admin&authMechanism=SCRAM-SHA-1",
            // url: "mongodb://admin:K6x8l4zuO9oECV3I@cluster0.xf9kp.mongodb.net:27017/jits-ai-portal",
        },
    },

    port: 1339,
    hookTimeout: 600000000,
    TIME_ONLINE: 600000,
};
