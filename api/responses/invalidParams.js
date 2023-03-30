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
 * return res.invalidParams(

 *   'trial/signup'
 * );
 * ```
 */


module.exports = function invalidParams(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(200);

    // log.logFile('response', 'invalidParams', 'Response !!!', {
    //     url: req.url, headers: {
    //         authorization: req.headers.authorization,
    //         'content-length': req.headers['content-length']
    //     }, body: Object.assign({}, req.body), resp: data ? Object.assign({ errorCode: 1 }, data) : CError.INVALID_PARAMETER
    // });
    if (!data) {
        return res.json(CError.INVALID_PARAMETER);
    }
    return res.json(Object.assign({ errorCode: 405 }, data));

};

