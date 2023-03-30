/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */
const requestIp = require('request-ip')
const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
module.exports.http = {
  /****************************************************************************
   *                                                                           *
   * Sails/Express middleware to run for every HTTP request.                   *
   * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
   *                                                                           *
   * https://sailsjs.com/documentation/concepts/middleware                     *
   *                                                                           *
   ****************************************************************************/
  middleware: {
    customMiddleware: require('express')().use(
      '/upload',
      require('express')['static'](path.join(__dirname, '../upload'))
    ),

    /***************************************************************************
     *                                                                          *
     * The order in which middleware should be run for HTTP requests.           *
     * (This Sails app's routes are handled by the "router" middleware below.)  *
     *                                                                          *
     ***************************************************************************/

    order: [
      'expressFileUpload',
      'customMiddleware',
      'staticUpload',
      'dontServeClient',
      'getIp',
      'session',
      'bodyParser',
      'compress',
      'logApiCall',
      'poweredBy',
      'router',
      'www',
      'favicon',
    ],
    getIp: function (req, res, next) {
      const clientIp = requestIp.getClientIp(req)
      req.clientIp = clientIp
      return next()
    },

    logApiCall: function (req, res, next) {
      if (req.url != '/') console.log('Requested :: ', req.method, req.url, req.body)

      return next()
    },
    staticUpload: express.static(process.cwd() + '/upload'),

    dontServeClient: function (req, res, next) {
      let requestAccepted = true
      if (!requestAccepted)
        return res.json({
          errorCode: 500,
          errorMsg: 'The server is under maintenance',
        })
      else next()
    },
    /***************************************************************************
     *                                                                          *
     * The body parser that will handle incoming multipart HTTP requests.       *
     *                                                                          *
     * https://sailsjs.com/config/http#?customizing-the-body-parser             *
     *                                                                          *
     ***************************************************************************/

    bodyParser: (function _configureBodyParser() {
      var skipper = require('skipper')
      var middlewareFn = skipper({
        strict: true,
        maxTimeToBuffer: 10000,
        limit: '20mb',
      })
      return middlewareFn
    })(),
    expressFileUpload: fileUpload(),
  },
}
