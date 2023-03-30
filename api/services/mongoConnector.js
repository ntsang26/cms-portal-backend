var MongoClient = require('mongodb').MongoClient
var client = null;
var session = null;

let connect = async function () {
    client = new MongoClient(sails.getDatastore('CMS_PORTAL_BACKEND').config.url, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        writeConcern: { w: 'majority', wtimeout: 5000, numberOfRetries: 5 }
    });
    await client.connect();
}

let getSession = function () {
    session = client.startSession({
        defaultTransactionOptions: {
            causalConsistency: true,
            readConcern: { level: 'snapshot' },
            writeConcern: { w: 'majority' },
            readPreference: 'primary',
            retryWrites: true
        }
    });
    return session;
}

let getClient = function () {
    return client;

}

let startTransaction = async (actionFunc) => {
    let dbSession = getSession();
    try {
        await dbSession.withTransaction(async function () {
            return await actionFunc(dbSession);
        })
    } catch (e) {
        return e;
    }
    return null;
}


module.exports = {
    connect, getSession, getClient, startTransaction
}
