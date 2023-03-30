/**
 * 400 (Bad Request) Handler
 *
 * Usage:
 * return res.badRequest();
 * return res.badRequest(data);
 * return res.badRequest(data, 'some/specific/badRequest/view');
 *
 * e.g.:
 * ```
 * return res.badRequest(
 *   'Please choose a valid `password` (6-12 characters)',
 *   'trial/signup'
 * );
 * ```
 */


module.exports = function badRequest(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(201);

    // log.logFile('response', 'badRequest', 'Response !!!', {
    //     url: req.url, headers: {
    //         authorization: req.headers.authorization,
    //         'content-length': req.headers['content-length']
    //     }, body: Object.assign({}, req.body), resp: data ? Object.assign({ errorCode: 300 }, data) : CError.AUTH_FAIL
    // });
    console.log('response', 'badRequest', 'Response !!!', {
        url: req.url, headers: {
            authorization: req.headers.authorization,
            'content-length': req.headers['content-length']
        }, body: Object.assign({}, req.body), resp: data ? Object.assign({ errorCode: 300 }, data) : CError.AUTH_FAIL
    });
    if (!data) {
        return res.json(CError.AUTH_FAIL);
    }
    return res.json(Object.assign({ errorCode: 300 }, data));

};

