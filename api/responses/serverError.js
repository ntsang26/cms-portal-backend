/**
 * 500 (Server Error) Response
 *
 * Usage:
 * return res.serverError();
 * return res.serverError(err);
 * return res.serverError(err, 'some/specific/error/view');
 *
 * NOTE:
 * If something throws in a policy or controller, or an internal
 * error is encountered, Sails will call `res.serverError()`
 * automatically.
 */


module.exports = function serverError(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    // Set status code
    res.status(200);

    // log.logFile('response', 'serverError', 'Response !!!', {
    //     url: req.url, headers: {
    //         authorization: req.headers.authorization,
    //         'content-length': req.headers['content-length']
    //     }, body: Object.assign({}, req.body), resp: data ? Object.assign({ errorCode: 500 }, data) : CError.SYSTEM_ERROR
    // });
    if (!data) {
        return res.json(CError.SYSTEM_ERROR);
    }
    return res.json(Object.assign({ errorCode: 500 }, CError.SYSTEM_ERROR, data));

};

