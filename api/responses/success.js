/**
 * 200 (OK) Response
 *
 * Usage:
 * return res.ok();
 * return res.ok(data);
 * return res.ok(data, 'auth/login');
 *
 * @param  {Object} data
 * @param  {String|Object} options
 *          - pass string to render specified view
 */

module.exports = function sendOK(data, options) {

    // Get access to `req`, `res`, & `sails`
    var req = this.req;
    var res = this.res;
    var sails = req._sails;

    sails.log.silly('res.ok() :: Sending 200 ("OK") response');

    res.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');

    // Set status code
    res.status(200);

    // log.logFile('response', 'ok', 'Response !!!', {
    //     url: req.url, headers: {
    //         authorization: req.headers.authorization,
    //         'content-length': req.headers['content-length']
    //     }, body: Object.assign({}, req.body), resp: data ? Object.assign({ err: 200 }, data) : CError.SUCCESS
    // });
    if (!data) {
        return res.json(CError.SUCCESS);
    }
    return res.json(Object.assign({ errorCode: 0, errorMsg: "Success" }, data));

};
