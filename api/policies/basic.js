// using

module.exports = async function (req, res, next) {

    var auth = req.headers.authorization || `Basic ${req.query.token}`;
    if (!auth || !auth.startsWith('Basic ')) {
        return res.bearerAuthFail();
    }

    let temp = {}
    temp.token = auth.split(" ")[1];
    temp.clients = Object.keys(SClient.cache).map(key => SClient.cache[key]);
    if (SClient.cache && temp.clients.length > 0) {
        temp.findClient = temp.clients.find(i => i.token == temp.token)
        if (temp.findClient) {
            if (!req.info) req.info = {};
            req.info.client = temp.findClient.name
            return next();
        } else
            return res.bearerAuthFail();

    } else {
        SClient.findOne({ token }).then(client => {
            if (!client)
                return res.bearerAuthFail();
            if (!req.info) req.info = {};
            req.info.client = client.name
            next();
        })
    }
};


