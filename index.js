'use strict';

var ip = require('ip');

/**
 * req.userIp will contain the client ip
 *   searching the leftmost x-forwarded-for non private ip (rfc 1918)
 *
 * should work :
 *  - locally (dev env)
 *  - heroku direct call
 *  - behind fastly
 *  - behind hw
 * @param options
 * @returns {Function}
 */
module.exports = function (options) {
  return function (req, res, next) {
    req.userIp = (req.get('x-forwarded-for') || '')
        .split(',')
        // trim spaces
        .map(function (i) { return i.replace(/^\s+|\s+$/g, ''); })
        // remove private ip
        .filter(function (i) { return ip.isPublic(i); })
        // leftmost x-forwarded-for or req.ip
        .shift() || req.ip;
    //
    next();
  };
};