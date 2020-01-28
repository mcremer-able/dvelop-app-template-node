'use strict';

module.exports = requestId;

const uuidv4 = require('uuid/v4');

const reqIdHeader = "x-dv-request-id";

function requestId(req, res, next) {
    req.requestId = req.get(reqIdHeader) || uuidv4();
    next();
}
