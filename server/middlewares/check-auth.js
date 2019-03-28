const jwt = require('jsonwebtoken')

const config = require('../config/config')
const log4jsLogger = require('../loggers/log4js_module')
const helper = require('../utility/helpers')
const errorCodes = require('../utility/errors')
const constants = require('../utility/constants')

const logger = log4jsLogger.getLogger('CHECK_AUTH')
const sendSuccess = helper.sendSuccess
const sendError = helper.sendError

module.exports = (req, res, next) => {
  try {
    // header: 
    // "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im5rdG9zbmlAZ21haWwuY29tIiwidXNlcklkIjoiNWMyODZjOTBhMzY1ZmYwNWJmZTY4ZWVkIiwiaWF0IjoxNTQ2MTYyMzE0LCJleHAiOjE1NDYxNjU5MTR9.pp00hOBV0u47BtAKzYJuvyxcCz_TkcQYnpqRucoAnbU"
    const token = req.headers.authorization.split(" ")[1];
    console.log("token " + token)
    const decoded = jwt.verify(token, config.jwtSecret);
    req.userData = decoded;
    next();
  } catch (error) {
    logger.error({
      "r": "check_auth",
      "method": 'post',
      "msg": error
    });
    return res.status(401).json({
      message: "Auth Failed here",
      error: error
    });
  }

}